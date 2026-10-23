# Execution record

## Baseline

- Research HEAD: `b275a99150c38fe070ac74b73a733d38c264abc1`, clean `flexOpt`.
- Production baseline: `8defa178a083468b6160508f35fb67026329ec34`.
- Node.js 22.22.3, pnpm 11.27.0, Linux x86_64, shared host.
- The public GitHub API reports microsoft/FluidFramework#28524 open, not merged, head `c48bbec036377c9cd21ed09fd18618ddf1c8aba3`.
  `gh` has no authentication; public REST reads work.
  No length-cache changes are included.
- `pnpm run build:esm && pnpm run build:test:esm`: passed.

Run commands from `packages/dds/tree`.
The research harness imports a complete compiled tree and records hashes of candidate modules.
Preserve variant outputs under the ignored package cache:

```bash
mkdir -p node_modules/.cache/flex-opt/baseline
cp -a lib node_modules/.cache/flex-opt/baseline/
FLEX_OUTPUT=docs/flex-tree-optimization-research/results/baseline-initial.json node --expose-gc docs/flex-tree-optimization-research/measure.mjs --memory
FLEX_SAMPLES=1 FLEX_OUTPUT=docs/flex-tree-optimization-research/results/baseline-counts.json node --expose-gc docs/flex-tree-optimization-research/measure.mjs --counts
FLEX_OUTPUT=docs/flex-tree-optimization-research/results/baseline-format.json node --expose-gc docs/flex-tree-optimization-research/measure.mjs --format
```

All three commands passed.
The first harness attempt called a nonexistent independent-tree disposal method and failed before producing data.
The corrected harness disposes the view and its checkout.

### Predeclared matrix and interpretation

General matrix: both forests, depth 0/10, size 4/128, eight samples after warmup.
Includes required/optional object edits, map updates, primitive/node/mixed array reads, iteration, structural edits, parent/key, and multiple related reads per edit.
Field-path and field-cache diagnostics explicitly clear the entity cursor before each operation.
Those two cases measure a general mechanism, not end-to-end edit latency.
First traversal is included in warmup, not in steady-state claims; add a separate cold-access diagnostic before accepting a cache change.
No elapsed-time assertions are used.

Formatting: unchanged schema and `formatRange` operation, alternating bold, two warmup operations, eight measured samples, untimed rebuild every 16 operations.
Depth 0 uses 100/1,000/10,000 characters in both forests; depth 10 uses 100 as a deep stress control.
Keep a reference to text before timing.
This fixed-sample research harness is not the adaptive benchmark reporter; it reports approximate normal 95% margins, not the benchmark library's margins.
Do not compare these absolute numbers to the historical table or claim a formatting speedup without balanced confirmation.
Baseline 10,000-character means: ChunkedForest 3,571.48 ms, ObjectForest 2,086.78 ms.

Initial memory diagnostics cover 2,000 small objects/fields, sparse and dense wrapper materialization, both forests and depths, 20 edits, two warmup and four measured GC cycles.
The initial after-disposal values are sensitive to local-variable lifetimes; treat them as preliminary and use scoped/library memory measurements for acceptance.
No candidate may add per-chunk or per-field metadata.

### Acceptance protocol

Use serial fresh processes in ABBA then BAAB order for candidate confirmation.
Run the same matrix in production emulation.
Do not run builds or other controlled measurements concurrently.
Preserve process-level data and report equal-weight process means and ranges.
Common-path regressions require investigation, not averaging with targeted wins.
Counters run separately from timings; instrumenting forest entry points includes nested calls and is not a count of independent recoveries.
For metadata-free candidates, retained-heap tolerance is the larger of the baseline process range and 3% of retained bytes; investigate anything outside it.
No retention claim is based on elapsed time or allocation counts.

## Candidate decisions

| Candidate | Decision | Implementation/evidence |
| --- | --- | --- |
| A | Accept | `ad04d75d0cf`, refined error checks in `8fc4e272c0b`; anchor-only paths avoid parent wrapper creation. |
| B | Accept revised version | `a9a370dc515`, `8fc4e272c0b`, `cf3d95a5c37`; reuse the existing cache in `getBoxed` and, after checking emptiness, `tryGetField`. |
| C | Accept bounded version | `8fc4e272c0b`; reuse cached parent fields/wrappers, preserving cursor fallback. No new public location API. |
| D | Reject and revert | Experiment `e16d7718ee6`, ordinary revert `37103f5a`; primitive regressions outweigh cached-node benefit. |
| E | Inconclusive; do not land | Measured opportunity and copy cost, but no validated reusable-destination implementation. See below. |
| F | Fold into B | Non-empty `tryGetField` also needlessly constructed temporary anchors; reuse its cache only after the current length check. |

