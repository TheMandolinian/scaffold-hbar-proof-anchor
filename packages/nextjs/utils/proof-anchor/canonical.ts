import { ProofV1, validateProofV1 } from "./proof";
import canonicalize from "canonicalize";

const UTF8_ENCODER = new TextEncoder();
const UTF8_DECODER = new TextDecoder("utf-8", { fatal: true });

function readJsonString(source: string, start: number): { value: string; end: number } {
  let index = start + 1;

  while (index < source.length) {
    const code = source.charCodeAt(index);

    if (code === 0x22) {
      const literal = source.slice(start, index + 1);

      return {
        value: JSON.parse(literal) as string,
        end: index + 1,
      };
    }

    if (code === 0x5c) {
      index += 1;

      if (index >= source.length) {
        throw new SyntaxError("Invalid JSON string escape");
      }

      if (source[index] === "u") {
        const escape = source.slice(index + 1, index + 5);

        if (!/^[0-9a-fA-F]{4}$/.test(escape)) {
          throw new SyntaxError("Invalid JSON Unicode escape");
        }

        index += 4;
      }
    } else if (code < 0x20) {
      throw new SyntaxError("Invalid control character in JSON string");
    }

    index += 1;
  }

  throw new SyntaxError("Unterminated JSON string");
}

function nextNonWhitespace(source: string, start: number): string | undefined {
  for (let index = start; index < source.length; index += 1) {
    const char = source[index];

    if (char !== " " && char !== "\n" && char !== "\r" && char !== "\t") {
      return char;
    }
  }

  return undefined;
}

function assertNoDuplicateJsonObjectKeys(source: string): void {
  const stack: Array<Set<string> | null> = [];

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];

    if (char === "{") {
      stack.push(new Set<string>());
      continue;
    }

    if (char === "[") {
      stack.push(null);
      continue;
    }

    if (char === "}" || char === "]") {
      stack.pop();
      continue;
    }

    if (char !== '"') {
      continue;
    }

    const token = readJsonString(source, index);
    const context = stack.at(-1);

    if (context instanceof Set && nextNonWhitespace(source, token.end) === ":") {
      if (context.has(token.value)) {
        throw new SyntaxError(`Duplicate JSON object key: ${token.value}`);
      }

      context.add(token.value);
    }

    index = token.end - 1;
  }
}

export function parseProofV1Json(source: string): ProofV1 {
  assertNoDuplicateJsonObjectKeys(source);

  let parsed: unknown;

  try {
    parsed = JSON.parse(source);
  } catch {
    throw new SyntaxError("Invalid Proof Anchor JSON");
  }

  return validateProofV1(parsed);
}

export function canonicalProofV1Json(value: unknown): string {
  const proof = validateProofV1(value);
  const serialized = canonicalize(proof);

  if (typeof serialized !== "string") {
    throw new TypeError("Unable to canonicalize Proof Anchor record");
  }

  return serialized;
}

export function canonicalProofV1Bytes(value: unknown): Uint8Array {
  return UTF8_ENCODER.encode(canonicalProofV1Json(value));
}

export function parseCanonicalProofV1Bytes(bytes: Uint8Array): ProofV1 {
  let source: string;

  try {
    source = UTF8_DECODER.decode(bytes);
  } catch {
    throw new SyntaxError("Proof Anchor bytes must be valid UTF-8");
  }

  const proof = parseProofV1Json(source);
  const canonicalBytes = canonicalProofV1Bytes(proof);

  if (canonicalBytes.length !== bytes.length) {
    throw new TypeError("Proof Anchor bytes are not canonical");
  }

  for (let index = 0; index < bytes.length; index += 1) {
    if (canonicalBytes[index] !== bytes[index]) {
      throw new TypeError("Proof Anchor bytes are not canonical");
    }
  }

  return proof;
}
