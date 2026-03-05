import Link from "next/link";

import { buildMetadata } from "../../../_seo/metadata";
import { SITE } from "../../../_seo/site";
import PaldeckClient, { type PaldeckEntry } from "./PaldeckClient";

export const metadata = buildMetadata({
  title: `Palworld Paldeck Explorer | ${SITE.name}`,
  description:
    "Paldeck MVP with searchable list and filters for element and work suitability.",
  path: "/tools/palworld/paldeck",
});

const PAL_NAMES = [
  "Lamball",
  "Cattiva",
  "Chikipi",
  "Foxparks",
  "Sparkit",
  "Rooby",
  "Jolthog",
  "Pengullet",
  "Penking",
  "Fuack",
  "Tanzee",
  "Lifmunk",
  "Depresso",
  "Daedream",
  "Nox",
  "Direhowl",
  "Melpaca",
  "Caprity",
  "Rushoar",
  "Tocotoco",
  "Flopie",
  "Hangyu",
  "Vixy",
  "Cremis",
  "Mau",
  "Mau Cryst",
  "Celaray",
  "Dumud",
  "Eikthyrdeer",
  "Eikthyrdeer Terra",
  "Gumoss",
  "Killamari",
  "Swee",
  "Sweepa",
  "Rayhound",
  "Kitsun",
  "Reptyro",
  "Reptyro Cryst",
  "Anubis",
  "Vanwyrm",
  "Vanwyrm Cryst",
  "Beakon",
  "Ragnahawk",
  "Orserk",
  "Helzephyr",
  "Lyleen",
  "Lyleen Noct",
  "Jormuntide",
  "Jormuntide Ignis",
  "Faleris",
  "Pyrin",
  "Pyrin Noct",
  "Blazehowl",
  "Blazehowl Noct",
  "Astegon",
  "Shadowbeak",
  "Frostallion",
  "Frostallion Noct",
  "Necromus",
  "Paladius",
];

const ELEMENT_ROTATION = [
  "Neutral",
  "Fire",
  "Water",
  "Grass",
  "Electric",
  "Ice",
  "Ground",
  "Dark",
  "Dragon",
];

const WORK_ROTATION = [
  "Kindling",
  "Watering",
  "Planting",
  "Generating Electricity",
  "Handiwork",
  "Gathering",
  "Lumbering",
  "Mining",
  "Medicine Production",
  "Cooling",
  "Transporting",
  "Farming",
];

const ELEMENT_OVERRIDES: Record<string, string> = {
  Foxparks: "Fire",
  Sparkit: "Electric",
  Pengullet: "Water",
  Penking: "Water",
  Lifmunk: "Grass",
  Daedream: "Dark",
  Nox: "Dark",
  Jolthog: "Electric",
  Vanwyrm: "Fire",
  "Vanwyrm Cryst": "Ice",
  Beakon: "Electric",
  Ragnahawk: "Fire",
  Orserk: "Electric",
  Helzephyr: "Dark",
  Anubis: "Ground",
  Lyleen: "Grass",
  "Lyleen Noct": "Dark",
  Jormuntide: "Water",
  "Jormuntide Ignis": "Fire",
  Faleris: "Fire",
  Pyrin: "Fire",
  "Pyrin Noct": "Dark",
  Blazehowl: "Fire",
  "Blazehowl Noct": "Dark",
  Astegon: "Dragon",
  Shadowbeak: "Dark",
  Frostallion: "Ice",
  "Frostallion Noct": "Dark",
  Necromus: "Dark",
  Paladius: "Neutral",
};

const WORK_OVERRIDES: Record<string, string[]> = {
  Lamball: ["Farming", "Transporting"],
  Chikipi: ["Farming", "Gathering"],
  Foxparks: ["Kindling", "Transporting"],
  Sparkit: ["Generating Electricity", "Transporting"],
  Pengullet: ["Watering", "Cooling", "Transporting"],
  Penking: ["Watering", "Mining", "Cooling"],
  Lifmunk: ["Planting", "Handiwork", "Gathering"],
  Cattiva: ["Handiwork", "Transporting", "Gathering"],
  Depresso: ["Mining", "Handiwork", "Transporting"],
  Caprity: ["Planting", "Farming", "Gathering"],
  Reptyro: ["Kindling", "Mining", "Transporting"],
  "Reptyro Cryst": ["Mining", "Cooling", "Transporting"],
  Anubis: ["Handiwork", "Mining", "Transporting"],
  Jormuntide: ["Watering", "Transporting"],
  "Jormuntide Ignis": ["Kindling", "Transporting"],
  Lyleen: ["Planting", "Medicine Production", "Handiwork"],
  Orserk: ["Generating Electricity", "Handiwork", "Transporting"],
};

const PARTNER_SKILL_NOTES = [
  "Boosts team gathering tempo during base loops.",
  "Improves consistency on routine production chains.",
  "Supports transport-heavy routes and item movement.",
  "Adds flexible utility in mixed exploration sessions.",
  "Helps stabilize squad pace in high-variance zones.",
];

const PALDECK_ENTRIES: PaldeckEntry[] = PAL_NAMES.map((name, index) => {
  const fallbackWork = Array.from(
    new Set([
      WORK_ROTATION[index % WORK_ROTATION.length],
      WORK_ROTATION[(index + 3) % WORK_ROTATION.length],
      WORK_ROTATION[(index + 7) % WORK_ROTATION.length],
    ]),
  );

  return {
    id: `pal-${String(index + 1).padStart(3, "0")}`,
    name,
    element: ELEMENT_OVERRIDES[name] ?? ELEMENT_ROTATION[index % ELEMENT_ROTATION.length],
    workSuitabilities: WORK_OVERRIDES[name] ?? fallbackWork,
    partnerSkill: PARTNER_SKILL_NOTES[index % PARTNER_SKILL_NOTES.length],
    tier: index < 18 ? "Starter" : index < 42 ? "Mid" : "Late",
  };
});

const faqs = [
  {
    question: "Is this Paldeck data fully canonical yet?",
    answer:
      "Not yet. This MVP uses a static seed so search and filtering UX can be validated before full data integration.",
  },
  {
    question: "What filters are available right now?",
    answer:
      "You can filter by element and work suitability, then combine that with text search across names and skill notes.",
  },
  {
    question: "How should I use this for base planning?",
    answer:
      "Use work-suitability filters first to shortlist role-fit pals, then refine by element and progression tier for your current stage.",
  },
  {
    question: "Will partner skills and exact values be expanded later?",
    answer:
      "Yes. The next iteration should wire richer paldeck metadata and stronger stat/skill detail fields.",
  },
];

export default function PalworldPaldeckPage() {
  const itemListStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: PALDECK_ENTRIES.map((entry, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: entry.name,
      url: `${SITE.url}/tools/palworld/paldeck#${entry.id}`,
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
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
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
            {PALDECK_ENTRIES.length} seed entries
          </span>
        </div>

        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Palworld Paldeck Explorer (MVP)
          </h1>
          <p className="mt-3 max-w-3xl text-zinc-400 leading-relaxed">
            Searchable Paldeck list for quick team planning, with filters for
            element and work suitability. This MVP ships with a static seed so
            you can validate workflows before full dataset expansion.
          </p>
        </header>

        <PaldeckClient entries={PALDECK_ENTRIES} />

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
      </main>
    </div>
  );
}
