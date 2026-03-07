"use client";

import { useState } from "react";
import Link from "next/link";

export default function QuotaCalculatorClient() {
  const [week, setWeek] = useState(1);
  const [currentBalance, setCurrentBalance] = useState(0);
  const [scrapValue, setScrapValue] = useState(0);
  const [plannedPurchases, setPlannedPurchases] = useState(0);
  const [sellEarly, setSellEarly] = useState(false);

  // Quota formula (simplified progression)
  const calculateQuota = (weekNum: number): number => {
    if (weekNum === 1) return 130;
    // Approximate quadratic progression
    return Math.floor(130 + (weekNum - 1) * 50 + Math.pow(weekNum - 1, 1.5) * 20);
  };

  const quota = calculateQuota(week);
  const totalAvailable = currentBalance + scrapValue;
  const afterPurchases = totalAvailable - plannedPurchases;
  const buffer = afterPurchases - quota;
  const hasEnough = afterPurchases >= quota;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 sm:py-12">
        {/* Header */}
        <header className="mb-8 rounded-2xl border border-orange-500/30 bg-slate-800/50 p-6 backdrop-blur-sm">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <p className="text-sm font-semibold uppercase tracking-wider text-orange-400">
              Lethal Company Tool
            </p>
          </div>
          <h1 className="text-3xl font-bold text-white sm:text-4xl">
            Quota Calculator
          </h1>
          <p className="mt-3 text-base leading-relaxed text-slate-300">
            Plan your profit quota, calculate required scrap sales, and avoid failing deadlines. 
            Input your week, balance, and scrap to get instant sell recommendations.
          </p>
        </header>

        {/* Calculator */}
        <div className="mb-8 rounded-2xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm">
          <h2 className="mb-4 text-xl font-semibold text-white">Calculator</h2>
          
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Week */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Week / Quota Number
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={week}
                onChange={(e) => setWeek(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-2 text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>

            {/* Current Balance */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Current Company Balance ($)
              </label>
              <input
                type="number"
                min="0"
                value={currentBalance}
                onChange={(e) => setCurrentBalance(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-2 text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>

            {/* Scrap Value */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Scrap Value on Ship ($)
              </label>
              <input
                type="number"
                min="0"
                value={scrapValue}
                onChange={(e) => setScrapValue(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-2 text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>

            {/* Planned Purchases */}
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Planned Store Purchases ($)
              </label>
              <input
                type="number"
                min="0"
                value={plannedPurchases}
                onChange={(e) => setPlannedPurchases(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full rounded-lg border border-slate-600 bg-slate-900 px-4 py-2 text-white focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
              />
            </div>
          </div>

          {/* Sell Early Toggle */}
          <div className="mt-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={sellEarly}
                onChange={(e) => setSellEarly(e.target.checked)}
                className="h-5 w-5 rounded border-slate-600 bg-slate-900 text-orange-500 focus:ring-2 focus:ring-orange-500/50"
              />
              <span className="text-sm text-slate-300">
                Sell early (before deadline)
              </span>
            </label>
          </div>
        </div>

        {/* Results */}
        <div className="mb-8 rounded-2xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm">
          <h2 className="mb-4 text-xl font-semibold text-white">Results</h2>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
              <p className="text-sm text-slate-400">Quota Required</p>
              <p className="mt-1 text-2xl font-bold text-white">${quota}</p>
            </div>

            <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
              <p className="text-sm text-slate-400">Total Available</p>
              <p className="mt-1 text-2xl font-bold text-white">${totalAvailable}</p>
            </div>

            <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
              <p className="text-sm text-slate-400">After Purchases</p>
              <p className="mt-1 text-2xl font-bold text-white">${afterPurchases}</p>
            </div>

            <div className={`rounded-lg border p-4 ${
              hasEnough 
                ? 'border-green-500/50 bg-green-900/20' 
                : 'border-red-500/50 bg-red-900/20'
            }`}>
              <p className="text-sm text-slate-400">Buffer / Deficit</p>
              <p className={`mt-1 text-2xl font-bold ${
                hasEnough ? 'text-green-400' : 'text-red-400'
              }`}>
                {buffer >= 0 ? '+' : ''}{buffer}
              </p>
            </div>
          </div>

          {/* Recommendation */}
          <div className="mt-6 rounded-lg border border-orange-500/30 bg-orange-900/10 p-4">
            <p className="text-sm font-semibold text-orange-400">Recommendation</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">
              {hasEnough ? (
                <>
                  ✅ You have enough to meet quota! 
                  {buffer > 50 && ` You have a ${buffer} buffer for safety.`}
                  {sellEarly && " Selling early gives you flexibility for purchases."}
                </>
              ) : (
                <>
                  ⚠️ You need ${Math.abs(buffer)} more scrap value to meet quota. 
                  {plannedPurchases > 0 && " Consider reducing purchases or doing more runs."}
                </>
              )}
            </p>
          </div>
        </div>

        {/* How Quota Works */}
        <section className="mb-8 rounded-2xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm">
          <h2 className="mb-4 text-2xl font-semibold text-white">
            How Profit Quota Works
          </h2>
          
          <div className="space-y-4 text-slate-300">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                First Quota and Progression
              </h3>
              <p className="leading-relaxed">
                The first quota is fixed at <strong className="text-orange-400">$130</strong>. 
                Each subsequent week, the quota increases following a ramping pattern. 
                By week 5, you might see quotas around $400-500, and by week 10, they can exceed $1,000.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                Quota Increase Pattern
              </h3>
              <p className="leading-relaxed">
                The game uses a progression formula that ramps up faster over time. 
                Early weeks add ~$50-100 per quota, but later weeks can jump by $200-300. 
                This calculator approximates the pattern so you can plan ahead.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                What Happens If You Sell Early
              </h3>
              <p className="leading-relaxed">
                Selling scrap before the deadline adds to your company balance immediately. 
                This doesn&apos;t change the quota amount, but it gives you more flexibility to buy gear 
                or handle unexpected losses. The trade-off is you lose the option to hold scrap for later.
              </p>
            </div>
          </div>
        </section>

        {/* Selling Strategy */}
        <section className="mb-8 rounded-2xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm">
          <h2 className="mb-4 text-2xl font-semibold text-white">
            Selling Strategy
          </h2>
          
          <div className="space-y-4 text-slate-300">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                When to Sell Early (Risk Control)
              </h3>
              <ul className="list-inside list-disc space-y-1 leading-relaxed">
                <li>You need credits now for essential gear (flashlight, ladder, shovel)</li>
                <li>You&apos;re close to quota and want to lock in progress</li>
                <li>Your team is struggling and you want to reduce pressure</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                When to Hold Scrap (Maximize Flexibility)
              </h3>
              <ul className="list-inside list-disc space-y-1 leading-relaxed">
                <li>You&apos;re far from quota and need more runs anyway</li>
                <li>You want to keep options open for last-minute purchases</li>
                <li>You&apos;re confident in your team&apos;s ability to avoid losses</li>
              </ul>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold text-white">
                Common Mistakes
              </h3>
              <ul className="list-inside list-disc space-y-1 leading-relaxed">
                <li>Forgetting to account for planned purchases when calculating buffer</li>
                <li>Overestimating scrap value (some items are worth less than they look)</li>
                <li>Not keeping a safety buffer (aim for +$50-100 above quota)</li>
                <li>Selling too early and then needing credits for emergency gear</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Examples */}
        <section className="mb-8 rounded-2xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm">
          <h2 className="mb-4 text-2xl font-semibold text-white">Examples</h2>
          
          <div className="space-y-4">
            <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
              <h3 className="mb-2 font-semibold text-orange-400">
                Example 1 — Just Enough Scrap, No Purchases
              </h3>
              <p className="text-sm leading-relaxed text-slate-300">
                Week 3, Quota $230. Balance $50, Scrap $200. No purchases planned. 
                Total available: $250. Buffer: +$20. ✅ Safe to meet quota, but keep the buffer for emergencies.
              </p>
            </div>

            <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
              <h3 className="mb-2 font-semibold text-orange-400">
                Example 2 — Buying Gear, Need Extra Buffer
              </h3>
              <p className="text-sm leading-relaxed text-slate-300">
                Week 5, Quota $450. Balance $100, Scrap $400. Planning to buy ladder ($60) and flashlight ($15). 
                After purchases: $425. Deficit: -$25. ⚠️ Need one more run or reduce purchases.
              </p>
            </div>

            <div className="rounded-lg border border-slate-700 bg-slate-900/50 p-4">
              <h3 className="mb-2 font-semibold text-orange-400">
                Example 3 — Team Run, Pacing by Days
              </h3>
              <p className="text-sm leading-relaxed text-slate-300">
                Week 7, Quota $700. 3 days left. Balance $200, Scrap $300. Need $200 more. 
                Target: ~$70/day for 3 days. Plan 1-2 medium-risk runs to hit target safely.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-8 rounded-2xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm">
          <h2 className="mb-4 text-2xl font-semibold text-white">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="mb-2 text-lg font-semibold text-orange-400">
                What is the first profit quota in Lethal Company?
              </h3>
              <p className="leading-relaxed text-slate-300">
                The first quota is fixed at <strong>$130</strong>. Use it as the baseline week 
                to plan your first sell and get familiar with the quota system.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold text-orange-400">
                Does selling early change how much money I need to meet quota?
              </h3>
              <p className="leading-relaxed text-slate-300">
                No, you still must hit the quota total. Selling early affects your available balance 
                and can change your ability to buy gear before the deadline, but the quota amount stays the same.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold text-orange-400">
                How much buffer should I keep to avoid failing quota?
              </h3>
              <p className="leading-relaxed text-slate-300">
                Keep a safety buffer of <strong>$50-100</strong> above the exact quota. 
                This accounts for risky runs, lost items, or unexpected purchases. 
                Better to have extra than to fail by a small amount.
              </p>
            </div>

            <div>
              <h3 className="mb-2 text-lg font-semibold text-orange-400">
                Is there an official quota formula?
              </h3>
              <p className="leading-relaxed text-slate-300">
                The game&apos;s quota progression follows a ramping pattern (often described as quadratic-like). 
                This calculator approximates the pattern so you can plan without doing manual math. 
                The exact formula may vary slightly between game versions.
              </p>
            </div>
          </div>
        </section>

        {/* Related Guides */}
        <section className="rounded-2xl border border-slate-700 bg-slate-800/50 p-6 backdrop-blur-sm">
          <h2 className="mb-4 text-2xl font-semibold text-white">
            Related Guides
          </h2>
          
          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/tools/lethal-company/terminal-commands"
              className="group rounded-lg border border-slate-700 bg-slate-900/50 p-4 transition hover:border-orange-500/50 hover:bg-slate-900"
            >
              <h3 className="font-semibold text-orange-400 group-hover:text-orange-300">
                Terminal Commands
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                Commands that help planning (scan, routing, store)
              </p>
            </Link>

            <Link
              href="/guides/lethal-company/moons"
              className="group rounded-lg border border-slate-700 bg-slate-900/50 p-4 transition hover:border-orange-500/50 hover:bg-slate-900"
            >
              <h3 className="font-semibold text-orange-400 group-hover:text-orange-300">
                Best Moons for Profit
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                Tier list and profit run strategies
              </p>
            </Link>

            <Link
              href="/guides/lethal-company/bestiary"
              className="group rounded-lg border border-slate-700 bg-slate-900/50 p-4 transition hover:border-orange-500/50 hover:bg-slate-900"
            >
              <h3 className="font-semibold text-orange-400 group-hover:text-orange-300">
                Bestiary
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                Threats that slow profit and how to counter them
              </p>
            </Link>

            <Link
              href="/tools/lethal-company"
              className="group rounded-lg border border-slate-700 bg-slate-900/50 p-4 transition hover:border-orange-500/50 hover:bg-slate-900"
            >
              <h3 className="font-semibold text-orange-400 group-hover:text-orange-300">
                All Lethal Company Tools
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                Calculators, guides, and resources
              </p>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
