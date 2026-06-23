import { promises as fs } from "fs";
import path from "path";

// تخزين الطلبات: يستخدم قاعدة بيانات Postgres لو DATABASE_URL متوفّر (تخزين دائم)،
// وإلا يرجع لملفات JSON محليًا (للتطوير / الاستضافة على سيرفر خاص).
export type SubmissionKind = "contact" | "admission" | "assessment" | "career";
export type Submission = { id: string; createdAt: string } & Record<string, unknown>;

const DATABASE_URL = process.env.DATABASE_URL;

/* ---------------- Postgres backend ---------------- */
// نستخدم اتصالًا واحدًا (cached) ونضمن وجود الجدول مرة واحدة.
type Sql = import("postgres").Sql;
let _sql: Sql | null = null;
let _ready: Promise<void> | null = null;

async function getSql(): Promise<Sql> {
  if (!_sql) {
    const postgres = (await import("postgres")).default;
    // prepare:false ليتوافق مع poolers (Supabase transaction pooler / pgbouncer) على الـ serverless
    _sql = postgres(DATABASE_URL as string, { ssl: "require", max: 1, prepare: false });
  }
  if (!_ready) {
    _ready = (async () => {
      await _sql!`
        CREATE TABLE IF NOT EXISTS submissions (
          id          TEXT PRIMARY KEY,
          kind        TEXT NOT NULL,
          data        JSONB NOT NULL,
          created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
        )`;
      await _sql!`
        CREATE TABLE IF NOT EXISTS files (
          id          TEXT PRIMARY KEY,
          name        TEXT NOT NULL,
          mime        TEXT NOT NULL,
          bytes       BYTEA NOT NULL,
          created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
        )`;
    })();
  }
  await _ready;
  return _sql;
}

/* ---------------- File backend (fallback) ---------------- */
const DIR = process.env.VERCEL ? path.join("/tmp", "oboor-data") : path.join(process.cwd(), "data");
function fileFor(kind: SubmissionKind) { return path.join(DIR, `${kind}.json`); }

async function fileAdd(kind: SubmissionKind, entry: Submission) {
  await fs.mkdir(DIR, { recursive: true });
  const file = fileFor(kind);
  let list: Submission[] = [];
  try { list = JSON.parse(await fs.readFile(file, "utf8")); } catch { /* first one */ }
  list.unshift(entry);
  await fs.writeFile(file, JSON.stringify(list, null, 2), "utf8");
}

async function fileGet(kind: SubmissionKind): Promise<Submission[]> {
  try { return JSON.parse(await fs.readFile(fileFor(kind), "utf8")); } catch { return []; }
}

/* ---------------- Public API ---------------- */
export async function addSubmission(kind: SubmissionKind, data: Record<string, unknown>): Promise<Submission> {
  const entry: Submission = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    createdAt: new Date().toISOString(),
    ...data,
  };
  if (DATABASE_URL) {
    const sql = await getSql();
    await sql`INSERT INTO submissions (id, kind, data, created_at) VALUES (${entry.id}, ${kind}, ${sql.json(data as Record<string, never>)}, ${entry.createdAt})`;
  } else {
    await fileAdd(kind, entry);
  }
  return entry;
}

export async function getSubmissions(kind: SubmissionKind): Promise<Submission[]> {
  if (DATABASE_URL) {
    const sql = await getSql();
    const rows = await sql<{ id: string; created_at: Date; data: Record<string, unknown> }[]>`
      SELECT id, created_at, data FROM submissions WHERE kind = ${kind} ORDER BY created_at DESC
    `;
    return rows.map((r) => ({ id: r.id, createdAt: new Date(r.created_at).toISOString(), ...r.data }));
  }
  return fileGet(kind);
}

/* ---------------- File storage (e.g. CVs) ---------------- */
export type StoredFile = { name: string; mime: string; bytes: Buffer };

export async function saveFile(name: string, mime: string, bytes: Buffer): Promise<string> {
  const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  if (DATABASE_URL) {
    const sql = await getSql();
    await sql`INSERT INTO files (id, name, mime, bytes) VALUES (${id}, ${name}, ${mime}, ${bytes})`;
  } else {
    const dir = path.join(DIR, "files");
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(path.join(dir, id), bytes);
    await fs.writeFile(path.join(dir, `${id}.json`), JSON.stringify({ name, mime }), "utf8");
  }
  return id;
}

export async function getFile(id: string): Promise<StoredFile | null> {
  if (DATABASE_URL) {
    const sql = await getSql();
    const rows = await sql<{ name: string; mime: string; bytes: Buffer }[]>`SELECT name, mime, bytes FROM files WHERE id = ${id}`;
    if (!rows[0]) return null;
    return { name: rows[0].name, mime: rows[0].mime, bytes: Buffer.from(rows[0].bytes) };
  }
  try {
    const dir = path.join(DIR, "files");
    const meta = JSON.parse(await fs.readFile(path.join(dir, `${id}.json`), "utf8"));
    const bytes = await fs.readFile(path.join(dir, id));
    return { name: meta.name, mime: meta.mime, bytes };
  } catch { return null; }
}
