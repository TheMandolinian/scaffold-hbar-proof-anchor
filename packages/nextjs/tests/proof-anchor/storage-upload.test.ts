import { uploadIpfsArtifact } from "../../utils/proof-anchor/storageUpload";
import assert from "node:assert/strict";
import test from "node:test";

const CID_V1 = "bafybeiabz5dveh6jsfmuq4xgpbvdbkmgq6bvubo34xqobxczvqazrcrbou";
const CID_V0 = "QmNTiSDCX8Kh6ddnqvH6dxyFEDBcBTyoKE7vki9h6x7LZA";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });
}

test("uploads exact file bytes through the signed capability without bearer authorization", async () => {
  const source = Uint8Array.from([0x00, 0x41, 0xff, 0x7f]);
  const file = new File([source], "artifact.bin", { type: "application/octet-stream" });

  let requestedUrl = "";
  let requestedMethod = "";
  let requestedHeaders: HeadersInit | undefined;
  let observedBody: FormData | undefined;

  const storageRef = await uploadIpfsArtifact(
    file,
    "https://uploads.pinata.cloud/v3/files/signed?token=example",
    async (input, init) => {
      requestedUrl = String(input);
      requestedMethod = init?.method ?? "";
      requestedHeaders = init?.headers;
      observedBody = init?.body as FormData;

      return jsonResponse({ data: { cid: CID_V1 } });
    },
  );

  assert.equal(requestedUrl, "https://uploads.pinata.cloud/v3/files/signed?token=example");
  assert.equal(requestedMethod, "POST");
  assert.equal(requestedHeaders, undefined);

  assert.ok(observedBody instanceof FormData);
  assert.equal(observedBody.get("network"), "public");
  assert.equal(observedBody.get("name"), "artifact.bin");
  assert.equal(observedBody.get("cid_version"), "v1");

  const observedFile = observedBody.get("file");
  assert.ok(observedFile instanceof File);
  assert.deepEqual(new Uint8Array(await observedFile.arrayBuffer()), source);

  assert.equal(storageRef, `ipfs://${CID_V1}`);
});

test("normalizes a provider-returned CIDv0 into canonical storage identity", async () => {
  const file = new File([Uint8Array.from([1])], "artifact.bin");

  const storageRef = await uploadIpfsArtifact(file, "https://uploads.pinata.cloud/v3/files/signed", async () =>
    jsonResponse({ data: { cid: CID_V0 } }),
  );

  assert.match(storageRef, /^ipfs:\/\/b[a-z2-7]+$/);
  assert.notEqual(storageRef, `ipfs://${CID_V0}`);
});

test("rejects malformed provider-returned CID data", async () => {
  const file = new File([Uint8Array.from([1])], "artifact.bin");

  await assert.rejects(
    uploadIpfsArtifact(file, "https://uploads.pinata.cloud/v3/files/signed", async () =>
      jsonResponse({ data: { cid: "not-a-cid" } }),
    ),
  );
});

test("rejects upload responses that omit the CID", async () => {
  const file = new File([Uint8Array.from([1])], "artifact.bin");

  await assert.rejects(
    uploadIpfsArtifact(file, "https://uploads.pinata.cloud/v3/files/signed", async () => jsonResponse({ data: {} })),
    /did not contain a CID/,
  );
});

test("distinguishes HTTP upload failure from storage identity success", async () => {
  const file = new File([Uint8Array.from([1])], "artifact.bin");

  await assert.rejects(
    uploadIpfsArtifact(file, "https://uploads.pinata.cloud/v3/files/signed", async () => jsonResponse({}, 403)),
    /IPFS upload failed with HTTP 403/,
  );
});

test("distinguishes upload transport failure from storage identity success", async () => {
  const file = new File([Uint8Array.from([1])], "artifact.bin");

  await assert.rejects(
    uploadIpfsArtifact(file, "https://uploads.pinata.cloud/v3/files/signed", async () => {
      throw new Error("offline");
    }),
    /IPFS upload failed/,
  );
});

test("rejects non-HTTPS signed upload URLs before network use", async () => {
  const file = new File([Uint8Array.from([1])], "artifact.bin");
  let called = false;

  await assert.rejects(
    uploadIpfsArtifact(file, "http://uploads.pinata.cloud/v3/files/signed", async () => {
      called = true;
      return jsonResponse({ data: { cid: CID_V1 } });
    }),
    /must use https/,
  );

  assert.equal(called, false);
});
