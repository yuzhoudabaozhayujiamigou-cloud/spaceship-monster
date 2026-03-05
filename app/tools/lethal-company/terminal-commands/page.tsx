import Link from "next/link";

import { buildMetadata } from "../../../_seo/metadata";
import { SITE } from "../../../_seo/site";
import TerminalCommandsToolClient, {
  type TerminalCommandEntry,
} from "./TerminalCommandsToolClient";

export const metadata = buildMetadata({
  title: `Lethal Company Terminal Commands (Searchable + Copyable) | ${SITE.name}`,
  description:
    "Copyable full Lethal Company terminal command list with search, filters, practical notes, and FAQ.",
  path: "/tools/lethal-company/terminal-commands",
});

const COMMANDS: TerminalCommandEntry[] = [
  {
    id: "cmd-moons",
    command: "moons",
    category: "Travel & Routing",
    source: "Core",
    purpose: "Lists moons you can route to (and their costs, depending on version).",
    notes: "Moon availability/costs vary by version and mods; always confirm in-game.",
  },
  {
    id: "cmd-route",
    command: "route <moon>",
    category: "Travel & Routing",
    source: "Core",
    purpose: "Sets your destination moon.",
    notes: "Usually requires a confirmation prompt before travel completes.",
  },
  {
    id: "cmd-confirm",
    command: "confirm",
    category: "Travel & Routing",
    source: "Core",
    purpose: "Confirms pending terminal actions.",
    notes: "If a command seems stuck, you may still be at a confirm prompt.",
  },
  {
    id: "cmd-cancel",
    command: "cancel",
    category: "Travel & Routing",
    source: "Core",
    purpose: "Cancels a pending selection in supported contexts.",
    notes: "Not all prompts support cancel in every build.",
  },
  {
    id: "cmd-help",
    command: "help",
    category: "Info & Scan",
    source: "Core",
    purpose: "Shows available commands for the current terminal state.",
    notes: "Best fallback when command support differs by version.",
  },
  {
    id: "cmd-scan",
    command: "scan",
    category: "Info & Scan",
    source: "Core",
    purpose: "Performs a quick scan/readout from the current context.",
    notes: "Useful for rapid ship-side checks, not a full intel dump.",
  },
  {
    id: "cmd-store",
    command: "store",
    category: "Store & Purchases",
    source: "Core",
    purpose: "Opens the company store listing.",
    notes: "Use this first to verify exact item names in your run.",
  },
  {
    id: "cmd-buy-item",
    command: "buy <item> [quantity]",
    category: "Store & Purchases",
    source: "Core",
    purpose: "Purchases items from the store.",
    notes: "Item spelling and punctuation must match store labels.",
  },
  {
    id: "cmd-credits",
    command: "credits",
    category: "Store & Purchases",
    source: "Core",
    purpose: "Shows current credits in supported contexts.",
    notes: "If unavailable, rely on store or UI readouts.",
  },
  {
    id: "cmd-buy-walkie",
    command: "buy walkie",
    category: "Common Store Buys",
    source: "Core",
    purpose: "Buys a walkie-talkie when available.",
    notes: "Some builds require full item names like walkie-talkie.",
  },
  {
    id: "cmd-buy-flashlight",
    command: "buy flashlight",
    category: "Common Store Buys",
    source: "Core",
    purpose: "Buys a flashlight.",
    notes: "Check for variants before buying in modded packs.",
  },
  {
    id: "cmd-buy-shovel",
    command: "buy shovel",
    category: "Common Store Buys",
    source: "Core",
    purpose: "Buys a shovel for melee utility.",
    notes: "Early runs may prefer utility buys over combat buys.",
  },
  {
    id: "cmd-buy-lockpicker",
    command: "buy lockpicker",
    category: "Common Store Buys",
    source: "Core",
    purpose: "Buys a lockpicker where available.",
    notes: "Watch spelling closely.",
  },
  {
    id: "cmd-buy-stun-grenade",
    command: "buy stun grenade",
    category: "Common Store Buys",
    source: "Core",
    purpose: "Buys a stun grenade.",
    notes: "Coordinate usage to avoid team disruption.",
  },
  {
    id: "cmd-buy-boom-box",
    command: "buy boom box",
    category: "Common Store Buys",
    source: "Core",
    purpose: "Buys a boombox.",
    notes: "Can add chaos; use intentionally.",
  },
  {
    id: "cmd-buy-extension-ladder",
    command: "buy extension ladder",
    category: "Common Store Buys",
    source: "Core",
    purpose: "Buys an extension ladder when present.",
    notes: "Names can vary between versions.",
  },
  {
    id: "cmd-buy-radar-booster",
    command: "buy radar booster",
    category: "Common Store Buys",
    source: "Core",
    purpose: "Buys a radar booster.",
    notes: "Most useful with active ship support workflows.",
  },
  {
    id: "cmd-buy-tzp",
    command: "buy tzp-inhalant",
    category: "Common Store Buys",
    source: "Core",
    purpose: "Buys TZP inhalant.",
    notes: "Punctuation matters on some builds.",
  },
  {
    id: "cmd-buy-jetpack",
    command: "buy jetpack",
    category: "Common Store Buys",
    source: "Core",
    purpose: "Buys a jetpack.",
    notes: "High-cost item; practice handling in safe spots first.",
  },
  {
    id: "cmd-buy-ladder",
    command: "buy ladder",
    category: "Common Store Buys",
    source: "Core",
    purpose: "Buys a ladder item if listed.",
    notes: "Availability depends on version/store rotation.",
  },
  {
    id: "cmd-view-monitor",
    command: "view monitor",
    category: "Ship Systems",
    source: "Core",
    purpose: "Opens the ship monitor feed.",
    notes: "Core command for ship-side tracking and rescue calls.",
  },
  {
    id: "cmd-switch",
    command: "switch",
    category: "Ship Systems",
    source: "Core",
    purpose: "Cycles monitor camera/player feed.",
    notes: "Use repeatedly during active interior runs.",
  },
  {
    id: "cmd-doors",
    command: "doors",
    category: "Ship Systems",
    source: "Core",
    purpose: "Toggles facility door controls when available.",
    notes: "Only relevant in specific contexts.",
  },
  {
    id: "cmd-open",
    command: "open",
    category: "Ship Systems",
    source: "Core",
    purpose: "Opens selected door/system in supported states.",
    notes: "Often paired with door control context selection.",
  },
  {
    id: "cmd-close",
    command: "close",
    category: "Ship Systems",
    source: "Core",
    purpose: "Closes selected door/system in supported states.",
    notes: "Coordinate callouts to avoid griefing teammates.",
  },
  {
    id: "cmd-teleporter",
    command: "teleporter",
    category: "Ship Systems",
    source: "Core",
    purpose: "Activates the teleporter when installed.",
    notes: "Targeting behavior varies; confirm selection before firing.",
  },
  {
    id: "cmd-inverse-teleporter",
    command: "inverse teleporter",
    category: "Ship Systems",
    source: "Core",
    purpose: "Activates inverse teleporter when installed.",
    notes: "High-risk action; use only with clear role coordination.",
  },
  {
    id: "cmd-company",
    command: "company",
    category: "Quota & Selling",
    source: "Core",
    purpose: "Shows company context/info depending on version.",
    notes: "Commonly used in selling loops and quota checks.",
  },
  {
    id: "cmd-quota",
    command: "quota",
    category: "Quota & Selling",
    source: "Core",
    purpose: "Shows quota target and timeline info.",
    notes: "Use with the quota calculator to plan buffer.",
  },
  {
    id: "cmd-deposit",
    command: "deposit",
    category: "Quota & Selling",
    source: "Core",
    purpose: "Deposits sold value toward quota.",
    notes: "Usually requires company-building context.",
  },
  {
    id: "cmd-sell",
    command: "sell",
    category: "Quota & Selling",
    source: "Core",
    purpose: "Starts selling flow in company context.",
    notes: "Prompt flow can differ by build.",
  },
  {
    id: "cmd-balance",
    command: "balance",
    category: "Quota & Selling",
    source: "Core",
    purpose: "Displays current balance/credits state.",
    notes: "If unavailable, check store or HUD alternatives.",
  },
  {
    id: "cmd-ping",
    command: "ping",
    category: "Communication",
    source: "Community/Modded",
    purpose: "Attention ping in supported setups.",
    notes: "Not guaranteed in vanilla.",
  },
  {
    id: "cmd-broadcast",
    command: "broadcast <message>",
    category: "Communication",
    source: "Community/Modded",
    purpose: "Sends a message in builds that support broadcast commands.",
    notes: "Usually community/modded behavior.",
  },
  {
    id: "cmd-notes",
    command: "notes",
    category: "Communication",
    source: "Community/Modded",
    purpose: "Opens notes-like interface in supported builds.",
    notes: "Commonly seen in QoL-mod workflows.",
  },
  {
    id: "cmd-seed",
    command: "seed",
    category: "Community/Modded",
    source: "Community/Modded",
    purpose: "Shows or sets seed-related info in modded setups.",
    notes: "Not expected in standard vanilla command sets.",
  },
  {
    id: "cmd-weather",
    command: "weather",
    category: "Community/Modded",
    source: "Community/Modded",
    purpose: "Weather readout shorthand used in some setups.",
    notes: "Vanilla usually surfaces weather in moon listings.",
  },
  {
    id: "cmd-prices",
    command: "prices",
    category: "Community/Modded",
    source: "Community/Modded",
    purpose: "Store price shorthand for supported mods.",
    notes: "In vanilla, use store output directly.",
  },
  {
    id: "cmd-scan-moon",
    command: "scan moon",
    category: "Community/Modded",
    source: "Community/Modded",
    purpose: "Community shorthand for moon detail scans.",
    notes: "Behavior is not standardized across versions.",
  },
];

