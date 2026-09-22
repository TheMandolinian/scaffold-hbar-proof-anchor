# Phase 003 — IPFS Storage + Retrieval Contract

## Status

FROZEN.

This contract was reviewed and frozen before Phase 003 production implementation began.

## Phase

Phase 003 — IPFS Storage + Retrieval

## Authoritative repository

This contract applies only to:

`TheMandolinian/scaffold-hbar-proof-anchor`

Codespaces workspace:

`/workspaces/scaffold-hbar-proof-anchor`

The repository itself is the source of implementation evidence.

No implementation claim, test count, dependency, commit, finding, or closeout evidence may be imported from another repository.

## Phase entry anchor

Phase 003 begins from the sealed Phase 002 `main` commit:

`8402c7ff1bb6fae333a1420870cb6f1528ae0525`

Phase 002 is sealed and provides the deterministic proof and digest core used by this phase.

## Pipeline assignment

The repository-local pipeline assigns Phase 003 the following work:

> Implement CID normalization, provider-neutral `ipfs://` references, Pinata upload integration, controlled retrieval, exact-byte round trip, and storage conformance.

This contract expands that bounded assignment into explicit human-readable requirements.

---

# 1. Purpose

Phase 003 establishes the storage layer used by Proof Anchor.

Its job is to prove that an artifact can be:

1. represented as exact bytes,
2. uploaded through the reference storage provider,
3. identified by a valid IPFS CID,
4. represented by a provider-neutral canonical `ipfs://` reference,
5. retrieved through a controlled gateway,
6. reconstructed as exact bytes,
7. and compared against the original artifact without depending on provider-specific identifiers.

Phase 003 does **not** decide whether a proof is admissible for Hedera submission.

That responsibility belongs to Phase 004 — Server Admission.

---

# 2. Human-readable judge summary

A judge should be able to understand Phase 003 as follows:

- the artifact itself has exact bytes;
- IPFS produces a content-addressed identifier for stored content;
- Proof Anchor does not store a Pinata URL inside the proof;
- Proof Anchor stores a provider-neutral `ipfs://<CID>` reference;
- retrieval uses a separately configured gateway;
- changing the gateway does not change artifact identity;
- the bytes retrieved from IPFS must reproduce the bytes that were uploaded;
- the existing Phase 002 digest core can independently verify those bytes.

The important separation is:

**storage identity is not transport location.**

A CID identifies content.

A gateway is merely one transport path used to retrieve that content.

A Pinata account is merely one provider used to upload or pin that content.

None of those provider-specific details belong in the canonical proof identity.

## 2.1 What "decentralized storage" means in this template

Proof Anchor uses IPFS as its decentralized, content-addressed storage layer.

That statement must be interpreted precisely.

Phase 003 is intended to prove that:

- artifact storage identity is an IPFS CID rather than a provider URL;
- the canonical proof reference is provider-neutral;
- retrieval transport can be configured separately from storage identity;
- exact artifact bytes can be independently reconstructed from the IPFS identity.

Pinata is the reference upload and pinning provider used by this template.

Pinata itself is not treated as the decentralized trust anchor.

A successful Pinata upload therefore does not, by itself, prove that multiple independent storage operators are preserving the artifact.

Likewise, successful retrieval through a second gateway demonstrates transport and identity independence, but it does not by itself prove independent long-term replication.

Accordingly, Phase 003 does **not** claim:

- permanent artifact availability;
- replication by multiple independent pinning providers;
- independence from every individual IPFS node or pinning operator;
- that one provider's disappearance could never affect availability.

The architectural claim is narrower and testable:

> Proof Anchor uses a provider-neutral IPFS content identity so storage and retrieval are not canonically bound to a single provider-specific URL.

If stronger decentralized-persistence evidence is added later, it must be recorded separately and supported by observed evidence.

---

# 3. Phase 003 starting state

Repository inspection at Phase 003 entry observed:

