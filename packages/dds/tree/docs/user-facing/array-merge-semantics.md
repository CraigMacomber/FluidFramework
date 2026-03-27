# Merge Semantics of Edits on Array Nodes

Merge semantics for edits on array nodes, for `SharedTree` users and maintainers.

> We recommend reading [SharedTree's approach to merge semantics](merge-semantics) first.

Each edit's merge semantics are defined by its preconditions (requirements for the edit to be valid) and postconditions (guarantees about its effect). Invalid edits — along with all other edits in the same transaction — are dropped.

## Key Challenges and Solutions

### Specifying the Location of Inserted Items

#### The Problem

Insert and move operations take an integer describing where to add items. In a collaborative environment the array can change between when the edit is created and when it is applied.

Consider what happens if the destination is treated as a fixed index:

**Example 1:**
* Starting state: `["c", "a", "t"]`
* Alice: `insertAt(0, "r", "e", "d", " ")` → expects `["r", "e", "d", " ", "c", "a", "t"]`
* Bob: `insertAt(1, "o")` → expects `["c", "o", "a", "t"]`

If Alice's edit is sequenced first, inserting `"o"` at index 1 yields `["r", "o", "e", "d", " ", "c", "a", "t"]` — not what Bob intended (`["r", "e", "d", " ", "c", "o", "a", "t"]`).

**Example 2:**
* Starting state: `["r", "e", "d", " ", "c", "a", "t"]`
* Alice: `removeRange(0, 4)` → expects `["c", "a", "t"]`
* Bob: `insertAt(5, "o")` → expects `["r", "e", "d", " ", "c", "o", "a", "t"]`

If Alice's edit is sequenced first, inserting at index 5 either crashes or yields `["c", "a", "t", "o"]` — not `["c", "o", "a", "t"]`.

#### The Solution: Inserting in Gaps

Instead of a fixed index, `SharedTree` interprets the destination as a **gap** between items. An array with K items has K+1 gaps. For example, `[A, B]` has gaps: `[ _ A _ B _ ]`.

Calling `insertAt(1, "o")` on `["c", "a", "t"]` targets the gap `["c" _ "a" "t"]`. This gap is recorded at edit creation time and its position is tracked through concurrent edits. After reconciling with Alice's `insertAt(0, "r", "e", "d", " ")`, the gap is at `["r" "e" "d" " " "c" _ "a" "t"]`, correctly yielding `["r", "e", "d", " ", "c", "o", "a", "t"]`.

#### Tie-Breaking

When multiple edits concurrently insert into the same gap, items from the edit sequenced _later_ appear _before_ items from the edit sequenced earlier.

**Example:**
* Starting state: `[]`
* Edit 1 (concurrent): insert A and B
* Edit 2 (concurrent): insert R and S
* Edit 3 (concurrent): insert X and Y

Sequenced in order 1, 2, 3 → result: `[X, Y, R, S, A, B]`.

#### Noteworthy Implications

Inserting before or after an existing item does not guarantee adjacency after concurrent edits.

**Concurrent insert:** Alice inserts A at the start of `[Y, Z]`; Bob inserts X at the start. If Alice is sequenced first: `[X, A, Y, Z]`.

**Concurrent remove:** Alice removes Y from `[Y, Z]`; Bob inserts X at the start. Result regardless of ordering: `[X, Z]`.

**Concurrent move:** Alice moves Y after Z in `[Y, Z]`; Bob inserts X at the start. Result regardless of ordering: `[X, Z, Y]` — not `[Z, X, Y]`.

The insertion is anchored to a gap, not to an adjacent item. Contact the Fluid team if different semantics are needed.

### Specifying the Set of (Re)Moved Items

Move and remove operations target specific items, not fixed indexes. `removeAt(1)` means "remove the item currently at index 1, wherever that item ends up when the edit is applied."

When targeting multiple contiguous items, use a range (e.g., `removeRange(1, 3)`). This is equivalent to individually removing each item in one transaction, but more efficient. `moveRange` additionally preserves the relative order of the targeted items at the time the edit is created.

**Example:**
* Starting state: `[A, B, C]`
* Edit 1: `moveRange(0, 1, 2)` — move B before A → `[B, A, C]`
* Edit 2: `moveRange(3, 0, 2)` — move A and B after C → `[C, A, B]`

If edit 1 is sequenced first: `[B, A, C]` → `[C, A, B]`.
If edit 2 is sequenced first: `[C, A, B]` → `[B, C, A]`.

#### The Problem

Using fixed indexes for remove/move targets the wrong item when concurrent inserts shift positions:
* Starting state: `["c", "o", "a", "t"]`
* Alice: `insertAt(0, "r", "e", "d", " ")` → `["r", "e", "d", " ", "c", "o", "a", "t"]`
* Bob: `removeAt(1)` → expects to remove `"o"`, getting `["c", "a", "t"]`

If Alice is sequenced first, `removeAt(1)` removes `"e"` instead: `["r", "d", " ", "c", "o", "a", "t"]`.

#### The Solution: Targeting Items

`SharedTree` tracks the specific item, not its index. The item is identified at edit creation time and removed from wherever it is when the edit is applied.

#### Noteworthy Implications

Items inserted concurrently into a range being moved are **not** included in the move:

**Example:** One user moves A and B to the end of `[A, B, C]`; another concurrently inserts X between A and B → `[A, X, B, C]`. The move still targets A and B only → `[X, C, A, B]`.

Concurrent moves of the same item are resolved last-write-wins (each move applies in sequencing order):
* Leftward move sequenced before rightward: `[A,B,C]` → `[B,A,C]` → `[A,C,B]`
* Rightward move sequenced before leftward: `[A,B,C]` → `[A,C,B]` → `[B,A,C]`

A moved item may be concurrently removed, and vice versa — the last-sequenced operation wins.

## Core Editing Operations

### `insertAt(gapIndex: number, ...value: readonly (TNew | IterableTreeArrayContent<TNew>)[]): void`

Inserts new items at the location described by `gapIndex`.

**Preconditions:**
* No concurrent schema change was sequenced before this edit.
* The inserted values must have status `TreeStatus.New` or be primitives. _(This precondition will be removed soon.)_

**Postconditions:**
* The values are inserted in the targeted gap.

### `moveRangeToIndex(destinationGap: number, sourceStart: number, sourceEnd: number, source: TMoveFrom): void`

Moves the specified items to the desired location.

**Preconditions:**
* No concurrent schema change was sequenced before this edit.

**Postconditions:**
* The specified items are moved to the targeted gap. When multiple clients concurrently move the same item, the last-sequenced destination wins.

### `removeRange(start?: number, end?: number): void`

Removes the items between the specified indices.

**Preconditions:**
* No concurrent schema change was sequenced before this edit.

**Postconditions:**
* The specified items are removed.

Removed items are retained internally in case they need to be restored by an undo. Concurrent changes to them still apply and become visible if the removal is undone.

## Other Operations

The following are convenience aliases:

| Method | Equivalent to |
|--------|---------------|
| `insertAtStart(...value)` | `array.insertAt(0, ...value)` |
| `insertAtEnd(...value)` | `array.insertAt(array.length, ...value)` |
| `moveRangeToIndex(dest, start, end)` | `array.moveRangeToIndex(dest, start, end, array)` |
| `moveRangeToStart(start, end, source)` | `array.moveRangeToIndex(0, start, end, source)` |
| `moveRangeToStart(start, end)` | `array.moveRangeToIndex(0, start, end, array)` |
| `moveToIndex(dest, index, source)` | `array.moveRangeToIndex(dest, index, index+1, source)` |
| `moveToIndex(dest, index)` | `array.moveRangeToIndex(dest, index, index+1, array)` |
| `moveToStart(index, source)` | `array.moveRangeToIndex(0, index, index+1, source)` |
| `moveToStart(index)` | `array.moveRangeToIndex(0, index, index+1, array)` |
| `moveRangeToEnd(start, end, source)` | `array.moveRangeToIndex(array.length, start, end, source)` |
| `moveRangeToEnd(start, end)` | `array.moveRangeToIndex(array.length, start, end, array)` |
| `moveToEnd(index, source)` | `array.moveRangeToIndex(array.length, index, index+1, source)` |
| `moveToEnd(index)` | `array.moveRangeToIndex(array.length, index, index+1, array)` |
| `removeAt(index)` | `array.removeRange(index, index+1)` |

## Additional Notes

### Operations on Removed Arrays

All operations above are effective even when the targeted array has been moved or removed.

### Removing and Re-inserting Items

In plain JavaScript you can move an item by removing and re-adding it:
```typescript
const C = array.pop(); // [A, B]
array.unshift(C);      // [C, A, B]
```

As of October 2024, `SharedTree` arrays do not support re-inserting a previously inserted item. Use the move operation instead:
```typescript
array.moveToStart(2);
```
Work is underway to remove this limitation.

### Replacing Items

As of October 2024, `SharedTree` arrays do not support in-place replacement via index assignment or splice. The closest alternative is remove + insert:
```typescript
array.removeAt(1);
array.insertAt(1, X);
```

This can produce unexpected merge outcomes with concurrent insertions:
* Starting state: `["gold", "bronze"]`
* User 1 replaces both: `removeRange(0, 2)`, then `insertAt(0, "1st place", "3rd place")`
* User 2 inserts between them: `insertAt(1, "2nd place")`
* Merge outcome: `["1st place", "3rd place", "2nd place"]`

True replacement would yield `["1st place", "2nd place", "3rd place"]`. The discrepancy arises because remove + insert does not update items in place — the original items (now removed) and the new items coexist in the gap tracking, giving `["1st place", "3rd place", ~~"gold"~~, "2nd place", ~~"bronze"~~]`.

Contact the Fluid team if in-place replacement is critical to your application.
