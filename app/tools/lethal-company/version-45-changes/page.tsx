import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Lethal Company Version 45 Changes – Quota Impact Summary (Unverified Tracker)",
  description:
    "A structure-first tracker for Lethal Company v45: reported vs confirmed changes, what it likely impacts for quota routing, and links to tools (Quota Calculator, Terminal Commands).",
  alternates: {
    canonical: "/tools/lethal-company/version-45-changes",
  },
  openGraph: {
    title: "Lethal Company Version 45 Changes – Quota Impact Summary",
    description:
      "Reported vs confirmed changes, what they impact for quota planning, and what to adjust next—plus tool links.",
    url: "/tools/lethal-company/version-45-changes",
    type: "article",
  },
};

type FaqItem = {
  question: string;
  answer: string;
};

const FAQ: FaqItem[] = [
  {
    question: "Where can I find the official Version 45 patch notes?",
    answer:
      "Use the developer’s official announcement/patch notes as the source of truth. This page separates confirmed notes from community-reported items so you don’t plan routes on rumors.",
  },
  {
    question: "Why is this page labeled as unverified?",
    answer:
      "Because patch details change fast and community summaries often mix speculation with facts. We keep a clean structure here so confirmed items can be slotted in with sources as they appear.",
  },
  {
    question: "How should I adjust quota planning after a patch?",
    answer:
      "Treat patches as reliability shocks: even if quota math is unchanged, your run consistency can shift. Re-plan with a buffer and validate one low-risk run before committing to high-variance routes.",
  },
  {
    question: "What tools help most after an update?",
    answer:
      "Use the Quota Calculator to re-check pacing and the Terminal Commands page to keep ship-operator workflows tight. Small process upgrades beat overthinking when patch notes are incomplete.",
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
        <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm text-slate-900">
          <span className="font-medium">Patch Guide</span>
          <span className="opacity-70">v45 • Tracker</span>
        </div>

        <h1 className="text-balance text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">
          Lethal Company Version 45 Changes (Quota Impact Summary)
        </h1>

        <p className="text-pretty text-base leading-7 text-slate-700">
          This is a structure-first page: we list <strong>reported</strong> vs <strong>confirmed</strong> items, then focus
          on what you can do immediately for quota reliability. No guesses, no invented patch notes.
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

        <p className="text-xs text-slate-500">Last updated: 2026-03-17</p>
      </header>

      <section id="whats-new" className="mt-10 space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Quick list — what changed in Version 45</h2>

        <div className="rounded-xl border bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">Reported / unverified</h3>
          <ul className="mt-3 list-disc space-y-2 pl-6 text-slate-700">
            <li>Community reports may mention behavior changes, new risks, or balance tweaks (unverified).</li>
            <li>If you have a reliable source link, add it here and promote items to “Confirmed.”</li>
            <li>Until then, treat this section as a watchlist—not instructions.</li>
          </ul>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <h3 className="text-lg font-semibold text-slate-900">Confirmed</h3>
          <p className="mt-2 text-sm text-slate-600">
            No confirmed items added yet. When official patch notes are available, we’ll list them here with sources.
          </p>
        </div>
      </section>

      <section id="strategy-impact" className="mt-10 space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Quota impact — what to adjust after the update</h2>
        <ul className="list-disc space-y-2 pl-6 text-slate-700">
          <li>Run one low-risk “calibration” mission first to test consistency before you gamble on high-variance quota spikes.</li>
          <li>Assume your effective difficulty changed: plan a buffer quota margin until you confirm routes still work.</li>
          <li>
            Re-check pacing with the <Link className="underline" href="/tools/lethal-company/quota-calculator">Quota Calculator</Link> (don’t rely on memory if loot risk changed).
          </li>
          <li>
            Standardize ship-operator habits: keep <Link className="underline" href="/tools/lethal-company/terminal-commands">Terminal Commands</Link> open and reduce decision lag during runs.
          </li>
          <li>Track what failed: if a patch affects a single failure mode, fix that first before changing everything else.</li>
          <li>Update team roles: assign one person to stability (comm + terminal), one to carry loot, one to risk scout.</li>
        </ul>
      </section>

      <section id="faq" className="mt-10 space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">FAQ</h2>
        <div className="grid gap-4">
          {FAQ.map((f) => (
            <details key={f.question} className="rounded-xl border bg-white p-4">
              <summary className="cursor-pointer font-semibold text-slate-900">{f.question}</summary>
              <p className="mt-2 text-sm leading-6 text-slate-700">{f.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section id="related" className="mt-10 space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Related tools</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Link className="rounded-xl border bg-white p-4 text-slate-900 hover:bg-slate-50" href="/tools/lethal-company/quota-calculator">
            <p className="font-semibold">Quota Calculator</p>
            <p className="mt-1 text-sm text-slate-700">Re-check pacing and buffer strategy after a patch.</p>
          </Link>

          <Link className="rounded-xl border bg-white p-4 text-slate-900 hover:bg-slate-50" href="/tools/lethal-company/terminal-commands">
            <p className="font-semibold">Terminal Commands</p>
            <p className="mt-1 text-sm text-slate-700">Keep crew workflows consistent and reduce mistakes.</p>
          </Link>
        </div>
      </section>
    </main>
  );
}
