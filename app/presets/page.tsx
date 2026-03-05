import Link from "next/link";

import { buildMetadata } from "../_seo/metadata";
import { SITE } from "../_seo/site";

export const metadata = buildMetadata({
  title: `Stardew Profit Presets | ${SITE.name}`,
  description:
    "Quick-start preset scenarios for Stardew crop planning. Jump into calculator-ready setups.",
  path: "/presets",
});

const CTA_COPY = {
  heroShort:
    "Start faster with tested profit scenarios.",
  heroDetailed:
    "Choose a preset, open it in the calculator, and then tune seed cost, growth windows, and processing assumptions for your farm state.",
  heroPrimaryButton: "Open in Calculator",
  heroSecondaryButton: "Browse Blog Guides",
  cardPrimaryButton: "Open in Calculator",
  cardSecondaryButton: "View Related Guide",
};

const presets = [
  {
    name: "Spring Year 1: Strawberry Push",
    short:
      "Festival timing focused strawberry plan with reinvestment pressure.",
    detailed:
      "Use this when you can commit to event timing and want stronger seasonal upside at the cost of tighter cash-flow control.",
    href: "/calculator?preset=spring-y1-strawberry",
    relatedHref: "/blog/best-crops-every-season",
    relatedLabel: "Best Crops Every Season",
  },
  {
    name: "Spring Year 1: Parsnip Safety",
    short:
      "Lower-risk early cash-flow plan centered around parsnip consistency.",
    detailed:
      "Use this when you need reliable early returns and cleaner transition timing into larger Summer purchases.",
    href: "/calculator?preset=spring-y1-parsnip",
    relatedHref: "/blog/best-crops-every-season",
    relatedLabel: "Best Crops Every Season",
  },
  {
    name: "Summer: Blueberry Core",
    short: "Repeat-harvest summer baseline for stable weekly income.",
    detailed:
      "Use this when you want predictable weekly harvest flow and a straightforward handoff into keg/jar processing decisions.",
    href: "/calculator?preset=summer-blueberry-core",
    relatedHref: "/blog/keg-vs-jar-profit-guide",
    relatedLabel: "Keg vs Jar Profit Guide",
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
            {CTA_COPY.heroShort}
          </p>
          <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
            {CTA_COPY.heroDetailed}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/calculator"
              className="inline-flex items-center rounded-lg bg-emerald-300 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-200"
            >
              {CTA_COPY.heroPrimaryButton}
            </Link>
            <Link
              href="/blog/"
              className="inline-flex items-center rounded-lg border border-zinc-700 bg-zinc-950/70 px-5 py-2.5 text-sm font-semibold text-zinc-100 transition-colors hover:bg-zinc-900"
            >
              {CTA_COPY.heroSecondaryButton}
            </Link>
          </div>
        </header>

        <section className="grid grid-cols-1 gap-4">
          {presets.map((preset) => (
            <article
              key={preset.name}
              className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5"
            >
              <h2 className="text-lg font-semibold">{preset.name}</h2>
              <p className="mt-2 text-sm text-zinc-300">{preset.short}</p>
              <p className="mt-2 text-sm text-zinc-500 leading-relaxed">{preset.detailed}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href={preset.href}
                  className="inline-flex items-center rounded-lg bg-emerald-300 px-4 py-2 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-200"
                >
                  {CTA_COPY.cardPrimaryButton}
                </Link>
                <Link
                  href={preset.relatedHref}
                  className="inline-flex items-center rounded-lg border border-zinc-700 bg-zinc-950/70 px-4 py-2 text-sm font-medium text-zinc-100 transition-colors hover:bg-zinc-900"
                >
                  {CTA_COPY.cardSecondaryButton}: {preset.relatedLabel}
                </Link>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}
