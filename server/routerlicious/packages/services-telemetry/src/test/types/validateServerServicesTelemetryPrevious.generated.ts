/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

/*
 * THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
 * Generated by fluid-type-test-generator in @fluidframework/build-tools.
 */

import type * as old from "@fluidframework/server-services-telemetry-previous";
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
* "ClassDeclaration_BaseLumberjackSchemaValidator": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_BaseLumberjackSchemaValidator():
    TypeOnly<old.BaseLumberjackSchemaValidator>;
declare function use_current_ClassDeclaration_BaseLumberjackSchemaValidator(
    use: TypeOnly<current.BaseLumberjackSchemaValidator>): void;
use_current_ClassDeclaration_BaseLumberjackSchemaValidator(
    get_old_ClassDeclaration_BaseLumberjackSchemaValidator());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_BaseLumberjackSchemaValidator": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_BaseLumberjackSchemaValidator():
    TypeOnly<current.BaseLumberjackSchemaValidator>;
declare function use_old_ClassDeclaration_BaseLumberjackSchemaValidator(
    use: TypeOnly<old.BaseLumberjackSchemaValidator>): void;
use_old_ClassDeclaration_BaseLumberjackSchemaValidator(
    get_current_ClassDeclaration_BaseLumberjackSchemaValidator());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_BasePropertiesValidator": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_BasePropertiesValidator():
    TypeOnly<old.BasePropertiesValidator>;
declare function use_current_ClassDeclaration_BasePropertiesValidator(
    use: TypeOnly<current.BasePropertiesValidator>): void;
use_current_ClassDeclaration_BasePropertiesValidator(
    get_old_ClassDeclaration_BasePropertiesValidator());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_BasePropertiesValidator": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_BasePropertiesValidator():
    TypeOnly<current.BasePropertiesValidator>;
declare function use_old_ClassDeclaration_BasePropertiesValidator(
    use: TypeOnly<old.BasePropertiesValidator>): void;
use_old_ClassDeclaration_BasePropertiesValidator(
    get_current_ClassDeclaration_BasePropertiesValidator());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_BaseSanitizationLumberFormatter": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_BaseSanitizationLumberFormatter():
    TypeOnly<old.BaseSanitizationLumberFormatter>;
declare function use_current_ClassDeclaration_BaseSanitizationLumberFormatter(
    use: TypeOnly<current.BaseSanitizationLumberFormatter>): void;
use_current_ClassDeclaration_BaseSanitizationLumberFormatter(
    get_old_ClassDeclaration_BaseSanitizationLumberFormatter());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_BaseSanitizationLumberFormatter": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_BaseSanitizationLumberFormatter():
    TypeOnly<current.BaseSanitizationLumberFormatter>;
declare function use_old_ClassDeclaration_BaseSanitizationLumberFormatter(
    use: TypeOnly<old.BaseSanitizationLumberFormatter>): void;
use_old_ClassDeclaration_BaseSanitizationLumberFormatter(
    get_current_ClassDeclaration_BaseSanitizationLumberFormatter());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "EnumDeclaration_BaseTelemetryProperties": {"forwardCompat": false}
*/
declare function get_old_EnumDeclaration_BaseTelemetryProperties():
    TypeOnly<old.BaseTelemetryProperties>;
declare function use_current_EnumDeclaration_BaseTelemetryProperties(
    use: TypeOnly<current.BaseTelemetryProperties>): void;
use_current_EnumDeclaration_BaseTelemetryProperties(
    get_old_EnumDeclaration_BaseTelemetryProperties());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "EnumDeclaration_BaseTelemetryProperties": {"backCompat": false}
*/
declare function get_current_EnumDeclaration_BaseTelemetryProperties():
    TypeOnly<current.BaseTelemetryProperties>;
declare function use_old_EnumDeclaration_BaseTelemetryProperties(
    use: TypeOnly<old.BaseTelemetryProperties>): void;
