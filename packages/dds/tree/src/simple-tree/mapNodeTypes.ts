/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import type { MapNodeInsertableData, TreeMapNode } from "./mapNode.js";
import type { ImplicitAllowedTypes } from "./schemaTypes.js";
import {
	NodeKind,
	type TreeNodeSchema,
	type TreeNodeSchemaBoth,
	type WithType,
} from "./core/index.js";
import type { SimpleMapNodeSchema } from "./simpleSchema.js";

/**
 * A schema for {@link TreeMapNode}s.
 * @sealed
 * @alpha
 */
export type MapNodeSchema<
	TClass extends boolean = boolean,
	TName extends string = string,
	T extends ImplicitAllowedTypes = ImplicitAllowedTypes,
	ImplicitlyConstructable extends boolean = boolean,
	TCustomMetadata = unknown,
> = SimpleMapNodeSchema<TCustomMetadata> &
	TreeNodeSchemaBoth<
		TClass,
		TName,
		NodeKind.Map,
		TreeMapNode<T> & WithType<TName, NodeKind.Map>,
		MapNodeInsertableData<T>,
		ImplicitlyConstructable,
		T,
		undefined,
		TCustomMetadata
	>;

/**
 * @alpha
 */
export const MapNodeSchema = {
	/**
	 * instanceof-based narrowing support for MapNodeSchema in Javascript and TypeScript 5.3 or newer.
	 */
	[Symbol.hasInstance](value: TreeNodeSchema): value is MapNodeSchema {
		return isMapNodeSchema(value);
	},
} as const;

export function isMapNodeSchema(schema: TreeNodeSchema): schema is MapNodeSchema {
	return schema.kind === NodeKind.Map;
}
