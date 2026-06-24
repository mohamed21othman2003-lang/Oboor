"use client";

import { useEffect, useState } from "react";
import { listCollection } from "@/lib/cms/api";
import CollectionEditor from "@/components/cms/CollectionEditor";

export default function SettingsPage() {
  const [id, setId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    listCollection("site")
      .then((d) => setId(d.items[0] ? String(d.items[0].id) : "new"))
      .catch((e) => setError(e.message));
  }, []);

  if (error) return <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>;
  if (!id) return <p className="text-ink-soft">جارٍ التحميل…</p>;
  return <CollectionEditor type="site" id={id} />;
}
