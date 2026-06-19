"use client";

import { useState, useEffect, useCallback } from "react";
import type { Entry } from "@/lib/admin/types";

const PREFIX = "oboor-cms:";

// مخزن مبني على localStorage — تعديلاتك تفضل محفوظة في المتصفح (نسخة ستاتيك قبل ربط الباك-إند)
export function useCollectionStore(key: string, seed: Entry[]) {
  const [entries, setEntries] = useState<Entry[]>(seed);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PREFIX + key);
      if (raw) setEntries(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, [key]);

  const save = useCallback(
    (next: Entry[]) => {
      try {
        localStorage.setItem(PREFIX + key, JSON.stringify(next));
      } catch {
        /* ignore */
      }
    },
    [key],
  );

  const upsert = useCallback(
    (entry: Entry) => {
      setEntries((prev) => {
        const exists = prev.some((e) => e.id === entry.id);
        const next = exists ? prev.map((e) => (e.id === entry.id ? entry : e)) : [...prev, entry];
        save(next);
        return next;
      });
    },
    [save],
  );

  const remove = useCallback(
    (id: string) => {
      setEntries((prev) => {
        const next = prev.filter((e) => e.id !== id);
        save(next);
        return next;
      });
    },
    [save],
  );

  const reset = useCallback(() => {
    try {
      localStorage.removeItem(PREFIX + key);
    } catch {
      /* ignore */
    }
    setEntries(seed);
  }, [key, seed]);

  return { entries, loaded, upsert, remove, reset };
}

// مخزن بسيط للإعدادات (object واحد لكل قسم)
export function useSettingsStore(key: string, initial: Record<string, unknown>) {
  const [value, setValue] = useState(initial);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(PREFIX + "settings:" + key);
      if (raw) setValue(JSON.parse(raw));
    } catch {
      /* ignore */
    }
    setLoaded(true);
  }, [key]);

  const persist = useCallback(
    (next: Record<string, unknown>) => {
      setValue(next);
      try {
        localStorage.setItem(PREFIX + "settings:" + key, JSON.stringify(next));
      } catch {
        /* ignore */
      }
    },
    [key],
  );

  return { value, loaded, persist };
}
