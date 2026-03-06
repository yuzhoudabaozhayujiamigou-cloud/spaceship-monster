import Link from "next/link";

import FaqJsonLd from "../../../components/FaqJsonLd";
import { buildMetadata } from "../../../_seo/metadata";
import { SITE } from "../../../_seo/site";
import SatisfactoryToolLinks from "../_components/SatisfactoryToolLinks";
import BeltPipeCalculatorClient from "./BeltPipeCalculatorClient";

export const metadata = buildMetadata({
  title: `Satisfactory Belt and Pipe Calculator - Throughput, Flow & Bottleneck Analysis | ${SITE.name}`,
  description:
    "Satisfactory Belt/Pipe Calculator for conveyor speed requirements, pipeline flow rates, and bottleneck analysis. Plan logistics before building your bus.",
  path: "/tools/satisfactory/belt-pipe-calculator",
});

const FAQS = [
  {
    question: "How does this Satisfactory Belt/Pipe Calculator pick a recommended tier?",
    answer:
      "It finds the lowest tier that can handle your throughput on the current line count. If no tier fits, the calculator suggests adding more lines.",
  },
  {
    question: "Why can my line bottleneck even when source and demand look high?",
    answer:
      "Transport capacity can still be the limiting factor. Bottleneck analysis compares source, transport, and demand together to find the true constraint.",
  },
  {
    question: "Should I run belts and pipes near 100% utilization?",
    answer:
      "Usually no. Running at 70-90% leaves room for temporary spikes, uneven extraction, and expansion without immediate redesign.",
  },
  {
    question: "Can this tool be used for manifold planning?",
    answer:
      "Yes. Set total source and demand rates, then model available line capacity to see if your manifold backbone is sufficient.",
  },
];

export default function SatisfactoryBeltPipeCalculatorPage() {
  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Satisfactory Belt and Pipe Calculator",
    url: `${SITE.url}/tools/satisfactory/belt-pipe-calculator`,
    applicationCategory: "Calculator",
    operatingSystem: "Web",
    description:
      "Interactive logistics planner for Satisfactory conveyor belts and pipelines with throughput and bottleneck analysis.",
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
            Satisfactory Belt/Pipe Calculator
          </h1>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            Design logistics that hold under load. Calculate conveyor and pipeline requirements,
            then verify constraints using source-transport-demand bottleneck analysis.
          </p>
          <SatisfactoryToolLinks currentSlug="belt-pipe-calculator" compact />
        </header>

        <section className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-2xl font-semibold tracking-tight">When to use this tool</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-zinc-300">
            <li>Before scaling a production line to avoid hidden transport limits.</li>
            <li>When balancing multiple belts into a single bus lane.</li>
            <li>When splitting fluids across multiple pipes and floor levels.</li>
          </ul>
        </section>

        <BeltPipeCalculatorClient />

        <SatisfactoryToolLinks currentSlug="belt-pipe-calculator" />

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
