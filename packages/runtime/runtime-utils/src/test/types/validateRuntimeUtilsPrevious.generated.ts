/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

/*
 * THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
 * Generated by flub generate:typetests in @fluid-tools/build-cli.
 */

import type { TypeOnly, MinimalType, FullType, requireAssignableTo } from "@fluidframework/build-tools";
import type * as old from "@fluidframework/runtime-utils-previous/internal";

import type * as current from "../../index.js";

declare type MakeUnusedImportErrorsGoAway<T> = TypeOnly<T> | MinimalType<T> | FullType<T> | typeof old | typeof current | requireAssignableTo<true, true>;

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Class_FluidHandleBase": {"forwardCompat": false}
 */
declare type old_as_current_for_Class_FluidHandleBase = requireAssignableTo<TypeOnly<old.FluidHandleBase<never>>, TypeOnly<current.FluidHandleBase<never>>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Class_FluidHandleBase": {"backCompat": false}
 */
declare type current_as_old_for_Class_FluidHandleBase = requireAssignableTo<TypeOnly<current.FluidHandleBase<never>>, TypeOnly<old.FluidHandleBase<never>>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Class_RequestParser": {"forwardCompat": false}
 */
declare type old_as_current_for_Class_RequestParser = requireAssignableTo<TypeOnly<old.RequestParser>, TypeOnly<current.RequestParser>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Class_RequestParser": {"backCompat": false}
 */
declare type current_as_old_for_Class_RequestParser = requireAssignableTo<TypeOnly<current.RequestParser>, TypeOnly<old.RequestParser>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Class_RuntimeFactoryHelper": {"forwardCompat": false}
 */
declare type old_as_current_for_Class_RuntimeFactoryHelper = requireAssignableTo<TypeOnly<old.RuntimeFactoryHelper>, TypeOnly<current.RuntimeFactoryHelper>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Class_RuntimeFactoryHelper": {"backCompat": false}
 */
declare type current_as_old_for_Class_RuntimeFactoryHelper = requireAssignableTo<TypeOnly<current.RuntimeFactoryHelper>, TypeOnly<old.RuntimeFactoryHelper>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Class_SummaryTreeBuilder": {"forwardCompat": false}
 */
declare type old_as_current_for_Class_SummaryTreeBuilder = requireAssignableTo<TypeOnly<old.SummaryTreeBuilder>, TypeOnly<current.SummaryTreeBuilder>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Class_SummaryTreeBuilder": {"backCompat": false}
 */
declare type current_as_old_for_Class_SummaryTreeBuilder = requireAssignableTo<TypeOnly<current.SummaryTreeBuilder>, TypeOnly<old.SummaryTreeBuilder>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "ClassStatics_FluidHandleBase": {"backCompat": false}
 */
declare type current_as_old_for_ClassStatics_FluidHandleBase = requireAssignableTo<TypeOnly<typeof current.FluidHandleBase>, TypeOnly<typeof old.FluidHandleBase>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "ClassStatics_RequestParser": {"backCompat": false}
 */
declare type current_as_old_for_ClassStatics_RequestParser = requireAssignableTo<TypeOnly<typeof current.RequestParser>, TypeOnly<typeof old.RequestParser>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "ClassStatics_RuntimeFactoryHelper": {"backCompat": false}
 */
declare type current_as_old_for_ClassStatics_RuntimeFactoryHelper = requireAssignableTo<TypeOnly<typeof current.RuntimeFactoryHelper>, TypeOnly<typeof old.RuntimeFactoryHelper>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "ClassStatics_SummaryTreeBuilder": {"backCompat": false}
 */
declare type current_as_old_for_ClassStatics_SummaryTreeBuilder = requireAssignableTo<TypeOnly<typeof current.SummaryTreeBuilder>, TypeOnly<typeof old.SummaryTreeBuilder>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Function_convertToSummaryTreeWithStats": {"backCompat": false}
 */
declare type current_as_old_for_Function_convertToSummaryTreeWithStats = requireAssignableTo<TypeOnly<typeof current.convertToSummaryTreeWithStats>, TypeOnly<typeof old.convertToSummaryTreeWithStats>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Function_isFluidHandle": {"backCompat": false}
 */
declare type current_as_old_for_Function_isFluidHandle = requireAssignableTo<TypeOnly<typeof current.isFluidHandle>, TypeOnly<typeof old.isFluidHandle>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Function_toDeltaManagerInternal": {"backCompat": false}
 */
declare type current_as_old_for_Function_toDeltaManagerInternal = requireAssignableTo<TypeOnly<typeof current.toDeltaManagerInternal>, TypeOnly<typeof old.toDeltaManagerInternal>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Function_toFluidHandleErased": {"backCompat": false}
 */
declare type current_as_old_for_Function_toFluidHandleErased = requireAssignableTo<TypeOnly<typeof current.toFluidHandleErased>, TypeOnly<typeof old.toFluidHandleErased>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Function_toFluidHandleInternal": {"backCompat": false}
 */
declare type current_as_old_for_Function_toFluidHandleInternal = requireAssignableTo<TypeOnly<typeof current.toFluidHandleInternal>, TypeOnly<typeof old.toFluidHandleInternal>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Variable_create404Response": {"backCompat": false}
 */
declare type current_as_old_for_Variable_create404Response = requireAssignableTo<TypeOnly<typeof current.create404Response>, TypeOnly<typeof old.create404Response>>
