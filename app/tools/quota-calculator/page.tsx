import Link from "next/link";
import Script from "next/script";

import { buildMetadata } from "../../_seo/metadata";
import FaqJsonLd from "../../components/FaqJsonLd";

export const metadata = buildMetadata({
  title: "Lethal Company Profit Quota Calculator - Next Quota & Runs Planner",
  description:
    "Calculate your next Lethal Company profit quota. Plan your runs, know how much scrap to sell, and never miss quota again.",
  path: "/tools/quota-calculator",
});

const FAQS = [
  {
    question: "What is the first profit quota in Lethal Company?",
    answer: "The first profit quota is 130 credits.",
  },
  {
    question: "Is the next quota fixed or does it have a range?",
    answer:
      "It has variance. The common planning estimate is around 1.75x your current quota, but in-game values can roll above or below that.",
  },
  {
    question: "Should we sell early to meet quota?",
    answer:
      "It depends on days left and your current buffer. If you are close to deadline or behind pace, early selling lowers fail risk.",
  },
  {
    question: "Where can I see the quota in-game?",
    answer: "You can check quota progress from the ship terminal.",
  },
] as const;

const calculatorScript = `
(() => {
  const getById = (id) => document.getElementById(id);
  const numberFormatter = new Intl.NumberFormat("en-US");

  const currentQuotaInput = getById("current-quota");
  const quotaCycleInput = getById("quota-cycle");
  const currentCreditsInput = getById("current-credits");
  const daysLeftInput = getById("days-left");
  const sellEarlyYesInput = getById("sell-early-yes");
  const sellEarlyNoInput = getById("sell-early-no");

  const nextQuotaOutput = getById("next-quota-output");
  const nextQuotaCycleOutput = getById("next-quota-cycle-output");
  const requiredOutput = getById("required-output");
  const bufferOutput = getById("buffer-output");
  const planOutput = getById("plan-output");

  if (
    !currentQuotaInput ||
    !quotaCycleInput ||
    !currentCreditsInput ||
    !daysLeftInput ||
    !sellEarlyYesInput ||
    !sellEarlyNoInput ||
    !nextQuotaOutput ||
    !nextQuotaCycleOutput ||
    !requiredOutput ||
    !bufferOutput ||
    !planOutput
  ) {
    return;
  }

  const formatCredits = (value) => "$" + numberFormatter.format(Math.max(0, Math.floor(value)));

  const parseNumber = (input, fallback, min = null, max = null) => {
    const parsed = Number.parseInt(input.value, 10);
    if (Number.isNaN(parsed)) {
      input.value = String(fallback);
      return fallback;
    }

    let nextValue = parsed;
    if (typeof min === "number") {
      nextValue = Math.max(min, nextValue);
    }
    if (typeof max === "number") {
      nextValue = Math.min(max, nextValue);
    }

    if (String(nextValue) !== input.value) {
      input.value = String(nextValue);
    }

    return nextValue;
  };

  const buildPlan = (quotaCycle, currentQuota, currentCredits, daysLeft, sellEarly) => {
    const required = Math.max(0, currentQuota - currentCredits);
    const perRunTarget = daysLeft > 0 ? Math.ceil(required / daysLeft) : required;

    if (required === 0) {
      if (daysLeft === 0) {
        return "Quota already met on deadline day. Avoid unnecessary spending and prepare for cycle " + (quotaCycle + 1) + ".";
      }
      if (sellEarly) {
        return "Quota is secured. Sell only what you need for supplies, and keep the rest as a safety buffer for cycle " + (quotaCycle + 1) + ".";
      }
      return "Quota is secured. Hold most scrap until later days, then sell for extra buffer if needed.";
    }

    if (daysLeft === 0) {
      return "No days left: sell immediately. You still need " + formatCredits(required) + " to avoid game over.";
    }

    if (daysLeft === 1) {
      if (sellEarly || required > currentQuota * 0.35) {
        return "One day left and behind pace. Sell early now, then run a safer moon and target at least " + formatCredits(perRunTarget) + ".";
      }
      return "One day left. Prioritize one consistent run and target at least " + formatCredits(perRunTarget) + " before final sell.";
    }

    if (daysLeft === 2) {
      if (sellEarly) {
        return "Two days left. Lock in part of the quota today, then aim for about " + formatCredits(perRunTarget) + " per run.";
      }
      return "Two days left. Keep a steady pace of around " + formatCredits(perRunTarget) + " per run and avoid high-risk routes.";
    }

    return "Three days left. Aim for roughly " + formatCredits(perRunTarget) + " per run, keep spending low, and maintain a buffer for cycle " + (quotaCycle + 1) + ".";
  };

  const recalculate = () => {
    const currentQuota = parseNumber(currentQuotaInput, 130, 0);
    const quotaCycle = parseNumber(quotaCycleInput, 1, 1);
    const currentCredits = parseNumber(currentCreditsInput, 0, 0);
    const daysLeft = parseNumber(daysLeftInput, 3, 0, 3);
    const sellEarly = sellEarlyYesInput.checked && !sellEarlyNoInput.checked;

    const nextQuota = Math.floor(currentQuota * 1.75);
    const required = Math.max(0, currentQuota - currentCredits);
    const buffer = Math.max(0, currentCredits - currentQuota);
    const plan = buildPlan(quotaCycle, currentQuota, currentCredits, daysLeft, sellEarly);

    nextQuotaOutput.textContent = formatCredits(nextQuota);
    nextQuotaCycleOutput.textContent = "Estimated cycle " + (quotaCycle + 1);
    requiredOutput.textContent = formatCredits(required);
    bufferOutput.textContent = formatCredits(buffer);
    planOutput.textContent = plan;
  };

  [
    currentQuotaInput,
    quotaCycleInput,
    currentCreditsInput,
    daysLeftInput,
    sellEarlyYesInput,
    sellEarlyNoInput,
  ].forEach((element) => {
    element.addEventListener("input", recalculate);
    element.addEventListener("change", recalculate);
  });

  recalculate();
})();
`;

