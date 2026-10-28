import React from 'react';
import { getSiteContent } from '@/lib/content';
import {
  CATEGORY_EXPERT_GUIDES,
  CategoryExpertGuideData,
} from '@/data/categoryGuidesData';
import {
  SimonaIconFlame,
  SimonaIconShieldCheck,
  SimonaIconSparkles,
  SimonaIconInfo,
  SimonaIconCheck,
} from '@/components/brand/SimonaIcons';

interface CategoryExpertGuideProps {
  categorySlug: string;
  categoryTitle: string;
  brand?: string;
}

export function CategoryExpertGuide({
  categorySlug,
  categoryTitle,
  brand,
}: CategoryExpertGuideProps) {
  const guide: CategoryExpertGuideData | undefined = CATEGORY_EXPERT_GUIDES[categorySlug];

  // If category has no custom expert guide yet, return null (zero visual regression)
  if (!guide) {
    return null;
  }

  const { seoBlocks } = getSiteContent();

  const mainHeading = brand
    ? `${categoryTitle} ${brand}: руководство эксперта по выбору в 2026 году`
    : `${categoryTitle}: гид эксперта по выбору технологий и монтажу`;

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: guide.faq.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return (
    <section className="mt-16 pt-12 border-t border-[#2B313A]/60 pb-12">
      {/* Schema.org FAQPage for Direct AI / Yandex Нейро / Gemini Extraction */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Block (Unified Left-Aligned Standard) */}
        <div className="text-left max-w-4xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-simona-teal/10 border border-simona-teal/30 text-simona-teal text-xs font-medium mb-3">
            <SimonaIconSparkles className="w-3.5 h-3.5" />
            <span>Экспертный анализ технологий «СИМОНА»</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold font-montserrat text-white tracking-tight leading-snug">
            {mainHeading}
          </h2>
          <p className="mt-3 text-sm sm:text-base text-[#87888A] leading-relaxed">
            {seoBlocks.expertGuideSubtitle} Более 30 лет подбираем и подключаем бытовую технику в Нижнем Новгороде.
          </p>
        </div>

        {/* 1. Comparison Table: Technologies 2026 */}
        <div className="rounded-2xl bg-gradient-to-b from-[#16191D]/90 to-[#111315]/95 border border-[#2B313A]/80 p-6 sm:p-8 backdrop-blur-md space-y-6 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg sm:text-xl font-bold font-montserrat text-white flex items-center gap-2.5">
                <SimonaIconFlame className="w-5 h-5 text-simona-teal shrink-0" />
                <span>{guide.tableTitle}</span>
              </h3>
              <p className="mt-1 text-xs sm:text-sm text-[#87888A]">
                {guide.tableSubtitle}
              </p>
            </div>
            <span className="text-[11px] text-[#87888A] bg-[#1E2228] border border-[#2B313A] px-2.5 py-1 rounded-md shrink-0 self-start sm:self-auto">
              Актуально на 2026 год
            </span>
          </div>

          <div className="overflow-x-auto -mx-2 sm:mx-0 scrollbar-thin scrollbar-thumb-[#2B313A] scrollbar-track-transparent">
            <table className="w-full text-left text-xs sm:text-sm text-[#D7D9DB] border-collapse min-w-[700px]">
              <thead>
                <tr className="border-b border-[#2B313A] bg-[#1E2228]/60 text-white font-montserrat">
                  {guide.tableColumns.map((col, idx) => (
                    <th
                      key={col.id}
                      className={`p-3 sm:p-4 text-xs font-semibold ${
                        idx === 0 ? 'rounded-l-xl' : ''
                      } ${idx === guide.tableColumns.length - 1 ? 'rounded-r-xl' : ''}`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2B313A]/50">
                {guide.tableRows.map((row, rIdx) => (
                  <tr
                    key={rIdx}
                    className="hover:bg-[#1E2228]/40 transition-colors"
                  >
                    {guide.tableColumns.map((col, cIdx) => (
                      <td
                        key={col.id}
                        className={`p-3.5 sm:p-4 align-top leading-relaxed ${
                          cIdx === 0
                            ? 'font-semibold text-white font-montserrat bg-[#16191D]/50'
                            : 'text-[#87888A]'
                        }`}
                      >
                        {row[col.id] || '—'}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* 2. Engineering Checklist: Common Mistakes */}
        <div className="rounded-2xl bg-gradient-to-b from-[#16191D]/90 to-[#111315]/95 border border-[#2B313A]/80 p-6 sm:p-8 backdrop-blur-md space-y-6 text-left">
          <div>
            <h3 className="text-lg sm:text-xl font-bold font-montserrat text-white flex items-center gap-2.5">
              <SimonaIconShieldCheck className="w-5 h-5 text-simona-teal shrink-0" />
              <span>{guide.mistakesTitle}</span>
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-[#87888A]">
              {guide.mistakesSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {guide.mistakes.map((m) => (
              <div
                key={m.number}
                className="p-5 rounded-xl bg-[#111315]/80 border border-[#2B313A] flex flex-col justify-between space-y-4 hover:border-simona-teal/50 transition-colors"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold text-simona-teal bg-simona-teal/10 px-2 py-0.5 rounded-md border border-simona-teal/30">
                      Пункт {m.number}
                    </span>
                    <h4 className="text-sm font-bold font-montserrat text-white leading-snug">
                      {m.title}
                    </h4>
                  </div>
                  <p className="text-xs text-[#87888A] leading-relaxed pt-1">
                    <span className="text-simona-wine font-semibold">Риск: </span>
                    {m.risk}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-[#16191D] border border-simona-teal/20 text-xs text-[#D7D9DB] leading-relaxed flex items-start gap-2">
                  <SimonaIconInfo className="w-4 h-4 text-simona-teal shrink-0 mt-0.5" />
                  <span>
                    <strong className="text-white font-medium">Регламент СИМОНЫ: </strong>
                    {m.rule}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 3. 3-Tier Budget Matrix: Expert Choices */}
        <div className="space-y-6 text-left">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-[#1E2228] border border-[#2B313A] text-xs text-[#D7D9DB] mb-2 font-montserrat">
              <span>Принцип «СИМОНЫ»</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold font-montserrat text-white tracking-tight">
              {guide.segmentsTitle}
            </h3>
            <p className="mt-1.5 text-xs sm:text-sm text-[#87888A] max-w-3xl leading-relaxed">
              {guide.segmentsSubtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {guide.segments.map((seg, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-2xl flex flex-col justify-between space-y-5 border transition-all ${
                  idx === 1
                    ? 'bg-gradient-to-b from-[#1E2228] to-[#16191D] border-simona-teal/50 shadow-lg shadow-simona-teal/5'
                    : 'bg-[#16191D]/90 border-[#2B313A]'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between gap-3">
                    <span
                      className={`px-3 py-1 rounded-md text-xs font-semibold font-montserrat whitespace-nowrap shrink-0 ${
                        idx === 1
                          ? 'bg-simona-teal text-white'
                          : idx === 2
                            ? 'bg-[#FDBF3E]/15 text-[#FDBF3E] border border-[#FDBF3E]/30'
                            : 'bg-[#1E2228] text-[#D7D9DB] border border-[#2B313A]'
                      }`}
                    >
                      {seg.tierBadge}
                    </span>
                    <span className="text-xs font-mono font-medium text-white whitespace-nowrap shrink-0">
                      {seg.priceRange}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-base font-bold font-montserrat text-white leading-snug">
                      {seg.title}
                    </h4>
                    <p className="mt-1 text-xs text-simona-teal font-medium">
                      Бренды: {seg.brands}
                    </p>
                  </div>

                  <ul className="space-y-2 pt-2 border-t border-[#2B313A]/50">
                    {seg.criteria.map((c, cIdx) => (
                      <li
                        key={cIdx}
                        className="text-xs text-[#D7D9DB] flex items-start gap-2 leading-relaxed"
                      >
                        <SimonaIconCheck className="w-3.5 h-3.5 text-simona-teal shrink-0 mt-0.5" />
                        <span>{c}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-4 border-t border-[#2B313A]/50">
                  <p className="text-[11px] text-[#87888A] leading-relaxed italic">
                    «{seg.expertComment}»
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 4. FAQ Section for AI Search Snippets */}
        <div className="rounded-2xl bg-gradient-to-b from-[#16191D]/90 to-[#111315]/95 border border-[#2B313A]/80 p-6 sm:p-8 backdrop-blur-md space-y-6 text-left">
          <div>
            <h3 className="text-lg sm:text-xl font-bold font-montserrat text-white">
              {guide.faqTitle}
            </h3>
            <p className="mt-1 text-xs sm:text-sm text-[#87888A]">
              {guide.faqSubtitle}
            </p>
          </div>

          <div className="divide-y divide-[#2B313A]/60">
            {guide.faq.map((item, fIdx) => (
              <div key={fIdx} className="py-4 first:pt-0 last:pb-0 space-y-2">
                <h4 className="text-sm sm:text-base font-semibold font-montserrat text-white flex items-start gap-2.5">
                  <span className="text-simona-teal font-mono font-bold shrink-0">Q:</span>
                  <span>{item.question}</span>
                </h4>
                <p className="text-xs sm:text-sm text-[#87888A] pl-6 leading-relaxed">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
