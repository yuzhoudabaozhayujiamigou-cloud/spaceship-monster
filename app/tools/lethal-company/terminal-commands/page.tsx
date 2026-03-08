import Link from "next/link";

import { buildMetadata } from "../../../_seo/metadata";
import { SITE } from "../../../_seo/site";
import FaqJsonLd from "../../../components/FaqJsonLd";

export const metadata = buildMetadata({
  title: `Lethal Company Terminal Commands List with Explanations | ${SITE.name}`,
  description:
    "Complete Lethal Company terminal commands list with explanations, syntax, parameters, examples, troubleshooting, and FAQ.",
  path: "/tools/lethal-company/terminal-commands",
});

type CommandCategory = "Navigation" | "Scan" | "Store" | "Door Control" | "Other";
type CommandSupport = "Vanilla" | "Contextual" | "Community/Modded";

type TerminalCommand = {
  id: string;
  command: string;
  category: CommandCategory;
  syntax: string;
  params: string;
  example: string;
  purpose: string;
  notes: string;
  support: CommandSupport;
};

const COMMAND_CATEGORIES: CommandCategory[] = [
  "Navigation",
  "Scan",
  "Store",
  "Door Control",
  "Other",
];

const TERMINAL_COMMANDS: TerminalCommand[] = [
  {
    id: "help",
    command: "HELP",
    category: "Navigation",
    syntax: "HELP",
    params: "None",
    example: "HELP",
    purpose: "Shows the command menu available in your current terminal context.",
    notes: "Use this first if commands fail after a patch or in modded lobbies.",
    support: "Vanilla",
  },
  {
    id: "moons",
    command: "MOONS",
    category: "Navigation",
    syntax: "MOONS",
    params: "None",
    example: "MOONS",
    purpose: "Lists routeable moons and current conditions in your build.",
    notes: "Moon costs and weather labels can differ by version.",
    support: "Vanilla",
  },
  {
    id: "route",
    command: "ROUTE <moon>",
    category: "Navigation",
    syntax: "ROUTE <moon_name>",
    params: "moon_name (required)",
    example: "ROUTE Experimentation",
    purpose: "Selects your destination moon for travel planning.",
    notes: "Usually followed by a prompt requiring CONFIRM.",
    support: "Vanilla",
  },
  {
    id: "confirm",
    command: "CONFIRM",
    category: "Navigation",
    syntax: "CONFIRM",
    params: "None",
    example: "CONFIRM",
    purpose: "Confirms route, purchase, and other pending terminal actions.",
    notes: "If nothing happens after input, check if you are still at a prompt state.",
    support: "Vanilla",
  },
  {
    id: "cancel",
    command: "CANCEL",
    category: "Navigation",
    syntax: "CANCEL",
    params: "None",
    example: "CANCEL",
    purpose: "Cancels the currently pending action when cancellation is supported.",
    notes: "Not every prompt accepts CANCEL in every patch.",
    support: "Contextual",
  },
  {
    id: "clear",
    command: "CLEAR",
    category: "Navigation",
    syntax: "CLEAR",
    params: "None",
    example: "CLEAR",
    purpose: "Clears terminal output to reduce visual clutter.",
    notes: "Useful during hectic ship-side calls so important lines stay visible.",
    support: "Contextual",
  },
  {
    id: "scan",
    command: "SCAN",
    category: "Scan",
    syntax: "SCAN",
    params: "None",
    example: "SCAN",
    purpose: "Runs a quick readout from your current scan context.",
    notes: "Best used in regular cycles so crew decisions stay data-driven.",
    support: "Vanilla",
  },
  {
    id: "view-monitor",
    command: "VIEW MONITOR",
    category: "Scan",
    syntax: "VIEW MONITOR",
    params: "None",
    example: "VIEW MONITOR",
    purpose: "Opens monitor feed for ship-side tracking and callouts.",
    notes: "Core command for support player workflows.",
    support: "Vanilla",
  },
  {
    id: "switch",
    command: "SWITCH [player]",
    category: "Scan",
    syntax: "SWITCH [player_name_or_index]",
    params: "player_name_or_index (optional)",
    example: "SWITCH Alice",
    purpose: "Cycles or targets monitor view to a specific teammate.",
    notes: "Exact targeting behavior can vary by build.",
    support: "Contextual",
  },
  {
    id: "ping",
    command: "PING",
    category: "Scan",
    syntax: "PING",
    params: "None",
    example: "PING",
    purpose: "Sends a simple signal in setups where ping support exists.",
    notes: "Often appears in community/modded command sets, not guaranteed in vanilla.",
    support: "Community/Modded",
  },
  {
    id: "store",
    command: "STORE",
    category: "Store",
    syntax: "STORE",
    params: "None",
    example: "STORE",
    purpose: "Opens the company store list.",
    notes: "Always verify exact item spellings before buying.",
    support: "Vanilla",
  },
  {
    id: "buy",
    command: "BUY <item> [quantity]",
    category: "Store",
    syntax: "BUY <item_name> [quantity]",
    params: "item_name (required), quantity (optional)",
    example: "BUY Flashlight 2",
    purpose: "Purchases one or more items from the store.",
    notes: "Hyphens and spacing in item names can matter.",
    support: "Vanilla",
  },
  {
    id: "credits",
    command: "CREDITS",
    category: "Store",
    syntax: "CREDITS",
    params: "None",
    example: "CREDITS",
    purpose: "Shows credit balance in supported store contexts.",
    notes: "If unavailable, check balance from store/HUD alternatives.",
    support: "Contextual",
  },
  {
    id: "balance",
    command: "BALANCE",
    category: "Store",
    syntax: "BALANCE",
    params: "None",
    example: "BALANCE",
    purpose: "Checks available team balance before purchases.",
    notes: "Great for avoiding overspending before quota days.",
    support: "Contextual",
  },
  {
    id: "storage",
    command: "STORAGE",
    category: "Store",
    syntax: "STORAGE",
    params: "None",
    example: "STORAGE",
    purpose: "Displays stored ship inventory where supported.",
    notes: "Command visibility can differ by version.",
    support: "Contextual",
  },
  {
    id: "doors",
    command: "DOORS",
    category: "Door Control",
    syntax: "DOORS",
    params: "None",
    example: "DOORS",
    purpose: "Enters door control state for ship-side support actions.",
    notes: "Only relevant when door-control systems are available.",
    support: "Contextual",
  },
  {
    id: "open",
    command: "OPEN",
    category: "Door Control",
    syntax: "OPEN",
    params: "None",
    example: "OPEN",
    purpose: "Opens selected door/system from a compatible control context.",
    notes: "Use clean voice callouts so crew is not trapped unexpectedly.",
    support: "Contextual",
  },
  {
    id: "close",
    command: "CLOSE",
    category: "Door Control",
    syntax: "CLOSE",
    params: "None",
    example: "CLOSE",
    purpose: "Closes selected door/system from a compatible control context.",
    notes: "Timing matters: bad door timing can cause wipe-level mistakes.",
    support: "Contextual",
  },
  {
    id: "teleporter",
    command: "TELEPORTER",
    category: "Door Control",
    syntax: "TELEPORTER",
    params: "None",
    example: "TELEPORTER",
    purpose: "Activates teleporter when the upgrade is installed and ready.",
    notes: "Confirm target and team callout before activation.",
    support: "Contextual",
  },
  {
    id: "inverse-teleporter",
    command: "INVERSE TELEPORTER",
    category: "Door Control",
    syntax: "INVERSE TELEPORTER",
    params: "None",
    example: "INVERSE TELEPORTER",
    purpose: "Activates inverse teleporter if the ship has that system.",
    notes: "High-risk action; use only with a clear plan.",
    support: "Contextual",
  },
  {
    id: "quota",
    command: "QUOTA",
    category: "Other",
    syntax: "QUOTA",
    params: "None",
    example: "QUOTA",
    purpose: "Displays quota status and remaining requirement in supported contexts.",
    notes: "Pair with sell planning to avoid last-minute panic runs.",
    support: "Contextual",
  },
  {
    id: "company",
    command: "COMPANY",
    category: "Other",
    syntax: "COMPANY",
    params: "None",
    example: "COMPANY",
    purpose: "Shows company terminal context used for selling and quota workflows.",
    notes: "Useful before DEPOSIT/SELL loops.",
    support: "Contextual",
  },
  {
    id: "deposit",
    command: "DEPOSIT",
    category: "Other",
    syntax: "DEPOSIT",
    params: "None",
    example: "DEPOSIT",
    purpose: "Deposits value toward quota when in the right state.",
    notes: "Often requires company-side terminal context first.",
    support: "Contextual",
  },
  {
    id: "sell",
    command: "SELL",
    category: "Other",
    syntax: "SELL",
    params: "None",
    example: "SELL",
    purpose: "Starts selling flow in supported company contexts.",
    notes: "Prompt flow differs between patches and modpacks.",
    support: "Contextual",
  },
  {
    id: "bestiary",
    command: "BESTIARY",
    category: "Other",
    syntax: "BESTIARY",
    params: "None",
    example: "BESTIARY",
    purpose: "Opens enemy log in builds where the command is exposed.",
    notes: "Some lobbies expose this through menus instead of terminal text.",
    support: "Contextual",
  },
  {
    id: "broadcast",
    command: "BROADCAST <message>",
    category: "Other",
    syntax: "BROADCAST <message>",
    params: "message (required)",
    example: "BROADCAST leave at 14:30",
    purpose: "Sends a text broadcast in specific community/modded setups.",
    notes: "Not part of standard vanilla command menus.",
    support: "Community/Modded",
  },
];

