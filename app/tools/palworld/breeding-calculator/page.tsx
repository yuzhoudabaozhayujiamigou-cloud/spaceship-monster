import Link from "next/link";

import { buildMetadata } from "../../../_seo/metadata";
import { SITE } from "../../../_seo/site";
import BreedingCalculatorClient, {
  type BreedingCombo,
} from "./BreedingCalculatorClient";

export const metadata = buildMetadata({
  title: `Palworld Breeding Calculator | ${SITE.name}`,
  description:
    "MVP breeding calculator for Palworld with searchable combo placeholders, filters, and quick planning notes.",
  path: "/tools/palworld/breeding-calculator",
});

const BREEDING_COMBOS: BreedingCombo[] = [
  {
    id: "combo-anubis",
    parentA: "Penking",
    parentB: "Bushi",
    child: "Anubis",
    element: "Ground",
    tier: "Mid",
    note: "Popular work-speed target for base progression.",
  },
  {
    id: "combo-faleris",
    parentA: "Vanwyrm",
    parentB: "Anubis",
    child: "Faleris",
    element: "Fire",
    tier: "Late",
    note: "Strong mobility and combat utility in late loops.",
  },
  {
    id: "combo-jormuntide",
    parentA: "Azurobe",
    parentB: "Relaxaurus",
    child: "Jormuntide",
    element: "Water",
    tier: "Late",
    note: "High value for watering and boss pressure setups.",
  },
  {
    id: "combo-jormuntide-ignis",
    parentA: "Jormuntide",
    parentB: "Blazehowl",
    child: "Jormuntide Ignis",
    element: "Fire",
    tier: "Late",
    note: "Premium kindling line for advanced production bases.",
  },
  {
    id: "combo-lunaris",
    parentA: "Katress",
    parentB: "Wixen",
    child: "Lunaris",
    element: "Neutral",
    tier: "Mid",
    note: "General utility pick with useful crafting pace boost.",
  },
  {
    id: "combo-verdash",
    parentA: "Caprity",
    parentB: "Tombat",
    child: "Verdash",
    element: "Grass",
    tier: "Mid",
    note: "Farming and movement comfort for growing teams.",
  },
  {
    id: "combo-orserk",
    parentA: "Grizzbolt",
    parentB: "Relaxaurus",
    child: "Orserk",
    element: "Electric",
    tier: "Late",
    note: "Electric throughput and raid value at high progression.",
  },
  {
    id: "combo-shadowbeak",
    parentA: "Astegon",
    parentB: "Kitsun",
    child: "Shadowbeak",
    element: "Dark",
    tier: "Late",
    note: "High-end combat line; prioritize if hunting bosses.",
  },
  {
    id: "combo-lyleen",
    parentA: "Petallia",
    parentB: "Mossanda",
    child: "Lyleen",
    element: "Grass",
    tier: "Late",
    note: "Valuable planting/medicine line for base scaling.",
  },
  {
    id: "combo-ragnahawk",
    parentA: "Vanwyrm",
    parentB: "Pyrin",
    child: "Ragnahawk",
    element: "Fire",
    tier: "Mid",
    note: "Reliable flyer and transport upgrade for midgame.",
  },
  {
    id: "combo-beakon",
    parentA: "Nitewing",
    parentB: "Rayhound",
    child: "Beakon",
    element: "Electric",
    tier: "Mid",
    note: "Early electric verticality and mobility boost.",
  },
  {
    id: "combo-helzephyr",
    parentA: "Maraith",
    parentB: "Vanwyrm",
    child: "Helzephyr",
    element: "Dark",
    tier: "Mid",
    note: "Night mobility and flexible damage profile.",
  },
  {
    id: "combo-frostallion-noct",
    parentA: "Helzephyr",
    parentB: "Frostallion",
    child: "Frostallion Noct",
    element: "Dark",
    tier: "Late",
    note: "Endgame breeder target; expensive but high payoff.",
  },
  {
    id: "combo-pyrin-noct",
    parentA: "Pyrin",
    parentB: "Maraith",
    child: "Pyrin Noct",
    element: "Dark",
    tier: "Mid",
    note: "Fast midgame mount line with dark typing utility.",
  },
  {
    id: "combo-sibelyx",
    parentA: "Foxcicle",
    parentB: "Katress",
    child: "Sibelyx",
    element: "Ice",
    tier: "Mid",
    note: "Cooling/production balance option for cold bases.",
  },
  {
    id: "combo-incineram-noct",
    parentA: "Incineram",
    parentB: "Maraith",
    child: "Incineram Noct",
    element: "Dark",
    tier: "Starter",
    note: "Accessible line for early dark-element coverage.",
  },
];

const faqs = [
  {
    question: "Are these exact final breeding formulas?",
    answer:
      "No. This MVP uses placeholder static data so the UI and filtering flow can be validated quickly.",
  },
  {
    question: "How should I use this MVP for planning?",
    answer:
      "Use it as a searchable shortlist of candidate parent pairs, then verify exact outcomes in your current game version.",
  },
  {
    question: "What does tier mean in this table?",
    answer:
      "Tier is a practical progression marker: Starter for early reachable lines, Mid for routine base growth, Late for higher-cost breeding goals.",
  },
  {
    question: "Will passives/IVs be added here later?",
    answer:
      "Yes. The next iteration should add passive inheritance and IV tooling, then connect outputs to a paldeck-aware dataset.",
  },
];

export default function PalworldBreedingCalculatorPage() {
  const itemListStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: BREEDING_COMBOS.map((combo, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${combo.parentA} + ${combo.parentB} → ${combo.child}`,
      url: `${SITE.url}/tools/palworld/breeding-calculator#${combo.id}`,
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
            {BREEDING_COMBOS.length} combos (MVP placeholder)
          </span>
        </div>

        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Palworld Breeding Calculator (MVP)
          </h1>
          <p className="mt-3 max-w-3xl text-zinc-400 leading-relaxed">
            Search and filter breeding combinations with a lightweight static
            dataset. This MVP focuses on speed and planning flow before full
            paldeck and inheritance logic are integrated.
          </p>
        </header>

        <BreedingCalculatorClient combos={BREEDING_COMBOS} />

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
