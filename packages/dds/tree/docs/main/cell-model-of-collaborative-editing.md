# The Cell Model of Collaborative Editing

A conceptual model providing a foundation for understanding SharedTree editing semantics. The model is not tied to SharedTree's data model — it abstracts what it means to edit a document.

The model concerns a single field. More complex structures (notably, trees) are built by allowing field contents to represent more fields.

## Summary

Building anchors on top of nodes that move and pop in/out of existence is complex. It's simpler to start with tree locations (cells) that never move or disappear, then layer moveable/removable nodes on top.

The mismatch between an insert/remove model and user-facing semantics (particularly for fixed-sized fields) forced the internal model to be overly general and required higher layers to compensate with constraints and hierarchical edits. The cell model resolves this.

## Motivation

Consider a collaborative session with three concurrent participants over `[A, B, C, D]`, sequenced as follows:

1. User 1: remove B, C (local state: [A, D])

2. User 2: insert Y after C (local state: [A, B, C, Y, D])

3. User 3: insert X after B (local state: [A, B, X, C, D])

4. User 1: undo the removal of B, C (local state: [A, B, C, D])

The expected outcome is `[A, B, X, C, Y, D]`.

Traditional insert/remove models may fail in two ways:

-   X and Y may be ordered incorrectly — inserting relative to removed content loses precise position information.
-   X and Y may end up outside B and C — the undo of B/C's removal is modeled as an insertion, losing their original positions. The same failure occurs when a move-out is undone and the undo is modeled as a reverse move.

These failures can be fixed by adding tombstones, a "revive" operation, and a "return" operation. However, those additions:

-   Increase core model complexity.
-   Produce a non-orthogonal operation set (insert, revive, and return overlap; "replace" would need to be added separately).
-   Don't simplify optional fields (clearing still requires a slice-remove; overwriting requires slice-remove plus an insert with a meaningless position).

The cell model refactors both the traditional primitives and these additions to avoid all of the above drawbacks.

## The Model

### Fields

A field is a (possibly empty) sequence of cells. The sequence provides a total ordering, which is the foundation for correct content ordering.

### Cells

A cell is a unit of storage: indivisible, either empty or full. Its contents may be arbitrarily large or small (subject to data model constraints).

> Cells are primarily a conceptual artifact — they need not be explicitly reified at runtime. Applications are not expected to be aware of them.

A cell may carry forwarding annotations pointing to destination cells; this represents move information. Cells also act as stable markers for edit positions (e.g., "before/after cell foo").

### Operations

The model admits the following operations:

> WIP: An alternative set of operations based on hiding cells instead of clearing them is being considered.
> The general structure of the model is unaffected.

-   <u>Allocate</u> a new cell at a specific location in the sequence

-   <u>Fill</u> a cell with content (overwriting existing content if any)

-   <u>Clear</u> content from a cell, leaving it empty

-   <u>Add a forwarding annotation</u> to a cell

-   <u>Remove a forwarding annotation</u> from a cell

Note that cells cannot be deallocated (or moved).
This reflects the fact that a client may perform an edit relative to some content's location at a point in time, even if that content has since been removed or moved: the client is performing the edit relative to the cell which contained that content.

## Building on the Model

The model describes low-level edits a client may perform on a field in a collaborative environment, implying some of their merge semantics.

Two lists follow: one for fixed-cell-count fields, one for dynamic-cell-count fields. "Fixed" and "dynamic" refer only to the number of cells, not elements. For example, an optional field (zero or one element) is a fixed-sized field with exactly one cell — that cell exists even when the field is empty. The distinction is a practical separation matching industry-standard editing patterns, not a fundamental property of the cell model.

### Edits on Dynamically-Sized Fields

Dynamically-sized fields behave like lists: elements can be added or removed freely, causing content to grow and shrink (while cell count only grows). They typically start with no cells.

The low-level edits that such fields might support can be decomposed as follows:

-   Insert: allocate and fill a cell

-   Remove: clear a cell

-   Revive: fill a (cleared) cell with the contents it contained before

-   Replace: fill a (filled) cell

-   Move content from A to B:

    -   A: clear a (filled) cell and add a forwarding annotation to it

    -   B: allocate and fill a cell with the content being moved

-   Return content to A from B:

    -   A: remove the forwarding annotation from a cell and fill it with the returned content

    -   B: clear the (filled) cell

### Edits on Fixed-Sized Fields

Fixed-sized fields model required (unary) fields, optional fields, fixed-sized arrays, and tuples. They are populated with cells (and possibly content) at creation time.

The low-level edits that such fields might support can be decomposed as follows:

-   Upsert: fill a (potentially empty) cell

-   Populate if empty: fill a cell if the cell is empty

-   Load-linked store: fill a cell if the cell has not been concurrently filled or cleared

-   Clear: clear a cell

-   Move content from A to B:

    -   A: clear a (filled) cell

    -   B: fill a cell with the content being moved

-   Return content to A from B:

    -   A: fill a cell with the content being moved

    -   B: clear the (filled) cell

The Move/Return operations assume source and destination are in the same kind of trait; this is not a requirement, though some combinations may be questionable.

No further cells are allocated after the field is created.

## Implications For SharedTree

### Data Model

The SharedTree data model differentiates fixed-sized and dynamically-sized fields. Schema authors implicitly choose between them, and that choice is now reflected at the data model level.

### Editing API

Fixed-sized fields require new editing operations. The API doesn't have to use the model's primitives directly — it offers two higher-level operation sets, one per field kind, enabling a more expressive and familiar API for each.

### Merge Semantics

Merge resolution logic is specialized per field kind, which makes it extensible: new field kinds can introduce new merge logic. This means suboptimal early merge semantics can be improved later by adding new field kinds, without breaking existing ones.

### Changeset Format

The changeset format need not use the model's primitive operations directly (e.g., "allocate" and "fill" for insert would be bloated). It may, however, be structured to translate to those primitives. It also needs to represent the new edits for fixed-sized fields.

### Change Application Logic

The application logic may optionally be factored to resemble the model's primitives as an implementation detail.

### Cost of Tombstone Data

Fixed-sized fields provide adequate merge semantics without an unbounded tombstone set. Dynamic fields typically have more data, but removed content tends to remain proportional to tip-state content — so tombstone overhead stays manageable there too.
