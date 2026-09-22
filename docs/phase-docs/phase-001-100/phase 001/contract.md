# Phase 001 — Repository Foundation / Clean Scaffold

## Objective

Establish the clean authoritative Scaffold-HBAR competition baseline for Proof Anchor before protocol implementation begins.

## Authoritative upstream

- create-scaffold-hbar: 0.4.0
- repository: hedera-dev/scaffold-hbar
- branch: templates/hedera-demo
- source anchor: 64fc32d2467c7134e0e6dc121d5fd878c9f39ea5
- frontend: nextjs-app
- solidityFramework: none
- packageManager: yarn

## In scope

- materialize and validate authoritative upstream
- preserve MIT attribution
- remove inherited Proof Wall / HTS demo behavior
- remove unused wallet/provider/demo infrastructure
- remove demonstrated dead dependencies
- establish Proof Anchor foundation UI
- establish repository-local governance
- establish competition pipeline 001–010
- preserve healthy install, lint, typecheck, and build gates

## Out of scope

Phase 001 does not implement:

- canonical digest or proof
- IPFS / Pinata
- admission
- HCS submission
- Mirror Node readback
- browser verification
- integrated Proof Anchor workflow

No fake protocol behavior belongs in this phase.

## Minimality gate

Every production file, dependency, abstraction, exported API, and persistent code path must be justified by the active phase contract, a normative architecture requirement, or demonstrated testability/security need.

Speculative extensibility is not sufficient.

## Close condition

Phase 001 must leave:

- truthful Proof Anchor branding
- no inherited demo UI/API behavior
- no required Solidity workspace
- healthy dependency install
- lint PASS
- standalone typecheck PASS
- production build PASS
- truthful template.json
- preserved LICENSE attribution
- no committed secrets
- repository-local phase governance

A Phase 001 PASS proves repository foundation health only. It does not prove the Proof Anchor protocol is implemented.
