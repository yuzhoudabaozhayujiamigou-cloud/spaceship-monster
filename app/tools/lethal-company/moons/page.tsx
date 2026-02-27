import Link from "next/link";

import { buildMetadata } from "../../../_seo/metadata";
import { SITE } from "../../../_seo/site";

export const metadata = buildMetadata({
  title: `Lethal Company Moons Guide | ${SITE.name}`,
  description:
    "A practical, version-agnostic framework for picking moons: tiers, risk factors, quick picks, and FAQs.",
  path: "/tools/lethal-company/moons",
});

type Faq = {
  question: string;
  answer: string;
};

const faqs: Faq[] = [
  {
    question: "Are these moon tiers official?",
    answer:
      "No. Treat tiers as a decision aid, not a fixed truth. Moon difficulty/value can shift with updates, mods, and your team’s comfort with specific layouts and enemies.",
  },
  {
    question: "Why no exact scrap ranges / weather odds here?",
    answer:
      "Because those numbers vary across versions, mods, and community spreadsheets. This page focuses on a stable selection framework you can apply even when specifics change.",
  },
  {
    question: "What’s the safest way to pick a moon for quota?",
    answer:
      "Pick a lower-variance moon your team can clear consistently, keep a strict time budget, and sell with a buffer. Consistency beats occasional huge hauls when you’re learning.",
  },
  {
    question: "When should we take a higher-risk moon?",
    answer:
      "When you’re ahead of quota, have extra runs/day, or your team is coordinated enough to recover from a bad weather roll or a rough interior without wiping.",
  },
  {
    question: "Do terminal commands change moon selection?",
    answer:
      "Indirectly. Faster ship-side scans, routing, and comms reduce time loss and lower effective risk—especially on moons where mistakes are expensive.",
  },
  {
    question: "How do we adapt tiers for 2-player vs 4-player?",
    answer:
      "Smaller teams should bias toward lower variance and shorter routes because each death is a larger percentage of your capacity. Larger teams can split roles and absorb setbacks.",
  },
];

