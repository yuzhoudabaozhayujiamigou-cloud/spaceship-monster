import Link from "next/link";

import { buildMetadata } from "../../../../_seo/metadata";
import { SITE } from "../../../../_seo/site";
import TierListTableClient, { type TierRow } from "./TierListTableClient";

export const metadata = buildMetadata({
  title: `Lethal Company Moons Tier List (Practical Risk Tiers) | ${SITE.name}`,
  description:
    "Lightweight moons tier list framing risk and consistency for quota planning, with quick picks and supporting links.",
  path: "/tools/lethal-company/moons/tier-list",
});

const tiers = [
  {
    moon: "Experimentation",
    tier: "S",
    risk: "Low",
    expectedLoot: "Low-Mid (~220-340)",
    expectedLootValue: 280,
    recommendedTeamSize: "2-4",
    teamSizeMin: 2,
    notes: "Strong for stable early-cycle clears and clean extraction timing.",
    estimated: true,
  },
  {
    moon: "Assurance",
    tier: "S",
    risk: "Low",
    expectedLoot: "Low-Mid (~230-360)",
    expectedLootValue: 295,
    recommendedTeamSize: "2-4",
    teamSizeMin: 2,
    notes: "High consistency for quota stabilization, especially newer teams.",
    estimated: true,
  },
  {
    moon: "Vow",
    tier: "A",
    risk: "Medium",
    expectedLoot: "Mid (~320-470)",
    expectedLootValue: 395,
    recommendedTeamSize: "3-4",
    teamSizeMin: 3,
    notes: "Balanced upside when callouts and route discipline are solid.",
    estimated: true,
  },
  {
    moon: "March",
    tier: "A",
    risk: "Medium",
    expectedLoot: "Mid-High (~360-520)",
    expectedLootValue: 440,
    recommendedTeamSize: "3-4",
    teamSizeMin: 3,
    notes: "Good catch-up option if team can recover quickly from bad pulls.",
    estimated: true,
  },
  {
    moon: "Rend",
    tier: "B",
    risk: "High",
    expectedLoot: "High (~450-680)",
    expectedLootValue: 565,
    recommendedTeamSize: "4",
    teamSizeMin: 4,
    notes: "Rewarding but punishes weak map control and late extractions.",
    estimated: true,
  },
  {
    moon: "Dine",
    tier: "B",
    risk: "High",
    expectedLoot: "High (~470-710)",
    expectedLootValue: 590,
    recommendedTeamSize: "4",
    teamSizeMin: 4,
    notes: "Use when ahead or when intentionally taking controlled risk.",
    estimated: true,
  },
  {
    moon: "Titan",
    tier: "C",
    risk: "Very High",
    expectedLoot: "Very High (~600-900)",
    expectedLootValue: 750,
    recommendedTeamSize: "4 (coordinated)",
    teamSizeMin: 4,
    notes: "Large upside but high wipe probability without tight team roles.",
    estimated: true,
  },
] satisfies TierRow[];

const faqs = [
  {
    question: "Is this tier list official?",
    answer:
      "No. It is a practical planning lens focused on risk and consistency rather than fixed universal rankings.",
  },
  {
    question: "Why is consistency weighted more than peak value?",
    answer:
      "Most quota failures come from wipe risk and lost time, not from lack of jackpot runs. Stable clears compound better over a cycle.",
  },
  {
    question: "How should teams use this during a quota cycle?",
    answer:
      "If behind, take one calibrated risk tier up. If ahead, drop one tier and bank consistency to protect quota margin.",
  },
  {
    question: "Are expected loot values exact?",
    answer:
      "No. They are estimate ranges for planning context, marked unverified until validated against your exact version and settings.",
  },
];

export default function LethalCompanyMoonsTierListPage() {
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

  const itemListStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: tiers.map((tier, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${tier.moon} (${tier.tier})`,
      url: `${SITE.url}/tools/lethal-company/moons/tier-list`,
    })),
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListStructuredData) }}
        />

        <div className="mb-8">
          <Link
            href="/tools/lethal-company/moons/"
            className="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
          >
            ← Back to Moons Guide
          </Link>
        </div>

        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Moons Tier List (Risk + Consistency)
          </h1>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            Sortable planning table for quick route calls. Values are practical
            estimates and should be treated as unverified baselines.
          </p>
        </header>

        <TierListTableClient rows={tiers} />

        <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-xl font-semibold">Related tools</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/tools/lethal-company/moons/"
              className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
            >
              Full moons guide
            </Link>
            <Link
              href="/tools/lethal-company/quota-calculator/"
              className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
            >
              Quota calculator
            </Link>
            <Link
              href="/tools/lethal-company/terminal-commands/"
              className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
            >
              Terminal commands
            </Link>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
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