const FAQS = [
  {
    question: "Which terminal commands should every ship player memorize first?",
    answer:
      "Start with moons, route <moon>, confirm, view monitor, switch, store, and quota. Those cover route setup, ship support, and quota pacing.",
  },
  {
    question: "Why are some commands labeled Community/Modded?",
    answer:
      "Because command support varies across versions and modpacks. Community/modded labels help you avoid assuming every online command is vanilla-safe.",
  },
  {
    question: "How should we use this page mid-run?",
    answer:
      "Filter to Core commands, search by keyword, and copy exact command text to reduce typing mistakes under pressure.",
  },
  {
    question: "How does this help quota consistency?",
    answer:
      "Faster routing, cleaner store cycles, and reliable ship-side calls reduce wasted time, which directly improves quota hit rate across a cycle.",
  },
];

export default function LethalCompanyTerminalCommandsPage() {
  const coreCount = COMMANDS.filter((item) => item.source === "Core").length;
  const communityCount = COMMANDS.filter(
    (item) => item.source === "Community/Modded",
  ).length;

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Lethal Company Terminal Commands (Searchable + Copyable)",
      url: `${SITE.url}/tools/lethal-company/terminal-commands`,
      description:
        "Copyable full Lethal Company terminal command list with search, filters, practical notes, and FAQ.",
      isPartOf: {
        "@type": "WebSite",
        name: SITE.name,
        url: SITE.url,
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: "Lethal Company Terminal Commands",
      itemListElement: COMMANDS.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        name: item.command,
        url: `${SITE.url}/tools/lethal-company/terminal-commands#${item.id}`,
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            href="/tools/lethal-company/"
            className="text-sm text-zinc-400 transition-colors hover:text-zinc-100"
          >
            ← Back to Lethal Company Tools
          </Link>
          <span className="text-xs font-mono text-zinc-500">
            {coreCount} core · {communityCount} community/modded
          </span>
        </div>

        <header className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Lethal Company Terminal Commands (Searchable + Copyable)
          </h1>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            Full command list with search, category filters, source filters, and
            one-click copy actions for fast mid-run use.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
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
            <Link
              href="/tools/lethal-company/items/"
              className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
            >
              Items reference
            </Link>
            <Link
              href="/tools/lethal-company/ship-upgrades/"
              className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
            >
              Ship upgrades
            </Link>
          </div>
        </header>

        <TerminalCommandsToolClient commands={COMMANDS} />

        <section className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-xl font-semibold">FAQ</h2>
          <div className="mt-4 space-y-4">
            {FAQS.map((faq) => (
              <div
                key={faq.question}
                className="rounded-xl border border-zinc-800/80 bg-zinc-950/30 p-4"
              >
                <h3 className="text-sm font-semibold text-zinc-100">{faq.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </main>
    </div>
  );
}
