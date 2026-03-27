# Undo

High-level description of the undo system (largely theoretical). For the currently implemented system, see [V1 Undo](./v1-undo.md).

## Undo Model and Semantics

The right undo semantics depend on the workflows applications need to support. Work is ongoing, but two key points have emerged:

1. Undo is likely the only/primary way end users access document history — it's very important to get right.
2. Most applications will adopt simple, user-friendly workflows that fit their existing UI, even if powerful semantics are available.

See [inverse changes brain-dump](../wip/inverse-changes.md#undo-semantics) for earlier thinking on undo semantics.

## Abstract vs. Concrete Undo Messages

Conceptually, an undo starts as an abstract intention ("undo revision _\<tag\>_") and must be converted to a concrete description of the document change (e.g., "remove node at path X") that can be processed as a delta.

The key design question: **when should concretization happen** — pre-broadcast (on the issuing client) or post-broadcast (on each receiving peer)?

| Consideration | Pre-broadcast | Post-broadcast |
|---|---|---|
| Historical data (original change, [detached trees](./detached-trees.md), [interim changes](#interim-change)) | Burden on issuing client | Burden on all peers; data must be in summaries |
| Sequencing info for undone edit | May be unavailable (not yet sequenced) | Available |
| Sequencing info for undo edit | Unavailable (not yet sequenced) | Available |
| Compute cost | Issuing client only | All peers |

Larger summaries and messages increase network/server load and slow document loading. Because this choice has significant performance impact, we give applications agency through the concept of an **undo window**.

## The Undo Window

The undo window defines how far back peers retain information about past edits and their detached trees. A longer window means more edits use post-broadcast undo; a shorter window means more use pre-broadcast.

Data is retained in two ways:

- When a peer joins, the summary includes the relevant historical information.\*
- When a peer receives a new edit, it computes and stores the corresponding detached trees.

\* Historical undo data could be loaded separately to reduce startup time.

When edits fall outside the window, their data (including detached trees) can be deleted from memory. A client issuing an undo therefore proceeds differently depending on whether the target edit is within or outside the window.

## Undo Edits Within The Undo Window

This includes cases where the issuer of the undo is also the author of the change being undone but hasn't yet received it back from the sequencing service (e.g., undoing quickly or after a period offline).

For changes within the window, the undo is sent as an edit carrying the `RevisionTag` of the change to undo — not a changeset. Receiving peers construct and apply the changeset themselves.

If the edit falls out of the window between when the undo was sent and when it was sequenced, the undo fails (all peers ignore it). The issuer can then either give up or retry as an out-of-window undo.

## Undo Edits Outside The Undo Window

In low-frequency (non-live) collaboration, the edit to be undone will commonly lie outside the window. All approaches below rely on the undo issuer including the relevant historical data in the undo message (peers won't have it).

### Historical Data on the Issuing Client

Users typically want to undo their own edits or edits that affected their work. The issuing client can retain historical data beyond the window (with a limit to avoid unbounded memory growth; disk storage can make that limit tolerable).

If the required data is unavailable (pre-join edits, or dropped due to limits), the client could request it from a history server — though this makes the undo asynchronous. Having peers fetch from a history server instead has two downsides:

- All peers' undo application becomes asynchronous.
- The history server must serve all clients, which may be unacceptable in large sessions.

### Undo Messages for Edits Outside The Undo Window

#### Abstract Undo With Historical Data

Same message format as within-window undo, but with additional historical data attached. The risk is prohibitively large payloads — the undo may require data from all edits since the undone one, not just the one itself. The issuing client can mitigate this by only including the data actually needed.

#### Undo as a Regular Changeset

The issuing client computes the net change to the tip state and sends it as a normal changeset, rebased over concurrent edits like any other. This precludes undo-specific rebase logic.

**This is the currently implemented approach.** (See [V1 Undo](./v1-undo.md))

#### Undo as a Special Changeset

Similar to the regular changeset approach, but the undo changeset receives special rebasing treatment to impart desired undo semantics — for example, using [postbase](#postbase) instead of rebase over concurrent edits.

## Partial Undo

Longer term, we may support partial undo — reverting changes only within a specific region of a document. A user could undo their changes to a particular area even if the same edit touched other areas. This would be achieved by including a region characterization in the undo message, possibly combining input and output context regions.

## Related

-   [V1 Undo](./v1-undo.md)

## Glossary

### Interim Change

A change that is sequenced after the change to be undone, but before the undo change.
Interim changes may depend on the change being undone.

### Postbase

A variant of rebase.
Postbasing change `a` over change `b`,
where `a` applies to state `s` and produces state `sa`
and `b` applies to state `s` and produces state `sb`,
produces a change `a'` that applies to state `sb` and produces the state `sab`,
which is the same state one would get by applying `rebase(b, a)` to `sa`.
