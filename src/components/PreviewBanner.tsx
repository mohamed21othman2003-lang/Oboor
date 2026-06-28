// شريط يظهر فقط في وضع المعاينة (Draft Mode) لتنبيه المحرّر أنه يشاهد مسودّة.
import { draftMode } from "next/headers";
import PreviewBannerBar from "./PreviewBannerBar";

export default async function PreviewBanner() {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return null;
  return <PreviewBannerBar />;
}
