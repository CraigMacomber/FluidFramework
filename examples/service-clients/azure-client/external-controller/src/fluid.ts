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

/**
 * Data store kind for the dice roller application.
 * Defines the schema, view configuration, and initial state for a SharedTree-based two-dice roller.
 */
export const diceRollerDataStoreKind = treeDataStoreKind({
	type: "dice-roller",
	config: treeViewConfig,
	initializer: () =>
		new TwoDiceApp({
			dice1: new Dice({ value: 1 }),
			dice2: new Dice({ value: 1 }),
		}),
});

/**
 * Service client backed by a local Tinylicious server.
 *
 * @remarks
 * Requires a Tinylicious server to be running (e.g. `pnpm tinylicious`). Unlike the ephemeral client
 * used in tests, this client persists containers and supports real multi-process collaboration.
 * In GitHub Codespaces, set {@link TinyliciousServiceOptions.endpoint} to the forwarded port URL.
 */
export const service = createTinyliciousServiceClient();
