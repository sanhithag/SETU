import { readPhoto } from "../../../../lib/photos";
export async function GET(_req: Request, { params }: { params: Promise<{ file: string }> }) {
  const { file } = await params;
  const p = readPhoto(file);
  if (!p) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(p.buf), { headers: { "Content-Type": p.type, "Cache-Control": "public, max-age=31536000, immutable", "X-Content-Type-Options": "nosniff" } });
}
