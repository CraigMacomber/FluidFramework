# Introduction

The Fluid Framework is a client/server stack for real-time data synchronization. It has three key parts:
- **Fluid Service:** sequences and broadcasts ops to clients, persists state to storage.
- **Fluid Runtime:** sends local ops to the Fluid Service and merges incoming ops.
- **DDSes:** distributed data structures kept synchronized by the Service and Runtime.

From an application developer's perspective, using Fluid is largely a matter of choosing the right DDSes. For example, `SharedMap` works like a JavaScript `Map` but reflects remote changes. Key developer feedback has been the desire for a DDS that models complex, hierarchical data — Shared Tree is the response.

# What is Shared Tree

Shared Tree is a DDS for keeping hierarchical data synchronized between clients. Key scenarios:

- [Read and write without an in-memory JavaScript representation](#tree-reading-and-writing-without-reification)
- [Apply related changes atomically (transactions)](#isolation-of-synchronous-non-overlapping-transaction)
- [JavaScript object-style API](#tree-reading-and-writing-with-js-object-style-api)
- [Undo without disrupting concurrent changes](#undoredo)
- [Move data without duplication or invalidation](#move)
- [Durable node identifiers for URLs and graph references](#strong-node-identifiers-and-lookup-index)
- [Asynchronous transactions](#asynchronous-transactions-and-snapshot-isolation)
- [Embedded collections (sets, maps)](#embedded-collections-eg-sets-maps)
- [Constraints for conditional transactions](#constraints)
- [Schema enforced at merge time](#schema-and-schema-enforcement)
- [Lossless JSON round-trip](#lossless-json-roundtripping)
- [Collaborative text in large sequences](#large-sequence--collaborative-text-support)
- [Incremental commits and virtualization](#storage-performance-incrementality-and-virtualization)
- [Type-safe schema API](#type-safe-schema-api)
- [Retroactive undo/redo](#retroactive-undoredo)
- [Access to past document states](#history)
- [Branching and merging](#branching-and-merging)
- [Custom persisted indexes](#indexes)
- [High-level semantic commands](#high-level-commands)
- [Documents larger than client memory](#partial-checkout)

Read the [Shared Tree github readme](../README.md) for a technical overview.

# Performance

Performance is central to the Fluid Framework vision. Near-term goals:

- Equivalent or better performance than the experimental Shared Tree DDS
- Granular performance benchmarks for each component (reading, writing, merging)
- A benchmarking stress test app to set baselines and measure improvements
- Low-level layers optimized for performance; ergonomic higher-level APIs built on top

As the feature set grows:

- Tree reading remains a reasonable constant factor compared to reading a JS object tree
- Long sequences, maps, and sets are optimized
- Summarization performance scales with the scope of changed data (not total data size)
- Boot performance is optimizable through virtualization

# Stability

- ~90% unit test coverage
- Fuzz testing of all major components
- Two or more test apps used to validate every significant update
- Persisted state code is isolated with policies for stable version migrations
- Forwards and backwards compatibility tests

# Roadmap

## Rebaser Core Architecture

> Complete

The Rebaser handles the dual requirements of intention preservation and support for very large documents (potentially larger than client memory). It operates without reifying the tree data, working only from operations. Design documents are [here](../docs).

## UUID Compression Scheme

> Complete

Supporting larger-than-memory data sets requires efficiently handling large numbers of UUIDs. Shared Tree uses a distributed compression scheme reducing average identifier storage cost to that of a small integer. The ID compressor now lives in the container runtime ([documentation](../../../../packages/runtime/container-runtime/src/id-compressor/idCompressor.ts#L206)).

## Data Model Specification

> Complete

Shared Tree uses a JSON-like data model with key divergences to accommodate schema annotations, strong identifiers, references, and JSON interoperability. Specification [here](../docs/data-model/README.md).

## Basic Data Synchronization

> Complete

Enables creating a Shared Tree and syncing transient data between clients. Insert, remove, and modify are functional. Storage formats are not final; no data migration strategy or move operation at this stage.

## Tree Reading and Writing Without Reification

> Complete

Enables reading and writing without creating an in-memory JavaScript representation. Useful for memory-constrained clients, interop boundaries (WASM, C++), permission checking, and inspecting changes without loading the full tree.

Built on a [cursor API](../src/core/tree/cursor.ts) for tree navigation. This is an expert API — more ergonomic APIs come in later milestones. Benefits around reification aren't fully realized until [storage virtualization](#storage-performance-incrementality-and-virtualization).

## Isolation of Synchronous Non-Overlapping Transactions

> Complete

Enables grouping changes into logical units for atomicity, application semantics, and change dependencies. Guarantees that bundled changes are applied without interleaving, both locally and from peers.

Does not include constraint-based atomicity (see [constraints](#constraints)). See also [undo/redo](#undoredo).

## Tree Reading and Writing with JS Object Style API

> In progress

The Flex Tree (formerly Editable Tree) API presents the tree as JavaScript objects. Uses JavaScript proxies. Schema is supported but not in this milestone. See [here](../src/feature-libraries/flex-tree/README.md).

## Undo/redo

> In progress

Generates the inverse of a given edit and applies it. Simple to reason about but can conflict with concurrent changes. See [alternative designs](../docs/main/undo) for future improvements.

## Move

> In progress

Preserves node identity during move, ensuring concurrent changes don't produce missing or duplicated data. Two types:
- **Node range move:** moves nodes in the range at edit time.
- **Slice range move:** moves nodes in the range at application time.

## Strong Node Identifiers and Lookup Index

> In progress

Allows nodes to optionally carry unique identifiers for durable references (graph-like references, URLs) that survive structural changes. Stored as compressed integers, translatable to UUIDs. Shared Tree maintains an index for fast lookups.

## Asynchronous Transactions and Snapshot Isolation

> In progress

Supports multiple concurrent transactions per client with snapshot isolation — each transaction operates on the tree state at transaction start, isolated from other local and remote changes. Enables async transactions spanning multiple JS frames.

Use case example: show a placeholder value immediately, then update it when an async service call completes, while preventing interleaved changes during the flow.

## Parity with Experimental Shared Tree

> In progress

Marks the point where Shared Tree is a superset of legacy Shared Tree functionality with equivalent or better performance. Developers on the legacy DDS should switch at this point. Includes:

- A data migration system for lossless migration from legacy to Shared Tree.
- Stable persisted format with guaranteed backwards compatibility forever.
- For each new format version: a Shared Tree package that supports writing both the new and immediately prior version, enabling staged rollouts.

## Embedded Collections (e.g., Sets, Maps)

> In progress

Allows subsets of the data model to use more specific representations (e.g., key/value stores) while still receiving Shared Tree benefits (identity, schema, move semantics). Initially supports sets and maps; architecture allows easy extension.

## Constraints

> In progress

By default, Shared Tree edits always succeed (high-quality automatic merges). Constraints let developers declare conditions that, if violated by concurrent edits, cause a transaction to fail and be marked conflicted. Initial constraints: node still exists, node/field not edited (recursively or not).

## Schema and Schema Enforcement

> Pending

Schema defines data structure via _type_ fields on nodes, associating types with rules for field shapes and allowed child types. Stored in the tree ([schema specification](../src/core/schema-stored/README.md)). Shared Tree enforces schema even during concurrent editing. Does not include type-safe viewing — see [type-safe schema API](#type-safe-schema-api).

## Lossless JSON Roundtripping

> Pending

Provides import/export of JSON data:
- A [JSON domain schema](../src/domains/json/jsonDomainSchema.ts) mapping the Shared Tree data model to JSON, with a [low-level cursor](../src/domains/json/jsonCursor.ts) for native-JSON-style navigation.
- APIs to ingest JSON into a JSON-typed subtree and export a JSON-typed tree to raw JSON.

As lossless as JavaScript's own JSON API; the same [caveats](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON) apply.

## Large Sequence and Collaborative Text Support

> Pending

Adds collaborative text support and scales sequence performance. Text nodes have the same properties as all tree nodes (moveable, identity, revertible, etc.) so large sequence support benefits the general case as well.

## Storage Performance: Incrementality and Virtualization

> Pending

**Incrementality:** Breaks the tree into discrete node chunks as the unit of re-upload. Summarization performance scales with changed content, not total content — dramatically reducing latency and bandwidth. Prerequisite for larger-than-memory datasets.

**Virtualization:** Downloads portions of the tree on demand rather than the full tree on boot, dramatically improving load performance. Another prerequisite for larger-than-memory datasets.

Long-form design proposal [here](../docs/main/tree-storage.md).

## Type-Safe Schema API

> Pending

Automatically generates TypeScript types from schema definitions, enabling compile-time type safety when working with the tree. Example: a `Point` type provides typed access to `Point.x` and `Point.y`, agnostic to the underlying tree representation. Improves tooling integration (autocomplete, intellisense).

## Retroactive Undo/Redo

> Pending

A more complex undo that inverts an edit *and* adjusts its effect on subsequent changes. For example, retroactively undoing a deletion also applies edits to the removed content that had previously failed because the target was deleted. May also retroactively undo later transactions that would have been invalid without the original edit.

## History

> Pending

Provides an immutable view of the tree as it appeared at any past point in time. Initially scoped to the entire tree; will be refined to allow history for specific subtrees.

## Branching and Merging

> Pending

Supports creating branches of parts of the tree, rebasing those branches, and merging changes back to the main branch — similar to Git. Useful for offline work or isolated changes where concurrent edits would be disruptive.

## Indexes

> Pending

Allows developers to build custom persisted indexes for complex tree queries (e.g., spatial search, graph reference lookup, value queries). Shared Tree handles index serialization, branching integration, and async transaction coordination. Useful when exhaustive tree traversal becomes infeasible at scale.

Indexes are stored alongside Shared Tree data to avoid secondary stores and avoid recomputation on load. Shared Tree exposes an extension point for developer-defined indexes with built-in integration complexity handled by the framework.

## High-Level Commands

> Pending

Structures edits as _commands_ with typed tree-reference parameters and opaque parameters. When a local edit is rebased against a conflicting edit, the command can be re-executed under the new circumstances. Shared Tree adjusts tree reference parameters heuristically before re-execution.

Benefits: many merge scenarios yield better outcomes than primitive operation merges. Example: User A adds a table row and User B concurrently adds a column — the table is well-formed regardless of sequencing order.

This milestone explores the command model, its interplay with constraints, and edge cases like code availability and versioning.

## Partial Checkout

> Pending

Introduces partial tree views registered with the server at document load. The view (a subset of the tree) is dynamic and expandable by navigating the tree. The server filters ops to deliver only those relevant to the client's current region, improving efficiency and enabling fine-grained permission enforcement.

Builds on [storage incrementality and virtualization](#storage-performance-incrementality-and-virtualization), which ensures load time and summarization performance are not limiting factors.

# Long-term Outlook

The items above represent current thinking about developer needs. The list is not complete and will evolve with usage and feedback. Topics under active discussion:

- Extensible embedded data types allowing developers to extend Shared Tree types and merge semantics
- Consuming and updating Fluid data from clients that don't run the Fluid Runtime
- Service-level features such as indexed queries and fine-grained, fully secure access control
