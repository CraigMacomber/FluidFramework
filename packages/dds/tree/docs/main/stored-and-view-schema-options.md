# Stored and View Schema Options

This document covers where schemas can be stored and how they can be used — not the specifics of what schemas do. It describes what Fluid Tree needs from a schema system and the options that leaves open. See the [separate document](./stored-and-view-schema.md) for the specific approach currently being taken.

# Definitions

- **`stored data`:** Data stored in the Fluid container by the tree DDS.
- **`stored schema`:** Constraints that `stored data` is valid against, and that must be maintained when editing (including through conflicts) by the tree DDS itself. All editors must agree on this; changes must be sequenced as Fluid ops. Typically implemented by storing schema information (or references to immutable, publicly available schema) inside the tree DDS.
- **`view schema`:** Constraints an application wants data to conform with when reading/viewing. Different clients may have different view schema simultaneously (e.g., multiple apps sharing a document, or different app versions during rollout). How changes to view schema are staged varies by app.
- **`context`:** Location-specific information that adjusts validity constraints. For example, a trait may restrict the types or count of its children. Complex context-dependent schema (where the same node type has different rules in different locations) make merge-time schema maintenance difficult. Non-local context constraints (e.g., parametric types) are excluded initially and may be added later.

# The Design Space

## Where Stored Schema Can Be Stored

- Inline at the point of reference
- As stored data in the document
- Hard-coded into the SharedTree DDS (e.g., tree-not-DAG constraints)
- Injected via a SharedTree subclass or other Fluid configuration (schema shipped as code)
- In an external append-only schema repository referenced from any of the above

## Where Stored Schema Can Be Applied

- **At the root** (SharedTree, a subclass, or its configuration): applies rules, possibly recursively, from the root.
- **Declaratively on typed nodes:** Nodes in the tree are typed; schema can be applied based on node type. All nodes of the same type share the same schema — not contextual, but handles open polymorphism well (e.g., a child allowed to be anything in-schema for its type).
- **In other schema** (e.g., a parent schema applies rules to its children): enables contextual schema, where the same type may have different rules under different parents.

Note: schema can be referenced unambiguously even if some clients lack the schema code (e.g., referenced by hash or append-only namespace name). This creates implications for schema updates (e.g., one client inserts data using code-shipped schema that another client doesn't have). Options without this issue: inline schema, central repository (with availability caveats), and stored data.

# Options to Support

Many options exist, each with use cases. Long-term, basic support for all may make sense; a smaller initial subset can cover most use cases well.

Initial requirements:

- **Optional and incremental adoption.** All schema/constraint systems are opt-in and easy to add to existing applications.
- **Schema-on-read (Schematize).** Gives applications a clean interface to data, including validation and error handling. When view and stored schema differ, allows the app to function as well as possible — detecting and handling out-of-schema data on read and edit, as localized as the provided error handlers allow.
- **At least one schema-on-write option.** Supports at minimum type-based constraints.
- **Schema migration design patterns.** At least one good pattern per schema method that supports mixed-version rollouts and permanently supports old documents.

# Expected Usage Patterns

Most data will likely follow one of two approaches:

- **Pure schema-on-read:** No customization of stored schema.
- **Near-pure schema-on-write:** Using schema-on-read only to assist with migrations so view schema don't need to handle accumulating old stored formats. May additionally use schema-on-read to enforce invariants the stored schema system can't express (referential integrity, numeric ranges, application-level invariants).

A reasonable design pattern is to use schema-on-write for core document data and schema-on-read for extensible metadata — a good fit for multiple applications sharing a document with informal versioning and best-effort metadata interop.

# Misc Notes

## Schema DDS

The stored schema could live in its own DDS, especially useful if cross-DDS transactions are supported. The tree DDS could optionally be configured with a schema DDS for its stored schema, enabling sharing schema across documents. Even without a dedicated DDS, the code should be structured so a schema DDS could be extracted from it.

## TypeScript Typing

A [typebox](https://www.npmjs.com/package/@sinclair/typebox)-style embedded DSL for schema declaration can produce both compile-time types and runtime schema data, enabling schema-aware APIs without code generation. This could be extended to provide:

- A `SchemaRegistry` collecting both runtime and compile-time type data.
- Type-safe schema update APIs (updating stored schema returns a new, typed schema repository).
- Typed document loading/viewing (type-check that the view supports the expected stored schema, with strongly typed handles/adapters/reencoders for Schematize).

Regardless of TypeScript typing, stored schema can be checked against view schema to skip Schematize where possible. Schema supersetting can determine whether a schema is safe for reading but not writing.

## Reuse and Polymorphism

This document covers schema storage and usage, not the specifics of what schemas do. It describes what Fluid Tree needs from a schema system and the options that leaves open — not how to build the schema system itself.

## Ways to Update Existing Schema

- An op that relaxes a schema (all data valid under the old schema remains valid under the new) — e.g., adding optional fields, moving a required field into `mapFields`, adding a type to a field.
- Atomically modifying schema and updating data (SQL `ALTER TABLE`–style), applying a change to all nodes of a specific type. Does not work well with partial views.