- `storage_scheme` is already frozen as `ipfs`;
- Phase 002 currently requires `storage_ref` only to be a non-empty string;
- no CID parsing or normalization implementation exists;
- no Pinata integration exists;
- no IPFS gateway retrieval implementation exists;
- no IPFS-specific dependency exists;
- the existing Proof Anchor production core contains only:
  - `digest.ts`
  - `proof.ts`
  - `canonical.ts`

Phase 003 must build the storage layer without rewriting the sealed Phase 002 cryptographic and canonicalization behavior.

---

# 4. Required outputs

Phase 003 must provide the minimum production functionality necessary to support:

- CID parsing;
- CID normalization;
- canonical IPFS storage references;
- Pinata-backed upload;
- controlled gateway retrieval;
- exact-byte storage round-trip verification.

The exact file layout is an implementation decision.

Every production file, dependency, abstraction, and public API remains subject to the repository Minimality Gate.

---

# 5. Canonical storage identity

## 5.1 Storage scheme

The canonical Proof Anchor storage scheme remains:

`ipfs`

Phase 003 must not introduce additional storage schemes.

## 5.2 Canonical storage reference

The canonical storage reference form is:

`ipfs://<canonical-cid>`

Provider URLs must not appear in canonical proof identity.

Examples of provider-specific information that must not become proof identity include:

- Pinata gateway URLs;
- Pinata account identifiers;
- API endpoints;
- upload URLs;
- signed URLs;
- bearer tokens;
- gateway query parameters.

## 5.3 Canonical CID representation

Phase 003 will normalize accepted IPFS CIDs into one deterministic textual representation.

The target canonical representation is:

- CIDv1;
- base32;
- lowercase textual encoding.

The implementation must use a standards-aware CID implementation rather than attempting to validate CID structure with a hand-written regular expression.

CID normalization must preserve the underlying content identifier while eliminating multiple textual encodings for the same identity.

## 5.4 Accepted identity input

The storage identity layer may accept:

- raw CID text;
- canonical or normalizable `ipfs://<CID>` references.

An HTTP or HTTPS gateway URL is not a canonical storage identity and must not silently become one.

If gateway URL ingestion is ever supported later, it must be handled explicitly rather than conflated with the storage reference contract.

---

# 6. Relationship to the Phase 002 proof model

Phase 002 intentionally validated `storage_ref` only as a non-empty string.

That decision remains historically correct for the sealed Phase 002 boundary.

Phase 003 adds IPFS-specific storage semantics at the storage boundary.

The implementation should avoid unnecessarily changing the generic six-field Phase 002 proof validator merely to introduce transport behavior.

Where possible:

- Phase 002 continues to define proof shape;
- Phase 003 defines what constitutes a canonical IPFS storage identity;
- later admission logic composes those boundaries.

This keeps schema validation separate from storage-network validation.


---

# 7. Pinata reference-provider boundary

## 7.1 Provider role

Pinata is the reference IPFS upload provider for this template.

Pinata is not the canonical identity system.

The provider may return information useful to the upload operation, but Proof Anchor must reduce storage identity to the canonical IPFS CID/reference defined by this phase.

## 7.2 Credential handling

Provider credentials are secrets.

Phase 003 must not:

- place Pinata credentials in browser-delivered code;
- commit credentials to the repository;
- include credentials in fixtures;
- write credentials into phase documentation;
- print credentials in test output;
- include credentials in canonical proof bytes.

Any provider authentication used during development must remain server-side or otherwise outside public client code.

## 7.3 Upload semantics

The reference upload path must upload the artifact as bytes.

The storage implementation must not intentionally reinterpret artifact content as text.

The returned storage identity must be derived from the CID returned or proven by the storage operation.

Provider-specific response metadata must not expand the six-field Proof Anchor schema.

## 7.4 Provider neutrality

The canonical result of a successful upload is the IPFS identity, not the Pinata identity.

A future user must be able to retrieve the artifact from another compatible IPFS gateway using the same canonical storage reference.

