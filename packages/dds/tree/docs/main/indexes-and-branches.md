# Indexes and Branches

## Indexes

[shared-tree-core](../../src/shared-tree-core/README.md) defines `Index`, which plays the same role as [database indexes](https://en.wikipedia.org/wiki/Database_index). SharedTree can be thought of as a tree database interacted with through a collection of indexes; all persisted document data is owned by indexes, meaning we use [covering indexes](https://en.wikipedia.org/wiki/Database_index#Covering_index) to answer all queries.

In practice, [shared-tree](../../src/shared-tree/README.md) provides `ForestIndex` — a covering index that stores actual tree node data, optimized for subtree retrieval and editing by path. `SchemaIndex` handles schema data similarly. Future indexes could accelerate lookup by node identifier, text search, etc.

Indexes are updated on document edits and persisted in Fluid summaries. Indexes that only have performance implications (no effect on op application) and cache nothing persistently are treated as a special case of persisted indexes with empty persisted data. Indexes may also keep only a subset of their data in memory, loading the rest from persistence on demand — this is planned for `ForestIndex` and is a key scalability requirement.

## Branches

A branch is a timeline of document state as viewed from a particular user — the same concept as [version control branches](https://en.wikipedia.org/wiki/Branching_(version_control)).

From a single Fluid client's perspective:

- **Sequenced branch:** Everything sequenced so far. Append-only (never rebased or reset); all ops from all clients, ordered by the Fluid ordering service. Analogous to a `main` branch updated only via pull requests.

- **Local branch:** The sequenced branch plus unsequenced local edits. Analogous to a local feature branch, rebased onto `main` as each new commit is merged.

- **Working copy:** The local branch plus the in-progress transaction state. If async transactions with snapshot isolation are supported, the branch point may not always be the latest local branch tip. Analogous to git's working copy (local branch = checked-out branch; in-progress transaction = uncommitted changes).

- **Remote branches:** Replicas of remote clients' local branches at the time each op was sent. Required for correct rebasing of remote edits into the sequenced branch. (Unlike git, where rebasing happens once upstream, all Fluid clients perform the rebase locally.)

- **Long-lived branches:** User-created branches that persist separately from the main branch for extended periods. Useful for experimentation, extended offline work (preserving history on merge), or user-controlled snapshots. Currently not supported; forward-looking designs should account for them.

TODO: Diagrams showing branch timelines for multiple clients.

## Branch-Index Interactions

Indexes may be needed at several points in the revision graph:

- **Tip of working copy:** Needed by editing code to access schema and tree data. Additional indexes (e.g., identifier lookup, text search) are likely also desired here.
- **Tip of local branch:** The version reflected in the application's views and APIs; must support reading, state interpretation, and transaction creation.
- **Tip of sequenced branch:** Logical point for summarization (though local branch tip is equivalent on summary clients). Also the base for rebasing remote edits and the local branch.
- **Tip of remote branches:** The state from which remote edits are interpreted and rebased. The op creator had index access at this state and could optionally include relevant index data to avoid recomputation on other clients.
- **Along merge reconciliation paths:** If rebasing or squashing requires index access, indexes may be needed at intermediate points in the merge path.
- **Historical states:** For inspecting old document versions, either via old index versions or by indexing history directly in current indexes.
- **On long-lived branches:** If supported, long-lived branches may need their own indexes, including working copy and remote branch indexes for collaborative use.

## Optimization Options

Maintaining full in-memory indexes for all locations at all times would be prohibitively expensive. Mitigations include:

- **Selective maintenance:** Keep indexes only at revision graph locations that require them.
- **Avoid indexes during peer rebasing:** Only use indexes when creating edits (working copy tip), not when rebasing peer edits. This makes remote-edit rebasing synchronous without index access, enabling async index access patterns.
- **Virtualized indexes:** Lazily load data from blobs on demand, keeping only a portion in memory at a time. Pairs well with async index access.
- **Delta indexes:** Implement indexes as deltas to another version — like a write-back cache or LevelDB tiering. Efficient for maintaining multiple in-memory versions at nearby revision graph locations (e.g., persisted, sequenced, local, per-transaction).
- **Copy-on-write:** Share unchanged parts across multiple in-memory index versions.

## A General Approach

Different indexes have different usage patterns and optimization requirements. To keep options open, SharedTree's index abstraction exposes both branches and revisions to index implementations, leaving each implementation free to choose mutation vs. copy-on-write and whether to virtualize. An `IndexView` concept provides access to index state at a specific revision or branch.

Helper code for both copy-on-write and mutation-based approaches (likely involving deltas) can reduce duplication across index implementations.

To avoid multiple data structures tracking branch relationships, `Rebaser` can be generalized into a `RevisionManager` that handles this once; indexes use it to track, notify, and look up revision-related information. Since indexes can depend on other indexes (e.g., `ForestIndex` depends on `SchemaIndex`), the `RevisionManager` itself can be an index, allowing its state to be summarized via the same path as all other indexes.

This approach keeps most design trade-offs inside individual index implementations, so changing them does not affect system architecture. Different indexes (or the same index in different apps) can use different strategies, enabling specialized optimizations and incremental API migrations.
