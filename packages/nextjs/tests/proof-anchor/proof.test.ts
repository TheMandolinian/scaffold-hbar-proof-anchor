import { PROOF_SCHEMA_V1, STORAGE_SCHEME_V1, validateProofV1 } from "../../utils/proof-anchor/proof";
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

test("accepts the exact six-field v1 proof shape", () => {
  assert.deepEqual(validateProofV1(VALID_PROOF), VALID_PROOF);
});

test("rejects missing canonical fields", () => {
  const proof: Record<string, unknown> = { ...VALID_PROOF };
  delete proof.content_length;
  assert.throws(() => validateProofV1(proof));
});

test("rejects additional fields", () => {
  assert.throws(() =>
    validateProofV1({
      ...VALID_PROOF,
      filename: "artifact.txt",
    }),
  );
});

test("rejects unsupported schema", () => {
  assert.throws(() =>
    validateProofV1({
      ...VALID_PROOF,
      schema: "hbar-proof-anchor/v2",
    }),
  );
});

test("rejects unsupported digest profile", () => {
  assert.throws(() =>
    validateProofV1({
      ...VALID_PROOF,
      digest_profile: "sha512-bytes/v1",
    }),
  );
});

test("rejects malformed or noncanonical SHA-256 digest text", () => {
  assert.throws(() =>
    validateProofV1({
      ...VALID_PROOF,
      artifact_digest: "BA7816BF8F01CFEA414140DE5DAE2223B00361A396177A9CB410FF61F20015AD",
    }),
  );

  assert.throws(() =>
    validateProofV1({
      ...VALID_PROOF,
      artifact_digest: "abc",
    }),
  );
});

test("rejects unsupported storage scheme", () => {
  assert.throws(() =>
    validateProofV1({
      ...VALID_PROOF,
      storage_scheme: "https",
    }),
  );
});

test("rejects empty storage references", () => {
  assert.throws(() =>
    validateProofV1({
      ...VALID_PROOF,
      storage_ref: "",
    }),
  );
});

test("accepts zero-byte artifacts", () => {
  const proof = validateProofV1({
    ...VALID_PROOF,
    artifact_digest: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
    content_length: 0,
  });

  assert.equal(proof.content_length, 0);
});

test("rejects invalid content lengths", () => {
  for (const contentLength of [-1, 1.5, Number.MAX_SAFE_INTEGER + 1, "3", null]) {
    assert.throws(() =>
      validateProofV1({
        ...VALID_PROOF,
        content_length: contentLength,
      }),
    );
  }
});
