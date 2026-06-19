import Image from "next/image";
import Link from "next/link";
import { pick, type Locale } from "@/i18n/config";

const BIG = "/figma/home/imgImageWithFallback6.png";
const SMALL = [
  "/figma/home/imgImageWithFallback7.jpg",
  "/figma/home/imgImageWithFallback8.png",
  "/figma/home/imgImageWithFallback9.png",
  "/figma/home/imgImageWithFallback10.jpg",
  "/figma/home/imgImageWithFallback11.jpg",
  "/figma/home/imgImageWithFallback12.jpg",
];

export default function Gallery({ locale }: { locale: Locale }) {
  return (
    <section className="bg-surface py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <Link href="/gallery" className="text-sm font-semibold text-brand transition-colors hover:text-brand-dark">
            {pick(locale, "عرض الكل ‹", "View All ‹")}
          </Link>
          <div className="text-start">
            <span className="rounded-full bg-brand/10 px-4 py-1.5 text-sm font-medium text-brand-dark">{pick(locale, "المعرض", "Gallery")}</span>
            <h2 className="mt-3 text-3xl font-extrabold text-ink sm:text-4xl">{pick(locale, "ملامح من عبور", "Moments from Oboor")}</h2>
          </div>
        </div>

        <div className="grid gap-3 lg:grid-cols-3" dir="ltr">
          {/* Big image left */}
          <div className="relative h-64 overflow-hidden rounded-2xl lg:col-span-1 lg:row-span-2 lg:h-full">
            <Image src={BIG} alt={pick(locale, "صورة من المركز", "A photo from the center")} fill sizes="(max-width:1024px) 100vw, 50vw" className="object-cover transition-transform duration-300 hover:scale-105" />
          </div>
          {/* Small grid right */}
          {SMALL.map((src, i) => (
            <div key={src} className="relative h-44 overflow-hidden rounded-2xl">
              <Image src={src} alt={pick(locale, `صورة ${i + 2} من المركز`, `Photo ${i + 2} from the center`)} fill sizes="(max-width:1024px) 50vw, 25vw" className="object-cover transition-transform duration-300 hover:scale-105" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
