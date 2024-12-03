/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

/*
 * THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
 * Generated by flub generate:typetests in @fluid-tools/build-cli.
 */

import type { TypeOnly, MinimalType, FullType, requireAssignableTo } from "@fluidframework/build-tools";
import type * as old from "@fluidframework/synthesize-previous/internal";

import type * as current from "../../index.js";

declare type MakeUnusedImportErrorsGoAway<T> = TypeOnly<T> | MinimalType<T> | FullType<T> | typeof old | typeof current | requireAssignableTo<true, true>;

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Class_DependencyContainer": {"forwardCompat": false}
 */
declare type old_as_current_for_Class_DependencyContainer = requireAssignableTo<TypeOnly<old.DependencyContainer<never>>, TypeOnly<current.DependencyContainer<never>>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Class_DependencyContainer": {"backCompat": false}
 */
declare type current_as_old_for_Class_DependencyContainer = requireAssignableTo<TypeOnly<current.DependencyContainer<never>>, TypeOnly<old.DependencyContainer<never>>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "ClassStatics_DependencyContainer": {"backCompat": false}
 */
declare type current_as_old_for_ClassStatics_DependencyContainer = requireAssignableTo<TypeOnly<typeof current.DependencyContainer>, TypeOnly<typeof old.DependencyContainer>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Interface_IFluidDependencySynthesizer": {"forwardCompat": false}
 */
declare type old_as_current_for_Interface_IFluidDependencySynthesizer = requireAssignableTo<TypeOnly<old.IFluidDependencySynthesizer>, TypeOnly<current.IFluidDependencySynthesizer>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Interface_IFluidDependencySynthesizer": {"backCompat": false}
 */
declare type current_as_old_for_Interface_IFluidDependencySynthesizer = requireAssignableTo<TypeOnly<current.IFluidDependencySynthesizer>, TypeOnly<old.IFluidDependencySynthesizer>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Interface_IProvideFluidDependencySynthesizer": {"forwardCompat": false}
 */
declare type old_as_current_for_Interface_IProvideFluidDependencySynthesizer = requireAssignableTo<TypeOnly<old.IProvideFluidDependencySynthesizer>, TypeOnly<current.IProvideFluidDependencySynthesizer>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Interface_IProvideFluidDependencySynthesizer": {"backCompat": false}
 */
declare type current_as_old_for_Interface_IProvideFluidDependencySynthesizer = requireAssignableTo<TypeOnly<current.IProvideFluidDependencySynthesizer>, TypeOnly<old.IProvideFluidDependencySynthesizer>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAlias_AsyncFluidObjectProvider": {"forwardCompat": false}
 */
declare type old_as_current_for_TypeAlias_AsyncFluidObjectProvider = requireAssignableTo<TypeOnly<old.AsyncFluidObjectProvider<never>>, TypeOnly<current.AsyncFluidObjectProvider<never>>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAlias_AsyncFluidObjectProvider": {"backCompat": false}
 */
declare type current_as_old_for_TypeAlias_AsyncFluidObjectProvider = requireAssignableTo<TypeOnly<current.AsyncFluidObjectProvider<never>>, TypeOnly<old.AsyncFluidObjectProvider<never>>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAlias_AsyncOptionalFluidObjectProvider": {"forwardCompat": false}
 */
declare type old_as_current_for_TypeAlias_AsyncOptionalFluidObjectProvider = requireAssignableTo<TypeOnly<old.AsyncOptionalFluidObjectProvider<never>>, TypeOnly<current.AsyncOptionalFluidObjectProvider<never>>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAlias_AsyncOptionalFluidObjectProvider": {"backCompat": false}
 */
declare type current_as_old_for_TypeAlias_AsyncOptionalFluidObjectProvider = requireAssignableTo<TypeOnly<current.AsyncOptionalFluidObjectProvider<never>>, TypeOnly<old.AsyncOptionalFluidObjectProvider<never>>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAlias_AsyncRequiredFluidObjectProvider": {"forwardCompat": false}
 */
declare type old_as_current_for_TypeAlias_AsyncRequiredFluidObjectProvider = requireAssignableTo<TypeOnly<old.AsyncRequiredFluidObjectProvider<never>>, TypeOnly<current.AsyncRequiredFluidObjectProvider<never>>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAlias_AsyncRequiredFluidObjectProvider": {"backCompat": false}
 */
declare type current_as_old_for_TypeAlias_AsyncRequiredFluidObjectProvider = requireAssignableTo<TypeOnly<current.AsyncRequiredFluidObjectProvider<never>>, TypeOnly<old.AsyncRequiredFluidObjectProvider<never>>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAlias_FluidObjectProvider": {"forwardCompat": false}
 */
declare type old_as_current_for_TypeAlias_FluidObjectProvider = requireAssignableTo<TypeOnly<old.FluidObjectProvider<never>>, TypeOnly<current.FluidObjectProvider<never>>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAlias_FluidObjectProvider": {"backCompat": false}
 */
declare type current_as_old_for_TypeAlias_FluidObjectProvider = requireAssignableTo<TypeOnly<current.FluidObjectProvider<never>>, TypeOnly<old.FluidObjectProvider<never>>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAlias_FluidObjectSymbolProvider": {"forwardCompat": false}
 */
declare type old_as_current_for_TypeAlias_FluidObjectSymbolProvider = requireAssignableTo<TypeOnly<old.FluidObjectSymbolProvider<never>>, TypeOnly<current.FluidObjectSymbolProvider<never>>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAlias_FluidObjectSymbolProvider": {"backCompat": false}
 */
declare type current_as_old_for_TypeAlias_FluidObjectSymbolProvider = requireAssignableTo<TypeOnly<current.FluidObjectSymbolProvider<never>>, TypeOnly<old.FluidObjectSymbolProvider<never>>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Variable_IFluidDependencySynthesizer": {"backCompat": false}
 */
declare type current_as_old_for_Variable_IFluidDependencySynthesizer = requireAssignableTo<TypeOnly<typeof current.IFluidDependencySynthesizer>, TypeOnly<typeof old.IFluidDependencySynthesizer>>
