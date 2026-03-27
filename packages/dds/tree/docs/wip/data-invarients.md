# Maintaining Data Invariants in SharedTrees

Applications (or libraries) may have invariants they need to maintain for data stored in SharedTrees.

There are a variety of different mechanisms through which this is accomplished, and a variety of scenarios they are robust against.

## Scenarios which can violate invariants

- Attempted insertion of malformed data
  - By current version of application
  - By a past version of the application
  - By a future version of the application
  - By some other well behaved application
  - By a hostile client
  - By AI...

## Schema

TODO:

- Schema enforcement (stored)
- merge robustness
- constraints

Future:

- mark schema which have non-declarativly enforced invariants to block AI edits if they don't understand them
- add more ways to declaratively state invariants:
  - more restrictive field kinds and/or node kinds
  - automatic or enforced constraints on stored schema.
  - way to opt edits into claiming to enforce invatients (so others can be rejected if schema is annotated). Magic/secret tokens which mush match?
  - declarative (or optionally imperative) patterns to enforce on insert/edit on local state.
    - combine with auto or required constraints to make invarients robust.

Schema evolution:

- Having a clean interface with robust invariants is nice.
- Sometimes this requires fixups.
- Having lazy fixup layer which can correct arbitrary invariant violations, including schema upgrades, enforcing new invariants etc.
  - Enable declarative subset of this to be encoded as metadata in document to empower view-schemaless editors (like some AI cases)
  - Allow imperative form in AI sandbox (or apply before sending data in?).

Idea:
put lazy fixups in local branch: flush them when they don't commute with local edit. Drop them (then gets recreated) if they become conflicted due to remote edit.
