# Phase 003 — Findings

## Phase

Phase 003 — IPFS Storage + Retrieval

## Status

CONTRACT FROZEN.

IMPLEMENTATION IN PROGRESS.

Slice 001 and Slice 002 are complete on the Phase 003 branch.

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

Status: COMPLETE ON PHASE BRANCH.

### Production files

Added:

- `packages/nextjs/utils/proof-anchor/storageRetrieval.ts`

### Test files

Added:

- `packages/nextjs/tests/proof-anchor/storage-retrieval.test.ts`

### Implemented public surface

Slice 002 exposes exactly one production operation:

- `retrieveIpfsBytes`

The following implementation details remain private:

- `FetchLike`
- `parseGatewayOrigin`
- `buildGatewayUrl`

No generic storage-provider interface, adapter registry, plugin system, strategy abstraction, or provider factory was introduced.

### Retrieval identity boundary

Controlled retrieval begins from an already-canonical Proof Anchor storage reference.

`retrieveIpfsBytes` does not accept an arbitrary artifact URL as canonical identity.

Request construction first passes the supplied storage reference through:

`parseCanonicalIpfsStorageRef`

Only after canonical IPFS identity is validated does the retrieval layer combine the parsed CID with the separately supplied gateway origin.

This preserves the Phase 003 distinction:

- canonical storage identity = `ipfs://<canonical-cid>`
- retrieval transport = configured gateway origin

The canonical storage reference does not select the gateway origin, hostname, configured base path, query, fragment, credentials, or transport endpoint. The validated CID is used only as the controlled `/ipfs/<cid>` request path segment.

### Gateway-origin validation

The implemented gateway-origin parser requires:

- a non-empty string;
- no surrounding whitespace;
- a valid URL;
- HTTP or HTTPS protocol;
- no embedded username or password;
- no query data;
- no fragment data;
- no configured pathname beyond the origin root.

The implementation currently permits both `http:` and `https:` configured gateway origins, consistent with the frozen Phase 003 contract.

This is a configuration rule, not proof-controlled transport selection.

### Exact request construction

For a validated canonical storage reference and controlled gateway origin, Slice 002 constructs:

`<gateway-origin>/ipfs/<canonical-cid>`

The retrieval request uses:

- HTTP method: `GET`

The proof does not supply:

- arbitrary URL;
- arbitrary hostname;
- arbitrary path;
- arbitrary query;
- arbitrary fragment;
- arbitrary credentials.

### Exact response-byte behavior

On a successful gateway response, Slice 002 obtains the response body bytes and returns them as a `Uint8Array`.

Repository-native tests demonstrated preservation of exact byte values including:

- `0x00`
- `0x41`
- `0xff`
- `0x7f`

Slice 002 does not calculate the artifact digest itself.

Slice 002 does not decide whether retrieved bytes match a Proof Anchor digest.

Those comparisons remain outside this retrieval primitive.

### Retrieval failure behavior

A non-successful HTTP response is reported as retrieval failure and includes the observed HTTP status.

A transport exception is reported as gateway retrieval failure.

The tests intentionally distinguish these unavailable/transport conditions from artifact mismatch semantics.

Slice 002 therefore does not convert inability to retrieve bytes into a cryptographic mismatch conclusion.

### Slice 002 observed tests

New Slice 002 storage-retrieval tests:

- tests: 10
- passed: 10
- failed: 0

Integrated Proof Anchor suite after Slice 002:

- tests: 55
- passed: 55
- failed: 0

### Slice 002 observed gates

Observed before the implementation commit:

- direct TypeScript compiler gate, `yarn tsc --noEmit`: PASS
- lint: PASS with zero lint warnings or errors
- production build: PASS
- `git diff --check`: PASS
- staged `git diff --cached --check`: PASS
- pre-commit lint-staged gate: PASS
- post-precommit staged diff check: PASS

The initial attempted command `yarn typecheck` did not exist in the package scripts.

Repository inspection showed the package script is named `check-types`, and the repaired direct compiler gate `yarn tsc --noEmit` passed.

The production build also completed Next.js type-validity checking successfully.

The build continued to emit the inherited DaisyUI / Google Fonts CSS ordering warning. The build completed successfully and Slice 002 did not absorb unrelated scaffold CSS cleanup.

### Slice 002 Minimality and boundary review

The final Slice 002 review confirmed:

- exactly one public production export;
- gateway parsing remains private;
- gateway URL construction remains private;
- canonical `ipfs://` identity is validated before retrieval;
- canonical proof identity does not select the gateway;
- no arbitrary proof URL is accepted as storage identity;
- an optional `fetchImpl` parameter defaults to platform `fetch` and provides deterministic request injection for tests;
- no Pinata integration exists yet;
- no environment-variable behavior exists yet;
- no HCS behavior exists;
- no Mirror Node behavior exists;
- no Hedera locator behavior exists;
- no speculative storage-provider abstraction exists.

A scope scan found no Phase 004-or-later implementation behavior in the Slice 002 production or test files.

### Slice 002 implementation commit

`459e580a91465300e73ffb804339e0e269f58b74` — Phase 003 — add controlled IPFS retrieval

This is a phase-branch commit.

It is not the final Phase 003 implementation squash anchor.

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

Current repository-native Phase 003 observations:

- canonical IPFS identity is parsed independently from gateway transport;
- gateway host selection is not derived from canonical proof identity;
- configured gateway origins reject embedded credentials;
- configured gateway origins reject path, query, and fragment material;
- canonical storage references reject malformed and noncanonical CID identity before retrieval;
- Slice 002 retrieves exact response bytes without assigning verification authority to the transport layer;
- retrieval failure remains distinct from cryptographic mismatch;
- no Pinata credential handling exists yet because Slice 003 has not been implemented;
- no Phase 004 hostile-input admission behavior is claimed by Phase 003.

Full provider credential placement and live transport observations remain pending Slice 003.

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

Completed on the Phase 003 branch:

- Slice 001 — CID and canonical storage-reference core;
- Slice 002 — controlled retrieval.

Remaining work includes:

- Slice 003 — Pinata reference-provider upload integration;
- exact-byte live upload/retrieval round trip;
- original-versus-retrieved byte-count comparison;
- original-versus-retrieved SHA-256 comparison;
- storage conformance evidence;
- live non-secret evidence recording;
- final Phase 003 security/minimality review;
- final Phase 003 test and build gates;
- implementation PR and GitHub CI;
- post-merge Phase 003 closeout lifecycle.

No Slice 003 or live-provider result is claimed yet.
