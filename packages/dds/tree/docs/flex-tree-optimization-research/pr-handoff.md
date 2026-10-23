# FlexTree optimization PR-management handoff

**This document is committed on `flexOpt`, but it describes PRs from the two other branches below.**
**Do not open a production PR from `flexOpt`, merge it into main, or transplant its research commits.**
No branches were pushed and no PRs were created during this work.

The experimental execution and local preparation are complete.
A, revised B and bounded C are accepted.
D was reverted after reproducible primitive-access regressions.
E is an explicitly inconclusive future research direction, not a prerequisite for this series.
The [plan](plan.md), [experiment record](experiments.md) and [results](results) are the durable evidence.

## Prepared local branches

| Head branch | Intended GitHub base | Prepared head SHA | Local base / prerequisite | Validation |
| --- | --- | --- | --- | --- |
| `flexOpt-navigation-benchmarks` | `microsoft/FluidFramework:main` | `44240043a8f8866059ffe27beb4f8c4bc4ffba34` | `8defa178a083468b6160508f35fb67026329ec34`; none | Quick review approved; independent compile, policy, Biome, ESLint, docs and full tests passed |
| `flexOpt-anchor-navigation` | `microsoft/FluidFramework:main`, **after the benchmark PR lands and this branch is updated** | `a91574d29cc3c7b0d798e47e6fc5acd28ec2101f` | Local stack boundary `44240043a8f8866059ffe27beb4f8c4bc4ffba34`; benchmark PR is the prerequisite | Quick review approved against the local stack boundary; independent compile, policy, Biome, ESLint, docs, full tests and focused production tests passed |

The second branch contains exactly one optimization commit above the benchmark branch.
The benchmark branch contains exactly one commit above the measured upstream base.
This stack keeps maintained performance coverage with the production change without shipping any research scripts or data.
There is no technical production dependency on the benchmark code, but keep the landing order above so coverage lands first.
The two diffs can be reviewed in parallel; the prepared landing sequence is not parallel.

Research checkpoint before this handoff: `79ad1eec66bf7cfede8bea8ccaf3fdb325052287`.
Measured final production revision: `cf3d95a5c3746508873babc45aaac812e79a58dc`.
The assembled landing branches reproduce all maintained source, tests and the changeset from that research state.

## Baseline, overlap and scope

The comparison-base workflow selected canonical `microsoft/FluidFramework:main` at `8defa178a083468b6160508f35fb67026329ec34`.
The target was fetched into `refs/comparison/target`; it had zero commits beyond this comparison base.
No upstream changes were silently incorporated into measurements.