### Corrections discovered during execution

An unconditional breaker check in the first B prototype rejected reads through already-current cursors after a transaction error.
Two existing formatted-text tests exposed this.
The shared `assertCursorAccess` helper now preserves the existing distinction: freed entities fail; cleared entities check the breaker; current cursors remain readable.
Dedicated regression tests cover both branches.
The original helper's return type also hid that field paths contain AnchorNodes; the implementation now gives that existing fact an explicit narrower return type.
No public API changes are intended.

The first ABC matrix exposed large apparent object-read regressions.
Its 1,000-operation warmup left compilation in the timed samples, but that was not the only issue: ordinary object reads still constructed temporary anchors in `tryGetField`.
B was extended to reuse the cache after the non-empty check.
The final harness warms and measures 10,000 operations per read sample.
Keep the original results (`combined-*`, `production-*`, `ablate-*`) as diagnostic evidence, not as the final accepted implementation.

Cold traversal was sensitive to garbage collection triggered by untimed construction.
`refined-controls-*` retains that noisy experiment.
`cold-gc-*` uses 32 measured samples, eight warmup documents and explicit untimed GC after construction in both variants.
The final matrices also use this controlled-heap protocol.
No claim is made about application-wide GC latency from these timings.

The initial handwritten memory loop retained stack locals too long.
The final measurements use the benchmark library's `Box` and `collectMemoryUseData`, including before/allocated/deallocated measurements, two warmup and four kept iterations.
The first callback implementation called `beforeAllocation` before `continue`; it failed without producing results and was corrected to match the library's implementation.
The summary script was also tightened to distinguish `final-*` from `final-production-*`.

### Rejected child lookup

`child-*` initially suggested useful indexed-read gains.
The follow-up `child-focused-*` matrix isolates FlexTree `atIndex`, including primitives and mixed arrays, with 24 samples per process in ABBA-BAAB order.
Cached non-leaf access improved 64-82%, but primitive access regressed in both order blocks for every forest/depth/size combination: approximately 6-21%.
There were also cold-access regressions.
The production code was reverted instead of accepting these costs or adding schema/chunk metadata.
The existing cursor-first primitive path remains unchanged.

### Ancestor recovery

The final matched instrumented matrix reduces `tryMoveCursorToNode` calls from 339,032 to 12,112 and counted ancestor-path steps from 2,354,632 to 69,560.
Anchor `track` calls fall from 3,510,264 to 1,336.
These aggregate counts deliberately include the targeted field-path/cache workloads; they are not application-wide percentages.
Counters include nested forest calls, so do not add them as independent recoveries.
The final matrix still has 5,000 recovery entries with a potentially current ancestor.
This is an upper bound: membership in `withCursors` does not prove the cursor is at its owner's location.

`recovery-cost.json` measures existing cursor fork/free versus recovery into a reused destination.
At depth 10, fork/free took about 0.14-0.15 microseconds and root recovery about 2.5 microseconds (ChunkedForest) or 3.4 microseconds (ObjectForest).
This is promising, not an end-to-end E result: it excludes ancestor search, suffix navigation, safe ownership-position validation and destination registration.
ChunkedForest fork copies four depth-sized arrays and may fork a nested cursor.
There is no existing reusable-destination copy operation.
Do not land a replacement-cursor strategy without measuring allocation churn and covering all cursor implementations.
E remains an explicitly inconclusive research direction, not a hidden prerequisite or a claim that copying cannot help.
No cursor-interface changes, sibling-scan optimizations, chunk metadata or sequence-length caching are included.

## Final confirmation

Final production source is `cf3d95a5c3746508873babc45aaac812e79a58dc`.
Its maintained benchmark was added in `a5b1fa36cea`.
Baseline remains `8defa178a083468b6160508f35fb67026329ec34`.
The compiled snapshots contain whole `lib` trees; hashes recorded in each result identify the actual implementation loaded, even when the research HEAD differs.

