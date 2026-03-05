import Link from "next/link";

import { PALDECK_ENTRIES } from "@/data/paldeck";
import { PALDECK_FAQ } from "@/data/paldeck-faq";
import { buildMetadata } from "@/app/_seo/metadata";
import { SITE } from "@/app/_seo/site";
import PaldeckClient from "./PaldeckClient";

export const metadata = buildMetadata({
  title: `Palworld Paldeck - Complete Pal Database (MVP) | ${SITE.name}`,
  description:
    "Searchable Paldeck MVP with element and work suitability filters, rarity chips, and fast client-side sorting.",
  path: "/tools/palworld/paldeck",
});

export default function PalworldPaldeckPage() {
  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: PALDECK_FAQ.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const webPageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Palworld Paldeck - Complete Pal Database (MVP)",
    description:
      "Complete Palworld Paldeck seed with searchable entries and filters for element, work suitability, and rarity.",
    url: `${SITE.url}/tools/palworld/paldeck`,
    breadcrumb: {
      "@type": "BreadcrumbList",
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: `${SITE.url}`,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Tools",
          item: `${SITE.url}/tools`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Palworld",
          item: `${SITE.url}/tools/palworld`,
        },
        {
          "@type": "ListItem",
          position: 4,
          name: "Paldeck",
          item: `${SITE.url}/tools/palworld/paldeck`,
        },
      ],
    },
  };

  const itemListStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Palworld Paldeck",
    description: "MVP list of Palworld Pals with searchable metadata.",
    numberOfItems: PALDECK_ENTRIES.length,
    itemListElement: PALDECK_ENTRIES.slice(0, 20).map((pal, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Thing",
        name: pal.name,
        description: pal.description,
        url: `${SITE.url}/tools/palworld/paldeck#pal-${String(pal.id).padStart(3, "0")}`,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageStructuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListStructuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
        />

        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            href="/tools/palworld/"
            className="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
          >
            ← Back to Palworld Tools
          </Link>
          <span className="text-xs font-mono text-zinc-500">
            {PALDECK_ENTRIES.length} entries
          </span>
        </div>

        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Paldeck - Complete Pal Database (MVP)
          </h1>
          <p className="mt-3 max-w-3xl text-zinc-400 leading-relaxed">
            Filter by element, work suitability, and rarity to quickly shortlist
            pals for base automation, combat rosters, and breeding plans.
          </p>
        </header>

        <PaldeckClient entries={PALDECK_ENTRIES} />

        <section className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-xl font-semibold">FAQ</h2>
          <div className="mt-4 space-y-4">
            {PALDECK_FAQ.map((faq) => (
              <div
                key={faq.question}
                className="rounded-xl border border-zinc-800/80 bg-zinc-950/30 p-4"
              >
                <h3 className="text-sm font-semibold text-zinc-100">{faq.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
