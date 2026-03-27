# SharedTree Design Philosophy

The goal of SharedTree is to empower developers to create and maintain better collaborative experiences.

To achieve this, SharedTree aims to enable developers to:

-   **Productively create and maintain collaborative experiences.** Developers are guided into patterns that work well for collaborative apps, with supporting libraries that make it a good experience.

-   **Easily learn the libraries without prior collaboration experience.** The learning curve is fast enough to be productive on day one — for both new and existing collaborative experiences.

-   **Leverage existing tools, code, and knowledge.** SharedTree APIs interoperate with common libraries, conventions, and data models. Where multiple options exist, SharedTree aligns with popular patterns to enable seamless integration, while still supporting other systems via adapters.

-   **Avoid common pitfalls of collaborative software.** Collaboration introduces subtle requirements around compatibility, updates, offline use, error cases, persistence, and concurrency. API design, documentation, and examples work together to guide developers toward robust experiences. Code changes that may introduce collaboration issues (unexpected merge behavior, cross-version incompatibility, inability to open old documents) should be obvious during review — even to developers new to SharedTree.

-   **Adopt SharedTree without fear of hitting limitations.** If a developer needs to support a new collaboration requirement, SharedTree will not be a limiting factor. Extending it to support new needs should not require major rework of the application or SharedTree itself.

-   **Share and generalize investments across applications.** Merge resolution strategies, compatibility adapters, debug tools, and common schema can be generalized and reused. Users can start with their own specialized implementation and upstream it as a contribution when ready.

In short, SharedTree must be **adopted with confidence**. Once adopted: **compatible with existing systems**, **easily learnable**, **productive** for developers new to collaborative apps, **flexible**, and capable of producing **robust, high-quality** collaborative experiences.

SharedTree also needs to deliver an MVP early, and remain **maintainable** and **extensible** throughout. These follow from the flexibility requirement above, but are worth emphasizing.

# Balancing Conflicting Goals

These goals are values to maximize, not absolute rules. Trade-offs arise — for example, compatibility with non-collaborative libraries can lead to APIs with unclear merge semantics. Most design work in SharedTree is aimed at avoiding such trade-offs, but when they can't be avoided, they are evaluated carefully.

# Implications of these Goals

Commonly desired collaboration features should be easy to support. When they require extra work, they can be explicitly opted out of or deferred. Examples:

-   Cross-client compatibility for incremental rollout of updates
-   Schema compatibility across different applications or versions
-   Fine-grained and customized merge resolution
-   Offline use
-   Ensuring application data invariants hold
-   Scaling to large datasets
-   Services to accelerate operations (summarization, search, etc.)

SharedTree's approach to extensibility and maintainability relies on modularity and versioning, described below.

# A Design For Extensibility and Compatibility with Versioning

SharedTree is a collaborative data structure requiring cross-client compatibility and the ability to load all old formats. This imposes strict compatibility requirements that create tension with maintainability and extensibility. The approach: separation of concerns and versioned components.

Concepts are split into two categories:

1. **Critical for consistent behavior** — must be compatible forever to support old documents and cross-client collaboration.
2. **Local to the current application instance** — can change without maintaining identical behavior in previously supported cases.

SharedTree minimizes what falls into category 1 and keeps those items as simple and independent as practical. For example, if merge resolution logic needs an incompatible change, a new version of that logic can be authored and selected at runtime based on protocol version or schema.

Components are also organized to be replaceable incrementally. The tree read/edit API is built on cursors — a different API version can be developed and adopted alongside the old one. Changes to forest don't impact the API components; changes to the cursor API can be added without dropping the old one. Applications using SharedTree can adopt the same compatibility approach — schema APIs are designed to guide users into patterns that are robust even across many legacy schema versions.

## Data Model and Editing

When users edit documents, high-level semantic operations are encoded to support merges. This encoding must be deterministically applied by all clients, even those running different versions of SharedTree. Editing and merge logic must remain identical for compatibility — new behaviors can only be added, not changed.

SharedTree's data model subdivides this problem into **fields** (where collaborative edits interact) and **nodes** (which connect fields into a hierarchy and assign types). Nodes have schema defining their fields. There are a few kinds of nodes (e.g., objects, maps) and a few kinds of fields (e.g., `sequence`, `optional`), each providing different collaborative behaviors.

All editing is done through fields via the `field kind`. This packages editing logic — both API and merge policy — into minimal, versionable units. Because schema explicitly selects which field kinds to use, updating them is opt-in and follows the same deployment coordination used for other schema evolution.

The result is a tree alternating between fields and nodes — a bipartite tree. `simple-tree` abstracts fields to align with JavaScript conventions: object node fields become enumerable own properties; `sequence` fields are accessed via `array` nodes that behave like JavaScript arrays.

# Constraints

When users edit documents concurrently, two requirements must be balanced:

1. Both sets of edits should apply.
2. Applications can ensure required invariants are maintained across merges.

These are in tension: requiring (2) absolutely means sometimes discarding an edit (violating (1)); requiring (1) absolutely means adjusting edits that might violate invariants.

SharedTree's editing APIs make the default invariants clear. When those are insufficient, application authors can add **constraints** — additional preconditions that cause a transaction to be rejected (rather than merged) if it would violate an invariant due to concurrency. The most powerful constraint: reject the edit if any concurrent edit was sequenced before it. This ensures editing logic can always be authored confidently, even without concurrency expertise.

