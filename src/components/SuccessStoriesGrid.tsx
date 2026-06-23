"use client";

import { useState } from "react";
import SuccessStoryCard from "@/components/SuccessStoryCard";
import { pick, type Locale } from "@/i18n/config";
import type { SuccessStory, StoryHighlightsData } from "@/lib/successStoriesData";

const INITIAL = 6;
const STEP = 6;

/* شبكة قصص النجاح مع "عرض المزيد" — يظهر تلقائياً لمّا يكون فيه قصص أكتر
   من المعروض (يعني لما الأدمن يضيف من اللوحة)، ويكشفها عند الضغط. */
export default function SuccessStoriesGrid({
  stories,
  highlights,
  locale,
}: {
  stories: SuccessStory[];
  highlights: StoryHighlightsData;
  locale: Locale;
}) {
  const [visible, setVisible] = useState(INITIAL);
  const shown = stories.slice(0, visible);

  return (
    <>
      <div className="grid gap-7 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((story) => (
          <SuccessStoryCard key={story.slug} story={story} locale={locale} highlights={highlights} />
        ))}
      </div>

      {visible < stories.length && (
        <div className="mt-12 flex justify-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + STEP)}
            className="rounded-xl border border-brand px-8 py-3 text-sm font-semibold text-brand-dark transition-colors hover:bg-brand hover:text-white"
          >
            {pick(locale, "عرض المزيد", "Load More")}
          </button>
        </div>
      )}
    </>
  );
}
