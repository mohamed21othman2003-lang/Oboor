"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { cmsLogin } from "@/lib/cms/api";

export default function CmsLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { user } = await cmsLogin(username.trim(), password);
      localStorage.setItem("oboor_cms_user", JSON.stringify(user));
      router.replace("/cms");
    } catch (err) {
      setError(err instanceof Error ? err.message : "تعذّر تسجيل الدخول.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div dir="rtl" className="flex min-h-screen items-center justify-center bg-gradient-to-br from-brand-deep to-[#0a2329] p-6">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl sm:p-10">
        <div className="flex flex-col items-center text-center">
          <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-brand/10 p-2">
            <Image src="/figma/imgImage.png" alt="عبور" width={56} height={56} className="h-full w-auto object-contain" />
          </span>
          <h1 className="mt-4 text-2xl font-extrabold text-ink">لوحة تحكّم مركز عبور</h1>
          <p className="mt-1 text-sm text-ink-soft">سجّل دخولك لإدارة محتوى الموقع</p>
        </div>

        <form onSubmit={submit} className="mt-8 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink">اسم المستخدم</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoFocus
              className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
              placeholder="admin"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-semibold text-ink">كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-brand focus:bg-white focus:ring-2 focus:ring-brand/20"
              placeholder="••••••••"
            />
          </div>

          {error && <p className="rounded-lg bg-red-50 px-4 py-3 text-center text-sm font-medium text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-brand py-3.5 text-base font-bold text-white transition-colors hover:bg-brand-dark disabled:opacity-60"
          >
            {loading ? "جارٍ الدخول…" : "تسجيل الدخول"}
          </button>
        </form>
      </div>
    </div>
  );
}
