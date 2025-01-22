/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import assert from "assert";
import { v4 as uuid } from "uuid";
import { SinonSpiedInstance, restore, spy } from "sinon";
import { Provider } from "nconf";
import { RedisOptions } from "ioredis-mock";
import {
	IWholeFlatSummary,
	LatestSummaryId,
	NetworkError,
	isNetworkError,
} from "@fluidframework/server-services-client";
import { ISummaryTestMode } from "./utils";
import {
	GitWholeSummaryManager,
	IFileSystemManagerFactory,
	IFileSystemPromises,
	IRepositoryManager,
	IsomorphicGitManagerFactory,
	MemFsManagerFactory,
	RedisFsManagerFactory,
	checkSoftDeleted,
	type IRepoManagerParams,
} from "../utils";
import { NullExternalStorageManager } from "../externalStorageManager";
import { ISummaryWriteFeatureFlags } from "../utils/wholeSummary";
import { RedisFs } from "../utils/redisFs/redisFsManager";
import {
	sampleChannelSummaryUpload,
	sampleContainerSummaryUpload,
	sampleContainerSummaryResponse,
	sampleInitialSummaryResponse,
	sampleInitialSummaryUpload,
	sampleChannelSummaryResult,
} from "./examples";
import {
	StorageAccessCallCounts,
	checkFullStorageAccessBaselinePerformance,
	checkInitialWriteStorageAccessBaselinePerformance,
} from "./storageAccess";
import {
	ElaborateFirstChannelPayload,
	ElaborateFirstChannelResult,
	ElaborateFirstContainerPayload,
	ElaborateFirstContainerResult,
	ElaborateFirstServiceContainerPayload,
	ElaborateFirstServiceContainerResult,
	ElaborateInitialPayload,
	ElaborateInitialResult,
	ElaborateSecondChannelPayload,
	ElaborateSecondChannelResult,
	ElaborateSecondContainerPayload,
	ElaborateSecondContainerResult,
} from "./examples2";
import { TestRedisClientConnectionManager } from "@fluidframework/server-test-utils";

// Github Copilot wizardry.
function permuteFlags(obj: Record<string, boolean>): Record<string, boolean>[] {
	const keys = Object.keys(obj);
	const permutations: Record<string, boolean>[] = [];
	for (let i = 0; i < Math.pow(2, keys.length); i++) {
		const permutation: Record<string, boolean> = {};
		for (let j = 0; j < keys.length; j++) {
			permutation[keys[j]] = (i & (1 << j)) !== 0;
		}
		permutations.push(permutation);
	}
	return permutations;
}

function replaceTestShas<T>(obj: T, shasToReplacements: { sha: string; replacement: string }[]): T {
	let result: string = JSON.stringify(obj);
	for (const { sha, replacement } of shasToReplacements) {
		result = result.replaceAll(sha, replacement);
	}
	return JSON.parse(result);
}

function assertEqualSummaries(
	actual: IWholeFlatSummary,
	expected: IWholeFlatSummary,
	message?: string | Error,
) {
	// We cannot compare the container sha because it is generated by a commit which takes timestamp into account.
	// We also cannot compare the root tree sha because low-io write alters how the root tree is stored.
	assert.strictEqual(
		JSON.stringify(
			{
				...actual,
				id: "test-commit-sha",
				trees: [{ ...actual.trees[0], id: "test-tree-sha" }],
			},
			null,
			2,
		),
		JSON.stringify(
			{
				...expected,
				id: "test-commit-sha",
				trees: [{ ...expected.trees[0], id: "test-tree-sha" }],
			},
			null,
			2,
		),
		message,
	);
}
const testModes = permuteFlags({
	repoPerDocEnabled: false,
	enableLowIoWrite: false,
	enableOptimizedInitialSummary: false,
	enableSlimGitInit: false,
}) as unknown as ISummaryTestMode[];

type GitFileSystem = "memfs" | "redisfs" | "hashmap-redisfs";

