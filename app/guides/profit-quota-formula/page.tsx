import Link from "next/link";

import { buildMetadata } from "../../_seo/metadata";
import { SITE } from "../../_seo/site";

export const metadata = buildMetadata({
  title: `Lethal Company Profit Quota Formula (Vanilla) | ${SITE.name}`,
  description:
    "A practical explanation of how profit quota scales in vanilla Lethal Company, what it means for planning runs, and when to sell scrap.",
  path: "/guides/profit-quota-formula",
});

const FAQ = [
  {
    q: "Is the quota formula the same in vanilla and mods?",
    a: "Not always. Mods can change pacing, scrap value, or difficulty. This page focuses on vanilla assumptions. If you play modded, treat the calculator as a planning baseline.",
  },
  {
    q: "Should I sell scrap early or wait until the last day?",
    a: "If you’re not safely above quota, selling early reduces end-of-cycle panic. If you’re comfortably ahead, you can wait and choose a sell timing that matches your risk tolerance.",
  },
  {
    q: "Does moon tier change the quota formula?",
    a: "Moon choice doesn’t change the quota formula directly, but it changes your expected scrap value and wipe risk — which is why planning buffer matters.",
  },
] as const;

export default function ProfitQuotaFormulaGuidePage() {
  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />

        <div className="mb-8 flex items-center justify-between gap-3">
          <Link
            href="/tools/lethal-company/"
            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            ← Back to Lethal Company tools
          </Link>
          <div className="hidden sm:block text-xs font-mono text-zinc-500">guide</div>
        </div>

        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Lethal Company Profit Quota Formula (Vanilla)
          </h1>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            This is a practical explanation of how quota scales and how to plan your runs.
            It’s designed to pair with the calculator.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/tools/lethal-company/quota-calculator"
              className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
            >
              Open quota calculator
            </Link>
            <Link
              href="/tools/lethal-company/moons"
              className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
            >
              Moons & risk notes
            </Link>
          </div>
        </header>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-xl font-semibold">What this page covers</h2>
          <div className="mt-3 space-y-3 text-sm text-zinc-400 leading-relaxed">
            <p>
              Players usually don’t fail quota because they can’t loot — they fail because they don’t plan pace.
              Quota scaling punishes “we’ll figure it out later”.
            </p>
            <p>
              This guide focuses on 3 practical questions:
            </p>
            <ol className="list-decimal pl-5 space-y-2">
              <li>How quota grows (conceptually) across quotas.</li>
              <li>How buffer changes decision-making.</li>
              <li>When selling early beats waiting for the last day.</li>
            </ol>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-xl font-semibold">How quota scales (the useful mental model)</h2>
          <div className="mt-3 space-y-3 text-sm text-zinc-400 leading-relaxed">
            <p>
              In vanilla, quota growth behaves like a curve: early quotas feel manageable,
              then the required sell value ramps faster over time.
            </p>
            <p>
              The exact coefficients can vary across patches and references.
              If you need a guaranteed correct number for your run, use the calculator with your current quota target.
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-xl font-semibold">Sell early vs sell on the last day</h2>
          <div className="mt-3 space-y-3 text-sm text-zinc-400 leading-relaxed">
            <p>
              Selling early is a risk management move: it reduces the chance that one bad run (wipe / weather / bad RNG)
              turns into a quota failure.
            </p>
            <p>
              Selling on the last day is a volatility play: it can be fine when you’re far above target,
              but it makes your run sensitive to a single mistake.
            </p>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-xl font-semibold">FAQ</h2>
          <div className="mt-4 space-y-4">
            {FAQ.map((item) => (
              <div key={item.q} className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
                <div className="text-sm font-medium text-zinc-100">{item.q}</div>
                <div className="mt-2 text-sm text-zinc-400 leading-relaxed">{item.a}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-xl font-semibold">Next steps</h2>
          <div className="mt-3 space-y-3 text-sm text-zinc-400 leading-relaxed">
            <p>
              Use the calculator to set a realistic plan, then refine it by moon choice and your team’s consistency.
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <Link
                  className="text-zinc-100 underline decoration-zinc-600 hover:decoration-zinc-300"
                  href="/tools/lethal-company/quota-calculator"
                >
                  Quota calculator
                </Link>
              </li>
              <li>
                <Link
                  className="text-zinc-100 underline decoration-zinc-600 hover:decoration-zinc-300"
                  href="/tools/lethal-company/terminal-commands"
                >
                  Terminal commands
                </Link>
              </li>
              <li>
                <Link
                  className="text-zinc-100 underline decoration-zinc-600 hover:decoration-zinc-300"
                  href="/tools/lethal-company/moons"
                >
                  Moons
                </Link>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}