At the final public-API recheck, [microsoft/FluidFramework#28524](https://github.com/microsoft/FluidFramework/pull/28524) remained open and unmerged:
head `c48bbec036377c9cd21ed09fd18618ddf1c8aba3`, base `8defa178a083468b6160508f35fb67026329ec34`.
That PR's sequence-length caching is neither included nor required.
It can proceed independently, but both changes touch FlexTree fields, so check conflicts and rerun tests and comparisons if it lands first.
Use the same length-cache implementation on both sides of any new timing comparison.

Accepted production changes:

- Derive editing paths from existing anchors instead of materializing parent wrappers.
- Reuse the existing field cache before navigation in `getBoxed`.
- Reuse that same cache in `tryGetField` only after checking the field's current length.
- Reuse cached parent fields and wrappers, with the existing cursor path as fallback.
- Preserve observer calls, disposal/context ownership, and the distinction between current-cursor reads and recovery after a forest error.
- Add lifecycle regressions and a user-facing changeset.

Not included: formatting algorithms, length caching, chunk metadata, new subscriptions, additional retained ownership references, child-cache pre-navigation, cursor-interface changes, or ancestor-recovery copying.
There are no public API or stored-format changes.
No generated API report files were edited.

## Validation commands and results

Commands below were run independently on each actual prepared branch, not merely on the combined exploration branch.
Package commands run from `packages/dds/tree`; commands marked “root” run from the repository root.

| Command | Benchmark branch | Optimization branch |
| --- | --- | --- |
| Root: `bash .claude/skills/ci-readiness-check/ci-readiness-check.sh refs/comparison/target` | Passed script; caveats below | Not the branch-specific invocation |
| Root: `bash .claude/skills/ci-readiness-check/ci-readiness-check.sh flexOpt-navigation-benchmarks` | Not applicable | Passed script; caveats below |
| Root: `pnpm policy-check --path packages/dds/tree` | Passed, 1,495 files processed | Passed, 1,495 files processed |
| `pnpm run check:biome` | Passed, 744 files, no fixes | Passed, 744 files, no fixes |
| `pnpm exec fluid-build . --task compile` | Passed; ESM, CommonJS, test compilation | Passed; ESM, CommonJS, test compilation |
| `pnpm exec fluid-build . -t eslint:fix` | Failed: automatic worker mode exhausted memory | Not repeated after diagnosis |
| `pnpm exec eslint --quiet src --concurrency off --fix --fix-type problem,suggestion,layout` | Passed; no source changes | Passed; no source changes |
| `pnpm run build:docs` | Passed | Passed |
| `pnpm run test:mocha` | Passed: 5 production smoke tests; 16,726 normal tests, 474 pending | Passed: 5 production smoke tests; 16,733 normal tests, 474 pending |
| Root: `pnpm flub check changeset --branch main` | Not required for test-only changes | Passed; found `.changeset/tree-anchor-navigation.md` |
| Root: `git diff --check` | Passed | Passed |

The optimization branch also independently passed:

```bash
pnpm exec mocha --emulateProduction --grep '^(LazyField|LazyNode|FlexTree navigation benchmarks|flex-tree utilities|AnchorSet|ChunkedForest|ObjectForest|Forest|ArrayNode |treeNodeApi |textDomainFormatted )' --reporter dot
```

Result: **2,820 passing, 9 pending**.
The same expanded selector passed in both modes on the combined accepted source before the branch split.

The maintained benchmark was executed in performance mode on the identical combined production source:

```bash
FLUID_TEST_PERF_MODE=1 pnpm exec mocha --grep '^FlexTree navigation benchmarks ' \
  --timeout 120000 --reporter @fluid-tools/benchmark/dist/mocha/Reporter.js \
  --reporterOptions reportFile=docs/flex-tree-optimization-research/results/maintained-navigation.json
```

Result: **16/16 passed**.
[The report](results/maintained-navigation.json) retains benchmark-library sample counts and margins.
Do not use that research-only report path on a landing branch; choose a temporary output path.

### CI-tool limitations and dispositions

- The selected CI-readiness mode was **Test** for both branches.
- The bundled script's `checks:fix` and `checks` task names resolved to **zero executable tasks** in this checkout.
  Its success is not evidence that those checks ran.
  Actual package Biome and policy commands were therefore run explicitly and passed.
- Its changeset check cannot resolve the dedicated comparison ref or an unpublished local stack base.
  The optimization warning was diagnosed directly: `flub` tried to resolve `refs/remotes/upstream/flexOpt-navigation-benchmarks`.
  The normal `--branch main` command passed, and the exact local diff includes the changeset.
  The benchmark-only branch intentionally has no changeset.
- Automatic parallel ESLint exhausted worker memory.
  The full single-process retry passed on both branches; use it on this host.
- API Extractor reported its existing TypeScript-version/`skipLibCheck` advisories but completed successfully.
- API-report and type-test regeneration were not needed: the changed classes/helpers are internal implementation details, absent from the package API reports; entrypoints and package exports did not change.
- No dependency manifests changed, so dependency installation, synchronization or version changes were unnecessary.
- Remote CI, stress configurations and real-service tests were not run.
  The standard full test command and controlled performance runs were run locally.

Both local branches are ready for the next agent's publication workflow, subject to the prerequisite update and fresh remote/base checks below.
This is not permission to publish from this task.

## Review record

The user selected the repository review skill's **Quick** mode for all three required reviews.
These were direct single-pass reviews, not independent specialist-agent reviews.

| Scope | Exact comparison | Changed lines reviewed | Result |
| --- | --- | ---: | --- |
| Combined maintained code, tests and changeset | `8defa178a083468b6160508f35fb67026329ec34` to research source at `cf3d95a5c3746508873babc45aaac812e79a58dc` | 388 | Approve |
| Actual benchmark branch | `8defa178a083468b6160508f35fb67026329ec34..44240043a8f8866059ffe27beb4f8c4bc4ffba34` | 111 | Approve |
| Actual optimization diff | `44240043a8f8866059ffe27beb4f8c4bc4ffba34..a91574d29cc3c7b0d798e47e6fc5acd28ec2101f` | 277 | Approve |

Each review concluded:
**0 CRITICAL, 0 HIGH, 0 MEDIUM — No high-confidence issues found in the current diff.**
Surrounding cursor, cache, observation and lifecycle contracts were also inspected.
The forest-error regression and performance-control findings were corrected before these reviews.
Research-only files were kept separate from the maintained-code diff.

## Performance claims that may be used

Environment: Node.js 22.22.3, pnpm 11.27.0, Linux x86_64, shared host.
Variants ran serially in fresh processes, ABBA then BAAB, four processes per variant.
General read samples contain 10,000 operations after an equivalent warmup.
The slow formatting case has eight measured samples per process, with two warmup samples and untimed document rebuilding every 16 operations.
No counters ran during timing.

Representative development-mode results at depth 10, 128 items:

| Workload | Baseline mean (process range), microseconds | Final mean (process range), microseconds | Less elapsed time |
| --- | ---: | ---: | ---: |
| ChunkedForest object read | 1.645 (1.573-1.740) | 0.657 (0.619-0.695) | 60.1% |
| ObjectForest object read | 2.981 (2.919-3.111) | 0.848 (0.820-0.865) | 71.6% |
| ChunkedForest parent/key | 9.371 (9.081-9.794) | 1.550 (1.477-1.598) | 83.5% |
| ObjectForest parent/key | 19.389 (19.208-19.748) | 1.960 (1.917-2.018) | 89.9% |

The corresponding production-emulated object-read reductions are 62.2% and 78.7%; parent/key reductions are 83.8% and 89.9%.
Across the representative matrix, full object writes improve approximately 4-22% in development and 3-22% in production emulation.
Do not present the much larger field-path/cache microbenchmark percentages as whole-edit speedups.

Supplemental 10,000-character formatting:

| Forest | Baseline mean (process range), ms | Final mean (process range), ms | Less elapsed time |
| --- | ---: | ---: | ---: |
| ChunkedForest | 3,601.25 (3,557.11-3,642.15) | 2,937.09 (2,921.57-2,955.30) | 18.4% |
| ObjectForest | 2,091.38 (2,058.48-2,129.48) | 1,926.05 (1,867.77-2,055.13) | 7.9% |

Formatting is not the acceptance criterion or the optimization target.
No separate production-emulated formatting confirmation is claimed.

Retained-heap means changed by less than 0.07% across 2,000-object sparse/dense materialization cases, both forests and depths.
Absolute changes range from approximately -2,081 to +3,124 bytes on 2.4-13.6 MB retained heaps, below the predeclared tolerance.
No retained metadata was added.
This is not a claim that total allocation bytes or every possible leak were measured.

Evidence:

- [Final development summary](results/final-summary.json)
- [Final production-emulated summary](results/final-production-summary.json)
- [Formatting summary](results/format-final-summary.json)
- [A ablation](results/final-ablate-a-summary.json), [B ablation](results/final-ablate-b-summary.json), [C ablation](results/final-ablate-c-summary.json)
- [Primitive control that rejected D](results/child-focused-summary.json)
- [Cold-access confirmation](results/cold-gc-summary.json)
- [Map-update confirmation](results/map-control-summary.json)
- [Full interpretation, memory table and reproduction commands](experiments.md)

All summaries retain equal-weight process means and ranges; their process files retain samples and approximate within-process margins.
Research-harness margins are not the adaptive benchmark reporter's margins and do not describe between-process variability.
Do not claim general cold-start gains.
The first ABC prototype and initial memory-loop results are intentionally retained as superseded evidence.

## Suggested PR 1

Title: **`test(tree): cover shallow and deep FlexTree navigation`**

Use the following body, based on the repository template.
It preserves the template's headings and link preamble, with placeholders replaced and the CI-prohibited instructional preamble removed.

```markdown
[How contribute to this repo](https://github.com/microsoft/FluidFramework/blob/main/CONTRIBUTING.md).

[Guidelines for Pull Requests](../docs/content/Contributing/PR-Guidelines.md#guidelines).

## Description

Add maintained non-text FlexTree performance coverage for object reads and edits, parent/key queries, and cached field access.
Exercise shallow and ten-wrapper-deep trees in ChunkedForest and ObjectForest.
Keep elapsed-time thresholds out of correctness tests and dispose each benchmark's view and checkout.

This is a benchmark-only prerequisite for a separately reviewed anchor/navigation optimization.
No production code or research data is included.

## Breaking Changes

None.

## Reviewer Guidance

The review process is outlined in [the pull request guidelines](../docs/content/Contributing/PR-Guidelines.md#guidelines).

Review the workload shape and untimed setup/cleanup.
No changeset is needed for this test-only change.

Validation from `packages/dds/tree`:
- `pnpm run check:biome` — passed.
- `pnpm exec fluid-build . --task compile` — passed.
- `pnpm exec eslint --quiet src --concurrency off --fix --fix-type problem,suggestion,layout` — passed, no changes.
- `pnpm run build:docs` — passed.
- `pnpm run test:mocha` — passed: 5 production smoke tests; 16,726 normal tests, 474 pending.

From the repository root:
- `pnpm policy-check --path packages/dds/tree` — passed.
- `git diff --check` — passed.

The default automatic-worker ESLint invocation exhausted memory on the validation host; the full single-process retry passed.
Remote CI has not yet run.
```

## Suggested PR 2

Title: **`perf(tree): reduce FlexTree anchor and cursor overhead`**

Create this only after updating the local stack onto main containing the benchmark prerequisite.
Replace the prerequisite sentence with the actual fully qualified PR reference once one exists.

```markdown
[How contribute to this repo](https://github.com/microsoft/FluidFramework/blob/main/CONTRIBUTING.md).

[Guidelines for Pull Requests](../docs/content/Contributing/PR-Guidelines.md#guidelines).

## Description

Avoid redundant cursor navigation and temporary anchors during ordinary SharedTree reads and edits.
Derive editing paths from anchors, reuse the existing field cache before navigation where possible, and reuse cached parent fields and wrappers.
Keep cursor fallback when wrappers are absent.

Preserve field emptiness checks, observations, disposed/deleted-node rejection, context-specific cache identity and existing forest-error semantics.
Add lifecycle regressions and a changeset.
The maintained navigation benchmark prerequisite is already on the target branch.

Balanced fresh-process comparisons against `8defa178a083468b6160508f35fb67026329ec34`, using Node.js 22.22.3, showed approximately 60%/72% less time for deep object reads in ChunkedForest/ObjectForest, and 83%/90% less time for deep parent/key queries.
The general-workload improvements were also confirmed in production emulation.
Retained-heap differences were below 0.07% across the measured small-object sparse/dense cases; no per-field or per-chunk metadata was added.
These are workload-specific measurements, not universal application speedups.

This does not implement sequence-length caching, formatting-specific algorithms, early child lookup or ancestor-cursor copying.

## Breaking Changes

None. No public API or stored document format changes.

## Reviewer Guidance

The review process is outlined in [the pull request guidelines](../docs/content/Contributing/PR-Guidelines.md#guidelines).

Focus on cache-hit lifetime/error checks, parent movement, observation semantics and the non-empty check before reusing `tryGetField` results.
The sequence-length cache work in microsoft/FluidFramework#28524 is independent and was not included in these measurements.

Validation from `packages/dds/tree` on the prepared local branch:
- `pnpm run check:biome` — passed.
- `pnpm exec fluid-build . --task compile` — passed.
- `pnpm exec eslint --quiet src --concurrency off --fix --fix-type problem,suggestion,layout` — passed, no changes.
- `pnpm run build:docs` — passed.
- `pnpm run test:mocha` — passed: 5 production smoke tests; 16,733 normal tests, 474 pending.
- `pnpm exec mocha --emulateProduction --grep '^(LazyField|LazyNode|FlexTree navigation benchmarks|flex-tree utilities|AnchorSet|ChunkedForest|ObjectForest|Forest|ArrayNode |treeNodeApi |textDomainFormatted )' --reporter dot` — passed: 2,820 tests, 9 pending.

From the repository root:
- `pnpm policy-check --path packages/dds/tree` — passed.
- `pnpm flub check changeset --branch main` — passed.
- `git diff --check` — passed.

Remote CI has not yet run.
Update this validation evidence after moving the branch onto the merged prerequisite.
```

## Management procedure after publication is authorized

1. Start with a clean checkout and verify the current local heads against the table.
   The recorded SHAs are checkpoints, not immutable instructions after branches change.
2. Fetch canonical upstream and rerun the comparison-base workflow.
   Check the current status and overlapping diff of microsoft/FluidFramework#28524.
3. Publish the benchmark branch through the normal repository PR workflow, targeting main.
   Revalidate if its base changes materially.
4. Wait for that PR to land.
   Do not target an upstream GitHub PR at an unpublished branch in the fork.
5. After the benchmark squash merge, transplant **only the optimization commit**.
   The prepared stack boundary is `44240043a8f8866059ffe27beb4f8c4bc4ffba34`.
   One safe approach preserves the original branch and creates an updated head:

   ```bash
   git fetch upstream main
   git switch -c flexOpt-anchor-navigation-updated upstream/main
   git cherry-pick a91574d29cc3c7b0d798e47e6fc5acd28ec2101f
   ```

   Alternatively, if intentionally updating the existing branch after checking its current history:

   ```bash
   git rebase --onto upstream/main 44240043a8f8866059ffe27beb4f8c4bc4ffba34 flexOpt-anchor-navigation
   ```

   Do not rebase or cherry-pick the entire `flexOpt` history.
   Do not carry the old benchmark commit into the production PR after its squash merge.
6. Rerun compile, full tests, focused production tests, lint, policy and docs after conflict resolution or material base changes.
   If sequence-length caching has landed, compare both variants with that same implementation before reusing performance claims.
7. Review the actual updated diff, update the head/base SHAs and validation evidence in this handoff, and use the normal PR workflow for the optimization branch targeting main.
   No force-push or publication was authorized or performed in this execution.

## Assembly verification and reproducibility

Before returning to `flexOpt`, this command passed on the optimization branch:

```bash
git diff --exit-code flexOpt -- packages/dds/tree/src .changeset/tree-anchor-navigation.md
```

Both landing branches contain no files under this research directory.
The stack's only differences from the research branch are the intentionally omitted research documents, scripts and result data, plus clean commit boundaries.

Ignored compiled measurement snapshots are under `packages/dds/tree/node_modules/.cache/flex-opt`.
They are not required for correctness or for landing.
To recreate them, use a clean worktree, compile research baseline `0be0b786bcd` (production-identical to the selected upstream base), copy `lib` into the baseline cache, return to `flexOpt`, compile and copy `lib` into the final cache, then run the documented matrix commands.
The baseline commit contains the original harness; use the current `flexOpt` harness for comparisons of both snapshots.
Each result records the loaded module hashes.

The final checkout is `flexOpt`.
The local landing branches and this committed handoff are the outputs for the next agent.