The reference provider is therefore replaceable without changing proof identity.

---

# 8. Controlled retrieval contract

## 8.1 Retrieval input

Controlled retrieval begins from a validated canonical IPFS identity.

The retrieval layer must not treat an arbitrary user-controlled URL as the artifact source.

## 8.2 Gateway configuration

The retrieval transport must use a configured gateway origin.

The canonical proof must not encode that gateway origin.

This separation ensures:

`ipfs://CID`

remains stable even if:

- the configured gateway changes;
- Pinata is replaced;
- a different compatible IPFS gateway is used.

## 8.3 Retrieval path construction

The gateway request must be constructed from:

- a controlled gateway origin;
- the validated canonical CID.

The implementation must not concatenate an unvalidated arbitrary URL supplied by a proof.

## 8.4 Retrieval result

The storage retrieval primitive must return artifact bytes.

Those bytes must be suitable for direct use by the Phase 002 exact-byte digest implementation.

No text normalization may occur between retrieval and hashing.

## 8.5 HTTP failure

Non-successful gateway responses must be treated as retrieval failures.

A failed retrieval is not evidence of a digest mismatch.

This distinction must be preserved:

**unavailable is not mismatch.**

---

# 9. Exact-byte round-trip contract

The core Phase 003 storage invariant is:

> Bytes uploaded as an artifact must be reproducible as the same artifact bytes when retrieved by canonical IPFS identity.

A conformance round trip therefore consists of:

1. begin with known artifact bytes;
2. compute the original byte length;
3. compute the original Phase 002 digest;
4. upload the exact bytes;
5. obtain the resulting CID;
6. normalize that CID;
7. construct the canonical `ipfs://` storage reference;
8. retrieve through the controlled gateway;
9. observe the retrieved byte length;
10. hash the retrieved bytes with the Phase 002 digest implementation;
11. require the retrieved digest to equal the original digest;
12. require the retrieved byte length to equal the original length.

The upload provider's statement that an upload succeeded is not sufficient evidence by itself.

Retrieval and independent digest reproduction provide the stronger evidence.

---

# 10. Storage conformance

Phase 003 must include repository-native conformance tests for storage identity.

Required categories include:

## 10.1 Valid CID behavior

Tests must demonstrate:

- valid canonical CID acceptance;
- normalizable CID acceptance where supported;
- deterministic normalization;
- stable `ipfs://` construction;
- parse/serialize round trip.

## 10.2 Invalid identity behavior

Tests must reject malformed or unsupported identity forms.

Examples should include cases such as:

- empty CID input;
- invalid CID syntax;
- malformed `ipfs://` reference;
- unexpected path material where only a root CID is permitted;
- gateway HTTP URLs passed where canonical storage identity is expected.

The exact test vectors must be derived and recorded during implementation.

## 10.3 Provider-neutrality behavior

Tests must demonstrate that:

- gateway origin is not part of canonical `storage_ref`;
- Pinata-specific information is not part of canonical `storage_ref`;
- canonical reference generation is independent of retrieval provider configuration.

## 10.4 Retrieval behavior

Tests must cover:

- successful byte retrieval;
- non-successful HTTP status;
- malformed configured gateway input if configuration validation is introduced;
- correct request construction from a controlled origin and validated CID;
- preservation of response bytes.

## 10.5 Round-trip behavior

Tests must prove that retrieved bytes can reproduce:

- original byte length;
- original SHA-256 digest.

---

# 11. Live storage evidence

Before Phase 003 closes, the repository should record at least one real storage round trip using the selected reference-provider path.

The recorded public evidence may include:

- artifact byte length;
- canonical CID;
- canonical `ipfs://` reference;
- original SHA-256 digest;
- retrieved SHA-256 digest;
- whether the two digests matched;
- whether the two byte counts matched.

No credential or secret may be recorded.

A live round trip is evidence of successful integration at that time.

It is not a promise that a third-party gateway or provider will remain available forever.