use_old_EnumDeclaration_BaseTelemetryProperties(
    get_current_EnumDeclaration_BaseTelemetryProperties());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "EnumDeclaration_CommonProperties": {"forwardCompat": false}
*/
declare function get_old_EnumDeclaration_CommonProperties():
    TypeOnly<old.CommonProperties>;
declare function use_current_EnumDeclaration_CommonProperties(
    use: TypeOnly<current.CommonProperties>): void;
use_current_EnumDeclaration_CommonProperties(
    get_old_EnumDeclaration_CommonProperties());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "EnumDeclaration_CommonProperties": {"backCompat": false}
*/
declare function get_current_EnumDeclaration_CommonProperties():
    TypeOnly<current.CommonProperties>;
declare function use_old_EnumDeclaration_CommonProperties(
    use: TypeOnly<old.CommonProperties>): void;
use_old_EnumDeclaration_CommonProperties(
    get_current_EnumDeclaration_CommonProperties());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "EnumDeclaration_HttpProperties": {"forwardCompat": false}
*/
declare function get_old_EnumDeclaration_HttpProperties():
    TypeOnly<old.HttpProperties>;
declare function use_current_EnumDeclaration_HttpProperties(
    use: TypeOnly<current.HttpProperties>): void;
use_current_EnumDeclaration_HttpProperties(
    get_old_EnumDeclaration_HttpProperties());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "EnumDeclaration_HttpProperties": {"backCompat": false}
*/
declare function get_current_EnumDeclaration_HttpProperties():
    TypeOnly<current.HttpProperties>;
declare function use_old_EnumDeclaration_HttpProperties(
    use: TypeOnly<old.HttpProperties>): void;
use_old_EnumDeclaration_HttpProperties(
    get_current_EnumDeclaration_HttpProperties());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ILumberFormatter": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_ILumberFormatter():
    TypeOnly<old.ILumberFormatter>;
declare function use_current_InterfaceDeclaration_ILumberFormatter(
    use: TypeOnly<current.ILumberFormatter>): void;
use_current_InterfaceDeclaration_ILumberFormatter(
    get_old_InterfaceDeclaration_ILumberFormatter());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ILumberFormatter": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_ILumberFormatter():
    TypeOnly<current.ILumberFormatter>;
declare function use_old_InterfaceDeclaration_ILumberFormatter(
    use: TypeOnly<old.ILumberFormatter>): void;
use_old_InterfaceDeclaration_ILumberFormatter(
    get_current_InterfaceDeclaration_ILumberFormatter());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ILumberjackEngine": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_ILumberjackEngine():
    TypeOnly<old.ILumberjackEngine>;
declare function use_current_InterfaceDeclaration_ILumberjackEngine(
    use: TypeOnly<current.ILumberjackEngine>): void;
use_current_InterfaceDeclaration_ILumberjackEngine(
    get_old_InterfaceDeclaration_ILumberjackEngine());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ILumberjackEngine": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_ILumberjackEngine():
    TypeOnly<current.ILumberjackEngine>;
declare function use_old_InterfaceDeclaration_ILumberjackEngine(
    use: TypeOnly<old.ILumberjackEngine>): void;
use_old_InterfaceDeclaration_ILumberjackEngine(
    get_current_InterfaceDeclaration_ILumberjackEngine());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ILumberjackOptions": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_ILumberjackOptions():
    TypeOnly<old.ILumberjackOptions>;
declare function use_current_InterfaceDeclaration_ILumberjackOptions(
    use: TypeOnly<current.ILumberjackOptions>): void;
use_current_InterfaceDeclaration_ILumberjackOptions(
    get_old_InterfaceDeclaration_ILumberjackOptions());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ILumberjackOptions": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_ILumberjackOptions():
    TypeOnly<current.ILumberjackOptions>;
declare function use_old_InterfaceDeclaration_ILumberjackOptions(
    use: TypeOnly<old.ILumberjackOptions>): void;
