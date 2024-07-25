/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { assert, oob } from "@fluidframework/core-utils/internal";
import type { IFluidHandle } from "@fluidframework/core-interfaces";

import { Multiplicity, rootFieldKey, type TreeNodeSchemaIdentifier } from "../core/index.js";
import {
	type LazyItem,
	type TreeStatus,
	isLazy,
	isTreeValue,
	FlexObjectNodeSchema,
} from "../feature-libraries/index.js";
import {
	fail,
	extractFromOpaque,
	isReadonlyArray,
	type JsonCompatible,
} from "../util/index.js";

import { getOrCreateNodeProxy, isTreeNode } from "./proxies.js";
import { getFlexNode, getKernel } from "./proxyBinding.js";
import { tryGetSimpleNodeSchema } from "./schemaCaching.js";
import {
	NodeKind,
	type TreeLeafValue,
	type TreeNodeSchema,
	type ImplicitFieldSchema,
	FieldSchema,
	type ImplicitAllowedTypes,
	type TreeNodeFromImplicitAllowedTypes,
	type InsertableTreeFieldFromImplicitField,
	type TreeFieldFromImplicitField,
} from "./schemaTypes.js";
import type { TreeNode, TreeChangeEvents } from "./types.js";
import {
	booleanSchema,
	handleSchema,
	nullSchema,
	numberSchema,
	stringSchema,
} from "./leafNodeSchema.js";
import { isFluidHandle } from "@fluidframework/runtime-utils/internal";
import { UsageError } from "@fluidframework/telemetry-utils/internal";
import type { Off } from "../events/index.js";

/**
 * Provides various functions for analyzing {@link TreeNode}s.
 * * @remarks
 * This type should only be used via the public `Tree` export.
 * @privateRemarks
 * Due to limitations of API-Extractor link resolution, this type can't be moved into internalTypes but should be considered just an implementation detail of the `Tree` export.
 *
 * Inlining the typing of this interface onto the `Tree` object provides slightly different .d.ts generation,
 * which avoids typescript expanding the type of TreeNodeSchema and thus encountering
 * https://github.com/microsoft/rushstack/issues/1958.
 * @sealed @public
 */
export interface TreeNodeApi {
	/**
	 * The schema information for this node.
	 */
	schema<T extends TreeNode | TreeLeafValue>(
		node: T,
	): TreeNodeSchema<string, NodeKind, unknown, T>;

	/**
	 * Narrow the type of the given value if it satisfies the given schema.
	 * @example
	 * ```ts
	 * if (node.is(myNode, Point)) {
	 *     const y = myNode.y; // `myNode` is now known to satisfy the `Point` schema and therefore has a `y` coordinate.
	 * }
	 * ```
	 */
	is<TSchema extends ImplicitAllowedTypes>(
		value: unknown,
		schema: TSchema,
	): value is TreeNodeFromImplicitAllowedTypes<TSchema>;

	/**
	 * Return the node under which this node resides in the tree (or undefined if this is a root node of the tree).
	 */
	parent(node: TreeNode): TreeNode | undefined;

	/**
	 * The key of the given node under its parent.
	 * @remarks
	 * If `node` is an element in a {@link (TreeArrayNode:interface)}, this returns the index of `node` in the array node (a `number`).
	 * Otherwise, this returns the key of the field that it is under (a `string`).
	 */
	key(node: TreeNode): string | number;

	/**
	 * Register an event listener on the given node.
	 * @param node - The node whose events should be subscribed to.
	 * @param eventName - Which event to subscribe to.
	 * @param listener - The callback to trigger for the event. The tree can be read during the callback, but it is invalid to modify the tree during this callback.
	 * @returns A callback function which will deregister the event.
	 * This callback should be called only once.
	 */
	on<K extends keyof TreeChangeEvents>(
		node: TreeNode,
		eventName: K,
		listener: TreeChangeEvents[K],
	): () => void;

	/**
	 * Returns the {@link TreeStatus} of the given node.
	 */
	status(node: TreeNode): TreeStatus;

