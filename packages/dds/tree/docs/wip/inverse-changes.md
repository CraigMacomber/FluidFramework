# Inverse Changes

This document is a "[brain dump](https://www.merriam-webster.com/dictionary/brain%20dump)" on inverse changes and undo. It is not a final design but a starting point for further work and to mitigate information loss.

**Terminology:** "client" refers to the issuer of a change, "peer" to the receiver, and "clients" to both. This distinguishes work done before sending a change to the Fluid service ("client work") from work done after receiving one ("peer work").

## What are Inverse Changes?

An inverse change undoes the effect of a prior change. Applying a change and its inverse in sequence leaves the document in the same state as before the original.

Inverse changes are generated in two cases:
-   When an end user performs an undo operation.
-   When rebasing a changeset based on a prior change that has since been rebased.

## The Case of Rebase-Induced Inverses

In a live collaboration session, changes are sent immediately and are unaffected by rebasing. In an asynchronous session, the over-the-wire changes may result from rebasing, but this doesn't imply they contain inverse changes: while rebasing can require producing inverse changes, those inverses are always rebased _over_ rather than included in the rebased change. At most, a change rebased over an inverse may accumulate information about that inverse (e.g., tombstones), but the inverses themselves never appear in the rebased output.

The needs of our system for rebase-induced inverses are entirely subsumed by the needs of undo. The remainder of this document focuses on undo, noting rebase-induced inverses where they deserve special consideration.

## Tip Undo vs. Collaborative Undo

The traditional undo model is an undo stack. When a user edits, an inverse is pushed to the stack; when undoing, the stack is popped and the change applied. This works because the current state is always the state the top inverse should apply to — the "tip" change is what needs undoing. We call these "tip undo" systems.

Collaborative applications introduce complicating factors:

1. The local user's last change may not be the most recent, since other users can contribute changes — even without concurrency.
2. Concurrency means a client wishing to undo a change cannot know all changes applied between the target and its inverse.
3. The local user's change may have been rebased before being applied, so the matching undo must account for that rebasing.
4. Concurrency again means the undo issuer may not know all changes sequenced before the original if they don't wait for sequencing.

We call systems that handle these constraints "collaborative undo" systems.

## Bird's Eye View

A collaborative undo system must:

1. Produce an inverse change for the change to be undone.
2. Reconcile this inverse with edits that occurred since the undone change.
3. Update the reconciled inverse in the face of concurrent changes.
4. Apply the updated inverse to the current document state.

Design considerations:
-   Whether undo semantics are guaranteed
-   Whether the undo issuer can be starved by peer edits
-   Size of normal (non-undo) changes over the wire
-   Size of undo changes over the wire
-   Local data the issuer needs to issue an undo
-   Local data a peer needs to apply an undo
-   Whether undo can be issued without network requests
-   Whether peers can apply undo without network requests

These vary by **undo window** — how far back operations should be undoable. An application can define this as: number of local edits per client, number of edits across all clients, a time window, a maximum memory buffer, or some combination.

Key scenarios for a given application profile:
-   Undoing a change not yet sequenced
-   Undoing a sequenced change still in the collaboration window
-   Undoing a change outside the collaboration window

Designing the system requires answering:

1. What undo semantics should be supported?
2. What data is needed to compute undo?
3. How is that data sourced?
4. How are the needed changes computed?
5. How are concurrency challenges addressed?

## Undo Semantics

### Possible Semantics: Rewind vs. Retroactive vs. Patch

When interim changes exist between the undone change and the current tip, we have three options for what the document state after undo should be:

1. The state before the undone operation. → **Rewind Undo**: discards interim changes along with the original.

2. The result of applying the inverse to the current state. → **Patch Undo**: undoes only still-undoable parts of the original without recovering effects of interim changes that failed due to the original. For example, if edit B failed because of edit A, undoing A with patch undo would _not_ restore B's effects.

