import { ArtifactHasher, DIGEST_PROFILE_V1, sha256Bytes } from "../../utils/proof-anchor/digest";
import assert from "node:assert/strict";
import test from "node:test";

const encoder = new TextEncoder();

test("digest profile identity is frozen", () => {
  assert.equal(DIGEST_PROFILE_V1, "sha256-bytes/v1");
});

test("SHA-256 known-answer vector: empty bytes", () => {
  assert.equal(sha256Bytes(new Uint8Array()), "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855");
});

test("SHA-256 known-answer vector: abc", () => {
  assert.equal(sha256Bytes(encoder.encode("abc")), "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad");
});

test("incremental hashing is invariant across chunk boundaries", () => {
  const bytes = encoder.encode("Proof Anchor hashes exact artifact bytes.");

  const expected = sha256Bytes(bytes);

  const oneChunk = new ArtifactHasher();
  oneChunk.update(bytes);

  const manyChunks = new ArtifactHasher();
  manyChunks.update(bytes.subarray(0, 1));
  manyChunks.update(bytes.subarray(1, 7));
  manyChunks.update(bytes.subarray(7, 19));
  manyChunks.update(bytes.subarray(19));

  assert.equal(oneChunk.digestHex(), expected);
  assert.equal(manyChunks.digestHex(), expected);
  assert.equal(oneChunk.contentLength, bytes.byteLength);
  assert.equal(manyChunks.contentLength, bytes.byteLength);
});

test("exact bytes, including NUL bytes, are hashed without text reinterpretation", () => {
  const bytes = new Uint8Array([0x00, 0x41, 0x00, 0xff, 0x42]);

  const incremental = new ArtifactHasher();
  incremental.update(bytes.subarray(0, 2));
  incremental.update(bytes.subarray(2));

  assert.equal(incremental.digestHex(), sha256Bytes(bytes));
  assert.equal(incremental.contentLength, 5);
});

test("finalized ArtifactHasher rejects further use", () => {
  const hasher = new ArtifactHasher();
  hasher.update(encoder.encode("abc"));
  hasher.digestHex();

  assert.throws(() => hasher.update(new Uint8Array([1])));
  assert.throws(() => hasher.digestHex());
});
