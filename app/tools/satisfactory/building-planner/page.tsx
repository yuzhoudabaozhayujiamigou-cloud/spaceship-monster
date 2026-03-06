import Link from "next/link";

import FaqJsonLd from "../../../components/FaqJsonLd";
import { buildMetadata } from "../../../_seo/metadata";
import { SITE } from "../../../_seo/site";
import SatisfactoryToolLinks from "../_components/SatisfactoryToolLinks";
import BuildingPlannerClient from "./BuildingPlannerClient";

export const metadata = buildMetadata({
  title: `Satisfactory Building Planner - Factory Layout, Space Optimization & Machine Counts | ${SITE.name}`,
  description:
    "Satisfactory Building Planner for factory layout strategy, space optimization, and machine count planning. Convert production goals into practical floor plans.",
  path: "/tools/satisfactory/building-planner",
});

const FAQS = [
  {
    question: "What does this Satisfactory Building Planner optimize?",
    answer:
      "It optimizes space planning by combining machine footprint, layout style spacing, floor capacity, and machine density so you can choose a realistic build format.",
  },
  {
    question: "How should I choose between bus, modular, and vertical layouts?",
    answer:
      "Bus layouts are easiest to debug, modular layouts balance growth and clarity, and vertical layouts maximize compactness when terrain is limited.",
  },
  {
    question: "Does the planner include building count calculation?",
    answer:
      "Yes. It computes per-building machine counts from your production target and clock speed, then estimates area by machine type.",
  },
  {
    question: "Can I use this for megabase floor planning?",
    answer:
      "Yes. Increase floor area and machine density thresholds to model large multi-floor campuses before placing foundations in-game.",
  },
];

export default function SatisfactoryBuildingPlannerPage() {
  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Satisfactory Building Planner",
    url: `${SITE.url}/tools/satisfactory/building-planner`,
    applicationCategory: "Calculator",
    operatingSystem: "Web",
    description:
      "Interactive Satisfactory building planner for layout selection, floor planning, machine counts, and space optimization.",
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
            Satisfactory Building Planner
          </h1>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            Build cleaner factories from day one. This planner converts output targets into building
            quantities, area demand, and recommended floor distribution.
          </p>
          <SatisfactoryToolLinks currentSlug="building-planner" compact />
        </header>

        <section className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-2xl font-semibold tracking-tight">Planning checklist</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-zinc-300">
            <li>Define target output and machine clock policy.</li>
            <li>Pick a layout strategy matching your expansion style.</li>
            <li>Set realistic floor area and machine density constraints.</li>
            <li>Build from the generated machine count and area breakdown.</li>
          </ol>
        </section>

        <BuildingPlannerClient />

        <SatisfactoryToolLinks currentSlug="building-planner" />

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
