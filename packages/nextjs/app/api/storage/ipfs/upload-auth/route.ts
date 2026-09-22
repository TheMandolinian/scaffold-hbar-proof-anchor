import { NextResponse } from "next/server";
import { PinataSDK, type SignedUploadUrlOptions } from "pinata";

const SIGNED_UPLOAD_EXPIRES_SECONDS = 60;

function isJsonObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function POST(request: Request) {
  let parsed: unknown;

  try {
    parsed = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid upload authorization request" }, { status: 400 });
  }

  if (!isJsonObject(parsed)) {
    return NextResponse.json({ error: "Invalid upload authorization request" }, { status: 400 });
  }

  const contentLength = parsed.contentLength;

  if (typeof contentLength !== "number" || !Number.isSafeInteger(contentLength) || contentLength < 0) {
    return NextResponse.json({ error: "contentLength must be a non-negative safe integer" }, { status: 400 });
  }

  const pinataJwt = process.env.PINATA_JWT?.trim();

  if (!pinataJwt) {
    return NextResponse.json({ error: "Pinata upload is not configured" }, { status: 500 });
  }

  const options: SignedUploadUrlOptions = {
    expires: SIGNED_UPLOAD_EXPIRES_SECONDS,
    maxFileSize: Math.max(contentLength, 1),
  };

  try {
    const pinata = new PinataSDK({ pinataJwt });
    const uploadUrl = await pinata.upload.public.createSignedURL(options);

    return NextResponse.json({ uploadUrl });
  } catch {
    return NextResponse.json({ error: "Pinata upload authorization failed" }, { status: 502 });
  }
}
