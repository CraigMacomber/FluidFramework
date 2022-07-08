/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { Brand, Opaque } from "../util";

export type FieldKey = Brand<number | string, "FieldKey">;
export type TreeType = Brand<number | string, "TreeType">;

/**
 * The empty key ("") is used for unnamed relationships, such as the indexer
 * of an explicit array node.
 */
export const EmptyKey = "" as const as FieldKey;

/**
 * Location of a tree relative to is parent container (which can be a tree or forest).
 *
 * @public
 */
 export interface ChildLocation {
    readonly container: ChildCollection;
    readonly index: number;
}

/**
 * Wrapper around DetachedRange that can be detected at runtime.
 */
export interface RootRange {
	readonly key: DetachedRange;
}

/**
 * Identifier for a child collection, either on a node/tree or at the root of a forest.
 */
export type ChildCollection = FieldKey | RootRange;

// TODO: its not clear how much DetachedRange belongs here in tree,
// but for now as its needed in Rebase and Forest,
// it makes sense to have it here for reasoning about the roots of trees.
/**
 * A root in the forest.
 *
 * The range is a "container" like a field:
 * any additional content inserted before or after contents of this range will be included in the range.
 * This also means that moving the content from this range elsewhere will leave this range valid, but empty.
 *
 * DetachedRanges are not valid to use as across edits:
 * they are only valid within the edit in which they were created.
 */
export type DetachedRange = Opaque<Brand<number, "tree.DetachedRange">>;

/**
 * TODO: integrate this into Schema. Decide how to persist them (need stable Id?). Maybe allow updating field kinds?.
 * TODO: make families of changes per field kind. Build editing APIs from that.
 * TODO: factor ChangeRebaser implementations to support adding new field kinds.
 */
export interface FieldKind {
    readonly name: string;
    readonly description: string;
    readonly minimumChildren: number;
    readonly maximumChildren: number;
}
