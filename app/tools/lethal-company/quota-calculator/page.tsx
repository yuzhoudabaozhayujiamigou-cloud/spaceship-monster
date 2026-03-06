import Link from "next/link";

import FaqJsonLd from "../../../components/FaqJsonLd";
import { buildMetadata } from "../../../_seo/metadata";
import { SITE } from "../../../_seo/site";
import QuotaCalculatorClient from "./QuotaCalculatorClient";

export const metadata = buildMetadata({
  title: `Lethal Company Profit Quota Calculator - Plan Your Quotas & Strategy | ${SITE.name}`,
  description:
    "Calculate future profit quotas in Lethal Company. Understand the formula, plan your sells, and avoid quota surprises. Includes strategy tips and team coordination advice.",
  path: "/tools/lethal-company/quota-calculator",
});

const FAQS = [
  {
    question: "Is the first quota always 130 in Lethal Company?",
    answer:
      "In standard runs, players usually treat quota 1 as 130 credits. If your game version or modpack changes economy behavior, verify in-game before committing your sell plan.",
  },
  {
    question: "Why does the profit quota increase so fast later on?",
    answer:
      "Quota growth is quadratic, so each cycle increases by more than the previous one. Early mistakes compound, which is why buffer planning matters by quota 4 and beyond.",
  },
  {
    question: "Can this calculator predict quotas for mods like Progressive Deadline?",
    answer:
      "It is reliable for vanilla-style quota planning and baseline forecasting. For heavy modded economy changes, treat the output as a framework and adjust using your modpack's in-game values.",
  },
  {
    question: "What's the difference between quota number and quota value?",
    answer:
      "Quota number is the cycle index (quota 1, quota 2, etc.). Quota value is the credits target for that specific cycle. Confusing these two is a common planning error.",
  },
  {
    question: "Does selling early change the next quota?",
    answer:
      "No. Selling timing changes your survival margin and wipe risk, but the next quota requirement itself is tied to cycle progression, not your exact sale timing.",
  },
  {
    question: "What happens if you fail to meet the quota?",
    answer:
      "Failing quota ends the run. That is why teams should use a clear abort line, avoid over-greedy extra trips, and preserve enough value to clear with margin.",
  },
];

const EXAMPLE_PROGRESSION = [
  { quota: 1, value: 130, increase: "-" },
  { quota: 2, value: 195, increase: "+65" },
  { quota: 3, value: 285, increase: "+90" },
  { quota: 4, value: 400, increase: "+115" },
  { quota: 5, value: 540, increase: "+140" },
];

