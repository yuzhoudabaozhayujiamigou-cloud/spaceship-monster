import Link from "next/link";

import { buildMetadata } from "../../../../_seo/metadata";
import { SITE } from "../../../../_seo/site";

export const metadata = buildMetadata({
  title: `Lethal Company Moons Tier List (Practical Risk Tiers) | ${SITE.name}`,
  description:
    "Lightweight moons tier list framing risk and consistency for quota planning, with quick picks and supporting links.",
  path: "/tools/lethal-company/moons/tier-list",
});

const tiers = [
  {
    name: "S Tier (Consistency Core)",
    profile: "Reliable clears, manageable variance, strong for quota stabilization.",
    picks: ["Experimentation", "Assurance"],
  },
  {
    name: "A Tier (Balanced Upside)",
    profile: "Higher reward with moderate risk when team comms are solid.",
    picks: ["Vow", "March"],
  },
  {
    name: "B Tier (Conditional Value)",
    profile: "Usable when weather/roles align; risky for unstable squads.",
    picks: ["Rend", "Dine"],
  },
  {
    name: "C Tier (High Volatility)",
    profile: "Strong upside but punishes mistakes and weak extraction discipline.",
    picks: ["Titan"],
  },
];

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
      name: tier.name,
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
            Quick tier framing for route calls. This page prioritizes reliable
            quota execution over single-run highlight outcomes.
          </p>
        </header>

        <section className="space-y-3">
          {tiers.map((tier) => (
            <article
              key={tier.name}
              className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5"
            >
              <h2 className="text-lg font-semibold">{tier.name}</h2>
              <p className="mt-2 text-sm text-zinc-400">{tier.profile}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {tier.picks.map((pick) => (
                  <span
                    key={pick}
                    className="inline-flex rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-mono text-zinc-200"
                  >
                    {pick}
                  </span>
                ))}
              </div>
            </article>
          ))}
        </section>

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
