/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */
/*
 * THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
 * Generated by fluid-type-test-generator in @fluidframework/build-tools.
 */
import type * as old from "@fluidframework/register-collection-previous";
import type * as current from "../../index";


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
* "ClassDeclaration_ConsensusRegisterCollection": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_ConsensusRegisterCollection():
    TypeOnly<old.ConsensusRegisterCollection<any>>;
declare function use_current_ClassDeclaration_ConsensusRegisterCollection(
    use: TypeOnly<current.ConsensusRegisterCollection<any>>): void;
use_current_ClassDeclaration_ConsensusRegisterCollection(
    get_old_ClassDeclaration_ConsensusRegisterCollection());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_ConsensusRegisterCollection": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_ConsensusRegisterCollection():
    TypeOnly<current.ConsensusRegisterCollection<any>>;
declare function use_old_ClassDeclaration_ConsensusRegisterCollection(
    use: TypeOnly<old.ConsensusRegisterCollection<any>>): void;
use_old_ClassDeclaration_ConsensusRegisterCollection(
    get_current_ClassDeclaration_ConsensusRegisterCollection());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_ConsensusRegisterCollectionFactory": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_ConsensusRegisterCollectionFactory():
    TypeOnly<old.ConsensusRegisterCollectionFactory>;
declare function use_current_ClassDeclaration_ConsensusRegisterCollectionFactory(
    use: TypeOnly<current.ConsensusRegisterCollectionFactory>): void;
use_current_ClassDeclaration_ConsensusRegisterCollectionFactory(
    get_old_ClassDeclaration_ConsensusRegisterCollectionFactory());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_ConsensusRegisterCollectionFactory": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_ConsensusRegisterCollectionFactory():
    TypeOnly<current.ConsensusRegisterCollectionFactory>;
declare function use_old_ClassDeclaration_ConsensusRegisterCollectionFactory(
    use: TypeOnly<old.ConsensusRegisterCollectionFactory>): void;
use_old_ClassDeclaration_ConsensusRegisterCollectionFactory(
    get_current_ClassDeclaration_ConsensusRegisterCollectionFactory());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IConsensusRegisterCollection": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_IConsensusRegisterCollection():
    TypeOnly<old.IConsensusRegisterCollection>;
declare function use_current_InterfaceDeclaration_IConsensusRegisterCollection(
    use: TypeOnly<current.IConsensusRegisterCollection>): void;
use_current_InterfaceDeclaration_IConsensusRegisterCollection(
    get_old_InterfaceDeclaration_IConsensusRegisterCollection());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IConsensusRegisterCollection": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_IConsensusRegisterCollection():
    TypeOnly<current.IConsensusRegisterCollection>;
declare function use_old_InterfaceDeclaration_IConsensusRegisterCollection(
    use: TypeOnly<old.IConsensusRegisterCollection>): void;
use_old_InterfaceDeclaration_IConsensusRegisterCollection(
    get_current_InterfaceDeclaration_IConsensusRegisterCollection());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IConsensusRegisterCollectionEvents": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_IConsensusRegisterCollectionEvents():
    TypeOnly<old.IConsensusRegisterCollectionEvents>;
declare function use_current_InterfaceDeclaration_IConsensusRegisterCollectionEvents(
    use: TypeOnly<current.IConsensusRegisterCollectionEvents>): void;
use_current_InterfaceDeclaration_IConsensusRegisterCollectionEvents(
    get_old_InterfaceDeclaration_IConsensusRegisterCollectionEvents());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IConsensusRegisterCollectionEvents": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_IConsensusRegisterCollectionEvents():
    TypeOnly<current.IConsensusRegisterCollectionEvents>;
declare function use_old_InterfaceDeclaration_IConsensusRegisterCollectionEvents(
    use: TypeOnly<old.IConsensusRegisterCollectionEvents>): void;
use_old_InterfaceDeclaration_IConsensusRegisterCollectionEvents(
    get_current_InterfaceDeclaration_IConsensusRegisterCollectionEvents());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IConsensusRegisterCollectionFactory": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_IConsensusRegisterCollectionFactory():
    TypeOnly<old.IConsensusRegisterCollectionFactory>;
declare function use_current_InterfaceDeclaration_IConsensusRegisterCollectionFactory(
    use: TypeOnly<current.IConsensusRegisterCollectionFactory>): void;
use_current_InterfaceDeclaration_IConsensusRegisterCollectionFactory(
    get_old_InterfaceDeclaration_IConsensusRegisterCollectionFactory());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_IConsensusRegisterCollectionFactory": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_IConsensusRegisterCollectionFactory():
    TypeOnly<current.IConsensusRegisterCollectionFactory>;
declare function use_old_InterfaceDeclaration_IConsensusRegisterCollectionFactory(
    use: TypeOnly<old.IConsensusRegisterCollectionFactory>): void;
use_old_InterfaceDeclaration_IConsensusRegisterCollectionFactory(
    get_current_InterfaceDeclaration_IConsensusRegisterCollectionFactory());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "EnumDeclaration_ReadPolicy": {"forwardCompat": false}
*/
declare function get_old_EnumDeclaration_ReadPolicy():
    TypeOnly<old.ReadPolicy>;
declare function use_current_EnumDeclaration_ReadPolicy(
    use: TypeOnly<current.ReadPolicy>): void;
use_current_EnumDeclaration_ReadPolicy(
    get_old_EnumDeclaration_ReadPolicy());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "EnumDeclaration_ReadPolicy": {"backCompat": false}
*/
declare function get_current_EnumDeclaration_ReadPolicy():
    TypeOnly<current.ReadPolicy>;
declare function use_old_EnumDeclaration_ReadPolicy(
    use: TypeOnly<old.ReadPolicy>): void;
use_old_EnumDeclaration_ReadPolicy(
    get_current_EnumDeclaration_ReadPolicy());