const getFsManagerFactory = (
	fileSystem: GitFileSystem,
): {
	fsManagerFactory: IFileSystemManagerFactory;
	getFsSpy: () => SinonSpiedInstance<IFileSystemPromises>;
	fsCleanup: () => Promise<void>;
	fsCheckSizeBytes: () => Promise<number>;
} => {
	if (fileSystem === "memfs") {
		const memfsManagerFactory = new MemFsManagerFactory();
		return {
			fsManagerFactory: memfsManagerFactory,
			getFsSpy: () => spy(memfsManagerFactory.volume as unknown as IFileSystemPromises),
			fsCheckSizeBytes: async () =>
				JSON.stringify(Object.values(memfsManagerFactory.volume.toJSON()).join()).length,
			fsCleanup: async () => {
				memfsManagerFactory.volume.reset();
			},
		};
	}
	if (fileSystem === "redisfs" || fileSystem === "hashmap-redisfs") {
		const redisConfig = new Provider({}).use("memory").defaults({
			git: {
				enableRedisFsMetrics: false,
				enableHashmapRedisFs: fileSystem === "hashmap-redisfs",
				redisApiMetricsSamplingPeriod: 0,
			},
			redis: {
				host: "localhost",
				port: 6379,
				connectTimeout: 10000,
				maxRetriesPerRequest: 20,
				enableAutoPipelining: false,
				enableOfflineQueue: true,
				keyExpireAfterSeconds: 60 * 60, // 1 hour
			},
		});
		const redisOptions: RedisOptions = {
			host: "localhost",
			port: 6379,
			connectTimeout: 10000,
			maxRetriesPerRequest: 20,
			enableAutoPipelining: false,
			enableOfflineQueue: true,
		};
		const testRedisClientConnectionManager = new TestRedisClientConnectionManager(redisOptions);
		const redisfsManagerFactory = new RedisFsManagerFactory(
			redisConfig,
			testRedisClientConnectionManager,
		);
		// Internally, this will create a new RedisFs instance that is shared across all `create` calls.
		const redisFsManager = redisfsManagerFactory.create();
		// This is the RedisFs instance that is shared across all `create` calls. It is a static instance.
		const redisFs = redisFsManager.promises;
		return {
			fsManagerFactory: redisfsManagerFactory,
			getFsSpy: () => spy(redisFs),
			fsCheckSizeBytes: async () => {
				const redisClient = (redisFs as RedisFs).redisFsClient;
				const keys = await redisClient.keysByPrefix("");
				const getPs: Promise<unknown>[] = [];
				for (const key of keys) {
					getPs.push(redisClient.get(key).then((value) => JSON.stringify(value)));
				}
				return JSON.stringify((await Promise.all(getPs)).join()).length;
			},
			fsCleanup: async () => {
				const redisClient = (redisFs as RedisFs).redisFsClient;
				await redisClient.delAll("");
			},
		};
	}
	throw new Error(`Unknown file system ${fileSystem}`);
};

