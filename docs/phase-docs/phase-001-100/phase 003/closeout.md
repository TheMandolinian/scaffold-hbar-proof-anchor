# Phase 003 — Closeout

## Phase

Phase 003 — IPFS Storage + Retrieval

## Status

SEALED.

Implementation and closeout documentation are merged to `main`.

The real implementation and documentation squash anchors are recorded below.

This final record-only anchor-repair stage changes no production implementation.

## Canonical implementation anchor

`040fa6325cd2fc421a448decf685d13dcf4e575e`

This is the GitHub squash-merge commit for implementation PR #7.

## Implementation PR

PR #7 — Phase 003 — IPFS storage and retrieval

Merged at:

`2026-09-22T03:39:33Z`

Implementation PR head before squash merge:

`3bc845f80caf7845c7dcd243b05449125e18c1e3`

GitHub pull-request CI passed before merge.

PR CI run:

`35683799942`

Job:

`106606235363`

Observed result:

- workflow: `Lint`
- event: `pull_request`
- branch: `phase-003-ipfs-storage-retrieval`
- job: `ci (ubuntu-latest, lts/*)`
- result: PASS

## Post-merge main evidence

After PR #7 was squash-merged, `main` synchronized to:

`040fa6325cd2fc421a448decf685d13dcf4e575e`

Post-merge `main` CI run:

`35683966709`

Job:

`106606748969`

Observed result:

- workflow: `Lint`
- event: `push`
- branch: `main`
- job: `ci (ubuntu-latest, lts/*)`
- result: PASS

The GitHub workflow observed during closeout performs:

- immutable Yarn dependency installation;
- Next.js lint with zero warnings permitted;
- Next.js type checking.

The repository's 70-test Proof Anchor suite and production build were observed separately in the local final implementation gate.

They are not misrepresented here as GitHub Actions jobs.

## CI environment notices

Both observed GitHub CI runs emitted infrastructure notices that did not fail the workflow:

- actions targeting Node.js 20 were being forced to run on Node.js 24 because of GitHub Actions runner deprecation;
- GitHub reported that the `ubuntu-latest` label is scheduled to migrate to Ubuntu 26 beginning October 19, 2026.

These were CI-environment notices rather than Phase 003 implementation failures.

Phase 003 did not widen scope to perform unrelated workflow maintenance.

## Implemented boundary

Phase 003 established the Proof Anchor storage layer required by the frozen phase contract.

Implemented:

- standards-aware IPFS CID parsing;
- deterministic CID normalization;
- canonical provider-neutral IPFS storage references;
- strict canonical IPFS reference parsing;
- controlled IPFS gateway retrieval;
- exact response-byte preservation;
- Pinata signed-upload capability creation;
- server-only persistent Pinata credential handling;
- direct artifact upload through signed capability;
- returned-CID normalization;
- exact-byte round-trip evidence;
- storage identity conformance;
- retrieved byte-count reproduction;
- retrieved SHA-256 reproduction using the sealed Phase 002 digest implementation.

## Canonical IPFS identity

The canonical storage scheme remains:

`ipfs`

The canonical storage-reference form introduced by Phase 003 is:

`ipfs://<canonical-cid>`

The canonical CID representation is:

- CIDv1;
- base32;
- lowercase.

Phase 003 uses `multiformats@14.0.5` rather than a hand-written CID regular expression.

A valid CIDv0 may be accepted by the normalization path and converted deterministically to canonical CIDv1 base32 lowercase form.

Strict canonical parsing requires the already-canonical representation.

## Provider-neutrality boundary

Pinata is a reference provider.

Pinata is not the canonical storage identity system.

The canonical proof storage reference contains the normalized IPFS CID rather than:

- Pinata gateway hostname;
- Pinata account identity;
- Pinata API metadata;
- signed upload URL;
- persistent JWT;
- retrieval-provider configuration.

Changing the compatible gateway transport does not change the canonical `storage_ref`.

## Controlled retrieval boundary

Retrieval begins from a validated canonical IPFS storage reference.

The gateway origin is configured separately from proof identity.

The retrieval implementation:

- validates the canonical storage reference before network access;
- validates the configured gateway origin;
- rejects embedded gateway credentials;
- rejects gateway path material;
- rejects gateway query material;
- rejects gateway fragment material;
- accepts only supported HTTP transport schemes;
- constructs the request as `/ipfs/<validated-cid>`;
- performs `GET`;
- preserves exact returned response bytes.

A gateway is transport.

It is not the canonical artifact identity.

## Pinata upload boundary

Phase 003 adds the exact production dependency:

`pinata@2.5.6`

Repository-native inspection of the installed SDK led to a deliberately narrow integration.

The Pinata SDK is used server-side for signed upload-capability creation.

The persistent Pinata JWT is not used by the browser-side artifact upload helper.

The direct artifact upload uses platform primitives:

- `fetch`;
- `FormData`;
- `File`.

The upload helper sends the artifact through the signed upload capability and does not add the persistent bearer credential.

The provider-returned CID is reduced to the canonical provider-neutral `ipfs://` reference.