const COMMON_ERRORS = [
  {
    error: "Unknown command",
    cause: "The command is version-specific, contextual, or modded-only.",
    fix: "Run HELP in the current terminal state, then use only listed commands.",
  },
  {
    error: "ROUTE fails even with correct moon name",
    cause: "Moon name spelling does not match your in-game list exactly.",
    fix: "Use MOONS first, then copy spacing/capitalization from that list.",
  },
  {
    error: "BUY does nothing",
    cause: "Missing item name or quantity syntax issue.",
    fix: "Use STORE, then type BUY with exact item text; add quantity only if supported.",
  },
  {
    error: "Door commands not responding",
    cause: "No door control context, missing ship upgrade, or wrong timing.",
    fix: "Enter DOORS state first and coordinate callouts before OPEN/CLOSE.",
  },
  {
    error: "Teleporter command seems random",
    cause: "Activation without clear target confirmation.",
    fix: "Call target name and status before TELEPORTER/INVERSE TELEPORTER.",
  },
  {
    error: "Quota commands look inconsistent",
    cause: "Different command exposure between patches and lobbies.",
    fix: "Use QUOTA plus the quota calculator as your stable planning baseline.",
  },
];

const FAQS = [
  {
    question: "What are the most important terminal commands to learn first?",
    answer:
      "Start with HELP, MOONS, ROUTE, CONFIRM, STORE, and SCAN. These cover navigation, purchase flow, and ship-side information loops.",
  },
  {
    question: "Do I need uppercase command input?",
    answer:
      "In most setups command matching is case-insensitive, but exact spelling and spacing still matter for moon and item names.",
  },
  {
    question: "Why do some commands work only sometimes?",
    answer:
      "Several commands are contextual. They appear only when the terminal is in the right state or when a related ship upgrade is installed.",
  },
  {
    question: "Are community terminal commands safe to rely on for vanilla guides?",
    answer:
      "No. Treat community/modded commands as optional extras and base your core workflow on commands visible via HELP in your own lobby.",
  },
  {
    question: "How should teams reduce command mistakes during pressure moments?",
    answer:
      "Standardize one ship operator, use short verbal confirmations, and keep a quick-reference list open on a second screen or phone.",
  },
];