export default function LethalCompanyQuotaCalculatorPage() {
  const webAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Lethal Company Profit Quota Calculator",
    url: `${SITE.url}/tools/lethal-company/quota-calculator`,
    applicationCategory: "Calculator",
    operatingSystem: "Web",
    description:
      "Calculate upcoming Lethal Company quotas, compare quota number vs value, and plan sell timing with risk buffer guidance.",
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      <FaqJsonLd faqs={FAQS} />
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppJsonLd) }}
        />

        <div className="mb-8">
          <Link
            href="/tools/lethal-company/"
            className="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
          >
            ← Back to Lethal Company Tools
          </Link>
        </div>

        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Lethal Company Profit Quota Calculator
          </h1>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            Plan upcoming quotas before they surprise your team. This page combines an interactive
            calculator, formula explanation, and practical sell strategy so you can clear deadlines
            with less risk.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/tools/lethal-company/terminal-commands/"
              className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
            >
              Terminal commands
            </Link>
            <Link
              href="/tools/lethal-company/moons/"
              className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
            >
              Moons guide
            </Link>
            <Link
              href="/tools/lethal-company/bestiary/"
              className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
            >
              Bestiary
            </Link>
          </div>
        </header>

        <section className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-2xl font-semibold tracking-tight">
            Lethal Company Profit Quota Calculator
          </h2>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            Use quota number or quota value to project the next checkpoints, then compare against
            your already sold credits and ship value. This reduces end-of-deadline panic and helps
            your crew decide when to bank value early.
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-zinc-300">
            <li>Switch between quota number and quota value input.</li>
            <li>Preview upcoming quotas with increase and cumulative totals.</li>
            <li>Copy progression table or save a permalink with your parameters.</li>
          </ul>
        </section>

        <section id="interactive-calculator" className="mb-10">
          <h2 className="text-2xl font-semibold tracking-tight">Calculator (Interactive Component)</h2>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            Default mode shows the next 10 quotas, with the next immediate quota highlighted. Use
            sell planning mode to choose between quota-only or buffered targets for safer runs.
          </p>
          <div className="mt-5">
            <QuotaCalculatorClient />
          </div>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-2xl font-semibold tracking-tight">How the Profit Quota Formula Works</h2>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            Formula: <code className="rounded bg-zinc-900 px-2 py-1">quota(n) = 130 + 25*(n-1) + 25*(n-1)*(n-2)/2</code>
          </p>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            Practical takeaway: quota growth is quadratic, so each cycle usually adds more pressure
            than the previous one. If your team delays sells too often early, later quotas become
            much harder to recover.
          </p>

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="border-y border-zinc-800 text-left text-xs uppercase tracking-wide text-zinc-400">
                  <th className="px-3 py-2">Quota #</th>
                  <th className="px-3 py-2">Quota Value</th>
                  <th className="px-3 py-2">Increase from Previous</th>
                </tr>
              </thead>
              <tbody>
                {EXAMPLE_PROGRESSION.map((row) => (
                  <tr key={row.quota} className="border-b border-zinc-900/80 text-zinc-300">
                    <td className="px-3 py-2 font-mono">#{row.quota}</td>
                    <td className="px-3 py-2 font-mono">{row.value}</td>
                    <td className="px-3 py-2 font-mono">{row.increase}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="mt-4 text-sm text-zinc-400">
            Common mistake: mixing up quota number and quota value. If someone says &quot;we are
            on quota 4,&quot; that is not the same as &quot;the quota is 4 credits.&quot;
          </p>
        </section>

        <section className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-2xl font-semibold tracking-tight">Strategy: Planning Your Sells</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
              <h3 className="text-lg font-semibold">Sell early vs end-of-deadline</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Sell early when variance is high or teammates are dying often. Hold longer only when
                your route consistency and extraction discipline are strong.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
              <h3 className="text-lg font-semibold">Ship money management</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Avoid all-in greed. Banking value earlier protects your run from one bad weather
                roll or a chaotic wipe near extraction.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
              <h3 className="text-lg font-semibold">Team coordination tips</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Assign clear roles: scout, hauler, and ship support. Cleaner callouts reduce
                time-loss and prevent panic pivots during high-pressure cycles.
              </p>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
              <h3 className="text-lg font-semibold">Risk tolerance by quota level</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Low quotas allow more experimentation. Higher quotas need tighter windows, stricter
                abort lines, and a stronger safety margin before &quot;one last run.&quot;
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-2xl font-semibold tracking-tight">Related Tools & Guides</h2>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            Use these pages together for better route planning, moon selection, and encounter
            survival decisions.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Link
              href="/tools/lethal-company/terminal-commands/"
              className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 hover:border-zinc-700"
            >
              <div className="text-sm font-semibold">Terminal Commands</div>
              <p className="mt-2 text-sm text-zinc-400">
                Copyable command list for routing, selling, and ship-side workflows.
              </p>
            </Link>
            <Link
              href="/tools/lethal-company/moons/"
              className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 hover:border-zinc-700"
            >
              <div className="text-sm font-semibold">Moons Guide</div>
              <p className="mt-2 text-sm text-zinc-400">
                Tier-style framework for selecting moons by risk and consistency.
              </p>
            </Link>
            <Link
              href="/tools/lethal-company/bestiary/"
              className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 hover:border-zinc-700"
            >
              <div className="text-sm font-semibold">Bestiary</div>
              <p className="mt-2 text-sm text-zinc-400">
                Monster behaviors and survival tactics for safer high-value runs.
              </p>
            </Link>
          </div>
        </section>

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
