import Link from "next/link";

import { buildMetadata } from "../../../_seo/metadata";
import { SITE } from "../../../_seo/site";
import ItemsReferenceClient, { type ScrapItem } from "./ItemsReferenceClient";

export const metadata = buildMetadata({
  title: `Lethal Company Items & Scrap Values | ${SITE.name}`,
  description:
    "Searchable Lethal Company items reference with planning-friendly scrap value ranges and quick filters.",
  path: "/tools/lethal-company/items",
});

const SCRAP_ITEMS: ScrapItem[] = [
  {
    id: "airhorn",
    name: "Airhorn",
    category: "Utility",
    valueMin: 28,
    valueMax: 62,
    valuePlan: 45,
    note: "Common filler item. Usually safe for route warmup totals.",
  },
  {
    id: "apparatus",
    name: "Apparatus",
    category: "Industrial",
    valueMin: 80,
    valueMax: 160,
    valuePlan: 120,
    note: "High value but often increases extraction risk if you overstay.",
  },
  {
    id: "bee-hive",
    name: "Bee Hive",
    category: "Outdoor",
    valueMin: 90,
    valueMax: 150,
    valuePlan: 115,
    note: "Strong value, but treat retrieval as a coordinated play.",
  },
  {
    id: "bottle",
    name: "Bottles",
    category: "Household",
    valueMin: 8,
    valueMax: 28,
    valuePlan: 16,
    note: "Low value stack piece. Good for padding near end of run.",
  },
  {
    id: "cash-register",
    name: "Cash Register",
    category: "Industrial",
    valueMin: 60,
    valueMax: 140,
    valuePlan: 98,
    note: "Solid value anchor if route remains stable.",
  },
  {
    id: "chemical-jug",
    name: "Chemical Jug",
    category: "Industrial",
    valueMin: 35,
    valueMax: 72,
    valuePlan: 52,
    note: "Mid value pickup with consistent planning utility.",
  },
  {
    id: "clown-horn",
    name: "Clown Horn",
    category: "Toys",
    valueMin: 40,
    valueMax: 88,
    valuePlan: 63,
    note: "Mid-value item; useful for smoothing run averages.",
  },
  {
    id: "cog",
    name: "Cog",
    category: "Industrial",
    valueMin: 16,
    valueMax: 46,
    valuePlan: 30,
    note: "Low-value baseline item. Keep if exit path is already planned.",
  },
  {
    id: "comedy-mask",
    name: "Comedy Mask",
    category: "Valuables",
    valueMin: 30,
    valueMax: 70,
    valuePlan: 50,
    note: "Usually worth carrying unless risk spikes outdoors.",
  },
  {
    id: "cookie-mold",
    name: "Cookie Mold Pan",
    category: "Kitchen",
    valueMin: 12,
    valueMax: 36,
    valuePlan: 22,
    note: "Low value. Prioritize only on safe and short extracts.",
  },
  {
    id: "dust-pan",
    name: "Dust Pan",
    category: "Household",
    valueMin: 20,
    valueMax: 46,
    valuePlan: 33,
    note: "Steady low-mid pick if your carry space is free.",
  },
  {
    id: "egg-beater",
    name: "Egg Beater",
    category: "Kitchen",
    valueMin: 10,
    valueMax: 34,
    valuePlan: 21,
    note: "Low-value filler. Skip if schedule is already tight.",
  },
  {
    id: "engine-part",
    name: "Engine Part",
    category: "Industrial",
    valueMin: 30,
    valueMax: 82,
    valuePlan: 54,
    note: "Mid value piece with decent quota pacing impact.",
  },
  {
    id: "fancy-lamp",
    name: "Fancy Lamp",
    category: "Decor",
    valueMin: 44,
    valueMax: 94,
    valuePlan: 68,
    note: "Reliable medium value for team carry lanes.",
  },
  {
    id: "flask",
    name: "Flask",
    category: "Utility",
    valueMin: 14,
    valueMax: 40,
    valuePlan: 25,
    note: "Low utility pickup. Grab when route is already clean.",
  },
  {
    id: "gold-bar",
    name: "Gold Bar",
    category: "Valuables",
    valueMin: 120,
    valueMax: 210,
    valuePlan: 160,
    note: "Premium value piece. Treat as extraction-priority cargo.",
  },
  {
    id: "hair-dryer",
    name: "Hair Dryer",
    category: "Household",
    valueMin: 36,
    valueMax: 78,
    valuePlan: 54,
    note: "Stable mid-value pickup for consistent quota pacing.",
  },
  {
    id: "laser-pointer",
    name: "Laser Pointer",
    category: "Electronics",
    valueMin: 38,
    valueMax: 92,
    valuePlan: 64,
    note: "Medium value and often worth hauling on standard runs.",
  },
  {
    id: "large-axle",
    name: "Large Axle",
    category: "Industrial",
    valueMin: 48,
    valueMax: 108,
    valuePlan: 74,
    note: "Higher-end mid value; good in runs with clear exits.",
  },
  {
    id: "magnifying-glass",
    name: "Magnifying Glass",
    category: "Utility",
    valueMin: 28,
    valueMax: 66,
    valuePlan: 46,
    note: "Moderate value. Keep if team can leave on schedule.",
  },
  {
    id: "old-phone",
    name: "Old Phone",
    category: "Electronics",
    valueMin: 42,
    valueMax: 96,
    valuePlan: 69,
    note: "Strong medium pickup for averaging quota plans.",
  },
  {
    id: "perfume-bottle",
    name: "Perfume Bottle",
    category: "Valuables",
    valueMin: 36,
    valueMax: 84,
    valuePlan: 60,
    note: "Mid value; prioritize once team has spare carry room.",
  },
  {
    id: "pickle-jar",
    name: "Pickle Jar",
    category: "Kitchen",
    valueMin: 18,
    valueMax: 48,
    valuePlan: 33,
    note: "Low-mid value. Best used to round out a mostly complete haul.",
  },
  {
    id: "toy-cube",
    name: "Toy Cube",
    category: "Toys",
    valueMin: 30,
    valueMax: 78,
    valuePlan: 52,
    note: "Good mid-tier filler item for consistent runs.",
  },
  {
    id: "v-type-engine",
    name: "V-Type Engine",
    category: "Industrial",
    valueMin: 52,
    valueMax: 126,
    valuePlan: 86,
    note: "High-end industrial piece with strong quota impact.",
  },
];