use_old_InterfaceDeclaration_ILumberjackOptions(
    get_current_InterfaceDeclaration_ILumberjackOptions());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ILumberjackSchemaValidationResult": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_ILumberjackSchemaValidationResult():
    TypeOnly<old.ILumberjackSchemaValidationResult>;
declare function use_current_InterfaceDeclaration_ILumberjackSchemaValidationResult(
    use: TypeOnly<current.ILumberjackSchemaValidationResult>): void;
use_current_InterfaceDeclaration_ILumberjackSchemaValidationResult(
    get_old_InterfaceDeclaration_ILumberjackSchemaValidationResult());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ILumberjackSchemaValidationResult": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_ILumberjackSchemaValidationResult():
    TypeOnly<current.ILumberjackSchemaValidationResult>;
declare function use_old_InterfaceDeclaration_ILumberjackSchemaValidationResult(
    use: TypeOnly<old.ILumberjackSchemaValidationResult>): void;
use_old_InterfaceDeclaration_ILumberjackSchemaValidationResult(
    get_current_InterfaceDeclaration_ILumberjackSchemaValidationResult());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ILumberjackSchemaValidator": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_ILumberjackSchemaValidator():
    TypeOnly<old.ILumberjackSchemaValidator>;
declare function use_current_InterfaceDeclaration_ILumberjackSchemaValidator(
    use: TypeOnly<current.ILumberjackSchemaValidator>): void;
use_current_InterfaceDeclaration_ILumberjackSchemaValidator(
    get_old_InterfaceDeclaration_ILumberjackSchemaValidator());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ILumberjackSchemaValidator": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_ILumberjackSchemaValidator():
    TypeOnly<current.ILumberjackSchemaValidator>;
declare function use_old_InterfaceDeclaration_ILumberjackSchemaValidator(
    use: TypeOnly<old.ILumberjackSchemaValidator>): void;
use_old_InterfaceDeclaration_ILumberjackSchemaValidator(
    get_current_InterfaceDeclaration_ILumberjackSchemaValidator());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ITelemetryContext": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_ITelemetryContext():
    TypeOnly<old.ITelemetryContext>;
declare function use_current_InterfaceDeclaration_ITelemetryContext(
    use: TypeOnly<current.ITelemetryContext>): void;
use_current_InterfaceDeclaration_ITelemetryContext(
    get_old_InterfaceDeclaration_ITelemetryContext());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ITelemetryContext": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_ITelemetryContext():
    TypeOnly<current.ITelemetryContext>;
declare function use_old_InterfaceDeclaration_ITelemetryContext(
    use: TypeOnly<old.ITelemetryContext>): void;
use_old_InterfaceDeclaration_ITelemetryContext(
    get_current_InterfaceDeclaration_ITelemetryContext());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ITelemetryContextProperties": {"forwardCompat": false}
*/
declare function get_old_InterfaceDeclaration_ITelemetryContextProperties():
    TypeOnly<old.ITelemetryContextProperties>;
declare function use_current_InterfaceDeclaration_ITelemetryContextProperties(
    use: TypeOnly<current.ITelemetryContextProperties>): void;
use_current_InterfaceDeclaration_ITelemetryContextProperties(
    // @ts-expect-error compatibility expected to be broken
    get_old_InterfaceDeclaration_ITelemetryContextProperties());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "InterfaceDeclaration_ITelemetryContextProperties": {"backCompat": false}
*/
declare function get_current_InterfaceDeclaration_ITelemetryContextProperties():
    TypeOnly<current.ITelemetryContextProperties>;
declare function use_old_InterfaceDeclaration_ITelemetryContextProperties(
    use: TypeOnly<old.ITelemetryContextProperties>): void;
use_old_InterfaceDeclaration_ITelemetryContextProperties(
    get_current_InterfaceDeclaration_ITelemetryContextProperties());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_LambdaSchemaValidator": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_LambdaSchemaValidator():
    TypeOnly<old.LambdaSchemaValidator>;
