import Link from "next/link";

import { buildMetadata } from "../../_seo/metadata";
import { SITE } from "../../_seo/site";

export const metadata = buildMetadata({
  title: `Lethal Company Hub | ${SITE.name}`,
  description:
    "Lethal Company hub page with Terminal Commands, Moons, Quota Calculator, and Bestiary tools.",
  path: "/tools/lethal-company",
});

const features = [
  {
    title: "Terminal Commands",
    description:
      "Full command reference with categories, syntax notes, and shortcuts for faster runs.",
    href: "/tools/lethal-company/terminal-commands/",
    tag: "Reference",
  },
  {
    title: "Moons",
    description:
      "Moon planning view to compare risk, route choice, and loot pace before each drop.",
    href: "/tools/lethal-company/moons/",
    tag: "Planning",
  },
  {
    title: "Quota Calculator",
    description:
      "Plan daily sell targets, safety buffer, and team pace to hit quota with less panic.",
    href: "/tools/lethal-company/quota-calculator/",
    tag: "Calculator",
  },
  {
    title: "Bestiary",
    description:
      "Enemy behavior breakdown with threat levels and practical counterplay.",
    href: "/tools/lethal-company/bestiary/",
    tag: "Survival",
  },
];

const faqs = [
  {
    question: "What is the fastest way to use this hub before a run?",
    answer:
      "Open Quota Calculator first for your target, then pick a moon. Keep Terminal Commands and Bestiary ready for in-run execution and threat response.",
  },
  {
    question: "Which page should beginners start with?",
    answer:
      "Most crews start with Quota Calculator and Moons first, then use Terminal Commands and Bestiary as quick references during runs.",
  },
  {
    question: "Does this hub work for solo and full-team play?",
    answer:
      "Yes. Solo players can use it for pacing and risk control, while teams can align route and sell timing with shared targets.",
  },
  {
    question: "How often should I revisit the Quota Calculator?",
    answer:
      "Recalculate whenever quota, run count, or expected haul changes so your sell timing stays aligned with current conditions.",
  },
  {
    question: "Can I keep these pages open mid-run without losing speed?",
    answer:
      "Yes. The pages are compact references designed for quick scanning between decisions.",
  },
  {
    question: "Are these references vanilla-only?",
    answer:
      "The defaults are vanilla-first, but the planning framework still applies to many modded runs when values or behavior differ.",
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
            className="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
          >
            ← Back to Tools
          </Link>
        </div>

        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Lethal Company Hub
          </h1>
          <p className="mt-3 leading-relaxed text-zinc-400">
            One jump page for your core workflow: set quota, pick moons, execute commands,
            and respond to monster threats quickly.
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
                  <p className="mt-2 text-sm text-zinc-400">{feature.description}</p>
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
