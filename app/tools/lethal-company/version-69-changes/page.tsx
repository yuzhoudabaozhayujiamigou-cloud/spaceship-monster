import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Lethal Company Version 69 Changes (The Jolly Patch) – What Changed & What To Do Next",
  description:
    "A fast, practical summary of Lethal Company v69 (The Jolly Patch): what changed, what it impacts, and what to do next—plus links to our Quota Calculator, Terminal Commands, and Moons Tier List.",
  alternates: {
    canonical: "/tools/lethal-company/version-69-changes",
  },
  openGraph: {
    title: "Lethal Company Version 69 Changes – The Jolly Patch",
    description:
      "What changed in v69, how it affects quota planning, terminal usage, and moon selection—plus quick links to tools.",
    url: "/tools/lethal-company/version-69-changes",
    type: "article",
  },
};

type FaqItem = {
  question: string;
  answer: string;
  intent: "info" | "tool";
};

const FAQ: FaqItem[] = [
  {
    question: "When was Lethal Company Version 69 released?",
    intent: "info",
    answer:
      "Check the official patch notes / announcement for the exact date. For most players, what matters is what changed and whether your usual quota routes still work.",
  },
  {
    question: "Does Version 69 change quota scaling or quota math?",
    intent: "tool",
    answer:
      "Even if the formula is unchanged, your ‘effective quota difficulty’ can shift if loot, moon risk, or run consistency changes. Re-plan with the Quota Calculator and use a buffer strategy.",
  },
  {
    question: "Did Version 69 add or change terminal commands?",
    intent: "info",
    answer:
      "If any commands or behaviors changed, update your crew’s ship-operator workflow. Keep a quick reference open so the team doesn’t lose time during runs.",
  },
  {
    question: "Which moons got harder or easier after v69?",
    intent: "info",
    answer:
      "Treat moon choice as a reliability decision: safe quota runs vs high-variance ‘spike’ runs. Use a tier list as a starting point, then adjust based on your team’s consistency.",
  },
  {
    question: "Do I need to start a new save after Version 69?",
    intent: "info",
    answer:
      "Usually no. Most updates are compatible, but mods can be the real source of breakage. If something feels off, test one run vanilla, then add mods back gradually.",
  },
  {
    question: "What should I do immediately after updating to v69?",
    intent: "tool",
    answer:
      "Do a single low-risk run to validate your loop, then re-check your quota plan and moon selection. Small process tweaks often beat ‘big brain’ strategy changes.",
  },
];

