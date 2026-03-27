# Modular Change Family

Merge semantics in SharedTree are mostly field-level — sequence fields have different semantics than optional fields, for example.

`ModularChangeFamily` implements `ChangeFamily` by delegating field-level work to the appropriate `FieldKind`. Each instance is parameterized with a set of `FieldKind` implementations. Its purpose:

1. Encapsulate node-change handling logic.
2. Enable collaborative editing across documents with fields of different kinds.

## Revision Info

Some `FieldKind` implementations need to know which revision a given change is associated with. `ModularChangeFamily` tracks revision information via `RevisionTag`s and provides it to `FieldKind` implementations when invoking `rebase`, `invert`, and `compose`.

### Revision Info At Rest

Revision info is stored "at rest" (in changeset structures, outside of active rebase/invert/compose operations). `ModularChangeFamily` can recover the `RevisionTag` for each portion of a changeset. The exception: when multiple revisions contribute changes to the same field, `ModularChangeFamily` tracks revision info for subtrees rooted in that field but not for the field changes themselves — that responsibility falls on the `FieldKind` implementation, which may not need it.

Revision info can be stored at four locations:

1. The root of the changeset (`TaggedChange<FieldChangeMap>.revision`)
2. A specific field's change data (`FieldChange.revision`)
3. A specific node's value change (`NodeChangeset.valueChange.revision`)
4. Within `FieldKind`-specific field data (`FieldChange.change`) — opaque to `ModularChangeFamily`; ignored for bookkeeping purposes

For locations #1–#3, the `revision` field is either populated or undefined:

- **Populated:** all changes on that structure (including nested changes) belong to the given revision.
- **Undefined**, which occurs in three cases:
  - **(A)** An ancestor structure carries the revision — all nested changes inherit it.
  - **(B)** The structure contains changes from multiple revisions.
  - **(C)** The changes belong to an anonymous (tag-less) edit — treated as a special case of (A) for now; likely excluded in future implementations.

Location #1 (root) is special: case (A) never applies to it. Location #3 (value change) is special: case (B) never applies — a value change always belongs to exactly one revision.

Unless a change is anonymous, at least one populated `revision` field will be encountered walking down from the root to any portion of the changeset. Since multiple populated fields may appear on the path, logic must give precedence to the deepest (highest tree-depth) revision information.

### Revision Info During Operations

#### Invert and Rebase

For `invert`, `ModularChangeFamily` supplies revision info to the `FieldKind`'s `invert` implementation by consulting (in order):

- i. Revision info on the field being inverted (`FieldChange.revision`)
- ii. Revision info on an ancestor field
- iii. Revision info on the root changeset

If none yield a defined revision, `undefined` is passed. This happens when the field's changes came from an anonymous edit, or from multiple changes (in which case the `FieldKind`-specific data may contain more precise per-revision information — left entirely to the `FieldKind` implementation).

When the `FieldKind`'s `invert` implementation recurses via `NodeChangeInverter`, `ModularChangeFamily` determines the `NodeChangeset`'s revision by considering (in decreasing precedence):

1. Revision info on the node's field/value changes (#2 and #3)
2. Revision info from the containing field (sources i, ii, iii above)

If neither yields a defined revision, the `NodeChangeset`'s changes came from an anonymous or multi-revision edit.

For `rebase`, `FieldKind` implementations are not expected to need the revision of the change being rebased, so `ModularChangeFamily` does not plumb it through. It does plumb through the revision of the **base change** (the change being rebased over), using the same approach as for `invert`.

#### Compose

For `compose`, `ModularChangeFamily` plumbs revision info through for all changes. A complication arises when the `FieldKind`'s `compose` implementation calls `NodeChangeComposer`: `ModularChangeFamily` cannot determine which input `NodeChangeset`s correspond to which input field changesets. For example, if the `FieldKind`'s `compose` is given changesets from revisions foo, bar, and baz, and then calls `NodeChangeComposer` with two `NodeChangeset`s, `ModularChangeFamily` cannot know whether they came from (foo, bar), (foo, baz), or (bar, baz).

The current solution requires callers of `NodeChangeComposer` to explicitly tag each `NodeChangeset` they pass.

This tagging is necessary for two reasons:

1. Passing correct revision info to nested fields' `compose` implementations.
2. Maintaining the revision bookkeeping described above.

For example, if `NodeChangeset`s from revisions foo and bar are passed to `NodeChangeComposer` — where foo only has a field change for "foo" and bar only has a value change — the resulting `NodeChangeset` must explicitly carry:

- A `FieldChange` for field "foo" tagged with revision foo
- A `NodeChangeset.valueChange` tagged with revision bar

This self-sufficiency is required because the higher-level structure (ancestor fields and root) will contain composite revision info from multiple changes and cannot be relied upon for single-revision attribution.
