import Link from "next/link";

import { buildMetadata } from "../../../../_seo/metadata";
import { SITE } from "../../../../_seo/site";
import FaqJsonLd from "../../../../components/FaqJsonLd";

export const metadata = buildMetadata({
  title: `Lethal Company Terminal Command Shortcuts and Tips | ${SITE.name}`,
  description:
    "Practical Lethal Company terminal command shortcuts and tips: faster input, advanced team workflows, common mistakes, and efficiency boosts.",
  path: "/tools/lethal-company/terminal-commands/shortcuts-tips",
});

const SHORTCUT_INPUT_TIPS = [
  {
    title: "Use HELP before speed typing",
    detail:
      "Treat HELP as your parser check. Confirm available commands first, then use shortened typing safely.",
  },
  {
    title: "Prefer exact moon and item names",
    detail:
      "For ROUTE and BUY commands, full names are safer than aggressive abbreviation. One typo costs more than one extra second.",
  },
  {
    title: "Leverage case-insensitive input",
    detail:
      "Most lobbies accept upper/lowercase equally, so focus on spelling and spacing rather than capitalization.",
  },
  {
    title: "Use predictable shorthand only",
    detail:
      "If your lobby accepts partial matches, keep one team-standard shorthand set and avoid inventing variants mid-run.",
  },
  {
    title: "Keep reusable command templates",
    detail:
      "Prepare common lines like ROUTE <moon> and BUY <item> [qty] in notes so ship-side player can paste mentally fast.",
  },
];

const ADVANCED_TIPS = [
  {
    title: "Chain navigation in two-step rhythm",
    detail:
      "Run MOONS -> ROUTE <moon> -> CONFIRM as a fixed sequence so you never forget the confirm prompt.",
  },
  {
    title: "Time scan loops with team extraction windows",
    detail:
      "Use SCAN and monitor switching at regular intervals (for example every 30-45 seconds) during high-risk interiors.",
  },
  {
    title: "Assign one dedicated terminal operator",
    detail:
      "Mixed ownership creates duplicate commands and delayed confirms. One operator, one voice protocol, one accountability lane.",
  },
  {
    title: "Pair door control with clear callouts",
    detail:
      "Never press OPEN/CLOSE on assumption. Require a short confirmation phrase before action.",
  },
  {
    title: "Align buy timing with quota buffer",
    detail:
      "Avoid store spending during panic phases. Use quota target first, then buy only what improves expected run consistency.",
  },
];

const COMMON_MISTAKES = [
  {
    mistake: "Typing fast without terminal context",
    impact: "Commands fail even when text is correct.",
    fix: "Always check current state with HELP before sequence input.",
  },
  {
    mistake: "Skipping CONFIRM prompts",
    impact: "Route or purchase appears to fail randomly.",
    fix: "Treat CONFIRM as mandatory step in route and store flows.",
  },
  {
    mistake: "Abbreviating moon names inconsistently",
    impact: "Wrong route or failed route selection.",
    fix: "Use full moon names from MOONS list for navigation commands.",
  },
  {
    mistake: "Door control without team timing",
    impact: "Crew gets trapped or loses tempo.",
    fix: "Use a single-callout protocol: request -> acknowledge -> execute.",
  },
  {
    mistake: "Buying gear before checking quota pressure",
    impact: "Credit starvation near deadline.",
    fix: "Run quota math first, then purchase only high-ROI utility.",
  },
];

const EFFICIENCY_CHECKLIST = [
  "Open this page and the full command list on a second monitor or phone.",
  "Decide one terminal operator before each moon.",
  "Use a fixed voice vocabulary for route, doors, and teleporter actions.",
  "Review one command failure after each run and add it to your team playbook.",
  "Sync store purchases with your quota calculator buffer plan.",
];

const FAQS = [
  {
    question: "Do partial command matches always work in vanilla?",
    answer:
      "No. Some lobbies accept partial matching while others require full command text. For critical actions, always use full syntax.",
  },
  {
    question: "Are shortcuts worth using for beginner teams?",
    answer:
      "Use shortcuts only after your team can run standard command flow cleanly. Speed without consistency usually increases mistakes.",
  },
  {
    question: "What is the best way to reduce command entry errors?",
    answer:
      "Keep one dedicated terminal operator, follow fixed command sequences, and require short verbal confirms before high-impact actions.",
  },
  {
    question: "How should we practice terminal speed safely?",
    answer:
      "Drill a small set first: MOONS, ROUTE, CONFIRM, STORE, BUY, SCAN. Expand only after this core loop is reliable.",
  },
  {
    question: "Can these tips help modded lobbies too?",
    answer:
      "Yes. Team protocol, timing discipline, and parser-safe input habits still provide value even when command sets change.",
  },
];