function FaqJsonLd({ items }: { items: FaqItem[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((it) => ({
      "@type": "Question",
      name: it.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: it.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is required for SEO
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

export default function Page() {
  return (
    <main className="mx-auto w-full max-w-4xl px-4 py-10">
      <FaqJsonLd items={FAQ} />

      <header className="space-y-4">
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm text-amber-900">
          <span className="font-medium">Patch Guide</span>
          <span className="opacity-70">v69 • The Jolly Patch</span>
        </div>

        <h1 className="text-balance text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          Lethal Company Version 69 Changes (The Jolly Patch)
        </h1>

        <p className="text-pretty text-base leading-7 text-slate-700">
          A fast, practical summary of what typically matters after a major patch: what changed, what
          it impacts, and what to do next. If you just want to hit quota reliably, jump to the
          strategy impact section and use the tools.
        </p>

        <nav className="flex flex-wrap gap-2 pt-2 text-sm">
          <a className="rounded-md border px-3 py-1 hover:bg-slate-50" href="#whats-new">
            What’s New
          </a>
          <a className="rounded-md border px-3 py-1 hover:bg-slate-50" href="#strategy-impact">
            Strategy Impact
          </a>
          <a className="rounded-md border px-3 py-1 hover:bg-slate-50" href="#faq">
            FAQ
          </a>
          <a className="rounded-md border px-3 py-1 hover:bg-slate-50" href="#related">
            Related Tools
          </a>
        </nav>
      </header>

      <section id="whats-new" className="mt-10 space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">What’s new in Version 69</h2>
        <p className="text-slate-700">
          Use this section as a checklist. Replace the bullet points below with the confirmed items
          from the official patch notes (or your internal research doc). MVP goal: 3–5 high-signal
          bullets, not a full changelog mirror.
        </p>

        <div className="rounded-xl border bg-white p-5">
          <h3 className="font-medium text-slate-900">New features</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
            <li>Key feature #1 (summary in one sentence)</li>
            <li>Key feature #2 (summary in one sentence)</li>
          </ul>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <h3 className="font-medium text-slate-900">Gameplay changes</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
            <li>Change that affects run consistency (risk/reward, routes, timings)</li>
            <li>Change that affects loot or economy (if applicable)</li>
          </ul>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <h3 className="font-medium text-slate-900">Bug fixes</h3>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700">
            <li>Fix #1 that players will notice immediately</li>
            <li>Fix #2 that reduces frustration / improves stability</li>
          </ul>
        </div>
      </section>

      <section id="strategy-impact" className="mt-10 space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">How v69 affects your strategy</h2>
        <p className="text-slate-700">
          Even when “quota math” doesn’t change, your quota plan can break if moon reliability,
          loot consistency, or execution timing changes. Use these links as your post-patch routine.
        </p>

        <div className="grid gap-4 md:grid-cols-3">
          <Link
            href="/tools/lethal-company/quota-calculator"
            className="rounded-xl border bg-white p-5 hover:bg-slate-50"
          >
            <div className="text-sm font-medium text-slate-900">Quota Calculator</div>
            <div className="mt-1 text-sm text-slate-700">
              Re-plan your buffer and sell timing after the patch.
            </div>
            <div className="mt-3 text-sm font-medium text-blue-700">Open →</div>
          </Link>

          <Link
            href="/tools/lethal-company/terminal-commands"
            className="rounded-xl border bg-white p-5 hover:bg-slate-50"
          >
            <div className="text-sm font-medium text-slate-900">Terminal Commands</div>
            <div className="mt-1 text-sm text-slate-700">
              Keep your crew’s ship-operator flow fast and error-free.
            </div>
            <div className="mt-3 text-sm font-medium text-blue-700">Open →</div>
          </Link>

          <Link
            href="/tools/lethal-company/moons-tier-list"
            className="rounded-xl border bg-white p-5 hover:bg-slate-50"
          >
            <div className="text-sm font-medium text-slate-900">Moons Tier List</div>
            <div className="mt-1 text-sm text-slate-700">
              Choose moons by quota reliability (not vibes).
            </div>
            <div className="mt-3 text-sm font-medium text-blue-700">Open →</div>
          </Link>
        </div>

        <div className="rounded-xl border bg-slate-50 p-5 text-slate-800">
          <h3 className="font-medium">Post-patch routine (recommended)</h3>
          <ol className="mt-2 list-decimal space-y-1 pl-5 text-slate-700">
            <li>Do one low-risk run to validate your loop (crew comms, terminal workflow).</li>
            <li>Update moon choice based on reliability, not “best case” loot.</li>
            <li>Re-calc quota with a buffer (don’t cut it to the cent after a patch).</li>
          </ol>
        </div>
      </section>

      <section id="faq" className="mt-10 space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">FAQ</h2>
        <div className="space-y-3">
          {FAQ.map((item) => (
            <details key={item.question} className="rounded-xl border bg-white p-5">
              <summary className="cursor-pointer list-none font-medium text-slate-900">
                {item.question}
                <span className="ml-2 rounded bg-slate-100 px-2 py-0.5 text-xs font-normal text-slate-600">
                  {item.intent}
                </span>
              </summary>
              <p className="mt-3 text-slate-700">{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="related" className="mt-10 space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">Related tools & guides</h2>
        <ul className="list-disc space-y-2 pl-5 text-slate-700">
          <li>
            <Link className="text-blue-700 hover:underline" href="/tools/lethal-company/quota-calculator">
              Quota Calculator
            </Link>
            <span className="text-slate-500"> — turn patch info into a plan.</span>
          </li>
          <li>
            <Link className="text-blue-700 hover:underline" href="/tools/lethal-company/terminal-commands">
              Terminal Commands
            </Link>
            <span className="text-slate-500"> — reduce execution mistakes.</span>
          </li>
          <li>
            <Link className="text-blue-700 hover:underline" href="/tools/lethal-company/moons-tier-list">
              Moons Tier List
            </Link>
            <span className="text-slate-500"> — choose moons by consistency.</span>
          </li>
        </ul>

        <p className="text-sm text-slate-500">
          Note: This page is an MVP template. Replace the placeholder bullets with confirmed v69
          notes, then ship. Don’t overthink it.
        </p>
      </section>
    </main>
  );
}
