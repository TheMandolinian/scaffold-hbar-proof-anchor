# AGENTS.md — Proof Anchor Guardrails

## Mandatory architecture

- CID is storage identity, not artifact digest.
- Artifact digest is SHA-256 over exact artifact bytes.
- Browser claims are not admission authority.
- Admission independently retrieves, hashes, and counts bytes.
- Only admitted canonical bytes enter sanctioned HCS submission.
- HCS secrets remain server-side.
- Consensus does not imply readback.
- Readback does not imply verification.
- Unavailable does not mean mismatch.
- Unknown does not mean verified.
- Canonical schema changes require versioning.

Canonical v1 fields only:
schema, digest_profile, artifact_digest, storage_scheme, storage_ref, content_length.

Do not add filename, MIME type, gateway URL, timestamp, correlation ID, run ID, UI state, transaction ID, topic ID, or sequence number to canonical proof bytes.

Do not add decorative Solidity, HTS, NFTs, tokens, payments, databases, indexers, or dead abstractions.

## Minimality

Every production file, dependency, abstraction, exported API, and persistent code path must be justified by the active phase contract, normative architecture, or demonstrated testing/security need.

## Git

Never edit directly on main.
Never predict squash merge hashes.
Use implementation merge, docs merge, then anchor repair.

## Terminal

Do not use exit, || exit 1, or equivalent shell-terminating constructs in interactive Codespaces blocks.

## Evidence

Proof Anchor does not prove truth, ownership, authorship, originality, legality, first existence, confidentiality, or malware safety.

The UI reports only evidence actually possessed.
