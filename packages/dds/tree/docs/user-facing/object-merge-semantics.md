# Merge Semantics of Edits on Object Nodes

Merge semantics for edits on object nodes, for `SharedTree` users and maintainers.

> We recommend reading [SharedTree's approach to merge semantics](merge-semantics) first.

Each edit's merge semantics are defined by its preconditions (requirements for the edit to be valid) and postconditions (guarantees about its effect). Invalid edits — along with all other edits in the same transaction — are dropped.

## Operator `=`

Assigns a value to an object property.

```typescript
rectangle.topLeft = new Point({ x: 0, y: 0 });
babyShowerNote.author = "The Joneses";
proposal.text = undefined; // clears an optional property
```

**Preconditions:**
* No concurrent schema change was sequenced before this edit.
* The right-hand side value must have status `TreeStatus.New` or be a primitive. _(This precondition will be removed soon.)_

**Postconditions:**
* The right-hand side value is now associated with the targeted property.
* The value previously associated with the property (if any) is removed (`TreeStatus.Removed`).

Removed items are retained internally in case they need to be restored by an undo. Changes made to them while removed still apply and become visible if the removal is undone.

## Additional Notes

### Operations on Removed Objects

All operations above are effective even when the targeted object has been moved or removed.

### Last-Write-Wins Semantics

When multiple edits concurrently assign to the same field, the one sequenced last wins — the final value is always the last-sequenced assignment.

This means one user can silently overwrite another's value. For example, Alice changes a note's color from yellow to red while Bob concurrently changes it from yellow to blue. If Bob's edit is sequenced after Alice's, the note ends up blue.

![Bob's edit overwrites Alice's edit](https://storage.fluidframework.com/static/images/blue-over-red.png)<br />
_A: Bob receives Alice's edit. Because his own edit hasn't come back from the sequencer yet, Bob knows his edit will be sequenced later and win, so the color stays blue.<br />
B: Alice receives Bob's edit. Even though it was originally a yellow → blue change, it now overwrites red → blue._

Such overwrites are rare when users have visual cues about concurrent activity. Constraints can enforce first-write-wins semantics, but note that the losing edit is dropped entirely and its data is lost.