const faqs = [
  {
    question: "Are these exact vanilla values?",
    answer:
      "Treat these as planning ranges, not guaranteed roll values. Patches and mods can shift value behavior.",
  },
  {
    question: "What should I use for quota planning: min, max, or plan value?",
    answer:
      "Use the plan value for normal pacing, then increase buffer if your team has inconsistent clears or frequent wipes.",
  },
  {
    question: "Why use value bands instead of sorting only by max value?",
    answer:
      "Banding helps quick run decisions. It separates obvious low-value filler from medium and premium pickups under time pressure.",
  },
  {
    question: "How do I combine this with the quota calculator?",
    answer:
      "Estimate your realistic average per run from this table, then plug that number into the quota calculator with an appropriate safety buffer.",
  },
];

export default function LethalCompanyItemsPage() {
  const itemListStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: SCRAP_ITEMS.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: `${SITE.url}/tools/lethal-company/items#${item.id}`,
    })),
  };

  const faqStructuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
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
            href="/tools/lethal-company/"
            className="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
          >
            ← Back to Lethal Company Tools
          </Link>
          <span className="text-xs font-mono text-zinc-500">
            {SCRAP_ITEMS.length} entries
          </span>
        </div>

        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Lethal Company Items &amp; Scrap Value Reference
          </h1>
          <p className="mt-3 max-w-3xl text-zinc-400 leading-relaxed">
            Searchable table for common scrap items with planning-friendly value
            ranges. Use this as a fast, in-run reference to estimate haul quality
            and pace quota decisions.
          </p>
        </header>

        <ItemsReferenceClient items={SCRAP_ITEMS} />

        <section className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-xl font-semibold">FAQ</h2>
          <div className="mt-4 space-y-4">
            {faqs.map((faq) => (
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

        <section className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950/30 p-5">
          <h2 className="text-lg font-semibold">Related tools</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/tools/lethal-company/quota-calculator/"
              className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
            >
              Quota calculator
            </Link>
            <Link
              href="/tools/lethal-company/moons/"
              className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
            >
              Moons guide
            </Link>
            <Link
              href="/tools/lethal-company/ship-upgrades/"
              className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
            >
              Ship upgrades
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