3. The same as if the undone operation had never been performed (but interim operations were). → **Retroactive Undo**: undoes all effects of the original, including its effects on interim edits. Using the same example, undoing A would restore B's effects.

For both Patch and Retroactive Undo, a change concurrent to and sequenced after both the original and its inverse should behave as if neither was ever issued — otherwise additional "undo updates" would be needed.

We could also consider pruning the inverse so it only undoes changes that no interim change depends on. For example, if the original inserted a subtree, the inverse would only remove it if no interim changes operated within that subtree.

### Which Semantics to Support

Retroactive undo is closest in spirit to the commanding system, which would roll back interim changes and the undone change, then re-run commands for interim edits.

We currently aim to support all proposed semantics, letting application authors choose. Practically, reconciling inverse and interim changes must support rebasing an inverse over interim changes as well as rebasing interim changes over the inverse. The relevant data for both operations must therefore be available.

## Relevant Data

Computing undo requires:
-   The original change to be undone
-   All interim changes sequenced since that change
-   Any document state to restore that cannot be derived from the original or interim changes

This last point is critical. Changes can be destructive:
-   Setting a node value loses the prior value.
-   Deleting a subtree loses its contents.

Such data cannot be derived from the changeset alone. We call this additional needed information **repair data**.

## Sourcing Relevant Data

Accessing past edits is already required for rebasing, so that's not a problem. The challenge is maintaining access to **repair data**.

Any requirement for peers to maintain local data means snapshots must include adequate data for new peers to rebuild that state.

### Repair Data in Edits

Some DDSes include repair data directly in each changeset:
-   Each set-value operation carries the overwritten value.
-   Each remove operation carries the removed subtree contents.

This doesn't directly apply to SharedTree: a move concurrent with and sequenced before a remove may move a subtree under the removed region. The remove's repair data wouldn't include that moved subtree. This could be resolved by including moved subtree contents in move operations, but that makes moves more expensive.

Even without moves, this approach bloats normal operations with repair data that may never be used, increasing history size and service overhead.

### Repair Data Cache

Clients could maintain a cache of repair data for the extent of their undo window:
-   The value overwritten by each set-value operation
-   The subtree removed by each remove operation
-   The subtree moved by each move operation

This data must be maintained for the most rebased version of each edit to capture complete impact (as in the concurrent-move-into-removed-subtree scenario). Depending on application architecture, retaining old document versions in a persistent data structure and computing repair data on demand may be more efficient.

### Checkout

A client could use the checkout mechanism to fetch a document version at the relevant historical point, potentially checking out an old summary and applying ops. This would be asynchronous.

### Document State Service

A document state history service could provide the exact state for the relevant document region, reducing download size and client-side processing versus the checkout approach.

### Hybrid Solution

Clients could keep repair data locally for an arbitrary sub-window (up to the undo window) and fall back to a service for data outside that window.

## Computing Undo Changes

An undo produces a Delta applicable to the current tip state. The process moves from an abstract representation ("undo change foo") to a concrete one ("set node X value to 42") in three steps:

1. Derive an inverse changeset from the changeset being undone.
2. Reconcile the inverse with interim changes to produce an undo change.
3. Derive a Delta from the undo change.

