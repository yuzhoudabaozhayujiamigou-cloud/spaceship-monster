import Link from "next/link";

import { buildMetadata } from "../../../_seo/metadata";
import { SITE } from "../../../_seo/site";

export const metadata = buildMetadata({
  title: `Lethal Company Ship Upgrades Guide | ${SITE.name}`,
  description:
    "Quick reference for Lethal Company ship upgrades: cost, practical benefit, and when each upgrade is worth buying.",
  path: "/tools/lethal-company/ship-upgrades",
});

type ShipUpgrade = {
  id: string;
  name: string;
  cost: number;
  valueTier: "High" | "Medium" | "Situational";
  benefit: string;
  bestWhen: string;
};

const SHIP_UPGRADES: ShipUpgrade[] = [
  {
    id: "teleporter",
    name: "Teleporter",
    cost: 375,
    valueTier: "High",
    benefit:
      "Emergency extraction tool that saves runs when one player gets trapped or lost.",
    bestWhen:
      "Best first major upgrade when your team plays aggressive interiors and needs wipe prevention.",
  },
  {
    id: "inverse-teleporter",
    name: "Inverse Teleporter",
    cost: 425,
    valueTier: "Situational",
    benefit:
      "Fast deployment option for deep entries and high-risk recovery attempts.",
    bestWhen:
      "Useful only with coordinated teams; skip early if your comms and map discipline are inconsistent.",
  },
  {
    id: "loud-horn",
    name: "Loud Horn",
    cost: 100,
    valueTier: "Medium",
    benefit:
      "Cheap ship-side signal for regroup timing, extraction calls, and panic reset.",
    bestWhen:
      "Great early buy for newer teams that need simple communication anchors.",
  },
  {
    id: "signal-translator",
    name: "Signal Translator",
    cost: 255,
    valueTier: "Situational",
    benefit:
      "One-way text communication channel from ship to field players for callouts.",
    bestWhen:
      "Worth it if your team already has a dedicated ship operator and clear shorthand messages.",
  },
];

const faqs = [
  {
    question: "What should we buy first: teleporter or horn?",
    answer:
      "If wipes are your main failure mode, prioritize the teleporter. If coordination is the issue and credits are tight, loud horn is a strong low-cost first buy.",
  },
  {
    question: "Is inverse teleporter a trap purchase?",
    answer:
      "For many teams early on, yes. It can create chaotic entries. Buy it when your crew already executes clean, role-based runs.",
  },
  {
    question: "Do these costs change by version or mods?",
    answer:
      "They can. Treat this page as a vanilla baseline and confirm exact in-game pricing for your current setup.",
  },
  {
    question: "How do ship upgrades affect quota consistency?",
    answer:
      "Good upgrades reduce failed runs and improve extraction discipline, which matters more long-term than one-time high scrap spikes.",
  },
];

function tierClasses(tier: ShipUpgrade["valueTier"]) {
  if (tier === "High") {
    return "border-emerald-500/30 bg-emerald-500/10 text-emerald-200";
  }
  if (tier === "Medium") {
    return "border-amber-500/30 bg-amber-500/10 text-amber-200";
  }
  return "border-zinc-700 bg-zinc-900 text-zinc-300";
}

export default function LethalCompanyShipUpgradesPage() {
  const itemListStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: SHIP_UPGRADES.map((upgrade, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: upgrade.name,
      url: `${SITE.url}/tools/lethal-company/ship-upgrades#${upgrade.id}`,
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
            {SHIP_UPGRADES.length} upgrades
          </span>
        </div>

        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Lethal Company Ship Upgrades Quick Reference
          </h1>
          <p className="mt-3 max-w-3xl text-zinc-400 leading-relaxed">
            Cost and benefit snapshot for ship upgrades so you can choose buys
            that improve run consistency, not just one-off highlight plays.
          </p>
        </header>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5">
          <h2 className="text-xl font-semibold">Upgrade Table</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Costs are a vanilla-focused baseline. Confirm current pricing and
            feature behavior in your build or modpack before committing credits.
          </p>

          <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-800">
            <table className="min-w-full text-sm">
              <thead className="border-b border-zinc-800 bg-zinc-950/70 text-xs font-mono uppercase tracking-wider text-zinc-400">
                <tr className="text-left">
                  <th className="px-4 py-3">Upgrade</th>
                  <th className="px-4 py-3">Cost</th>
                  <th className="px-4 py-3">Value Tier</th>
                  <th className="px-4 py-3">Benefit</th>
                  <th className="px-4 py-3">Best When</th>
                </tr>
              </thead>
              <tbody>
                {SHIP_UPGRADES.map((upgrade) => (
                  <tr
                    key={upgrade.id}
                    id={upgrade.id}
                    className="border-b border-zinc-800/80 align-top last:border-b-0"
                  >
                    <td className="px-4 py-3 font-medium text-zinc-100">{upgrade.name}</td>
                    <td className="px-4 py-3 font-mono text-zinc-300">{upgrade.cost}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full border px-3 py-1 text-xs font-mono ${tierClasses(
                          upgrade.valueTier,
                        )}`}
                      >
                        {upgrade.valueTier}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-zinc-300">{upgrade.benefit}</td>
                    <td className="px-4 py-3 text-zinc-400">{upgrade.bestWhen}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

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
              href="/tools/lethal-company/terminal-commands/"
              className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
            >
              Terminal commands
            </Link>
            <Link
              href="/tools/lethal-company/items/"
              className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
            >
              Items reference
            </Link>
            <Link
              href="/tools/lethal-company/quota-calculator/"
              className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
            >
              Quota calculator
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
