# SharedTree Semantic/Temporal Edit Format

The "Semantic" (a.k.a. "Temporal") format complements the "Structural" (a.k.a. "Spatial") Changeset format; each is suited to different scenarios.

Semantic edits are serialized function calls (RPC-style) applied to a tree state. When run, a Semantic edit may modify the tree by creating and applying sub-edits, which must ultimately produce a sequence of low-level primitives understood by SharedTree. A Semantic edit can optionally be annotated with its sub-edits, enabling replay at multiple levels of granularity — SharedTree natively understands the all-leaves case. Semantic edits capture not just _what_ changed, but _why_.

Structural edits capture only _what_ changed, organized as a sparse mirror of the tree. This allows coalescing changes and filtering by subtree (e.g., transmitting only changes relevant to a client's permissions).

**Motivations for the Semantic format:**

- **Intent preservation for rebase.** High-level commands can be replayed when their inputs/context have changed, yielding better merge outcomes without application-level merge logic. This applies to: rebasing local edits against earlier-sequenced edits, out-of-order undo/redo, and branch merges.
- **Precise history.** Enables fine-grained branching and history manipulation.
- **Compact and resilient.** Edits reference only identities, so conflict-free edits can be shared across branches without unbounded history walks — useful for local history and archive regions of large histories.
- **Efficient transmission.** For large-effect commands available on all clients, transmitting the high-level command is far cheaper than the resulting low-level changes.

Semantic edits require a reified tree, but commands that may inspect the tree require this anyway.

## Comparison

| **_Semantic_**                                                  | **_Structural_**                                                                                |
| --------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| **Preserves all states between user actions**                   | **Omits intermediate states when desired**                                                      |
| Structural format used where "Squash" is desired                | Can represent outcome of explicit "Squash" to deliberately forget intermediate states           |
|                                                                 | Allows clients to quickly migrate tree snapshot (no local changes) to a different revision      |
|                                                                 | Can compactly represent a delta between two trees                                               |
| **Designed for best rebase outcomes**                           | **Designed to scale**                                                                           |
| Preserves intent of users                                       | Efficient filtering of transmitted operations based on permissions or partial checkouts         |
| Supports replay of commands, which may inspect surrounding tree | Does not require reified tree, even during rebasing                                             |
|                                                                 | Reduces cost of server mediating live collaboration sessions                                    |
|                                                                 | Allows server to cheaply mirror document in external database                                   |
| **Compact representation through use of identities**            | **Representation optimized for scale, speed**                                                   |
| Useful for local history, "archive history" on servers          | Servers with stored Structural representation can enforce permissions without reifying tree     |
|                                                                 | Servers can store "mipmap" for very fast migration between revisions                            |

## Terminology

|  **_Term_**   | **_Definition_**                                                                                                                                                                                                                                           |
| :-----------: | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
|  **Command**  | A block of application code that modifies a document; has a stable ID and type signature, and may be invoked directly by the user or by another command                                                                                                    |
|   **Edit**    | The recorded execution of a command in a document's history, including both the command's inputs and outcome; edits may nest                                                                                                                               |
|  **Change**   | A description of the difference between two states of a document                                                                                                                                                                                           |
| **Changeset** | Multiple (mostly) unordered changes, often describing the difference between two revisions in a document's history                                                                                                                                         |
| **Revision**  | A state of interest in the history; may also refer to the data structure in the history that describes how this state may be obtained from the previous revision (includes a Changeset or Edit, plus metadata such as author and timestamp) |

## Commands

Commands are registered by the application with a stable identity and an execution function, called when invoked by the user or during a rebase.

Example command definition:

```TypeScript
const deleteFirstDotCommand = {
    id: 'ada59364-b55c-4f35-95cf-867e93a141f5' as CommandId,
    run: (context: CommandContext, { dotList }: { dotList: DotList }) => {
        const index = 0;
        const count = 1;
        return dotList.delete(index, count);
    }
}
```

Example registration:

```TypeScript
const canvasCommands: CommandRegistry = [ addDotCommand, deleteFirstDotCommand ];
...
const checkout = await sharedTree.checkOut(canvasCommands);
```

The Checkout interface has a `runCommand` method:

```TypeScript
checkout.runCommand({
   command: deleteFirstDotCommand,
   anchors: { dotList }
});
```

`CommandContext` has the same method, allowing commands to call other commands. Helper functions can simplify the syntax:

```TypeScript
checkout.runCommand(deleteFirstDotCommand(dotList));
```

## Edits

Successful execution of a command (and any commands it calls) produces a reversible Edit appended to the history. If a command cannot complete, the partially complete edit can roll back local state. Nested commands may detect errors and choose alternate code paths.

An Edit record contains:

|    **_Name_**     |  **_Type_**   |
| :---------------: | :-----------: |
|   **commandID**   |     UUID      |
|    **anchors**    | { any props } |
|  **parameters?**  | { any props } |
| **constraints?**  | Constraint[]  |
| **reversalData?** | { any props } |
|   **subEdits?**   |    Edit[]     |

Only built-in "primitive" edits may contain `reversalData`. Only higher-level commands may contain `subEdits` (which may be empty if the command is a no-op; a no-op command may still produce sub-edits when rebased). `subEdits` records the temporal order of all sub-command calls.

**Anchors** are tree locations that SharedTree may adjust before re-executing a command during rebase (or fail if adjustment is impossible). Anchor types include: specific TreeNodes, places at the start/end of a trait or adjacent to nodes, and ranges between places in the same trait. Custom anchors may be supported in the future. A special anchor type — detached tree ranges — stores the identity of the edit that produced the range plus a discriminator for multiple outputs. A command must have at least one anchor or it cannot affect the document.

**Parameters** are serializable data not adjusted during rebases. Create operations are special: the tree descriptor is decorated with identities on execution, and the decorated tree is serialized.

**Constraints** are conditions that must hold for the command's low-level edits to apply as-is. If violated, the constraint specifies a fallback action: re-execute, flag for review, require user intervention, or fail. SharedTree records some implicit constraints — all TreeNode anchors must be resolvable, and if any observable node may have changed since the edit was recorded, the command must be re-executed.

The edit hierarchy serves distinct purposes at each level:

- **Top-level:** records user intent; the command is re-called during rebase to determine application behavior under new circumstances.
- **Lowest-level:** can be applied directly to mutate state when migrating forward; reversible for backward migration or rebase.
- **Mid-level:** their identities may serve as detached tree input anchors. They also mitigate code availability issues — a client lacking top-level code may have mid-level command code (from widely-used libraries or older app versions), improving both automatic and manual conflict resolution.

**Deduplication:** Large parameters (notably create operations) may be shared by reference — immutable tree descriptors enable reference equality as a signal to store shared parameters instead of copies. Detecting parameter overlap is harder but can be addressed if needed; compaction can happen during idle time.

**Reducing edit size:**

- If the Structural representation of a Semantic edit is readily available, lowest-level edits need not be reversible.
  - For any higher-level edit whose command is guaranteed to be available on all clients forever, sub-edits need not be stored — the command can always be replayed. If just the clients in the current session can run it, this can significantly reduce bandwidth for commands with large effects.
  - Large create operations may share parameters between Structural and Semantic representations, though the Semantic side may need semantic discriminators that the Structural side doesn't require.
- A command guaranteed to never be useful in rebase scenarios can have its sub-edits inlined into the calling edit's sub-edits.

## History

A branching history can be represented as a set of Branch data structures, each with a header (metadata about the branch or document creation) plus an append-only sequence of Revisions. Each Revision may have child Branches.

This representation maps naturally to the SharedTree data structure itself, offering:

- A single code path for serialization/deserialization.
- Easy presentation of history to users — it's just another SharedTree instance.
- Automatic stable global identities for all elements, enabling intra-history references and user bookmarks.
- On-demand chunked loading via the tree snapshot implementation; asynchronous loading mechanisms (e.g., Placeholders) can be reused.
- Permission assignment to history portions using the same mechanisms as for snapshots.

Deliberately squashing a portion of a branch replaces the Semantic edits in that range with a Structural Changeset.

With lazy loading and subtree sharing between snapshots and create edits, transmission of large created trees to clients can be mostly deferred until demanded.

## Open Questions

1. How is code availability efficiently determined for clients in a session?
    - Are extra network round-trips tolerated the first time commands are run?
    - Is the information volunteered when a client first joins?
    - Are commands grouped into versioned libraries?
    - Or is it some combination of the above?

2. Should we record a "Command schema" (type signature) in the document as a versioning precaution? Note: a subset of the signature can be deduced by inspecting edits in the document history.
