import Link from "next/link";

import { buildMetadata } from "../../../_seo/metadata";
import FaqJsonLd from "../../../components/FaqJsonLd";
import QuotaCalculatorClient from "./QuotaCalculatorClient";
import { buildBaselineQuotaTable } from "./quotaMath";

export const metadata = buildMetadata({
  title: "Lethal Company Quota Calculator: Next Quota, Total Needed & Planning",
  description:
    "Use this quota calculator lethal company tool to estimate next quota, check total still needed, and plan safe +10%/+20% targets.",
  path: "/tools/lethal-company/quota-calculator",
});

const quotaRows = buildBaselineQuotaTable(10);

const faqs = [
  {
    question: "Does unsold scrap on the ship count toward quota?",
    answer:
      "Not yet. Unsold scrap only becomes quota progress after you sell it to the Company. The calculator input should include your best estimate of money plus sellable scrap value.",
  },
  {
    question: "Is the next quota number exact?",
    answer:
      "No. Vanilla applies a random multiplier each completed cycle. This page shows a baseline estimate (multiplier 1.0) plus a common low-high range for planning.",
  },
  {
    question: "What does +10% or +20% buffer mean?",
    answer:
      "It means selling above bare minimum quota. Example: if quota is 500, a +10% buffer target is 550 and +20% is 600. This reduces fail risk from bad runs or mispriced loot.",
  },
  {
    question: "Should we sell early or wait until the final day?",
    answer:
      "If you are behind quota or need guaranteed credits for key purchases, sell part of your haul earlier. If you are stable and coordinated, waiting can keep more flexibility for route decisions.",
  },
  {
    question: "How should teams divide roles for quota consistency?",
    answer:
      "Use clear roles: one ship-side caller, one route scout, and one or two haulers. Role clarity improves extraction speed and lowers avoidable deaths, which usually matters more than risky jackpot runs.",
  },
] as const;

