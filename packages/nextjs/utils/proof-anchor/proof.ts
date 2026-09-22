import { DIGEST_PROFILE_V1, SHA256_HEX_PATTERN } from "./digest";

export const PROOF_SCHEMA_V1 = "hbar-proof-anchor/v1" as const;
export const STORAGE_SCHEME_V1 = "ipfs" as const;

const PROOF_V1_KEYS = [
  "schema",
  "digest_profile",
  "artifact_digest",
  "storage_scheme",
  "storage_ref",
  "content_length",
] as const;

export type ProofV1 = {
  schema: typeof PROOF_SCHEMA_V1;
  digest_profile: typeof DIGEST_PROFILE_V1;
  artifact_digest: string;
  storage_scheme: typeof STORAGE_SCHEME_V1;
  storage_ref: string;
  content_length: number;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function validateProofV1(value: unknown): ProofV1 {
  if (!isRecord(value)) {
    throw new TypeError("Proof must be a JSON object");
  }

  const keys = Object.keys(value);

  if (
    keys.length !== PROOF_V1_KEYS.length ||
    keys.some(key => !PROOF_V1_KEYS.includes(key as (typeof PROOF_V1_KEYS)[number]))
  ) {
    throw new TypeError("Proof must contain exactly the six hbar-proof-anchor/v1 fields");
  }

  if (value.schema !== PROOF_SCHEMA_V1) {
    throw new TypeError(`schema must equal ${PROOF_SCHEMA_V1}`);
  }

  if (value.digest_profile !== DIGEST_PROFILE_V1) {
    throw new TypeError(`digest_profile must equal ${DIGEST_PROFILE_V1}`);
  }

  if (typeof value.artifact_digest !== "string" || !SHA256_HEX_PATTERN.test(value.artifact_digest)) {
    throw new TypeError("artifact_digest must be a lowercase 64-character SHA-256 hex digest");
  }

  if (value.storage_scheme !== STORAGE_SCHEME_V1) {
    throw new TypeError(`storage_scheme must equal ${STORAGE_SCHEME_V1}`);
  }

  if (typeof value.storage_ref !== "string" || value.storage_ref.length === 0) {
    throw new TypeError("storage_ref must be a non-empty string");
  }

  if (
    typeof value.content_length !== "number" ||
    !Number.isSafeInteger(value.content_length) ||
    value.content_length < 0
  ) {
    throw new TypeError("content_length must be a non-negative safe integer");
  }

  return {
    schema: PROOF_SCHEMA_V1,
    digest_profile: DIGEST_PROFILE_V1,
    artifact_digest: value.artifact_digest,
    storage_scheme: STORAGE_SCHEME_V1,
    storage_ref: value.storage_ref,
    content_length: value.content_length,
  };
}
