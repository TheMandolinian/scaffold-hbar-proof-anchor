# Proof Anchor

Proof Anchor is a Scaffold-HBAR template for artifact integrity using decentralized storage and Hedera Consensus Service.

It is designed to store artifact bytes through IPFS, admit a canonical proof through an independent server boundary, commit that proof to HCS, read it back through Mirror Node, and independently verify the artifact.

## Phase 001 status

Repository Foundation / Clean Scaffold is being established now. The Proof Anchor protocol itself is not implemented yet.

## Core boundaries

- artifact digest != IPFS CID
- admission != consensus
- consensus != readback
- readback != verification
- unavailable != mismatch

Proof Anchor does not by itself prove truth, ownership, authorship, originality, legality, first existence, confidentiality, or malware safety.

## Hedera

Hedera Consensus Service is load-bearing. Proof Anchor v1 intentionally requires no Solidity, HTS, NFTs, tokens, or payments.

## Provenance

- create-scaffold-hbar 0.4.0
- hedera-dev/scaffold-hbar
- branch: templates/hedera-demo
- source: 64fc32d2467c7134e0e6dc121d5fd878c9f39ea5
- frontend: nextjs-app
- Solidity framework: none
- package manager: yarn

## Development

Run: corepack enable
Run: yarn install --immutable
Run: yarn lint
Run: yarn next:check-types
Run: yarn next:build

Release target:
npm create scaffold-hbar@latest --template TheMandolinian/scaffold-hbar-proof-anchor

See docs/phase-docs/phase-001-100/pipeline/pipeline-001-010.md.

MIT licensed. See LICENSE.
