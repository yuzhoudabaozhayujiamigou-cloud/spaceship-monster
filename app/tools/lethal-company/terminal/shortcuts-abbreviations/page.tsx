import Link from "next/link";

import { buildMetadata } from "../../../../_seo/metadata";
import { SITE } from "../../../../_seo/site";

export const metadata = buildMetadata({
  title: `Lethal Company Terminal Shortcuts & Abbreviations | ${SITE.name}`,
  description:
    "Quick reference for commonly used terminal command abbreviations and shorthand, with safety notes on version/mod differences.",
  path: "/tools/lethal-company/terminal/shortcuts-abbreviations",
});

const shortcuts = [
  {
    long: "confirm",
    short: "c",
    note: "Common shorthand in many setups; validate in your build.",
  },
  {
    long: "route <moon>",
    short: "r <moon>",
    note: "Some builds accept minimal prefixes, others require full command.",
  },
  {
    long: "view monitor",
    short: "monitor / vm",
    note: "Community shorthand; may not map directly in vanilla.",
  },
  {
    long: "inverse teleporter",
    short: "inv tp / it",
    note: "Usually modpack shorthand, not guaranteed terminal syntax.",
  },
  {
    long: "buy <item>",
    short: "b <item>",
    note: "Can fail depending on parser strictness; full command is safer.",
  },
  {
    long: "scan",
    short: "sc",
    note: "Short forms vary and may collide with other command names.",
  },
];

const faqs = [
  {
    question: "Are abbreviations officially supported in vanilla?",
    answer:
      "Not consistently. Some commands may accept prefixes, but behavior differs across versions and modpacks.",
  },
  {
    question: "What is the safest way to avoid terminal mistakes?",
    answer:
      "Use full command names for critical actions (routing, purchases, teleporter) and reserve shorthand for low-risk contexts.",
  },
  {
    question: "Should teams standardize shortcut vocabulary?",
    answer:
      "Yes. Shared callout language reduces confusion, especially when one player handles ship-side command entry under pressure.",
  },
];

export default function LethalCompanyTerminalShortcutsPage() {
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
    itemListElement: shortcuts.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${item.long} -> ${item.short}`,
      url: `${SITE.url}/tools/lethal-company/terminal/shortcuts-abbreviations`,
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
            href="/tools/lethal-company/terminal-commands/"
            className="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
          >
            ← Back to Terminal Commands
          </Link>
        </div>

        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Terminal Shortcuts &amp; Abbreviations
          </h1>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            Lightweight cheat sheet for common shorthand patterns players use in
            Lethal Company terminal workflows. Treat these as optional speed
            tools, not guaranteed universal syntax.
          </p>
        </header>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-xl font-semibold">Common shorthand patterns</h2>
          <div className="mt-4 space-y-3">
            {shortcuts.map((item) => (
              <div
                key={`${item.long}:${item.short}`}
                className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4"
              >
                <div className="flex flex-wrap items-center gap-2 text-sm">
                  <span className="rounded-md border border-zinc-700 bg-[#0a0a0a] px-2 py-1 font-mono text-zinc-200">
                    {item.long}
                  </span>
                  <span className="text-zinc-500">→</span>
                  <span className="rounded-md border border-emerald-500/30 bg-emerald-500/10 px-2 py-1 font-mono text-emerald-200">
                    {item.short}
                  </span>
                </div>
                <p className="mt-2 text-sm text-zinc-400">{item.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-xl font-semibold">Related tools</h2>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/tools/lethal-company/terminal-commands/"
              className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
            >
              Full command list
            </Link>
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
