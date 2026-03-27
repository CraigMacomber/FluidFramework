# Cell Ordering

A reference document for the cell ordering scheme used by arrays/sequence fields. Assumes familiarity with the topic and with rebasing.

## Cells

The idea of cells is introduced in [cell-model-of-collaborative-editing.md](cell-model-of-collaborative-editing.md). In addition to integer indices for occupied node positions, we need a way to refer to empty locations — cells. Each cell gets a unique ID used in commits that reference it.

Referring to empty cells lets commits convey position information relative to those cells. If commit `A` inserts before empty cell `c` and concurrent commit `X` inserts after `c`, then `A`'s content precedes `X`'s content regardless of sequencing order. Without the ability to reference `c`, this relative ordering could not be guaranteed.

## Cell References In Commits

Two key properties:

### All or Nothing

When commit `C` references a cell introduced by commit `A` (where `A` is `C` itself or an ancestor), `C` references all cells introduced by `A`.

### Ordering of References

For any pair of references `ra` and `rb` in commit `C`, `C` contains enough information to totally order `ra` relative to `rb`.

Together, these properties mean we never need to tie-break pairs of cells introduced by the same commit.


## Cell IDs and Commits

Each cell ID includes the ID of the commit that introduced it, making it easy to check which commit introduced a given cell.

A commit introduces a new cell ID in two cases:

1. **Insert:** Introduces a cell ID for the cell receiving the new node (empty in input context, populated in output context).
2. **Move or remove:** Introduces a cell ID for the cell that held the node (populated in input, empty in output).

