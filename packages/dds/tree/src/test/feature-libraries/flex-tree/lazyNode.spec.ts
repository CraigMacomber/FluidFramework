/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

/* eslint-disable import-x/no-internal-modules */

import { strict as assert, fail } from "node:assert";

import {
	type Anchor,
	type AnchorNode,
	EmptyKey,
	type FieldKey,
	type ITreeSubscriptionCursor,
	type MapTree,
	rootFieldKey,
} from "../../../core/index.js";
import type { Context } from "../../../feature-libraries/flex-tree/context.js";
import { LazyTreeNode } from "../../../feature-libraries/flex-tree/lazyNode.js";
import { withObservation } from "../../../feature-libraries/flex-tree/observer.js";
import type { FlexTreeField, FlexTreeNode } from "../../../feature-libraries/index.js";
import { JsonAsTree } from "../../../jsonDomainSchema.js";
import {
	SchemaFactory,
	TreeViewConfiguration,
	getInnerNode,
} from "../../../simple-tree/index.js";
import {
	createIndependentTreeAlpha,
	ForestTypeOptimized,
	ForestTypeReference,
} from "../../../shared-tree/index.js";
import { stringSchema } from "../../../simple-tree/leafNodeSchema.js";
import { brand, disposeSymbol } from "../../../util/index.js";

import { readonlyTreeWithContent } from "./utils.js";

/**
 * Test {@link LazyTreeNode} implementation.
 */
class TestLazyTree extends LazyTreeNode {}

/**
 * Creates an {@link Anchor} and an {@link AnchorNode} for the provided cursor's location.
 */
function createAnchors(
	context: Context,
	cursor: ITreeSubscriptionCursor,
): { anchor: Anchor; anchorNode: AnchorNode } {
	const anchor = context.checkout.forest.anchors.track(cursor.getPath() ?? fail());
	const anchorNode = context.checkout.forest.anchors.locate(anchor) ?? fail();

	return { anchor, anchorNode };
}

describe("LazyNode", () => {
	for (const forest of [ForestTypeOptimized, ForestTypeReference]) {
		it(`cached fields preserve observation, emptiness and lifetime (${forest})`, () => {
			const sf = new SchemaFactory("cached-fields");
			class Item extends sf.object("Item", { value: sf.optional(sf.number) }) {}
			const view = createIndependentTreeAlpha({ forest }).viewWith(
				new TreeViewConfiguration({ schema: Item }),
			);
			view.initialize({});
			const node = getInnerNode(view.root);
			assert(node instanceof LazyTreeNode);
			const key: FieldKey = brand("value");
			const field = node.getBoxed(key);
			for (const entity of node.context.withCursors) entity.prepareForEdit();
			let observations = 0;
			withObservation(
				{
					observeNodeDeep: () => {},
					observeNodeFields: () => {},
					observeParentOf: () => {},
					observeNodeField: (observed, observedKey) => {
						assert.equal(observed, node);
						assert.equal(observedKey, key);
						observations++;
					},
				},
				() => assert.equal(node.getBoxed(key), field),
			);
			assert.equal(observations, 1);
			assert.equal(node.context.withCursors.size, 0);
			assert.equal(node.tryGetField(key), undefined);
			view.root.value = 1;
			assert.equal(node.tryGetField(key), field);
			view.root.value = undefined;
			assert.equal(node.getBoxed(key), field);
			assert.equal(node.tryGetField(key), undefined);
			const checkout = node.context.checkout;
			view.dispose();
			assert.throws(() => node.getBoxed(key));
			checkout.dispose();
		});
	}

	it("cached fields reject a broken forest", () => {
		const { context, cursor } = readonlyTreeWithContent({
			schema: JsonAsTree.JsonObject,
			initialTree: { x: 1 },
		});
		const node = context.root.boxedAt(0);
		assert(node !== undefined);
		node.getBoxed(brand("x"));
		const breaker = context.checkout.forest.breaker;
		assert.throws(() => breaker.break(new Error("test break")), /test break/);
		assert.throws(() => node.getBoxed(brand("x")), /invalid state/);
		breaker.clearError();
		cursor.free();
		context[disposeSymbol]();
	});

	describe("LazyNode", () => {
		it("parent", () => {
			const schemaFactory = new SchemaFactory("test");
			const ParentNode = schemaFactory.map("map", schemaFactory.string);

			const { context, cursor } = readonlyTreeWithContent({
				schema: ParentNode,
				initialTree: { [EmptyKey]: "test" },
			});
			cursor.enterNode(0);

			const { anchor, anchorNode } = createAnchors(context, cursor);

			const node = new TestLazyTree(
				context,
				brand(ParentNode.identifier),
				cursor,
				anchorNode,
				anchor,
			);
			const { index, parent } = node.parentField;
			assert.equal(index, 0);
			assert.equal(parent.key, rootFieldKey);
		});

		it("keys", () => {
			{
				const { context, cursor } = readonlyTreeWithContent({
					schema: JsonAsTree.JsonObject,
					initialTree: {},
				});
				cursor.enterNode(0);
				const { anchor, anchorNode } = createAnchors(context, cursor);
				const node = new TestLazyTree(
					context,
					brand(JsonAsTree.JsonObject.identifier),
					cursor,
					anchorNode,
					anchor,
				);
				assert.deepEqual([...node.keys()], []);
			}
			{
				const { context, cursor } = readonlyTreeWithContent({
					schema: JsonAsTree.JsonObject,
					initialTree: { x: 5 },
				});
				cursor.enterNode(0);
				const { anchor, anchorNode } = createAnchors(context, cursor);
				const node = new TestLazyTree(
					context,
					brand(JsonAsTree.JsonObject.identifier),
					cursor,
					anchorNode,
					anchor,
				);
				assert.deepEqual([...node.keys()], ["x"]);
			}
		});

		it("leaf", () => {
			const { context, cursor } = readonlyTreeWithContent({
				schema: stringSchema,
				initialTree: "Hello world",
			});
			cursor.enterNode(0);

			const { anchor, anchorNode } = createAnchors(context, cursor);

			const node = new LazyTreeNode(
				context,
				brand(stringSchema.identifier),
				cursor,
				anchorNode,
				anchor,
			);

			assert.equal(node.value, "Hello world");
		});
	});
});

function fieldToMapTree(field: FlexTreeField): MapTree[] {
	const results: MapTree[] = [];
	for (const child of field) {
		results.push(nodeToMapTree(child));
	}
	return results;
}

function nodeToMapTree(node: FlexTreeNode): MapTree {
	const fields: Map<FieldKey, MapTree[]> = new Map();
	for (const field of node) {
		fields.set(field.key, fieldToMapTree(field));
	}

	return { fields, type: node.type, value: node.value };
}
