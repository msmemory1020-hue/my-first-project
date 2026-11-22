import { getStore } from "@netlify/blobs";
import type { Config } from "@netlify/functions";

// One blob per book: key = book id, value = { status, readOn? }.
// Reads are open; writes need the family code (FAMILY_CODE env var).
const STATUSES = ["none", "bought", "have", "read"];
const ID_RE = /^[nk]\d{2}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

const store = () => getStore({ name: "reading-log", consistency: "strong" });

export default async (req: Request) => {
  if (req.method === "GET") {
    const s = store();
    const { blobs } = await s.list();
    const entries = await Promise.all(
      blobs.map(async (b) => [b.key, await s.get(b.key, { type: "json" })] as const),
    );
    const statuses: Record<string, unknown> = {};
    for (const [k, v] of entries) if (v) statuses[k] = v;
    return Response.json({ statuses }, { headers: { "cache-control": "no-store" } });
  }

  const code = Netlify.env.get("FAMILY_CODE");
  if (!code || req.headers.get("x-family-code") !== code) {
    return Response.json({ error: "wrong_code" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  if (body && body.verify === true) return Response.json({ ok: true });

  const { id, status, readOn } = body ?? {};
  if (typeof id !== "string" || !ID_RE.test(id) || !STATUSES.includes(status)) {
    return Response.json({ error: "bad_request" }, { status: 400 });
  }
  const s = store();
  if (status === "none") {
    await s.delete(id);
    return Response.json({ ok: true });
  }
  const value: Record<string, string> = { status };
  if (status === "read" && typeof readOn === "string" && DATE_RE.test(readOn)) value.readOn = readOn;
  await s.setJSON(id, value);
  return Response.json({ ok: true, value });
};

export const config: Config = { path: "/api/books", method: ["GET", "POST"] };
