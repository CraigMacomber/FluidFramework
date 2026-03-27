# V1 Undo

First implementation of undo/redo, targeting parity with experimental (legacy) SharedTree.

This system allows a change to a concurrently removed subtree to take effect even when the removal is sequenced first. It does not, however, support editing a subtree that is already in a removed state at the time the edit is made.

## Semantics

Reverting a change generates and applies a new change that partially restores the document to its prior state:

1. Only parts of the document affected by the change being reverted are restored. Changes to other parts are unaffected. For example, moving an item within or across arrays can be reverted independently of changes to that item's contents, and vice versa.

2. If the same parts of the document were changed between the original edit and the revert, those changes are overwritten. For example, if node Foo was replaced with Bar, reverting that replacement restores Foo even if Bar was subsequently replaced with Baz.

3. Reverting restores the document to the state before the change was first applied locally (Foo in the example above, not Baz). This ensures users navigate back to states they have previously witnessed, rather than encountering unfamiliar intermediate states — the expected behavior for undo/redo.

## Creating Concrete Undo Edits

To minimize code changes and complexity, this implementation reuses existing changeset code paths by always sending [concrete undos](./undo.md#abstract-vs-concrete-undo-messages) over the wire. The undo edit is created by inverting the edit to be undone, then rebasing that inverse over all changes applied since.

Sending concrete undo edits removes the need for distributed consensus on an undo window. It does require sending rebased changes over the wire, but this is already required for resubmitting ops, so concrete undo introduces no new requirement there.

## Creating Concrete Redo Edits

Redo changesets are created by inverting the corresponding undo changeset and rebasing that inverse over all edits applied since the undo. This is preferable to rebasing the original edit forward because:

- It better mitigates data loss caused by undo. For example, undoing an insert removes content added under the inserted node; applying the inverse of the undo restores that content, whereas re-applying the original insert would not.
- It is more efficient — fewer edits to rebase over and fewer edits to retain.

## Revertibles: Unifying Undo and Redo

This approach makes undo and redo indistinguishable in the implementation — both are simply reversions of an edit. Each edit is represented by a commit, and for each revertible edit a `Revertible` object can be generated and used to revert it. See `CheckoutEvents.commitApplied` and the `Revertible` API for details.

## Managing Revertibles

Reverting a commit requires inverting it and rebasing that inverse to the branch tip. This requires:

- The original commit to be reverted
- All commits applied after it

This is achieved by maintaining a branch whose tip is the original commit for as long as it may be reverted. When the commit is reverted, its inverse is rebased from that branch's tip to the tip of the target branch, then applied.

This relies on SharedTree edits being non-destructive — they preserve information about the document rather than erasing it. If removal operations erased subtree contents, reverts of those removals would be impossible. See [Detached Trees](./detached-trees.md) for details.

When the `Revertible` object is disposed, the associated branch is disposed and its resources reclaimed.
