/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

export {
	EmptyKey,
	FieldKey,
	TreeType,
	Value,
	TreeValue,
	AnchorSet,
	DetachedField,
	UpPath,
	Range,
	RangeUpPath,
	PlaceUpPath,
	DetachedRangeUpPath,
	DetachedPlaceUpPath,
	PlaceIndex,
	NodeIndex,
	FieldUpPath,
	Anchor,
	RootField,
	ChildCollection,
	ChildLocation,
	DeltaVisitor,
	AnnouncedVisitor,
	FieldMapObject,
	NodeData,
	GenericTreeNode,
	JsonableTree,
	ProtoNodes,
	DeltaRoot,
	DeltaProtoNode,
	DeltaMark,
	DeltaDetachedNodeId,
	DeltaFieldMap,
	DeltaDetachedNodeChanges,
	DeltaDetachedNodeBuild,
	DeltaDetachedNodeDestruction,
	DeltaDetachedNodeRename,
	DeltaFieldChanges,
	RevisionTag,
	rootFieldKey,
	rootField,
	ITreeCursor,
	CursorLocationType,
	ITreeCursorSynchronous,
	GenericFieldsNode,
	AnchorLocator,
	TreeNavigationResult,
	IEditableForest,
	IForestSubscription,
	TreeLocation,
	FieldLocation,
	ForestLocation,
	ITreeSubscriptionCursor,
	ITreeSubscriptionCursorState,
	TreeNodeSchemaIdentifier,
	TreeFieldStoredSchema,
	ValueSchema,
	TreeNodeStoredSchema,
	TreeStoredSchemaSubscription,
	FieldKindIdentifier,
	TreeTypeSet,
	TreeStoredSchema,
	FieldAnchor,
	SchemaEvents,
	ChangesetLocalId,
	ForestEvents,
	PathRootPrefix,
	AnchorSlot,
	AnchorNode,
	anchorSlot,
	UpPathDefault,
	AnchorEvents,
	AnchorSetRootEvents,
	FieldKindData,
	AllowedUpdateType,
	PathVisitor,
	Adapters,
	TreeAdapter,
	MapTree,
	Revertible,
	CommitKind,
	RevertibleStatus,
	CommitMetadata,
	forbiddenFieldKindIdentifier,
	StoredSchemaCollection,
	ErasedTreeNodeSchemaDataFormat,
	ObjectNodeStoredSchema,
	MapNodeStoredSchema,
	LeafNodeStoredSchema,
	Multiplicity,
} from "./core/index.js";

export {
	Brand,
	Opaque,
	extractFromOpaque,
	brand,
	ValueFromBranded,
	NameFromBranded,
	JsonCompatibleReadOnly,
	JsonCompatible,
	JsonCompatibleObject,
	NestedMap,
	fail,
	IdAllocator,
	TransactionResult,
	BrandedKey,
	BrandedMapSubset,
	RangeQueryResult,
	Named,
	oneFromSet,
	disposeSymbol,
	IDisposable,
} from "./util/index.js";

export {
	Events,
	IsEvent,
	ISubscribable,
	createEmitter,
	IEmitter,
	NoListenersCallback,
	HasListeners,
} from "./events/index.js";

export { leaf } from "./domains/index.js";

