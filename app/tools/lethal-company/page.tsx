import Link from "next/link";

import { buildMetadata } from "../../_seo/metadata";
import { SITE } from "../../_seo/site";

export const metadata = buildMetadata({
  title: `Lethal Company Tools | ${SITE.name}`,
  description:
    "Lethal Company tool hub: terminal commands, moons guide, quota calculator, and bestiary.",
  path: "/tools/lethal-company",
});

const features = [
  {
    title: "Terminal Commands",
    description:
      "Categorized command reference with practical notes, shortcuts, and common gotchas.",
    href: "/tools/lethal-company/terminal-commands/",
    tag: "Reference",
  },
  {
    title: "Moons Guide",
    description:
      "Version-agnostic framework for moon tiers, risk factors, and quick-pick planning.",
    href: "/tools/lethal-company/moons/",
    tag: "Planning",
  },
  {
    title: "Quota Calculator",
    description:
      "Estimate how much value to sell with preset buffers and runs-per-day pacing.",
    href: "/tools/lethal-company/quota-calculator/",
    tag: "Calculator",
  },
  {
    title: "Bestiary",
    description:
      "Monster behavior patterns, threat levels, and survival tactics you can use in live runs.",
    href: "/tools/lethal-company/bestiary/",
    tag: "Survival",
  },
];

const faqs = [
  {
    question: "Which page should I start with as a new crew?",
    answer:
      "Start with the Quota Calculator for a stable target, then use the Moons Guide and Terminal Commands to reduce run variance.",
  },
  {
    question: "Are these pages vanilla-focused or modded?",
    answer:
      "The guidance is vanilla-first, but most planning concepts still apply to modded runs when you adjust values to your server setup.",
  },
  {
    question: "How do these tools work together during a run cycle?",
    answer:
      "Set your quota target, choose safer moon profiles, execute ship-side commands quickly, and review monster risks for cleaner exits.",
  },
  {
    question: "Can I use these references mid-run?",
    answer:
      "Yes. Each page is built as a compact, scan-friendly reference so you can grab what you need without digging.",
  },
];

export default function LethalCompanyToolsPage() {
  const itemListStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: features.map((feature, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: feature.title,
      url: `${SITE.url}${feature.href.replace(/\/$/, "")}`,
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
      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListStructuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
        />

        <div className="mb-8">
          <Link
            href="/tools/"
            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            ← Back to Tools
          </Link>
        </div>

        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Lethal Company Tools
          </h1>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            A single hub for the core Lethal Company references: route faster,
            plan quota safely, and reduce wipe risk.
          </p>
          <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
            Use this page as your quick launchpad between planning, ship commands,
            and survival references.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5 transition-colors hover:bg-zinc-950/60"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold">{feature.title}</h2>
                  <p className="mt-2 text-sm text-zinc-400">
                    {feature.description}
                  </p>
                </div>
                <span className="shrink-0 rounded-full border border-zinc-700 bg-zinc-900 px-3 py-1 text-xs font-mono text-zinc-300">
                  {feature.tag}
                </span>
              </div>

              <div className="mt-4">
                <Link
                  href={feature.href}
                  className="inline-flex items-center rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-white"
                >
                  Open tool
                </Link>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-xl font-semibold">FAQ</h2>
          <div className="mt-4 space-y-4">
            {faqs.map((faq) => (
              <div key={faq.question} className="rounded-xl border border-zinc-800/80 bg-zinc-950/30 p-4">
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
