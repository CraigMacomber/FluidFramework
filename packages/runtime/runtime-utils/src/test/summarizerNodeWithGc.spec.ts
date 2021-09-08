/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { strict as assert } from "assert";
import { TelemetryNullLogger } from "@fluidframework/common-utils";
import { cloneGCData } from "@fluidframework/garbage-collector";
import { SummaryType } from "@fluidframework/protocol-definitions";
import {
    CreateSummarizerNodeSource,
    IGarbageCollectionData,
    IGarbageCollectionSummaryDetails,
    ISummarizeInternalResult,
    ISummarizerNodeWithGC,
    SummarizeInternalFn,
} from "@fluidframework/runtime-definitions";
// eslint-disable-next-line import/no-internal-modules
import { createRootSummarizerNodeWithGC, IRootSummarizerNodeWithGC } from "../summarizerNode/summarizerNodeWithGc";
import { mergeStats } from "../summaryUtils";

describe("SummarizerNodeWithGC Tests", () => {
    const summarizerNodeId = "testNode";
    const node1Id = "/gcNode1";
    const node2Id = "/gcNode2";
    const subNode1Id = "/gcNode1/subNode";
    const subNode2Id = "/gcNode2/subNode";

    let internalGCData: IGarbageCollectionData;
    let initialGCSummaryDetails: IGarbageCollectionSummaryDetails;
    let rootSummarizerNode: IRootSummarizerNodeWithGC;
    let summarizerNode: ISummarizerNodeWithGC;

    beforeEach(async () => {
        rootSummarizerNode = createRootSummarizerNodeWithGC(
            new TelemetryNullLogger(),
            (() => undefined) as unknown as SummarizeInternalFn,
            0,
            0);
        rootSummarizerNode.startSummary(0, new TelemetryNullLogger());

        summarizerNode = rootSummarizerNode.createChild(
            summarizeInternal,
            summarizerNodeId,
            { type: CreateSummarizerNodeSource.FromSummary },
            undefined,
            getInternalGCData,
            getinitialGCSummaryDetails,
        );

        // Initialize the values to be returned by getInternalGCData.
        internalGCData = {
            gcNodes: {
                "/": [ node1Id, node2Id ],
                "/gcNode1": [ subNode1Id ],
            },
        };

        // Initialize the values to be returned by getinitialGCSummaryDetails.
        initialGCSummaryDetails = {
            usedRoutes: [],
        };
    });

    async function summarizeInternal(fullTree: boolean, trackState: boolean): Promise<ISummarizeInternalResult> {
        const stats = mergeStats();
        stats.treeNodeCount++;
        return {
            summary: {
                type: SummaryType.Tree,
                tree: {},
            },
            stats,
            id: summarizerNodeId,
        };
    }

    const getInternalGCData = async (): Promise<IGarbageCollectionData> => internalGCData;
    const getinitialGCSummaryDetails = async (): Promise<IGarbageCollectionSummaryDetails> => initialGCSummaryDetails;

    describe("getGCData API", () => {
        it("fails when function to get GC data is not provided", async () => {
            // Root sumamrizer node does not have the function to get GC data. Trying to get GC data from it should
            // fail.
            let failed = false;
            try {
                await rootSummarizerNode.getGCData();
            } catch {
                failed = true;
            }
            assert(failed, "Getting GC data should have failed");
        });

        it("can return GC data when data has changed since last summary", async () => {
            // Invalidate the summarizer node to force it to generate GC data and not use cached value.
            summarizerNode.invalidate(10);

            const gcData = await summarizerNode.getGCData();
            assert.deepStrictEqual(gcData, internalGCData, "GC data should be generated by calling getInternalGCData");
        });

        it("can return initial GC data when nothing has changed since last summary", async () => {
            // Set the data to be returned by getinitialGCSummaryDetails.
            initialGCSummaryDetails = {
                usedRoutes: [""],
                gcData: {
                    gcNodes: {
                        "/": [ node1Id ],
                        "gcNode1": [ "/" ],
                        "gcNode2": [ subNode1Id, subNode2Id ],
                    },
                },
            };

            // We did not invalidate the summarizer node, so it will get the initial GC data because nothing changed
            // since last summary.
            const gcData = await summarizerNode.getGCData();
            assert.deepStrictEqual(gcData, initialGCSummaryDetails.gcData, "Initial GC data should have been returned");
        });

        it("can return GC data when initial GC data is not available", async () => {
            // Set initial GC data to undefined. This will force the summarizer node to generate GC data even though
            // nothing changed since last summary.
            initialGCSummaryDetails = {
                usedRoutes: [""],
                gcData: undefined,
            };

            const gcData = await summarizerNode.getGCData();
            assert.deepStrictEqual(gcData, internalGCData, "GC data should be generated by calling getInternalGCData");
        });

        it("can return cached GC data", async () => {
            // Set initial GC data to undefined. This will force the summarizer node to generate GC data even though
            // nothing changed since last summary.
            initialGCSummaryDetails = {
                usedRoutes: [""],
                gcData: undefined,
            };

            let gcData = await summarizerNode.getGCData();
            assert.deepStrictEqual(gcData, internalGCData, "GC data should be generated by calling getInternalGCData");

            // Make a clone of the GC data returned above because we are about to change it.
            const cachedGCData = cloneGCData(gcData);

            // Add a new node to the GC data returned by getInternalGCData to make it different from cachedGCData above.
            // This will validate that the data returned by getGCData is not internalGCData.
            internalGCData.gcNodes[subNode1Id] = [ "/", subNode2Id ];

            // Since nothing changed since last summary, summarizer node should return the data from the previous run.
            gcData = await summarizerNode.getGCData();
            assert.deepStrictEqual(gcData, cachedGCData, "GC data from previous run should be returned");
        });

        it("can generate GC data when nothing changed but fullGC flag is true", async () => {
            // Set initial GC data to undefined. This will force the summarizer node to generate GC data even though
            // nothing changed since last summary.
            initialGCSummaryDetails = {
                usedRoutes: [""],
                gcData: undefined,
            };

            let gcData = await summarizerNode.getGCData();
            assert.deepStrictEqual(gcData, internalGCData, "GC data should be generated by calling getInternalGCData");

            // Add a new node to the GC data returned by getInternalGCData to make it different from before.
            // This will validate that the data returned by getGCData is the new internalGCData.
            internalGCData.gcNodes[subNode1Id] = [ "/", subNode2Id ];

            // Call getGCData() with fullGC = true. Even though nothing changed since last summary, this will force the
            // summarizer node to generate GC data by calling getInternalGCData.
            gcData = await summarizerNode.getGCData(true /* fullGC */);
            assert.deepStrictEqual(gcData, internalGCData, "GC data should be generated by calling getInternalGCData");
        });
    });

    describe("summarize API", () => {
        it("should not allow summarizing without running GC first", async () => {
            // Since GC is enabled, calling summarize without running GC (updating used routes) should result in
            // an assert being thrown.
            await assert.rejects(
                summarizerNode.summarize(true /* fullTree */),
                "summarize should have thrown since GC was run");
        });

        it("should allow summarizing after running GC", async () => {
            // Update the used routes which emulates running GC.
            summarizerNode.updateUsedRoutes([""]);
            // Summarize should not throw since GC was run before.
            await assert.doesNotReject(
                summarizerNode.summarize(true /* fullTree */),
                "summarize should not have thrown an error since GC was run",
            );
        });
    });
});
