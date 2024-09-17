/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

/*
 * THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.
 * Generated by flub generate:typetests in @fluid-tools/build-cli.
 */

import type { TypeOnly, MinimalType, FullType, requireAssignableTo } from "@fluidframework/build-tools";
import type * as old from "@fluidframework/odsp-driver-previous/internal";

import type * as current from "../../index.js";

declare type MakeUnusedImportErrorsGoAway<T> = TypeOnly<T> | MinimalType<T> | FullType<T> | typeof old | typeof current | requireAssignableTo<true, true>;

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Class_EpochTracker": {"forwardCompat": false}
 */
declare type old_as_current_for_Class_EpochTracker = requireAssignableTo<TypeOnly<old.EpochTracker>, TypeOnly<current.EpochTracker>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Class_EpochTracker": {"backCompat": false}
 */
declare type current_as_old_for_Class_EpochTracker = requireAssignableTo<TypeOnly<current.EpochTracker>, TypeOnly<old.EpochTracker>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Class_OdspDocumentServiceFactory": {"forwardCompat": false}
 */
declare type old_as_current_for_Class_OdspDocumentServiceFactory = requireAssignableTo<TypeOnly<old.OdspDocumentServiceFactory>, TypeOnly<current.OdspDocumentServiceFactory>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Class_OdspDocumentServiceFactory": {"backCompat": false}
 */
declare type current_as_old_for_Class_OdspDocumentServiceFactory = requireAssignableTo<TypeOnly<current.OdspDocumentServiceFactory>, TypeOnly<old.OdspDocumentServiceFactory>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Class_OdspDocumentServiceFactoryCore": {"forwardCompat": false}
 */
declare type old_as_current_for_Class_OdspDocumentServiceFactoryCore = requireAssignableTo<TypeOnly<old.OdspDocumentServiceFactoryCore>, TypeOnly<current.OdspDocumentServiceFactoryCore>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Class_OdspDocumentServiceFactoryCore": {"backCompat": false}
 */
declare type current_as_old_for_Class_OdspDocumentServiceFactoryCore = requireAssignableTo<TypeOnly<current.OdspDocumentServiceFactoryCore>, TypeOnly<old.OdspDocumentServiceFactoryCore>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Class_OdspDocumentServiceFactoryWithCodeSplit": {"forwardCompat": false}
 */
declare type old_as_current_for_Class_OdspDocumentServiceFactoryWithCodeSplit = requireAssignableTo<TypeOnly<old.OdspDocumentServiceFactoryWithCodeSplit>, TypeOnly<current.OdspDocumentServiceFactoryWithCodeSplit>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Class_OdspDocumentServiceFactoryWithCodeSplit": {"backCompat": false}
 */
declare type current_as_old_for_Class_OdspDocumentServiceFactoryWithCodeSplit = requireAssignableTo<TypeOnly<current.OdspDocumentServiceFactoryWithCodeSplit>, TypeOnly<old.OdspDocumentServiceFactoryWithCodeSplit>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Class_OdspDriverUrlResolver": {"forwardCompat": false}
 */
declare type old_as_current_for_Class_OdspDriverUrlResolver = requireAssignableTo<TypeOnly<old.OdspDriverUrlResolver>, TypeOnly<current.OdspDriverUrlResolver>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Class_OdspDriverUrlResolver": {"backCompat": false}
 */
declare type current_as_old_for_Class_OdspDriverUrlResolver = requireAssignableTo<TypeOnly<current.OdspDriverUrlResolver>, TypeOnly<old.OdspDriverUrlResolver>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Class_OdspDriverUrlResolverForShareLink": {"forwardCompat": false}
 */
declare type old_as_current_for_Class_OdspDriverUrlResolverForShareLink = requireAssignableTo<TypeOnly<old.OdspDriverUrlResolverForShareLink>, TypeOnly<current.OdspDriverUrlResolverForShareLink>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Class_OdspDriverUrlResolverForShareLink": {"backCompat": false}
 */
