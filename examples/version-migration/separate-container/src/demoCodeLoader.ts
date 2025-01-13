/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

/*
 * For this demo, the two "packages" are imported from the local directory.  In a more realistic scenario, these are
 * probably either:
 * 1. Installed from some published location but still statically bundled, maybe something like this in package.json:
 *        "inventory-list-1": "npm:inventory-list@^1.0.0"
 *        "inventory-list-2": "npm:inventory-list@^2.0.0"
 * 2. Dynamically fetched from some CDN at runtime and not included as part of the bundle at all.
 */
import type {
	ICodeDetailsLoader,
	IFluidCodeDetails,
	IFluidModuleWithDetails,
} from "@fluidframework/container-definitions/legacy";

import { InventoryListContainerRuntimeFactory as InventoryListContainerRuntimeFactory1 } from "./modelVersion1/index.js";
import { InventoryListContainerRuntimeFactory as InventoryListContainerRuntimeFactory2 } from "./modelVersion2/index.js";

// This ICodeDetailsLoader specifically supports versions one and two.  Other approaches might have network calls to
// dynamically load in the appropriate code for unknown versions.
export class DemoCodeLoader implements ICodeDetailsLoader {
	/**
	 * Code loader for the demo. Supports a test mode which spawns the summarizer instantly.
	 * @param testMode - True to enable instant summarizer spawning.
	 */
	public constructor(private readonly testMode = false) {}
	public async load(source: IFluidCodeDetails): Promise<IFluidModuleWithDetails> {
		const version = source.package;
		if (typeof version !== "string") {
			throw new TypeError("Unexpected code detail format");
		}

		const v1ModuleWithDetails: IFluidModuleWithDetails = {
			module: { fluidExport: new InventoryListContainerRuntimeFactory1(this.testMode) },
			details: { package: "one" },
		};

		const v2ModuleWithDetails: IFluidModuleWithDetails = {
			module: { fluidExport: new InventoryListContainerRuntimeFactory2(this.testMode) },
			details: { package: "two" },
		};

		switch (version) {
			case "one": {
				return v1ModuleWithDetails;
			}
			case "two": {
				return v2ModuleWithDetails;
			}
			default: {
				throw new Error("Unknown version");
			}
		}
	}
}
