# Phase 002 — Findings

## Status

Implementation in progress.

## Base

Phase 002 begins from sealed Phase 001 main:

`7b8af06f8899f171eca7e84ef718e898139d856b`

## Frozen decisions

Digest profile:

`sha256-bytes/v1`

Proof schema:

`hbar-proof-anchor/v1`

Canonical fields:

- schema
- digest_profile
- artifact_digest
- storage_scheme
- storage_ref
- content_length

Storage scheme:

`ipfs`

## Findings log

Implementation findings, test evidence, dependency decisions, canonicalization observations, and discovered failure cases are recorded here as Phase 002 proceeds.

## Final gates

Pending implementation.

## Pre-implementation governance additions

The real bounty repository established repository-local development reporting before Phase 002 production implementation.

Added:

- `docs/development-reports/README.md`
- `docs/development-reports/2026-09-21.md`
- `scripts/audit/audit_development_report_2026_09_21.sh`

The report audit passed before protocol implementation began.

This is additional repository governance beyond the original practice implementation path.

## Slice 001 — Digest and proof core

Implemented:

- `packages/nextjs/utils/proof-anchor/digest.ts`
- `packages/nextjs/utils/proof-anchor/proof.ts`
- `packages/nextjs/tests/proof-anchor/digest.test.ts`
- `packages/nextjs/tests/proof-anchor/proof.test.ts`

Dependencies added:

- `@noble/hashes@1.8.0`
- `tsx@4.20.6` as a development dependency

### Digest core

Implemented:

- fixed digest profile `sha256-bytes/v1`
- SHA-256 over exact `Uint8Array` bytes
- incremental `ArtifactHasher`
- exact observed byte counting
- lowercase hexadecimal digest output
- rejection of hasher reuse after finalization

Known-answer vectors cover:

- empty bytes
- ASCII `abc`

Additional tests prove:

- digest invariance across chunk boundaries
- embedded NUL and arbitrary byte values are hashed without text reinterpretation
- incremental byte count matches exact artifact length

### Proof model

Implemented exact six-field `hbar-proof-anchor/v1` validation:

- `schema`
- `digest_profile`
- `artifact_digest`
- `storage_scheme`
- `storage_ref`
- `content_length`

Validation rejects:

- missing fields
- additional fields
- unsupported schema
- unsupported digest profile
- malformed digest text
- uppercase/noncanonical digest text
- unsupported storage scheme
- empty storage references
- negative, fractional, unsafe, string, and null content lengths

Zero-byte artifacts are explicitly supported.

### Storage boundary decision

Phase 002 validates the storage identity shape only far enough to preserve the frozen proof model.

`storage_ref` is currently required to be a non-empty string.

CID parsing, CID normalization, and canonical `ipfs://<CID>` enforcement remain deliberately deferred to Phase 003 — IPFS Storage + Retrieval.

This prevents Phase 002 from absorbing storage-network semantics outside its contract.

### Slice 001 evidence

Observed:

- tests: 16
- passed: 16
- failed: 0
- typecheck: PASS
- lint: PASS with zero warnings after cleanup
- `git diff --check`: PASS
- pre-commit lint-staged gate: PASS

Slice 001 commit:

`f1b4ae9` — Phase 002 — add digest and proof core

This is a branch commit and is not a final Phase 002 merge anchor.

## Remaining Phase 002 work

Still required:

- strict JSON parsing
- duplicate-key rejection
- RFC 8785-compatible canonicalization
- canonical UTF-8 proof bytes
- parse/canonical validation helpers
- stable conformance fixtures
- canonical/noncanonical vectors
- final Phase 002 integrated gates
