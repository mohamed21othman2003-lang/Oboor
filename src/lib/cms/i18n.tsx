"use client";

// i18n خفيف للوحة تحكّم الـCMS — مستقل عن لغة الموقع (يُحفظ في localStorage).
// الافتراضي عربي؛ المدير يقدر يبدّل للإنجليزية من زر اللغة في الشريط العلوي.

import { createContext, useContext, useEffect, useState, useCallback } from "react";

export type CmsLang = "ar" | "en";
const KEY = "oboor_cms_lang";

type Ctx = { lang: CmsLang; dir: "rtl" | "ltr"; setLang: (l: CmsLang) => void; ready: boolean };
const CmsLangContext = createContext<Ctx>({ lang: "ar", dir: "rtl", setLang: () => {}, ready: false });

export function CmsLangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<CmsLang>("ar");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const s = localStorage.getItem(KEY);
      if (s === "en" || s === "ar") setLangState(s);
    } catch {}
    setReady(true);
  }, []);

  const setLang = useCallback((l: CmsLang) => {
    setLangState(l);
    try { localStorage.setItem(KEY, l); } catch {}
  }, []);

  const dir = lang === "en" ? "ltr" : "rtl";
  return <CmsLangContext.Provider value={{ lang, dir, setLang, ready }}>{children}</CmsLangContext.Provider>;
}

export function useCmsLang() {
  return useContext(CmsLangContext);
}

// t("عربي","English") — يرجّع النص حسب لغة اللوحة
export function useT() {
  const { lang } = useCmsLang();
  return useCallback((ar: string, en: string) => (lang === "en" ? en : ar), [lang]);
}
