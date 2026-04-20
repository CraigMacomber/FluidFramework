/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import type { ContainerExtensionStore } from "@fluidframework/container-runtime-definitions/internal";
import type { FluidContainerAttached } from "@fluidframework/runtime-definitions/internal";
import { UsageError } from "@fluidframework/telemetry-utils/internal";

import { OdspServiceContainer } from "./odspService.js";

/**
 * Gets the {@link @fluidframework/container-runtime-definitions#ContainerExtensionStore} from a Fluid container
 * created via {@link createOdspServiceClient}.
 *
 * @remarks
 * Use this to access extensions such as presence:
 * ```typescript
 * import { getPresenceViaExtensionStore } from "@fluidframework/presence/internal";
 * const presence = getPresenceViaExtensionStore(getOdspContainerExtensionStore(container));
 * ```
 *
 * @internal
 */
export function getOdspContainerExtensionStore(
	container: FluidContainerAttached,
): ContainerExtensionStore {
	if (!(container instanceof OdspServiceContainer)) {
		throw new UsageError(
			"Container was not created by createOdspServiceClient. Only containers created by createOdspServiceClient are supported.",
		);
	}
	return (container.container as unknown as { runtime: ContainerExtensionStore }).runtime;
}
