/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { toPropTreeNode } from "@fluidframework/react/alpha";
// eslint-disable-next-line import-x/no-internal-modules
import { createTinyliciousServiceClient } from "@fluidframework/tinylicious-driver/internal";
import { createElement } from "react";
// eslint-disable-next-line import-x/no-internal-modules
import { createRoot } from "react-dom/client";

import { inventoryDataStoreKind } from "./inventoryList.js";
import type { Inventory } from "./schema.js";
import { MainView } from "./view/index.js";

const service = createTinyliciousServiceClient();

const id = location.hash.slice(1);
let root: Inventory;
if (id.length > 0) {
	const container = await service.loadContainer(id, inventoryDataStoreKind);
	root = container.data.root;
} else {
	const container = await service.createContainer(inventoryDataStoreKind);
	const attached = await container.attach();
	location.hash = attached.id;
	root = attached.data.root;
}

const rootEl = document.querySelector("#content");
if (rootEl === null) {
	throw new Error("No #content element found");
}
createRoot(rootEl).render(createElement(MainView, { root: toPropTreeNode(root) }));
