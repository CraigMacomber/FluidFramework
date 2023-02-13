/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

export {
	brand,
	brandArray,
	Brand,
	BrandedType,
	brandOpaque,
	extractFromOpaque,
	ExtractFromOpaque,
	NameFromBranded,
	Opaque,
	ValueFromBranded,
} from "./brand";
export {
	deleteFromNestedMap,
	getOrAddInMap,
	getOrAddInNestedMap,
	getOrDefaultInNestedMap,
	NestedMap,
	SizedNestedMap,
	setInNestedMap,
	tryAddToNestedMap,
	tryGetFromNestedMap,
} from "./nestedMap";
export { addToNestedSet, NestedSet, nestedSetContains } from "./nestedSet";
export { OffsetList, OffsetListFactory } from "./offsetList";
export {
	areSafelyAssignable,
	Bivariant,
	Contravariant,
	Covariant,
	eitherIsAny,
	EnforceTypeCheckTests,
	Invariant,
	isAny,
	isAssignableTo,
	isStrictSubset,
	MakeNominal,
	requireFalse,
	requireTrue,
	requireAssignableTo,
} from "./typeCheck";
export { StackyIterator } from "./stackyIterator";
export {
	clone,
	compareArrays,
	compareSets,
	fail,
	getOrAddEmptyToMap,
	getOrCreate,
	isJsonObject,
	isReadonlyArray,
	JsonCompatible,
	JsonCompatibleObject,
	JsonCompatibleReadOnly,
	makeArray,
	Mutable,
	RecursiveReadonly,
} from "./utils";