const SUPPORT_CLASS: Record<CommandSupport, string> = {
  Vanilla: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
  Contextual: "border-sky-500/40 bg-sky-500/10 text-sky-200",
  "Community/Modded": "border-amber-500/40 bg-amber-500/10 text-amber-200",
};

export default function TerminalCommandsListPage() {
  const itemListStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Lethal Company Terminal Commands List",
    itemListElement: TERMINAL_COMMANDS.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.command,
      url: `${SITE.url}/tools/lethal-company/terminal-commands#${item.id}`,
    })),
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      <FaqJsonLd faqs={FAQS.map((faq) => ({ question: faq.question, answer: faq.answer }))} />
      <main className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
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
            Lethal Company Terminal Commands List with Explanations
          </h1>
          <p className="mt-3 max-w-4xl text-zinc-400 leading-relaxed">
            Full terminal reference grouped by category: navigation, scan, store, door control,
            and other utility commands. Each entry includes syntax, parameters, examples, and
            practical caution notes so your crew can type faster with fewer run-ending mistakes.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/tools/lethal-company/terminal/shortcuts-abbreviations/"
              className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
            >
              Terminal guide
            </Link>
            <Link
              href="/tools/lethal-company/terminal-commands/shortcuts-tips/"
              className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
            >
              Shortcuts and tips
            </Link>
            <Link
              href="/tools/lethal-company/terminal-commands/secret/"
              className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
            >
              Secret commands
            </Link>
            <Link
              href="/tools/lethal-company/quota-calculator/"
              className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
            >
              Quota calculator
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

        <section className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-2xl font-semibold tracking-tight">Quick Reference</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Fast lookup table for mid-run usage. Open this section on mobile when one player is
            handling ship-side input.
          </p>
          <div className="mt-4 overflow-x-auto rounded-xl border border-zinc-800">
            <table className="min-w-full divide-y divide-zinc-800 text-sm">
              <thead className="bg-zinc-950/60 text-zinc-300">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Command</th>
                  <th className="px-4 py-3 text-left font-semibold">Use</th>
                  <th className="px-4 py-3 text-left font-semibold">Example</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 bg-[#0a0a0a]">
                {TERMINAL_COMMANDS.map((item) => (
                  <tr key={`quick-${item.id}`}>
                    <td className="px-4 py-3 font-mono text-zinc-100">{item.command}</td>
                    <td className="px-4 py-3 text-zinc-300">{item.purpose}</td>
                    <td className="px-4 py-3 font-mono text-zinc-200">{item.example}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold tracking-tight">Complete Terminal Commands by Category</h2>
          <p className="mt-2 text-zinc-400 leading-relaxed">
            Labels: <span className="text-emerald-200">Vanilla</span> means broadly available in
            standard play, <span className="text-sky-200">Contextual</span> means state/upgrade
            dependent, and <span className="text-amber-200">Community/Modded</span> means not
            guaranteed in vanilla.
          </p>

          <div className="mt-6 space-y-8">
            {COMMAND_CATEGORIES.map((category) => {
              const commands = TERMINAL_COMMANDS.filter((item) => item.category === category);
              return (
                <section key={category}>
                  <h3 className="text-xl font-semibold">{category}</h3>
                  <div className="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-2">
                    {commands.map((item) => (
                      <article
                        key={item.id}
                        id={item.id}
                        className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <div className="font-mono text-zinc-100">{item.command}</div>
                            <p className="mt-2 text-sm text-zinc-300">{item.purpose}</p>
                          </div>
                          <span
                            className={`rounded-full border px-3 py-1 text-xs ${SUPPORT_CLASS[item.support]}`}
                          >
                            {item.support}
                          </span>
                        </div>

                        <dl className="mt-4 space-y-2 text-sm">
                          <div>
                            <dt className="font-mono text-zinc-500">Syntax</dt>
                            <dd className="mt-1 font-mono text-zinc-200">{item.syntax}</dd>
                          </div>
                          <div>
                            <dt className="font-mono text-zinc-500">Parameters</dt>
                            <dd className="mt-1 text-zinc-300">{item.params}</dd>
                          </div>
                          <div>
                            <dt className="font-mono text-zinc-500">Example</dt>
                            <dd className="mt-1 font-mono text-zinc-200">{item.example}</dd>
                          </div>
                          <div>
                            <dt className="font-mono text-zinc-500">Notes</dt>
                            <dd className="mt-1 text-zinc-400">{item.notes}</dd>
                          </div>
                        </dl>
                      </article>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-2xl font-semibold tracking-tight">Common Errors and Fixes</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {COMMON_ERRORS.map((item) => (
              <article
                key={item.error}
                className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4"
              >
                <h3 className="text-sm font-semibold text-zinc-100">{item.error}</h3>
                <p className="mt-2 text-sm text-zinc-400">
                  <span className="text-zinc-300">Cause:</span> {item.cause}
                </p>
                <p className="mt-2 text-sm text-zinc-300">
                  <span className="text-zinc-100">Fix:</span> {item.fix}
                </p>
              </article>
            ))}
          </div>
          <p className="mt-4 text-sm text-zinc-400">
            For deeper timing and team workflow optimization, jump to the{" "}
            <Link
              href="/tools/lethal-company/terminal-commands/shortcuts-tips/"
              className="text-zinc-100 underline decoration-zinc-600 hover:decoration-zinc-200"
            >
              shortcuts and tips guide
            </Link>
            .
          </p>
        </section>

        <section className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListStructuredData) }}
        />
      </main>
    </div>
  );
}