const testFileSystems: GitFileSystem[] = ["memfs", "redisfs", "hashmap-redisfs"];
testFileSystems.forEach((fileSystem) => {
	const { fsManagerFactory, fsCleanup, fsCheckSizeBytes, getFsSpy } =
		getFsManagerFactory(fileSystem);
	testModes.forEach((testMode) => {
		describe(`Summaries (${JSON.stringify({ fileSystem, ...testMode })})`, () => {
			const tenantId = "gitrest-summaries-test-tenantId";
			let documentId: string;
			let repoManager: IRepositoryManager;
			const getWholeSummaryManager = (
				featureFlagOverrides?: Partial<ISummaryWriteFeatureFlags>,
			) => {
				// Always create a new WholeSummaryManager to reset internal caches.
				return new GitWholeSummaryManager(
					documentId,
					repoManager,
					{ documentId, tenantId },
					false /* externalStorageEnabled */,
					{
						enableLowIoWrite: testMode.enableLowIoWrite,
						optimizeForInitialSummary: testMode.enableOptimizedInitialSummary,
						...featureFlagOverrides,
					},
				);
			};
			let fsSpy: SinonSpiedInstance<IFileSystemPromises>;
			const getCurrentStorageAccessCallCounts = (): StorageAccessCallCounts & {
				[fn: string]: number;
			} => ({
				readFile: fsSpy.readFile.callCount,
				writeFile: fsSpy.writeFile.callCount,
				mkdir: fsSpy.mkdir.callCount,
				stat: fsSpy.stat.callCount,
			});
			beforeEach(async () => {
				documentId = uuid();
				// Spy on memfs volume to record number of calls to storage.
				fsSpy = getFsSpy();
				const repoManagerFactory = new IsomorphicGitManagerFactory(
					{
						useRepoOwner: true,
						baseDir: `/${uuid()}/tmp`,
					},
					{
						defaultFileSystemManagerFactory: fsManagerFactory,
					},
					new NullExternalStorageManager(),
					testMode.repoPerDocEnabled,
					false /* enableRepositoryManagerMetrics */,
					testMode.enableSlimGitInit,
					undefined /* apiMetricsSamplingPeriod */,
				);
				repoManager = await repoManagerFactory.create({
					repoOwner: tenantId,
					repoName: documentId,
					storageRoutingId: { tenantId, documentId },
				});
			});

			afterEach(async () => {
				// Reset storage volume after each test.
				await fsCleanup();
				// Reset Sinon spies after each test.
				restore();
			});

			// Test standard summary flow and storage access frequency.
			it("Can create and read an initial summary and a subsequent incremental summary", async () => {
				const initialWriteResponse = await getWholeSummaryManager().writeSummary(
					sampleInitialSummaryUpload,
					true,
				);
				assert.strictEqual(
					initialWriteResponse.isNew,
					true,
					"Initial summary write `isNew` should be `true`.",
				);
				assertEqualSummaries(
					initialWriteResponse.writeSummaryResponse as IWholeFlatSummary,
					sampleInitialSummaryResponse,
					"Initial summary write response should match expected response.",
				);

				if (fileSystem === "memfs") {
					checkInitialWriteStorageAccessBaselinePerformance(
						testMode,
						getCurrentStorageAccessCallCounts(),
					);
				}

				const initialReadResponse =
					await getWholeSummaryManager().readSummary(LatestSummaryId);
				assertEqualSummaries(
					initialReadResponse,
					sampleInitialSummaryResponse,
					"Initial summary read response should match expected response.",
				);

				const channelWriteResponse = await getWholeSummaryManager().writeSummary(
					sampleChannelSummaryUpload,
					false,
				);
				assert.strictEqual(
					channelWriteResponse.isNew,
					false,
					"Channel summary write `isNew` should be `false`.",
				);

				// Latest should still be the initial summary.
				const postChannelReadResponse =
					await getWholeSummaryManager().readSummary(LatestSummaryId);
				assertEqualSummaries(
					postChannelReadResponse,
					sampleInitialSummaryResponse,
					"Channel summary read response should match expected initial container summary response.",
				);

				const containerWriteResponse = await getWholeSummaryManager().writeSummary(
					// Replace the referenced channel summary with the one we just wrote.
					// This matters when low-io write is enabled, because it alters how the tree is stored.
					replaceTestShas(sampleContainerSummaryUpload, [
						{
							sha: sampleChannelSummaryResult.id,
							replacement: channelWriteResponse.writeSummaryResponse.id,
						},
					]),
					false,
				);
				assert.strictEqual(
					containerWriteResponse.isNew,
					false,
					"Container summary write `isNew` should be `false`.",
				);
				assertEqualSummaries(
					containerWriteResponse.writeSummaryResponse as IWholeFlatSummary,
					sampleContainerSummaryResponse,
					"Container summary write response should match expected response.",
				);

				const containerReadResponse =
					await getWholeSummaryManager().readSummary(LatestSummaryId);
				assertEqualSummaries(
					containerReadResponse,
					sampleContainerSummaryResponse,
					"Container summary read response should match expected response.",
				);

				// And we should still be able to read the initial summary when referenced by ID.
				const initialLaterReadResponse = await getWholeSummaryManager().readSummary(
					initialWriteResponse.writeSummaryResponse.id,
				);
				assertEqualSummaries(
					initialLaterReadResponse,
					sampleInitialSummaryResponse,
					"Later initial summary read response should match expected initial summary response.",
				);

				if (fileSystem === "memfs") {
					checkFullStorageAccessBaselinePerformance(
						testMode,
						getCurrentStorageAccessCallCounts(),
					);
					// Tests run against commit 7620034bac63c5e3c4cb85f666a41c46012e8a49 on Dec 13, 2023
					// showed that the final storage size was 13kb, or 23kb for low-io mode where summary blobs are not shared.
					// When updating docker base image, a size of 24kb was observed.
					const finalStorageSizeKb = Math.ceil((await fsCheckSizeBytes()) / 1_024);
					const expectedMaxStorageSizeKb = testMode.enableLowIoWrite ? 24 : 13;
					process.stdout.write(
						`Final storage size: ${finalStorageSizeKb}kb; expected: ${expectedMaxStorageSizeKb}\n`,
					);
					assert(
						finalStorageSizeKb <= expectedMaxStorageSizeKb,
						`Storage size should be <= ${expectedMaxStorageSizeKb}kb. Got ${finalStorageSizeKb}`,
					);
				}
			});

			/**
			 * This tests a more elaborate flow:
			 * 1. Create a new document
			 * 2. Send some ops
			 * 3. Wait until Client Summary is written
			 * 4. Disconnect, triggering new service summary
			 * 5. Send some ops
			 * 6. Wait until Client Summary is written
			 */
			it("Can create and read multiple summaries", async () => {
				const initialWriteResponse = await getWholeSummaryManager().writeSummary(
					ElaborateInitialPayload,
					true,
				);
				assert.strictEqual(
					initialWriteResponse.isNew,
					true,
					"Initial summary write `isNew` should be `true`.",
				);
				assertEqualSummaries(
					initialWriteResponse.writeSummaryResponse as IWholeFlatSummary,
					ElaborateInitialResult,
					"Initial summary write response should match expected response.",
				);

				const initialReadResponse =
					await getWholeSummaryManager().readSummary(LatestSummaryId);
				assertEqualSummaries(
					initialReadResponse,
					ElaborateInitialResult,
					"Initial summary read response should match expected response.",
				);

				const firstChannelWriteResponse = await getWholeSummaryManager().writeSummary(
					ElaborateFirstChannelPayload,
					false,
				);
				assert.strictEqual(
					firstChannelWriteResponse.isNew,
					false,
					"Channel summary write `isNew` should be `false`.",
				);

				// Latest should still be the initial summary.
				const postFirstChannelReadResponse =
					await getWholeSummaryManager().readSummary(LatestSummaryId);
				assertEqualSummaries(
					postFirstChannelReadResponse,
					ElaborateInitialResult,
					"Channel summary read response should match expected initial container summary response.",
				);

				const firstContainerWriteResponse = await getWholeSummaryManager().writeSummary(
					// Replace the referenced channel summary with the one we just wrote.
					// This matters when low-io write is enabled, because it alters how the tree is stored.
					replaceTestShas(ElaborateFirstContainerPayload, [
						{
							sha: ElaborateFirstChannelResult.id,
							replacement: firstChannelWriteResponse.writeSummaryResponse.id,
						},
					]),
					false,
				);
				assert.strictEqual(
					firstContainerWriteResponse.isNew,
					false,
					"Container summary write `isNew` should be `false`.",
				);
				assertEqualSummaries(
					firstContainerWriteResponse.writeSummaryResponse as IWholeFlatSummary,
					ElaborateFirstContainerResult,
					"Container summary write response should match expected response.",
				);

				const firstContainerReadResponse =
					await getWholeSummaryManager().readSummary(LatestSummaryId);
				assertEqualSummaries(
					firstContainerReadResponse,
					ElaborateFirstContainerResult,
					"Container summary read response should match expected response.",
				);

				// And we should still be able to read the initial summary when referenced by ID.
				const initialLaterReadResponse = await getWholeSummaryManager().readSummary(
					initialWriteResponse.writeSummaryResponse.id,
				);
				assertEqualSummaries(
					initialLaterReadResponse,
					ElaborateInitialResult,
					"Later initial summary read response should match expected initial summary response.",
				);

				const firstServiceContainerWriteResponse =
					await getWholeSummaryManager().writeSummary(
						// Replace the referenced channel summary with the one we just wrote.
						// This matters when low-io write is enabled, because it alters how the tree is stored.
						replaceTestShas(ElaborateFirstServiceContainerPayload, [
							{
								sha: ElaborateFirstContainerResult.id,
								replacement: firstContainerWriteResponse.writeSummaryResponse.id,
							},
						]),
						false,
					);
				assert.strictEqual(
					firstServiceContainerWriteResponse.isNew,
					false,
					"Container summary write `isNew` should be `false`.",
				);
				assertEqualSummaries(
					firstServiceContainerWriteResponse.writeSummaryResponse as IWholeFlatSummary,
					ElaborateFirstServiceContainerResult,
					"Container summary write response should match expected response.",
				);
				const firstServiceContainerReadResponse =
					await getWholeSummaryManager().readSummary(LatestSummaryId);
				assertEqualSummaries(
					firstServiceContainerReadResponse,
					ElaborateFirstServiceContainerResult,
					"Container summary read response should match expected response.",
				);

				const secondChannelWriteResponse = await getWholeSummaryManager().writeSummary(
					// Replace the referenced container summary with the one we just wrote.
					replaceTestShas(ElaborateSecondChannelPayload, [
						{
							sha: ElaborateFirstContainerResult.id,
							replacement: firstContainerWriteResponse.writeSummaryResponse.id,
						},
					]),
					false,
				);
				assert.strictEqual(
					secondChannelWriteResponse.isNew,
					false,
					"Channel summary write `isNew` should be `false`.",
				);

				// Latest should still be the initial summary.
				const postSecondChannelReadResponse =
					await getWholeSummaryManager().readSummary(LatestSummaryId);
				assertEqualSummaries(
					postSecondChannelReadResponse,
					ElaborateFirstServiceContainerResult,
					"Channel summary read response should match expected initial container summary response.",
				);

				const secondContainerWriteResponse = await getWholeSummaryManager().writeSummary(
					// Replace the referenced channel summary with the one we just wrote.
					// This matters when low-io write is enabled, because it alters how the tree is stored.
					replaceTestShas(ElaborateSecondContainerPayload, [
						{
							sha: ElaborateFirstContainerResult.id,
							replacement: firstContainerWriteResponse.writeSummaryResponse.id,
						},
						{
							sha: ElaborateSecondChannelResult.id,
							replacement: secondChannelWriteResponse.writeSummaryResponse.id,
						},
					]),
					false,
				);
				assert.strictEqual(
					secondContainerWriteResponse.isNew,
					false,
					"Container summary write `isNew` should be `false`.",
				);
				assertEqualSummaries(
					secondContainerWriteResponse.writeSummaryResponse as IWholeFlatSummary,
					ElaborateSecondContainerResult,
					"Container summary write response should match expected response.",
				);

				const secondContainerReadResponse =
					await getWholeSummaryManager().readSummary(LatestSummaryId);
				assertEqualSummaries(
					secondContainerReadResponse,
					ElaborateSecondContainerResult,
					"Container summary read response should match expected response.",
				);
			});

			if (testMode.repoPerDocEnabled) {
				/**
				 * Test that we can write an initial summary, read it, then delete the document's summary data.
				 * Validates that after deletion we cannot read and subsequent delete attempts are no-ops, not errors.
				 */
				it("Can hard-delete a document's summary data", async () => {
					// Write and validate initial summary.
					const initialWriteResponse = await getWholeSummaryManager().writeSummary(
						ElaborateInitialPayload,
						true,
					);
					assert.strictEqual(
						initialWriteResponse.isNew,
						true,
						"Initial summary write `isNew` should be `true`.",
					);
					assertEqualSummaries(
						initialWriteResponse.writeSummaryResponse as IWholeFlatSummary,
						ElaborateInitialResult,
						"Initial summary write response should match expected response.",
					);
					const initialReadResponse =
						await getWholeSummaryManager().readSummary(LatestSummaryId);
					assertEqualSummaries(
						initialReadResponse,
						ElaborateInitialResult,
						"Initial summary read response should match expected response.",
					);

					// Delete document.
					const fsManager = fsManagerFactory.create({
						rootDir: repoManager.path,
					});
					await getWholeSummaryManager().deleteSummary(fsManager, false /* softDelete */);
					// Validate that we cannot read the summary.
					await assert.rejects(
						async () => getWholeSummaryManager().readSummary(LatestSummaryId),
						(thrown) => isNetworkError(thrown) && thrown.code === 404,
						"Reading a deleted summary should throw an 404 error.",
					);
					// Validate that we can delete the summary again.
					assert.doesNotReject(
						async () =>
							getWholeSummaryManager().deleteSummary(
								fsManager,
								false /* softDelete */,
							),
						"Deleting a deleted summary should not throw an error.",
					);
				});

				/**
				 * Test that we can write an initial summary, read it, then delete the document's summary data.
				 * Validates that after deletion we cannot read and subsequent delete attempts are no-ops, not errors.
				 */
				it("Can soft-delete a document's summary data", async () => {
					// Write and validate initial summary.
					const initialWriteResponse = await getWholeSummaryManager().writeSummary(
						ElaborateInitialPayload,
						true,
					);
					assert.strictEqual(
						initialWriteResponse.isNew,
						true,
						"Initial summary write `isNew` should be `true`.",
					);
					assertEqualSummaries(
						initialWriteResponse.writeSummaryResponse as IWholeFlatSummary,
						ElaborateInitialResult,
						"Initial summary write response should match expected response.",
					);
					const initialReadResponse =
						await getWholeSummaryManager().readSummary(LatestSummaryId);
					assertEqualSummaries(
						initialReadResponse,
						ElaborateInitialResult,
						"Initial summary read response should match expected response.",
					);

					// Delete document.
					const fsManager = fsManagerFactory.create({
						rootDir: repoManager.path,
					});
					await getWholeSummaryManager().deleteSummary(fsManager, true /* softDelete */);
					// Validate that soft-deletion flag is detected.
					assert.rejects(
						async () =>
							checkSoftDeleted(
								fsManager,
								repoManager.path,
								// only used for telemetry
								{} as unknown as IRepoManagerParams,
								testMode.repoPerDocEnabled,
							),
						(thrown) => isNetworkError(thrown) && (thrown as NetworkError).code === 410,
						"CheckSoftDeleted on deleted document should throw 410.",
					);
					// Validate that we can hard-delete the soft-deleted summary.
					assert.doesNotReject(
						async () =>
							getWholeSummaryManager().deleteSummary(
								fsManager,
								false /* softDelete */,
							),
						"Deleting a deleted summary should not throw an error.",
					);
					await assert.rejects(
						async () => getWholeSummaryManager().readSummary(LatestSummaryId),
						(thrown) => isNetworkError(thrown) && thrown.code === 404,
						"Reading a deleted summary should throw an 404 error.",
					);
				});
			}

			// Test cross-compat between low-io and non-low-io write modes for same summary.
			[true, false].forEach((enableLowIoWrite) => {
				it(`Can read from and write to an initial summary stored ${
					enableLowIoWrite ? "with" : "without"
				} low-io write`, async () => {
					await getWholeSummaryManager({
						enableLowIoWrite,
					}).writeSummary(sampleInitialSummaryUpload, true);

					const initialReadResponse =
						await getWholeSummaryManager().readSummary(LatestSummaryId);
					assertEqualSummaries(
						initialReadResponse,
						sampleInitialSummaryResponse,
						"Initial summary read response should match expected response.",
					);
					const channelWriteResponse = await getWholeSummaryManager().writeSummary(
						sampleChannelSummaryUpload,
						false,
					);
					const containerWriteResponse = await getWholeSummaryManager().writeSummary(
						// Replace the referenced channel summary with the one we just wrote.
						// This matters when low-io write is enabled, because it alters how the tree is stored.
						JSON.parse(
							JSON.stringify(sampleContainerSummaryUpload).replace(
								sampleChannelSummaryResult.id,
								channelWriteResponse.writeSummaryResponse.id,
							),
						),
						false,
					);
					assert.strictEqual(
						containerWriteResponse.isNew,
						false,
						"Container summary write `isNew` should be `false`.",
					);
					assertEqualSummaries(
						containerWriteResponse.writeSummaryResponse as IWholeFlatSummary,
						sampleContainerSummaryResponse,
						"Container summary write response should match expected response.",
					);
				});

				it(`Can read an incremental summary stored ${
					enableLowIoWrite ? "with" : "without"
				} low-io write`, async () => {
					await getWholeSummaryManager({
						enableLowIoWrite,
					}).writeSummary(sampleInitialSummaryUpload, true);
					const channelWriteResponse = await getWholeSummaryManager({
						enableLowIoWrite,
					}).writeSummary(sampleChannelSummaryUpload, false);
					const containerWriteResponse = await getWholeSummaryManager({
						enableLowIoWrite,
					}).writeSummary(
						// Replace the referenced channel summary with the one we just wrote.
						// This matters when low-io write is enabled, because it alters how the tree is stored.
						JSON.parse(
							JSON.stringify(sampleContainerSummaryUpload).replace(
								sampleChannelSummaryResult.id,
								channelWriteResponse.writeSummaryResponse.id,
							),
						),
						false,
					);

					const latestContainerReadResponse =
						await getWholeSummaryManager().readSummary(LatestSummaryId);
					assertEqualSummaries(
						latestContainerReadResponse,
						sampleContainerSummaryResponse,
						"Latest container summary read response should match expected response.",
					);

					// And we should still be able to read the initial summary when referenced by ID.
					const shaContainerReadResponse = await getWholeSummaryManager().readSummary(
						containerWriteResponse.writeSummaryResponse.id,
					);
					assertEqualSummaries(
						shaContainerReadResponse,
						sampleContainerSummaryResponse,
						"Sha container summary read response should match expected response.",
					);
				});
			});
		});
	});
});
