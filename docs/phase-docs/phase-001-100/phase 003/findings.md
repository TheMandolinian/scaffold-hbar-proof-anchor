# Phase 003 — Findings

## Phase

Phase 003 — IPFS Storage + Retrieval

## Status

CONTRACT FROZEN.

IMPLEMENTATION NOT YET STARTED.

This document records only evidence observed in the real bounty repository.

Do not record planned behavior as completed behavior.

## Phase entry anchor

Phase 003 began from sealed `main`:

`8402c7ff1bb6fae333a1420870cb6f1528ae0525`

## Repository-native entry observations

The Phase 003 entry inspection found no existing IPFS transport or Pinata implementation.

Existing storage-related production behavior was limited to the sealed Phase 002 proof model:

- `storage_scheme` is fixed to `ipfs`;
- `storage_ref` is represented as a string;
- Phase 002 requires `storage_ref` to be non-empty.

No Phase 003 implementation dependency was present at entry.

Relevant dependencies observed at entry:

- `@noble/hashes@1.8.0`
- `canonicalize@5.1.0`

These dependencies belong to the existing proof/digest core and are not evidence of IPFS functionality.

## Existing Proof Anchor production files at entry

Observed:

- `packages/nextjs/utils/proof-anchor/digest.ts`
- `packages/nextjs/utils/proof-anchor/proof.ts`
- `packages/nextjs/utils/proof-anchor/canonical.ts`

No CID, IPFS retrieval, or Pinata production module existed at Phase 003 entry.

No repository-native evidence of multi-provider IPFS replication existed at Phase 003 entry.

Accordingly, Phase 003 will distinguish provider-neutral IPFS identity from stronger claims about independent replicated persistence.

## Entry boundary

Phase 003 must add storage-specific behavior without rewriting the sealed Phase 002 canonical proof and digest rules unnecessarily.

The primary new concerns are:

- CID identity;
- canonical storage references;
- reference-provider upload;
- controlled retrieval;
- exact-byte round trip.

## Dependency decisions

### `multiformats@14.0.5`

Classification:

- production dependency
- pinned to the exact tested version `14.0.5`

Purpose:

- standards-aware CID parsing;
- CIDv0 to CIDv1 conversion;
- CIDv1 base32 serialization;
- deterministic canonical IPFS identity.

Reason required:

CID is a structured multiformat identifier. Implementing CID parsing, version conversion, multibase handling, and binary identity preservation with hand-written string logic or regular expressions would introduce unnecessary protocol risk.

The repository therefore uses the established `multiformats` implementation for the protocol-sensitive CID boundary.

The dependency was initially resolved by Yarn as `^14.0.5` and was then intentionally pinned to exactly `14.0.5` before production code was written against it.

Repository-native API smoke evidence showed:

- CIDv0 parsing succeeded;
- CIDv0 to CIDv1 conversion succeeded;
- the underlying multihash remained identical;
- CIDv1 base32 serialization was lowercase;
- canonical CID text reparsed exactly.

No provider SDK or IPFS HTTP client was added during Slice 001.

## Slice 001 — CID and storage-reference core

Status: COMPLETE ON PHASE BRANCH.

### Production files

Added:

- `packages/nextjs/utils/proof-anchor/storageIdentity.ts`

Modified dependency records:

- `packages/nextjs/package.json`
- `yarn.lock`

### Test files

Added:

- `packages/nextjs/tests/proof-anchor/storage-identity.test.ts`

### Implemented public surface

Slice 001 exposes exactly three storage-identity operations:

- `normalizeIpfsCid`
- `normalizeIpfsStorageRef`
- `parseCanonicalIpfsStorageRef`

Internal parsing details remain private.

### Canonical identity behavior

The implemented canonical CID representation is:

- CIDv1;
- base32;
- lowercase.

The implemented canonical storage reference form is:

`ipfs://<canonical-cid>`

A valid CIDv0 may be accepted as normalization input, but it is converted to the canonical CIDv1 base32 lowercase representation.

A canonical CIDv1 base32 value remains stable when normalized again.

### Provider-neutrality behavior

Canonical storage identity contains no:

- Pinata URL;
- Pinata account identifier;
- gateway origin;
- HTTP query parameter;
- provider-specific metadata.