declare function use_current_ClassDeclaration_LambdaSchemaValidator(
    use: TypeOnly<current.LambdaSchemaValidator>): void;
use_current_ClassDeclaration_LambdaSchemaValidator(
    get_old_ClassDeclaration_LambdaSchemaValidator());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_LambdaSchemaValidator": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_LambdaSchemaValidator():
    TypeOnly<current.LambdaSchemaValidator>;
declare function use_old_ClassDeclaration_LambdaSchemaValidator(
    use: TypeOnly<old.LambdaSchemaValidator>): void;
use_old_ClassDeclaration_LambdaSchemaValidator(
    get_current_ClassDeclaration_LambdaSchemaValidator());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "EnumDeclaration_LogLevel": {"forwardCompat": false}
*/
declare function get_old_EnumDeclaration_LogLevel():
    TypeOnly<old.LogLevel>;
declare function use_current_EnumDeclaration_LogLevel(
    use: TypeOnly<current.LogLevel>): void;
use_current_EnumDeclaration_LogLevel(
    get_old_EnumDeclaration_LogLevel());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "EnumDeclaration_LogLevel": {"backCompat": false}
*/
declare function get_current_EnumDeclaration_LogLevel():
    TypeOnly<current.LogLevel>;
declare function use_old_EnumDeclaration_LogLevel(
    use: TypeOnly<old.LogLevel>): void;
use_old_EnumDeclaration_LogLevel(
    get_current_EnumDeclaration_LogLevel());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_Lumber": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_Lumber():
    TypeOnly<old.Lumber>;
declare function use_current_ClassDeclaration_Lumber(
    use: TypeOnly<current.Lumber>): void;
use_current_ClassDeclaration_Lumber(
    get_old_ClassDeclaration_Lumber());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_Lumber": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_Lumber():
    TypeOnly<current.Lumber>;
declare function use_old_ClassDeclaration_Lumber(
    use: TypeOnly<old.Lumber>): void;
use_old_ClassDeclaration_Lumber(
    get_current_ClassDeclaration_Lumber());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "EnumDeclaration_LumberEventName": {"forwardCompat": false}
*/
declare function get_old_EnumDeclaration_LumberEventName():
    TypeOnly<old.LumberEventName>;
declare function use_current_EnumDeclaration_LumberEventName(
    use: TypeOnly<current.LumberEventName>): void;
use_current_EnumDeclaration_LumberEventName(
    get_old_EnumDeclaration_LumberEventName());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "EnumDeclaration_LumberEventName": {"backCompat": false}
*/
declare function get_current_EnumDeclaration_LumberEventName():
    TypeOnly<current.LumberEventName>;
declare function use_old_EnumDeclaration_LumberEventName(
    use: TypeOnly<old.LumberEventName>): void;
use_old_EnumDeclaration_LumberEventName(
    get_current_EnumDeclaration_LumberEventName());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "EnumDeclaration_LumberType": {"forwardCompat": false}
*/
declare function get_old_EnumDeclaration_LumberType():
    TypeOnly<old.LumberType>;
declare function use_current_EnumDeclaration_LumberType(
    use: TypeOnly<current.LumberType>): void;
use_current_EnumDeclaration_LumberType(
    get_old_EnumDeclaration_LumberType());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "EnumDeclaration_LumberType": {"backCompat": false}
*/
declare function get_current_EnumDeclaration_LumberType():
    TypeOnly<current.LumberType>;
declare function use_old_EnumDeclaration_LumberType(
    use: TypeOnly<old.LumberType>): void;
use_old_EnumDeclaration_LumberType(
    get_current_EnumDeclaration_LumberType());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_Lumberjack": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_Lumberjack():
    TypeOnly<old.Lumberjack>;
declare function use_current_ClassDeclaration_Lumberjack(
    use: TypeOnly<current.Lumberjack>): void;
