// كشف نوع الوسائط بالامتداد — لدعم الفيديو في معرض الفرع.
// المعرض يخزّن قائمة روابط (صور + فيديو) معًا؛ نميّز النوع من امتداد الرابط.
export const VIDEO_EXTS = [".mp4", ".webm", ".mov", ".ogg", ".m4v"] as const;

export function isVideo(url: string): boolean {
  const u = (url || "").split("?")[0].toLowerCase();
  return VIDEO_EXTS.some((e) => u.endsWith(e));
}
