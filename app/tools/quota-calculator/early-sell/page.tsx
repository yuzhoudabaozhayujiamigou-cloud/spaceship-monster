import Link from "next/link";

import { buildMetadata } from "../../../_seo/metadata";
import FaqJsonLd from "../../../components/FaqJsonLd";

export const metadata = buildMetadata({
  title: "Lethal Company Early Sell Quota Calculator (How Much to Sell Today)",
  description:
    "Plan an early sell in Lethal Company: estimate how much scrap value you need to sell today to safely meet quota while keeping enough credits for purchases.",
  path: "/tools/quota-calculator/early-sell",
});

const faqs = [
  {
    question: "What does 'early sell' mean in Lethal Company?",
    answer:
      "Early sell means selling scrap before the quota deadline day. Teams do this to secure credits for key purchases or reduce the risk of missing quota at the last moment.",
  },
  {
    question: "Can I sell early and still meet quota?",
    answer:
      "Yes. The goal is to sell the minimum needed to stay safe, while keeping the rest of your scrap value for flexibility. Use the quota calculator to plan how much to sell today based on your current money, scrap value, and planned purchases.",
  },
  {
    question: "Is the early-sell penalty exact?",
    answer:
      "Not always. Different sources describe different sell timings/penalties. This site uses a simple planning assumption for early sell (clearly labeled) so you can make conservative decisions. You can treat it as a buffer if your run behaves differently.",
  },
] as const;

export default function EarlySellQuotaCalculatorPage() {
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
            Early Sell Quota Calculator (Lethal Company)
          </h1>
          <p className="mt-3 leading-relaxed text-zinc-400">
            Selling early is a common way to de-risk quota, but it’s easy to sell too much (and starve your
            team of credits) or too little (and fail the cycle). This page helps you plan the minimum safe
            sell amount.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/tools/lethal-company/quota-calculator?sellTiming=early"
              className="inline-flex items-center justify-center rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-400"
            >
              Open Calculator (Early Sell Mode)
            </Link>
            <Link
              href="/tools/lethal-company/quota-calculator"
              className="inline-flex items-center justify-center rounded-xl border border-zinc-700 bg-[#0a0a0a] px-4 py-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-950"
            >
              Open Vanilla Calculator
            </Link>
          </div>
        </header>

        <section className="mb-10 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-2xl font-semibold tracking-tight">When early sell is worth it</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            <article className="rounded-xl border border-zinc-800 bg-[#0a0a0a] p-4">
              <h3 className="text-base font-semibold text-zinc-100">You need gear credits</h3>
              <p className="mt-2 text-sm text-zinc-400">
                You’re short on essentials (flashlights, shovels, stun, teleporter) and want guaranteed
                credits before committing to a risky moon.
              </p>
            </article>
            <article className="rounded-xl border border-zinc-800 bg-[#0a0a0a] p-4">
              <h3 className="text-base font-semibold text-zinc-100">You’re behind schedule</h3>
              <p className="mt-2 text-sm text-zinc-400">
                If the pace math says you need a big last-day haul, selling a portion early reduces wipe
                risk and smooths quota progress.
              </p>
            </article>
            <article className="rounded-xl border border-zinc-800 bg-[#0a0a0a] p-4">
              <h3 className="text-base font-semibold text-zinc-100">You want risk control</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Some teams prefer “good enough” over jackpot runs. Early sell lets you lock in quota and
                use remaining runs for profit.
              </p>
            </article>
          </div>
        </section>

        <section className="mb-10 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-2xl font-semibold tracking-tight">What to enter in the calculator</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-300">
            <li>
              <span className="font-semibold text-zinc-100">Current quota</span>: the target you must hit this
              cycle.
            </li>
            <li>
              <span className="font-semibold text-zinc-100">Ship money</span>: credits you already have.
            </li>
            <li>
              <span className="font-semibold text-zinc-100">Scrap value on ship</span>: your best estimate of
              sellable value currently onboard.
            </li>
            <li>
              <span className="font-semibold text-zinc-100">Planned purchases</span>: budget for gear you want
              before the next run.
            </li>
            <li>
              <span className="font-semibold text-zinc-100">Target end money</span> (optional): if you’re trying
              to leave the cycle with a cushion.
            </li>
          </ul>
          <p className="mt-4 text-sm text-zinc-400">
            Note: early-sell mechanics are sometimes described differently across versions/sources. Treat the
            early-sell model as a conservative planning buffer.
          </p>
        </section>

        <section className="mb-10 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-2xl font-semibold tracking-tight">Related guides</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link
              href="/tools/lethal-company/terminal-commands/"
              className="rounded-xl border border-zinc-800 bg-[#0a0a0a] p-4 transition-colors hover:bg-zinc-950"
            >
              <h3 className="font-semibold text-zinc-100">Terminal Commands</h3>
              <p className="mt-2 text-sm text-zinc-400">Quick commands for MOONS/STORE/BESTIARY workflows.</p>
            </Link>
            <Link
              href="/tools/lethal-company/moons/tier-list/"
              className="rounded-xl border border-zinc-800 bg-[#0a0a0a] p-4 transition-colors hover:bg-zinc-950"
            >
              <h3 className="font-semibold text-zinc-100">Moons Tier List</h3>
              <p className="mt-2 text-sm text-zinc-400">Pick lower-variance routes when quota pressure is high.</p>
            </Link>
            <Link
              href="/guides/profit-quota-formula"
              className="rounded-xl border border-zinc-800 bg-[#0a0a0a] p-4 transition-colors hover:bg-zinc-950"
            >
              <h3 className="font-semibold text-zinc-100">Quota Formula Explained</h3>
              <p className="mt-2 text-sm text-zinc-400">Baseline formula + planning range for later cycles.</p>
            </Link>
          </div>
        </section>

        <section className="mb-4">
          <h2 className="text-2xl font-semibold tracking-tight">FAQ</h2>
          <div className="mt-4 space-y-3">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="rounded-xl border border-zinc-800 bg-[#0a0a0a] px-4 py-3"
              >
                <summary className="cursor-pointer text-sm font-semibold text-zinc-100">
                  {faq.question}
                </summary>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
