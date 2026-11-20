import { randomUUID } from "node:crypto";
import { put } from "@vercel/blob";
import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/auth/session";
import { imageUploadMetaSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const auth = await getAdminSession();
  if (!auth || auth.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: "Invalid upload request." },
      { status: 400 },
    );
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: "No image file provided." },
      { status: 400 },
    );
  }

  const parsed = imageUploadMetaSchema.safeParse({
    filename: file.name,
    contentType: file.type,
    size: file.size,
  });
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid image file." },
      { status: 400 },
    );
  }

  const header = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const matchesContentType =
    (file.type === "image/jpeg" &&
      header[0] === 0xff &&
      header[1] === 0xd8 &&
      header[2] === 0xff) ||
    (file.type === "image/png" &&
      header[0] === 0x89 &&
      header[1] === 0x50 &&
      header[2] === 0x4e &&
      header[3] === 0x47 &&
      header[4] === 0x0d &&
      header[5] === 0x0a &&
      header[6] === 0x1a &&
      header[7] === 0x0a) ||
    (file.type === "image/webp" &&
      String.fromCharCode(...header.slice(0, 4)) === "RIFF" &&
      String.fromCharCode(...header.slice(8, 12)) === "WEBP");
  if (!matchesContentType) {
    return NextResponse.json(
      { error: "The file contents do not match a supported image type." },
      { status: 400 },
    );
  }

  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    return NextResponse.json(
      { error: "Image storage is not configured on the server." },
      { status: 503 },
    );
  }

  const extension =
    file.type === "image/jpeg"
      ? "jpg"
      : file.type === "image/png"
        ? "png"
        : "webp";

  try {
    const blob = await put(`products/${randomUUID()}.${extension}`, file, {
      access: "public",
      contentType: file.type,
      token,
    });

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message.replace(/vercel_blob_[^\s"'`]+/g, "[redacted]")
        : "Unknown image storage error.";
    console.error("Admin product image upload failed:", message);
    const usesPrivateStore =
      error instanceof Error &&
      error.message.includes("Cannot use public access on a private store");

    return NextResponse.json(
      {
        error: usesPrivateStore
          ? "The configured Blob store is private. Product images require a public Blob store; create one and update BLOB_READ_WRITE_TOKEN."
          : "Image storage rejected the upload. Check the server terminal for details.",
      },
      { status: 502 },
    );
  }
}
