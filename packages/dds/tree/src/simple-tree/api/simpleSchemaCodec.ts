/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { unreachableCase, transformMapValues } from "@fluidframework/core-utils/internal";
import type { OldestSupportedClientVersion } from "@fluidframework/runtime-definitions/internal";
import { lowestMinVersionForCollab } from "@fluidframework/runtime-utils/internal";
import { UsageError } from "@fluidframework/telemetry-utils/internal";

import {
	DiscriminatedUnionDispatcher,
	FluidClientVersion,
	FormatValidatorNoOp,
	type FormatValidator,
	VersionDispatchingCodecBuilder,
} from "../../codec/index.js";
import type { ValueSchema } from "../../core/index.js";
import { objectToMap, type JsonCompatibleReadOnly } from "../../util/index.js";
import { createSchemaUpgrade, NodeKind, SchemaUpgrade } from "../core/index.js";
import type { FieldKind } from "../fieldSchema.js";
import type {
	SimpleAllowedTypeAttributes,
	SimpleArrayNodeSchema,
	SimpleFieldSchema,
	SimpleLeafNodeSchema,
	SimpleMapNodeSchema,
	SimpleNodeSchema,
	SimpleObjectFieldSchema,
	SimpleObjectNodeSchema,
	SimpleRecordNodeSchema,
	SimpleTreeSchema,
} from "../simpleSchema.js";
import * as FormatV1 from "../simpleSchemaFormatV1.js";
import * as FormatV2 from "../simpleSchemaFormatV2.js";

type EncodedField = FormatV1.SimpleFieldSchemaFormat & { isStagedOptional?: boolean };
type EncodedObjectField = FormatV1.SimpleObjectFieldSchemaFormat & {
	isStagedOptional?: boolean;
};
type SimpleSchemaFormatVersion =
	(typeof FormatV1.SimpleSchemaFormatVersion)[keyof typeof FormatV1.SimpleSchemaFormatVersion];

const simpleSchemaCodecBuilder = VersionDispatchingCodecBuilder.build(
	"SimpleSchemaCompatibilitySnapshot",
	[
		{
			minVersionForCollab: lowestMinVersionForCollab,
			formatVersion: FormatV1.SimpleSchemaFormatVersion.v1,
			codec: {
				encode: (data: SimpleTreeSchema) =>
					encodeSchema(data, FormatV1.SimpleSchemaFormatVersion.v1),
				decode: (data: FormatV1.SimpleTreeSchemaFormat) => decodeSchema(data),
				schema: FormatV1.SimpleTreeSchemaFormat,
			},
		},
		{
			minVersionForCollab: FluidClientVersion.v3_1,
			formatVersion: FormatV1.SimpleSchemaFormatVersion.v2,
			codec: {
				encode: (data: SimpleTreeSchema) =>
					encodeSchema(data, FormatV1.SimpleSchemaFormatVersion.v2),
				decode: (data: FormatV2.SimpleTreeSchemaFormat) => decodeSchema(data),
				schema: FormatV2.SimpleTreeSchemaFormat,
			},
		},
	],
);

/**
 * Encodes the compatibility impacting subset of simple schema (view or stored) into a serializable format.
 *
 * @remarks The JSON-compatible schema returned from this method is only intended for use in snapshots/comparisons of schemas.
 * It is not possible to reconstruct a full schema (including metadata and persistedMetadata) from the encoded format.
 * @param simpleSchema - The tree schema to convert.
 * @param oldestSupportedClientVersion - The oldest Fluid Framework client version that must be able to read the snapshot.
 * @returns A serializable representation of the schema.
 *
 * @privateRemarks
 * Encodes to {@link Format.SimpleTreeSchemaFormat}.
 *
 * TODO: a simple high level API for snapshot based schema compatibility checking should replace the need to export this.
 *
 * @alpha
 */
export function encodeSchemaCompatibilitySnapshot(
	simpleSchema: SimpleTreeSchema,
	oldestSupportedClientVersion: OldestSupportedClientVersion = lowestMinVersionForCollab,
): JsonCompatibleReadOnly {
	const codec = simpleSchemaCodecBuilder.build({
		minVersionForCollab: oldestSupportedClientVersion,
		jsonValidator: FormatValidatorNoOp,
	});
	return codec.encode(simpleSchema, undefined);
}