use_current_ClassDeclaration_Lumberjack(
    get_old_ClassDeclaration_Lumberjack());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_Lumberjack": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_Lumberjack():
    TypeOnly<current.Lumberjack>;
declare function use_old_ClassDeclaration_Lumberjack(
    use: TypeOnly<old.Lumberjack>): void;
use_old_ClassDeclaration_Lumberjack(
    get_current_ClassDeclaration_Lumberjack());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "EnumDeclaration_QueuedMessageProperties": {"forwardCompat": false}
*/
declare function get_old_EnumDeclaration_QueuedMessageProperties():
    TypeOnly<old.QueuedMessageProperties>;
declare function use_current_EnumDeclaration_QueuedMessageProperties(
    use: TypeOnly<current.QueuedMessageProperties>): void;
use_current_EnumDeclaration_QueuedMessageProperties(
    get_old_EnumDeclaration_QueuedMessageProperties());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "EnumDeclaration_QueuedMessageProperties": {"backCompat": false}
*/
declare function get_current_EnumDeclaration_QueuedMessageProperties():
    TypeOnly<current.QueuedMessageProperties>;
declare function use_old_EnumDeclaration_QueuedMessageProperties(
    use: TypeOnly<old.QueuedMessageProperties>): void;
use_old_EnumDeclaration_QueuedMessageProperties(
    get_current_EnumDeclaration_QueuedMessageProperties());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_SanitizationLumberFormatter": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_SanitizationLumberFormatter():
    TypeOnly<old.SanitizationLumberFormatter>;
declare function use_current_ClassDeclaration_SanitizationLumberFormatter(
    use: TypeOnly<current.SanitizationLumberFormatter>): void;
use_current_ClassDeclaration_SanitizationLumberFormatter(
    get_old_ClassDeclaration_SanitizationLumberFormatter());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_SanitizationLumberFormatter": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_SanitizationLumberFormatter():
    TypeOnly<current.SanitizationLumberFormatter>;
declare function use_old_ClassDeclaration_SanitizationLumberFormatter(
    use: TypeOnly<old.SanitizationLumberFormatter>): void;
use_old_ClassDeclaration_SanitizationLumberFormatter(
    get_current_ClassDeclaration_SanitizationLumberFormatter());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "EnumDeclaration_SessionState": {"forwardCompat": false}
*/
declare function get_old_EnumDeclaration_SessionState():
    TypeOnly<old.SessionState>;
declare function use_current_EnumDeclaration_SessionState(
    use: TypeOnly<current.SessionState>): void;
use_current_EnumDeclaration_SessionState(
    get_old_EnumDeclaration_SessionState());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "EnumDeclaration_SessionState": {"backCompat": false}
*/
declare function get_current_EnumDeclaration_SessionState():
    TypeOnly<current.SessionState>;
declare function use_old_EnumDeclaration_SessionState(
    use: TypeOnly<old.SessionState>): void;
use_old_EnumDeclaration_SessionState(
    get_current_EnumDeclaration_SessionState());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_TestEngine1": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_TestEngine1():
    TypeOnly<old.TestEngine1>;
declare function use_current_ClassDeclaration_TestEngine1(
    use: TypeOnly<current.TestEngine1>): void;
use_current_ClassDeclaration_TestEngine1(
    get_old_ClassDeclaration_TestEngine1());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_TestEngine1": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_TestEngine1():
    TypeOnly<current.TestEngine1>;
declare function use_old_ClassDeclaration_TestEngine1(
    use: TypeOnly<old.TestEngine1>): void;
use_old_ClassDeclaration_TestEngine1(
    get_current_ClassDeclaration_TestEngine1());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_TestEngine2": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_TestEngine2():
    TypeOnly<old.TestEngine2>;
declare function use_current_ClassDeclaration_TestEngine2(
    use: TypeOnly<current.TestEngine2>): void;
