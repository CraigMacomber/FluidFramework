/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

/*
 * THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
 * Generated by fluid-type-test-generator in @fluidframework/build-tools.
 */

import type * as old from "@fluidframework/matrix-previous";
import type * as current from "../../index.js";


// See 'build-tools/src/type-test-generator/compatibility.ts' for more information.
type TypeOnly<T> = T extends number
	? number
	: T extends string
	? string
	: T extends boolean | bigint | symbol
	? T
	: {
			[P in keyof T]: TypeOnly<T[P]>;
	  };

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IRevertible": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_IRevertible():
    TypeOnly<old.IRevertible>;
declare function use_current_InterfaceDeclaration_IRevertible(
    use: TypeOnly<current.IRevertible>): void;
use_current_InterfaceDeclaration_IRevertible(
    get_old_InterfaceDeclaration_IRevertible());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IRevertible": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_IRevertible():
    TypeOnly<current.IRevertible>;
declare function use_old_InterfaceDeclaration_IRevertible(
    use: TypeOnly<old.IRevertible>): void;
use_old_InterfaceDeclaration_IRevertible(
    get_current_InterfaceDeclaration_IRevertible());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ISharedMatrixEvents": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_ISharedMatrixEvents():
    TypeOnly<old.ISharedMatrixEvents<any>>;
declare function use_current_InterfaceDeclaration_ISharedMatrixEvents(
    use: TypeOnly<current.ISharedMatrixEvents<any>>): void;
use_current_InterfaceDeclaration_ISharedMatrixEvents(
    get_old_InterfaceDeclaration_ISharedMatrixEvents());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ISharedMatrixEvents": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_ISharedMatrixEvents():
    TypeOnly<current.ISharedMatrixEvents<any>>;
declare function use_old_InterfaceDeclaration_ISharedMatrixEvents(
    use: TypeOnly<old.ISharedMatrixEvents<any>>): void;
use_old_InterfaceDeclaration_ISharedMatrixEvents(
    get_current_InterfaceDeclaration_ISharedMatrixEvents());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IUndoConsumer": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_IUndoConsumer():
    TypeOnly<old.IUndoConsumer>;
declare function use_current_InterfaceDeclaration_IUndoConsumer(
    use: TypeOnly<current.IUndoConsumer>): void;
use_current_InterfaceDeclaration_IUndoConsumer(
    get_old_InterfaceDeclaration_IUndoConsumer());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IUndoConsumer": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_IUndoConsumer():
    TypeOnly<current.IUndoConsumer>;
declare function use_old_InterfaceDeclaration_IUndoConsumer(
    use: TypeOnly<old.IUndoConsumer>): void;
use_old_InterfaceDeclaration_IUndoConsumer(
    get_current_InterfaceDeclaration_IUndoConsumer());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "TypeAliasDeclaration_MatrixItem": {"forwardCompat": false}
*/
declare function get_old_TypeAliasDeclaration_MatrixItem():
    TypeOnly<old.MatrixItem<any>>;
declare function use_current_TypeAliasDeclaration_MatrixItem(
    use: TypeOnly<current.MatrixItem<any>>): void;
use_current_TypeAliasDeclaration_MatrixItem(
    get_old_TypeAliasDeclaration_MatrixItem());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "TypeAliasDeclaration_MatrixItem": {"backCompat": false}
*/
declare function get_current_TypeAliasDeclaration_MatrixItem():
    TypeOnly<current.MatrixItem<any>>;
declare function use_old_TypeAliasDeclaration_MatrixItem(
    use: TypeOnly<old.MatrixItem<any>>): void;
use_old_TypeAliasDeclaration_MatrixItem(
    get_current_TypeAliasDeclaration_MatrixItem());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "RemovedClassDeclaration_SharedMatrix": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_SharedMatrix():
    TypeOnly<old.SharedMatrix>;
declare function use_current_RemovedClassDeclaration_SharedMatrix(
    use: TypeOnly<current.SharedMatrix>): void;
use_current_RemovedClassDeclaration_SharedMatrix(
    get_old_ClassDeclaration_SharedMatrix());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "RemovedClassDeclaration_SharedMatrix": {"backCompat": false}
*/

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_SharedMatrixFactory": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_SharedMatrixFactory():
    TypeOnly<old.SharedMatrixFactory>;
declare function use_current_ClassDeclaration_SharedMatrixFactory(
    use: TypeOnly<current.SharedMatrixFactory>): void;
use_current_ClassDeclaration_SharedMatrixFactory(
    get_old_ClassDeclaration_SharedMatrixFactory());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_SharedMatrixFactory": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_SharedMatrixFactory():
    TypeOnly<current.SharedMatrixFactory>;
declare function use_old_ClassDeclaration_SharedMatrixFactory(
    use: TypeOnly<old.SharedMatrixFactory>): void;
use_old_ClassDeclaration_SharedMatrixFactory(
    get_current_ClassDeclaration_SharedMatrixFactory());