declare type current_as_old_for_Class_OdspDriverUrlResolverForShareLink = requireAssignableTo<TypeOnly<current.OdspDriverUrlResolverForShareLink>, TypeOnly<old.OdspDriverUrlResolverForShareLink>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "ClassStatics_EpochTracker": {"backCompat": false}
 */
declare type current_as_old_for_ClassStatics_EpochTracker = requireAssignableTo<TypeOnly<typeof current.EpochTracker>, TypeOnly<typeof old.EpochTracker>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "ClassStatics_OdspDocumentServiceFactory": {"backCompat": false}
 */
declare type current_as_old_for_ClassStatics_OdspDocumentServiceFactory = requireAssignableTo<TypeOnly<typeof current.OdspDocumentServiceFactory>, TypeOnly<typeof old.OdspDocumentServiceFactory>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "ClassStatics_OdspDocumentServiceFactoryCore": {"backCompat": false}
 */
declare type current_as_old_for_ClassStatics_OdspDocumentServiceFactoryCore = requireAssignableTo<TypeOnly<typeof current.OdspDocumentServiceFactoryCore>, TypeOnly<typeof old.OdspDocumentServiceFactoryCore>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "ClassStatics_OdspDocumentServiceFactoryWithCodeSplit": {"backCompat": false}
 */
declare type current_as_old_for_ClassStatics_OdspDocumentServiceFactoryWithCodeSplit = requireAssignableTo<TypeOnly<typeof current.OdspDocumentServiceFactoryWithCodeSplit>, TypeOnly<typeof old.OdspDocumentServiceFactoryWithCodeSplit>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "ClassStatics_OdspDriverUrlResolver": {"backCompat": false}
 */
declare type current_as_old_for_ClassStatics_OdspDriverUrlResolver = requireAssignableTo<TypeOnly<typeof current.OdspDriverUrlResolver>, TypeOnly<typeof old.OdspDriverUrlResolver>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "ClassStatics_OdspDriverUrlResolverForShareLink": {"backCompat": false}
 */
declare type current_as_old_for_ClassStatics_OdspDriverUrlResolverForShareLink = requireAssignableTo<TypeOnly<typeof current.OdspDriverUrlResolverForShareLink>, TypeOnly<typeof old.OdspDriverUrlResolverForShareLink>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Enum_ClpCompliantAppHeader": {"forwardCompat": false}
 */
declare type old_as_current_for_Enum_ClpCompliantAppHeader = requireAssignableTo<TypeOnly<old.ClpCompliantAppHeader>, TypeOnly<current.ClpCompliantAppHeader>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Enum_ClpCompliantAppHeader": {"backCompat": false}
 */
declare type current_as_old_for_Enum_ClpCompliantAppHeader = requireAssignableTo<TypeOnly<current.ClpCompliantAppHeader>, TypeOnly<old.ClpCompliantAppHeader>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Enum_SharingLinkHeader": {"forwardCompat": false}
 */
declare type old_as_current_for_Enum_SharingLinkHeader = requireAssignableTo<TypeOnly<old.SharingLinkHeader>, TypeOnly<current.SharingLinkHeader>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Enum_SharingLinkHeader": {"backCompat": false}
 */
declare type current_as_old_for_Enum_SharingLinkHeader = requireAssignableTo<TypeOnly<current.SharingLinkHeader>, TypeOnly<old.SharingLinkHeader>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Enum_SnapshotFormatSupportType": {"forwardCompat": false}
 */
declare type old_as_current_for_Enum_SnapshotFormatSupportType = requireAssignableTo<TypeOnly<old.SnapshotFormatSupportType>, TypeOnly<current.SnapshotFormatSupportType>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Enum_SnapshotFormatSupportType": {"backCompat": false}
 */
declare type current_as_old_for_Enum_SnapshotFormatSupportType = requireAssignableTo<TypeOnly<current.SnapshotFormatSupportType>, TypeOnly<old.SnapshotFormatSupportType>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Function_checkUrl": {"backCompat": false}
 */
declare type current_as_old_for_Function_checkUrl = requireAssignableTo<TypeOnly<typeof current.checkUrl>, TypeOnly<typeof old.checkUrl>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Function_createLocalOdspDocumentServiceFactory": {"backCompat": false}
 */