use_current_ClassDeclaration_TestEngine2(
    get_old_ClassDeclaration_TestEngine2());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_TestEngine2": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_TestEngine2():
    TypeOnly<current.TestEngine2>;
declare function use_old_ClassDeclaration_TestEngine2(
    use: TypeOnly<old.TestEngine2>): void;
use_old_ClassDeclaration_TestEngine2(
    get_current_ClassDeclaration_TestEngine2());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_TestFormatter": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_TestFormatter():
    TypeOnly<old.TestFormatter>;
declare function use_current_ClassDeclaration_TestFormatter(
    use: TypeOnly<current.TestFormatter>): void;
use_current_ClassDeclaration_TestFormatter(
    get_old_ClassDeclaration_TestFormatter());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_TestFormatter": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_TestFormatter():
    TypeOnly<current.TestFormatter>;
declare function use_old_ClassDeclaration_TestFormatter(
    use: TypeOnly<old.TestFormatter>): void;
use_old_ClassDeclaration_TestFormatter(
    get_current_ClassDeclaration_TestFormatter());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_TestLumberjack": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_TestLumberjack():
    TypeOnly<old.TestLumberjack>;
declare function use_current_ClassDeclaration_TestLumberjack(
    use: TypeOnly<current.TestLumberjack>): void;
use_current_ClassDeclaration_TestLumberjack(
    get_old_ClassDeclaration_TestLumberjack());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_TestLumberjack": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_TestLumberjack():
    TypeOnly<current.TestLumberjack>;
declare function use_old_ClassDeclaration_TestLumberjack(
    use: TypeOnly<old.TestLumberjack>): void;
use_old_ClassDeclaration_TestLumberjack(
    get_current_ClassDeclaration_TestLumberjack());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_TestSchemaValidator": {"forwardCompat": false}
*/
declare function get_old_ClassDeclaration_TestSchemaValidator():
    TypeOnly<old.TestSchemaValidator>;
declare function use_current_ClassDeclaration_TestSchemaValidator(
    use: TypeOnly<current.TestSchemaValidator>): void;
use_current_ClassDeclaration_TestSchemaValidator(
    get_old_ClassDeclaration_TestSchemaValidator());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "ClassDeclaration_TestSchemaValidator": {"backCompat": false}
*/
declare function get_current_ClassDeclaration_TestSchemaValidator():
    TypeOnly<current.TestSchemaValidator>;
declare function use_old_ClassDeclaration_TestSchemaValidator(
    use: TypeOnly<old.TestSchemaValidator>): void;
use_old_ClassDeclaration_TestSchemaValidator(
    get_current_ClassDeclaration_TestSchemaValidator());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "EnumDeclaration_ThrottlingTelemetryProperties": {"forwardCompat": false}
*/
declare function get_old_EnumDeclaration_ThrottlingTelemetryProperties():
    TypeOnly<old.ThrottlingTelemetryProperties>;
declare function use_current_EnumDeclaration_ThrottlingTelemetryProperties(
    use: TypeOnly<current.ThrottlingTelemetryProperties>): void;
use_current_EnumDeclaration_ThrottlingTelemetryProperties(
    get_old_EnumDeclaration_ThrottlingTelemetryProperties());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "EnumDeclaration_ThrottlingTelemetryProperties": {"backCompat": false}
*/
declare function get_current_EnumDeclaration_ThrottlingTelemetryProperties():
    TypeOnly<current.ThrottlingTelemetryProperties>;
declare function use_old_EnumDeclaration_ThrottlingTelemetryProperties(
    use: TypeOnly<old.ThrottlingTelemetryProperties>): void;
use_old_EnumDeclaration_ThrottlingTelemetryProperties(
    get_current_EnumDeclaration_ThrottlingTelemetryProperties());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "VariableDeclaration_getGlobalTelemetryContext": {"forwardCompat": false}
*/
declare function get_old_VariableDeclaration_getGlobalTelemetryContext():
    TypeOnly<typeof old.getGlobalTelemetryContext>;
