import {
  normalizeIpfsCid,
  normalizeIpfsStorageRef,
  parseCanonicalIpfsStorageRef,
} from "../../utils/proof-anchor/storageIdentity";
import assert from "node:assert/strict";
import test from "node:test";

const CID_V0 = "QmNTiSDCX8Kh6ddnqvH6dxyFEDBcBTyoKE7vki9h6x7LZA";
const CID_V1_BASE32 = "bafybeiabz5dveh6jsfmuq4xgpbvdbkmgq6bvubo34xqobxczvqazrcrbou";
const STORAGE_REF = `ipfs://${CID_V1_BASE32}`;

test("normalizes CIDv0 to deterministic CIDv1 base32 lowercase", () => {
  assert.equal(normalizeIpfsCid(CID_V0), CID_V1_BASE32);
});

test("canonical CIDv1 remains unchanged", () => {
  assert.equal(normalizeIpfsCid(CID_V1_BASE32), CID_V1_BASE32);
});

test("constructs provider-neutral canonical ipfs storage references", () => {
  assert.equal(normalizeIpfsStorageRef(CID_V0), STORAGE_REF);
  assert.equal(normalizeIpfsStorageRef(CID_V1_BASE32), STORAGE_REF);
});

test("normalizes ipfs references containing a normalizable CID", () => {
  assert.equal(normalizeIpfsStorageRef(`ipfs://${CID_V0}`), STORAGE_REF);
});

test("parses an exact canonical storage reference", () => {
  assert.equal(parseCanonicalIpfsStorageRef(STORAGE_REF), CID_V1_BASE32);
});

test("canonical parser rejects a noncanonical CID representation", () => {
  assert.throws(() => parseCanonicalIpfsStorageRef(`ipfs://${CID_V0}`), /canonical CIDv1 base32 lowercase form/);
});

test("rejects empty and malformed CID input", () => {
  assert.throws(() => normalizeIpfsCid(""), /non-empty/);
  assert.throws(() => normalizeIpfsCid("not-a-cid"), /Invalid IPFS CID/);
});

test("rejects surrounding whitespace instead of silently normalizing it", () => {
  assert.throws(() => normalizeIpfsCid(` ${CID_V1_BASE32}`), /surrounding whitespace/);
  assert.throws(() => normalizeIpfsStorageRef(`${STORAGE_REF} `), /surrounding whitespace/);
});

test("rejects gateway URLs as canonical storage identity", () => {
  assert.throws(() => normalizeIpfsStorageRef(`https://gateway.example/ipfs/${CID_V1_BASE32}`), /Invalid IPFS CID/);
});

test("rejects path, query, and fragment material after the root CID", () => {
  assert.throws(() => normalizeIpfsStorageRef(`${STORAGE_REF}/artifact.bin`), /Invalid IPFS CID/);
  assert.throws(() => normalizeIpfsStorageRef(`${STORAGE_REF}?download=1`), /Invalid IPFS CID/);
  assert.throws(() => normalizeIpfsStorageRef(`${STORAGE_REF}#fragment`), /Invalid IPFS CID/);
});

test("rejects an empty ipfs reference", () => {
  assert.throws(() => normalizeIpfsStorageRef("ipfs://"), /must contain a CID/);
});

test("canonical parser requires the exact ipfs scheme", () => {
  assert.throws(() => parseCanonicalIpfsStorageRef(CID_V1_BASE32), /ipfs:\/\/ scheme/);
  assert.throws(() => parseCanonicalIpfsStorageRef(`IPFS://${CID_V1_BASE32}`), /ipfs:\/\/ scheme/);
});
