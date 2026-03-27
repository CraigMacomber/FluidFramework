# Merge Semantics of Edits on Map Nodes

Merge semantics for edits on map nodes, for `SharedTree` users and maintainers.

> We recommend reading [SharedTree's approach to merge semantics](merge-semantics) first.

Each edit's merge semantics are defined by its preconditions (requirements for the edit to be valid) and postconditions (guarantees about its effect). Invalid edits — along with all other edits in the same transaction — are dropped.

## `set(key: string, value: T): void`

Associates a value with the given key.

```typescript
users.set("bob", new User({ id: "bob", email: "bob@contoso.com" }));
partCounts.set("bolts", 42);
```

**Preconditions:**
* No concurrent schema change was sequenced before this edit.
* The value must have status `TreeStatus.New` or be a primitive. _(This precondition will be removed soon.)_

**Postconditions:**
* The given value is associated with the key.
* The previous value for that key (if any) is removed (`TreeStatus.Removed`).

## `delete(key: string): void`

Removes any value associated with the given key.

```typescript
users.delete("bob");
```

**Preconditions:**
* No concurrent schema change was sequenced before this edit.

**Postconditions:**
* No value is associated with the key. Whatever was there — including a value set by a concurrent edit sequenced before this one — is removed (`TreeStatus.Removed`).

Removed items are retained internally in case they need to be restored by an undo. Concurrent changes to removed items still apply and become visible if the removal is undone.

## Additional Notes

### Operations on Removed Maps

All operations above are effective even when the targeted map has been moved or removed.

### Last-Write-Wins Semantics

When multiple edits concurrently `set` the same key, the last-sequenced one wins. This is identical to the `=` operator on object nodes — see [Last-Write-Wins Semantics](./object-merge-semantics.md#last-write-wins-semantics).

### Delete Clears Whichever Value is Present

`delete` removes whatever value is present at application time, including a value set by a concurrent edit:

* Starting state: `map.get("key") === "foo"`
* Client A: `map.set("key", "bar")` (replace "foo" with "bar")
* Client B: `map.delete("key")` (delete "foo")

If A is sequenced before B, client B's delete removes "bar" — a value it never saw. When this is undesirable, add a constraint to the delete transaction to ensure the expected value is still present.

### Removing and Re-inserting Nodes

As of October 2024, `SharedTree` maps do not support moving a node by deleting it from one location and re-inserting it in another (re-inserting a previously inserted node is not allowed). Even if it were supported, concurrent moves would complicate the outcome:

* If another user concurrently moved N to `mapC`, the delete from `mapA` might remove the wrong node, and the `set` into `mapB` would fail if N is still in `mapC` (a node can't be in two places at once).

Work is underway to address this limitation.

### Clearing the Map

As of October 2024, there is no single-operation map clear. Iterating all keys and calling `delete` on each in a transaction does not guarantee an empty result — concurrent edits may add new keys. It is also less efficient than a dedicated `clear` operation would be. Contact the Fluid team if you need this.
