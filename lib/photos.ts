import fs from "fs";
import path from "path";

export const MAX_PHOTOS = 4;
export const MAX_PHOTO_BYTES = 2 * 1024 * 1024;
const dir = path.join(process.cwd(), "data", "uploads");
const TYPES: Record<string, { ext: string; magic: (b: Buffer) => boolean }> = {
  "image/jpeg": { ext: "jpg", magic: b => b[0] === 0xff && b[1] === 0xd8 },
  "image/png": { ext: "png", magic: b => b.subarray(0, 4).toString("hex") === "89504e47" },
  "image/webp": { ext: "webp", magic: b => b.subarray(0, 4).toString() === "RIFF" && b.subarray(8, 12).toString() === "WEBP" },
};
export const PHOTO_FILE = /^p\d+-\d\.(jpg|png|webp)$/;

/** Validates data-URL images and writes them to data/uploads. Returns saved file names. */
export function savePhotos(problemId: string, images: unknown): { files?: string[]; error?: string } {
  if (images === undefined || images === null) return { files: [] };
  if (!Array.isArray(images)) return { error: "Photos must be a list of images." };
  if (images.length > MAX_PHOTOS) return { error: `You can attach up to ${MAX_PHOTOS} photos.` };
  const parsed: { buf: Buffer; ext: string }[] = [];
  for (const img of images) {
    const m = typeof img === "string" && /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(img);
    if (!m) return { error: "Only JPEG, PNG or WebP photos are supported." };
    const buf = Buffer.from(m[2], "base64");
    if (buf.length > MAX_PHOTO_BYTES) return { error: "Each photo must be under 2 MB." };
    if (!TYPES[m[1]].magic(buf)) return { error: "One of the files is not a valid image." };
    parsed.push({ buf, ext: TYPES[m[1]].ext });
  }
  fs.mkdirSync(dir, { recursive: true });
  const files = parsed.map((p, i) => {
    const name = `${problemId}-${i}.${p.ext}`;
    fs.writeFileSync(path.join(dir, name), p.buf);
    return name;
  });
  return { files };
}
export function readPhoto(file: string): { buf: Buffer; type: string } | null {
  if (!PHOTO_FILE.test(file)) return null;
  const fp = path.join(dir, file);
  if (!fs.existsSync(fp)) return null;
  const ext = file.split(".").pop()!;
  return { buf: fs.readFileSync(fp), type: ext === "jpg" ? "image/jpeg" : `image/${ext}` };
}
