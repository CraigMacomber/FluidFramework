/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
import assert from "node:assert/strict";
import { cpSync, readFileSync, writeFileSync } from "node:fs";

const cache = "node_modules/.cache/flex-opt";
const file = (variant, name) =>
	`${cache}/${variant}/lib/feature-libraries/flex-tree/${name}.js`;
function section(source, start, end) {
	const from = source.indexOf(start);
	const to = source.indexOf(end, from + start.length);
	assert(from !== -1 && to !== -1 && source.indexOf(start, from + 1) === -1);
	return source.slice(from, to);
}
function edit(variant, name, change) {
	const path = file(variant, name);
	const source = readFileSync(path, "utf8");
	const updated = change(source);
	assert.notEqual(source, updated);
	writeFileSync(path, updated);
}
for (const variant of ["minus-a", "minus-b", "minus-c"])
	cpSync(`${cache}/final`, `${cache}/${variant}`, { recursive: true });
edit("minus-a", "lazyField", (source) => {
	const original = readFileSync(file("baseline", "lazyField"), "utf8");
	const start = "    getFieldPath() {";
	const end = "    getEditor() {";
	return source.replace(section(source, start, end), section(original, start, end));
});
edit("minus-b", "lazyNode", (source) => {
	const start = "        const cached = getCachedField(this, key);";
	const end = "        const fieldSchema =";
	return source
		.replace(section(source, start, end), "")
		.replace(
			"return getCachedField(this, fieldKey) ?? makeField(this.context, schema.kind, cursor);",
			"return makeField(this.context, schema.kind, cursor);",
		);
});
edit("minus-c", "lazyNode", (source) => {
	const start = "        const parent = this.anchorNode.parent?.slots.get(flexTreeSlot);";
	const end = "        const cursor = this.cursor;";
	return source.replace(section(source, start, end), "");
});
edit("minus-c", "lazyField", (source) => {
	const start =
		"        const parent = this.context.checkout.forest.anchors.locate(this.anchor.parent);";
	const end = "        const cursor = this.cursor;";
	return source.replace(section(source, start, end), "");
});
