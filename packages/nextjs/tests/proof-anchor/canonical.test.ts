import {
  canonicalProofV1Bytes,
  canonicalProofV1Json,
  parseCanonicalProofV1Bytes,
  parseProofV1Json,
} from "../../utils/proof-anchor/canonical";
import { PROOF_SCHEMA_V1, STORAGE_SCHEME_V1 } from "../../utils/proof-anchor/proof";
import canonicalize from "canonicalize";
import assert from "node:assert/strict";
import test from "node:test";

const VALID_PROOF = {
  schema: PROOF_SCHEMA_V1,
  digest_profile: "sha256-bytes/v1",
  artifact_digest: "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad",
  storage_scheme: STORAGE_SCHEME_V1,
  storage_ref: "ipfs://example",
  content_length: 3,
};

const CANONICAL_JSON =
  '{"artifact_digest":"ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad","content_length":3,"digest_profile":"sha256-bytes/v1","schema":"hbar-proof-anchor/v1","storage_ref":"ipfs://example","storage_scheme":"ipfs"}';

test("produces a fixed canonical v1 proof representation", () => {
  assert.equal(canonicalProofV1Json(VALID_PROOF), CANONICAL_JSON);
});

test("canonical serialization ignores source insertion order", () => {
  const reordered = {
    content_length: 3,
    storage_ref: "ipfs://example",
    schema: PROOF_SCHEMA_V1,
    artifact_digest: VALID_PROOF.artifact_digest,
    storage_scheme: STORAGE_SCHEME_V1,
    digest_profile: "sha256-bytes/v1",
  };

  assert.equal(canonicalProofV1Json(reordered), CANONICAL_JSON);
});

test("canonical proof bytes are exact UTF-8 canonical JSON bytes", () => {
  assert.deepEqual(canonicalProofV1Bytes(VALID_PROOF), new TextEncoder().encode(CANONICAL_JSON));
});

test("strict JSON parsing accepts a valid proof independent of formatting", () => {
  const pretty = JSON.stringify(VALID_PROOF, null, 2);

  assert.deepEqual(parseProofV1Json(pretty), VALID_PROOF);
});

test("canonical proof parser accepts exact canonical bytes", () => {
  const bytes = new TextEncoder().encode(CANONICAL_JSON);

  assert.deepEqual(parseCanonicalProofV1Bytes(bytes), VALID_PROOF);
});

test("reordered semantically valid proof bytes are noncanonical", () => {
  const bytes = new TextEncoder().encode(JSON.stringify(VALID_PROOF));

  assert.throws(() => parseCanonicalProofV1Bytes(bytes), /not canonical/);
});

test("leading and trailing whitespace make proof bytes noncanonical", () => {
  for (const source of [` ${CANONICAL_JSON}`, `${CANONICAL_JSON}\n`]) {
    assert.throws(() => parseCanonicalProofV1Bytes(new TextEncoder().encode(source)), /not canonical/);
  }
});

test("rejects duplicate top-level JSON keys", () => {
  const source =
    '{"schema":"hbar-proof-anchor/v1","schema":"hbar-proof-anchor/v1","digest_profile":"sha256-bytes/v1","artifact_digest":"ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad","storage_scheme":"ipfs","storage_ref":"ipfs://example","content_length":3}';

  assert.throws(() => parseProofV1Json(source), /Duplicate JSON object key: schema/);
});

test("duplicate detection compares decoded JSON key values", () => {
  const source =
    '{"schema":"hbar-proof-anchor/v1","\\u0073chema":"hbar-proof-anchor/v1","digest_profile":"sha256-bytes/v1","artifact_digest":"ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad","storage_scheme":"ipfs","storage_ref":"ipfs://example","content_length":3}';

  assert.throws(() => parseProofV1Json(source), /Duplicate JSON object key: schema/);
});

test("rejects malformed JSON", () => {
  assert.throws(() => parseProofV1Json('{"schema":'), SyntaxError);
});

test("strict parsing still enforces the six-field proof schema", () => {
  assert.throws(() =>
    parseProofV1Json(
      JSON.stringify({
        ...VALID_PROOF,
        filename: "artifact.txt",
      }),
    ),
  );
});

test("rejects malformed UTF-8 proof bytes", () => {
  assert.throws(() => parseCanonicalProofV1Bytes(Uint8Array.from([0xc3, 0x28])), /valid UTF-8/);
});

test("selected JCS implementation matches an RFC 8785 canonicalization vector", () => {
  const value = {
    numbers: [333333333.33333329, 1e30, 4.5, 2e-3, 1e-27],
    literals: [null, true, false],
  };

  assert.equal(
    canonicalize(value),
    '{"literals":[null,true,false],"numbers":[333333333.3333333,1e+30,4.5,0.002,1e-27]}',
  );
});

test("JCS canonicalization rejects lone-surrogate string data", () => {
  assert.throws(() =>
    canonicalProofV1Json({
      ...VALID_PROOF,
      storage_ref: "ipfs://\ud800",
    }),
  );
});
