# Schema 2

Proposal for changes to the [schema system](./stored-and-view-schema.md).

## Status

Mostly implemented, with significant post-implementation changes:

1. `Struct` was renamed to `Object`.
2. The new API that leveraged this design to avoid free functions and symbols was implemented but not adopted as the package API, so its use of reserved field names no longer applies.
3. A migration away from reserved field names is in progress. The future of custom field names (distinct from field keys) is unclear, as the new Proxy-based API does not clearly separate where field keys vs. names would be used.

## Motivation

The current schema system has several issues:

1. Cluttered with rarely-used features (`extraLocalFields`, `extraGlobalFields`, global fields, values — unused in almost all schema).
2. Unclear to users which features to use and why they exist.
3. Global value fields and extra global fields interact ambiguously (are value fields required or implicitly optional under `extraGlobalFields`?).
4. Extra local fields can produce TypeScript types that [can't be modeled statically](https://www.typescriptlang.org/play?noPropertyAccessFromIndexSignature=true&ts=4.5.5#code/PTAEBUCcE9QFwPagLYEMDWBTUr7QA7YDuAFppNgGYCWmANgCagBEqzo1AzqJ3JNQDsA5gBocAphV44KoAQFdkAI3IAuAFDqQoACIJM3AQjigiCSOnVwC2AMrVk+OtgC8oAN7qAkAG0ssQR4+QSEAXVVQf1BMAA84TAluVnYAfiD+YVAIhWVyAG51AF8CrTA9AzljU3N0DWtCUFtg4U4AeTgySHASVAEAHnBouISGbl4MoQA+UDd-BEoPUD9MAIFQAApBgB90kIBKcMiVofjEiFA0gUwAN3Iso9hiqxtG5qE2jvJu3oAmAZORmM3tM3ABRGIAYzo8gYmD64xCYnAkxK2gAQsYSPAyJxsKhZAAreTSAAGCOEJOeDVsM1eEw+nW--SqSmk1EY6kE8UglFQELsDicmA5ni8qAi5KEBV8UUCnEOckUKkgBSepV0IsqJnFkoY0oEsvlisayucau8mt2wl1y1WjSNOVN5pKEIQAmkAH0GKg4KgAIwReyOZy09w4CLMGLsJ7hyMmGNx1A-ZPu1yLb3Z5hiJQRACsoCe2gAAnBOABaWKECFwLuQSDmUyDzL504meqYdT56Ox-MAZjLqYrGe9jebYDbne7mF7-cHkGHEaEoDHCQnNmnEdnxYALEuVenMywc7Ws9Bc7rNF4gA) — the schema only constrains fields not in the explicit list.
5. Requires symbols to avoid field name collisions in many APIs, which confuses users unfamiliar with JavaScript Symbols.
6. Supporting all features on all nodes complicates APIs and the schema-aware API in particular.
7. Extra fields require Proxy-based implementations for the desired TypeScript APIs.
8. Having both global and local fields adds complexity, especially in schema and path storage (where symbols can't be used).
9. Supporting `extraLocalFields`/`extraGlobalFields` with a JavaScript object-like API requires a Proxy, adding overhead and maintenance burden.

## Proposal

Replace the single node kind with four distinct kinds, each covering a subset of existing functionality:

1. **Leaf Node:** holds a value, no children. `undefined` is not a valid value — an empty Object node can substitute if needed.
2. **Object Node:** finite set of named fields (key + field schema). Formerly "Struct".
3. **Map Node:** maps all string keys to fields. All possible fields share a single field schema (like `extraLocalFields`). That schema must allow empty fields (optional or sequence, not value) — otherwise the tree would need an infinite number of non-empty fields to be in schema.
4. **Field Node:** has a single unnamed field (empty field key). Implicitly unwraps to the field in the flex tree API. Provides the functionality of nodes with a primary/empty field key, used for "array nodes".

Each kind gets its own declaration API (similar to `SchemaBuilder.object`/`SchemaBuilder.primitive`, extended to four options) and its own flex tree access API, all extending a common generic traversal API. This mirrors how field kinds work.

### Custom Field Names for Object Nodes

Object Nodes support optional custom field names — a string used in schema-aware APIs that differs from the field's storage key. This enables renaming a field in code without changing how data is persisted. Benefits:

- **App maintainability:** Fields can be renamed freely in code without breaking documents.
- **Framework collision safety:** Fields whose keys would collide with framework API names can be renamed at the view layer; framework updates that introduce new reserved names only require a view-layer rename.
- **No symbol requirement:** Object node schema-aware APIs can use plain strings without symbols for collision avoidance.

A fallback method to look up fields by key handles generic/schema-agnostic code.

Custom field names also reduce the need for global field keys. The other use case for global keys (the same field across multiple schema) can be addressed by using a shared child node or duplicating the field declaration.

Map nodes expose a JavaScript `Map`-like API (not object-like), avoiding the need for a Proxy and the custom field name machinery.

### Annotation Pattern

`ExtraGlobalFields` existed to let apps opt schema into allowing third-party "annotation" subtrees on nodes — useful when multiple apps or versions share a document and want to attach extra data without interfering with each other.

However, `ExtraGlobalFields` is not a complete solution. The real challenge is that different apps have different view schema with different known annotation sets. The stored/view schema model already handles this: each app can add its annotations as optional fields in the stored schema.

What's missing is how apps should handle opening documents with unrecognized stored fields. This can be addressed by supporting one or both of:

1. **Field-level "unknown field" handling policy.** Options for schema (stored and view) to declare how apps unaware of a field should treat the containing type:
   - Read+write, preserve unknown fields where possible
   - Read+write, clear unknown fields on mutation
   - Read-only
   - Treat as out of schema / unsupported

2. **Node-level "allow unrecognized fields" declaration.** View schema only. Generates an API for enumerating unexpected fields.

Additionally, an API on Object nodes could enumerate all unrecognized fields. This differs from the old extra fields support in intent and performance characteristics: extra local fields were designed for arbitrary fields without stored schema bloat (adding/removing N differently-keyed extra fields made no schema changes), whereas this feature targets fields one app knows about that others don't. Any required stored schema changes can be performed implicitly by Schematize during stored/view schema comparison, without exposing stored schema editing to app code.

## Schedule

### Near Term

**Workstream 1**
1. (Done) Add the 4 node type builders to `SchemaBuilder`. Use existing schema features; limit which each can use (as already done for primitives).
2. (Done) Update all schema to use the new API.
3. (Done) Remove old schema builder API.
4. Capture which node kind a view schema belongs to in the data and types produced by the schema builder.

**Workstream 2**
1. (Done) Replace global field key usages with string constants.
2. (Done) Implement alternative design for root field.
3. (Done) Remove support for global fields.
4. (Done) Clean up code now that only local fields exist (rename/remove objects that separated local and global).

**Workstream 3**
1. (Done) Adjust stored schema encoding/validation to make having both value, fields, and extra local fields on one type invalid.
2. Simplify code based on that assumption (e.g., schema compatibility comparisons).

### Mid Term

- Add support for custom field names for Object node fields.
- (Done) Update editable tree and schema-aware APIs to leverage node kinds.
- (Done) Define base node API and implementation; extend for each kind.
- (Done) Remove symbol usage from editable tree APIs.
- (Done) Remove Proxy usage for nodes: dynamically generate custom Object node subclasses from schema.
- (Done) Remove `undefined` values from Leaf nodes.

### Longer Term

- Full annotation pattern support.
- More unified Nodes vs. Fields: this design already provides clear answers (Value Field for node-as-field; Field Node for field-as-node). If desired, the schema language could be extended to handle these implicitly. Generic types could remove the need for explicit identifiers on Field Nodes. Further out, the alternating map-like/sequence-like data model could be revisited — this design moves closer to a unified abstraction, though many details (lifetime/identity, paths, generic access APIs, tree storage) remain to be worked out.