```bash
# Populate baseline from the baseline source build, and final from the final source build.
mkdir -p node_modules/.cache/flex-opt/final
cp -a lib node_modules/.cache/flex-opt/final/
node docs/flex-tree-optimization-research/ablate.mjs
FLEX_COLD_GC=1 node docs/flex-tree-optimization-research/run-matrix.mjs baseline final final --memory
FLEX_COLD_GC=1 node docs/flex-tree-optimization-research/run-matrix.mjs baseline final final-production --production
FLEX_CASE=field-path node docs/flex-tree-optimization-research/run-matrix.mjs minus-a final final-ablate-a
FLEX_CASE='field-cache|object-read' node docs/flex-tree-optimization-research/run-matrix.mjs minus-b final final-ablate-b
FLEX_CASE=parent-key node docs/flex-tree-optimization-research/run-matrix.mjs minus-c final final-ablate-c
FLEX_CASE=map-update FLEX_SAMPLES=32 node docs/flex-tree-optimization-research/run-matrix.mjs baseline final map-control
FLEX_CASE='cursor-' FLEX_LIB=node_modules/.cache/flex-opt/final/lib FLEX_OUTPUT=docs/flex-tree-optimization-research/results/recovery-cost.json node --expose-gc docs/flex-tree-optimization-research/measure.mjs
FLEX_SAMPLES=1 FLEX_LIB=node_modules/.cache/flex-opt/final/lib FLEX_OUTPUT=docs/flex-tree-optimization-research/results/final-counts.json node --expose-gc docs/flex-tree-optimization-research/measure.mjs --counts
FLEX_SAMPLES=1 FLEX_LIB=node_modules/.cache/flex-opt/baseline/lib FLEX_OUTPUT=docs/flex-tree-optimization-research/results/baseline-matched-counts.json node --expose-gc docs/flex-tree-optimization-research/measure.mjs --counts
node docs/flex-tree-optimization-research/run-matrix.mjs baseline final format-final --format
node docs/flex-tree-optimization-research/summarize.mjs final baseline final
node docs/flex-tree-optimization-research/summarize.mjs final-production baseline final
node docs/flex-tree-optimization-research/summarize.mjs format-final baseline final
```

All commands above passed.
`ablate.mjs` generates diagnostic compiled-module variants by removing exactly one mechanism from the final implementation.
It retains the other mechanisms and guards, verifies replacement boundaries, and does not modify production source.
These variants are deliberately not landing branches.
Keep their instrumented/ablated output out of production builds.

### Results and limits

Use [final-summary.json](results/final-summary.json), [final-production-summary.json](results/final-production-summary.json) and the eight process files behind each for equal-weight process means, process ranges, samples and per-process approximate margins.
Do not interpret within-process margins as between-process uncertainty.

| General operation | Development: less time across tested cases | Production emulation: less time |
| --- | --- | --- |
| Object reads | 42-72% | 47-79% |
| Parent/key queries | 72-90% | 73-90% |
| Primitive indexed reads through simple-tree | 32-66% | 37-69% |
| Object writes | 4-22% | 3-22% |
| Edit followed by related reads | 14-30% | 14-23% |
| Cleared-cursor field-path diagnostic | 89-99% | 89-99% |
| Cleared-cursor field-cache diagnostic | 84-99% | 84-99% |

The diagnostic gains are not whole-edit gains.
Final ablations retain benefits for each of A, B and C; retain the small combined implementation rather than introducing separate metadata or navigation APIs.
One development map-update case showed an 8% regression with overlapping process ranges.
It did not reproduce in production or in the 32-sample isolated balanced confirmation: all map controls improved 4-21%.
Cold-traversal results vary; no general cold-start speedup is claimed.
The controlled-heap cold confirmation did not establish a regression.

Formatting is supplemental evidence.
Balanced 10,000-character runs show approximately 18.4% less time for ChunkedForest and 7.9% for ObjectForest; both order blocks improve.
Smaller/deeper formatting cases improve 5-14%.
See [format-final-summary.json](results/format-final-summary.json) for exact means and ranges.
These figures use the fixed-sample research harness, not the historical adaptive benchmark's reported margins.
Production-emulated confirmation is for the general workloads, not a second full formatting matrix.

### Retained memory

Equal-weight means of four independent processes; each process keeps four library measurements.
The final test includes 2,000 small objects, primitive and mixed arrays, a map, 20 edits, and explicit view/checkout disposal.
“Many” materializes the item wrappers and their optional fields; “few” does not.

