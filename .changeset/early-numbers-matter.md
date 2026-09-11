---
"@fluidframework/tree": minor
"__section": tree
---
Add versioned schema compatibility snapshots for staged optional fields

Schema compatibility snapshots now support staged optional fields when `oldestSupportedClientVersion` is set to Fluid Framework 3.1 or newer. Older snapshot formats remain unchanged and report an actionable error when asked to encode unsupported schema features.