The qualifier "typically" applies because rollback commits can reuse past cell IDs for the same cell (see [Rollback Commits](#rollback-commits)).

A single cell ID refers to exactly one cell, but a cell may be referred to by multiple IDs over time. This matters for cell ordering.

Commits can also reference cells using IDs introduced by prior commits:

1. **Inverse commits** (rollback or revert) reference all cells from the inverted commit using the same IDs. E.g., if `A` removes a node and introduces cell ID `Id1`, the inverse of `A` restores the node using `Id1`.

2. **Rebased commits:** Rebasing `A` over `X` produces `A'` that references all cells referenced by either `A` or `X`. E.g., if `A` inserts next to node `n` and `X` removes `n` (introducing `Id1`), then `A'` uses `Id1` to describe the cell that used to contain `n`.

## The Cell Reference Accumulation Invariant

For any commit `C`:
- `C` refers to all cells introduced by `C`.
- `C` refers to all cells introduced by some contiguous prefix of `C`'s ancestors.

In other words, on a single branch: if `C` references a cell introduced by `A`, it also references every cell introduced by `A`, by `C`, and by every commit between them.

Rollback commits are excluded from this invariant — they are not considered part of any branch. See [Rollback Commits](#rollback-commits).

In commit graph diagrams, this contiguous subsequence is shown as a segment extending from `C` backward under all commits that introduced cells `C` refers to:

![C refers to cells in C](../.attachments/cell-ordering/C-knows-of-C.png)<br />
_`C` refers to all cells introduced by `C` and all its ancestors up to and excluding `B`._


![C refers to cells in A, B and C](../.attachments/cell-ordering/C-knows-of-ABC.png)<br />
_`C` refers to all cells introduced by `C` and all its ancestors up to and including `A`._

In this last example, the cell reference accumulation invariant means that since `C` refers to cells introduced by `A`,
it must also refer to cells introduced by `B`.

## Cell Reference Accumulation In Practice

For any commit `C`, there exists an `OldestRef(C)` — the oldest commit introducing a cell that `C` references. `C` contains references to all cells introduced by commits from `OldestRef(C)` through `C` inclusive.

It's tempting to think `OldestRef(C)` is the earliest commit `C` rebased over (or the commit `C` inverts, or `C` itself). This intuition is wrong. `OldestRef(C)` can be earlier, due to:

1. Inverting `C` includes references to all cells `C` referred to, not just those `C` introduced.
2. Rebasing `C` over `X` includes in `C'` all cells that `X` references, not just those `X` introduced.
3. Rebasing `B` over a rollback `A⁻¹` adds references to cells referenced by `A`; these are not dropped when later rebasing over `A'`.

This can result in more cell references than strictly necessary. We may reduce unnecessary references in [the future](#future-work).

## Tie-Breaking: Cell Ordering From Commit Ordering

Commit contents sometimes specify only a partial order on cells. "Tie-breaking" is the process by which the rebasing system picks a consistent total ordering across peers, using the relative sequencing order of commits. This is needed in two cases:

1. Concurrent commits introduce cells in the same gap.<br />
   ![X and A are concurrent](../.attachments/cell-ordering/XvsA.png)<br />
   _`X` and `A` are concurrent; the relative order of cells they introduce in the same gap is unspecified. Colors indicate which commit references which cells._

2. A commit `C` introduces cells in a gap where an ancestor `A` also introduced cells that are empty in `C`'s input context, and `C` does not reference `A`'s cells.<br />
   ![A is an ancestor of C](../.attachments/cell-ordering/C-knows-of-C.png)<br />
   _`C` doesn't reference cells introduced by ancestor `A`, so relative ordering of their cells in the same gap is unspecified._

In both cases, cells introduced by the later commit are ordered left of cells introduced by the earlier commit.

## Compose

Cell-ordering scenarios for compose operations.

When composing `A ○ B`:
- `A` is sequenced before `B`; they are not concurrent; no commits lie between them.
- Commits before `A` may be referenced by `A` and/or `B`.

Commit graph representation:<br />
![P1->P2->A->B](../.attachments/cell-ordering/compose-a-b.png)<br />
`P1` and `P2` are prior commits (not being composed) that `A` and/or `B` may reference. Two prior commits is sufficient to cover all relevant cases.

For each pair of cells (`ca`, `cb`) referenced by `A` and `B` respectively, we need to determine their relative ordering. The space of possible comparisons:
```
                        +---------------------+
                        |   cb introduced by  |
                        +----+----+-----+-----+
                        | P1 | P2 |  A  |  B  |
+------------------+----+----+----+-----+-----+
|                  | P1 |    |    |     |     |
|                  +----+----+----+-----+-----+
| ca introduced by | P2 |    |    |     |     |
|                  +----+----+----+-----+-----+
|                  | A  |    |    |     |     |
+------------------+----+----+----+-----+-----+
```

This document considers what information and techniques are available to compose implementations, not specific implementations. Reminder: given a commit `C` and a cell reference `c`, the cell ID can be used to check whether `c` was introduced by `C`.

### Pairs of Cells Introduced by The Same Commit

If both `ca` and `cb` are introduced by the same commit, then `A` or `B` must contain ordered references to both (due to the all-or-nothing property). The relative order can be looked up in either commit. Cases handled:
```
                        +---------------------+
                        |   cb introduced by  |
                        +----+----+-----+-----+
                        | P1 | P2 |  A  |  B  |
+------------------+----+----+----+-----+-----+
|                  | P1 | ## |    |     |     |
|                  +----+----+----+-----+-----+
| ca introduced by | P2 |    | ## |     |     |
|                  +----+----+----+-----+-----+
|                  | A  |    |    | ### |     |
+------------------+----+----+----+-----+-----+
```

### Pairs of Cells Introduced by Different Input Commits

When `ca` is introduced by `A` and `cb` by `B`, the compose function has direct access to both commits and knows `A` comes before `B`. Cases handled:
```
                        +---------------------+
                        |   cb introduced by  |
                        +----+----+-----+-----+
                        | P1 | P2 |  A  |  B  |
+------------------+----+----+----+-----+-----+
|                  | P1 |    |    |     |     |
|                  +----+----+----+-----+-----+
| ca introduced by | P2 |    |    |     |     |
|                  +----+----+----+-----+-----+
|                  | A  |    |    |     | ### |
+------------------+----+----+----+-----+-----+
```

### Pairs of Cells With One Cell Introduced by Either Input Commit

When only one of `ca`/`cb` is introduced by `A` or `B`, any other commit that introduced cells referenced by `A` or `B` must be an ancestor — making those cells older. Cases handled:
```
                        +---------------------+
                        |   cb introduced by  |
                        +----+----+-----+-----+
                        | P1 | P2 |  A  |  B  |
+------------------+----+----+----+-----+-----+
|                  | P1 |    |    | ### | ### |
|                  +----+----+----+-----+-----+
| ca introduced by | P2 |    |    | ### | ### |
|                  +----+----+----+-----+-----+
|                  | A  | ## | ## |     |     |
+------------------+----+----+----+-----+-----+
```

### Pairs of Cells Both Referred to by Either Commit

If `A` refers to both `ca` and `cb`, their relative order can be looked up in `A`. Same for `B`.

This requires considering where the sets of commits whose cells `A` and `B` reference intersect.

Example:<br />
![](../.attachments/cell-ordering/compose-a-ref-p1-b-ref-p2.png)<br />
_`A` references cells from `P1`, `P2`, `A`. `B` references cells from `P2`, `A`, `B`._

Since both `A` and `B` reference cells from `P2` and `A`, whenever `cb` references a cell introduced by `P2` or `A`, the relative order of `ca` and `cb` can be found in `A`. Cases handled:
```
                        +----------------+
                        |cb introduced by|
                        +----+-----+-----+
                        | P2 |  A  |  B  |
+------------------+----+----+-----+-----+
|                  | P1 | ## | ### |     |
|                  +----+----+-----+-----+
| ca introduced by | P2 | ## | ### |     |
|                  +----+----+-----+-----+
|                  | A  | ## | ### |     |
+------------------+----+----+-----+-----+
```

Similarly, whenever `ca` references a cell from `P2` or `A`, the relative order of `ca` and `cb` can be found in `B`. Cases handled:
```
                        +----------------+
                        |cb introduced by|
                        +----+-----+-----+
                        | P2 |  A  |  B  |
+------------------+----+----+-----+-----+
|                  | P1 |    |     |     |
|                  +----+----+-----+-----+
| ca introduced by | P2 | ## | ### | ### |
|                  +----+----+-----+-----+
|                  | A  | ## | ### | ### |
+------------------+----+----+-----+-----+
```

This approach applies whenever referencing cells from one commit implies referencing cells from others (due to the accumulation invariant). Here, referencing any cell from `P2` implies references to all cells from `P2` and `P1`; referencing any cell from `P1` implies references to all cells from `P1` and `A`. Cases handled in this scenario:
```
                        +---------------------+
                        |   cb introduced by  |
                        +----+----+-----+-----+
                        | P1 | P2 |  A  |  B  |
+------------------+----+----+----+-----+-----+
|                  | P1 | ## | ## | ### |     |
|                  +----+----+----+-----+-----+
| ca introduced by | P2 | ## | ## | ### |     |
|                  +----+----+----+-----+-----+
|                  | A  | ## | ## | ### |     |
+------------------+----+----+----+-----+-----+
```

No scenario detection is needed — simply check whether `A` contains a reference to `cb` or `B` contains a reference to `ca`, and use whichever applies.

### Pairs of Cells Where `ca` Is Unknown to `B`

When `B` has no reference to `ca`, `ca` was introduced by a commit older than whichever introduced `cb`.

All possible scenarios where `A` references a cell unknown to `B`:<br />
![](../.attachments/cell-ordering/compose-b-no-ref-to-ca.png)

In all scenarios, cells known to `A` but unknown to `B` are introduced by commits with a blue underline only, while `cb`'s commit always has a red underline. The blue-only commits always precede the red ones in sequencing order.

### Pairs of Cells Where `cb` Is Unknown to `A` But Not Introduced by `B`

When `A` has no reference to `cb` and `cb` was not introduced by `B`, then `cb` was introduced by `P1` or `P2` — earlier than `ca`. `cb`'s cell is older than `ca`'s.

### Putting it All Together

These approaches collectively cover every cell ordering scenario in compositions. Compose implementations need no extra metadata to correctly order cells.\*

\*See [Rollback Commits](#rollback-commits) for how they fit in.

## Rebase

Cell-ordering scenarios for rebase operations.

When rebasing `B ↷ X`: `X` and `B` are concurrent; `X` is sequenced before `B`.

Simple case (single-commit branch, same ancestry and input context):<br />
![](../.attachments/cell-ordering/rebase-b-over-x.png)<br />
Goal: produce `B'`:<br />
![](../.attachments/cell-ordering/rebase-to-bprime.png)<br />

General case (multiple commits on the rebased branch):<br />
![](../.attachments/cell-ordering/rebase-ab-over-x.png)<br />
Goal: produce rebased versions in order:<br />
![](../.attachments/cell-ordering/rebase-to-abprime.png)<br />

`B` cannot be directly rebased over `X` because they have different input context. In the general case, `B` is first rebased over the inverses of all commits between `B` and its lowest common ancestor with `X` (here `P2`), producing `B2` with an input context *compatible* with `X`'s:<br />
![](../.attachments/cell-ordering/rebase-b2.png)

`B2` is what gets passed to the rebase function for `B ↷ X`:<br />
![](../.attachments/cell-ordering/rebase-b2-over-x.png)

"Compatible" means the differences are only what rebase is designed to handle — specifically that `B2` may reference cells introduced by ancestors it doesn't share with `X` (like `A`).

The rest of this section uses `B` for all variants and `B2` when specific to that variant.

For each pair of cells (`cb`, `cx`) referenced by `B2` and `X` respectively, we need to determine their relative ordering. The space of possible comparisons:
```
                        +---------------------+
                        |  cb introduced by   |
                        +----+----+-----+-----+
                        | P1 | P2 |  A  |  B  |
+------------------+----+----+----+-----+-----+
|                  | P1 |    |    |     |     |
|                  +----+----+----+-----+-----+
| cx introduced by | P2 |    |    |     |     |
|                  +----+----+----+-----+-----+
|                  | X  |    |    |     |     |
+------------------+----+----+----+-----+-----+
```

We only consider one intermediate commit (`A`) instead of multiple (e.g., `A1`, `A2`). This is sufficient: the cell ordering cases for intermediate commits are identical — each may need ordering relative to `P1`, `P2`, or `X`. Same techniques apply to all of them.

Same analysis approach as compose; explanations are omitted where identical.

### Pairs of Cells Introduced by The Same Commit

As for compose, this takes care of the following cases:
```
                        +---------------------+
                        |  cb introduced by   |
                        +----+----+-----+-----+
                        | P1 | P2 |  A  |  B  |
+------------------+----+----+----+-----+-----+
|                  | P1 | ## |    |     |     |
|                  +----+----+----+-----+-----+
| cx introduced by | P2 |    | ## |     |     |
|                  +----+----+----+-----+-----+
|                  | X  |    |    |     |     |
+------------------+----+----+----+-----+-----+
```

### Pairs of Cells Introduced by Different Input Commits

As for compose, this takes care of the following cases:
```
                        +---------------------+
                        |  cb introduced by   |
                        +----+----+-----+-----+
                        | P1 | P2 |  A  |  B  |
+------------------+----+----+----+-----+-----+
|                  | P1 |    |    |     |     |
|                  +----+----+----+-----+-----+
| cx introduced by | P2 |    |    |     |     |
|                  +----+----+----+-----+-----+
|                  | X  |    |    |     | ### |
+------------------+----+----+----+-----+-----+
```

### Pairs of Cells With One Cell Introduced by `B`

If `cb` is introduced by `B`, then `cx` is older (any commit that could have introduced `cx` predates `B`). Cases handled:
```
                        +---------------------+
                        |  cb introduced by   |
                        +----+----+-----+-----+
                        | P1 | P2 |  A  |  B  |
+------------------+----+----+----+-----+-----+
|                  | P1 |    |    |     | ### |
|                  +----+----+----+-----+-----+
| cx introduced by | P2 |    |    |     | ### |
|                  +----+----+----+-----+-----+
|                  | X  |    |    |     | ### |
+------------------+----+----+----+-----+-----+
```

We cannot handle the case where `cx` is introduced by `X` and `cb` is not introduced by `B`, because `cb` could be from `P1`, `P2`, or `A`, which have different ordering implications relative to `X`.

### Pairs of Cells Both Referred to by Either Commit

Same as compose, but only applies to cells introduced by `P1` or `P2`:
```
                        +---------------------+
                        |   cb introduced by  |
                        +----+----+-----+-----+
                        | P1 | P2 |  A  |  B  |
+------------------+----+----+----+-----+-----+
|                  | P1 | ## | ## |     |     |
|                  +----+----+----+-----+-----+
| cx introduced by | P2 | ## | ## |     |     |
|                  +----+----+----+-----+-----+
|                  | X  |    |    |     |     |
+------------------+----+----+----+-----+-----+
```

### Pairs of Cell Where `cx` Is Unknown to `B`

This works the same as in compose.

### Pairs of Cells Where `cb` Is Unknown to `X` But Not Introduced by `B`

Not usable for ordering: `cb` could be from `A`, `P1`, or `P2`, which have different ordering implications relative to `cx`.

### Putting it All Together

These approaches collectively address the following cases:
```
                        +---------------------+
                        |   cb introduced by  |
                        +----+----+-----+-----+
                        | P1 | P2 |  A  |  B  |
+------------------+----+----+----+-----+-----+
|                  | P1 | ## | ## |     | ### |
|                  +----+----+----+-----+-----+
| cx introduced by | P2 | ## | ## |     | ### |
|                  +----+----+----+-----+-----+
|                  | X  |    |    |     | ### |
+------------------+----+----+----+-----+-----+
```

The three uncovered cases where `cb` is introduced by `A` appear straightforward (`A` is newer than `P1`, `P2`, and `X`, so `cx` would be older), but the rebase implementation has no way to determine whether `cb` was introduced by `A` vs. `P1`/`P2`.

### Providing Metadata

To handle the remaining cases, rebase needs to detect references to cells introduced by commits between `B` and the lowest common ancestor of `X` and `B` — i.e., it needs to know whether a cell was introduced by a commit on the branch being rebased.

### A Different Way?

The need for metadata stems from our branch rebasing scheme. An alternative: compose all commits on the branch into a single commit and rebase that as a unit. This would give the rebased commit and the commit being rebased over truly the same ancestry and input context, eliminating the need for extra metadata.

## Rollback Commits

Rollback commits are used by the high-level rebasing algorithm to leverage low-level rebase operations for branch rebases and computing net changes after local edits are rebased.

Rollback commits are not real commits — they don't represent user edits, don't define valid document revisions, and are not rebasable.

Rollback commits do not abide by the cell reference accumulation invariant. When rebasing branch `[A, B]` over `X`, the net change requires composing `B⁻¹ ○ A⁻¹ ○ X ○ A' ○ B'`. The rollback commits `B⁻¹` and `A⁻¹` may reference cells introduced by `B'` and `A'` (which come later in composition order). Also, composing `B⁻¹ ○ A⁻¹` may require tie-breaking cells from `A` and `B`, but the commit order passed to compose is reversed from true sequencing order, yielding wrong tie-break behavior. The same issue applies to mixed compositions like `A⁻¹ ○ X`.

### In Compose

Each rollback commit carries metadata identifying which commit it is the rollback of. The compose implementation uses this metadata to infer the true sequencing order of commits, even when the order passed to compose differs.

Compose needing to be aware of rollback commits is a downward leak from the high-level rebasing algorithm.

### In Rebase

Rollback commits don't introduce additional cell-ordering challenges during rebasing. Rollback commits themselves are never rebased. When rebasing over a rollback commit, the rebased commit is always sequenced after the rolled-back commit — consistent with rebase's expectations for relative sequencing order.

### Tidying Up

We could avoid passing rollback commits to compose entirely (removing the need for special-case logic).

For rebasing commit `C` from branch `[A, B, C]` over `X`, we currently do `C ↷ (B⁻¹ ○ A⁻¹ ○ X ○ A' ○ B')`. Alternative: `(C ↷ (A ○ B)⁻¹) ↷ (X ○ A' ○ B')`. An `unbase` operation could implement `C ↷ (A ○ B)⁻¹` as an internal detail, keeping the `(A ○ B)⁻¹` changeset entirely encapsulated.

For tree state updates when rebasing branch `[A, B]` over `X`, we currently apply `Δ(B⁻¹ ○ A⁻¹ ○ X ○ A' ○ B')` as a single delta. Alternative: apply `Δ((A ○ B)⁻¹)` then `Δ(X ○ A' ○ B')` separately — but this generates excessive change notifications to delta visitors even when the net change is small. A better option: implement delta composition and apply the composed delta (the two largely cancel out).

## Commit With Constraint Violations

Commits with constraint violations may introduce cells that downstream commits depend on for ordering.
(See the test "Rebase over a commit that depends on a commit that has become conflicted" for an example.)
We currently handle this by ensuring that rebasing over a commit with constraint violations does add the necessary references.

[Longer term](#future-work), we would rather change the system so that such rebases are not needed.

## Future Work

Cell ordering is determined by two things:
- The partial order imposed by edit operations on nodes and cells.
- Tie-breaking behavior.

Commits must convey the partial order (at least where it conflicts with tie-breaking). Tie-breaking requires commit ordering information for the relevant branch.

The current scheme tries to minimize metadata passed to rebase and compose. It does this by relying on the implicit commit ordering conveyed by the call and by adding cell references during rebases even when not needed for the partial order. This is visible in the "Rebase over a commit that depends on a commit that has become conflicted" test: a commit rebasing over a conflicted commit must acquire new cell references solely to make later rebase operations work without explicit commit ordering knowledge.

Problems with the current scheme:
1. Minimizes metadata use but never eliminates the need for it.
2. Relies on implicit commit ordering from call order, which doesn't always match true sequencing order.
3. Storing extra cell references to compensate for missing ordering information is inefficient and hard to reason about. It also requires rebasing over conflicted commits, which is counterintuitive (conflicted commits make no document changes).

The scheme is built on a flawed assumption: that commit arguments to rebase/compose carry all needed information, or that it can be inferred (e.g., `A ○ B` implies `A` was sequenced before `B`). The workarounds this requires are convoluted.

**Desired direction:** Make commit sequencing metadata fully available to rebase and compose. This allows cell references to be used only where genuinely needed to capture partial ordering of empty cells. It also handles cases where true commit ordering differs from implicit call order, reducing the leakage from high-level to low-level rebase logic.

Under this model, cell introduction is purely a declaration that a cell exists, has always existed, and always will — not a document change. It should not need to be rebased over, and it would be incorrect for rebase logic to treat it as such.
