/*!
 * Copyright (c) Microsoft Corporation and contributors. All rights reserved.
 * Licensed under the MIT License.
 */

import { GraphCommit } from "../core/index.js";

/**
 * Encapsulates a state machine that can be used by a {@link SharedTreeCore} manage resubmit phases,
 * especially dealing with the proper updating of enrichments on resubmitted commits.
 */
export interface ResubmitMachine<TChange> {
	/**
	 * Must be called before calling `enrichCommit` as part of a resubmit phase.
	 * @param toResubmit - the commits that will be resubmitted (from oldest to newest).
	 * This must be the most rebased version of these commits (i.e., rebased over all known concurrent edits)
	 * as opposed to the version which was last submitted.
	 * `toResubmit` can be safely mutated by the caller after this call returns.
	 */
	prepareForResubmit(toResubmit: readonly GraphCommit<TChange>[]): void;

	/**
	 * @returns the next commit that should be resubmitted.
	 *
	 * Throws when invoked outside of a resubmit phase.
	 */
	peekNextCommit(): GraphCommit<TChange>;

	/**
	 * Is true iff the commit enricher is currently in a resubmit phase.
	 */
	readonly isInResubmitPhase: boolean;

	/**
	 * Must be when a commit is submitted or resubmitted.
	 * @param commit - the (enriched) commit (re)submitted. Not mutated.
	 */
	onCommitSubmitted(commit: GraphCommit<TChange>): void;

	/**
	 * Must be called after a sequenced commit is applied.
	 * @param isLocal - whether the sequenced commit was generated by the local session.
	 */
	onSequencedCommitApplied(isLocal: boolean): void;
}