The all-concurrent-edit rejection constraint is broad. More specific constraints — scoped to a field or subtree — improve merge throughput while still enforcing invariants. Higher merge fidelity can also be achieved by adding new field kinds as needs arise, and those improvements benefit all SharedTree users.

> Note: the current implementation does not yet provide access to constraints, but this is planned.

# Sub-Trees

SharedTree is designed to enable applications to process different subtrees independently. Keeping invariants and operations local to a given subtree enables:

-   Fine-grained subtree constraints (reject concurrent edits to the same subtree)
-   Efficient, simple application logic for rendering and updating subtrees
-   Composable, reusable subtree handlers — a subtree handler can be thought of as a mini application, nestable in a larger one, and easy to integrate with tree-structured systems like [React](https://react.dev/) or the [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction)

Operations spanning multiple subtrees can be treated as operations at the level of their common parent and constrained accordingly.

---

**NOTE:** This is part of why SharedTree is a tree, not a graph. With a graph, a node can have multiple parents, making it hard to define invariants contextually. In a tree, each node has exactly one parent, so constraints and invariants can be applied at the subtree level. References to nodes for graph-like data are planned, but those referenced subtrees will not support the same kind of parent-driven constraints.

---

Current limitations of subtree isolation:

-   **Schema:** A schema identifier has the same meaning tree-wide. Embedding two versions of a sub-tree application at different locations with mismatched schema may not work. "Contextual schema" is planned to address this.
-   **Loading and summarization:** All subtrees are downloaded and summarized together. "Partial checkouts" are planned for loading; no plan yet for summarization.
-   **Op processing:** All clients receive and process all ops in the SharedTree.

# Stored and View Schema

Applications make assumptions about the data they work with. In SharedTree, documents carry a **stored schema** defining the structure and editing behaviors of their content. This is checked against the **view schema** — the types the application is programmed against.

- If they match: the application can work on the document as-is.
- If they don't match: the application must take corrective action — raise a compatibility error, upgrade the document schema, or adapt the content to a supported format.

Compatibility fixes can be composed in a subtree-local way, enabling a clean separation between compatibility handling and main application logic (see [SchemaVersioning](packages/dds/SchemaVersioning.md)).

Strong types from the view schema make it clear which invariants SharedTree guarantees (the document stays in schema) versus those the application must maintain. They also improve readability, maintainability, and guard against data corruption scenarios common in collaborative editing.

# Efficient Data Storage

Without careful design, performance could become a major limitation. A simple general-purpose tree implementation works for many applications, but SharedTree needs a way to add optimizations for specific high-performance cases — especially for fine-grained operations at the leaves, where node count is high relative to data size.

The approach is **Chunked Forest**: specialized tree representations that handle specific use cases without SharedTree overhead. The goal is an end-to-end fast path from ops/summaries to application view access, while keeping the standard tree abstractions always available for debugging and non-performance-critical code.

Specialized formats are needed at two levels:

1. **Serialized data** (ops and summaries) — Fluid's blob storage enables different tree parts to use different formats.
2. **In-memory representation (Forest)** — Chunked Forest delegates to chunks implementing a `Chunk` abstraction. Access is via cursors; specialized chunks can expose fast-path APIs via symbols.

Efficient encode/decode is enabled by co-owning both formats in Chunked Forest (allowing zero-copy for data arrays) and ref-counting chunks for lazy cloning and in-place mutation.

# Runtime Performance

## Application of Remote Edits vs Local Edit Creation

SharedTree prioritizes the cost of **applying remote edits** — a client that can't keep up with the remote edit rate cannot collaborate. Clients that fall behind benefit from batching; SharedTree is designed to enable this, though the runtime does not yet expose the edit backlog.

SharedTree also shifts cost toward **edit creation** where possible: the client producing an edit pays more, which reduces the edit rate and lowers the cost for remote clients. The resubmit flow (rebasing old ops) is one example.

## Eager vs Lazy

SharedTree eagerly computes things that are always needed or are cheap. Values that are only sometimes needed are computed lazily, reducing unnecessary work. Pre-caching on idle (after an invalidation) can be used when lazy latency becomes a problem, avoiding responsiveness penalties without the waste of always eagerly computing.

- **Eager example:** `editManager` resolves edits eagerly to maximize remote edit throughput.
- **Lazy example:** `simple-tree` nodes are created lazily, avoiding overhead for applications that only read part of the tree.

## Asymptotics

SharedTree performance scales with several dimensions:

-   **Tree depth:** Many costs scale linearly with depth (op size, time to apply, stack usage). Extreme depth is not an optimization priority, but amortization of depth-related costs across operations in the same subtree is supported.

-   **Total node count:** SharedTree is designed to eventually support trees that are not fully in memory. All core functionality (merge resolution, edit application, summarization, reading subsets) must be achievable with at most `O(log N)` overhead where N is total node count. Current implementations do not yet achieve this, but the design must not preclude future implementations that do.

-   **Sequence field length:** Long sequences are not yet an optimization priority, but the edit format ensures `O(log N)` editing and indexing is achievable. Current implementations (AnchorSet, simple-tree) may incur `O(N)` costs for now.

-   **Number of fields:** Same requirements as sequence field length, at least for map nodes.

-   **Schema size:** Scaling to very large schema is not a priority. Schema costs must be amortized over the session — ops and summaries should not copy the schema in typical use. Schema is assumed to always be practical to download and keep in memory. Schema-derived data should be eagerly evaluated and cached.