declare type current_as_old_for_Function_createLocalOdspDocumentServiceFactory = requireAssignableTo<TypeOnly<typeof current.createLocalOdspDocumentServiceFactory>, TypeOnly<typeof old.createLocalOdspDocumentServiceFactory>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Function_createOdspCreateContainerRequest": {"backCompat": false}
 */
declare type current_as_old_for_Function_createOdspCreateContainerRequest = requireAssignableTo<TypeOnly<typeof current.createOdspCreateContainerRequest>, TypeOnly<typeof old.createOdspCreateContainerRequest>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Function_createOdspUrl": {"backCompat": false}
 */
declare type current_as_old_for_Function_createOdspUrl = requireAssignableTo<TypeOnly<typeof current.createOdspUrl>, TypeOnly<typeof old.createOdspUrl>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Function_encodeOdspFluidDataStoreLocator": {"backCompat": false}
 */
declare type current_as_old_for_Function_encodeOdspFluidDataStoreLocator = requireAssignableTo<TypeOnly<typeof current.encodeOdspFluidDataStoreLocator>, TypeOnly<typeof old.encodeOdspFluidDataStoreLocator>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Function_getHashedDocumentId": {"backCompat": false}
 */
declare type current_as_old_for_Function_getHashedDocumentId = requireAssignableTo<TypeOnly<typeof current.getHashedDocumentId>, TypeOnly<typeof old.getHashedDocumentId>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Function_getLocatorFromOdspUrl": {"backCompat": false}
 */
declare type current_as_old_for_Function_getLocatorFromOdspUrl = requireAssignableTo<TypeOnly<typeof current.getLocatorFromOdspUrl>, TypeOnly<typeof old.getLocatorFromOdspUrl>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Function_getOdspUrlParts": {"backCompat": false}
 */
declare type current_as_old_for_Function_getOdspUrlParts = requireAssignableTo<TypeOnly<typeof current.getOdspUrlParts>, TypeOnly<typeof old.getOdspUrlParts>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Function_isOdcUrl": {"backCompat": false}
 */
declare type current_as_old_for_Function_isOdcUrl = requireAssignableTo<TypeOnly<typeof current.isOdcUrl>, TypeOnly<typeof old.isOdcUrl>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Function_isOdspResolvedUrl": {"backCompat": false}
 */
declare type current_as_old_for_Function_isOdspResolvedUrl = requireAssignableTo<TypeOnly<typeof current.isOdspResolvedUrl>, TypeOnly<typeof old.isOdspResolvedUrl>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Function_isSpoUrl": {"backCompat": false}
 */
declare type current_as_old_for_Function_isSpoUrl = requireAssignableTo<TypeOnly<typeof current.isSpoUrl>, TypeOnly<typeof old.isSpoUrl>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Function_parseCompactSnapshotResponse": {"backCompat": false}
 */
declare type current_as_old_for_Function_parseCompactSnapshotResponse = requireAssignableTo<TypeOnly<typeof current.parseCompactSnapshotResponse>, TypeOnly<typeof old.parseCompactSnapshotResponse>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Function_prefetchLatestSnapshot": {"backCompat": false}
 */
declare type current_as_old_for_Function_prefetchLatestSnapshot = requireAssignableTo<TypeOnly<typeof current.prefetchLatestSnapshot>, TypeOnly<typeof old.prefetchLatestSnapshot>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Function_storeLocatorInOdspUrl": {"backCompat": false}
 */
declare type current_as_old_for_Function_storeLocatorInOdspUrl = requireAssignableTo<TypeOnly<typeof current.storeLocatorInOdspUrl>, TypeOnly<typeof old.storeLocatorInOdspUrl>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Interface_ICacheAndTracker": {"forwardCompat": false}
 */
declare type old_as_current_for_Interface_ICacheAndTracker = requireAssignableTo<TypeOnly<old.ICacheAndTracker>, TypeOnly<current.ICacheAndTracker>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Interface_ICacheAndTracker": {"backCompat": false}
 */
