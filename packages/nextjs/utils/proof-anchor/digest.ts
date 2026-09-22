import { sha256 } from "@noble/hashes/sha256";
import { bytesToHex } from "@noble/hashes/utils";

export const DIGEST_PROFILE_V1 = "sha256-bytes/v1" as const;

export const SHA256_HEX_PATTERN = /^[0-9a-f]{64}$/;

export function sha256Bytes(bytes: Uint8Array): string {
  return bytesToHex(sha256(bytes));
}

export class ArtifactHasher {
  private readonly state = sha256.create();
  private byteLength = 0;
  private finalized = false;

  update(chunk: Uint8Array): this {
    if (this.finalized) {
      throw new Error("ArtifactHasher is already finalized");
    }

    this.state.update(chunk);
    this.byteLength += chunk.byteLength;

    return this;
  }

  digestHex(): string {
    if (this.finalized) {
      throw new Error("ArtifactHasher is already finalized");
    }

    this.finalized = true;
    return bytesToHex(this.state.digest());
  }

  get contentLength(): number {
    return this.byteLength;
  }
}