	/**
	 * Returns the {@link SchemaFactory.identifier | identifier} of the given node in the most compressed form possible.
	 * @remarks
	 * If the node's identifier is a valid UUID that was automatically generated by the SharedTree, then this will return a process-unique integer corresponding to that identifier.
	 * This is useful for performance-sensitive scenarios involving many nodes with identifiers that need to be compactly retained in memory or used for efficient lookup.
	 *
	 * If the node's identifier is any other user-provided string, then this will return that string.
	 *
	 * If the node has no identifier (that is, it has no {@link SchemaFactory.identifier | identifier} field), then this returns `undefined`.
	 *
	 * If the node has more than one identifier, then this will throw an error.
	 *
	 * The returned integer must not be serialized or preserved outside of the current process.
	 * Its lifetime is that of the current in-memory instance of the FF container for this client, and it is not guaranteed to be unique or stable outside of that context.
	 * The same node's identifier may, for example, be different across multiple sessions for the same client and document, or different across two clients in the same session.
	 */
	shortId(node: TreeNode): number | string | undefined;

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
	 * For that case, use {@link Tree.clone}.
	 */
	create<TSchema extends ImplicitFieldSchema>(
		schema: TSchema,
		data: InsertableTreeFieldFromImplicitField<TSchema>,
	): TreeFieldFromImplicitField<TSchema>;

	/**
	 * Construct tree content compatible with a field defined by the provided `schema`.
	 * @param schema - The schema for what to construct. As this is an {@link ImplicitFieldSchema}, a {@link FieldSchema}, {@link TreeNodeSchema} or {@link AllowedTypes} array can be provided.
	 * @param data - The data used to construct the field content. See `Tree.cloneToJSONVerbose`.
	 */
	createFromVerbose<TSchema extends ImplicitFieldSchema, THandle>(
		schema: TSchema,
		data: VerboseTree<THandle> | undefined,
		options?: {
			handleConverter<T extends VerboseTree<THandle>>(data: T): T | IFluidHandle;
			useStableFieldKeys?: boolean;
		},
	): TreeFieldFromImplicitField<TSchema>;

	/**
	 * Construct tree content compatible with a field defined by the provided `schema`.
	 * @param schema - The schema for what to construct. As this is an {@link ImplicitFieldSchema}, a {@link FieldSchema}, {@link TreeNodeSchema} or {@link AllowedTypes} array can be provided.
	 * @param data - The data used to construct the field content. See `Tree.cloneToJSONVerbose`.
	 */
	createFromVerbose<TSchema extends ImplicitFieldSchema>(
		schema: TSchema,
		data: VerboseTree | undefined,
		options?: {
			handleConverter?: undefined;
			useStableFieldKeys?: boolean;
		},
	): TreeFieldFromImplicitField<TSchema>;

	/**
	 * Like {@link Tree.create}, except deeply clones existing nodes.
	 * @remarks
	 * This only clones the persisted data associated with a node.
	 * Local state, such as properties added to customized schema classes, will not be cloned:
	 * they will be initialized however they end up after running the constructor, just like if a remote client had inserted the same nodes.
	 */
	clone<TSchema extends ImplicitFieldSchema>(
		original: TreeFieldFromImplicitField<TSchema>,
		options?: {
			/**
			 * If set, all identifier's in the cloned tree (See {@link SchemaFactory.identifier}) will be replaced with new ones allocated using the default identifier allocation schema.
			 * Otherwise any identifiers will be preserved as is.
			 */
			replaceIdentifiers?: true;
		},
	): TreeFieldFromImplicitField<TSchema>;

	/**
	 * Copy a snapshot of the current version of a TreeNode into a JSON compatible plain old JavaScript Object.
	 *
	 * @remarks
	 * If the schema is compatible with {@link ITreeConfigurationOptions.ensureUnambiguous}, then the returned object will be lossless and compatible with {@link Tree.create} (unless the options are used to customize it).
	 */
	cloneToJSON<T>(
		node: TreeNode,
		options?: { handleConverter(handle: IFluidHandle): T; useStableFieldKeys?: boolean },
	): JsonCompatible<T>;

