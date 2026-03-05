import Link from "next/link";

import { buildMetadata } from "../../_seo/metadata";
import { SITE } from "../../_seo/site";
import CalculatorCta from "../_components/CalculatorCta";

export const metadata = buildMetadata({
  title: `Greenhouse Layout Guide (Profit-First Planning) | ${SITE.name}`,
  description:
    "A practical greenhouse layout strategy focused on throughput, machine sync, and weekly profit consistency.",
  path: "/blog/greenhouse-layout-guide",
});

const faqs = [
  {
    question: "What makes a greenhouse layout profitable?",
    answer:
      "Profit layouts reduce idle tiles and synchronize harvest cadence with processing capacity, so high-value crops do not bottleneck.",
  },
  {
    question: "Should I fill every tile with the same crop?",
    answer:
      "Mono-crop layouts are simple, but mixed lanes can stabilize risk and improve machine utilization across the week.",
  },
  {
    question: "How important are pathing and chest position?",
    answer:
      "Very. Small movement inefficiencies repeat every harvest cycle and reduce actual weekly profit.",
  },
  {
    question: "How do I choose crops for greenhouse lanes?",
    answer:
      "Pick crops based on harvest interval and processing target, then validate expected weekly output in the calculator.",
  },
];

export default function GreenhouseLayoutGuidePage() {
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
    headline: "Greenhouse Layout Guide (Profit-First Planning)",
    description:
      "Greenhouse planning with throughput-first layout logic and predictable weekly output.",
    url: `${SITE.url}/blog/greenhouse-layout-guide`,
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
              Greenhouse Layout Guide
            </h1>
            <p className="mt-3 text-zinc-400 leading-relaxed">
              The greenhouse is a throughput machine, not just a crop room. A
              strong layout keeps harvest time short, keeps kegs and jars fed,
              and avoids dead time between processing cycles.
            </p>
          </header>

          <section className="space-y-4 text-sm leading-relaxed text-zinc-300">
            <p>
              Start by grouping tiles into operational lanes. Each lane should
              have a purpose: high-frequency harvest, high-margin processing, or
              low-maintenance cash flow. When all tiles do everything, nothing is
              easy to run.
            </p>
            <p>
              Place chests and path anchors where handoff happens, not where it
              looks clean. Profit layouts are logistics systems. If your pickup
              and drop-off loop crosses the room repeatedly, you are leaking time.
            </p>
            <p>
              Finally, plan by weekly output. Calculate expected crops harvested,
              processed units completed, and sale timing. This turns layout
              decisions into numbers instead of vibes.
            </p>
          </section>

          <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
            <h2 className="text-xl font-semibold">Layout Checklist</h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-300">
              <li>One lane for repeat harvest crops, one lane for premium batches.</li>
              <li>Chest placement near transition point to processing area.</li>
              <li>Pathing that minimizes diagonal movement waste.</li>
              <li>Harvest schedule aligned to your machine turnaround.</li>
            </ul>
          </section>
        </article>

        <CalculatorCta
          relatedLinks={[
            { href: "/blog/best-crops-every-season", label: "Best Crops Every Season" },
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
