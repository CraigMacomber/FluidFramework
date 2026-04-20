/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import type {
	IAudience,
	ICodeDetailsLoader,
	IContainer,
	IContainerContext,
	IFluidCodeDetails,
	IFluidCodeDetailsComparer,
	IFluidModuleWithDetails,
	IRuntime,
	IRuntimeFactory,
} from "@fluidframework/container-definitions/internal";
import {
	createDetachedContainer,
	loadExistingContainer,
} from "@fluidframework/container-loader/internal";
import { ContainerRuntime } from "@fluidframework/container-runtime/internal";
import type { IContainerRuntime } from "@fluidframework/container-runtime-definitions/internal";
import type { FluidObject } from "@fluidframework/core-interfaces";
import { assert } from "@fluidframework/core-utils/internal";
import type { IUrlResolver } from "@fluidframework/driver-definitions/internal";
import { RouterliciousDocumentServiceFactory } from "@fluidframework/routerlicious-driver/internal";
import type {
	DataStoreKey,
	DataStoreKind,
	DataStoreRegistry,
	FluidContainerAttached,
	FluidContainerWithService,
	FluidDataStoreRegistryEntry,
	IFluidDataStoreRegistry,
	MinimumVersionForCollab,
	Registry,
	ServiceClient,
	ServiceOptions,
} from "@fluidframework/runtime-definitions/internal";
import {
	basicKey,
	DataStoreKindImplementation,
	registryLookup,
	ServiceContainerBase,
} from "@fluidframework/runtime-definitions/internal";
import {
	UsageError,
	wrapConfigProviderWithDefaults,
} from "@fluidframework/telemetry-utils/internal";

import { InsecureTinyliciousTokenProvider } from "./insecureTinyliciousTokenProvider.js";
import {
	createInsecureTinyliciousTestUrlResolver,
	createTinyliciousCreateNewRequest,
	InsecureTinyliciousUrlResolver,
} from "./insecureTinyliciousUrlResolver.js";

const defaultMinVersionForCollab: MinimumVersionForCollab = "2.0.0";
const defaultServiceOptions: ServiceOptions = {
	minVersionForCollab: defaultMinVersionForCollab,
};

/**
 * Options for configuring a {@link createTinyliciousServiceClient}.
 * @alpha
 */
export interface TinyliciousServiceOptions extends ServiceOptions {
	/**
	 * The port tinylicious is listening on. Defaults to 7070.
	 */
	readonly port?: number;
	/**
	 * The endpoint tinylicious is listening on. Defaults to "http://localhost".
	 * In GitHub Codespaces, use the forwarded URL for the tinylicious port.
	 */
	readonly endpoint?: string;
}

/**
 * Creates a {@link @fluidframework/runtime-definitions#ServiceClient} backed by a local tinylicious server.
 *
 * @remarks
 * Requires a tinylicious server to be running (e.g. `pnpm tinylicious`).
 * Unlike {@link @fluidframework/local-driver#createEphemeralServiceClient}, this client persists containers
 * and supports real multi-process collaboration.
 *
 * @alpha
 */
export function createTinyliciousServiceClient(
	options: TinyliciousServiceOptions = defaultServiceOptions,
): ServiceClient {
	return new TinyliciousServiceClientImpl(options);
}

const rootDataStoreId = "root";

class TinyliciousServiceClientImpl implements ServiceClient {
	public constructor(private readonly options: TinyliciousServiceOptions) {}

	public createContainer<T>(root: DataStoreKind<T>): Promise<FluidContainerWithService<T>>;

	public createContainer<T>(
		root: DataStoreKey<T>,
		registry: Registry<Promise<DataStoreKind>>,
	): Promise<FluidContainerWithService<T>>;