	/**
	 *
	 */
	cloneToJSON(
		node: TreeNode,
		options?: { handleConverter?: undefined; useStableFieldKeys?: boolean },
	): JsonCompatible<IFluidHandle>;

	/**
	 * Copy a snapshot of the current version of a TreeNode into a JSON compatible plain old JavaScript Object.
	 * Verbose tree format, with explicit type on every node.
	 *
	 * @remarks
	 * If the schema is compatible with {@link ITreeConfigurationOptions.ensureUnambiguous}, then the returned object will be lossless and compatible with {@link Tree.create} (unless the options are used to customize it).
	 */
	cloneToJSONVerbose<T>(
		node: TreeNode,
		options?: { handleConverter(handle: IFluidHandle): T; useStableFieldKeys?: boolean },
	): VerboseTree<T>;

	/**
	 * Same as generic overload, except leaves handles as is.
	 */
	cloneToJSONVerbose(
		node: TreeNode,
		options?: { handleConverter?: undefined; useStableFieldKeys?: boolean },
	): VerboseTree;
}

export type VerboseTreeValue<THandle = IFluidHandle> =
	| VerboseTree<THandle>
	| Exclude<IFluidHandle, TreeLeafValue>
	| THandle;

/**
 * The fields required by a node in a tree.
 *
 * @privateRemarks A forked version of this type is used in `persistedTreeTextFormat.ts`.
 * Changes to this type might necessitate changes to `EncodedNodeData` or codecs.
 * See persistedTreeTextFormat's module documentation for more details.
 *
 * @public
 */
export interface VerboseTree<THandle = IFluidHandle> {
	/**
	 * The meaning of this node.
	 * Provides contexts/semantics for this node and its content.
	 * Typically used to associate a node with metadata (including a schema) and source code (types, behaviors, etc).
	 */
	type: TreeNodeSchemaIdentifier;

	fields:
		| VerboseTreeValue<THandle>[]
		| {
				[key: string]: VerboseTreeValue<THandle>;
		  };
}

/**
 * The `Tree` object holds various functions for analyzing {@link TreeNode}s.
 */
export const treeNodeApi: TreeNodeApi = {
	parent(node: TreeNode): TreeNode | undefined {
		const editNode = getFlexNode(node).parentField.parent.parent;
		if (editNode === undefined) {
			return undefined;
		}

		const output = getOrCreateNodeProxy(editNode);
		assert(
			!isTreeValue(output),
			0x87f /* Parent can't be a leaf, so it should be a node not a value */,
		);
		return output;
	},
	key(node: TreeNode): string | number {
		// If the parent is undefined, then this node is under the root field,
		// so we know its key is the special root one.
		const parent = treeNodeApi.parent(node);
		if (parent === undefined) {
			return rootFieldKey;
		}

		// The flex-domain strictly operates in terms of "stored keys".
		// To find the associated developer-facing "view key", we need to look up the field associated with
		// the stored key from the flex-domain, and get view key its simple-domain counterpart was created with.
		const storedKey = getStoredKey(node);
		const parentSchema = treeNodeApi.schema(parent);
		const viewKey = getViewKeyFromStoredKey(parentSchema, storedKey);
		return viewKey;
	},
	on<K extends keyof TreeChangeEvents>(
		node: TreeNode,
		eventName: K,
		listener: TreeChangeEvents[K],
	): Off {
		return getKernel(node).on(eventName, listener);
	},
	status(node: TreeNode): TreeStatus {
		return getKernel(node).getStatus();
	},
	is<TSchema extends ImplicitAllowedTypes>(
		value: unknown,
		schema: TSchema,
	): value is TreeNodeFromImplicitAllowedTypes<TSchema> {
		const actualSchema = tryGetSchema(value);
		if (actualSchema === undefined) {
			return false;
		}
		if (isReadonlyArray<LazyItem<TreeNodeSchema>>(schema)) {
			for (const singleSchema of schema) {
				const testSchema = isLazy(singleSchema) ? singleSchema() : singleSchema;
				if (testSchema === actualSchema) {
					return true;
				}
			}
			return false;
		} else {
			return (schema as TreeNodeSchema) === actualSchema;
		}
	},
	schema<T extends TreeNode | TreeLeafValue>(
		node: T,
	): TreeNodeSchema<string, NodeKind, unknown, T> {
		return tryGetSchema(node) ?? fail("Not a tree node");
	},
	shortId(node: TreeNode): number | string | undefined {
		const flexNode = getFlexNode(node);
		const flexSchema = flexNode.schema;
		const identifierFieldKeys =
			flexSchema instanceof FlexObjectNodeSchema ? flexSchema.identifierFieldKeys : [];

		switch (identifierFieldKeys.length) {
			case 0:
				return undefined;
			case 1: {
				const identifier = flexNode.tryGetField(identifierFieldKeys[0] ?? oob())?.boxedAt(0);
				assert(identifier !== undefined, 0x927 /* The identifier must exist */);
				const identifierValue = identifier.value as string;
				const localNodeKey =
					identifier.context.nodeKeyManager.tryLocalizeNodeKey(identifierValue);
				return localNodeKey !== undefined ? extractFromOpaque(localNodeKey) : identifierValue;
			}
			default:
				throw new UsageError(
					"shortId() may not be called on a node with more than one identifier. Consider converting extraneous identifier fields to string fields.",
				);
		}
	},
};

