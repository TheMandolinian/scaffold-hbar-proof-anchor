import { parseCanonicalIpfsStorageRef } from "./storageIdentity";

type FetchLike = (input: string | URL, init?: RequestInit) => Promise<Response>;

function parseGatewayOrigin(input: string): URL {
  if (typeof input !== "string" || input.length === 0) {
    throw new TypeError("IPFS gateway origin must be a non-empty string");
  }

  if (input !== input.trim()) {
    throw new TypeError("IPFS gateway origin must not contain surrounding whitespace");
  }

  let url: URL;

  try {
    url = new URL(input);
  } catch {
    throw new TypeError("Invalid IPFS gateway origin");
  }

  if (url.protocol !== "https:" && url.protocol !== "http:") {
    throw new TypeError("IPFS gateway origin must use http or https");
  }

  if (url.username || url.password) {
    throw new TypeError("IPFS gateway origin must not contain credentials");
  }

  if (url.search || url.hash) {
    throw new TypeError("IPFS gateway origin must not contain query or fragment data");
  }

  if (url.pathname !== "/" && url.pathname !== "") {
    throw new TypeError("IPFS gateway configuration must be an origin without a path");
  }

  return url;
}

function buildGatewayUrl(storageRef: string, gatewayOrigin: string): string {
  const cid = parseCanonicalIpfsStorageRef(storageRef);
  const gateway = parseGatewayOrigin(gatewayOrigin);

  return new URL(`/ipfs/${cid}`, gateway.origin).toString();
}

export async function retrieveIpfsBytes(
  storageRef: string,
  gatewayOrigin: string,
  fetchImpl: FetchLike = fetch,
): Promise<Uint8Array> {
  const url = buildGatewayUrl(storageRef, gatewayOrigin);

  let response: Response;

  try {
    response = await fetchImpl(url, { method: "GET" });
  } catch {
    throw new Error("IPFS gateway retrieval failed");
  }

  if (!response.ok) {
    throw new Error(`IPFS gateway retrieval failed with HTTP ${response.status}`);
  }

  return new Uint8Array(await response.arrayBuffer());
}
