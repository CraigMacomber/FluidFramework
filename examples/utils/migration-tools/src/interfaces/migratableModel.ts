/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

/**
 * A model with a detectable version.
 *
 * @remarks
 * It's appropriate to use this version to deduce the more specific type of model.
 * @alpha
 */
export interface IVersionedModel {
	/**
	 * The string version of the model, matching the version of the container code it's paired with.
	 */
	readonly version: string;
}

/**
 * A model that can import data of ImportType when in detached state, and can also export its data to ExportType.
 * @alpha
 */
export interface IImportExportModel<ImportType, ExportType> {
	/**
	 * Permit format checking in a generic manner - without knowing the type of our data or the type of the model,
	 * we can still check whether the model supports that data.
	 */
	supportsDataFormat: (initialData: unknown) => initialData is ImportType;

	/**
	 * importData must be called after initialization but before modifying or attaching the model (i.e. can only
	 * be called on an unaltered, detached model).
	 */
	importData: (initialData: ImportType) => Promise<void>;

	/**
	 * Export the data from the model.  Can be passed into importData() for a new container to replicate the data.
	 */
	exportData: () => Promise<ExportType>;
}

// TODO: Is there a better way to express the unknown format here?  I think I'd prefer to put the burden of calling
// supportsDataFormat() on the callers of importData() (and allow implementers of IMigratableModel to assume
// importData() is called with valid data).
/**
 * A model which supports migration via the MigrationTool and Migrator.
 *
 * @privateRemarks
 * A migratable model must have an observable version, which is used to determine if migration is required and to
 * identify the source and destination container codes.
 *
 * It must also support import/export, as this is the mechanism that MigrationTool and Migrator use to perform the
 * migration.
 *
 * Lastly, it should provide dispose capabilities for two purposes: (1) The Migrator will spawn a temporary model
 * to export the data, which should be cleaned up after export and (2) After migration is complete, the old model
 * is likely no longer needed and should be cleaned up.
 * @alpha
 */
export interface IMigratableModel
	extends IVersionedModel,
		IImportExportModel<unknown, unknown> {
	/**
	 * Dispose the model, rendering it inoperable and closing connections.
	 *
	 * @privateRemarks
	 * This is required on the interface because the Migrator will make its own instance of the model for export,
	 * and needs to clean that model up after the export is done.
	 */
	dispose(): void;
}