export default function QuotaCalculatorPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      <FaqJsonLd faqs={faqs.map((faq) => ({ question: faq.question, answer: faq.answer }))} />

      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
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
            Lethal Company Quota Calculator (Vanilla)
          </h1>
          <p className="mt-3 leading-relaxed text-zinc-400">
            Estimate your next quota, see exactly how much value you still need this cycle, and plan a safer
            sell target with built-in +10% and +20% buffers.
          </p>
        </header>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold tracking-tight">Calculator</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            Enter the quota number you are currently on, then add your current money and ship scrap estimate.
            Days left is optional and only used for pacing.
          </p>
          <div className="mt-4">
            <QuotaCalculatorClient />
          </div>
        </section>

        <section className="mb-10 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-2xl font-semibold tracking-tight">Quota Basics</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-zinc-300">
            <p>
              Quota progress comes from credits gained by selling scrap. Unsold loot on your ship is potential
              value, but it is not quota progress until sold.
            </p>
            <p>
              If your crew often misses by a small amount, use a planned buffer and sell earlier instead of waiting
              for one perfect last run.
            </p>
            <ul className="list-disc space-y-1 pl-5 text-zinc-400">
              <li>Count realistic sell value, not optimistic value.</li>
              <li>Keep emergency credits for essential gear and recoveries.</li>
              <li>When behind schedule, prioritize consistent moons over volatile jackpots.</li>
            </ul>
          </div>
        </section>

        <section className="mb-10 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-2xl font-semibold tracking-tight">Quota Formula</h2>
          <div className="mt-4 space-y-4 text-sm leading-relaxed text-zinc-300">
            <p>
              Vanilla starts at <span className="font-semibold text-zinc-100">Quota 1 = 130</span>. For later quotas,
              the increase scales with quota count and an RNG multiplier each cycle.
            </p>
            <pre className="overflow-x-auto rounded-xl border border-zinc-800 bg-[#0a0a0a] p-4 text-xs text-zinc-300">
{`nextQuota = floor(
  currentQuota
  + 100 * (1 + ((currentQuotaNumber - 1)^2 / 16)) * randomMultiplier
)

baseline multiplier used here: 1.0
common planning range: 0.5 to 1.5`}
            </pre>
            <p>
              First 10 quotas below use the baseline multiplier (1.0), so they are stable planning values rather
              than exact per-run rolls.
            </p>
          </div>

          <div className="mt-5 overflow-x-auto rounded-xl border border-zinc-800">
            <table className="min-w-full text-sm">
              <thead className="border-b border-zinc-800 bg-zinc-950/70">
                <tr className="text-left text-xs uppercase tracking-wide text-zinc-500">
                  <th className="px-4 py-3">Quota #</th>
                  <th className="px-4 py-3">Target</th>
                  <th className="px-4 py-3">Increase</th>
                </tr>
              </thead>
              <tbody>
                {quotaRows.map((row) => (
                  <tr key={row.quotaNumber} className="border-b border-zinc-800/80 last:border-b-0">
                    <td className="px-4 py-3 font-mono text-zinc-200">{row.quotaNumber}</td>
                    <td className="px-4 py-3 font-mono text-zinc-100">${row.target.toLocaleString("en-US")}</td>
                    <td className="px-4 py-3 font-mono text-zinc-400">
                      {row.increase === 0 ? "-" : `+${row.increase.toLocaleString("en-US")}`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-10 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-2xl font-semibold tracking-tight">Planning Tips</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <article className="rounded-xl border border-zinc-800 bg-[#0a0a0a] p-4">
              <h3 className="text-base font-semibold text-zinc-100">Buffer first</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Use +10% as standard safety. Use +20% when your team is inconsistent or days left is low.
              </p>
            </article>
            <article className="rounded-xl border border-zinc-800 bg-[#0a0a0a] p-4">
              <h3 className="text-base font-semibold text-zinc-100">Avoid common mistakes</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Biggest misses come from overestimating loot value, delaying sales too long, and spending credits
                without reserving quota margin.
              </p>
            </article>
            <article className="rounded-xl border border-zinc-800 bg-[#0a0a0a] p-4">
              <h3 className="text-base font-semibold text-zinc-100">Assign clear roles</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Ship caller handles comms and timing, scout handles path risk, haulers maximize extraction pace.
              </p>
            </article>
          </div>
        </section>

        <section className="mb-10 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-2xl font-semibold tracking-tight">Related Tools</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link
              href="/tools/lethal-company/terminal-commands/"
              className="rounded-xl border border-zinc-800 bg-[#0a0a0a] p-4 transition-colors hover:bg-zinc-950"
            >
              <h3 className="font-semibold text-zinc-100">Terminal Commands</h3>
              <p className="mt-2 text-sm text-zinc-400">Ship-side command reference for faster, cleaner runs.</p>
            </Link>
            <Link
              href="/tools/lethal-company/moons/"
              className="rounded-xl border border-zinc-800 bg-[#0a0a0a] p-4 transition-colors hover:bg-zinc-950"
            >
              <h3 className="font-semibold text-zinc-100">Moons Guide</h3>
              <p className="mt-2 text-sm text-zinc-400">Pick lower-variance routes when quota pressure is high.</p>
            </Link>
            <Link
              href="/tools/lethal-company/bestiary/"
              className="rounded-xl border border-zinc-800 bg-[#0a0a0a] p-4 transition-colors hover:bg-zinc-950"
            >
              <h3 className="font-semibold text-zinc-100">Bestiary</h3>
              <p className="mt-2 text-sm text-zinc-400">Monster behavior and survival rules to reduce wipe risk.</p>
            </Link>
          </div>
        </section>

        <section className="mb-4">
          <h2 className="text-2xl font-semibold tracking-tight">FAQ</h2>
          <div className="mt-4 space-y-3">
            {faqs.map((faq) => (
              <details key={faq.question} className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4">
                <summary className="cursor-pointer text-sm font-semibold text-zinc-100">{faq.question}</summary>
                <p className="mt-3 text-sm leading-relaxed text-zinc-400">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