	public async createContainer<T>(
		root: DataStoreKey<T> | DataStoreKind<T>,
		registry?: Registry<Promise<DataStoreKind<T>>>,
	): Promise<FluidContainerWithService<T>> {
		if (registry === undefined) {
			DataStoreKindImplementation.narrowGeneric(root);
			return TinyliciousServiceContainer.createDetached(
				normalizeRegistry(root),
				this.options,
				root,
			);
		} else {
			const result = await registryLookup(registry, root);
			return TinyliciousServiceContainer.createDetached(registry, this.options, result);
		}
	}

	public async loadContainer<T>(
		id: string,
		root: DataStoreKind<T> | Registry<Promise<DataStoreKind<T>>>,
	): Promise<FluidContainerAttached<T>> {
		return TinyliciousServiceContainer.load(normalizeRegistry(root), this.options, id);
	}
}

function convertRegistry<T>(registry: DataStoreRegistry<T>): IFluidDataStoreRegistry {
	return {
		async get(name: string): Promise<FluidDataStoreRegistryEntry | undefined> {
			const dataStoreKind = await registryLookup(registry, basicKey(name));
			DataStoreKindImplementation.narrowGeneric(dataStoreKind);
			return dataStoreKind;
		},
		get IFluidDataStoreRegistry(): IFluidDataStoreRegistry {
			return this;
		},
	};
}

function makeCodeLoader<T>(
	registry: DataStoreRegistry<T>,
	minVersionForCollab: MinimumVersionForCollab,
	root?: DataStoreKind<T>,
): ICodeDetailsLoader {
	const fluidExport: IRuntimeFactory & IFluidCodeDetailsComparer = {
		async instantiateRuntime(
			context: IContainerContext,
			existing: boolean,
		): Promise<IRuntime> {
			const provideEntryPoint = async (
				entryPointRuntime: IContainerRuntime,
			): Promise<T & FluidObject> => {
				const data = await entryPointRuntime.getAliasedDataStoreEntryPoint(rootDataStoreId);
				if (data === undefined) {
					throw new Error("Root data store missing!");
				}
				const rootDataStore = await data.get();
				return rootDataStore as T & FluidObject;
			};

			const { runtime } = await ContainerRuntime.loadRuntime2({
				context,
				registry: convertRegistry(registry),
				provideEntryPoint,
				existing,
				minVersionForCollab,
				runtimeOptions: { enableRuntimeIdCompressor: "on" },
			});

			if (!existing) {
				assert(root !== undefined, "Root data store kind must be provided for new containers");
				const dataStore = await runtime.createDataStore(root.type);
				const aliasResult = await dataStore.trySetAlias(rootDataStoreId);
				assert(aliasResult === "Success", "Should be able to set alias on new data store");
			}

			return runtime;
		},

		async satisfies(
			candidate: IFluidCodeDetails,
			constraint: IFluidCodeDetails,
		): Promise<boolean> {
			return true;
		},

		async compare(a: IFluidCodeDetails, b: IFluidCodeDetails): Promise<number | undefined> {
			return 0;
		},

		get IRuntimeFactory(): IRuntimeFactory {
			return fluidExport;
		},

		get IFluidCodeDetailsComparer(): IFluidCodeDetailsComparer {
			return fluidExport;
		},
	};

	return {
		load: async (details: IFluidCodeDetails): Promise<IFluidModuleWithDetails> => {
			return { module: { fluidExport }, details };
		},
	};
}

function makeContainerLoaderOptions(options: TinyliciousServiceOptions): {
	urlResolver: IUrlResolver;
	documentServiceFactory: RouterliciousDocumentServiceFactory;
	clientDetailsOverride: { capabilities: { interactive: boolean } };
	configProvider: ReturnType<typeof wrapConfigProviderWithDefaults>;
} {
	const tokenProvider = new InsecureTinyliciousTokenProvider();
	const urlResolver =
		options.port === undefined && options.endpoint === undefined
			? createInsecureTinyliciousTestUrlResolver()
			: new InsecureTinyliciousUrlResolver(options.port, options.endpoint);
	const documentServiceFactory = new RouterliciousDocumentServiceFactory(tokenProvider);

	return {
		urlResolver,
		documentServiceFactory,
		clientDetailsOverride: { capabilities: { interactive: true } },
		configProvider: wrapConfigProviderWithDefaults(undefined, {
			"Fluid.Container.ForceWriteConnection": true,
		}),
	};
}

