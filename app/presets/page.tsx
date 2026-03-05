import Link from "next/link";

import { buildMetadata } from "../_seo/metadata";
import { SITE } from "../_seo/site";

export const metadata = buildMetadata({
  title: `Stardew Profit Presets | ${SITE.name}`,
  description:
    "Quick-start preset scenarios for Stardew crop planning. Jump into calculator-ready setups.",
  path: "/presets",
});

const presets = [
  {
    name: "Spring Year 1: Strawberry Push",
    desc: "Festival timing focused strawberry plan with reinvestment pressure.",
    href: "/calculator?preset=spring-y1-strawberry",
  },
  {
    name: "Spring Year 1: Parsnip Safety",
    desc: "Lower-risk early cash-flow plan centered around parsnip consistency.",
    href: "/calculator?preset=spring-y1-parsnip",
  },
  {
    name: "Summer: Blueberry Core",
    desc: "Repeat-harvest summer baseline for stable weekly income.",
    href: "/calculator?preset=summer-blueberry-core",
  },
];

export default function PresetsPage() {
  const itemListStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: presets.map((preset, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: preset.name,
      url: `${SITE.url}${preset.href}`,
    })),
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListStructuredData) }}
        />

        <div className="mb-8">
          <Link
            href="/blog/"
            className="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
          >
            ← Back to Blog
          </Link>
        </div>

        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Stardew Profit Presets
          </h1>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            Lightweight, calculator-ready scenarios for quick planning starts.
            Pick a preset, then fine-tune values based on your farm reality.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-4">
          {presets.map((preset) => (
            <article
              key={preset.name}
              className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5"
            >
              <h2 className="text-lg font-semibold">{preset.name}</h2>
              <p className="mt-2 text-sm text-zinc-400">{preset.desc}</p>
              <div className="mt-4">
                <Link
                  href={preset.href}
                  className="inline-flex items-center rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-white"
                >
                  Open in /calculator
                </Link>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
