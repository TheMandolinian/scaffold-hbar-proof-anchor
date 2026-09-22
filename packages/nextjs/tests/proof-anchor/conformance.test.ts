import {
  canonicalProofV1Bytes,
  parseCanonicalProofV1Bytes,
  parseProofV1Json,
} from "../../utils/proof-anchor/canonical";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const CANONICAL_BYTES = readFileSync(new URL("./fixtures/proof-v1-canonical.fixture", import.meta.url));

const NONCANONICAL_BYTES = readFileSync(new URL("./fixtures/proof-v1-noncanonical.fixture", import.meta.url));

const DUPLICATE_KEY_BYTES = readFileSync(new URL("./fixtures/proof-v1-duplicate-key.fixture", import.meta.url));

test("canonical fixture round-trips as exact canonical proof bytes", () => {
  const proof = parseCanonicalProofV1Bytes(CANONICAL_BYTES);

  assert.equal(proof.content_length, 3);
  assert.deepEqual(Buffer.from(canonicalProofV1Bytes(proof)), CANONICAL_BYTES);
});

test("noncanonical fixture remains semantically valid but fails canonical-byte validation", () => {
  const source = NONCANONICAL_BYTES.toString("utf8");

  assert.doesNotThrow(() => parseProofV1Json(source));
  assert.throws(() => parseCanonicalProofV1Bytes(NONCANONICAL_BYTES), /not canonical/);
});

test("duplicate-key fixture is rejected before ordinary JSON parsing can collapse the duplicate", () => {
  const source = DUPLICATE_KEY_BYTES.toString("utf8");

  assert.throws(() => parseProofV1Json(source), /Duplicate JSON object key: schema/);
});