declare type current_as_old_for_Interface_ICacheAndTracker = requireAssignableTo<TypeOnly<current.ICacheAndTracker>, TypeOnly<old.ICacheAndTracker>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Interface_IClpCompliantAppHeader": {"forwardCompat": false}
 */
declare type old_as_current_for_Interface_IClpCompliantAppHeader = requireAssignableTo<TypeOnly<old.IClpCompliantAppHeader>, TypeOnly<current.IClpCompliantAppHeader>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Interface_IClpCompliantAppHeader": {"backCompat": false}
 */
declare type current_as_old_for_Interface_IClpCompliantAppHeader = requireAssignableTo<TypeOnly<current.IClpCompliantAppHeader>, TypeOnly<old.IClpCompliantAppHeader>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Interface_INonPersistentCache": {"forwardCompat": false}
 */
declare type old_as_current_for_Interface_INonPersistentCache = requireAssignableTo<TypeOnly<old.INonPersistentCache>, TypeOnly<current.INonPersistentCache>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Interface_INonPersistentCache": {"backCompat": false}
 */
declare type current_as_old_for_Interface_INonPersistentCache = requireAssignableTo<TypeOnly<current.INonPersistentCache>, TypeOnly<old.INonPersistentCache>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Interface_IOdspCache": {"forwardCompat": false}
 */
declare type old_as_current_for_Interface_IOdspCache = requireAssignableTo<TypeOnly<old.IOdspCache>, TypeOnly<current.IOdspCache>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Interface_IOdspCache": {"backCompat": false}
 */
declare type current_as_old_for_Interface_IOdspCache = requireAssignableTo<TypeOnly<current.IOdspCache>, TypeOnly<old.IOdspCache>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Interface_IOdspResponse": {"forwardCompat": false}
 */
declare type old_as_current_for_Interface_IOdspResponse = requireAssignableTo<TypeOnly<old.IOdspResponse<any>>, TypeOnly<current.IOdspResponse<any>>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Interface_IOdspResponse": {"backCompat": false}
 */
declare type current_as_old_for_Interface_IOdspResponse = requireAssignableTo<TypeOnly<current.IOdspResponse<any>>, TypeOnly<old.IOdspResponse<any>>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Interface_IPersistedFileCache": {"forwardCompat": false}
 */
declare type old_as_current_for_Interface_IPersistedFileCache = requireAssignableTo<TypeOnly<old.IPersistedFileCache>, TypeOnly<current.IPersistedFileCache>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Interface_IPersistedFileCache": {"backCompat": false}
 */
declare type current_as_old_for_Interface_IPersistedFileCache = requireAssignableTo<TypeOnly<current.IPersistedFileCache>, TypeOnly<old.IPersistedFileCache>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Interface_IPrefetchSnapshotContents": {"forwardCompat": false}
 */
declare type old_as_current_for_Interface_IPrefetchSnapshotContents = requireAssignableTo<TypeOnly<old.IPrefetchSnapshotContents>, TypeOnly<current.IPrefetchSnapshotContents>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Interface_IPrefetchSnapshotContents": {"backCompat": false}
 */
declare type current_as_old_for_Interface_IPrefetchSnapshotContents = requireAssignableTo<TypeOnly<current.IPrefetchSnapshotContents>, TypeOnly<old.IPrefetchSnapshotContents>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Interface_ISharingLinkHeader": {"forwardCompat": false}
 */
declare type old_as_current_for_Interface_ISharingLinkHeader = requireAssignableTo<TypeOnly<old.ISharingLinkHeader>, TypeOnly<current.ISharingLinkHeader>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Interface_ISharingLinkHeader": {"backCompat": false}
 */
declare type current_as_old_for_Interface_ISharingLinkHeader = requireAssignableTo<TypeOnly<current.ISharingLinkHeader>, TypeOnly<old.ISharingLinkHeader>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Interface_ISnapshotContents": {"forwardCompat": false}
 */
declare type old_as_current_for_Interface_ISnapshotContents = requireAssignableTo<TypeOnly<old.ISnapshotContents>, TypeOnly<current.ISnapshotContents>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Interface_ISnapshotContents": {"backCompat": false}
 */
