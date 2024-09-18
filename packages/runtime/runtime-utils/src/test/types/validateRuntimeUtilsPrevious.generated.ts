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
declare type old_as_current_for_Class_FluidHandleBase = requireAssignableTo<TypeOnly<old.FluidHandleBase<any>>, TypeOnly<current.FluidHandleBase<any>>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Class_FluidHandleBase": {"backCompat": false}
 */
declare type current_as_old_for_Class_FluidHandleBase = requireAssignableTo<TypeOnly<current.FluidHandleBase<any>>, TypeOnly<old.FluidHandleBase<any>>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Class_GCDataBuilder": {"forwardCompat": false}
 */
declare type old_as_current_for_Class_GCDataBuilder = requireAssignableTo<TypeOnly<old.GCDataBuilder>, TypeOnly<current.GCDataBuilder>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Class_GCDataBuilder": {"backCompat": false}
 */
declare type current_as_old_for_Class_GCDataBuilder = requireAssignableTo<TypeOnly<current.GCDataBuilder>, TypeOnly<old.GCDataBuilder>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Class_ObjectStoragePartition": {"forwardCompat": false}
 */
declare type old_as_current_for_Class_ObjectStoragePartition = requireAssignableTo<TypeOnly<old.ObjectStoragePartition>, TypeOnly<current.ObjectStoragePartition>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Class_ObjectStoragePartition": {"backCompat": false}
 */
declare type current_as_old_for_Class_ObjectStoragePartition = requireAssignableTo<TypeOnly<current.ObjectStoragePartition>, TypeOnly<old.ObjectStoragePartition>>

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
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Class_TelemetryContext": {"forwardCompat": false}
 */
declare type old_as_current_for_Class_TelemetryContext = requireAssignableTo<TypeOnly<old.TelemetryContext>, TypeOnly<current.TelemetryContext>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Class_TelemetryContext": {"backCompat": false}
 */
declare type current_as_old_for_Class_TelemetryContext = requireAssignableTo<TypeOnly<current.TelemetryContext>, TypeOnly<old.TelemetryContext>>

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
 * "ClassStatics_GCDataBuilder": {"backCompat": false}
 */
declare type current_as_old_for_ClassStatics_GCDataBuilder = requireAssignableTo<TypeOnly<typeof current.GCDataBuilder>, TypeOnly<typeof old.GCDataBuilder>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "ClassStatics_ObjectStoragePartition": {"backCompat": false}
 */
declare type current_as_old_for_ClassStatics_ObjectStoragePartition = requireAssignableTo<TypeOnly<typeof current.ObjectStoragePartition>, TypeOnly<typeof old.ObjectStoragePartition>>

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
 * "ClassStatics_TelemetryContext": {"backCompat": false}
 */
declare type current_as_old_for_ClassStatics_TelemetryContext = requireAssignableTo<TypeOnly<typeof current.TelemetryContext>, TypeOnly<typeof old.TelemetryContext>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Function_addBlobToSummary": {"backCompat": false}
 */
declare type current_as_old_for_Function_addBlobToSummary = requireAssignableTo<TypeOnly<typeof current.addBlobToSummary>, TypeOnly<typeof old.addBlobToSummary>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Function_addSummarizeResultToSummary": {"backCompat": false}
 */
declare type current_as_old_for_Function_addSummarizeResultToSummary = requireAssignableTo<TypeOnly<typeof current.addSummarizeResultToSummary>, TypeOnly<typeof old.addSummarizeResultToSummary>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Function_calculateStats": {"backCompat": false}
 */
declare type current_as_old_for_Function_calculateStats = requireAssignableTo<TypeOnly<typeof current.calculateStats>, TypeOnly<typeof old.calculateStats>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Function_convertSnapshotTreeToSummaryTree": {"backCompat": false}
 */
declare type current_as_old_for_Function_convertSnapshotTreeToSummaryTree = requireAssignableTo<TypeOnly<typeof current.convertSnapshotTreeToSummaryTree>, TypeOnly<typeof old.convertSnapshotTreeToSummaryTree>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Function_convertSummaryTreeToITree": {"backCompat": false}
 */
declare type current_as_old_for_Function_convertSummaryTreeToITree = requireAssignableTo<TypeOnly<typeof current.convertSummaryTreeToITree>, TypeOnly<typeof old.convertSummaryTreeToITree>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Function_convertToSummaryTree": {"backCompat": false}
 */
declare type current_as_old_for_Function_convertToSummaryTree = requireAssignableTo<TypeOnly<typeof current.convertToSummaryTree>, TypeOnly<typeof old.convertToSummaryTree>>

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
 * "Function_createDataStoreFactory": {"backCompat": false}
 */
declare type current_as_old_for_Function_createDataStoreFactory = requireAssignableTo<TypeOnly<typeof current.createDataStoreFactory>, TypeOnly<typeof old.createDataStoreFactory>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Function_createResponseError": {"backCompat": false}
 */
declare type current_as_old_for_Function_createResponseError = requireAssignableTo<TypeOnly<typeof current.createResponseError>, TypeOnly<typeof old.createResponseError>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Function_encodeCompactIdToString": {"backCompat": false}
 */
declare type current_as_old_for_Function_encodeCompactIdToString = requireAssignableTo<TypeOnly<typeof current.encodeCompactIdToString>, TypeOnly<typeof old.encodeCompactIdToString>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Function_exceptionToResponse": {"backCompat": false}
 */