## Persistent secret boundary

Phase 003 introduces one server-only environment variable:

`PINATA_JWT`

The committed `.env.example` contains only:

`PINATA_JWT=`

The implementation does not expose a `NEXT_PUBLIC_` Pinata JWT.

The persistent JWT is not:

- placed in canonical proof bytes;
- passed to `storageUpload.ts`;
- printed by the live evidence runner;
- committed to Git.

The live development credential was supplied through the Codespaces secret environment.

## Signed capability boundary

The server upload-authorization route creates a short-lived upload capability.

Observed implementation behavior includes:

- request body must be a JSON object;
- `contentLength` must be a non-negative safe integer;
- server-side Pinata configuration is required;
- signed capability lifetime is fixed to 60 seconds;
- maximum upload size is narrowed to the requested content length;
- zero-byte requests use a 1-byte provider capability bound because of provider serialization behavior;
- provider signing failure is mapped to a bounded route failure.

The requested byte count narrows the signed capability.

It is not treated as trusted Phase 004 admission evidence.

## Production storage surface

Phase 003 production storage files are limited to:

- `packages/nextjs/utils/proof-anchor/storageIdentity.ts`
- `packages/nextjs/utils/proof-anchor/storageRetrieval.ts`
- `packages/nextjs/utils/proof-anchor/storageUpload.ts`
- `packages/nextjs/app/api/storage/ipfs/upload-auth/route.ts`

Phase 003 storage utility exports are exactly:

- `normalizeIpfsCid`
- `normalizeIpfsStorageRef`
- `parseCanonicalIpfsStorageRef`
- `retrieveIpfsBytes`
- `uploadIpfsArtifact`

## Pinned production dependencies

Phase 003 adds exactly:

- `multiformats@14.0.5`
- `pinata@2.5.6`

No generic storage-provider framework was introduced.

## Storage identity conformance

Repository-native conformance tests cover:

- valid canonical CID acceptance;
- CIDv0 normalization;
- deterministic CIDv1 output;
- stable `ipfs://` construction;
- canonical parse/serialize behavior;
- empty CID rejection;
- malformed CID rejection;
- whitespace rejection;
- gateway URL rejection as canonical identity;
- root-CID path rejection;
- query rejection;
- fragment rejection;
- empty `ipfs://` rejection;
- exact lowercase `ipfs://` scheme enforcement;
- strict rejection of CIDv0 where canonical storage identity is required.

The principal repository-native identity vector is:

CIDv0:

`QmNTiSDCX8Kh6ddnqvH6dxyFEDBcBTyoKE7vki9h6x7LZA`

Canonical CIDv1 base32 lowercase:

`bafybeiabz5dveh6jsfmuq4xgpbvdbkmgq6bvubo34xqobxczvqazrcrbou`

Canonical storage reference:

`ipfs://bafybeiabz5dveh6jsfmuq4xgpbvdbkmgq6bvubo34xqobxczvqazrcrbou`

## Retrieval conformance

Repository-native retrieval tests cover:

- exact artifact-byte retrieval;
- deterministic controlled request construction;
- gateway trailing-slash normalization;
- canonical storage identity validation before network access;
- noncanonical CID rejection before network access;
- configured gateway path rejection;
- embedded gateway credential rejection;
- configured gateway query rejection;
- configured gateway fragment rejection;
- unsupported gateway protocol rejection;
- HTTP retrieval failure;
- transport retrieval failure.

Retrieval failure remains distinct from artifact mismatch.

## Permanent digest reproduction conformance

The permanent round-trip conformance test uses source bytes:

`00 41 ff 7f 42`

Source byte length:

`5`

Expected SHA-256:

`78ed3c348bf298650d86f06518bc13cd90c63a9c060e40bb39d684039c7f2781`

The test requires:

- retrieved byte length equals original byte length;
- Phase 002 `sha256Bytes(original)` equals the expected digest;
- Phase 002 `sha256Bytes(retrieved)` equals the same digest;
- retrieved bytes deep-equal original bytes.

This connects Phase 003 retrieval conformance directly to the sealed Phase 002 digest implementation.

No second production hashing implementation was introduced.

## Live storage evidence

A real repository-driven Pinata/IPFS round trip was executed during Phase 003.

Observed public evidence:

- upload authorization: PASS
- signed upload capability: obtained but intentionally not printed
- upload: PASS
- canonical storage reference: `ipfs://bafkreieu5no6jfbwcp6qjdojgoj2wbuhoqc7vi44ch2t5e4gbazttaz6py`
- controlled gateway: `https://gateway.pinata.cloud`
- retrieval attempts: 1
- original byte count: 64
- retrieved byte count: 64
- byte-count match: true
- original SHA-256: `94eb5de4943613fd048dc93393ab06877405faa39c11f53e9386083339833e7e`
- retrieved SHA-256: `94eb5de4943613fd048dc93393ab06877405faa39c11f53e9386083339833e7e`
- digest match: true
- exact-byte match: true
- live runner exit code: 0
- post-run repository diff check: PASS

No JWT, bearer token, signed capability, API secret, or other private credential material was recorded.