The canonical result is an `ipfs://` reference derived solely from the normalized CID.

### Rejected identity forms

Repository-native tests demonstrate rejection of:

- empty CID input;
- malformed CID input;
- surrounding whitespace;
- gateway HTTP URLs supplied as storage identity;
- path material after the root CID;
- query material after the root CID;
- fragment material after the root CID;
- empty `ipfs://` references;
- missing `ipfs://` scheme where canonical-reference parsing requires it;
- uppercase `IPFS://` scheme;
- noncanonical CIDv0 text supplied to the canonical-reference parser.

### Canonical parser behavior

The canonical-reference parser is intentionally stricter than the normalization helper.

Normalization may convert supported alternate CID representations into the canonical representation.

Canonical parsing requires that the supplied storage reference already be exactly canonical.

This distinction allows the implementation to normalize candidate storage identities while still enforcing exact canonical identity at boundaries that require it.

### Slice 001 observed tests

New Slice 001 storage-identity tests:

- tests: 12
- passed: 12
- failed: 0

Integrated Proof Anchor suite after Slice 001:

- tests: 45
- passed: 45
- failed: 0

### Slice 001 observed gates

- typecheck: PASS
- lint: PASS with zero lint warnings or errors
- production build: PASS
- `git diff --check`: PASS
- staged `git diff --cached --check`: PASS
- pre-commit lint-staged gate: PASS

The production build continued to emit the inherited DaisyUI / Google Fonts CSS ordering warning. The build completed successfully and Slice 001 did not absorb unrelated scaffold CSS cleanup.

### Slice 001 Minimality Gate

The Slice 001 public API was inspected symbol-by-symbol.

The production surface contains only the three operations required for:

- CID normalization;
- canonical `ipfs://` construction;
- exact canonical storage-reference parsing.

The scope review found no:

- network request;
- Pinata integration;
- gateway retrieval implementation;
- HCS behavior;
- Mirror Node behavior;
- Hedera locator behavior;
- environment configuration.

A test string containing `https://gateway.example/...` exists only to prove that gateway URLs are rejected as canonical storage identity.

### Slice 001 implementation commit

`529a365b78992b9b2dc539db87b0d24ad8f9ccf7` — Phase 003 — add canonical IPFS identity

This is a phase-branch commit.

It is not the final Phase 003 implementation squash anchor.

## Slice 002 — Controlled retrieval

Pending implementation.

Record here:

- configuration introduced;
- gateway behavior;
- exact request construction;
- response-byte behavior;
- HTTP failure behavior;
- tests;
- gate results;
- commit hash.

## Slice 003 — Pinata upload / round trip

Pending implementation.

Record here:

- integration mechanism actually selected;
- why that mechanism was minimal;
- secret-handling boundary;
- returned CID behavior;
- live upload evidence;
- live retrieval evidence;
- byte-count comparison;
- digest comparison;
- tests;
- gate results;
- commit hash.

## Storage conformance vectors

Pending implementation.

Record exact valid and invalid vectors only after they exist in this repository.

## Live evidence

Pending implementation.

If live integration is performed, record only public/non-secret evidence such as:

- canonical CID;
- canonical `ipfs://` reference;
- artifact byte count;
- original digest;
- retrieved digest;
- digest match result;
- retrieved byte count;
- byte-count match result.

Never record:

- Pinata JWT;
- bearer token;
- API secret;
- private credential material.

## Security observations

Pending implementation.

Record actual findings concerning:

- provider credential placement;
- gateway control;
- identity-versus-transport separation;
- byte preservation;
- invalid CID handling.

Do not claim Phase 004 hostile-input protections are implemented during Phase 003.

## Minimality findings

Pending final implementation.

Before implementation PR:

- inspect every Phase 003 production file;
- inspect every dependency;
- inspect every export;
- inspect every route/configuration path;
- remove speculative abstractions;
- record what was removed and why.

## Final gates

Pending implementation.

Final observed evidence must include:

- tests:
- passed:
- failed:
- typecheck:
- lint:
- production build:
- `git diff --check`:
- pre-commit:
- GitHub CI:
- Minimality Gate:

No result is recorded until actually observed.

## Remaining Phase 003 work

All Phase 003 implementation remains pending at this contract-freeze checkpoint.
