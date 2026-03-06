import Link from "next/link";

import { buildMetadata } from "../../_seo/metadata";
import { SITE } from "../../_seo/site";
import { SATISFACTORY_TOOL_LINKS } from "./_data/satisfactory";

export const metadata = buildMetadata({
  title: `Satisfactory Tools - Production, Power, Logistics, Planning & Resource Map | ${SITE.name}`,
  description:
    "Satisfactory tool hub with Production Calculator, Power Calculator, Belt/Pipe Calculator, Building Planner, and Resource Map for efficient factory planning.",
  path: "/tools/satisfactory",
});

const FAQS = [
  {
    question: "What can I do with this Satisfactory tools hub?",
    answer:
      "You can plan production chains, size your power grid, validate belt and pipe throughput, estimate layout footprint, and pick stronger resource extraction nodes.",
  },
  {
    question: "Which Satisfactory tool should I use first?",
    answer:
      "Start with the Production Calculator to define target rates. Then use Power and Belt/Pipe calculators, followed by Building Planner and Resource Map for site execution.",
  },
  {
    question: "Are these tools designed for practical factory builds?",
    answer:
      "Yes. The pages are built for planning workflows and include machine counts, throughput checks, and linked navigation between related decisions.",
  },
  {
    question: "Can these tools support large late-game factories?",
    answer:
      "Yes. Use higher target rates and reserve margins to model large campuses and stress-test logistics and power capacity before building.",
  },
];

export default function SatisfactoryToolsHubPage() {
  const itemListStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: SATISFACTORY_TOOL_LINKS.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.name,
      url: `${SITE.url}${tool.href.replace(/\/$/, "")}`,
    })),
  };

  const faqStructuredData = {
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

        <header className="mb-10">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Satisfactory Tools</h1>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            Satisfactory is a first-person factory building game where throughput, logistics, and
            long-term planning decide whether your base scales cleanly or collapses under
            complexity. This hub gives you five practical tools to move from target output to
            execution.
          </p>
          <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
            Use the tools in sequence: production → power → logistics → layout → resource siting.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {SATISFACTORY_TOOL_LINKS.map((tool) => (
            <article
              key={tool.slug}
              className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5 transition-colors hover:bg-zinc-950/60"
            >
              <h2 className="text-lg font-semibold">{tool.name}</h2>
              <p className="mt-2 text-sm text-zinc-400">{tool.description}</p>
              <div className="mt-4">
                <Link
                  href={tool.href}
                  className="inline-flex items-center rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-white"
                >
                  Open tool
                </Link>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-2xl font-semibold tracking-tight">FAQ</h2>
          <div className="mt-4 space-y-4">
            {FAQS.map((faq) => (
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
