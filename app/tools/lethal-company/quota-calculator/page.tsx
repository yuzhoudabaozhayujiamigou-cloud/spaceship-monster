import Link from "next/link";

import { buildMetadata } from "../../../_seo/metadata";
import { SITE } from "../../../_seo/site";
import QuotaCalculatorClient from "./QuotaCalculatorClient";

export const metadata = buildMetadata({
  title: `Lethal Company Quota Calculator (Cycle + Sell Planner) | ${SITE.name}`,
  description:
    "Plan quota cycle sells with already-sold tracking, optional ship scrap total, and goal mode outputs including remaining, minimal sell, and safety margin.",
  path: "/tools/lethal-company/quota-calculator",
});

const FAQS = [
  {
    question: "What does goal mode change in this calculator?",
    answer:
      "Goal mode changes your target from quota-only to a buffered quota target. Higher buffers reduce wipe risk but require more total sell value.",
  },
  {
    question: "What is minimal sell?",
    answer:
      "Minimal sell is the additional value needed to hit your selected goal mode target, based on quota target and already sold value.",
  },
  {
    question: "How is safety margin calculated?",
    answer:
      "Safety margin compares your projected total after selling current ship scrap versus your goal-mode target. Positive means ahead, negative means short.",
  },
  {
    question: "Should I trust cycle estimate or manual quota target?",
    answer:
      "Use cycle estimate as a baseline and override quota target with your real in-game value whenever it differs.",
  },
  {
    question: "Does this work for modded runs?",
    answer:
      "Yes for planning, but validate quotas and economy changes in your modpack before final decisions.",
  },
];

export default function LethalCompanyQuotaCalculatorPage() {
  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Lethal Company Quota Calculator",
    url: `${SITE.url}/tools/lethal-company/quota-calculator`,
    applicationCategory: "Calculator",
    operatingSystem: "Web",
    description:
      "Cycle-aware quota sell planner with goal modes, minimal sell output, and safety margin tracking.",
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((faq) => ({
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />

        <div className="mb-8">
          <Link
            href="/tools/lethal-company/"
            className="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
          >
            ← Back to Lethal Company Tools
          </Link>
        </div>

        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Lethal Company Quota Calculator (Cycle + Sell Planner)
          </h1>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            Plan each cycle with quota target, already sold value, optional ship
            scrap total, and a clear goal mode so your team can decide exactly
            how much to sell now.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/tools/lethal-company/terminal-commands/"
              className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
            >
              Terminal commands
            </Link>
            <Link
              href="/tools/lethal-company/moons/"
              className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
            >
              Moons guide
            </Link>
            <Link
              href="/tools/lethal-company/bestiary/"
              className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
            >
              Bestiary
            </Link>
            <Link
              href="/guides/profit-quota-formula"
              className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
            >
              Profit quota formula guide
            </Link>
          </div>
        </header>

        <QuotaCalculatorClient />

        <section className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-xl font-semibold">FAQ</h2>
          <div className="mt-4 space-y-4">
            {FAQS.map((faq) => (
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
