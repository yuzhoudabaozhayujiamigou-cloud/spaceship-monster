import Link from "next/link";

import FaqJsonLd from "../../../components/FaqJsonLd";
import { buildMetadata } from "../../../_seo/metadata";
import { SITE } from "../../../_seo/site";
import SatisfactoryToolLinks from "../_components/SatisfactoryToolLinks";
import ResourceMapClient from "./ResourceMapClient";

export const metadata = buildMetadata({
  title: `Satisfactory Resource Map - Node Locations, Purity and Best Gathering Spots | ${SITE.name}`,
  description:
    "Satisfactory Resource Map with node locations, purity filters, and optimal gathering point recommendations. Plan extraction hubs for long-term factory growth.",
  path: "/tools/satisfactory/resource-map",
});

const FAQS = [
  {
    question: "What makes a node an optimal gathering point in this Satisfactory Resource Map?",
    answer:
      "The map combines purity with nearby resource diversity and logistics signals like water, coal, or oil access. Higher score means stronger long-term expansion potential.",
  },
  {
    question: "Can I filter by both purity and region?",
    answer:
      "Yes. Use the filters together to isolate practical candidates that fit your current build location and progression stage.",
  },
  {
    question: "Are coordinates exact in-game coordinates?",
    answer:
      "They are planning coordinates for comparative routing and location clustering. Use them as directional guidance when scouting your final build site.",
  },
  {
    question: "How should I use this map with the other calculators?",
    answer:
      "Start with production and power demand, then use this map to choose extraction sites that can sustain the required throughput.",
  },
];

export default function SatisfactoryResourceMapPage() {
  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Satisfactory Resource Map",
    url: `${SITE.url}/tools/satisfactory/resource-map`,
    applicationCategory: "GameApplication",
    operatingSystem: "Web",
    description:
      "Interactive Satisfactory resource node map with purity filters, region filters, and optimal gathering recommendations.",
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
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Satisfactory Resource Map</h1>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            Find stronger extraction locations faster. Filter node positions by resource type,
            purity, and region, then prioritize the best gathering points for scalable factory
            logistics.
          </p>
          <SatisfactoryToolLinks currentSlug="resource-map" compact />
        </header>

        <section className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-2xl font-semibold tracking-tight">How to route site selection</h2>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm text-zinc-300">
            <li>Filter for your target raw resource first.</li>
            <li>Use purity and region filters to narrow practical candidates.</li>
            <li>Pick top-scored nodes with nearby supporting resources.</li>
            <li>Validate transport distance with the Belt/Pipe Calculator.</li>
          </ol>
        </section>

        <ResourceMapClient />

        <SatisfactoryToolLinks currentSlug="resource-map" />

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