/**
 * Returns a schema for a value if the value is a {@link TreeNode} or a {@link TreeLeafValue}.
 * Returns undefined for other values.
 */
export function tryGetSchema<T>(
	value: T,
): undefined | TreeNodeSchema<string, NodeKind, unknown, T> {
	type TOut = TreeNodeSchema<string, NodeKind, unknown, T>;
	switch (typeof value) {
		case "string":
			return stringSchema as TOut;
		case "number":
			return numberSchema as TOut;
		case "boolean":
			return booleanSchema as TOut;
		case "object": {
			if (isTreeNode(value)) {
				// This case could be optimized, for example by placing the simple schema in a symbol on tree nodes.
				return tryGetSimpleNodeSchema(getFlexNode(value).schema) as TOut;
			}
			if (value === null) {
				return nullSchema as TOut;
			}
			if (isFluidHandle(value)) {
				return handleSchema as TOut;
			}
		}
		default:
			return undefined;
	}
}

/**
 * Gets the stored key with which the provided node is associated in the parent.
 */
function getStoredKey(node: TreeNode): string | number {
	// Note: the flex domain strictly works with "stored keys", and knows nothing about the developer-facing
	// "view keys".
	const parentField = getFlexNode(node).parentField;
	if (parentField.parent.schema.kind.multiplicity === Multiplicity.Sequence) {
		// The parent of `node` is an array node
		return parentField.index;
	}

	// The parent of `node` is an object, a map, or undefined (and therefore `node` is a root/detached node).
	return parentField.parent.key;
}

/**
 * Given a node schema, gets the view key corresponding with the provided {@link FieldProps.key | stored key}.
 */
function getViewKeyFromStoredKey(
	schema: TreeNodeSchema,
	storedKey: string | number,
): string | number {
	// Only object nodes have the concept of a "stored key", differentiated from the developer-facing "view key".
	// For any other kind of node, the stored key and the view key are the same.
	if (schema.kind !== NodeKind.Object) {
		return storedKey;
	}

	const fields = schema.info as Record<string, ImplicitFieldSchema>;

	// Invariants:
	// - The set of all view keys under an object must be unique.
	// - The set of all stored keys (including those implicitly created from view keys) must be unique.
	// To find the view key associated with the provided stored key, first check for any stored key matches (which are optionally populated).
	// If we don't find any, then search for a matching view key.
	for (const [viewKey, fieldSchema] of Object.entries(fields)) {
		if (fieldSchema instanceof FieldSchema && fieldSchema.props?.key === storedKey) {
			return viewKey;
		}
	}

	if (fields[storedKey] === undefined) {
		fail("Existing stored key should always map to a view key");
	}

	return storedKey;
}