/**
 * A Fluid container backed by tinylicious, implementing {@link @fluidframework/runtime-definitions#FluidContainerWithService}.
 * @internal
 */
export class TinyliciousServiceContainer<TData>
	extends ServiceContainerBase<TData>
	implements FluidContainerWithService<TData>
{
	public static async createDetached<T>(
		registry: DataStoreRegistry<T>,
		options: TinyliciousServiceOptions,
		root: DataStoreKind<T>,
	): Promise<TinyliciousServiceContainer<T>> {
		const loaderOptions = makeContainerLoaderOptions(options);
		const minVersionForCollab = options.minVersionForCollab ?? defaultMinVersionForCollab;

		const container: IContainer = await createDetachedContainer({
			codeDetails: { package: "no-dynamic-package", config: {} },
			codeLoader: makeCodeLoader(registry, minVersionForCollab, root),
			...loaderOptions,
		});

		return new TinyliciousServiceContainer<T>(
			registry,
			options,
			container,
			(await container.getEntryPoint()) as T,
			undefined,
		);
	}

	public static async load<T>(
		registry: DataStoreRegistry<T>,
		options: TinyliciousServiceOptions,
		id: string,
	): Promise<TinyliciousServiceContainer<T> & FluidContainerAttached<T>> {
		const loaderOptions = makeContainerLoaderOptions(options);
		const minVersionForCollab = options.minVersionForCollab ?? defaultMinVersionForCollab;

		const containerInner = await loadExistingContainer({
			request: { url: id },
			codeLoader: makeCodeLoader(registry, minVersionForCollab),
			...loaderOptions,
		});

		const serviceContainer = new TinyliciousServiceContainer<T>(
			registry,
			options,
			containerInner,
			(await containerInner.getEntryPoint()) as T,
			id,
		);
		assert(serviceContainer.id !== undefined, "id should be defined when loading a container");
		return serviceContainer as typeof serviceContainer & { id: string };
	}

	private constructor(
		public readonly registry: Registry<Promise<DataStoreKind<TData>>>,
		public readonly options: TinyliciousServiceOptions,
		public readonly container: IContainer,
		public readonly data: TData,
		public id: string | undefined,
	) {
		super();
	}

	public get audience(): IAudience {
		return this.container.audience;
	}

	public async createDataStore<T>(key: DataStoreKey<T>): Promise<T> {
		const kind = await registryLookup(this.registry, key);
		DataStoreKindImplementation.narrowGeneric(kind);

		const containerRuntime = (this.container as unknown as { runtime: ContainerRuntime })
			.runtime;
		const context = containerRuntime.createDetachedDataStore([kind.type]);
		const channel = await kind.instantiateDataStore(context, false);
		const dataStore = await context.attachRuntime(kind, channel);
		const entryPoint = await dataStore.entryPoint.get();
		return entryPoint as T;
	}

	public async attach(): Promise<FluidContainerAttached<TData>> {
		if (this.id !== undefined) {
			throw new UsageError("Container already attached");
		}

		await this.container.attach(createTinyliciousCreateNewRequest());

		if (this.container.resolvedUrl === undefined) {
			throw new Error("Resolved Url unexpectedly missing!");
		}
		this.id = this.container.resolvedUrl.id;

		return this as typeof this & { id: string };
	}
}

function normalizeRegistry<T>(
	input: DataStoreKind<T> | Registry<Promise<DataStoreKind<T>>>,
): Registry<Promise<DataStoreKind<T>>> {
	if (DataStoreKindImplementation.guard(input)) {
		const x = input;
		return async () => x;
	}
	assert(typeof input === "function", "Registry must be a function");
	return input;
}