declare function use_current_VariableDeclaration_getGlobalTelemetryContext(
    use: TypeOnly<typeof current.getGlobalTelemetryContext>): void;
use_current_VariableDeclaration_getGlobalTelemetryContext(
    get_old_VariableDeclaration_getGlobalTelemetryContext());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "VariableDeclaration_getGlobalTelemetryContext": {"backCompat": false}
*/
declare function get_current_VariableDeclaration_getGlobalTelemetryContext():
    TypeOnly<typeof current.getGlobalTelemetryContext>;
declare function use_old_VariableDeclaration_getGlobalTelemetryContext(
    use: TypeOnly<typeof old.getGlobalTelemetryContext>): void;
use_old_VariableDeclaration_getGlobalTelemetryContext(
    get_current_VariableDeclaration_getGlobalTelemetryContext());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "VariableDeclaration_getLumberBaseProperties": {"forwardCompat": false}
*/
declare function get_old_VariableDeclaration_getLumberBaseProperties():
    TypeOnly<typeof old.getLumberBaseProperties>;
declare function use_current_VariableDeclaration_getLumberBaseProperties(
    use: TypeOnly<typeof current.getLumberBaseProperties>): void;
use_current_VariableDeclaration_getLumberBaseProperties(
    get_old_VariableDeclaration_getLumberBaseProperties());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "VariableDeclaration_getLumberBaseProperties": {"backCompat": false}
*/
declare function get_current_VariableDeclaration_getLumberBaseProperties():
    TypeOnly<typeof current.getLumberBaseProperties>;
declare function use_old_VariableDeclaration_getLumberBaseProperties(
    use: TypeOnly<typeof old.getLumberBaseProperties>): void;
use_old_VariableDeclaration_getLumberBaseProperties(
    get_current_VariableDeclaration_getLumberBaseProperties());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_handleError": {"forwardCompat": false}
*/
declare function get_old_FunctionDeclaration_handleError():
    TypeOnly<typeof old.handleError>;
declare function use_current_FunctionDeclaration_handleError(
    use: TypeOnly<typeof current.handleError>): void;
use_current_FunctionDeclaration_handleError(
    get_old_FunctionDeclaration_handleError());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "FunctionDeclaration_handleError": {"backCompat": false}
*/
declare function get_current_FunctionDeclaration_handleError():
    TypeOnly<typeof current.handleError>;
declare function use_old_FunctionDeclaration_handleError(
    use: TypeOnly<typeof old.handleError>): void;
use_old_FunctionDeclaration_handleError(
    get_current_FunctionDeclaration_handleError());

/*
* Validate forward compat by using old type in place of current type
* If breaking change required, add in package.json under typeValidation.broken:
* "VariableDeclaration_setGlobalTelemetryContext": {"forwardCompat": false}
*/
declare function get_old_VariableDeclaration_setGlobalTelemetryContext():
    TypeOnly<typeof old.setGlobalTelemetryContext>;
declare function use_current_VariableDeclaration_setGlobalTelemetryContext(
    use: TypeOnly<typeof current.setGlobalTelemetryContext>): void;
use_current_VariableDeclaration_setGlobalTelemetryContext(
    get_old_VariableDeclaration_setGlobalTelemetryContext());

/*
* Validate back compat by using current type in place of old type
* If breaking change required, add in package.json under typeValidation.broken:
* "VariableDeclaration_setGlobalTelemetryContext": {"backCompat": false}
*/
declare function get_current_VariableDeclaration_setGlobalTelemetryContext():
    TypeOnly<typeof current.setGlobalTelemetryContext>;
declare function use_old_VariableDeclaration_setGlobalTelemetryContext(
    use: TypeOnly<typeof old.setGlobalTelemetryContext>): void;
use_old_VariableDeclaration_setGlobalTelemetryContext(
    get_current_VariableDeclaration_setGlobalTelemetryContext());
