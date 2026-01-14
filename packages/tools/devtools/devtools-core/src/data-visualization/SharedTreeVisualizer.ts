/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { fail } from "@fluidframework/core-utils/internal";
import {
	SchemaFactory,
	Tree,
	type SimpleFieldSchema,
	type SimpleNodeSchema,
	type VerboseTree,
	type VerboseTreeNode,
} from "@fluidframework/tree/internal";

import type { VisualizeChildData } from "./DataVisualization.js";
import type { VisualChildNode } from "./VisualTree.js";

/**
 * Creates a visual representation of a SharedTree field based on its schema.
 * @param fieldContent - The content to visualize
 * @param treeDefinitions - Map containing all schema definitions for the entire tree structure. Each definition
 * describes the shape and constraints of a particular node type.
 * @param fieldSchema - The schema for this field.
 * @param visualizeChildData - Callback function to visualize child node data
 * @returns A visual representation of the tree that includes schema information and node values
 */
export async function visualizeSharedTreeField(
	fieldContent: VerboseTree | undefined,
	treeDefinitions: ReadonlyMap<string, SimpleNodeSchema>,
	fieldSchema: SimpleFieldSchema,
	visualizeChildData: VisualizeChildData,
): Promise<VisualChildNode> {
	// TODO: recursively render fieldContent here.
	throw new Error("Not implemented yet");
}

/**
 * Creates a visual representation of a SharedTree field based on its schema.
 * @param fieldContent - The content to visualize
 * @param treeDefinitions - Map containing all schema definitions for the entire tree structure. Each definition
 * describes the shape and constraints of a particular node type.
 * @param fieldSchema - The schema for this field.
 * @param visualizeChildData - Callback function to visualize child node data
 * @returns A visual representation of the tree that includes schema information and node values
 */
async function visualizeSharedTreeNodeOrLeaf(
	node: VerboseTree,
	treeDefinitions: ReadonlyMap<string, SimpleNodeSchema>,
	visualizeChildData: VisualizeChildData,
): Promise<VisualChildNode> {
	if (Tree.is(node, SchemaFactory.leaves)) {
		// TODO: render leaf here.
		throw new Error("Not implemented yet");
	} else {
		return visualizeSharedTreeNode(node, treeDefinitions, visualizeChildData);
	}
}

/**
 * Creates a visual representation of a SharedTree field based on its schema.
 * @param fieldContent - The content to visualize
 * @param treeDefinitions - Map containing all schema definitions for the entire tree structure. Each definition
 * describes the shape and constraints of a particular node type.
 * @param fieldSchema - The schema for this field.
 * @param visualizeChildData - Callback function to visualize child node data
 * @returns A visual representation of the tree that includes schema information and node values
 */
async function visualizeSharedTreeNode(
	node: VerboseTreeNode,
	treeDefinitions: ReadonlyMap<string, SimpleNodeSchema>,
	visualizeChildData: VisualizeChildData,
): Promise<VisualChildNode> {
	const schema = treeDefinitions.get(node.type) ?? fail("Schema not found for node type");
	// TODO: Switch over node kinds and render appropriately, recursing into visualizeSharedTreeField or visualizeSharedTreeNodeOrLeaf as needed.
	throw new Error("Not implemented yet");
}