## What the live evidence proves

The observed live round trip proves that, at that time, the actual bounty-repository implementation could:

1. construct deterministic artifact bytes;
2. obtain a short-lived Pinata upload capability through the repository server route;
3. upload the artifact through the repository upload helper;
4. obtain an IPFS CID;
5. reduce that result to canonical Proof Anchor IPFS identity;
6. retrieve the artifact through the repository controlled gateway path;
7. reproduce the original byte count;
8. reproduce the original SHA-256 digest;
9. reproduce the exact original bytes.

The provider upload response alone was not treated as sufficient reconstruction evidence.

Retrieval and independent digest reproduction supplied the stronger observed evidence.

## What the live evidence does not prove

The live evidence does not prove:

- permanent IPFS availability;
- permanent Pinata availability;
- independent long-term replication by multiple providers;
- that every public IPFS gateway will retrieve the artifact forever;
- Phase 004 server admission;
- HCS consensus commitment;
- Hedera proof-locator durability;
- Mirror Node readback;
- browser-side final verification.

Successful Phase 003 storage remains distinct from later proof-lifecycle stages.

## Final implementation evidence

Observed before implementation merge:

- Proof Anchor tests: 70
- passed: 70
- failed: 0
- cancelled: 0
- skipped: 0
- todo: 0
- typecheck: PASS
- lint: PASS with zero lint warnings or errors
- production build: PASS
- Phase 003 diff check against the sealed Phase 002 base: PASS
- final worktree `git diff --check`: PASS
- dependency inspection: PASS
- environment-surface inspection: PASS
- storage-export inspection: PASS
- server-route inspection: PASS
- prohibited client-secret search: no matches
- later-phase implementation search: no matches
- speculative storage-abstraction search: no matches
- Minimality Gate: PASS

The final local gate was observed on branch state:

`ffa7df0e9c0b1c44a2c1e8b03c800aba7b81e60b`

The implementation PR head later became:

`3bc845f80caf7845c7dcd243b05449125e18c1e3`

The later commit recorded final local evidence in documentation and did not add production implementation.

## Production build observation

The production build passed.

It continued to emit the inherited DaisyUI / Google Fonts generated-CSS `@import` ordering warning.

The warning remained non-fatal.

Phase 003 did not absorb unrelated scaffold CSS cleanup.

## Minimality Gate

The final Phase 003 implementation surface was inspected before merge.

Observed absence checks found:

- no client-exposed Pinata JWT pattern;
- no HCS submission implementation;
- no Mirror Node implementation;
- no Hedera proof-locator implementation;
- no Phase 004 server-admission implementation;
- no generic `StorageProvider` abstraction;
- no provider registry;
- no adapter/factory/plugin registry.

The permanent storage-conformance closure changed only the existing storage retrieval test.

No new production file, dependency, route, configuration key, fixture, abstraction, or provider layer was added merely to satisfy the conformance requirement.

No Phase 003 production file, dependency, export, route, or configuration path was identified as speculative relative to the frozen contract.

## Trust boundaries preserved

Phase 003 preserves the following distinctions:

### Artifact identity versus storage identity

Artifact identity is the digest of exact artifact bytes.

Storage identity is the canonical IPFS CID/reference.

They are related but not interchangeable.

### Provider assertion versus independent reconstruction

Provider upload success does not independently establish artifact reconstruction.

Retrieved bytes are compared independently.

### Gateway versus identity

A gateway is transport.

The gateway origin is not canonical proof identity.

### Storage versus admission

Successful storage does not mean the proof is admitted.

Server-controlled admission belongs to Phase 004.

### Storage versus consensus

Successful storage does not mean anything has been committed to Hedera.

HCS commitment belongs to Phase 005.

### Storage versus readback

Successful storage does not establish public Mirror Node readback.

Mirror Node readback belongs to a later phase.

## Phase boundary

Phase 003 intentionally did not implement:

- server-controlled proof admission;
- full hostile-input admission policy;
- HCS topic governance;
- HCS message submission;
- Hedera proof locators;
- Mirror Node readback;
- independent browser verification;
- integrated lifecycle completion.

Those remain assigned to later pipeline phases.

## Canonical implementation result

Phase 003 is implemented on `main` at:

`040fa6325cd2fc421a448decf685d13dcf4e575e`

That anchor is real and was observed only after PR #7 was squash-merged.

## Documentation merge anchor

`508cc0c27ebbb39864606510bbeb0400fc184925`

This is the GitHub squash-merge commit for documentation PR #8.

Documentation PR #8 passed GitHub CI before merge.

Observed documentation PR CI:

- run: `35684287160`
- job: `106607704886`
- workflow: `Lint`
- result: PASS

Post-merge `main` CI also passed.

Observed documentation post-merge main CI:

- run: `35684403193`
- job: `106608048467`
- workflow: `Lint`
- result: PASS

## Anchor repair

Completed by the final record-only anchor-repair stage.

This stage:

- records the real documentation squash anchor;
- records documentation PR and post-merge CI evidence;
- marks Phase 003 `SEALED`;
- changes no production implementation.