function encodeSchema(
	simpleSchema: SimpleTreeSchema,
	version: typeof FormatV1.SimpleSchemaFormatVersion.v1,
): FormatV1.SimpleTreeSchemaFormat;
function encodeSchema(
	simpleSchema: SimpleTreeSchema,
	version: typeof FormatV1.SimpleSchemaFormatVersion.v2,
): FormatV2.SimpleTreeSchemaFormat;
function encodeSchema(
	simpleSchema: SimpleTreeSchema,
	version: SimpleSchemaFormatVersion,
): FormatV1.SimpleTreeSchemaFormat | FormatV2.SimpleTreeSchemaFormat {
	// Convert types to serializable forms
	const encodedDefinitions: FormatV1.SimpleSchemaDefinitionsFormat = {};

	for (const [identifier, schema] of simpleSchema.definitions) {
		const encodedDefinition = encodeNodeSchema(schema, version);
		encodedDefinitions[identifier] = encodedDefinition;
	}

	const root = encodeField(simpleSchema.root, version);
	if (version === FormatV1.SimpleSchemaFormatVersion.v1) {
		const encodedV1: FormatV1.SimpleTreeSchemaFormat = {
			version,
			root,
			definitions: encodedDefinitions,
		};
		return encodedV1;
	}

	const encodedV2: FormatV2.SimpleTreeSchemaFormat = {
		version,
		root,
		definitions: encodedDefinitions,
	};
	return encodedV2;
}

/**
 * Decodes a JSON-compatible schema into a simple schema.
 * @param encodedSchema - The encoded schema to decode.
 * @param validator - The format validator to use to validate the encoded schema.
 * @returns A decoded simple schema.
 * @throws Will throw a usage error if the encoded schema is not in the expected format.
 *
 * @privateRemarks
 * If a validator is not provided, this implicitly performs an unsafe type conversion:
 * this is something our user facing APIs generally avoid doing, and should be reconsidered before stabilizing.
 *
 * TODO: a simple high level API for snapshot based schema compatibility checking should replace the need to export this.
 *
 * @alpha
 */
export function decodeSchemaCompatibilitySnapshot(
	encodedSchema: JsonCompatibleReadOnly,
	validator?: FormatValidator,
): SimpleTreeSchema {
	const codec = simpleSchemaCodecBuilder.buildDecoder({
		jsonValidator: validator ?? FormatValidatorNoOp,
	});
	return codec.decode(encodedSchema, undefined);
}

function decodeSchema(
	encodedSchema: FormatV1.SimpleTreeSchemaFormat | FormatV2.SimpleTreeSchemaFormat,
): SimpleTreeSchema {
	return {
		root: decodeSimpleFieldSchema(encodedSchema.root),
		definitions: new Map(
			transformMapValues(objectToMap(encodedSchema.definitions), (value, key) => {
				return decodeNodeSchema(value);
			}),
		),
	};
}

/**
 * Encodes a node schema to a serializable object.
 * @param schema - The node schema to convert.
 * @returns A serializable representation of the node schema.
 */
function encodeNodeSchema(
	schema: SimpleNodeSchema,
	version: SimpleSchemaFormatVersion,
): FormatV1.SimpleNodeSchemaUnionFormat {
	const kind = schema.kind;
	switch (kind) {
		case NodeKind.Leaf: {
			return { leaf: encodeLeafNode(schema) };
		}
		case NodeKind.Array: {
			return { array: encodeContainerNode(schema) };
		}
		case NodeKind.Map: {
			return { map: encodeContainerNode(schema) };
		}
		case NodeKind.Record: {
			return { record: encodeContainerNode(schema) };
		}
		case NodeKind.Object: {
			return { object: encodeObjectNode(schema, version) };
		}
		default: {
			unreachableCase(kind);
		}
	}
}

/**
 * Encodes a leaf node schema to a serializable object.
 * @param schema - The leaf node schema to convert.
 * @returns A serializable representation of the leaf node schema.
 */
function encodeLeafNode(schema: SimpleLeafNodeSchema): FormatV1.SimpleLeafNodeSchemaFormat {
	return {
		kind: schema.kind,
		leafKind: schema.leafKind,
	};
}

/**
 * Encodes a container node schema (a simple schema that is a Map, Array, or Record) to a serializable object.
 * @param schema - The container node schema to convert.
 * @returns A serializable representation of the container node schema. Includes the `kind` for disambiguation between different
 * container kinds.
 */
function encodeContainerNode(
	schema: SimpleArrayNodeSchema | SimpleMapNodeSchema | SimpleRecordNodeSchema,
):
	| FormatV1.SimpleArrayNodeSchemaFormat
	| FormatV1.SimpleMapNodeSchemaFormat
	| FormatV1.SimpleRecordNodeSchemaFormat {
	return {
		kind: schema.kind,
		simpleAllowedTypes: encodeSimpleAllowedTypes(schema.simpleAllowedTypes),
	};
}

