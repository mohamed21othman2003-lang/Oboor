import { promises as fs } from "fs";
import path from "path";

// تخزين بسيط للطلبات في ملفات JSON (نسخة تشغيلية سريعة قبل قاعدة بيانات كاملة)
const DIR = path.join(process.cwd(), "data");

export type SubmissionKind = "contact" | "admission";
export type Submission = { id: string; createdAt: string } & Record<string, unknown>;

async function ensureDir() {
  await fs.mkdir(DIR, { recursive: true });
}

function fileFor(kind: SubmissionKind) {
  return path.join(DIR, `${kind}.json`);
}

export async function addSubmission(kind: SubmissionKind, data: Record<string, unknown>): Promise<Submission> {
  await ensureDir();
  const file = fileFor(kind);
  let list: Submission[] = [];
  try {
    list = JSON.parse(await fs.readFile(file, "utf8"));
  } catch {
    /* first submission */
  }
  const entry: Submission = {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
    createdAt: new Date().toISOString(),
    ...data,
  };
  list.unshift(entry);
  await fs.writeFile(file, JSON.stringify(list, null, 2), "utf8");
  return entry;
}

export async function getSubmissions(kind: SubmissionKind): Promise<Submission[]> {
  try {
    return JSON.parse(await fs.readFile(fileFor(kind), "utf8"));
  } catch {
    return [];
  }
}
