/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

/*
 * THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
 * Generated by flub generate:typetests in @fluid-tools/build-cli.
 */

import type { TypeOnly, MinimalType, FullType, requireAssignableTo } from "@fluidframework/build-tools";
import type * as old from "@fluidframework/server-services-ordering-kafkanode-previous";

import type * as current from "../../index.js";

declare type MakeUnusedImportErrorsGoAway<T> = TypeOnly<T> | MinimalType<T> | FullType<T> | typeof old | typeof current | requireAssignableTo<true, true>;

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Class_KafkaNodeConsumer": {"forwardCompat": false}
 */
declare type old_as_current_for_Class_KafkaNodeConsumer = requireAssignableTo<TypeOnly<old.KafkaNodeConsumer>, TypeOnly<current.KafkaNodeConsumer>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Class_KafkaNodeConsumer": {"backCompat": false}
 */
declare type current_as_old_for_Class_KafkaNodeConsumer = requireAssignableTo<TypeOnly<current.KafkaNodeConsumer>, TypeOnly<old.KafkaNodeConsumer>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Class_KafkaNodeProducer": {"forwardCompat": false}
 */
// @ts-expect-error compatibility expected to be broken
declare type old_as_current_for_Class_KafkaNodeProducer = requireAssignableTo<TypeOnly<old.KafkaNodeProducer>, TypeOnly<current.KafkaNodeProducer>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Class_KafkaNodeProducer": {"backCompat": false}
 */
declare type current_as_old_for_Class_KafkaNodeProducer = requireAssignableTo<TypeOnly<current.KafkaNodeProducer>, TypeOnly<old.KafkaNodeProducer>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Class_KafkaResources": {"forwardCompat": false}
 */
declare type old_as_current_for_Class_KafkaResources = requireAssignableTo<TypeOnly<old.KafkaResources>, TypeOnly<current.KafkaResources>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Class_KafkaResources": {"backCompat": false}
 */
declare type current_as_old_for_Class_KafkaResources = requireAssignableTo<TypeOnly<current.KafkaResources>, TypeOnly<old.KafkaResources>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Class_KafkaResourcesFactory": {"forwardCompat": false}
 */
declare type old_as_current_for_Class_KafkaResourcesFactory = requireAssignableTo<TypeOnly<old.KafkaResourcesFactory>, TypeOnly<current.KafkaResourcesFactory>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Class_KafkaResourcesFactory": {"backCompat": false}
 */
declare type current_as_old_for_Class_KafkaResourcesFactory = requireAssignableTo<TypeOnly<current.KafkaResourcesFactory>, TypeOnly<old.KafkaResourcesFactory>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "ClassStatics_KafkaNodeConsumer": {"backCompat": false}
 */
declare type current_as_old_for_ClassStatics_KafkaNodeConsumer = requireAssignableTo<TypeOnly<typeof current.KafkaNodeConsumer>, TypeOnly<typeof old.KafkaNodeConsumer>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "ClassStatics_KafkaNodeProducer": {"backCompat": false}
 */
declare type current_as_old_for_ClassStatics_KafkaNodeProducer = requireAssignableTo<TypeOnly<typeof current.KafkaNodeProducer>, TypeOnly<typeof old.KafkaNodeProducer>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "ClassStatics_KafkaResources": {"backCompat": false}
 */
declare type current_as_old_for_ClassStatics_KafkaResources = requireAssignableTo<TypeOnly<typeof current.KafkaResources>, TypeOnly<typeof old.KafkaResources>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "ClassStatics_KafkaResourcesFactory": {"backCompat": false}
 */
declare type current_as_old_for_ClassStatics_KafkaResourcesFactory = requireAssignableTo<TypeOnly<typeof current.KafkaResourcesFactory>, TypeOnly<typeof old.KafkaResourcesFactory>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Interface_IKafkaResources": {"forwardCompat": false}
 */
declare type old_as_current_for_Interface_IKafkaResources = requireAssignableTo<TypeOnly<old.IKafkaResources>, TypeOnly<current.IKafkaResources>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Interface_IKafkaResources": {"backCompat": false}
 */
declare type current_as_old_for_Interface_IKafkaResources = requireAssignableTo<TypeOnly<current.IKafkaResources>, TypeOnly<old.IKafkaResources>>
