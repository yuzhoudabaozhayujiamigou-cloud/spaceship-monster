import Link from "next/link";

import { buildMetadata } from "../../../_seo/metadata";
import { SITE } from "../../../_seo/site";
import FaqJsonLd from "../../../components/FaqJsonLd";

export const metadata = buildMetadata({
  title: `terminal commands lethal company: Complete List | ${SITE.name}`,
  description:
    "terminal commands lethal company quick guide with buy, route, info, scan, moons, bestiary, and store plus troubleshooting and FAQ.",
  path: "/tools/lethal-company/terminal-commands",
});

const ESSENTIAL_COMMANDS = [
  {
    command: "BUY",
    usage: "Purchase tools quickly from the store.",
    tip: "Use exact item spelling from STORE before confirming.",
  },
  {
    command: "ROUTE",
    usage: "Set the next moon destination.",
    tip: "Run MOONS first, then copy the exact moon name.",
  },
  {
    command: "INFO",
    usage: "Check context-specific status info in supported builds.",
    tip: "If INFO does nothing, use HELP to see available commands in your lobby.",
  },
  {
    command: "SCAN",
    usage: "Pull quick scan data for team calls.",
    tip: "Use it on a fixed cadence so calls stay consistent.",
  },
  {
    command: "MOONS",
    usage: "List available moons and routing options.",
    tip: "Re-check after patches or modpack changes.",
  },
  {
    command: "BESTIARY",
    usage: "Open enemy reference in supported contexts.",
    tip: "Use for quick threat reminders before risky runs.",
  },
  {
    command: "STORE",
    usage: "Open the company store catalog.",
    tip: "Pair with BUY and a budget plan from quota calculator.",
  },
];

const TROUBLESHOOTING = [
  {
    issue: "Command returns unknown",
    fix: "Use HELP in your current terminal state and only use listed commands.",
  },
  {
    issue: "Cannot route to a moon",
    fix: "Run MOONS first, then copy exact moon spelling and spacing before ROUTE.",
  },
  {
    issue: "BUY command not working",
    fix: "Open STORE first and enter exact item name; some lobbies need a confirm step.",
  },
  {
    issue: "INFO/BESTIARY missing",
    fix: "These can be contextual by version or lobby setup; rely on HELP as source of truth.",
  },
];

const FAQS = [
  {
    question: "What are the most useful terminal commands in Lethal Company?",
    answer:
      "For most crews, the highest-impact set is MOONS, ROUTE, STORE, BUY, and SCAN. Add BESTIARY and INFO when your lobby supports them.",
  },
  {
    question: "How do I buy items faster using terminal commands?",
    answer:
      "Use STORE first, then type BUY with exact item text and quantity if supported. Keep one player as dedicated terminal operator to reduce mistypes.",
  },
  {
    question: "Why can't I route to a moon (command not working)?",
    answer:
      "Usually the moon name does not exactly match your MOONS list, or the terminal is in the wrong context. Re-open the list and copy the moon name exactly.",
  },
];

const RELATED_TOOLS = [
  { label: "Quota Calculator", href: "/tools/lethal-company/quota-calculator/" },
  { label: "Moons Guide", href: "/tools/lethal-company/moons/" },
  { label: "Bestiary", href: "/tools/lethal-company/bestiary/" },
  { label: "Items Reference", href: "/tools/lethal-company/items/" },
  { label: "Shortcuts and Tips", href: "/tools/lethal-company/terminal-commands/shortcuts-tips/" },
];

export default function TerminalCommandsMvpPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      <FaqJsonLd
        faqs={FAQS.map((faq) => ({ question: faq.question, answer: faq.answer }))}
      />

      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <Link
            href="/tools/lethal-company/"
            className="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
          >
            &lt;- Back to Lethal Company Tools
          </Link>
        </div>

        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Lethal Company Terminal Commands (Complete List)
          </h1>
          <p className="mt-3 max-w-3xl text-zinc-400 leading-relaxed">
            A fast MVP reference for terminal commands lethal company players use most. This page
            focuses on practical command flow and common fixes during live runs.
          </p>
        </header>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-2xl font-semibold tracking-tight">
            What Terminal Commands Do (Quick Overview)
          </h2>
          <p className="mt-3 text-zinc-300 leading-relaxed">
            Terminal commands handle routing, store purchases, and quick status checks. In practice,
            command speed is less about typing fast and more about using the correct command order.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-zinc-400">
            <li>Use discovery commands first (like MOONS and STORE).</li>
            <li>Use action commands second (like ROUTE and BUY).</li>
            <li>Validate context with HELP when something fails.</li>
          </ul>
        </section>

        <section className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-2xl font-semibold tracking-tight">
            Essential Commands (buy / route / info / scan / moons / bestiary / store)
          </h2>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            {ESSENTIAL_COMMANDS.map((item) => (
              <article key={item.command} className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
                <h3 className="font-mono text-zinc-100">{item.command}</h3>
                <p className="mt-2 text-sm text-zinc-300">{item.usage}</p>
                <p className="mt-2 text-sm text-zinc-400">
                  <span className="text-zinc-200">Tip:</span> {item.tip}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-2xl font-semibold tracking-tight">
            Common Mistakes &amp; Troubleshooting
          </h2>
          <div className="mt-5 space-y-3">
            {TROUBLESHOOTING.map((item) => (
              <article key={item.issue} className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
                <h3 className="text-sm font-semibold text-zinc-100">{item.issue}</h3>
                <p className="mt-2 text-sm text-zinc-400">{item.fix}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-2xl font-semibold tracking-tight">FAQ</h2>
          <div className="mt-4 space-y-4">
            {FAQS.map((item) => (
              <article key={item.question} className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
                <h3 className="text-sm font-semibold text-zinc-100">{item.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{item.answer}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-2xl font-semibold tracking-tight">Related Tools</h2>
          <p className="mt-3 text-zinc-400">
            Plan commands with{" "}
            <Link
              href="/tools/lethal-company/quota-calculator/"
              className="text-zinc-100 underline decoration-zinc-600 hover:decoration-zinc-200"
            >
              quota calculator
            </Link>{" "}
            and jump to these pages for deeper run prep.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {RELATED_TOOLS.map((tool) => (
              <Link
                key={tool.href}
                href={tool.href}
                className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 transition-colors hover:border-zinc-700"
              >
                {tool.label}
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
