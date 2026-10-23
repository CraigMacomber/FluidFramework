/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { performance } from "node:perf_hooks";
import { emulateProductionBuild } from "@fluidframework/core-utils/internal";
import { Box, collectMemoryUseData } from "@fluid-tools/benchmark";

// Use a complete compiled tree, not a mixture of baseline and candidate modules.
const lib = resolve(process.env.FLEX_LIB ?? "lib");
const load = (file) => import(pathToFileURL(`${lib}/${file}`).href);
const { SchemaFactory, TreeViewConfiguration, getInnerNode } =
	await load("simple-tree/index.js");
const { createIndependentTreeAlpha, ForestTypeOptimized, ForestTypeReference, Tree } =
	await load("shared-tree/index.js");
const { disposeSymbol } = await load("util/index.js");
const { flexTreeSlot } = await load("feature-libraries/index.js");
const { FormattedTextTest } = await load("test/text/formattedTextTest.js");
const production = process.argv.includes("--production");
if (production) emulateProductionBuild();
const sf = new SchemaFactory("flex-opt-measure");
class Item extends sf.object("Item", { value: sf.number, optional: sf.optional(sf.number) }) {}
class Items extends sf.array("Items", Item) {}
class Numbers extends sf.array("Numbers", sf.number) {}
class Mixed extends sf.array("Mixed", [Item, sf.number]) {}
class Values extends sf.map("Values", sf.number) {}
class Data extends sf.object("Data", {
	items: Items,
	numbers: Numbers,
	mixed: Mixed,
	values: Values,
}) {}
class Wrapper extends sf.objectRecursive("Wrapper", {
	child: [Data, FormattedTextTest.Tree, () => Wrapper],
}) {}
const forests = [
	["chunked", ForestTypeOptimized],
	["object", ForestTypeReference],
];
const samples = Number(process.env.FLEX_SAMPLES ?? 8);
const results = [];
const counts = {};
const instrument = process.argv.includes("--counts");
const wrap = (object, method, label) => {
	const original = object[method];
	object[method] = function (...args) {
		counts[label] = (counts[label] ?? 0) + 1;
		return original.apply(this, args);
	};
};
function build(forest, depth, size, text = false) {
	let content = text
		? FormattedTextTest.Tree.fromString("ab".repeat(Math.ceil(size / 2)).slice(0, size))
		: new Data({
				items: Array.from({ length: size }, (_, value) => ({ value })),
				numbers: Array.from({ length: size }, (_, i) => i),
				mixed: Array.from({ length: size }, (_, i) => (i % 2 ? i : { value: i })),
				values: { key: 0 },
			});
	for (let i = 0; i < depth; i++) content = new Wrapper({ child: content });
	const tree = createIndependentTreeAlpha({ forest });
	const view = tree.viewWith(
		new TreeViewConfiguration({
			schema: depth ? Wrapper : text ? FormattedTextTest.Tree : Data,
		}),
	);
	view.initialize(content);
	let root = view.root;
	for (let i = 0; i < depth; i++) root = root.child;
	const checkout = getInnerNode(root).context.checkout;
	return {
		tree,
		view,
		root,
		close() {
			view.dispose();
			checkout[disposeSymbol]();
		},
	};
}
function stats(values) {
	const mean = values.reduce((a, b) => a + b, 0) / values.length;
	const variance =
		values.reduce((a, b) => a + (b - mean) ** 2, 0) / Math.max(1, values.length - 1);
	return {
		mean,
		min: Math.min(...values),
		max: Math.max(...values),
		samples: values,
		approximate95PercentMargin: 1.96 * Math.sqrt(variance / values.length),
	};
}
function measure(name, operation, iterations = 1000) {
	if (process.env.FLEX_CASE && !new RegExp(process.env.FLEX_CASE).test(name)) return;
	if (iterations >= 1000) iterations = 10000;
	const beforeCounts = { ...counts };
	for (let i = 0; i < iterations; i++) operation(i);
	const times = [];
	for (let s = 0; s < samples; s++) {
		const start = performance.now();
		for (let i = 0; i < iterations; i++) operation(i);
		times.push((performance.now() - start) / iterations);
	}
	results.push({
		name,
		iterations,
		unit: "ms/operation",
		...stats(times),
		...(instrument
			? {
					counts: Object.fromEntries(
						Object.entries(counts).map(([key, value]) => [
							key,
							value - (beforeCounts[key] ?? 0),
						]),
					),
				}
			: {}),
	});
}
for (const [forestName, forest] of forests) {
	for (const depth of [0, 10]) {
		if (process.argv.includes("--format")) {
			for (const size of depth ? [100] : [100, 1000, 10000]) {
				let document = build(forest, depth, size, true);
				const times = [];
				let bold = true;
				for (let i = 0; i < samples + 2; i++) {
					const start = performance.now();
					document.root.formatRange(undefined, undefined, { bold });
					if (i >= 2) times.push(performance.now() - start);
					bold = !bold;
					if ((i + 1) % 16 === 0) {
						document.close();
						document = build(forest, depth, size, true);
						bold = true;
					}
				}
				document.close();
				results.push({
					name: `${forestName}/depth${depth}/format${size}`,
					unit: "ms/operation",
					...stats(times),
				});
			}
			continue;
		}
		for (const size of [4, 128]) {
			const document = build(forest, depth, size);
			const { root } = document;
			const item = root.items[0];
			const inner = getInnerNode(item);
			const field = inner.getBoxed("value");
			const primitiveField = getInnerNode(root.numbers).getBoxed("");
			const nodeField = getInnerNode(root.items).getBoxed("");
			const mixedField = getInnerNode(root.mixed).getBoxed("");
			const context = inner.context;
			if (instrument) {
				const f = context.checkout.forest;
				const move = f.tryMoveCursorToNode;
				f.tryMoveCursorToNode = function (anchor, cursor) {
					const node = f.anchors.locate(anchor);
					let found = false;
					for (let parent = node?.parent; parent !== undefined; parent = parent.parent) {
						counts.rootPathSteps = (counts.rootPathSteps ?? 0) + 1;
						const owner = parent.slots.get(flexTreeSlot);
						if (!found && owner !== undefined && context.withCursors.has(owner)) {
							found = true;
							counts.recoveriesWithCurrentAncestor =
								(counts.recoveriesWithCurrentAncestor ?? 0) + 1;
						}
					}
					return move.call(this, anchor, cursor);
				};
				for (const method of [
					"tryMoveCursorToNode",
					"tryMoveCursorToField",
					"moveCursorToPath",
				])
					wrap(f, method, method);
				for (const method of ["track", "forget"]) wrap(f.anchors, method, method);
			}
			const name = `${forestName}/depth${depth}/size${size}`;
			measure(`${name}/field-path`, () => {
				field.prepareForEdit();
				field.getFieldPathForEditing();
			});
			measure(`${name}/field-cache`, () => {
				inner.prepareForEdit();
				assert.equal(inner.getBoxed("value"), field);
			});
			measure(`${name}/object-read`, () => {
				assert.equal(typeof item.value, "number");
			});
			measure(
				`${name}/object-write`,
				(i) => {
					item.value = i;
				},
				50,
			);
			measure(
				`${name}/optional-write`,
				(i) => {
					item.optional = i % 2 ? i : undefined;
				},
				50,
			);
			measure(
				`${name}/map-update`,
				(i) => {
					root.values.set("key", i);
				},
				50,
			);
			measure(`${name}/primitive-index`, (i) => {
				assert.equal(root.numbers[i % size], i % size);
			});
			measure(`${name}/node-index`, (i) => {
				assert.equal(root.items[i % size].value >= 0, true);
			});
			measure(`${name}/mixed-index`, (i) => {
				assert.notEqual(root.mixed[i % size], undefined);
			});
			measure(
				`${name}/primitive-atIndex`,
				(i) => {
					assert.equal(primitiveField.atIndex(i % size), i % size);
				},
				10000,
			);
			measure(
				`${name}/node-atIndex`,
				(i) => {
					assert.notEqual(nodeField.atIndex(i % size), undefined);
				},
				10000,
			);
			measure(
				`${name}/mixed-atIndex`,
				(i) => {
					assert.notEqual(mixedField.atIndex(i % size), undefined);
				},
				10000,
			);
			measure(
				`${name}/iteration`,
				() => {
					assert.equal([...root.items].length, size);
				},
				100,
			);
			measure(`${name}/parent-key`, () => {
				assert.equal(Tree.parent(item), root.items);
				assert.equal(Tree.key(item), 0);
			});
			measure(
				`${name}/edit-related-reads`,
				(i) => {
					item.value = i;
					Tree.parent(item);
					Tree.key(item);
					root.items[1].value;
					root.values.get("key");
				},
				50,
			);
			measure(
				`${name}/insert-remove-move`,
				() => {
					root.items.insertAtEnd({ value: 1 });
					root.items.moveToStart(size);
					root.items.removeAt(0);
				},
				20,
			);
			if (process.env.FLEX_CASE?.includes("cursor-")) {
				const source = inner.cursor;
				const destination = context.checkout.forest.allocateCursor();
				measure(`${name}/cursor-fork`, () => {
					source.fork().free();
				});
				measure(`${name}/cursor-root-recovery`, () => {
					destination.clear();
					context.checkout.forest.tryMoveCursorToNode(inner.anchor, destination);
				});
				destination.free();
			}
			document.close();
			if (
				process.env.FLEX_CASE &&
				!new RegExp(process.env.FLEX_CASE).test(`${name}/cold-traversal`)
			)
				continue;
			const cold = [];
			for (let s = 0; s < samples + 8; s++) {
				const fresh = build(forest, depth, size);
				if (process.env.FLEX_COLD_GC === "1") global.gc();
				const start = performance.now();
				for (const value of fresh.root.items) {
					value.value;
					value.optional;
				}
				if (s >= 8) cold.push(performance.now() - start);
				fresh.close();
			}
			results.push({ name: `${name}/cold-traversal`, unit: "ms/traversal", ...stats(cold) });
		}
	}
}
if (process.argv.includes("--memory")) {
	assert(global.gc, "Run with --expose-gc");
	for (const [forestName, forest] of forests) {
		for (const depth of [0, 10]) {
			for (const materialize of [false, true]) {
				const box = Box.empty();
				const populate = () => {
					box.value = build(forest, depth, 2000);
					if (materialize)
						for (const item of box.value.root.items) {
							item.value;
							getInnerNode(item).getBoxed("optional");
						}
					for (let edit = 0; edit < 20; edit++) box.value.root.values.set("key", edit);
				};
				const metrics = await collectMemoryUseData({
					warmUpIterations: 2,
					keepIterations: 4,
					async benchmarkFn(state) {
						while (state.continue()) {
							await state.beforeAllocation();
							populate();
							await state.whileAllocated();
							box.value.close();
							box.clear();
							await state.afterDeallocation();
						}
					},
				});
				results.push({
					name: `${forestName}/depth${depth}/memory-${materialize ? "many" : "few"}`,
					metrics,
				});
			}
		}
	}
}
const hashes = Object.fromEntries(
	["lazyField", "lazyNode", "lazyEntity"].map((name) => [
		name,
		createHash("sha256")
			.update(readFileSync(`${lib}/feature-libraries/flex-tree/${name}.js`))
			.digest("hex"),
	]),
);
const output = {
	revision: execFileSync("git", ["rev-parse", "HEAD"], { encoding: "utf8" }).trim(),
	node: process.version,
	lib,
	production,
	instrument,
	hashes,
	counts,
	results,
};
writeFileSync(process.env.FLEX_OUTPUT ?? "flex-measure.json", `${JSON.stringify(output)}\n`);
console.log(`Recorded ${results.length} cases (${production ? "production" : "development"})`);