| Forest/depth/materialization | Baseline bytes | Final bytes | Difference bytes |
| --- | ---: | ---: | ---: |
| Chunked / 0 / few | 2,383,728 | 2,385,168 | +1,440 |
| Chunked / 0 / many | 11,635,173 | 11,637,296 | +2,123 |
| Chunked / 10 / few | 2,784,289 | 2,782,490 | -1,800 |
| Chunked / 10 / many | 11,883,248 | 11,881,258 | -1,990 |
| Object / 0 / few | 5,766,271 | 5,769,395 | +3,124 |
| Object / 0 / many | 13,377,426 | 13,380,204 | +2,778 |
| Object / 10 / few | 6,012,967 | 6,010,885 | -2,081 |
| Object / 10 / many | 13,619,222 | 13,620,156 | +934 |

All mean changes are within 0.07%, below the predeclared tolerance.
Allocated and freed measurements are retained separately in each process file.
Small positive and negative post-disposal growth reflects runtime/GC noise; these measurements do not prove absence of every possible leak.
No per-node, per-field or per-chunk storage, owning references, or subscriptions were added.
Temporary-anchor counts measure churn in that specific mechanism; total allocation bytes were not measured.
Instrumentation was narrowed to the accepted mechanisms: forest navigation entries, ancestor-path steps, anchor tracking/release and potential current ancestors.
Field/child cache hit rates, sibling scans, cursor-clear counts and stack-element copy counts were not separately instrumented.
The retained implementation does not change sibling scanning or cursor copying; E's cost diagnostic is not a complete copy/allocation profile.
These are explicit limits of the evidence, not unreported speedup claims.

## Combined validation and review

- Source and test ESM builds: passed.
- Biome on all six changed TypeScript files: passed.
- ESLint `--quiet` on those files: passed; without `--quiet`, three existing undescribed-directive warnings remain.
- Expanded selector below: 2,820 passing, 9 pending in each of normal and production-emulated mode.
- `git diff --check`: passed.
- Maintained performance suite: 16/16 passed with the benchmark library reporter; sample counts and reported margins are in [maintained-navigation.json](results/maintained-navigation.json).
- New tests cover no-cursor editing paths, absent parent wrappers, cached empty/non-empty optional fields, observation, moves between arrays, removal, destruction, disposed contexts, reused AnchorSets and broken-forest semantics.

```bash
pnpm exec mocha --grep '^(LazyField|LazyNode|FlexTree navigation benchmarks|flex-tree utilities|AnchorSet|ChunkedForest|ObjectForest|Forest|ArrayNode |treeNodeApi |textDomainFormatted )' --reporter dot
pnpm exec mocha --emulateProduction --grep '^(LazyField|LazyNode|FlexTree navigation benchmarks|flex-tree utilities|AnchorSet|ChunkedForest|ObjectForest|Forest|ArrayNode |treeNodeApi |textDomainFormatted )' --reporter dot
FLUID_TEST_PERF_MODE=1 pnpm exec mocha --grep '^FlexTree navigation benchmarks ' --timeout 120000 --reporter @fluid-tools/benchmark/dist/mocha/Reporter.js --reporterOptions reportFile=docs/flex-tree-optimization-research/results/maintained-navigation.json
```

Quick review was selected for the combined and landing-branch reviews.
The comparison-base workflow found no open PR for `flexOpt`, fetched canonical upstream main into `refs/comparison/target`, and selected `8defa178a083468b6160508f35fb67026329ec34`.
At resolution, upstream had zero commits beyond that base; research HEAD had 11.
The base timestamp is 2026-10-22T22:43:33Z and reviewed HEAD timestamp is 2026-10-23T03:17:56Z (4h34m23s later).
No measured baseline changed.
Combined review scope is the seven maintained production/test/changeset files, not the research data.
388 changed lines were reviewed, plus the surrounding implementation and caller contracts.
No API report files changed.
Review disposition: **0 CRITICAL, 0 HIGH, 0 MEDIUM — No high-confidence issues found in the current diff.**
Earlier test/performance findings were fixed before this review; branch-specific review and CI checks are recorded in the final handoff.

## Landing preparation complete

See [the committed PR-management handoff](pr-handoff.md) for exact local branch heads, stack boundaries, suggested PR bodies and independently executed full test/CI results.
Both branches passed full package tests.
The CI wrapper's empty task graph and local-base changeset limitation were detected and checked with actual package commands.
Automatic ESLint workers exhausted memory; full single-process lint passed.
No production changes were needed after the combined review.
The prepared stack is source-identical to the measured accepted implementation.
No branches were pushed and no PRs were created.
