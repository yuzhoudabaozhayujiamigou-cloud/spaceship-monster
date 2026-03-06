import Link from "next/link";

import FaqJsonLd from "../../../components/FaqJsonLd";
import { buildMetadata } from "../../../_seo/metadata";
import { SITE } from "../../../_seo/site";
import SatisfactoryToolLinks from "../_components/SatisfactoryToolLinks";
import PowerCalculatorClient from "./PowerCalculatorClient";

export const metadata = buildMetadata({
  title: `Satisfactory Power Calculator - Factory MW, Generator Setup & Fuel Usage | ${SITE.name}`,
  description:
    "Satisfactory Power Calculator to estimate factory power demand, generator counts, and fuel consumption. Plan reserve margin and avoid unstable grids.",
  path: "/tools/satisfactory/power-calculator",
});

const FAQS = [
  {
    question: "How does machine overclock affect the power calculation?",
    answer:
      "The calculator scales machine power using a non-linear overclock curve, so raising clock speed increases power draw faster than throughput.",
  },
  {
    question: "Why should I keep reserve margin in Satisfactory?",
    answer:
      "A reserve margin gives you room for startup spikes, temporary overdraw, and expansion. Running at 100% load makes trips and outages more likely.",
  },
  {
    question: "Does this tool recommend one best generator type?",
    answer:
      "It shows options across biomass, coal, fuel, turbofuel, and nuclear. The best choice depends on your unlock tier, logistics, and maintenance tolerance.",
  },
  {
    question: "Can I model a mixed generator grid?",
    answer:
      "Use the total MW target as your baseline, then split capacity manually across rows (for example 70% fuel + 30% nuclear).",
  },
];

export default function SatisfactoryPowerCalculatorPage() {
  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Satisfactory Power Calculator",
    url: `${SITE.url}/tools/satisfactory/power-calculator`,
    applicationCategory: "Calculator",
    operatingSystem: "Web",
    description:
      "Interactive Satisfactory power planner for machine demand, reserve margins, generator counts, and fuel burn rates.",
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
            Satisfactory Power Calculator
          </h1>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            Keep your grid stable while scaling. Estimate total factory demand, add reserve headroom,
            and compare generator setups with fuel and water consumption.
          </p>
          <SatisfactoryToolLinks currentSlug="power-calculator" compact />
        </header>

        <section className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-2xl font-semibold tracking-tight">Planning workflow</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-zinc-300">
            <li>Set machine counts and a global clock speed.</li>
            <li>Add reserve margin based on your risk tolerance.</li>
            <li>Review generator count and fuel draw for each power tier.</li>
            <li>Choose a preferred setup and confirm logistics feasibility.</li>
          </ol>
        </section>

        <PowerCalculatorClient />

        <SatisfactoryToolLinks currentSlug="power-calculator" />

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
