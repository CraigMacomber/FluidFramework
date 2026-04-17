/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

// eslint-disable-next-line import-x/no-internal-modules
import { createTinyliciousServiceClient } from "@fluidframework/tinylicious-driver/internal";
import { TreeViewConfiguration } from "fluid-framework";
import { treeDataStoreKind } from "fluid-framework/alpha";

import { TwoDiceApp, Dice } from "./schema.js";

const treeViewConfig = new TreeViewConfiguration({
	schema: TwoDiceApp,
	enableSchemaValidation: true,
});

export const diceRollerDataStoreKind = treeDataStoreKind({
	type: "dice-roller",
	config: treeViewConfig,
	initializer: () =>
		new TwoDiceApp({
			dice1: new Dice({ value: 1 }),
			dice2: new Dice({ value: 1 }),
		}),
});

export const service = createTinyliciousServiceClient();
