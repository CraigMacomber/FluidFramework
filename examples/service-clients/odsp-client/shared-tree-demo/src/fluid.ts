/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import {
	createOdspServiceClient,
	// eslint-disable-next-line import-x/no-internal-modules
} from "@fluidframework/odsp-client/internal";
import { treeDataStoreKind } from "fluid-framework/alpha";

import { connectionConfig } from "./clientProps.js";
import { App, treeConfiguration } from "./schema.js";

export const service = createOdspServiceClient({ connection: connectionConfig });

export const appDataStoreKind = treeDataStoreKind({
	type: "shared-tree-demo",
	config: treeConfiguration,
	initializer: () => new App({ letters: [], word: [] }),
});
