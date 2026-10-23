/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import assert from "node:assert/strict";

const [prefix, a, b] = process.argv.slice(2);
assert(prefix && a && b, "Usage: node summarize.mjs prefix baseline candidate");
const directory = "docs/flex-tree-optimization-research/results";
const files = readdirSync(directory)
	.filter(
		(name) =>
			name.startsWith(`${prefix}-`) &&
			/^[0-7]-/.test(name.slice(prefix.length + 1)) &&
			(name.endsWith(`-${a}.json`) || name.endsWith(`-${b}.json`)),
	)
	.sort();
assert.equal(files.length, 8);
const runs = files.map((name) => ({
	name,
	data: JSON.parse(readFileSync(`${directory}/${name}`, "utf8")),
}));
const mean = (values) => values.reduce((sum, v) => sum + v, 0) / values.length;
const summarize = (name, variant, block) => {
	const values = runs
		.filter(
			(run, index) =>
				run.name.endsWith(`-${variant}.json`) &&
				(block === undefined || Math.floor(index / 4) === block),
		)
		.map((run) => run.data.results.find((r) => r.name === name).mean);
	return {
		mean: mean(values),
		range: [Math.min(...values), Math.max(...values)],
		processes: values,
	};
};
const output = runs[0].data.results
	.filter((r) => r.mean !== undefined)
	.map((r) => {
		const before = summarize(r.name, a);
		const after = summarize(r.name, b);
		const blocks = [0, 1].map(
			(block) =>
				100 * (1 - summarize(r.name, b, block).mean / summarize(r.name, a, block).mean),
		);
		return {
			name: r.name,
			before,
			after,
			percentLessTime: 100 * (1 - after.mean / before.mean),
			blocks,
		};
	});
writeFileSync(`${directory}/${prefix}-summary.json`, `${JSON.stringify(output, null, 2)}\n`);
for (const r of output)
	console.log(
		`${r.name}: ${r.percentLessTime.toFixed(1)}% [blocks ${r.blocks.map((n) => n.toFixed(1)).join(", ")}]`,
	);
