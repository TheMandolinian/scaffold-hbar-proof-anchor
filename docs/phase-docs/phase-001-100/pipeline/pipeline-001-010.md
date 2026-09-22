# Proof Anchor Competition Pipeline — 001–010

## 001 — Repository Foundation / Clean Scaffold

Authoritative Scaffold-HBAR baseline, demo removal, dependency cleanup, governance, healthy build baseline.

## 002 — Canonical Proof + Digest Core

Implement sha256-bytes/v1, ArtifactHasher, six-field hbar-proof-anchor/v1 schema, strict parsing, RFC 8785-compatible canonicalization, duplicate-key rejection, fixtures, and chunk-invariance tests.

## 003 — IPFS Storage + Retrieval

Implement CID normalization, provider-neutral ipfs:// references, Pinata upload integration, controlled retrieval, exact-byte round trip, and storage conformance.

## 004 — Server Admission

Implement hostile-input validation, independent retrieval, streaming hash, observed byte counting, resource limits, timeout, SSRF controls, and structured rejection.

## 005 — Governed HCS Commitment

Implement submit-key-authorized canonical HCS submission, receipt handling, sequence extraction, durable hedera-hcs:// locator, and real testnet evidence.

## 006 — Exact Mirror Readback

Implement topic + sequence lookup, bounded indexing retry, exact message bytes, schema validation, and canonical readback validation.

## 007 — Browser Verification

Implement Worker-based streaming hashing, run isolation, cancellation, remote reconstruction, local attestation, and deterministic comparison.

## 008 — Integrated Lifecycle

Join creation, admission, consensus, durable locator persistence, readback, retrieval, verification, and truthful UI state.

## 009 — Failure + Security Hardening

Exercise malformed input, mismatch, oversize, timeouts, gateway failure, redirects, Mirror Node delay, stale Worker results, cancellation, secret exposure, and SSRF attempts.

## 010 — Template / Bounty Hardening

Complete judge-first README, architecture/trust-flow documentation, security/limitations, public testnet evidence, CI, secret scan, fresh-scaffold rehearsal, stranger test, final minimality pass, and official eligibility validation.

## Standing rule

Do not pull later-phase functionality forward merely because it is convenient.

The generated template is the product.
