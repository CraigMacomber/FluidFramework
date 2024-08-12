/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import type { IFluidHandle } from "@fluidframework/core-interfaces";

import type { ITreeCursorSynchronous, SchemaAndPolicy } from "../../core/index.js";
import { fail } from "../../util/index.js";
import type {
	TreeLeafValue,
	ImplicitFieldSchema,
	InsertableTreeFieldFromImplicitField,
	TreeFieldFromImplicitField,
} from "../schemaTypes.js";
import type { Unhydrated } from "../core/index.js";
import {
	cursorForMapTreeNode,
	defaultSchemaPolicy,
	intoStoredSchema,
	mapTreeFromCursor,
	type NodeKeyManager,
} from "../../feature-libraries/index.js";
import { getOrCreateNodeFromFlexTreeNode, type InsertableContent } from "../proxies.js";
import { getOrCreateMapTreeNode } from "../../feature-libraries/index.js";
import { toFlexSchema } from "../toFlexSchema.js";
import { inSchemaOrThrow, mapTreeFromNodeData } from "../toMapTree.js";
import {
	applySchemaToParserOptions,
	cursorFromVerbose,
	type ParseOptions,
	type VerboseTree,
	type VerboseTreeNode,
} from "./verboseTree.js";

/**
 * Construct tree content compatible with a field defined by the provided `schema`.
 * @param schema - The schema for what to construct. As this is an {@link ImplicitFieldSchema}, a {@link FieldSchema}, {@link TreeNodeSchema} or {@link AllowedTypes} array can be provided.
 * @param data - The data used to construct the field content.
 * @remarks
 * When providing a {@link TreeNodeSchemaClass}, this is the same as invoking its constructor except that an unhydrated node can also be provided.
 * This function exists as a generalization that can be used in other cases as well,
 * such as when `undefined` might be allowed (for an optional field), or when the type should be inferred from the data when more than one type is possible.
 *
 * Like with {@link TreeNodeSchemaClass}'s constructor, its an error to provide an existing node to this API.
 * TODO: For that case, use we should provide `Tree.clone`.
 * @privateRemarks
 * This could be exposed as a public `Tree.create` function.
 */
export function createFromInsertable<TSchema extends ImplicitFieldSchema>(
	schema: TSchema,
	data: InsertableTreeFieldFromImplicitField<TSchema>,
	context?: NodeKeyManager | undefined,
): Unhydrated<TreeFieldFromImplicitField<TSchema>> {
	const cursor = cursorFromInsertable(schema, data, context);
	const result = cursor === undefined ? undefined : createFromCursor(schema, cursor);
	return result as Unhydrated<TreeFieldFromImplicitField<TSchema>>;
}

/**
 * Construct tree content compatible with a field defined by the provided `schema`.
 * @param schema - The schema for what to construct. As this is an {@link ImplicitFieldSchema}, a {@link FieldSchema}, {@link TreeNodeSchema} or {@link AllowedTypes} array can be provided.
 * @param data - The data used to construct the field content.
 * @remarks
 * When providing a {@link TreeNodeSchemaClass},
 * this is the same as invoking its constructor except that an unhydrated node can also be provided and the returned value is a cursor.
 * When `undefined` is provided (for an optional field), `undefined` is returned.
 */
export function cursorFromInsertable<TSchema extends ImplicitFieldSchema>(
	schema: TSchema,
	data: InsertableTreeFieldFromImplicitField<TSchema>,
	context?: NodeKeyManager | undefined,
): ITreeCursorSynchronous | undefined {
	const flexSchema = toFlexSchema(schema);
	const schemaValidationPolicy: SchemaAndPolicy = {
		policy: defaultSchemaPolicy,
		// TODO: optimize: This isn't the most efficient operation since its not cached, and has to convert all the schema.
		schema: intoStoredSchema(flexSchema),
	};

	const mapTree = mapTreeFromNodeData(
		data as InsertableContent | undefined,
		schema,
		context,
		schemaValidationPolicy,
	);
	const result = mapTree === undefined ? undefined : cursorForMapTreeNode(mapTree);
	return result;
}

/**
 * Construct tree content compatible with a field defined by the provided `schema`.
 * @param schema - The schema for what to construct. As this is an {@link ImplicitFieldSchema}, a {@link FieldSchema}, {@link TreeNodeSchema} or {@link AllowedTypes} array can be provided.
 * @param data - The data used to construct the field content. See `Tree.cloneToJSONVerbose`.
 * @privateRemarks
 * This could be exposed as a public `Tree.createFromVerbose` function.
 */
export function createFromVerbose<TSchema extends ImplicitFieldSchema, THandle>(
	schema: TSchema,
	data: VerboseTreeNode<THandle> | undefined,
	options: ParseOptions<THandle>,
): Unhydrated<TreeFieldFromImplicitField<TSchema>>;

/**
 * Construct tree content compatible with a field defined by the provided `schema`.
 * @param schema - The schema for what to construct. As this is an {@link ImplicitFieldSchema}, a {@link FieldSchema}, {@link TreeNodeSchema} or {@link AllowedTypes} array can be provided.
 * @param data - The data used to construct the field content. See `Tree.cloneToJSONVerbose`.
 */
export function createFromVerbose<TSchema extends ImplicitFieldSchema>(
	schema: TSchema,
	data: VerboseTreeNode | undefined,
	options?: Partial<ParseOptions<IFluidHandle>>,
): Unhydrated<TreeFieldFromImplicitField<TSchema>>;

export function createFromVerbose<TSchema extends ImplicitFieldSchema, THandle>(
	schema: TSchema,
	data: VerboseTreeNode<THandle> | undefined,
	options?: Partial<ParseOptions<THandle>>,
): Unhydrated<TreeFieldFromImplicitField<TSchema>> {
	const config: ParseOptions<THandle> = {
		valueConverter: (input: VerboseTree<THandle>) => {
			return input as TreeLeafValue | VerboseTreeNode<THandle>;
		},
		...options,
	};
	const schemalessConfig = applySchemaToParserOptions(schema, config);
	const cursor = cursorFromVerbose(data, schemalessConfig);
	return createFromCursor(schema, cursor);
}

export function createFromCursor<TSchema extends ImplicitFieldSchema>(
	schema: TSchema,
	cursor: ITreeCursorSynchronous,
): Unhydrated<TreeFieldFromImplicitField<TSchema>> {
	const mapTree = mapTreeFromCursor(cursor);
	const flexSchema = toFlexSchema(schema);

	const schemaValidationPolicy: SchemaAndPolicy = {
		policy: defaultSchemaPolicy,
		// TODO: optimize: This isn't the most efficient operation since its not cached, and has to convert all the schema.
		schema: intoStoredSchema(flexSchema),
	};

	inSchemaOrThrow(schemaValidationPolicy, mapTree);

	const rootSchema = flexSchema.nodeSchema.get(cursor.type) ?? fail("missing schema");
	const mapTreeNode = getOrCreateMapTreeNode(rootSchema, mapTree);

	// TODO: ensure this works for InnerNodes to create unhydrated nodes
	const result = getOrCreateNodeFromFlexTreeNode(mapTreeNode);
	return result as Unhydrated<TreeFieldFromImplicitField<TSchema>>;
}
