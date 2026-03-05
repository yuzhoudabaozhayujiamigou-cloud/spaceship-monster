import Link from "next/link";

import { buildMetadata } from "../../_seo/metadata";
import { SITE } from "../../_seo/site";

export const metadata = buildMetadata({
  title: `Palworld Tools | ${SITE.name}`,
  description:
    "Palworld tool hub: breeding calculator MVP live, plus planned paldeck explorer, IV checker, and path planner.",
  path: "/tools/palworld",
});

const features = [
  {
    title: "Breeding Calculator (MVP)",
    description:
      "Searchable and filterable breeding combo table with a static placeholder dataset.",
    href: "/tools/palworld/breeding-calculator/",
    status: "available" as const,
    tag: "Live",
  },
  {
    title: "Paldeck Explorer",
    description:
      "Search by element, work suitability, partner skills, and progression tags.",
    href: "#paldeck",
    status: "planned" as const,
    tag: "Planned",
  },
  {
    title: "IV Checker",
    description:
      "Quick stat estimator and comparison workflow for breeding and combat lines.",
    href: "#iv-checker",
    status: "planned" as const,
    tag: "Planned",
  },
  {
    title: "Base Path Planner",
    description:
      "Route-focused planner for ore loops, travel points, and farming circuit efficiency.",
    href: "#path-planner",
    status: "planned" as const,
    tag: "Planned",
  },
];

const faqs = [
  {
    question: "What is included in this Palworld MVP?",
    answer:
      "The first live tool is the breeding calculator with a static placeholder combos dataset and client-side search/filter support.",
  },
  {
    question: "Why launch with placeholder data first?",
    answer:
      "It validates UX, filtering, and page structure quickly so future dataset integrations can ship with lower risk.",
  },
  {
    question: "Will this hub expand to a full tool suite?",
    answer:
      "Yes. The planned next tools are paldeck explorer, IV checker, and a base path planner connected to richer game data.",
  },
];

export default function PalworldToolsPage() {
  const itemListStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: features.map((feature, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: feature.title,
      url: feature.href.startsWith("/")
        ? `${SITE.url}${feature.href.replace(/\/$/, "")}`
        : `${SITE.url}/tools/palworld${feature.href}`,
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
            Palworld Tools
          </h1>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            Tool cluster MVP for fast team planning. Start with breeding, then
            expand into paldeck browsing, IV checks, and route planning.
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
                <span
                  className={`shrink-0 rounded-full border px-3 py-1 text-xs font-mono ${
                    feature.status === "available"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                      : "border-zinc-700 bg-zinc-900 text-zinc-300"
                  }`}
                >
                  {feature.tag}
                </span>
              </div>

              <div className="mt-4">
                <a
                  href={feature.href}
                  className={`inline-flex items-center rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    feature.status === "available"
                      ? "bg-zinc-100 text-zinc-950 hover:bg-white"
                      : "border border-zinc-800 bg-[#0a0a0a] text-zinc-300 hover:bg-zinc-950/60"
                  }`}
                >
                  {feature.status === "available" ? "Open tool" : "View plan"}
                </a>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <article
            id="paldeck"
            className="rounded-2xl border border-zinc-800 bg-zinc-950/30 p-5"
          >
            <h3 className="text-sm font-semibold text-zinc-100">Paldeck Explorer</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Indexed pal list with filters for work traits and progression use.
            </p>
          </article>
          <article
            id="iv-checker"
            className="rounded-2xl border border-zinc-800 bg-zinc-950/30 p-5"
          >
            <h3 className="text-sm font-semibold text-zinc-100">IV Checker</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Input stats and level data to estimate IV quality quickly.
            </p>
          </article>
          <article
            id="path-planner"
            className="rounded-2xl border border-zinc-800 bg-zinc-950/30 p-5"
          >
            <h3 className="text-sm font-semibold text-zinc-100">Base Path Planner</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Plan loops for gathering, travel, and production flow.
            </p>
          </article>
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
