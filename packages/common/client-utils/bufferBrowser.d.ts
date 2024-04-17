/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

/*
 * THIS FILE SHOULD NOT BE DELETED.
 *
 * This file is needed for compatibility with TypeScript's Node10 module resolution. In most other packages it is
 * auto-generated by `flub generate entrypoints` in @fluid-tools/build-cli, and is thus gitignored in most packages.
 *
 * However, this package is unique in that it does not need to use API trimming or `flub generate entrypoints`,
 * but instead uses conditional exports to isomorphically support both Node and browser environments.
 */

export * from "./lib/bufferBrowser.js";