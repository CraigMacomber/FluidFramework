/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import type { IAudience } from "@fluidframework/container-definitions/internal";
import type { FluidContainerAttached } from "@fluidframework/runtime-definitions/internal";
import { UsageError } from "@fluidframework/telemetry-utils/internal";

import { EphemeralServiceContainer } from "./localService.js";

/**
 * Gets the {@link @fluidframework/container-definitions#IAudience} from a Fluid container created via
 * {@link createEphemeralServiceClient}.
 *
 * @alpha
 */
export function getLocalContainerAudience(container: FluidContainerAttached): IAudience {
	if (!(container instanceof EphemeralServiceContainer)) {
		throw new UsageError(
			"Container was not created by createEphemeralServiceClient. Only containers created by createEphemeralServiceClient are supported.",
		);
	}
	return container.container.audience;
}