export default function LethalCompanyMoonsPage() {
  const webpageStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Lethal Company Moons Guide",
    description:
      "A version-agnostic framework for choosing moons: tiers, risk factors, quick picks, and FAQs.",
    url: `${SITE.url}/tools/lethal-company/moons`,
  };

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

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <Link
            href="/tools/lethal-company/"
            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            ← Back to Lethal Company Tools
          </Link>
        </div>

        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Lethal Company Moons Guide (Tiers, Risk, Quick Picks)
          </h1>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            Different game versions and mods can change moon balance. This page is
            intentionally version-agnostic: a selection framework + a small list
            of common moon names you’ll hear about (placeholders), without
            hard-coded scrap ranges or weather odds.
          </p>
        </header>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5">
          <h2 className="text-lg font-semibold">TL;DR</h2>
          <ul className="mt-3 space-y-2 text-sm text-zinc-300 list-disc pl-5">
            <li>
              Pick moons by variance first: stable clears beat “maybe huge” runs
              when you’re learning.
            </li>
            <li>
              Tier is about decision cost: higher tiers punish time loss, bad
              weather, and messy comms.
            </li>
            <li>
              Match the moon to your run plan: time budget, team size, and your
              ship-side support.
            </li>
            <li>
              If you’re behind quota, take calculated risk; if you’re ahead,
              farm consistency and sell with buffer.
            </li>
          </ul>
        </section>

        <section className="mt-8">
          <h2 className="text-2xl font-semibold tracking-tight">Moon tiers</h2>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            Use tiers as a practical grouping. “Tier 1/2/3” here describes the
            decision profile (how often a run gets derailed), not official stats.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5">
              <h3 className="text-lg font-semibold">Tier 1: Consistency picks</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Choose these when you need a dependable haul, you’re training new
                players, or you’re doing multiple runs/day.
              </p>
              <ul className="mt-3 space-y-2 text-sm text-zinc-300 list-disc pl-5">
                <li>Prioritize short, repeatable routes and low comms overhead.</li>
                <li>Leave early if the run gets messy; protect your time budget.</li>
                <li>Use your quota buffer plan instead of chasing a jackpot.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5">
              <h3 className="text-lg font-semibold">Tier 2: Balanced value</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Choose these when your team is stable, you can handle a few bad
                pulls, and you want better upside without full chaos.
              </p>
              <ul className="mt-3 space-y-2 text-sm text-zinc-300 list-disc pl-5">
                <li>Pick a clear “abort line” (time, deaths, or lost gear).</li>
                <li>Ship-side support matters more: pings, comms, and tracking.</li>
                <li>Expect some variance; don’t let one bad run tilt the day.</li>
              </ul>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5">
              <h3 className="text-lg font-semibold">Tier 3: High-risk, high-drama</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Choose these when you’re ahead of quota or intentionally gambling
                for a fast catch-up. Treat them like a plan, not a vibe.
              </p>
              <ul className="mt-3 space-y-2 text-sm text-zinc-300 list-disc pl-5">
                <li>Run a tighter role split (scout / hauler / ship / rescue).</li>
                <li>Go earlier in the day; late starts amplify risk dramatically.</li>
                <li>Cut losses fast if weather + interior stack against you.</li>
              </ul>
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-950/30 p-5">
            <h3 className="text-lg font-semibold">Common moons you’ll hear about</h3>
            <p className="mt-2 text-sm text-zinc-400">
              Names below are intentionally limited and should be treated as
              familiar examples, not a complete list.
            </p>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-zinc-800 bg-[#0a0a0a] p-4">
                <div className="font-mono text-zinc-200">Experimentation</div>
                <div className="mt-1 text-zinc-400">Often cited as a baseline pick.</div>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-[#0a0a0a] p-4">
                <div className="font-mono text-zinc-200">Assurance</div>
                <div className="mt-1 text-zinc-400">Common early-game reference.</div>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-[#0a0a0a] p-4">
                <div className="font-mono text-zinc-200">Vow</div>
                <div className="mt-1 text-zinc-400">Often discussed as a step up.</div>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-[#0a0a0a] p-4">
                <div className="font-mono text-zinc-200">March</div>
                <div className="mt-1 text-zinc-400">Sometimes picked for upside.</div>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-[#0a0a0a] p-4">
                <div className="font-mono text-zinc-200">Rend</div>
                <div className="mt-1 text-zinc-400">Often treated as a riskier choice.</div>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-[#0a0a0a] p-4">
                <div className="font-mono text-zinc-200">Dine</div>
                <div className="mt-1 text-zinc-400">Frequently grouped with harder moons.</div>
              </div>
              <div className="rounded-xl border border-zinc-800 bg-[#0a0a0a] p-4">
                <div className="font-mono text-zinc-200">Titan</div>
                <div className="mt-1 text-zinc-400">High-risk reputation in many guides.</div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold tracking-tight">Risk factors</h2>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            Before you click “confirm,” sanity-check risk from four angles. The
            point is to reduce surprises and choose the kind of run you can
            actually execute.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5">
              <h3 className="text-lg font-semibold">Weather</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Weather can turn a “fine” moon into a time sink. If your team is
                already struggling with navigation or hauling, treat bad weather
                as a tier increase.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5">
              <h3 className="text-lg font-semibold">Variance</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Variance is how often the run outcome swings hard. High-variance
                moons punish small mistakes and make planning difficult.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5">
              <h3 className="text-lg font-semibold">Team skill & roles</h3>
              <p className="mt-2 text-sm text-zinc-400">
                A coordinated team effectively “lowers” a moon tier. Clear roles
                (ship support, scout, hauler, runner) prevent cascading failures.
              </p>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5">
              <h3 className="text-lg font-semibold">Time (day plan)</h3>
              <p className="mt-2 text-sm text-zinc-400">
                Risk spikes when you start late or overstay. Decide a leave time
                up front; late-day extra trips often cost more than they earn.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold tracking-tight">Quick picks</h2>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            Use these as selection defaults. Replace “example moons” with your
            own list once you know what your group clears consistently.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4">
            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5">
              <h3 className="text-lg font-semibold">Goal: Safe</h3>
              <ul className="mt-3 space-y-2 text-sm text-zinc-300 list-disc pl-5">
                <li>Pick a Tier 1 moon you’ve cleared cleanly at least twice.</li>
                <li>Leave earlier; bank value and protect gear.</li>
                <li>
                  Use the quota buffer approach in the{" "}
                  <Link
                    href="/tools/lethal-company/quota-calculator/"
                    className="text-zinc-100 underline decoration-zinc-600 hover:decoration-zinc-200"
                  >
                    quota calculator
                  </Link>
                  {" "}instead of chasing perfect loot density.
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5">
              <h3 className="text-lg font-semibold">Goal: Balanced</h3>
              <ul className="mt-3 space-y-2 text-sm text-zinc-300 list-disc pl-5">
                <li>Pick a Tier 2 moon you can navigate without getting lost.</li>
                <li>Set a clear leave time and one “abort line” for the day.</li>
                <li>
                  Keep comms clean with a shared shorthand (see{" "}
                  <Link
                    href="/tools/lethal-company/terminal-commands/"
                    className="text-zinc-100 underline decoration-zinc-600 hover:decoration-zinc-200"
                  >
                    terminal commands
                  </Link>
                  {" "}notes).
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5">
              <h3 className="text-lg font-semibold">Goal: High-risk</h3>
              <ul className="mt-3 space-y-2 text-sm text-zinc-300 list-disc pl-5">
                <li>Pick Tier 3 only when you can afford a wipe or two.</li>
                <li>Start early and run strict roles; don’t drift into chaos.</li>
                <li>Plan for extraction, not just entry: time loss is the killer.</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold tracking-tight">FAQ</h2>
          <div className="mt-5 space-y-4">
            {faqs.map((faq) => (
              <details
                key={faq.question}
                className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5"
              >
                <summary className="cursor-pointer text-lg font-semibold">
                  {faq.question}
                </summary>
                <p className="mt-3 text-sm text-zinc-400 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webpageStructuredData),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(faqStructuredData),
          }}
        />
      </main>
    </div>
  );
}