---

# 12. Failure semantics

Phase 003 should preserve distinct failure classes conceptually even if the first implementation uses a minimal error surface.

The implementation and findings must distinguish at least:

- invalid storage identity;
- unsupported storage identity form;
- upload/provider failure;
- gateway/retrieval failure;
- retrieved byte-count mismatch;
- retrieved digest mismatch.

These conditions must not be collapsed into a misleading generic statement that "verification failed."

Later phases may formalize structured error codes.

Phase 003 should not prematurely implement Phase 004's full hostile-input admission taxonomy.

---

# 13. Trust boundaries

Phase 003 must preserve the architecture boundaries already established by the repository.

## 13.1 Artifact identity versus storage identity

Artifact identity is determined by digest over exact artifact bytes.

Storage identity is determined by IPFS CID/reference.

They are related but not interchangeable.

## 13.2 Provider assertion versus independent retrieval

A successful provider response is not sufficient to establish successful reconstruction.

Retrieval must reproduce bytes independently.

## 13.3 Gateway versus identity

A gateway is a transport.

A gateway URL is not the canonical artifact identity.

## 13.4 Storage versus admission

Successful storage does not mean the proof is admitted.

Phase 004 will perform server-controlled admission.

## 13.5 Storage versus consensus

Successful storage does not mean anything has been committed to Hedera.

HCS commitment belongs to Phase 005.

---

# 14. Security requirements for this phase

Phase 003 must:

- keep provider credentials out of browser code;
- keep provider credentials out of Git;
- keep provider credentials out of proof bytes;
- avoid arbitrary gateway URLs as canonical proof identity;
- parse CIDs with a standards-aware implementation;
- preserve exact bytes across upload and retrieval;
- avoid provider metadata expanding the proof schema.

Phase 003 must not claim to solve the full hostile-input problem.

The following security controls belong primarily to Phase 004:

- comprehensive request-size limits;
- admission byte budgets;
- adversarial timeout policy;
- full SSRF defense at the admission boundary;
- structured hostile-input rejection;
- independently reproduced server admission.

---

# 15. Explicitly out of scope

Phase 003 must not implement:

- HCS submission;
- HCS topic governance;
- Hedera transaction signing;
- Hedera sequence extraction;
- `hedera-hcs://` locators;
- Mirror Node lookup;
- Mirror Node retry behavior;
- browser verification;
- Web Worker hashing;
- integrated lifecycle UI;
- server admission policy;
- generic storage-provider abstraction layers without a proven need;
- additional storage schemes;
- database persistence;
- indexing services.

If implementation work begins pulling one of those behaviors forward, it requires an explicit contract amendment before code is added.


---

# 16. Dependency policy

New dependencies are permitted only when they satisfy a bounded Phase 003 requirement.

A CID library is justified if it provides standards-correct parsing and normalization that would otherwise require unsafe or unnecessary hand-written protocol logic.

A provider SDK is not automatically justified merely because one exists.

Before adding any provider dependency, implementation must determine whether the required Pinata operation can be implemented more narrowly with the platform HTTP APIs already available.

Every new dependency must be recorded in findings with:

- package name;
- exact or selected version;
- purpose;
- why existing dependencies/platform APIs were insufficient;
- whether it is production or development-only.

---

# 17. Minimality Gate

Before the Phase 003 implementation PR is opened, inspect every new:

- production file;
- dependency;
- exported symbol;
- helper;
- abstraction;
- configuration variable;
- route;
- provider-specific path.

Each must be necessary for:

- the frozen Phase 003 contract;
- standards-correct CID/storage behavior;
- testability;
- or a demonstrated security requirement.

Remove:

- unused exports;
- speculative provider interfaces;
- generic plugin systems;
- future transport abstractions;
- dead fixtures;
- convenience wrappers with no real boundary;
- later-phase code.

"Bounty-ready" does not mean "architected for every possible future."

For this template, a smaller auditable storage core is preferable to speculative extensibility.

