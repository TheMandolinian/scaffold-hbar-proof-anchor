import { POST } from "../../app/api/storage/ipfs/upload-auth/route";
import assert from "node:assert/strict";
import { afterEach, test } from "node:test";

const originalFetch = globalThis.fetch;
const originalPinataJwt = process.env.PINATA_JWT;

afterEach(() => {
  globalThis.fetch = originalFetch;

  if (originalPinataJwt === undefined) {
    delete process.env.PINATA_JWT;
  } else {
    process.env.PINATA_JWT = originalPinataJwt;
  }
});

function makeRequest(body: string): Request {
  return new Request("http://localhost/api/storage/ipfs/upload-auth", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body,
  });
}

test("rejects malformed JSON without contacting Pinata", async () => {
  let called = false;

  globalThis.fetch = async () => {
    called = true;
    throw new Error("unexpected network call");
  };

  const response = await POST(makeRequest("{"));

  assert.equal(response.status, 400);
  assert.equal(called, false);
});

test("rejects non-object JSON bodies without contacting Pinata", async () => {
  for (const value of [null, [], "text", 42]) {
    let called = false;

    globalThis.fetch = async () => {
      called = true;
      throw new Error("unexpected network call");
    };

    const response = await POST(makeRequest(JSON.stringify(value)));

    assert.equal(response.status, 400);
    assert.equal(called, false);
  }
});

test("rejects invalid contentLength values without contacting Pinata", async () => {
  for (const contentLength of [-1, 1.5, "4", null]) {
    let called = false;

    globalThis.fetch = async () => {
      called = true;
      throw new Error("unexpected network call");
    };

    const response = await POST(makeRequest(JSON.stringify({ contentLength })));

    assert.equal(response.status, 400);
    assert.equal(called, false);
  }
});

test("rejects requests when the server-side Pinata credential is absent", async () => {
  delete process.env.PINATA_JWT;

  let called = false;

  globalThis.fetch = async () => {
    called = true;
    throw new Error("unexpected network call");
  };

  const response = await POST(makeRequest(JSON.stringify({ contentLength: 4 })));

  assert.equal(response.status, 500);
  assert.equal(called, false);
});

test("mints a short-lived size-bounded public upload capability", async () => {
  process.env.PINATA_JWT = "server-test-secret";

  let requestedUrl = "";
  let requestedInit: RequestInit | undefined;

  globalThis.fetch = async (input, init) => {
    requestedUrl = String(input);
    requestedInit = init;

    return new Response(
      JSON.stringify({
        data: "https://uploads.pinata.cloud/v3/files/signed?token=test-capability",
      }),
      {
        status: 200,
        headers: {
          "content-type": "application/json",
        },
      },
    );
  };

  const response = await POST(makeRequest(JSON.stringify({ contentLength: 4 })));

  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), {
    uploadUrl: "https://uploads.pinata.cloud/v3/files/signed?token=test-capability",
  });

  assert.equal(requestedUrl, "https://uploads.pinata.cloud/v3/files/sign");
  assert.equal(requestedInit?.method, "POST");

  const headers = new Headers(requestedInit?.headers);
  assert.equal(headers.get("authorization"), "Bearer server-test-secret");
  assert.equal(headers.get("content-type"), "application/json");

  assert.equal(typeof requestedInit?.body, "string");

  const payload = JSON.parse(requestedInit?.body as string);

  assert.equal(payload.expires, 60);
  assert.equal(payload.network, "public");
  assert.equal(payload.max_file_size, 4);
  assert.equal("cid_version" in payload, false);
});

test("keeps a zero-byte upload capability size-bounded", async () => {
  process.env.PINATA_JWT = "server-test-secret";

  let signedRequestBody = "";

  globalThis.fetch = async (_input, init) => {
    signedRequestBody = String(init?.body);

    return new Response(
      JSON.stringify({
        data: "https://uploads.pinata.cloud/v3/files/signed?token=zero-byte-capability",
      }),
      {
        status: 200,
        headers: {
          "content-type": "application/json",
        },
      },
    );
  };

  const response = await POST(makeRequest(JSON.stringify({ contentLength: 0 })));

  assert.equal(response.status, 200);

  const payload = JSON.parse(signedRequestBody);

  assert.equal(payload.max_file_size, 1);
});

test("maps Pinata signing failure to an upload-authorization failure", async () => {
  process.env.PINATA_JWT = "server-test-secret";

  globalThis.fetch = async () =>
    new Response("provider failure", {
      status: 500,
    });

  const response = await POST(makeRequest(JSON.stringify({ contentLength: 4 })));

  assert.equal(response.status, 502);
  assert.deepEqual(await response.json(), {
    error: "Pinata upload authorization failed",
  });
});
