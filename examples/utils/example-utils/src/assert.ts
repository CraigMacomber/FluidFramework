/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

/**
 * A browser friendly assert library.
 *
 * @param condition - The condition that should be true, if the condition is false an error will be thrown.
 * Only use this API when `false` indicates a logic error in the problem and thus a bug that should be fixed.
 * @param message - The message to include in the error when the condition does not hold.
 *
 * @remarks
 * Use this instead of the node's 'assert' package, which needs a polyfill for web and has a big impact on bundle sizes.
 * Can be used to narrow TypeScript types, allowing cases `assert(a instanceof A)` or `assert(typeof b === "number")` to replace `as` casts.
 *
 * @see {@link fail}.
 *
 * @privateRemarks
 * This is provided instead of just using the `assert` in core-utils since core-utils's `assert` is designed to work with our assert tagging which we don't do for examples.
 *
 * Additionally, core-utils is not supported for use outside this repo, and people are likely to copy example code out of this repo without reading the package level docs for it.
 * Using this in examples instead of core-utils reduces the chance of someone accidentally having their app depend on core-utils when it shouldn't.
 * It also allows this API to diverge, for example making the message optional.
 *
 * @internal
 */
export function assert(condition: boolean, message = "error"): asserts condition {
	if (!condition) {
		throw new Error(message);
	}
}

/**
 * Fails an assertion.
 * Throws an Error that the assertion failed.
 * Use when violations are logic errors in the program.
 *
 * @param message - Message to be printed if assertion fails.
 *
 * @remarks
 * Useful in the pattern `x ?? fail('message')`.
 * Using `?? fail` allows for message formatting without incurring the cost of formatting the message in the non failing case.
 *
 * Example:
 * ```typescript
 * x ?? fail(`x should exist for ${y}`)
 * ```
 *
 * Once [throw expressions are added to TypeScript](https://github.com/microsoft/TypeScript/issues/18535), they can be used as a replacement for this API.
 *
 * @see {@link assert}.
 *
 * @internal
 */
export function fail(message = "assertion failed"): never {
	throw new Error(message);
}
