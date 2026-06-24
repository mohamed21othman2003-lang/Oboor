"use client";

// عميل الـCMS — يتكلّم مع Django مباشرة من المتصفح بتوكن المصادقة.
const BASE = process.env.NEXT_PUBLIC_DJANGO_API_URL || "http://127.0.0.1:8000/api";
const TOKEN_KEY = "oboor_cms_token";

export type CmsUser = { username: string; name: string; email: string; is_staff: boolean };

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}
export function setToken(t: string) {
  localStorage.setItem(TOKEN_KEY, t);
}
export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export async function cmsLogin(username: string, password: string): Promise<{ token: string; user: CmsUser }> {
  const res = await fetch(`${BASE}/cms/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || "تعذّر تسجيل الدخول.");
  setToken(data.token);
  return data;
}

export async function cmsFetch<T = unknown>(path: string, opts: RequestInit = {}): Promise<T> {
  const token = getToken();
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    headers: {
      ...(opts.body && !(opts.body instanceof FormData) ? { "Content-Type": "application/json" } : {}),
      ...(token ? { Authorization: `Token ${token}` } : {}),
      ...(opts.headers || {}),
    },
  });
  if (res.status === 401) {
    clearToken();
    if (typeof window !== "undefined") window.location.href = "/cms/login";
    throw new Error("انتهت الجلسة، الرجاء تسجيل الدخول مجدداً.");
  }
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.detail || `خطأ (${res.status})`);
  }
  return res.json();
}

export type DashboardStats = {
  submissions: { key: string; label: string; count: number; icon: string }[];
  content: { key: string; label: string; count: number }[];
  home: { key: string; label: string; count: number }[];
  totals: { submissions: number; content: number; site_configured: boolean };
};

export function getStats() {
  return cmsFetch<DashboardStats>("/cms/stats/");
}