/**
 * Encodes a simple allowed types map to a serializable object. Needed because JSON serialization does not support Maps.
 * @param simpleAllowedTypes - The simple allowed types map to convert.
 * @returns A serializable representation of the simple allowed types.
 */
function encodeSimpleAllowedTypes(
	simpleAllowedTypes: ReadonlyMap<string, SimpleAllowedTypeAttributes>,
): FormatV1.SimpleAllowedTypesFormat {
	const encodedAllowedTypes: FormatV1.SimpleAllowedTypesFormat = {};
	for (const [identifier, attributes] of simpleAllowedTypes) {
		const isStaged = attributes.isStaged instanceof SchemaUpgrade ? true : attributes.isStaged;
		encodedAllowedTypes[identifier] = { isStaged };
	}
	return encodedAllowedTypes;
}

/**
 * Encodes an object node schema to a serializable object.
 * @param schema - The object node schema to convert.
 * @returns A serializable representation of the object node schema.
 */
function encodeObjectNode(
	schema: SimpleObjectNodeSchema,
	version: SimpleSchemaFormatVersion,
): FormatV1.SimpleObjectNodeSchemaFormat {
	const encodedFields: Record<string, EncodedObjectField> = {};
	for (const [fieldKey, fieldSchema] of schema.fields) {
		encodedFields[fieldKey] = encodeObjectField(fieldSchema, version);
	}

	return {
		kind: schema.kind,
		fields: encodedFields,
		allowUnknownOptionalFields: schema.allowUnknownOptionalFields,
	};
}

/**
 * Encodes an object field schema to a serializable object.
 * @param fieldSchema - The object field schema to convert.
 * @returns A serializable representation of the object field schema.
 */
function encodeObjectField(
	fieldSchema: SimpleObjectFieldSchema,
	version: SimpleSchemaFormatVersion,
): EncodedObjectField {
	const encodedField = encodeField(fieldSchema, version);
	return { ...encodedField, storedKey: fieldSchema.storedKey };
}

/**
 * Encodes a field schema to a serializable object.
 * @param fieldSchema - The field schema to convert.
 * @returns A serializable representation of the field schema.
 */
function encodeField(
	fieldSchema: SimpleFieldSchema,
	version: SimpleSchemaFormatVersion,
): EncodedField {
	const isStagedOptional =
		fieldSchema.isStagedOptional !== undefined && fieldSchema.isStagedOptional !== false;
	if (isStagedOptional && version === FormatV1.SimpleSchemaFormatVersion.v1) {
		throw new UsageError(
			`Staged optional fields require oldestSupportedClientVersion to be at least ${FluidClientVersion.v3_1}.`,
		);
	}
	return {
		kind: fieldSchema.kind,
		simpleAllowedTypes: encodeSimpleAllowedTypes(fieldSchema.simpleAllowedTypes),
		...(isStagedOptional ? { isStagedOptional: true } : {}),
	};
}

const decodeNodeSchemaDispatcher: DiscriminatedUnionDispatcher<
	FormatV2.SimpleNodeSchemaUnionFormat,
	[],
	| SimpleLeafNodeSchema
	| SimpleArrayNodeSchema
	| SimpleMapNodeSchema
	| SimpleRecordNodeSchema
	| SimpleObjectNodeSchema
> = new DiscriminatedUnionDispatcher({
	leaf: decodeLeafNode,
	array: decodeContainerNode,
	map: decodeContainerNode,
	record: decodeContainerNode,
	object: decodeObjectNode,
});

/**
 * Decodes a node schema from a JSON-compatible object.
 * @param encodedNodeSchema - The encoded node schema to decode.
 * @returns The decoded node schema.
 */
function decodeNodeSchema(
	encodedNodeSchema: FormatV2.SimpleNodeSchemaUnionFormat,
):
	| SimpleLeafNodeSchema
	| SimpleArrayNodeSchema
	| SimpleMapNodeSchema
	| SimpleRecordNodeSchema
	| SimpleObjectNodeSchema {
	return decodeNodeSchemaDispatcher.dispatch(encodedNodeSchema);
}

/**
 * Decodes a container node schema (array, map, record) from a JSON-compatible object.
 * @param encodedContainerSchema - The encoded schema to decode.
 * @returns The decoded container node schema.
 */
