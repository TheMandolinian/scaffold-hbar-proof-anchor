# Phase 002 — Canonical Proof + Digest Core

## Status

Implementation in progress.

## Base anchor

Phase 001 sealed main:

`7b8af06f8899f171eca7e84ef718e898139d856b`

## Objective

Implement the deterministic, network-independent cryptographic and canonical proof core for Proof Anchor.

Phase 002 establishes exactly how artifact bytes are hashed, how Proof Anchor v1 records are represented, and how canonical proof bytes are produced and validated.

## In scope

Phase 002 includes:

- `sha256-bytes/v1`
- exact-byte SHA-256 hashing
- incremental/chunked artifact hashing
- six-field `hbar-proof-anchor/v1` proof schema
- strict field validation
- deterministic canonical JSON serialization
- RFC 8785-compatible canonicalization
- canonical UTF-8 proof bytes
- strict JSON parsing
- duplicate-key rejection
- canonical parse/validation helpers
- known-answer fixtures
- valid and invalid proof vectors
- canonical/noncanonical vectors
- chunk-boundary invariance tests

## Canonical proof v1

Exactly these fields:

- `schema`
- `digest_profile`
- `artifact_digest`
- `storage_scheme`
- `storage_ref`
- `content_length`

Fixed identities:

- `schema = hbar-proof-anchor/v1`
- `digest_profile = sha256-bytes/v1`
- `storage_scheme = ipfs`

## Required boundaries

Artifact digest and storage identity remain distinct.

The artifact digest is SHA-256 over exact artifact bytes.

The IPFS CID is not the artifact digest.

Canonical proof bytes must not contain:

- filename
- MIME type
- gateway URL
- timestamp
- run ID
- transaction ID
- topic ID
- sequence number
- UI state
- provider metadata

Schema semantics may not change without versioning.

## Out of scope

Phase 002 does not implement:

- Pinata
- IPFS upload
- IPFS retrieval
- server admission
- HCS submission
- HCS topic governance
- Mirror Node readback
- browser verification UI
- lifecycle integration

No network access is required to prove Phase 002 correctness.

## Minimality gate

Every production file, dependency, abstraction, exported API, and persistent code path must be justified by this contract, normative Proof Anchor architecture, or demonstrated testability/security need.

Do not introduce speculative extensibility.

## Required evidence

Phase 002 must demonstrate:

1. identical bytes always produce identical SHA-256 digest output;
2. digest output is invariant across chunk boundaries;
3. proof validation rejects unsupported schema/profile/storage identities;
4. malformed digests and invalid lengths are rejected;
5. duplicate JSON keys are rejected;
6. canonical proof serialization is deterministic;
7. noncanonical but otherwise valid JSON can be distinguished from canonical bytes where required;
8. canonical UTF-8 bytes round-trip through strict parsing;
9. known-answer fixtures remain stable;
10. lint, typecheck, tests, and production build pass.

## Close condition

Phase 002 closes only after implementation merge, documentation closeout, and anchor repair through the standard three-stage governance process.
