# FlexTree anchor and cursor optimization exploration

## Branch scope and handoff status

**Research branch: `flexOpt`. Do not open a production PR for, or merge, this exploration branch.**
This directory records experiments and coordinates future landing branches.
Keep this plan, research-only scripts and data, and the eventual PR handoff document on the exploration branch, not on the landing branches.
References to future PRs will identify their own head and base branches explicitly.

- Starting production commit: `8defa178a083468b6160508f35fb67026329ec34`.
- That commit includes [microsoft/FluidFramework#28519](https://github.com/microsoft/FluidFramework/pull/28519), the earlier array bounds-check and primitive-boxing improvements.
- At this handoff, the checkout was clean before this document was added.
- Execution is underway; see [the experiment record](experiments.md) and [raw results](results).
- A, B and C are implemented and measured; D was reverted after primitive regressions.
- E remains inconclusive and is not included in the landing set.
- Execution details, corrected hypotheses and raw result references are in [the experiment record](experiments.md).
- Do not push branches or create PRs in this phase.
  A separate agent with the necessary permissions will use the final committed handoff to do that.

This document is self-contained.
Do not depend on earlier chat messages, session files, or editor attachments.
Re-read relevant code before making changes; locations and assumptions may change.

## Goal and constraints

Reduce unnecessary cursor navigation, recovery, path allocation, and anchor bookkeeping in FlexTree.
Optimize general FlexTree use across shallow and deep trees, including ordinary object, map, and array access and editing.
Treat `formatRange` as one useful stress workload because it currently exercises FlexTree heavily, not as the optimization target or the acceptance criterion.
The user has separate plans to specialize formatting operations so they avoid much of this FlexTree work.
An improvement should remain useful even if formatting stops exercising the optimized path.
Finish with the improvements supported by evidence, not a predetermined number of optimizations.
You may revise priorities, investigate new ideas, or reject candidates; record why.

Memory is a primary constraint.
ChunkedForest can hold very large numbers of very small chunks and fields.
Do not add per-chunk or per-field metadata, subscriptions, or ownership references merely to accelerate a large-array case without measuring and justifying their costs.
Prefer existing anchors, caches, and reusable cursor storage.
Avoid retaining extra wrappers or ancestors as an incidental consequence of an optimization.

Formatting-specific algorithms, batching shortcuts, and bypasses of FlexTree are out of scope.
FlexTree sequence-length caching is also out of scope: the user's separate PR is [microsoft/FluidFramework#28524](https://github.com/microsoft/FluidFramework/pull/28524).
Check its current status and overlapping changes when establishing baselines and preparing landing branches; this plan does not assume it has landed.
Do not duplicate that work, make this exploration depend on it without an explicit reason, or attribute its benefits to these changes.
If it lands during this work, record the baseline change and compare both variants with the same length-cache implementation.

Do not broaden this work into a general forest representation rewrite.
The known sibling scans may remain even after these changes.
Do not introduce a general chunk-length cache as a shortcut:
descendant lengths can change through in-place edits, including after detachment and reuse.
A WeakMap keyed by a chunk array does not solve that invalidation problem.
Extra owning chunk references could prevent useful in-place mutations.

## First task for the incoming agent

1. Read this plan and the repository's current contribution instructions.
2. Verify branch `flexOpt`, HEAD, worktree state, tooling, and dependencies without overwriting unrelated changes.
3. Record the actual experiment baseline commit and environment.
4. Inspect the benchmark and candidate code below.
5. Establish representative non-text shallow/deep baselines, the formatting stress case, and targeted operation counts before production edits.
6. Commit the benchmark scaffolding, reproducible commands, baseline data, and a plan update.
7. Explore the candidates individually, starting with anchor-only editing paths and early field-cache lookup.

Do not treat the historical timing table below as the new baseline.
Use the current starting production implementation, which already includes the earlier optimizations.

## Verified code findings

These are observations from the starting commit, not claims of measured speedups.

| Area | Current behavior | Relevant source |
| --- | --- | --- |
| Lazy node identity | Hydrated lazy nodes unconditionally hold an anchor and an AnchorNode. | [lazyNode.ts](../../src/feature-libraries/flex-tree/lazyNode.ts), `LazyTreeNode` |
| Recovery | A cleared lazy entity recovers through forest navigation to its anchor. | [lazyEntity.ts](../../src/feature-libraries/flex-tree/lazyEntity.ts), `cursor` |
| Invalidation | Each forest `beforeChange` clears all currently held FlexTree cursors. A transaction does not keep those cursors valid across its individual edits. | [context.ts](../../src/feature-libraries/flex-tree/context.ts), `prepareForEdit` |
| Root navigation | Both forests reconstruct a root-to-destination path and navigate it during recovery. | [chunkedForest.ts](../../src/feature-libraries/chunked-forest/chunkedForest.ts), [objectForest.ts](../../src/feature-libraries/object-forest/objectForest.ts), `moveCursorToPath` |
| Parent location | `parentField` reads the key and index from the anchor, but also recovers a cursor, navigates upward, obtains the field, and re-enters the original node. | [lazyNode.ts](../../src/feature-libraries/flex-tree/lazyNode.ts), `parentField` |
| Parent wrapper | A field's `parent` navigates a cursor and gets or creates the parent node, even when a wrapper already exists on the anchor. | [lazyField.ts](../../src/feature-libraries/flex-tree/lazyField.ts), `parent` |
| Editing path | `getFieldPath` obtains the parent wrapper to get its anchor; `getFieldPathForEditing` repeatedly uses the parent accessor. | [lazyField.ts](../../src/feature-libraries/flex-tree/lazyField.ts) |
| Field cache | `getBoxed` navigates first; `makeField` builds an anchor, locates its parent, and only then checks the field cache. On a hit, it releases the temporary anchor. | [lazyNode.ts](../../src/feature-libraries/flex-tree/lazyNode.ts), [lazyField.ts](../../src/feature-libraries/flex-tree/lazyField.ts) |
| Child cache | `unboxedFlexNode` uses anchors to find a cached non-leaf child, but only after cursor navigation and a value read. | [lazyField.ts](../../src/feature-libraries/flex-tree/lazyField.ts), `unboxedFlexNode` |
| Existing anchor helpers | `childIfAnchored` uses binary search; `find` and `trackInner` recognize an existing PathNode from the same AnchorSet. Reuse these capabilities rather than rebuilding full paths. | [anchorSet.ts](../../src/core/tree/anchorSet.ts) |
| Cursor copying | ChunkedForest `fork` allocates a cursor and copies several depth-sized stacks, plus a nested cursor if present. | [chunkedForest.ts](../../src/feature-libraries/chunked-forest/chunkedForest.ts), `Cursor.fork` |
| Public parent/key queries | `Tree.parent`, `Tree.key`, and `getStoredKey` use parent-field machinery richer than the information they need. | [treeNodeApi.ts](../../src/simple-tree/api/treeNodeApi.ts) |
| Formatting loop | Each iteration reads a content element and applies an edit; this repeatedly exercises field lookup, node access, and recovery after edits. | [textDomainFormatted.ts](../../src/text/textDomainFormatted.ts), `#editRange` and `formatRange` |

## Candidate experiments

The sequence below is a priority order, not a dependency graph.
Determine actual dependencies as experiments progress.
For each candidate, keep a baseline that differs only in the intended change.

### A. Anchor-only field paths and edit checks

Construct field paths using the existing parent anchor rather than resolving a parent wrapper and cursor.
Use the existing anchor-based status machinery where appropriate.
Do not accidentally change editing eligibility for root, detached, removed, or deleted fields.

Expected mechanism: fewer cursor recoveries, parent-wrapper lookups, and anchor constructions on editing paths.
This is the first production candidate because it applies to general editing paths and may require little structural change.

### B. Field-cache lookup before navigation

Use the known parent FlexTree node and field key to consult the existing field cache before obtaining a cursor or building a temporary anchor.
Navigate only on a miss.
Retain a generic fallback for callers that only have a cursor.
Do not add a parallel cache when the current cache can serve both paths.

Keep `tryGetField` semantics distinct from `getBoxed`: a cached field object does not establish that the field is currently non-empty.
Retain observation hooks and disposal/context validation on cache hits.
Measure cached and uncached access, optional-field changes, and many small nodes/fields.

### C. Anchor-based parent and key access

Reuse a cached parent wrapper when present.
Consider an internal lightweight location accessor so index/key callers do not have to construct a FlexTree field.
Use fallback navigation when parent schema or a missing parent wrapper genuinely requires it.

An ancestor AnchorNode is not evidence that a FlexTree wrapper exists.
Preserve unhydrated behavior, stored-key to property-key mapping, detached-root behavior, and observation semantics.
Do not change a caller merely because its name suggests it needs only an index; inspect the full contract.

### D. Cached-child lookup before entering the forest

Investigate returning an existing non-leaf wrapper from the parent anchor and validated index before entering the child cursor.
The existing cached-child lookup occurs too late to avoid that navigation.

Measure whether binary anchor lookup costs less than avoided navigation, including after edits and for deep nodes.
Test primitives, mixed arrays, cache misses, and sparsely anchored children.
Do not mistake absence of an anchor for absence of a node.
Do not skip bounds checks unless the caller's contract already establishes bounds.

### E. Recover from a current ancestor cursor

Investigate finding the nearest suitable, already-current ancestor cursor, copying its position into the destination's existing cursor, and navigating the suffix.
Fall back to existing root-based recovery when no suitable ancestor exists.
Consider an internal copy/reset operation or a reusable-destination fork API only after measuring the opportunity.

Important limitations:

- After an edit, all FlexTree cursors initially need recovery.
  Reuse only helps when related cursors become current before another edit.
- Cursor copying is depth-dependent, not free.
  Reusing the outer object alone may still allocate backing stacks or nested cursors.
- Recursively recovering and copying every ancestor can create quadratic-in-depth work.
  Prefer one usable ancestor and one copy.
- A current cursor can be temporarily navigated away from its owning entity by a helper.
  State alone does not prove it is at the owner's logical location.
- Preserve source position, field/node mode, forest identity, current-cursor registration, and clear/free rules.
- Cover all implementations and adapters affected by a cursor-interface change, including the comparison forest and nested chunk cursors.
- Avoid keeping extra ancestor wrappers current or alive just to make this strategy work.

### F. New ideas and combined effects

Record additional opportunities discovered during profiling.
For example, repeated path construction from known anchors may occur in other editing helpers.
Keep new experiments within the agreed cursor/anchor scope unless the user approves a larger change.

Measure the final combination, not just isolated candidates.
If benefits overlap, remove individual optimizations temporarily to measure whether their complexity still earns its place.
Do not retain a more complicated implementation solely because an earlier isolated comparison looked favorable.

## Correctness and lifecycle checklist

Add focused tests alongside each accepted change.
Cover relevant cases from this list rather than treating end-to-end timing as a correctness test:

- Hydrated and unhydrated nodes; hydration while an iterator exists.
- Root and nested fields; required, optional, sequence, and map fields.
- Cached and uncached wrappers; empty fields that become non-empty and vice versa.
- Index changes, moves between parents, removal, reinsertion, undo/redo, and destruction.
- Deleted nodes, disposed contexts, and forest error/breaker behavior: do not let a cache hit silently bypass required rejection.
- Parent observation and field observation through [observer.ts](../../src/feature-libraries/flex-tree/observer.ts).
- Stored field names versus public property names.
- Anchor reference ownership and release, including cache misses and exceptions.
- Context-specific cache identity when an AnchorSet is reused.
- Cursor source/destination independence, nested cursor state, mode, and reuse after clear.
- Existing restrictions on edits or callbacks during cursor borrowing; do not introduce a new reentrancy hole.
- ChunkedForest, ObjectForest, and comparison-forest coverage where applicable.

Avoid broad catches, success-shaped fallbacks, or weakening assertions to make an experiment pass.
Keep generated API reports generated; do not edit them by hand.

## Benchmark plan

First inspect existing FlexTree and simple-tree benchmarks and reuse representative non-text workloads where possible.
Add focused cases for gaps rather than using formatting as a proxy for all FlexTree use.
Include [textDomain.integration.bench.ts](../../src/test/shared-tree/textDomain.integration.bench.ts) as an additional stress workload.
Preserve its formatRange operation, schema, alternating bold values, and untimed document rebuilding so results remain comparable; formatting algorithm changes are outside this exploration.

### Workloads

| Dimension | Initial coverage |
| --- | --- |
| Additional wrapper depth | 0 and 10; use 30 as a diagnostic if depth trends warrant it |
| General node shapes | Objects with required/optional fields, maps, primitive arrays, node arrays, and mixed arrays; include small fields and sparse wrapper materialization |
| General operations | Property reads/writes, map lookup/update, indexed reads and iteration, insert/remove/move, and parent/key queries |
| Collection sizes | Tiny and moderate collections as common-use controls; large collections as stress cases |
| Formatting document length | 100, 1,000, and 10,000; retain a 10-character small-case control where useful |
| Forest | ChunkedForest and ObjectForest |
| Materialization | First access/traversal separately from repeated access/editing of already accessed nodes |
| Access pattern | Repeated reads without edits; read after each edit; multiple related reads between edits |
| Targeted queries | Parent/key after edit, cached field access, cached non-leaf child access, cursor recovery/copy |
| Memory | Many tiny chunks/fields, few versus many materialized wrappers, deep trees, repeated edits and disposal |

For the formatting case, hold a reference to the nested text node before timing.
Do not time application-level traversal of the added wrappers unless that is a separately named workload.
Use wrappers with stable single-child structure so depth is not accidentally mixed with sibling-width changes.
Check first-pass and steady-state results separately: anchors and node wrappers are materialized lazily.

For each candidate, measure at least one relevant non-text benefit case and the common paths that could pay extra overhead.
For example, an early child-cache lookup needs primitive and cache-miss controls, not only a repeatedly accessed node array.
Do not build the full Cartesian product of all dimensions; choose and document a representative matrix before interpreting results.

Keep a tractable, representative subset as maintained performance tests, including non-text coverage for accepted optimizations.
Keep expensive matrices and diagnostic instrumentation in this research directory.
Do not put flaky elapsed-time thresholds in ordinary correctness tests.

### Mechanism measurements

Use separate instrumented runs to count:

- Cursor recoveries and root-path steps.
- Field-cache hits/misses and temporary anchor creation/release.
- Child-cache hits/misses.
- Sibling scans during cursor navigation and editing.
- Cursor copies, stack elements copied, and current cursors cleared per edit.

Counters must not remain enabled in timing runs.
For memory, distinguish allocation churn from retained heap.
Use existing [memory test utilities](../../src/test/memory/utils.ts) and benchmark helpers.
Measure after equivalent warmup, edits, and garbage collection, and check cleanup after disposal.
Record absolute bytes as well as percentages.

### Timing protocol and acceptance criteria

1. Record exact baseline/candidate SHAs or reproducible patches, Node/package-manager versions, commands, environment variables, assertion mode, sample settings, and host conditions.
2. Compile both variants identically and verify which implementation each process loads.
   Prefer isolated outputs/worktrees; if using a module loader, validate replacements and avoid stale generated modules.
3. Run variants serially in fresh processes with balanced order, such as ABBA followed by BAAB.
   Do not run builds, other benchmarks, or instrumented profiles concurrently with timings.
4. Use at least eight measured samples per process for the slow 10,000-character case when confirming a gain.
   Account for the existing document-rebuild schedule when interpreting samples.
5. Preserve per-process results, not just an aggregate.
   Report equal-weight process means, ranges, sample counts, and the benchmark's margins of error.
   Within-process margins do not describe between-process variability.
6. Predeclare the general operation being optimized, representative non-text workloads, and mechanism before interpreting a result.
   A timing improvement must reproduce in both order blocks and exceed observed run-to-run noise.
   If it does not, collect more evidence or label it inconclusive.
7. Check common read/edit paths, shallow/small cases, cache misses, primitives, and memory before acceptance.
   Reject or revise changes that reproducibly regress common uses even if they substantially improve formatRange.
   Do not average such regressions away with formatting or large-case gains.
   Set workload-specific memory tolerances from measured baseline noise before accepting metadata changes.
8. Do not call fewer operations a measured end-to-end speedup.
   A targeted general-purpose optimization can be valuable without a formatting gain, but state that scope explicitly.
   Conversely, a formatting-only gain is insufficient evidence of general value; establish benefit on relevant non-text operations before acceptance.
9. Confirm accepted improvements in production-emulated mode as well as the normal configuration.

## Historical evidence from the earlier optimization

The original formatting investigation found quadratic sibling work in ChunkedForest:
field-length summation, indexed cursor navigation, and edit-node lookup.
The benchmark's character field used many BasicChunks.
Uniform chunking alone did not solve the case because editing could expand chunks.
Experimental removal of those scans helped substantially, but those experimental transformations were not production-safe fixes.

The earlier bounds-check-only change did not demonstrate a reliable full-formatting speedup.
The complete array optimization set did:

| Forest | Characters | Original mean | Optimized mean | Less elapsed time |
| --- | ---: | ---: | ---: | ---: |
| ChunkedForest | 10 | 0.903 ms | 0.898 ms | 0.5% |
| ChunkedForest | 100 | 9.658 ms | 9.752 ms | -1.0% |
| ChunkedForest | 1,000 | 134.242 ms | 133.897 ms | 0.3% |
| ChunkedForest | 10,000 | 3,389.173 ms | 3,088.650 ms | 8.9% |
| ObjectForest | 1,000 | 138.950 ms | 135.230 ms | 2.7% |
| ObjectForest | 10,000 | 1,625.977 ms | 1,616.989 ms | 0.6% |

For the 10,000-character ChunkedForest case, the four original process means were 3498.449, 3439.876, 3287.548, and 3330.818 ms.
The four optimized process means were 3071.749, 3080.177, 3119.773, and 3082.901 ms.
Each process contributed eight measured samples for that case.

Method: Node v22.22.3, pnpm 11.27.0, normal development assertions, same shared machine, serial fresh processes in ABBA-BAAB order.
The original baseline was `19fabaa74037ba0a5d5c85788dae93b3f0c8c89d`.
The optimized implementation was committed locally as `cf67acef424`, then landed in upstream commit `8defa178a083468b6160508f35fb67026329ec34`.
The historical harness restored all six changed production modules from the original baseline, not just the first bounds-check change.
Its optimized transpilation was checked against normal build output.
The benchmark's minimum sample count was raised from three to eight; other benchmark settings were unchanged.
No memory measurement was made in that comparison.

The initial apparent small-case slowdown did not reproduce consistently in the reversed-order block.
Do not claim all table differences are significant.
Even after that optimization, 10 times the document length cost about 23 times the formatting time, and ChunkedForest remained about 1.9 times slower than ObjectForest at 10,000 characters.

The original benchmark can be rerun from committed source using the commands below.
To reproduce the historical higher-sample methodology, set the formatting benchmark's `minSampleCount` to eight in both variants and record the instrumentation patch.
The new exploration baseline is the already-optimized starting commit, not the historical original baseline.

## Commands and validation

Run package commands from `packages/dds/tree`.
Inspect current scripts before use; these commands reflect the starting checkout.

```bash
pnpm run build:esm
pnpm run build:test:esm
pnpm exec mocha --grep '^(ArrayNode |treeNodeApi |textDomainFormatted )' --reporter dot
pnpm exec mocha --emulateProduction --grep '^(ArrayNode |treeNodeApi |textDomainFormatted )' --reporter dot
```

Those focused tests previously passed with 1,221 passing and 9 pending in each mode.
That is historical evidence, not validation of this new work.
Add focused FlexTree, anchor, and forest tests appropriate to each change, then run the broader affected suites for the stabilized result.
Use Biome and ESLint on changed source files and `git diff --check`.

Existing full-document formatting benchmarks:

```bash
FLUID_TEST_PERF_MODE=1 pnpm exec mocha \
  --grep '^Text benchmarks whole document Formatted text (ChunkedForest|ObjectForest) Formatting \(formatRange\)' \
  --timeout 120000 \
  --reporter @fluid-tools/benchmark/dist/mocha/Reporter.js \
  --reporterOptions reportFile=/tmp/flex-format-baseline.json
```

This command uses the benchmark's current sample settings; it does not itself raise the minimum to eight.
Use distinct report paths for every process and preserve confirmation data under this directory.
Update the selector and commands when depth cases are added, and verify enumeration before a long run.
Do not use the package's parallel benchmark command for controlled comparisons.

The package Mocha configuration enumerates `lib/test`.
Adding `--spec` alone may not narrow it; use anchored grep selectors for ordinary runs.
If explicitly loading only selected files, also include `lib/test/mochaHooks.js` and the repository's test setup.
For direct worker profiling, invoke `node_modules/mocha/bin/_mocha` with `--conditions=allow-ff-test-exports` and `--expose-gc`.
Profiling the Mocha launcher can capture launcher idle time rather than benchmark work.
Production emulation depends on the Mocha hooks; record whether it is enabled.

## Research record and commit discipline

Keep this plan as the entry point.
Add an experiment log and modest, structured result files in this directory as work proceeds.
Use relative paths and commands without machine-specific session directories.
Avoid committing large CPU profiles, heap dumps, dependency outputs, or unrelated logs.
Summarize bulky evidence in reproducible data tables and explain how to regenerate it.

For each experiment, record:

- Candidate ID, hypothesis, target workload, and status: pending, running, accepted, rejected, or inconclusive.
- Exact baseline and candidate revisions; any uncommitted diagnostic patch.
- Commands, settings, raw result paths, and correctness checks.
- Timing and memory findings, mechanism counters, and limitations.
- Decision, rationale, dependencies, and next action.

Commit at meaningful boundaries: baseline, individual experiment with evidence, accepted improvement with tests, rejection/reversion with notes, and combined validation.
Keep production changes separable from research artifacts where practical.
Preserve the research history; revert rejected implementation changes with ordinary commits rather than resetting away the evidence.
Do not amend or rewrite user-owned history without permission.
Keep the plan's status table current so another agent can resume at any checkpoint.

| Work item | Status at handoff | Evidence/next action |
| --- | --- | --- |
| Representative non-text, depth, formatting, and memory baselines | Complete | [Experiment record](experiments.md); final memory uses library utilities |
| A: anchor-only edit paths | Accepted | No parent materialization or cursor recovery for field paths; isolated ablation retains benefit |
| B: early field-cache lookup | Accepted, extended | Also reuse non-empty `tryGetField` cache after checking length |
| C: parent/key access | Accepted, bounded | Cached parent field/wrapper paths; no public API changes |
| D: early child-cache lookup | Rejected and reverted | Reproducible primitive-access regressions |
| E: ancestor cursor recovery | Inconclusive; not landing | Existing copy is cheaper but reusable copy, ownership-position validation and allocation impact are not established |
| Combined validation and review | Complete | 2,820 tests pass in each mode; balanced timing, memory, ablation and quick review recorded |
| Clean PR branches and final handoff | In progress | Local-only benchmark prerequisite and optimization branch |

## Review, stabilization, and PR preparation

1. Invoke the repository's `review` skill on the combined accepted changes, with an explicit comparison base and scope.
   Separate research documentation from the production diff so neither obscures the other.
2. Fix findings, rerun relevant validation, and record the review scope and disposition.
   Repeat review of materially changed areas as needed.
3. Remove rejected production code and temporary instrumentation from the final implementation.
   Preserve useful experimental evidence on this branch.
4. Commit the tidy final exploration state and its combined timing/memory results.
5. Resolve an explicit upstream comparison base using the `comparison-base` skill before preparing landing branches.
   Do not quietly change the measured baseline; record upstream changes and revalidate when needed.
6. Create focused local branches with clean commits.
   Independent changes should use the agreed upstream base; genuinely dependent changes should have explicit stacks.
   Benchmark infrastructure may be a separate prerequisite PR if that makes reviews clearer.
   Do not predetermine the final PR boundaries before measuring interactions.
7. Include tests, maintained performance coverage, related documentation, and required changesets with each production change.
   Read the changeset guidelines before writing changesets.
   Do not carry this research directory into those branches.
8. Invoke the `review` skill on each actual prepared PR diff against its intended base.
   Fix findings and validate each branch independently; a combined green build does not prove every split branch is complete.
   Use the CI-readiness skill when checking the branches for CI readiness.
9. Verify that assembling the PR series reproduces the tested production source and maintained tests.
   Explain any intentional differences and rerun affected checks.
10. Return to `flexOpt` and commit the final PR handoff here.
    Leave local branches ready for the separate PR-management agent; do not push or open PRs.

The final handoff must prominently say that it is stored on `flexOpt` but describes PRs from other branches.
Include a table with exact head branch, intended base branch, prepared head SHA, prerequisite PRs/branches, and validation status.
Provide suggested titles/bodies, exact commands and their results, performance claims with evidence, parallel landing opportunities, and known limitations.
Use the PR-guide skill and inspect the current PR template when drafting bodies.

Include instructions for updating dependent branches after upstream squash merges.
Record each stack boundary so the management agent can transplant only the intended commits rather than carrying merged ancestors into the next PR.
Require revalidation after conflict resolution or material base changes.
Do not treat old commit SHAs as immutable instructions after the management agent updates branches; update the handoff as necessary.

The handoff must not depend on this conversation.
It is the durable interface between the experimental agent and the agent that creates and manages PRs.
