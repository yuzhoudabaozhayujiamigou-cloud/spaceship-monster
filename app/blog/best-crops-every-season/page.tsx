import Link from "next/link";

import { buildMetadata } from "../../_seo/metadata";
import { SITE } from "../../_seo/site";
import CalculatorCta from "../_components/CalculatorCta";

export const metadata = buildMetadata({
  title: `Best Crops Every Season (Stardew Valley Profit Guide) | ${SITE.name}`,
  description:
    "Season-by-season crop picks for steady Stardew profit, including when to process and when to sell raw.",
  path: "/blog/best-crops-every-season",
});

const faqs = [
  {
    question: "Is this focused on Year 1 or late game?",
    answer:
      "The framework works for both, but the examples prioritize practical Year 1 to mid-game decision making where cash flow matters most.",
  },
  {
    question: "Should I always process high-value crops?",
    answer:
      "Not always. Processing wins on total value, but raw selling can be better when you need immediate cash for unlock timing.",
  },
  {
    question: "How do I adapt this for mixed playstyles?",
    answer:
      "Use the core split: base cash crops for stability, plus one high-margin processing line once your machine count supports it.",
  },
  {
    question: "Where should I validate exact profit values?",
    answer:
      "Use the Stardew calculator and presets to test growth time, seed cost, and processing choices against your current farm setup.",
  },
];

export default function BestCropsEverySeasonPage() {
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
    headline: "Best Crops Every Season (Stardew Valley Profit Guide)",
    description:
      "Season-by-season crop strategy with cash-flow framing for Stardew profit planning.",
    url: `${SITE.url}/blog/best-crops-every-season`,
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
              Best Crops Every Season
            </h1>
            <p className="mt-3 text-zinc-400 leading-relaxed">
              Profitable crop picks are less about one “best” seed and more
              about timing: what stabilizes cash now, what scales through
              re-harvest cycles, and what pays off once processing is online.
            </p>
          </header>

          <section className="space-y-4 text-sm leading-relaxed text-zinc-300">
            <p>
              In spring, prioritize stability. Parsnip and potato keep your
              runway alive early, then transition toward strawberries once the
              event window opens. The goal is not max margin on paper, it is
              reliable reinvestment timing.
            </p>
            <p>
              Summer is where repeat harvest compounds. Blueberry usually
              dominates raw consistency, while melon becomes stronger when keg or
              jar throughput is available. Choose based on machine capacity, not
              only seed-shop math.
            </p>
            <p>
              Fall usually rewards processed value paths and stronger batch
              planning. Cranberry lines scale cash flow, while pumpkin supports
              clean high-ticket cycles if your harvest and processing schedule is
              tight.
            </p>
          </section>

          <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
            <h2 className="text-xl font-semibold">Fast Rule Set</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-300">
              <li>Buy for cycle timing first, profit-per-tile second.</li>
              <li>Only expand processing crops when machines are ready.</li>
              <li>Use one core cash crop and one processing line each season.</li>
              <li>Review seed spend after each harvest block, not daily.</li>
            </ul>
          </section>
        </article>

        <CalculatorCta
          relatedLinks={[
            { href: "/blog/greenhouse-layout-guide", label: "Greenhouse Layout Guide" },
            { href: "/blog/keg-vs-jar-profit-guide", label: "Keg vs Jar Profit Guide" },
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
