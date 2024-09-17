/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

/*
 * THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
 * Generated by flub generate:typetests in @fluid-tools/build-cli.
 */

import type { TypeOnly, MinimalType, FullType, requireAssignableTo } from "@fluidframework/build-tools";
import type * as old from "@fluidframework/counter-previous/internal";

import type * as current from "../../index.js";

declare type MakeUnusedImportErrorsGoAway<T> = TypeOnly<T> | MinimalType<T> | FullType<T> | typeof old | typeof current | requireAssignableTo<true, true>;

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Interface_ISharedCounter": {"forwardCompat": false}
 */
declare type old_as_current_for_Interface_ISharedCounter = requireAssignableTo<TypeOnly<old.ISharedCounter>, TypeOnly<current.ISharedCounter>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Interface_ISharedCounter": {"backCompat": false}
 */
declare type current_as_old_for_Interface_ISharedCounter = requireAssignableTo<TypeOnly<current.ISharedCounter>, TypeOnly<old.ISharedCounter>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Interface_ISharedCounterEvents": {"forwardCompat": false}
 */
declare type old_as_current_for_Interface_ISharedCounterEvents = requireAssignableTo<TypeOnly<old.ISharedCounterEvents>, TypeOnly<current.ISharedCounterEvents>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Interface_ISharedCounterEvents": {"backCompat": false}
 */
declare type current_as_old_for_Interface_ISharedCounterEvents = requireAssignableTo<TypeOnly<current.ISharedCounterEvents>, TypeOnly<old.ISharedCounterEvents>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAlias_SharedCounter": {"forwardCompat": false}
 */
declare type old_as_current_for_TypeAlias_SharedCounter = requireAssignableTo<TypeOnly<old.SharedCounter>, TypeOnly<current.SharedCounter>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAlias_SharedCounter": {"backCompat": false}
 */
declare type current_as_old_for_TypeAlias_SharedCounter = requireAssignableTo<TypeOnly<current.SharedCounter>, TypeOnly<old.SharedCounter>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Variable_SharedCounter": {"backCompat": false}
 */
declare type current_as_old_for_Variable_SharedCounter = requireAssignableTo<TypeOnly<typeof current.SharedCounter>, TypeOnly<typeof old.SharedCounter>>