declare type current_as_old_for_Function_exceptionToResponse = requireAssignableTo<TypeOnly<typeof current.exceptionToResponse>, TypeOnly<typeof old.exceptionToResponse>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Function_generateHandleContextPath": {"backCompat": false}
 */
declare type current_as_old_for_Function_generateHandleContextPath = requireAssignableTo<TypeOnly<typeof current.generateHandleContextPath>, TypeOnly<typeof old.generateHandleContextPath>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Function_getBlobSize": {"backCompat": false}
 */
declare type current_as_old_for_Function_getBlobSize = requireAssignableTo<TypeOnly<typeof current.getBlobSize>, TypeOnly<typeof old.getBlobSize>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Function_getNormalizedObjectStoragePathParts": {"backCompat": false}
 */
declare type current_as_old_for_Function_getNormalizedObjectStoragePathParts = requireAssignableTo<TypeOnly<typeof current.getNormalizedObjectStoragePathParts>, TypeOnly<typeof old.getNormalizedObjectStoragePathParts>>

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
 * "Function_isSnapshotFetchRequiredForLoadingGroupId": {"backCompat": false}
 */
declare type current_as_old_for_Function_isSnapshotFetchRequiredForLoadingGroupId = requireAssignableTo<TypeOnly<typeof current.isSnapshotFetchRequiredForLoadingGroupId>, TypeOnly<typeof old.isSnapshotFetchRequiredForLoadingGroupId>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Function_listBlobsAtTreePath": {"backCompat": false}
 */
declare type current_as_old_for_Function_listBlobsAtTreePath = requireAssignableTo<TypeOnly<typeof current.listBlobsAtTreePath>, TypeOnly<typeof old.listBlobsAtTreePath>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Function_mergeStats": {"backCompat": false}
 */
declare type current_as_old_for_Function_mergeStats = requireAssignableTo<TypeOnly<typeof current.mergeStats>, TypeOnly<typeof old.mergeStats>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Function_processAttachMessageGCData": {"backCompat": false}
 */
declare type current_as_old_for_Function_processAttachMessageGCData = requireAssignableTo<TypeOnly<typeof current.processAttachMessageGCData>, TypeOnly<typeof old.processAttachMessageGCData>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Function_responseToException": {"backCompat": false}
 */
declare type current_as_old_for_Function_responseToException = requireAssignableTo<TypeOnly<typeof current.responseToException>, TypeOnly<typeof old.responseToException>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Function_seqFromTree": {"backCompat": false}
 */
declare type current_as_old_for_Function_seqFromTree = requireAssignableTo<TypeOnly<typeof current.seqFromTree>, TypeOnly<typeof old.seqFromTree>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Function_toDeltaManagerErased": {"backCompat": false}
 */
declare type current_as_old_for_Function_toDeltaManagerErased = requireAssignableTo<TypeOnly<typeof current.toDeltaManagerErased>, TypeOnly<typeof old.toDeltaManagerErased>>

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
 * "Function_unpackChildNodesUsedRoutes": {"backCompat": false}
 */
declare type current_as_old_for_Function_unpackChildNodesUsedRoutes = requireAssignableTo<TypeOnly<typeof current.unpackChildNodesUsedRoutes>, TypeOnly<typeof old.unpackChildNodesUsedRoutes>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Function_utf8ByteLength": {"backCompat": false}
 */
declare type current_as_old_for_Function_utf8ByteLength = requireAssignableTo<TypeOnly<typeof current.utf8ByteLength>, TypeOnly<typeof old.utf8ByteLength>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Interface_ISerializedHandle": {"forwardCompat": false}
 */
declare type old_as_current_for_Interface_ISerializedHandle = requireAssignableTo<TypeOnly<old.ISerializedHandle>, TypeOnly<current.ISerializedHandle>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Interface_ISerializedHandle": {"backCompat": false}
 */
declare type current_as_old_for_Interface_ISerializedHandle = requireAssignableTo<TypeOnly<current.ISerializedHandle>, TypeOnly<old.ISerializedHandle>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAlias_Factory": {"forwardCompat": false}
 */
declare type old_as_current_for_TypeAlias_Factory = requireAssignableTo<TypeOnly<old.Factory>, TypeOnly<current.Factory>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAlias_Factory": {"backCompat": false}
 */
declare type current_as_old_for_TypeAlias_Factory = requireAssignableTo<TypeOnly<current.Factory>, TypeOnly<old.Factory>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAlias_ReadAndParseBlob": {"forwardCompat": false}
 */
declare type old_as_current_for_TypeAlias_ReadAndParseBlob = requireAssignableTo<TypeOnly<old.ReadAndParseBlob>, TypeOnly<current.ReadAndParseBlob>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAlias_ReadAndParseBlob": {"backCompat": false}
 */
declare type current_as_old_for_TypeAlias_ReadAndParseBlob = requireAssignableTo<TypeOnly<current.ReadAndParseBlob>, TypeOnly<old.ReadAndParseBlob>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Variable_create404Response": {"backCompat": false}
 */
declare type current_as_old_for_Variable_create404Response = requireAssignableTo<TypeOnly<typeof current.create404Response>, TypeOnly<typeof old.create404Response>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Variable_isSerializedHandle": {"backCompat": false}
 */
declare type current_as_old_for_Variable_isSerializedHandle = requireAssignableTo<TypeOnly<typeof current.isSerializedHandle>, TypeOnly<typeof old.isSerializedHandle>>
