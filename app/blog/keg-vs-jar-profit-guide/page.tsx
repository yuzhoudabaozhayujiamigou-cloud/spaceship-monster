import Link from "next/link";

import { buildMetadata } from "../../_seo/metadata";
import { SITE } from "../../_seo/site";
import CalculatorCta from "../_components/CalculatorCta";

export const metadata = buildMetadata({
  title: `Keg vs Jar Profit Guide (Stardew Processing Math) | ${SITE.name}`,
  description:
    "Compare keg and preserves jar decisions by throughput, margin, and timing so processing choices match your farm stage.",
  path: "/blog/keg-vs-jar-profit-guide",
});

const faqs = [
  {
    question: "Which is better overall: keg or jar?",
    answer:
      "Neither is always better. Kegs usually win on high-value crops, while jars often win on accessibility and early processing throughput.",
  },
  {
    question: "Why does machine count matter so much?",
    answer:
      "Profit depends on completed processed units, not theoretical margin. If machine count is low, long cycle times can reduce realized income.",
  },
  {
    question: "Should I switch from jars to kegs immediately?",
    answer:
      "Usually no. Transition in phases so your processing line stays productive while infrastructure catches up.",
  },
  {
    question: "How do I test my own crop + machine setup?",
    answer:
      "Use the calculator to compare output under your current crop volume, harvest cadence, and machine inventory.",
  },
];

export default function KegVsJarProfitGuidePage() {
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

  const articleStructuredData = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: "Keg vs Jar Profit Guide (Stardew Processing Math)",
    description:
      "A practical breakdown of keg and preserves jar tradeoffs for staged farm growth.",
    url: `${SITE.url}/blog/keg-vs-jar-profit-guide`,
    author: {
      "@type": "Organization",
      name: SITE.name,
    },
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleStructuredData) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
        />

        <div className="mb-8">
          <Link
            href="/blog/"
            className="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
          >
            ← Back to Blog
          </Link>
        </div>

        <article>
          <header className="mb-8">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Keg vs Jar Profit Guide
            </h1>
            <p className="mt-3 text-zinc-400 leading-relaxed">
              The real question is not keg versus jar in isolation. The real
              question is what produces more completed sellable output per week
              at your current stage.
            </p>
          </header>

          <section className="space-y-4 text-sm leading-relaxed text-zinc-300">
            <p>
              Kegs tend to dominate premium crop lines when you already have
              machine volume and consistent raw input. Their upside is excellent,
              but cycle duration can slow realized profit if machine count is low.
            </p>
            <p>
              Preserves jars are often easier to scale and easier to keep active.
              In transition phases, this can beat higher-margin but underutilized
              keg setups. Utilization is the hidden metric that decides winners.
            </p>
            <p>
              Build your processing plan in stages: initial jar-heavy line for
              stability, mixed line for flexibility, then targeted keg expansion
              where crop mix and machine count justify it.
            </p>
          </section>

          <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
            <h2 className="text-xl font-semibold">Decision Framework</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-300">
              <li>Measure weekly completed units, not only margin multipliers.</li>
              <li>Keep machine uptime high before expanding premium lines.</li>
              <li>Prioritize consistency when funds are needed for upgrades.</li>
              <li>Shift crop mix when processing queue starts backing up.</li>
            </ul>
          </section>
        </article>

        <CalculatorCta
          relatedLinks={[
            { href: "/blog/best-crops-every-season", label: "Best Crops Every Season" },
            { href: "/blog/greenhouse-layout-guide", label: "Greenhouse Layout Guide" },
            { href: "/blog", label: "Blog Hub" },
            { href: "/calculator", label: "Calculator" },
          ]}
        />

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
