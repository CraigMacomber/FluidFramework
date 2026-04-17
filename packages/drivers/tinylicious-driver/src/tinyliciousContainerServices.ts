/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import type { IAudience } from "@fluidframework/container-definitions/internal";
import type { ContainerExtensionStore } from "@fluidframework/container-runtime-definitions/internal";
import type { FluidContainerAttached } from "@fluidframework/runtime-definitions/internal";
import { UsageError } from "@fluidframework/telemetry-utils/internal";

import { TinyliciousServiceContainer } from "./tinyliciousService.js";

/**
 * Gets the {@link @fluidframework/container-definitions#IAudience} from a Fluid container created via
 * {@link createTinyliciousServiceClient}.
 *
 * @alpha
 */
export function getTinyliciousContainerAudience(container: FluidContainerAttached): IAudience {
	if (!(container instanceof TinyliciousServiceContainer)) {
		throw new UsageError(
			"Container was not created by createTinyliciousServiceClient. Only containers created by createTinyliciousServiceClient are supported.",
		);
	}
	return container.container.audience;
}

/**
 * Gets the {@link @fluidframework/container-runtime-definitions#ContainerExtensionStore} from a Fluid container
 * created via {@link createTinyliciousServiceClient}.
 *
 * @remarks
 * Use this to access extensions such as presence:
 * ```typescript
 * import { getPresenceViaExtensionStore } from "@fluidframework/presence/internal";
 * const presence = getPresenceViaExtensionStore(getTinyliciousContainerExtensionStore(container));
 * ```
 *
 * @internal
 */
export function getTinyliciousContainerExtensionStore(
	container: FluidContainerAttached,
): ContainerExtensionStore {
	if (!(container instanceof TinyliciousServiceContainer)) {
		throw new UsageError(
			"Container was not created by createTinyliciousServiceClient. Only containers created by createTinyliciousServiceClient are supported.",
		);
	}
	return (container.container as unknown as { runtime: ContainerExtensionStore }).runtime;
}