export {
	FlexFieldKind,
	isNeverField,
	FullSchemaPolicy,
	typeNameSymbol,
	valueSymbol,
	ContextuallyTypedNodeDataObject,
	ContextuallyTypedNodeData,
	MarkedArrayLike,
	isContextuallyTypedNodeDataObject,
	defaultSchemaPolicy,
	jsonableTreeFromCursor,
	StableNodeKey,
	LocalNodeKey,
	compareLocalNodeKeys,
	IDefaultEditBuilder,
	ValueFieldEditBuilder,
	OptionalFieldEditBuilder,
	SequenceFieldEditBuilder,
	prefixPath,
	prefixFieldPath,
	cursorForJsonableTreeNode,
	stackTreeNodeCursor,
	CursorAdapter,
	CursorWithNode,
	FlexTreeNodeEvents,
	ArrayLikeMut,
	FieldKinds,
	ContextuallyTypedFieldData,
	cursorFromContextualData,
	FlexAllowedTypes,
	FlexTreeNodeSchema,
	FlexTreeSchema,
	SchemaLibrary,
	SchemaLibraryData,
	FlexFieldSchema,
	Any,
	NewFieldContent,
	NodeExistsConstraint,
	cursorForTypedTreeData,
	LazyTreeNodeSchema,
	FieldGenerator,
	TreeDataContext,
	nodeKeyFieldKey,
	SchemaLintConfiguration,
	TreeStatus,
	FlexTreeFieldNode,
	FlexibleFieldContent,
	FlexibleNodeContent,
	FlexTreeLeafNode,
	FlexTreeMapNode,
	FlexTreeOptionalField,
	FlexTreeRequiredField,
	FlexTreeSequenceField,
	FlexTreeObjectNode,
	FlexTreeObjectNodeTyped,
	AssignableFieldKinds,
	FlexTreeContext,
	FlexTreeTypedField,
	FlexTreeTypedNode,
	FlexTreeTypedNodeUnion,
	FlexTreeEntity,
	FlexTreeField,
	FlexTreeNode,
	TreeNodeSchemaBase,
	FlexFieldNodeSchema,
	LeafNodeSchema,
	FlexMapNodeSchema,
	FlexObjectNodeSchema,
	CheckTypesOverlap,
	SchemaBuilderBase,
	FlexImplicitFieldSchema,
	FlexImplicitAllowedTypes,
	Unenforced,
	schemaIsFieldNode,
	schemaIsLeaf,
	schemaIsMap,
	schemaIsObjectNode,
	AllowedTypeSet,
	SchemaBuilderOptions,
	TreeEvent,
	SchemaCollection,
	TreeCompressionStrategy,
	treeSchemaFromStoredSchema,
	encodeTreeSchema,
	stackTreeFieldCursor,
	FlexTreeUnknownUnboxed,
	InsertableFlexNode,
	InsertableFlexField,
	AllowedTypesToFlexInsertableTree,
	ApplyMultiplicity,
	NormalizeObjectNodeFields,
	NormalizeFieldSchema,
	FlexObjectNodeFields,
	FlexMapFieldSchema,
	ExtractItemType,
	LazyItem,
	PropertyNameFromFieldKey,
	ReservedObjectNodeFieldPropertyNames,
	ReservedObjectNodeFieldPropertyNamePrefixes,
	reservedObjectNodeFieldPropertyNames,
	reservedObjectNodeFieldPropertyNamePrefixes,
	FlexTreeObjectNodeFieldsInner,
} from "./feature-libraries/index.js";

export {
	ISharedTree,
	ITreeCheckout,
	ITransaction,
	runSynchronous,
	SharedTreeFactory,
	SharedTreeOptions,
	ITreeCheckoutFork,
	CheckoutEvents,
	SchematizeConfiguration,
	TreeContent,
	InitializeAndSchematizeConfiguration,
	SchemaConfiguration,
	ForestType,
	SharedTreeContentSnapshot,
	FlexTreeView,
	ITreeViewFork,
	buildTreeConfiguration,
	ISharedTreeEditor,
	ISchemaEditor,
	SharedTreeFormatOptions,
	SharedTreeFormatVersion,
	Tree,
	TreeApi,
} from "./shared-tree/index.js";

