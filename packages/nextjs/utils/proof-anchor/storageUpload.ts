import { normalizeIpfsStorageRef } from "./storageIdentity";

type FetchLike = (input: string | URL, init?: RequestInit) => Promise<Response>;

type PinataUploadEnvelope = {
  data?: {
    cid?: unknown;
  };
};

function parseSignedUploadUrl(input: string): URL {
  if (typeof input !== "string" || input.length === 0) {
    throw new TypeError("Signed upload URL must be a non-empty string");
  }

  if (input !== input.trim()) {
    throw new TypeError("Signed upload URL must not contain surrounding whitespace");
  }

  let url: URL;

  try {
    url = new URL(input);
  } catch {
    throw new TypeError("Invalid signed upload URL");
  }

  if (url.protocol !== "https:") {
    throw new TypeError("Signed upload URL must use https");
  }

  return url;
}

export async function uploadIpfsArtifact(
  file: File,
  signedUploadUrl: string,
  fetchImpl: FetchLike = fetch,
): Promise<string> {
  const url = parseSignedUploadUrl(signedUploadUrl);
  const name = file.name || "artifact";

  const body = new FormData();
  body.append("file", file, name);
  body.append("network", "public");
  body.append("name", name);
  body.append("cid_version", "v1");

  let response: Response;

  try {
    response = await fetchImpl(url.toString(), {
      method: "POST",
      body,
    });
  } catch {
    throw new Error("IPFS upload failed");
  }

  if (!response.ok) {
    throw new Error(`IPFS upload failed with HTTP ${response.status}`);
  }

  let payload: PinataUploadEnvelope;

  try {
    payload = (await response.json()) as PinataUploadEnvelope;
  } catch {
    throw new Error("IPFS upload returned an invalid response");
  }

  if (typeof payload.data?.cid !== "string") {
    throw new Error("IPFS upload response did not contain a CID");
  }

  return normalizeIpfsStorageRef(payload.data.cid);
}
