/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

// eslint-disable-next-line import-x/no-internal-modules
import {
	createEphemeralServiceClient,
	synchronizeLocalService,
} from "@fluidframework/local-driver/internal";

import { DiceRollerController } from "../src/controller.js";
import { diceRollerDataStoreKind } from "../src/fluid.js";
import type { TwoDiceApp } from "../src/schema.js";
import { makeAppView } from "../src/view.js";

// Shared ephemeral service — module-level singleton ensures all containers share the same in-memory server
const service = createEphemeralServiceClient();

async function createContainerAndRenderInElement(
	containerId: string | undefined,
	elementId: string,
): Promise<string> {
	const element = document.querySelector(`#${elementId}`);
	if (element === null) {
		throw new Error(`${elementId} does not exist`);
	}

	let appModel: TwoDiceApp;
	let id: string;

	if (containerId === undefined) {
		const container = await service.createContainer(diceRollerDataStoreKind);
		const attached = await container.attach();
		id = attached.id;
		appModel = attached.data.root;
	} else {
		await synchronizeLocalService();
		const container = await service.loadContainer(containerId, diceRollerDataStoreKind);
		id = containerId;
		appModel = container.data.root;
	}

	const diceRollerController1 = new DiceRollerController(appModel.dice1, () => {});
	const diceRollerController2 = new DiceRollerController(appModel.dice2, () => {});

	element.append(makeAppView([diceRollerController1, diceRollerController2]));
	return id;
}

async function setup(): Promise<void> {
	const createNew = window.location.hash.length === 0;
	if (createNew) {
		window.location.hash = Date.now().toString();
	}
	const containerId = createNew ? undefined : window.location.hash.slice(1);

	const id = await createContainerAndRenderInElement(containerId, "sbs-left");

	if (createNew) {
		window.location.hash = id;
	}

	// The second time we load — always loading an existing container
	await createContainerAndRenderInElement(id, "sbs-right");

	// Setting "fluidStarted" is just for our test automation
	// eslint-disable-next-line @typescript-eslint/dot-notation
	window["fluidStarted"] = true;
}

try {
	await setup();
} catch (error) {
	console.error(error);
	console.log(
		"%cThere were issues setting up and starting the in memory Fluid Server",
		"font-size:30px",
	);
}
