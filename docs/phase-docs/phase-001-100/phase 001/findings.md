# Phase 001 — Findings

## Provenance

Authoritative source:

- create-scaffold-hbar 0.4.0
- hedera-dev/scaffold-hbar
- templates/hedera-demo
- source anchor 64fc32d2467c7134e0e6dc121d5fd878c9f39ea5
- nextjs-app
- solidityFramework none
- Yarn 3.2.3

GitHub platform baseline:

ec8db4b7120fda68f7e45a3badb8c567bc137dc3

This predates Phase 001 and is not a Phase 001 implementation anchor.

## Healthy imported baseline

Observed before Proof Anchor cleanup:

- corepack enable PASS
- yarn install --immutable PASS
- yarn lint PASS
- yarn next:check-types PASS
- yarn next:build PASS
- 18 production routes

Inherited non-fatal warnings included peer dependency warnings and the DaisyUI / Google Fonts CSS @import ordering warning.

## Cleanup findings

Phase 001 removed inherited:

- Proof Wall / HTS demo pages and components
- token/topic/badge demo hooks and services
- inherited Hedera demo API routes
- visible wallet UI
- wallet/provider composition
- demo backend helpers
- contract frontend stubs
- dead wallet/EVM dependencies
- dead Scaffold-HBAR UI packages

Compiler feedback was used to identify residual coupling. Dead helpers were removed rather than restoring dependencies solely to satisfy obsolete code.

`@hiero-ledger/sdk` was retained because later bounded phases require server-side HCS integration.

## Generated-state finding

After deleting routes, stale `.next` route types briefly caused typecheck failures.

Removing:

- packages/nextjs/.next
- packages/nextjs/tsconfig.tsbuildinfo

restored accurate standalone typechecking.

This was generated-state contamination, not a source defect.

## Checkpoint A final gates

Observed after cleanup:

- yarn next:check-types PASS
- yarn lint PASS
- yarn next:build PASS
- git diff --check PASS

Final production routes:

- /
- /_not-found

The inherited CSS @import ordering warning remains non-fatal.

## Preserved architecture

Phase 001 preserves:

artifact identity != storage identity

admission != consensus

consensus != readback

readback != verification

unavailable != mismatch

Future canonical v1 fields remain limited to:

schema
digest_profile
artifact_digest
storage_scheme
storage_ref
content_length
