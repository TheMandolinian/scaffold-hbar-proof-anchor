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

Pending implementation.

For every Phase 003 dependency actually added, record:

- package;
- version;
- production/dev classification;
- exact purpose;
- reason it is necessary;
- rejected simpler alternatives where relevant.

## Slice 001 — CID and storage-reference core

Pending implementation.

Record here:

- files added or modified;
- CID library selected;
- accepted CID/reference forms;
- canonical representation;
- normalization observations;
- rejected malformed forms;
- exact tests and vectors;
- gate results;
- commit hash.

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