---

# 18. Planned implementation slices

The implementation may be divided into bounded slices.

## Slice 001 — CID and canonical storage-reference core

Expected work:

- select and justify CID dependency if needed;
- parse accepted CID input;
- normalize CID identity;
- produce canonical `ipfs://` reference;
- parse canonical storage reference;
- add storage-identity conformance vectors.

No network is required for this slice.

## Slice 002 — Controlled retrieval

Expected work:

- configured gateway origin;
- request construction from validated canonical CID;
- artifact byte retrieval;
- HTTP failure handling;
- byte-preservation tests.

This slice must not become Phase 004 admission.

## Slice 003 — Pinata upload and exact-byte round trip

Expected work:

- minimal Pinata reference-provider integration;
- secret-safe configuration;
- exact-byte upload;
- returned CID normalization;
- live upload/retrieval evidence;
- digest and byte-count round-trip confirmation.

Implementation may adjust slice boundaries if the actual repository reveals a smaller correct design.

Any adjustment must be recorded in findings.

---

# 19. Required Phase 003 evidence

Before implementation closeout, findings must record actual observed evidence from this repository.

Required evidence includes:

- dependencies actually added;
- production files actually added or changed;
- tests actually added;
- exact test count;
- exact pass/fail count;
- typecheck result;
- lint result;
- production build result;
- `git diff --check` result;
- pre-commit hook result;
- GitHub CI result;
- Minimality Gate result;
- real live round-trip evidence if completed;
- real implementation squash hash after merge.

No evidence value may be predicted.

---

# 20. Judge verification path

Phase 003 documentation must make it possible for a judge unfamiliar with the repository to answer the following questions.

## Question 1 — What exactly is stored?

The artifact's exact bytes are stored through IPFS.

## Question 2 — What identity goes into the proof?

A canonical provider-neutral:

`ipfs://<CID>`

reference.

## Question 3 — Does the proof depend on Pinata?

No.

Pinata is the reference upload provider.

The proof identity is the IPFS CID.

## Question 4 — Does the proof depend on one gateway?

No.

The gateway is retrieval transport and is configured separately.

## Question 5 — How do I know the bytes came back unchanged?

The retrieved byte length and SHA-256 digest are independently compared with the original artifact.

## Question 6 — Does successful storage mean the proof is trusted?

No.

Server admission is a separate Phase 004 boundary.

## Question 7 — Does successful storage mean the proof is on Hedera?

No.

HCS commitment is Phase 005.

---

# 21. What Phase 003 proves

When complete, Phase 003 may claim that the template has a deterministic IPFS storage identity layer and a tested reference path for storing and retrieving exact artifact bytes.

It may claim only what repository tests and recorded live evidence demonstrate.

---

# 22. What Phase 003 does not prove

Phase 003 does not prove:

- that arbitrary user proofs are safe to admit;
- that a provider remains permanently available;
- that every public IPFS gateway will return data forever;
- that any proof has reached Hedera consensus;
- that Mirror Node has indexed anything;
- that a browser has independently verified an artifact;
- that provider success alone guarantees artifact integrity.

Those claims belong to later boundaries or are inherently outside the guarantee of this phase.

---

# 23. Closeout criteria

Phase 003 implementation is ready for its implementation PR only when:

1. the contract is satisfied;
2. CID/reference behavior is deterministic;
3. retrieval preserves exact bytes;
4. provider identity does not leak into proof identity;
5. storage conformance tests pass;
6. exact-byte round-trip evidence is recorded where applicable;
7. typecheck passes;
8. lint passes;
9. production build passes;
10. `git diff --check` passes;
11. Minimality Gate passes;
12. findings contain only observed repo-native evidence.

After implementation PR squash merge:

- capture the real implementation squash hash;
- create closeout documentation from updated `main`;
- merge the documentation PR;
- capture the real documentation squash hash;
- perform record-only anchor repair;
- mark Phase 003 SEALED only after that final merge.
