/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

// eslint-disable-next-line import-x/no-internal-modules
import { getPresenceViaExtensionStore } from "@fluidframework/presence/internal";
import {
	getTinyliciousContainerAudience,
	getTinyliciousContainerExtensionStore,
	// eslint-disable-next-line import-x/no-internal-modules
} from "@fluidframework/tinylicious-driver/internal";

import { DiceRollerController, type DieValue } from "./controller.js";
import { diceRollerDataStoreKind, service } from "./fluid.js";
import { buildDicePresence } from "./presence.js";
import type { TwoDiceApp } from "./schema.js";
import { makeAppView } from "./view.js";

function setupApp(
	appModel: TwoDiceApp,
	presence: ReturnType<typeof getPresenceViaExtensionStore>,
	audience: ReturnType<typeof getTinyliciousContainerAudience>,
): void {
	// Biome insist on no semicolon - https://dev.azure.com/fluidframework/internal/_workitems/edit/9083
	const lastRoll: { die1?: DieValue; die2?: DieValue } = {};
	const states = buildDicePresence(presence).states;

	const diceRollerController1 = new DiceRollerController(appModel.dice1, (value) => {
		lastRoll.die1 = value;
		states.lastRoll.local = lastRoll;
		states.lastDiceRolls.local.set("die1", { value });
	});
	const diceRollerController2 = new DiceRollerController(appModel.dice2, (value) => {
		lastRoll.die2 = value;
		states.lastRoll.local = lastRoll;
		states.lastDiceRolls.local.set("die2", { value });
	});

	// lastDiceRolls is here just to demonstrate an example of LatestMap
	// Its updates are only logged to the console.
	states.lastDiceRolls.events.on("remoteItemUpdated", (update) => {
		console.log(
			`Client ${update.attendee.attendeeId.slice(0, 8)}'s ${update.key} rolled to ${update.value.value}`,
		);
	});

	const contentDiv = document.querySelector("#content") as HTMLDivElement;
	contentDiv.append(
		makeAppView(
			[diceRollerController1, diceRollerController2],
			{ presence, lastRoll: states.lastRoll },
			audience,
		),
	);
}

async function start(): Promise<void> {
	const createNew = location.hash.length === 0;

	if (createNew) {
		const container = await service.createContainer(diceRollerDataStoreKind);
		const attached = await container.attach();
		// eslint-disable-next-line require-atomic-updates
		location.hash = attached.id;
		document.title = attached.id;
		setupApp(
			attached.data.root,
			getPresenceViaExtensionStore(getTinyliciousContainerExtensionStore(attached)),
			getTinyliciousContainerAudience(attached),
		);
	} else {
		const id = location.hash.slice(1);
		const container = await service.loadContainer(id, diceRollerDataStoreKind);
		document.title = id;
		setupApp(
			container.data.root,
			getPresenceViaExtensionStore(getTinyliciousContainerExtensionStore(container)),
			getTinyliciousContainerAudience(container),
		);
	}
}

await start();
