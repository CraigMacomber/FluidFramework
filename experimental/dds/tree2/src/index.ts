/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

export {
	Dependee,
	Dependent,
	NamedComputation,
	ObservingDependent,
	InvalidationToken,
	recordDependency,
	SimpleDependee,
	EmptyKey,
	FieldKey,
	TreeType,
	Value,
	TreeValue,
	AnchorSet,
	DetachedField,
	UpPath,
	FieldUpPath,
	Anchor,
	RootField,
	ChildCollection,
	ChildLocation,
	FieldMapObject,
	NodeData,
	GenericTreeNode,
	JsonableTree,
	Delta,
	rootFieldKey,
	rootField,
	fieldSchema,
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
	TreeSchemaIdentifier,
	FieldStoredSchema,
	ValueSchema,
	TreeStoredSchema,
	StoredSchemaRepository,
	FieldKindIdentifier,
	TreeTypeSet,
	SchemaData,
	FieldAnchor,
	RevisionTag,
	ChangesetLocalId,
	TaggedChange,
	RepairDataStore,
	ReadonlyRepairDataStore,
	SchemaEvents,
	ForestEvents,
	PathRootPrefix,
	AnchorSlot,
	AnchorNode,
	anchorSlot,
	UpPathDefault,
	AnchorEvents,
	AnchorSetRootEvents,
	FieldKindSpecifier,
	AllowedUpdateType,
	PathVisitor,
	Adapters,
	TreeAdapter,
	MapTree,
	LocalCommitSource,
	forbiddenFieldKindIdentifier,
} from "./core";

export {
	Brand,
	Opaque,
	extractFromOpaque,
	brand,
	brandOpaque,
	ValueFromBranded,
	NameFromBranded,
	JsonCompatibleReadOnly,
	JsonCompatible,
	JsonCompatibleObject,
	NestedMap,
	fail,
	TransactionResult,
	BrandedKey,
	BrandedMapSubset,
	RangeEntry,
	Named,
} from "./util";

export {
	Events,
	IsEvent,
	ISubscribable,
	createEmitter,
	IEmitter,
	NoListenersCallback,
	HasListeners,
} from "./events";

export {
	cursorToJsonObject,
	singleJsonCursor,
	jsonArray,
	jsonBoolean,
	jsonNull,
	jsonNumber,
	jsonObject,
	jsonString,
	jsonSchema,
	nodeKeyField,
	nodeKeySchema,
} from "./domains";

export {
	IdAllocator,
	ModularChangeset,
	EditDescription,
	FieldChangeHandler,
	FieldEditor,
	FieldChangeRebaser,
	NodeChangeset,
	FieldChangeMap,
	FieldChangeset,
	FieldChange,
	ToDelta,
	NodeReviver,
	NodeChangeComposer,
	NodeChangeInverter,
	NodeChangeRebaser,
	CrossFieldManager,
	CrossFieldTarget,
	RevisionIndexer,
	RevisionMetadataSource,
	RevisionInfo,
	FieldKind,
	Multiplicity,
	isNeverField,
	FullSchemaPolicy,
	UnwrappedEditableField,
	isEditableTree,
	isEditableField,
	EditableTreeContext,
	UnwrappedEditableTree,
	EditableTreeOrPrimitive,
	EditableTree,
	EditableField,
	isPrimitiveValue,
	isPrimitive,
	getPrimaryField,
	typeSymbol,
	typeNameSymbol,
	valueSymbol,
	proxyTargetSymbol,
	getField,
	contextSymbol,
	ContextuallyTypedNodeDataObject,
	ContextuallyTypedNodeData,
	MarkedArrayLike,
	isContextuallyTypedNodeDataObject,
	defaultSchemaPolicy,
	jsonableTreeFromCursor,
	PrimitiveValue,
	StableNodeKey,
	LocalNodeKey,
	compareLocalNodeKeys,
	localNodeKeySymbol,
	IDefaultEditBuilder,
	ValueFieldEditBuilder,
	OptionalFieldEditBuilder,
	SequenceFieldEditBuilder,
	prefixPath,
	prefixFieldPath,
	singleTextCursor,
	singleStackTreeCursor,
	CursorAdapter,
	CursorWithNode,
	parentField,
	HasFieldChanges,
	EditableTreeEvents,
	on,
	InternalTypedSchemaTypes,
	SchemaAware,
	ArrayLikeMut,
	FieldKinds,
	ContextuallyTypedFieldData,
	cursorFromContextualData,
	UntypedField,
	UntypedTree,
	UntypedTreeContext,
	UntypedTreeCore,
	UnwrappedUntypedField,
	UnwrappedUntypedTree,
	UntypedTreeOrPrimitive,
	SchemaBuilder,
	FieldKindTypes,
	AllowedTypes,
	TreeSchema,
	BrandedFieldKind,
	ValueFieldKind,
	Optional,
	Sequence,
	NodeKeyFieldKind,
	Forbidden,
	TypedSchemaCollection,
	SchemaLibrary,
	SchemaLibraryData,
	FieldSchema,
	Any,
	NewFieldContent,
	NodeExistsConstraint,
	cursorForTypedTreeData,
	LazyTreeSchema,
	FieldGenerator,
	TreeDataContext,
	NodeExistenceState,
	createDataBinderBuffering,
	createDataBinderDirect,
	createDataBinderInvalidating,
	createBinderOptions,
	createFlushableBinderOptions,
	DataBinder,
	BinderOptions,
	Flushable,
	FlushableBinderOptions,
	FlushableDataBinder,
	MatchPolicy,
	BindSyntaxTree,
	indexSymbol,
	BindTree,
	BindTreeDefault,
	DownPath,
	BindPath,
	PathStep,
	BindingType,
	BindingContextType,
	BindingContext,
	VisitorBindingContext,
	DeleteBindingContext,
	InsertBindingContext,
	BatchBindingContext,
	InvalidationBindingContext,
	OperationBinderEvents,
	InvalidationBinderEvents,
	CompareFunction,
	BinderEventsCompare,
	AnchorsCompare,
	toDownPath,
	comparePipeline,
	compileSyntaxTree,
	nodeKeyFieldKey,
	SchemaLintConfiguration,
} from "./feature-libraries";

export {
	ISharedTree,
	ISharedTreeView,
	ITransaction,
	runSynchronous,
	SharedTreeFactory,
	SharedTreeOptions,
	ISharedTreeBranchView,
	ViewEvents,
	SchematizeConfiguration,
	TreeContent,
	InitializeAndSchematizeConfiguration,
} from "./shared-tree";

export type {
	IBinaryCodec,
	ICodecFamily,
	ICodecOptions,
	IDecoder,
	IEncoder,
	IJsonCodec,
	IMultiFormatCodec,
	JsonValidator,
	SchemaValidationFunction,
} from "./codec";
export { noopValidator } from "./codec";
export { typeboxValidator } from "./external-utilities";

// Below here are things that are used by the above, but not part of the desired API surface.
import * as InternalTypes from "./internal";
export { InternalTypes };
