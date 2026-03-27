# Move Composition

A move in a sequence field is represented by a pair of marks: a `MoveOut` at the node's original location and a `MoveIn` at the destination. Each move pair is identified by a `ChangeAtomId`.

When composing a series of moves of the same node, intermediate move steps are preserved (cell IDs change at intermediate locations, so this information must be recorded). Composing move1 (A→B) with move2 (B→C) produces: `MoveOut1` at A, `MoveIn2` at C, and `AttachAndDetach(MoveIn1, MoveOut2)` at B. The resulting composite change contains a single **move chain** consisting of move1 and move2 as **move atoms**. A chain may contain a single atom; composing chains can produce arbitrarily long chains.

For efficient chain traversal without visiting all elements, each chain with more than one atom has its `finalEndpoint` field set on both endpoints (the first `MoveOut` and the last `MoveIn`) to the ID of the other endpoint.

## Composing Two Chains at a Pivot

When composing a chain ending at B with a chain starting at B, B is the **pivot**. Each chain has an **inner endpoint** at B and an **outer endpoint** at the other end.

In the common case, chains are recognized as moving the same node when inner endpoints are encountered. Each inner endpoint stores the ID of its outer endpoint. `MoveEffect.endpoint` is set on each outer endpoint to the other outer endpoint. When each outer endpoint is encountered, its `finalEndpoint` is updated to `MoveEffect.endpoint` — unless `MoveEffect.truncatedEndpoint` is also defined (see below).

## Truncated Endpoints

A special case arises when the outer endpoint of one chain coincides with an intermediate move location in the other chain. For example: chain 1 is move1 (A→B); chain 2 consists of move2 (B→A) and move3 (B→C). The composed move endpoints are at the outer endpoints (A and C), but the starting endpoint is chain 2's `MoveOut` (move3) at A, not chain 1's outer endpoint (move1's `MoveOut` at A). This follows from the rules for composing attach/detach marks at the same cell.

The composed chain is conceptually truncated from `A -move1-> B -move2-> A -move3-> C` to `A -move3-> C`. Terminology:
- **Redundant endpoint:** the `MoveOut` from move1 (the one being dropped)
- **Truncated endpoint:** the `MoveOut` from move3 (the one that replaces it)
- **Ordinary endpoint:** the `MoveIn` from move3

This scenario is detected when processing the redundant and truncated endpoint locations. `MoveEffect.truncatedEndpointForInner` is set for the inner endpoint from the redundant chain to the truncated endpoint's ID. If the ordinary endpoint is already known (i.e., the pivot was already processed and `MoveEffect.endpoint` is set for the redundant endpoint), `MoveEffect.truncatedEndpoint` is also set on the ordinary endpoint.

When processing the pivot: if `MoveEffect.truncatedEndpoint` is defined for an inner endpoint, its value is copied to `MoveEffect.truncatedEndpoint` on the corresponding outer endpoint (the ordinary endpoint).

`truncatedEndpoint` on the ordinary endpoint may be set at two different points during processing. This is required to ensure composition completes in a single amend pass regardless of whether the pivot or the truncation point is processed first.