declare type current_as_old_for_Interface_ISnapshotContents = requireAssignableTo<TypeOnly<current.ISnapshotContents>, TypeOnly<old.ISnapshotContents>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Interface_ISnapshotContentsWithProps": {"forwardCompat": false}
 */
declare type old_as_current_for_Interface_ISnapshotContentsWithProps = requireAssignableTo<TypeOnly<old.ISnapshotContentsWithProps>, TypeOnly<current.ISnapshotContentsWithProps>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Interface_ISnapshotContentsWithProps": {"backCompat": false}
 */
declare type current_as_old_for_Interface_ISnapshotContentsWithProps = requireAssignableTo<TypeOnly<current.ISnapshotContentsWithProps>, TypeOnly<old.ISnapshotContentsWithProps>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Interface_OdspFluidDataStoreLocator": {"forwardCompat": false}
 */
declare type old_as_current_for_Interface_OdspFluidDataStoreLocator = requireAssignableTo<TypeOnly<old.OdspFluidDataStoreLocator>, TypeOnly<current.OdspFluidDataStoreLocator>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Interface_OdspFluidDataStoreLocator": {"backCompat": false}
 */
declare type current_as_old_for_Interface_OdspFluidDataStoreLocator = requireAssignableTo<TypeOnly<current.OdspFluidDataStoreLocator>, TypeOnly<old.OdspFluidDataStoreLocator>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Interface_ShareLinkFetcherProps": {"forwardCompat": false}
 */
declare type old_as_current_for_Interface_ShareLinkFetcherProps = requireAssignableTo<TypeOnly<old.ShareLinkFetcherProps>, TypeOnly<current.ShareLinkFetcherProps>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Interface_ShareLinkFetcherProps": {"backCompat": false}
 */
declare type current_as_old_for_Interface_ShareLinkFetcherProps = requireAssignableTo<TypeOnly<current.ShareLinkFetcherProps>, TypeOnly<old.ShareLinkFetcherProps>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAlias_FetchType": {"forwardCompat": false}
 */
declare type old_as_current_for_TypeAlias_FetchType = requireAssignableTo<TypeOnly<old.FetchType>, TypeOnly<current.FetchType>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAlias_FetchType": {"backCompat": false}
 */
declare type current_as_old_for_TypeAlias_FetchType = requireAssignableTo<TypeOnly<current.FetchType>, TypeOnly<old.FetchType>>

/*
 * Validate forward compatibility by using the old type in place of the current type.
 * If this test starts failing, it indicates a change that is not forward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAlias_FetchTypeInternal": {"forwardCompat": false}
 */
declare type old_as_current_for_TypeAlias_FetchTypeInternal = requireAssignableTo<TypeOnly<old.FetchTypeInternal>, TypeOnly<current.FetchTypeInternal>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "TypeAlias_FetchTypeInternal": {"backCompat": false}
 */
declare type current_as_old_for_TypeAlias_FetchTypeInternal = requireAssignableTo<TypeOnly<current.FetchTypeInternal>, TypeOnly<old.FetchTypeInternal>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Variable_locatorQueryParamName": {"backCompat": false}
 */
declare type current_as_old_for_Variable_locatorQueryParamName = requireAssignableTo<TypeOnly<typeof current.locatorQueryParamName>, TypeOnly<typeof old.locatorQueryParamName>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Variable_OdcApiSiteOrigin": {"backCompat": false}
 */
declare type current_as_old_for_Variable_OdcApiSiteOrigin = requireAssignableTo<TypeOnly<typeof current.OdcApiSiteOrigin>, TypeOnly<typeof old.OdcApiSiteOrigin>>

/*
 * Validate backward compatibility by using the current type in place of the old type.
 * If this test starts failing, it indicates a change that is not backward compatible.
 * To acknowledge the breaking change, add the following to package.json under
 * typeValidation.broken:
 * "Variable_OdcFileSiteOrigin": {"backCompat": false}
 */
declare type current_as_old_for_Variable_OdcFileSiteOrigin = requireAssignableTo<TypeOnly<typeof current.OdcFileSiteOrigin>, TypeOnly<typeof old.OdcFileSiteOrigin>>