export {
	TreeArrayNode,
	Unhydrated,
	IterableTreeArrayContent,
	TreeNode,
	TreeArrayNodeBase,
	ITree,
	TreeNodeSchema,
	TreeConfiguration,
	TreeView,
	TreeViewEvents,
	SchemaFactory,
	type ScopedSchemaName,
	TreeNodeApi,
	ImplicitFieldSchema,
	TreeFieldFromImplicitField,
	TreeChangeEvents,
	NodeFromSchema,
	TreeMapNode,
	InsertableTreeNodeFromImplicitAllowedTypes,
	TreeLeafValue,
	type,
	WithType,
	AllowedTypes,
	ApplyKind,
	FieldKind,
	FieldSchema,
	ImplicitAllowedTypes,
	InsertableObjectFromSchemaRecord,
	InsertableTreeFieldFromImplicitField,
	InsertableTypedNode,
	NodeBuilderData,
	NodeKind,
	ObjectFromSchemaRecord,
	TreeObjectNode,
	TreeNodeFromImplicitAllowedTypes,
	TreeNodeSchemaClass,
	TreeNodeSchemaCore,
	TreeNodeSchemaNonClass,
	SchemaIncompatible,

	// experimental @beta APIs:
	SchemaFactoryRecursive,
	ValidateRecursiveSchema,
	ObjectFromSchemaRecordUnsafe,
	TreeObjectNodeUnsafe,
	TreeFieldFromImplicitFieldUnsafe,
	TreeNodeFromImplicitAllowedTypesUnsafe,
	FieldSchemaUnsafe,
	InsertableTreeNodeFromImplicitAllowedTypesUnsafe,
	TreeArrayNodeUnsafe,
	TreeMapNodeUnsafe,
	InsertableObjectFromSchemaRecordUnsafe,
	InsertableTreeFieldFromImplicitFieldUnsafe,
	InsertableTypedNodeUnsafe,
	NodeBuilderDataUnsafe,
	NodeFromSchemaUnsafe,
	type FieldProps,

	// experimental @internal APIs:
	adaptEnum,
	enumFromStrings,
	singletonSchema,
	typedObjectValues,

	// test recursive schema for checking that d.ts files handles schema correctly
	test_RecursiveObject,
	test_RecursiveObject_base,
	test_RecursiveObjectPojoMode,
} from "./simple-tree/index.js";
export { SharedTree, configuredSharedTree } from "./treeFactory.js";

export type { ICodecOptions, JsonValidator, SchemaValidationFunction } from "./codec/index.js";
export { noopValidator } from "./codec/index.js";
export { typeboxValidator } from "./external-utilities/index.js";

// TODO: When previously tagged '@internal', these types could not be included in `InternalClassTreeTypes` due to https://github.com/microsoft/rushstack/issues/3639
export {
	Invariant,
	Contravariant,
	Covariant,
	BrandedType,
	ExtractFromOpaque,
	Assume,
	AllowOptional,
	RequiredFields,
	OptionalFields,
	_InlineTrick,
	_RecursiveTrick,
	FlattenKeys,
	AllowOptionalNotFlattened,
	isAny,
	BrandedKeyContent,
	ErasedType,
	Erased,
	RestrictiveReadonlyRecord,
	MakeNominal,
} from "./util/index.js";

export {
	NormalizeField,
	NormalizeAllowedTypes,
	FlexTreeTypedFieldInner,
	FlexTreeUnboxFieldInner,
	FlexTreeObjectNodeFields,
	FlexTreeUnboxField,
	FlexTreeUnboxNode,
	FlexTreeUnboxNodeUnion,
	FlexTreeNodeKeyField,
	IsArrayOfOne,
	FlexibleNodeSubSequence,
	flexTreeMarker,
	FlexTreeEntityKind,
	NodeKeys,
	CollectOptions,
	TypedFields,
	UnbrandedName,
	EmptyObject,
	FlexList,
	FlexListToUnion,

	// These field kind types really only need to show up via FieldKinds.name, and not as top level names in the package.
	// These names also are collision prone.
	Required,
	Optional,
	NodeKeyFieldKind,
	Forbidden,
	Sequence,
} from "./feature-libraries/index.js";
