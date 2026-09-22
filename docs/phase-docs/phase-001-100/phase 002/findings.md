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

## Slice 002 — Strict JSON and canonical proof bytes

Implemented:

- `packages/nextjs/utils/proof-anchor/canonical.ts`
- `packages/nextjs/tests/proof-anchor/canonical.test.ts`
- `packages/nextjs/tests/proof-anchor/conformance.test.ts`
- `packages/nextjs/tests/proof-anchor/fixtures/proof-v1-canonical.fixture`
- `packages/nextjs/tests/proof-anchor/fixtures/proof-v1-noncanonical.fixture`
- `packages/nextjs/tests/proof-anchor/fixtures/proof-v1-duplicate-key.fixture`

Dependency added:

- `canonicalize@5.1.0`, pinned exactly

The dependency was selected only for RFC 8785-compatible JSON canonicalization.

A repository-local smoke check confirmed the installed package exports the expected callable API and deterministically canonicalizes object property order.

### Strict JSON parsing

Implemented raw JSON parsing that rejects duplicate object keys before ordinary `JSON.parse` can collapse them.

Duplicate detection compares decoded JSON key values, so escaped and unescaped spellings of the same key are treated as duplicates.

Malformed JSON is rejected.

Malformed UTF-8 proof bytes are rejected before proof validation.

### Canonical proof serialization

Implemented:

- schema validation before canonicalization
- deterministic RFC 8785-compatible canonical JSON
- UTF-8 canonical proof bytes
- exact canonical-byte parsing
- byte-for-byte rejection of semantically valid but noncanonical encodings

Canonical proof parsing therefore distinguishes:

- valid canonical proof bytes
- valid proof data encoded noncanonically
- malformed or invalid proof data

No CID parsing, CID normalization, IPFS transport, or other Phase 003 storage behavior was introduced.

### Canonicalization conformance

Repository-native tests cover:

- fixed canonical Proof Anchor representation
- source insertion-order independence
- exact UTF-8 canonical bytes
- valid pretty-printed JSON parsing
- exact canonical-byte acceptance
- reordered but semantically valid JSON rejection as noncanonical
- leading/trailing whitespace rejection as noncanonical
- duplicate top-level key rejection
- decoded-key duplicate detection
- malformed JSON rejection
- six-field schema enforcement after parsing
- malformed UTF-8 rejection
- an RFC 8785 canonicalization vector
- lone-surrogate rejection by the selected JCS implementation

### Stable conformance fixtures

Added exact-byte fixtures for:

- canonical proof bytes
- semantically valid but noncanonical proof bytes
- duplicate-key proof JSON

Observed fixture byte lengths:

- canonical: 227 bytes
- noncanonical: 227 bytes
- duplicate-key: 259 bytes

The canonical fixture round-trips byte-for-byte through the canonical proof helpers.

The noncanonical fixture remains semantically parseable but fails canonical-byte validation.

The duplicate-key fixture is rejected before ordinary JSON parsing can collapse the duplicate.

### Slice 002 evidence

Observed after the conformance fixtures were added:

- tests: 33
- passed: 33
- failed: 0
- typecheck: PASS
- lint: PASS with zero warnings or errors
- `git diff --check`: PASS
- staged `git diff --cached --check`: PASS
- pre-commit lint-staged gate: PASS

Slice 002 implementation commit:

`2eebdb4d13e887fd428d859d1381755ca5221dc9` — Phase 002 — add canonical proof bytes

This is a branch commit and is not a final Phase 002 merge anchor.

## Remaining Phase 002 work

Still required:

- final Phase 002 integrated gates
- final Minimality Gate review
- implementation PR / CI / squash-merge lifecycle
- Phase 002 closeout after the real implementation squash merge exists
