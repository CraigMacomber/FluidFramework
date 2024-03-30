/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

/*
 * This download script is used to download the api json docs from the azure storage.
 * Saves each model under `_doc-models/<version>`.
 */

import path from "node:path";
import { fileURLToPath } from "node:url";

import chalk from "chalk";
import download from "download";
import fs from "fs-extra";

const dirname = path.dirname(fileURLToPath(import.meta.url));

const {
	params: { currentVersion, previousVersions },
} = await fs.readJSON(path.resolve(dirname, "data", "versions.json"));
const docVersions = previousVersions.concat(currentVersion);

try {
	await Promise.all(
		docVersions.map(async (version) => {
			// We currently download the "current" version's artifacts from the most recent main.
			// TODO: get "current" artifact from appropriate release branch, and don't use the artifact from the main branch.
			// TODO: remove `&& docVersions.length > 1` condition. The original condition was created assuming currentVersion represents
			// the latest content generated by api extractor. However, since currentVersion is currently set as v1, this condition
			// results in the docs using the api-extractor output instead of the downloaded v1 content. With the added !renderMultiversion
			// condition, it'll correctly use _api-extractor-temp-v1
			const versionPostfix =
				version === currentVersion && docVersions.length > 1 ? "" : `-${version}`;
			const url = `https://fluidframework.blob.core.windows.net/api-extractor-json/latest${versionPostfix}.tar.gz`;

			const destination = path.resolve(dirname, "_doc-models", version);

			// Delete any existing contents in the directory before downloading artifact
			await fs.ensureDir(destination);
			await fs.emptyDir(destination);

			// Download the artifacts
			await download(url, destination, { extract: true });
		}),
	);
} catch (error) {
	console.error(
		chalk.red("Could not download API doc model artifacts due to one or more errors:"),
	);
	console.error(error);
	process.exit(1);
}

console.log(chalk.green("API doc model artifacts downloaded!"));
process.exit(0);