export default function QuotaCalculatorPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      <FaqJsonLd faqs={FAQS.map((faq) => ({ question: faq.question, answer: faq.answer }))} />
      <Script
        id="quota-calculator-client-script"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{ __html: calculatorScript }}
      />

      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-zinc-400">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href="/" className="hover:text-zinc-100">
                Home
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href="/tools" className="hover:text-zinc-100">
                Tools
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li className="text-zinc-200">Quota Calculator</li>
          </ol>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Lethal Company Profit Quota Calculator
          </h1>
          <p className="mt-3 text-zinc-400">
            Estimate your next quota, check how much you still need, and plan safe runs before the deadline.
          </p>
        </header>

        <section className="mb-10 rounded-2xl border border-zinc-800 bg-zinc-950/50 p-6">
          <h2 className="text-2xl font-semibold tracking-tight">Calculator</h2>
          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            Enter your current numbers to estimate next quota and get a practical run plan.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-xs font-mono uppercase tracking-wide text-zinc-500">
                Current Quota Amount
              </span>
              <input
                id="current-quota"
                type="number"
                min={0}
                defaultValue={130}
                className="mt-2 w-full rounded-xl border border-zinc-800 bg-[#0a0a0a] px-4 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-600"
              />
            </label>

            <label className="block">
              <span className="text-xs font-mono uppercase tracking-wide text-zinc-500">
                Quota Number/Cycle
              </span>
              <input
                id="quota-cycle"
                type="number"
                min={1}
                defaultValue={1}
                className="mt-2 w-full rounded-xl border border-zinc-800 bg-[#0a0a0a] px-4 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-600"
              />
            </label>

            <label className="block">
              <span className="text-xs font-mono uppercase tracking-wide text-zinc-500">
                Current Credits/Scrap Value on Ship
              </span>
              <input
                id="current-credits"
                type="number"
                min={0}
                defaultValue={0}
                className="mt-2 w-full rounded-xl border border-zinc-800 bg-[#0a0a0a] px-4 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-600"
              />
            </label>

            <label className="block">
              <span className="text-xs font-mono uppercase tracking-wide text-zinc-500">Days Left</span>
              <select
                id="days-left"
                defaultValue={3}
                className="mt-2 w-full rounded-xl border border-zinc-800 bg-[#0a0a0a] px-4 py-3 text-sm text-zinc-100 outline-none focus:border-zinc-600"
              >
                <option value={0}>0</option>
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
              </select>
            </label>
          </div>

          <fieldset className="mt-5 rounded-xl border border-zinc-800 bg-[#0a0a0a] p-4">
            <legend className="px-2 text-xs font-mono uppercase tracking-wide text-zinc-500">Sell Early?</legend>
            <div className="flex items-center gap-6">
              <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-zinc-200">
                <input id="sell-early-yes" type="radio" name="sell-early" value="yes" className="accent-emerald-400" />
                Yes
              </label>
              <label className="inline-flex cursor-pointer items-center gap-2 text-sm text-zinc-200">
                <input
                  id="sell-early-no"
                  type="radio"
                  name="sell-early"
                  value="no"
                  defaultChecked
                  className="accent-emerald-400"
                />
                No
              </label>
            </div>
          </fieldset>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <article className="rounded-xl border border-zinc-800 bg-[#0a0a0a] p-4">
              <h3 className="text-xs font-mono uppercase tracking-wide text-zinc-500">Next Quota (Estimated)</h3>
              <p id="next-quota-output" className="mt-2 text-2xl font-semibold text-zinc-100">
                $227
              </p>
              <p id="next-quota-cycle-output" className="mt-1 text-xs text-zinc-500">
                Estimated cycle 2
              </p>
            </article>

            <article className="rounded-xl border border-zinc-800 bg-[#0a0a0a] p-4">
              <h3 className="text-xs font-mono uppercase tracking-wide text-zinc-500">
                Required to Meet Current Quota
              </h3>
              <p id="required-output" className="mt-2 text-2xl font-semibold text-zinc-100">
                $130
              </p>
            </article>

            <article className="rounded-xl border border-zinc-800 bg-[#0a0a0a] p-4">
              <h3 className="text-xs font-mono uppercase tracking-wide text-zinc-500">Buffer Amount</h3>
              <p id="buffer-output" className="mt-2 text-2xl font-semibold text-emerald-300">
                $0
              </p>
            </article>
          </div>

          <article className="mt-4 rounded-xl border border-emerald-600/30 bg-emerald-500/10 p-4">
            <h3 className="text-sm font-semibold text-zinc-100">Recommended Plan</h3>
            <p id="plan-output" className="mt-2 text-sm leading-relaxed text-zinc-200">
              Three days left. Aim for roughly $44 per run, keep spending low, and maintain a buffer for cycle 2.
            </p>
          </article>
        </section>

        <section className="mb-10 rounded-2xl border border-zinc-800 bg-zinc-950/50 p-6">
          <h2 className="text-2xl font-semibold tracking-tight">How Profit Quota Works</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-zinc-300">
            <li>First quota is 130.</li>
            <li>Quotas scale up each cycle (roughly 1.75x).</li>
            <li>3 days to meet quota or game over.</li>
          </ul>
        </section>

        <section className="mb-10 rounded-2xl border border-zinc-800 bg-zinc-950/50 p-6">
          <h2 className="text-2xl font-semibold tracking-tight">Strategy Tips</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <article className="rounded-xl border border-zinc-800 bg-[#0a0a0a] p-4">
              <h3 className="font-semibold text-zinc-100">When to sell early vs wait</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Sell early when days are low or your team is behind pace. Wait when you already have a healthy
                buffer and can run one more safe moon.
              </p>
            </article>
            <article className="rounded-xl border border-zinc-800 bg-[#0a0a0a] p-4">
              <h3 className="font-semibold text-zinc-100">Minimum safe target per run</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Divide remaining required credits by days left, then add a little margin. Consistent low-risk runs
                are better than one all-in gamble.
              </p>
            </article>
            <article className="rounded-xl border border-zinc-800 bg-[#0a0a0a] p-4">
              <h3 className="font-semibold text-zinc-100">Common mistakes</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Overspending before quota is locked, overestimating scrap value, and waiting too long to sell on the
                final day.
              </p>
            </article>
          </div>
        </section>

        <section className="mb-10 rounded-2xl border border-zinc-800 bg-zinc-950/50 p-6">
          <h2 className="text-2xl font-semibold tracking-tight">FAQ</h2>
          <div className="mt-4 space-y-3">
            {FAQS.map((faq) => (
              <details key={faq.question} className="rounded-xl border border-zinc-800 bg-[#0a0a0a] px-4 py-3">
                <summary className="cursor-pointer text-sm font-semibold text-zinc-100">{faq.question}</summary>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>

        <section className="mb-2 rounded-2xl border border-zinc-800 bg-zinc-950/50 p-6">
          <h2 className="text-2xl font-semibold tracking-tight">Related Tools</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Link
              href="/guides/terminal-commands"
              className="rounded-xl border border-zinc-800 bg-[#0a0a0a] p-4 transition-colors hover:bg-zinc-900"
            >
              <h3 className="font-semibold text-zinc-100">Terminal Commands Guide</h3>
              <p className="mt-2 text-sm text-zinc-400">Quick command references for faster, cleaner ship runs.</p>
            </Link>
            <Link
              href="/tools/quota-table"
              className="rounded-xl border border-zinc-800 bg-[#0a0a0a] p-4 transition-colors hover:bg-zinc-900"
            >
              <h3 className="font-semibold text-zinc-100">Quota Table (Future)</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Browse a simple cycle-by-cycle quota table to plan long streaks.
              </p>
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