export default function TerminalShortcutsTipsPage() {
  const howToStructuredData = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How to use terminal command shortcuts safely in Lethal Company",
    description:
      "Workflow for faster terminal inputs without increasing command mistakes.",
    step: [
      { "@type": "HowToStep", name: "Check command context", text: "Run HELP first." },
      {
        "@type": "HowToStep",
        name: "Run fixed command sequences",
        text: "Use MOONS -> ROUTE -> CONFIRM and STORE -> BUY patterns.",
      },
      {
        "@type": "HowToStep",
        name: "Coordinate team timing",
        text: "Assign one operator and use short callouts before high-impact actions.",
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      <FaqJsonLd faqs={FAQS.map((faq) => ({ question: faq.question, answer: faq.answer }))} />
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <Link
            href="/tools/lethal-company/terminal-commands/"
            className="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
          >
            ← Back to Terminal Commands List
          </Link>
        </div>

        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Lethal Company Terminal Command Shortcuts and Tips
          </h1>
          <p className="mt-3 max-w-4xl text-zinc-400 leading-relaxed">
            Shortcut habits can save real time, but only when they are parser-safe and team-safe.
            This guide covers quick input techniques, high-level ship workflows, common pitfalls,
            and practical efficiency upgrades.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/tools/lethal-company/terminal-commands/"
              className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
            >
              Terminal commands list
            </Link>
            <Link
              href="/tools/lethal-company/terminal-commands/secret/"
              className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
            >
              Secret command notes
            </Link>
            <Link
              href="/tools/lethal-company/terminal/shortcuts-abbreviations/"
              className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
            >
              Terminal guide
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
            <Link
              href="/tools/lethal-company/quota-calculator/"
              className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
            >
              Quota calculator
            </Link>
            <Link
              href="/tools/quota-calculator/early-sell"
              className="inline-flex items-center rounded-full border border-emerald-600/40 bg-emerald-500/10 px-4 py-2 text-sm text-emerald-100 hover:border-emerald-500/60"
            >
              Early sell planner
            </Link>
          </div>
        </header>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-2xl font-semibold tracking-tight">Shortcut Input Techniques</h2>
          <div className="mt-4 space-y-3">
            {SHORTCUT_INPUT_TIPS.map((tip) => (
              <article
                key={tip.title}
                className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4"
              >
                <h3 className="text-sm font-semibold text-zinc-100">{tip.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{tip.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-2xl font-semibold tracking-tight">Advanced Tips for Real Runs</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {ADVANCED_TIPS.map((tip) => (
              <article
                key={tip.title}
                className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4"
              >
                <h3 className="text-sm font-semibold text-zinc-100">{tip.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{tip.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-2xl font-semibold tracking-tight">Common Misconceptions</h2>
          <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-800">
            <table className="min-w-full divide-y divide-zinc-800 text-sm">
              <thead className="bg-zinc-950/60 text-zinc-300">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Mistake</th>
                  <th className="px-4 py-3 text-left font-semibold">Impact</th>
                  <th className="px-4 py-3 text-left font-semibold">Fix</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 bg-[#0a0a0a]">
                {COMMON_MISTAKES.map((item) => (
                  <tr key={item.mistake}>
                    <td className="px-4 py-3 text-zinc-200">{item.mistake}</td>
                    <td className="px-4 py-3 text-zinc-400">{item.impact}</td>
                    <td className="px-4 py-3 text-zinc-300">{item.fix}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-2xl font-semibold tracking-tight">Efficiency Boost Checklist</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-zinc-300">
            {EFFICIENCY_CHECKLIST.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-zinc-400">
            Combine these habits with moon selection discipline from the{" "}
            <Link
              href="/tools/lethal-company/moons/"
              className="text-zinc-100 underline decoration-zinc-600 hover:decoration-zinc-200"
            >
              moons guide
            </Link>
            {" "}and risk awareness from the{" "}
            <Link
              href="/tools/lethal-company/bestiary/"
              className="text-zinc-100 underline decoration-zinc-600 hover:decoration-zinc-200"
            >
              bestiary
            </Link>
            .
          </p>
        </section>

        <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-2xl font-semibold tracking-tight">FAQ</h2>
          <div className="mt-4 space-y-4">
            {FAQS.map((faq) => (
              <article
                key={faq.question}
                className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4"
              >
                <h3 className="text-sm font-semibold text-zinc-100">{faq.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(howToStructuredData) }}
        />
      </main>
    </div>
  );
}