The inverse in step 1 can be concrete (containing repair data) or abstract (e.g., "revert node X to the revision before change foo"). See [Late Repair Data Concretization](#late-repair-data-concretization) for the abstract approach. The following sections assume a concrete inverse.

### Deriving an Inverse Changeset

TODO: Expand on...

-   Set Value -> Set Value
-   Insert -> Remove
-   Remove -> Revive
-   Revive -> Remove
-   MoveOut + MoveIn -> Return + MoveOut
-   Return + MoveOut -> MoveOut + Return
-   MoveOut + Return -> Return + MoveOut
-   Forward -> Unforward
-   Scorch -> Heal

### Reconciling Inverse and Interim Changes

After producing the inverse, it must be reconciled with interim changes. Each interim change could be concurrent with the original or concurrent with the inverse.

For each set of [undo semantics](#undo-semantics), reconciliation composes:

-   **Rewind Undo:**
    -   The inverse of each interim change (in reverse order)
    -   The inverse of the original change
-   **Patch Undo:**
    -   The inverse change rebased over the interim changes
-   **Retroactive Undo:**
    -   The inverse of each interim change (in reverse order)
    -   The inverse of the original change
    -   The interim changes rebased over the inverse of the original

### Deriving a Delta

TODO: expand on...

-   Revive -> Insert
-   Return -> MoveIn
-   Unforward -> Nil
-   Heal -> Nil

## Addressing Concurrency

The previous section assumed away concurrency factors #2 and #4 from [Tip Undo vs. Collaborative Undo](#tip-undo-vs-collaborative-undo). How much these matter depends on how work is divided between the undo issuer and the peers.

We consider:

1. Maximally proactive issuer: the issuer performs as much work as possible
2. Maximally inactive issuer: the issuer performs no work
3. A middle ground

### Maximally Proactive Issuer

If the issuer performs as much computation as possible, three concurrency cases require handling:

1. Changes concurrent to and sequenced _before_ the original change and its undo
2. Interim changes sequenced after the original but concurrent to and sequenced _before_ the undo
3. Changes concurrent to and sequenced _after_ both the original and its undo

#### Case #1: Changes Concurrent to and Sequenced Before the Original

This arises when undoing an unsequenced change: the issuer is undoing a version of the original that may not be final.

Four strategies:

##### Delaying

Only allow undoing sequenced edits. Hidden from users by applying the undo locally (recomputing as sequenced changes arrive) and only sending it once the original is received from the service.

##### Looser Semantics

The issuer computes the undo based on known changes; peers accept as-is. Semantics are not guaranteed. Acceptable in live collaboration at human speed where bad merges are unlikely, but problematic when undo semantics must be reliable, edits are machine-generated, or async collaboration involves arbitrarily large changes.

##### Validation by Peer

The issuer sends based on known changes; peers reject if they detect unaccounted-for concurrent changes and force a retry. On retry, the issuer is guaranteed to know all changes preceding the original, so this case cannot cause indefinite blocking.

##### Recomputation by Peer

Peers receiving the undo recompute the inverse based on the now-known sequencing order.

#### Case #2: Changes Sequenced After the Original But Concurrent to and Sequenced Before the Undo

This is analogous to standard concurrency handling: the undo change must be reconciled per the [Reconciling Inverse and Interim Changes](#reconciling-inverse-and-interim-changes) process. This is important because the reconciliation may require computing inverses of new changes, which requires adequate repair data.

Three alternatives:

##### Looser Semantics

Same as Case #1 — the issuer sends what it knows; peers accept as-is.

##### Validation by Peer

The issuer sends based on known changes; peers reject if they detect unaccounted-for concurrent changes before the undo. On retry, the issuer is _not_ guaranteed to know all relevant changes — a client can get stuck repeatedly retrying.

##### Update by Peer

Peers update the undo change as appropriate. Peers must have access to repair data within the collaboration window.

#### Case #3: Changes Concurrent to and Sequenced After Both the Original and Undo

Such changes must be rebased over the original, interim changes, and the undo. Peers should handle this as part of normal rebasing without additional data.

However, we must ensure that a change rebased over an inverse, after having been rebased over the original, correctly undoes the effect of that prior rebasing. For example, if the original was a slice-remove and the rebased change was a commuting insert, the final result should be unaffected by the slice-remove. Inverse changes must be able to counter their target's effects on subsequently sequenced changes.

#### Data Sourcing Needs

The undo issuer needs, as far back as the undo window extends:
-   The original change (in its most rebased form) and its repair data
-   All interim changes and their repair data

In designs where peers accept the undo as-is (Looser Semantics for Cases #1 and #2), peers need no additional data.

In designs where peers reject stale undos (Validation by Peer for Cases #1 and #2), peers only need the reference sequence number, which the Fluid service provides.

In designs where peers recompute or update the undo (Recomputation by Peer for Case #1, Update by Peer for Case #2), peers need, as far back as the collaboration window extends:
-   Changes and their repair data

#### Data Communication Needs

The issuing client may need to communicate repair data to peers. Since this could be arbitrarily large (O(document size)), options include:

##### Inlined Repair Data

Inline all required repair data in the changeset sent over the wire.

##### Reference Newly Uploaded Blobs

Upload repair data to new blobs and include blob references in the changeset.

##### Reference Document State History Query Result Blobs

Query a document state history service for repair data and include references to the returned blobs.

##### Document State History Query

Include query information for peers to send to a document state history service.

##### Abstract Repair Data Description

Include a precise characterization of what repair data is needed (but not the data itself). Peers obtain it via local cache (synchronous), document state history service (asynchronous), or a mix.

This is related to the [Late Repair Data Concretization](#late-repair-data-concretization) approach. It's an open question whether there is a meaningful incentive to adopt one over the other.

##### Reference Insert Blobs

Include references to the original insert blobs containing the data to be repaired. Without a history service, the issuer may need to preserve edit information for arbitrarily old edits.

##### Hybrid

The above are not mutually exclusive. For example, it may make sense to inline small repair data.

### Maximally Inactive Issuer

The issuer simply sends the ID of the change to undo. This sidesteps the issuer's concurrency issues but shifts all work to peers and introduces distributed systems challenges.

Note: this doesn't reduce the issuing client's data needs — as a peer, it will perform the work anyway upon receiving the op.

Peers need, as far back as the undo window extends:
-   The original change (in its most rebased form) and its repair data
-   All interim changes and their repair data

Unlike the proactive issuer case, the relevant window is the _union_ of all peers' undo windows. This is non-trivial:
-   Determining this union may require distributed consensus in the general case.
-   A single client with a large undo window can increase data requirements for all peers, even peers that don't support undo, don't make edits, or don't support edits at all.

These issues may be addressable by assuming an infinite undo window and relying on a document state history service.

### A Middle Ground

A middle ground might have each client maintain data as far back as its own undo window and perform just enough computation that a peer with data back to the collaboration window could complete the rest. However, distinguishing undo-window edits from collaboration-window edits may not be something the Fluid service supports and may not be generally solvable.

## Design Proposals

### General Design Goals

1. Allow applications not to incur computational costs for features they don't use.
2. When possible, put computational burden on clients rather than the broadcasting service.
3. When possible, put computational burden on the specific client that wants a feature rather than all peers.
4. Avoid designs that yield undefined merge semantics.
5. Avoid designs that can leave a client stuck repeatedly failing to accomplish something.
6. Avoid bloating edit history with redundant data.
7. Avoid uploading redundant data.
8. Avoid requiring peers to asynchronously fetch data to process incoming changesets.

How these goals apply:

-   Goals #1 and #3 favor a [maximally proactive issuer](#maximally-proactive-issuer) over a [maximally inactive](#maximally-inactive-issuer) one.
-   Goals #2 and #6 favor maintaining repair data locally or fetching from a service over inlining in normal or undo edits.
-   Goal #4 favors peer validation/computation/update over loose semantics.
-   Goal #5 favors peer update over peer validation for [case #2](#case-2-changes-sequenced-after-the-original-but-concurrent-to-and-sequenced-before-the-undo) (to avoid indefinite retries).
-   Goal #7 favors a document state history service over having the issuer upload new blobs.
-   Goal #8 favors inlining repair data or pre-fetching it over on-the-fly peer fetching — which conflicts with Goals #2 and #6.
-   Goals #2 and #8 favor peers maintaining repair data locally over fetching it on demand.

### Design A: Sending Concrete Undos

Undo ops sent over the wire describe the specific document changes to accomplish the undo, similar to normal changesets.

-   No preemptive repair data in all changesets.
-   Undo issuers need edits and repair data as far back as the undo window. They can maintain a local cache or fetch from a document history server.
-   The over-the-wire changeset can represent repair data as: query details for peers to fetch from a history service, direct blob references, or inlined (if small enough).
-   Peers can asynchronously fetch relevant repair data upon receiving edits (not during processing).
-   When receiving an undo, peers may recompute or update the changeset for concurrency. They already cache edit data for the collaboration window. For repair data, they can maintain a local cache or fetch from a history server.

Notable characteristics:
-   Applications can opt out of undo on a per-document basis, paying no overhead elsewhere.
-   In applications where undo is restricted to the current session, non-editing participants only need repair data back to the collaboration window.
-   Can work without a document state history service if clients maintain relevant data locally (see [Stepping Stones](#stepping-stones)).

#### Stepping Stones

Short-term shortcuts to support undo earlier:
-   Force issuers to locally store edit and repair data back to the undo window.
-   Have peers reject undo changes if concurrency issues arise.
-   Inline all repair data in changesets.

These simplify the format and reduce dependencies on services that don't yet exist. In the medium term, peers can store edit and repair data back to the collaboration window; summaries would need to include this, or a history server could provide it when peers join.

### Design B: Sending Abstract Undos

Undo ops describe only _which_ change should be undone. All computation of the resulting document changes is left to the receiver.

-   No preemptive repair data in changesets.
-   Issuers send an op containing only the ID of the change to undo.
-   Peers asynchronously fetch relevant repair and edit data from a document history server and compute the undo changeset locally.

Notable characteristics:
-   Applications can opt out of undo on a per-document basis.
-   As long as any client may require undo for a document, the history server must provide the relevant information.
-   This design is entirely predicated on the existence of such a service.

## Misc

### On Broadcast Blob Attachment

There may be opportunities to spare peers the extra network fetch for repair data. The service could automatically attach/inline required blobs containing repair data for prior edits that have fallen outside the collaboration window.

### Late Repair Data Concretization

When using repair data, we may fetch it only to find it's not needed:
-   The reconciliation process may make some repair data irrelevant (e.g., fetching a removed subtree to produce a revive mark, then rebasing that revive over a remove of an ancestor).
-   Other edits received alongside the undo may make the repair data irrelevant when computing the composed Delta.

Instead of maximally concrete inverse changes, we could make them maximally abstract (no repair data), fetching repair data only during Delta conversion — via local cache (synchronous), history service (asynchronous), or a mix.

**Pros:**
-   Avoids expensive repair data fetching when it turns out to be unnecessary.
-   Smaller over-the-wire undo changesets, especially when restoration data would otherwise be inlined.

**Cons:**
-   Shifts repair data access burden to peers with all the challenges that implies (see [Maximally Inactive Issuer](#maximally-inactive-issuer)).
-   Rebase, inverse, and compose algorithms for abstract changesets (without repair data) may be non-trivial and cause undesirable changeset bloat. This is an open problem.

### Asynchronous Change Processing

Any scheme using blobs or independently fetched repair data requires peers to fetch data before applying incoming changesets. The Fluid runtime does not currently support this, but it is needed in the more general case of large inserts.

### Partial Checkouts

Partial checkouts don't fundamentally change the requirements: an issuer or peer may need to fetch repair data from the service for edits that fell outside their checked-out subtree. This mirrors normal edit application under partial checkouts.

### Undo Recognition

When a user's actions effectively undo their prior changes, it may make sense to automatically interpret those actions as an undo — reducing the chance the user is surprised by subtle differences. For example, moving nodes and moving them back differs from moving and undoing the first move: the former leaves concurrent inserts at the range extremities; the latter doesn't. Such policy should be managed by the application entirely outside (atop) the undo system.

### No Data Need Case

Repair data is implicitly available to all clients when all changes that last contributed state to portions being removed or overwritten are still within the collaboration window. In practice this is rare, as collaboration windows tend to be much shorter than document content lifetimes.
