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
