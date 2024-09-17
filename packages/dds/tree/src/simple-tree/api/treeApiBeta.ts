/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import type {
	NodeKind,
	TreeChangeEvents,
	TreeNode,
	Unhydrated,
	WithType,
} from "../core/index.js";
import { treeNodeApi } from "./treeNodeApi.js";
import { createFromInsertable, createFromVerbose } from "./create.js";
import { clone, cloneToJson, cloneToVerbose } from "./clone.js";
import type {
	ImplicitFieldSchema,
	InsertableTreeFieldFromImplicitField,
	TreeFieldFromImplicitField,
} from "../schemaTypes.js";

/**
 * Data included for {@link TreeChangeEventsBeta.nodeChanged}.
 * @sealed @beta
 */
export interface NodeChangedData<TNode extends TreeNode = TreeNode> {
	/**
	 * When the node changed is an object or Map node, this lists all the properties which changed.
	 * @remarks
	 * This only includes changes to the node itself (which would trigger {@link TreeChangeEvents.nodeChanged}).
	 *
	 * Set to `undefined` when the {@link NodeKind} does not support this feature (currently just ArrayNodes).
	 *
	 * When defined, the set should never be empty, since `nodeChanged` will only be triggered when there is a change, and for the supported node types, the only things that can change are properties.
	 */
	readonly changedProperties?: ReadonlySet<
		// For Object nodes, make changedProperties required and strongly typed with the property names from the schema:
		TNode extends WithType<string, NodeKind.Object, infer TInfo>
			? string & keyof TInfo
			: string
	>;
}

/**
 * Extensions to {@link TreeChangeEvents} which are not yet stable.
 *
 * @sealed @beta
 */
export interface TreeChangeEventsBeta<TNode extends TreeNode = TreeNode>
	extends TreeChangeEvents {
	/**
	 * Emitted by a node after a batch of changes has been applied to the tree, if any of the changes affected the node.
	 *
	 * - Object nodes define a change as being when the value of one of its properties changes (i.e., the property's value is set, including when set to `undefined`).
	 *
	 * - Array nodes define a change as when an element is added, removed, moved or replaced.
	 *
	 * - Map nodes define a change as when an entry is added, updated, or removed.
	 *
	 * @remarks
	 * This event is not emitted when:
	 *
	 * - Properties of a child node change. Notably, updates to an array node or a map node (like adding or removing
	 * elements/entries) will emit this event on the array/map node itself, but not on the node that contains the
	 * array/map node as one of its properties.
	 *
	 * - The node is moved to a different location in the tree or removed from the tree.
	 * In this case the event is emitted on the _parent_ node, not the node itself.
	 *
	 * For remote edits, this event is not guaranteed to occur in the same order or quantity that it did in
	 * the client that made the original edit.
	 *
	 * When the event is emitted, the tree is guaranteed to be in-schema.
	 *
	 * @privateRemarks
	 * This event occurs whenever the apparent contents of the node instance change, regardless of what caused the change.
	 * For example, it will fire when the local client reassigns a child, when part of a remote edit is applied to the
	 * node, or when the node has to be updated due to resolution of a merge conflict
	 * (for example a previously applied local change might be undone, then reapplied differently or not at all).
	 *
	 * TODO: define and document event ordering (ex: bottom up, with nodeChanged before treeChange on each level).
	 *
	 * This defines a property which is a function instead of using the method syntax to avoid function bi-variance issues with the input data to the callback.
	 */
	nodeChanged: (
		data: NodeChangedData<TNode> &
			// For object and Map nodes, make properties specific to them required instead of optional:
			(TNode extends WithType<string, NodeKind.Map | NodeKind.Object>
				? Required<Pick<NodeChangedData<TNode>, "changedProperties">>
				: unknown),
	) => void;
}

/**
 * Extensions to {@link Tree} which are not yet stable.
 * @sealed @beta
 */
export const TreeBeta = {
	/**
	 * Register an event listener on the given node.
	 * @param node - The node whose events should be subscribed to.
	 * @param eventName - Which event to subscribe to.
	 * @param listener - The callback to trigger for the event. The tree can be read during the callback, but it is invalid to modify the tree during this callback.
	 * @returns A callback function which will deregister the event.
	 * This callback should be called only once.
	 */
	on<K extends keyof TreeChangeEventsBeta<TNode>, TNode extends TreeNode>(
		node: TNode,
		eventName: K,
		listener: NoInfer<TreeChangeEventsBeta<TNode>[K]>,
	): () => void {
		return treeNodeApi.on(node, eventName, listener);
	},

	create<TSchema extends ImplicitFieldSchema>(
		schema: TSchema,
		data: InsertableTreeFieldFromImplicitField<TSchema>,
	): Unhydrated<TreeFieldFromImplicitField<TSchema>> {
		return createFromInsertable(schema, data);
	},
	createFromVerbose,
	clone,
	cloneToVerbose,
	cloneToJson,
} as const;