function decodeContainerNode(
	encodedContainerSchema:
		| FormatV1.SimpleArrayNodeSchemaFormat
		| FormatV1.SimpleMapNodeSchemaFormat
		| FormatV1.SimpleRecordNodeSchemaFormat,
): SimpleArrayNodeSchema | SimpleMapNodeSchema | SimpleRecordNodeSchema {
	return {
		kind: encodedContainerSchema.kind as NodeKind.Array | NodeKind.Map | NodeKind.Record,
		simpleAllowedTypes: decodeSimpleAllowedTypes(encodedContainerSchema.simpleAllowedTypes),
		// We cannot encode persistedMetadata or metadata, so we explicitly set them to empty values.
		persistedMetadata: undefined,
		metadata: {},
	};
}

/**
 * Decodes a leaf node schema from a JSON-compatible object.
 * @param encodedLeafSchema - The encoded leaf node schema.
 * @returns The decoded leaf node schema.
 */
function decodeLeafNode(
	encodedLeafSchema: FormatV1.SimpleLeafNodeSchemaFormat,
): SimpleLeafNodeSchema {
	return {
		kind: NodeKind.Leaf,
		leafKind: encodedLeafSchema.leafKind as ValueSchema,
		// We cannot encode persistedMetadata or metadata, so we explicitly set them to empty values.
		persistedMetadata: undefined,
		metadata: {},
	};
}

/**
 * Decodes a object node schema from a JSON-compatible object.
 * @param encodedObjectSchema - The encoded object node schema.
 * @returns The decoded object node schema.
 */
function decodeObjectNode(
	encodedObjectSchema: FormatV2.SimpleObjectNodeSchemaFormat,
): SimpleObjectNodeSchema {
	return {
		kind: NodeKind.Object,
		fields: decodeObjectFields(encodedObjectSchema.fields),
		// It is possible for allowUnknownOptionalFields to be undefined. This happens when serializing a Simple Schema derived
		// from a stored schema.
		allowUnknownOptionalFields: encodedObjectSchema.allowUnknownOptionalFields,
		// We cannot encode persistedMetadata or metadata, so we explicitly set them to empty values when decoding.
		persistedMetadata: undefined,
		metadata: {},
	};
}

/**
 * Decodes a map of object fields from a JSON-compatible object.
 * @param encodedFields - The encoded fields.
 * @returns A map of the decoded object fields.
 */
function decodeObjectFields(
	encodedFields: FormatV2.SimpleObjectFieldSchemasFormat,
): ReadonlyMap<string, SimpleObjectFieldSchema> {
	const fields = new Map<string, SimpleObjectFieldSchema>();
	for (const [fieldKey, fieldSchema] of Object.entries(encodedFields)) {
		fields.set(fieldKey, decodeObjectField(fieldSchema));
	}
	return fields;
}

/**
 * Decodes a {@link SimpleObjectFieldSchema} from a JSON-compatible object.
 * @param encodedField - The encoded field schema.
 * @returns The decoded simple object field schema.
 */
function decodeObjectField(
	encodedField: FormatV2.SimpleObjectFieldSchemaFormat,
): SimpleObjectFieldSchema {
	const baseField = decodeSimpleFieldSchema(encodedField);
	return {
		...baseField,
		storedKey: encodedField.storedKey,
	};
}

/**
 * Decodes a {@link SimpleFieldSchema} from a JSON-compatible object.
 * @param encodedField - The encoded field schema.
 * @returns The decoded simple field schema.
 */
function decodeSimpleFieldSchema(
	encodedField: FormatV2.SimpleFieldSchemaFormat,
): SimpleFieldSchema {
	const isStagedOptional =
		encodedField.isStagedOptional === true ? createSchemaUpgrade() : undefined;
	return {
		kind: encodedField.kind as FieldKind,
		simpleAllowedTypes: decodeSimpleAllowedTypes(encodedField.simpleAllowedTypes),
		...(isStagedOptional === undefined ? {} : { isStagedOptional }),
		// We cannot encode persistedMetadata or metadata, so we explicitly set them to empty values when decoding.
		persistedMetadata: undefined,
		metadata: {},
	};
}

/**
 * Decodes a simple allowed types map from a JSON-compatible object.
 * @param encodedAllowedTypes - The encoded simple allowed types.
 * @returns A map of the decoded simple allowed types.
 */
function decodeSimpleAllowedTypes(
	encodedAllowedTypes: FormatV1.SimpleAllowedTypesFormat,
): ReadonlyMap<string, SimpleAllowedTypeAttributes> {
	const untypedMap = objectToMap(encodedAllowedTypes);

	const simpleAllowedTypes = transformMapValues(
		untypedMap,
		(value): SimpleAllowedTypeAttributes => {
			const isStaged = value.isStaged === true ? createSchemaUpgrade() : value.isStaged;
			return { isStaged };
		},
	);

	return simpleAllowedTypes;
}
