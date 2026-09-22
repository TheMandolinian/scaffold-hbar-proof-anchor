import { base32 } from "multiformats/bases/base32";
import { CID } from "multiformats/cid";

const IPFS_STORAGE_PREFIX = "ipfs://";

function parseCidText(input: string): CID {
  if (typeof input !== "string" || input.length === 0) {
    throw new TypeError("CID must be a non-empty string");
  }

  if (input !== input.trim()) {
    throw new TypeError("CID must not contain surrounding whitespace");
  }

  try {
    return CID.parse(input);
  } catch {
    throw new TypeError("Invalid IPFS CID");
  }
}

export function normalizeIpfsCid(input: string): string {
  return parseCidText(input).toV1().toString(base32);
}

export function normalizeIpfsStorageRef(input: string): string {
  if (typeof input !== "string" || input.length === 0) {
    throw new TypeError("IPFS storage identity must be a non-empty string");
  }

  if (input !== input.trim()) {
    throw new TypeError("IPFS storage identity must not contain surrounding whitespace");
  }

  const cidText = input.startsWith(IPFS_STORAGE_PREFIX) ? input.slice(IPFS_STORAGE_PREFIX.length) : input;

  if (cidText.length === 0) {
    throw new TypeError("IPFS storage reference must contain a CID");
  }

  return `${IPFS_STORAGE_PREFIX}${normalizeIpfsCid(cidText)}`;
}

export function parseCanonicalIpfsStorageRef(storageRef: string): string {
  if (!storageRef.startsWith(IPFS_STORAGE_PREFIX)) {
    throw new TypeError("storage_ref must use the ipfs:// scheme");
  }

  const canonical = normalizeIpfsStorageRef(storageRef);

  if (canonical !== storageRef) {
    throw new TypeError("storage_ref must use canonical CIDv1 base32 lowercase form");
  }

  return canonical.slice(IPFS_STORAGE_PREFIX.length);
}
