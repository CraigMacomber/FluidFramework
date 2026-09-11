/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import * as Type from "@sinclair/typebox";
import type { ObjectOptions, Static } from "@sinclair/typebox";

import {
	SimpleAllowedTypesFormat,
	SimpleSchemaFormatVersion,
} from "./simpleSchemaFormatV1.js";

const noAdditionalProps: ObjectOptions = { additionalProperties: false };

export const SimpleFieldSchemaFormat = Type.Object(
	{
		kind: Type.Integer(),
		simpleAllowedTypes: SimpleAllowedTypesFormat,
		isStagedOptional: Type.Optional(Type.Boolean()),
	},
	noAdditionalProps,
);
export type SimpleFieldSchemaFormat = Static<typeof SimpleFieldSchemaFormat>;

export const SimpleObjectFieldSchemaFormat = Type.Object(
	{
		kind: Type.Integer(),
		simpleAllowedTypes: SimpleAllowedTypesFormat,
		isStagedOptional: Type.Optional(Type.Boolean()),
		storedKey: Type.String(),
	},
	noAdditionalProps,
);
export type SimpleObjectFieldSchemaFormat = Static<typeof SimpleObjectFieldSchemaFormat>;

export const SimpleContainerNodeSchemaFormat = Type.Object(
	{
		kind: Type.Integer(),
		simpleAllowedTypes: SimpleAllowedTypesFormat,
	},
	noAdditionalProps,
);
export type SimpleContainerNodeSchemaFormat = Static<typeof SimpleContainerNodeSchemaFormat>;

export const SimpleLeafNodeSchemaFormat = Type.Object(
	{
		kind: Type.Integer(),
		leafKind: Type.Integer(),
	},
	noAdditionalProps,
);
export type SimpleLeafNodeSchemaFormat = Static<typeof SimpleLeafNodeSchemaFormat>;

export const SimpleObjectFieldSchemasFormat = Type.Record(
	Type.String(),
	SimpleObjectFieldSchemaFormat,
);
export type SimpleObjectFieldSchemasFormat = Static<typeof SimpleObjectFieldSchemasFormat>;

export const SimpleObjectNodeSchemaFormat = Type.Object(
	{
		kind: Type.Integer(),
		fields: SimpleObjectFieldSchemasFormat,
		allowUnknownOptionalFields: Type.Optional(Type.Boolean()),
	},
	noAdditionalProps,
);
export type SimpleObjectNodeSchemaFormat = Static<typeof SimpleObjectNodeSchemaFormat>;

export const SimpleNodeSchemaUnionFormat = Type.Object({
	array: Type.Optional(SimpleContainerNodeSchemaFormat),
	map: Type.Optional(SimpleContainerNodeSchemaFormat),
	record: Type.Optional(SimpleContainerNodeSchemaFormat),
	leaf: Type.Optional(SimpleLeafNodeSchemaFormat),
	object: Type.Optional(SimpleObjectNodeSchemaFormat),
});
export type SimpleNodeSchemaUnionFormat = Static<typeof SimpleNodeSchemaUnionFormat>;

export const SimpleTreeSchemaFormat = Type.Object(
	{
		version: Type.Literal(SimpleSchemaFormatVersion.v2),
		root: SimpleFieldSchemaFormat,
		definitions: Type.Record(Type.String(), SimpleNodeSchemaUnionFormat),
	},
	noAdditionalProps,
);
export type SimpleTreeSchemaFormat = Static<typeof SimpleTreeSchemaFormat>;
