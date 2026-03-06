import Link from "next/link";

import FaqJsonLd from "../../../components/FaqJsonLd";
import { buildMetadata } from "../../../_seo/metadata";
import { SITE } from "../../../_seo/site";
import SatisfactoryToolLinks from "../_components/SatisfactoryToolLinks";
import ProductionCalculatorClient from "./ProductionCalculatorClient";

export const metadata = buildMetadata({
  title: `Satisfactory Production Calculator - Production Chain, Raw Materials & Building Count | ${SITE.name}`,
  description:
    "Satisfactory Production Calculator for full production chains. Calculate raw material requirements, machine count, and factory power needs from your target output.",
  path: "/tools/satisfactory/production-calculator",
});

const FAQS = [
  {
    question: "How does this Satisfactory Production Calculator handle machine clock speed?",
    answer:
      "The calculator computes recipe rates at 100% first, then applies your selected clock speed to machine count and power draw. Underclocking increases machine count and overclocking reduces it.",
  },
  {
    question: "Does the calculator include full production chains or only direct ingredients?",
    answer:
      "It expands recursively until raw resources, so you can see every intermediate component and all base material requirements per minute.",
  },
  {
    question: "Can I use this page to estimate factory footprint before building?",
    answer:
      "Yes. The building table includes a footprint estimate in square meters based on machine count and per-building footprint values.",
  },
  {
    question: "Are alternate recipes included?",
    answer:
      "This version uses one baseline recipe per item for stable planning. Treat it as a default planning model before fine-tuning with your unlock set.",
  },
];

export default function SatisfactoryProductionCalculatorPage() {
  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Satisfactory Production Calculator",
    url: `${SITE.url}/tools/satisfactory/production-calculator`,
    applicationCategory: "Calculator",
    operatingSystem: "Web",
    description:
      "Interactive Satisfactory production planner that calculates raw materials, production chain stages, machine quantities, and estimated power.",
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      <FaqJsonLd faqs={FAQS} />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
        />

        <div className="mb-8">
          <Link
            href="/tools/satisfactory/"
            className="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
          >
            ← Back to Satisfactory Tools
          </Link>
        </div>

        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Satisfactory Production Calculator
          </h1>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            Plan from your target output backwards to raw resources. This calculator shows the full
            production chain, required materials per minute, and machine counts at your selected
            clock speed.
          </p>
          <SatisfactoryToolLinks currentSlug="production-calculator" compact />
        </header>

        <section className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-2xl font-semibold tracking-tight">How to use this calculator</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-zinc-300">
            <li>Choose your target product.</li>
            <li>Set a desired output rate per minute.</li>
            <li>Adjust machine clock speed to match your factory style.</li>
            <li>Read the raw inputs, building counts, and chain stages below.</li>
          </ol>
        </section>

        <ProductionCalculatorClient />

        <SatisfactoryToolLinks currentSlug="production-calculator" />

        <section className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-2xl font-semibold tracking-tight">FAQ</h2>
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
