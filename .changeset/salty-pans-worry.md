---
"@fluidframework/container-definitions": minor
"@fluidframework/container-runtime": minor
"__section": fix
---

GC timers are now cancelled when a container closes, not just when it is disposed

Adds an optional `notifyClosed()` hook to `IRuntime` that `Container` calls on close.
`ContainerRuntime` implements it by cancelling all GC timers (session expiry and unreferenced-node timers)
without clearing tracked state.

This prevents the timers from causing memory leaks after a container is closed but not disposed.
In Node.js environments this prevents the timers from keeping the event loop alive until `dispose()`.
This can avoid reduces the need for mocha's --exit in tests which create containers which are closed but not disposed.

With this change, disposing of closed containers is less important.
Such disposal now mainly reduces the size of memory leaks if references to the container are leaked.
