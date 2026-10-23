/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
import { spawnSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import assert from "node:assert/strict";

const [a, b, prefix, ...flags] = process.argv.slice(2);
assert(
	a && b && prefix,
	"Usage: node run-matrix.mjs baseline candidate output-prefix [flags]",
);
mkdirSync("docs/flex-tree-optimization-research/results", { recursive: true });
for (const [index, variant] of [a, b, b, a, b, a, a, b].entries()) {
	const result = spawnSync(
		process.execPath,
		["--expose-gc", "docs/flex-tree-optimization-research/measure.mjs", ...flags],
		{
			stdio: "inherit",
			env: {
				...process.env,
				FLUID_TEST_PERF_MODE: "1",
				FLEX_LIB: `node_modules/.cache/flex-opt/${variant}/lib`,
				FLEX_OUTPUT: `docs/flex-tree-optimization-research/results/${prefix}-${index}-${variant}.json`,
			},
		},
	);
	assert.equal(result.status, 0, `Measurement ${index}/${variant} failed`);
}
