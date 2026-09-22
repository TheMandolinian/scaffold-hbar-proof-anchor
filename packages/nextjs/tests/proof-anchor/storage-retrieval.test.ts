import { sha256Bytes } from "../../utils/proof-anchor/digest";
import { retrieveIpfsBytes } from "../../utils/proof-anchor/storageRetrieval";
import assert from "node:assert/strict";
import test from "node:test";

const CID = "bafybeiabz5dveh6jsfmuq4xgpbvdbkmgq6bvubo34xqobxczvqazrcrbou";
const STORAGE_REF = `ipfs://${CID}`;

function byteResponse(bytes: number[], status = 200): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    arrayBuffer: async () => Uint8Array.from(bytes).buffer,
  } as Response;
}

test("retrieves exact artifact bytes from the configured gateway origin", async () => {
  let requestedUrl = "";
  let requestedMethod = "";

  const bytes = await retrieveIpfsBytes(STORAGE_REF, "https://gateway.example", async (input, init) => {
    requestedUrl = String(input);
    requestedMethod = init?.method ?? "";
    return byteResponse([0x00, 0x41, 0xff, 0x7f]);
  });

  assert.equal(requestedUrl, `https://gateway.example/ipfs/${CID}`);
  assert.equal(requestedMethod, "GET");
  assert.deepEqual(bytes, Uint8Array.from([0x00, 0x41, 0xff, 0x7f]));
});

test("retrieved bytes reproduce original byte length and Phase 002 SHA-256 digest", async () => {
  const original = Uint8Array.from([0x00, 0x41, 0xff, 0x7f, 0x42]);
  const expectedDigest = "78ed3c348bf298650d86f06518bc13cd90c63a9c060e40bb39d684039c7f2781";

  const retrieved = await retrieveIpfsBytes(STORAGE_REF, "https://gateway.example", async () =>
    byteResponse(Array.from(original)),
  );

  assert.equal(original.byteLength, 5);
  assert.equal(sha256Bytes(original), expectedDigest);
  assert.equal(retrieved.byteLength, original.byteLength);
  assert.equal(sha256Bytes(retrieved), expectedDigest);
  assert.deepEqual(retrieved, original);
});

test("normalizes a trailing slash on the controlled gateway origin", async () => {
  let requestedUrl = "";

  await retrieveIpfsBytes(STORAGE_REF, "https://gateway.example/", async input => {
    requestedUrl = String(input);
    return byteResponse([1]);
  });

  assert.equal(requestedUrl, `https://gateway.example/ipfs/${CID}`);
});

test("requires canonical ipfs storage identity before network retrieval", async () => {
  let called = false;

  await assert.rejects(
    retrieveIpfsBytes(CID, "https://gateway.example", async () => {
      called = true;
      return byteResponse([1]);
    }),
    /ipfs:\/\/ scheme/,
  );

  assert.equal(called, false);
});

test("rejects noncanonical CID text before network retrieval", async () => {
  const cidV0 = "QmNTiSDCX8Kh6ddnqvH6dxyFEDBcBTyoKE7vki9h6x7LZA";
  let called = false;

  await assert.rejects(
    retrieveIpfsBytes(`ipfs://${cidV0}`, "https://gateway.example", async () => {
      called = true;
      return byteResponse([1]);
    }),
    /canonical CIDv1 base32 lowercase form/,
  );

  assert.equal(called, false);
});

test("rejects gateway origins containing paths", async () => {
  await assert.rejects(
    retrieveIpfsBytes(STORAGE_REF, "https://gateway.example/custom", async () => byteResponse([1])),
    /origin without a path/,
  );
});

test("rejects gateway origins containing credentials", async () => {
  await assert.rejects(
    retrieveIpfsBytes(STORAGE_REF, "https://user:pass@gateway.example", async () => byteResponse([1])),
    /must not contain credentials/,
  );
});

test("rejects gateway origins containing query or fragment data", async () => {
  await assert.rejects(
    retrieveIpfsBytes(STORAGE_REF, "https://gateway.example/?x=1", async () => byteResponse([1])),
    /query or fragment/,
  );

  await assert.rejects(
    retrieveIpfsBytes(STORAGE_REF, "https://gateway.example/#x", async () => byteResponse([1])),
    /query or fragment/,
  );
});

test("rejects unsupported gateway protocols", async () => {
  await assert.rejects(
    retrieveIpfsBytes(STORAGE_REF, "ftp://gateway.example", async () => byteResponse([1])),
    /must use http or https/,
  );
});

test("distinguishes HTTP retrieval failure from artifact mismatch", async () => {
  await assert.rejects(
    retrieveIpfsBytes(STORAGE_REF, "https://gateway.example", async () => byteResponse([], 404)),
    /retrieval failed with HTTP 404/,
  );
});

test("distinguishes transport failure from artifact mismatch", async () => {
  await assert.rejects(
    retrieveIpfsBytes(STORAGE_REF, "https://gateway.example", async () => {
      throw new Error("offline");
    }),
    /IPFS gateway retrieval failed/,
  );
});
