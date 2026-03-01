import Link from "next/link";

import { buildMetadata } from "../../_seo/metadata";
import { SITE } from "../../_seo/site";

import TerminalCommandsClient from "./TerminalCommandsClient";

export const metadata = buildMetadata({
  title: `Terminal Commands Cheat Sheet (Searchable) | ${SITE.name}`,
  description:
    "Searchable Lethal Company terminal commands cheat sheet with shortcuts, examples, and copy-paste workflows.",
  path: "/terminal/commands",
});

type CommandCategory = "Routing" | "Store" | "Scan" | "Ship" | "Other";

type Command = {
  name: string;
  shortcuts: string[];
  category: CommandCategory;
  what: string;
  example: string;
  when: string;
};

type Workflow = {
  title: string;
  goal: string;
  steps: Array<{ label: string; commands: string[] }>;
};

const COMMANDS: Command[] = [
  {
    name: "moons",
    shortcuts: [],
    category: "Routing",
    what: "List available moons (and costs, depending on version).",
    example: "moons",
    when: "Start-of-run planning and picking a destination.",
  },
  {
    name: "route <moon>",
    shortcuts: [],
    category: "Routing",
    what: "Set a destination moon.",
    example: "route assurance",
    when: "After you decide which moon to go to.",
  },
  {
    name: "confirm",
    shortcuts: ["c"],
    category: "Routing",
    what: "Confirm pending prompts (commonly routing / purchases).",
    example: "confirm",
    when: "If a command seems to do nothing, you may be at a confirm prompt.",
  },
  {
    name: "store",
    shortcuts: [],
    category: "Store",
    what: "Open the company store listing.",
    example: "store",
    when: "Before buying items; verify exact item names.",
  },
  {
    name: "buy <item> [qty]",
    shortcuts: [],
    category: "Store",
    what: "Buy an item from the store.",
    example: "buy flashlight 2",
    when: "Stock up before launching or between moons.",
  },
  {
    name: "credits",
    shortcuts: [],
    category: "Store",
    what: "Show current credits (context-dependent).",
    example: "credits",
    when: "Quick check before deciding purchases.",
  },
  {
    name: "scan",
    shortcuts: [],
    category: "Scan",
    what: "Quick scan/ping for a basic readout (behavior varies by version).",
    example: "scan",
    when: "Fast recon from ship / sanity check when coordinating.",
  },
  {
    name: "view monitor",
    shortcuts: [],
    category: "Ship",
    what: "Open the ship monitor to see players/cameras.",
    example: "view monitor",
    when: "When you are the ship person supporting the team.",
  },
  {
    name: "switch",
    shortcuts: [],
    category: "Ship",
    what: "Cycle monitor camera feed.",
    example: "switch",
    when: "To find a teammate or a relevant camera angle.",
  },
];

const WORKFLOWS: Workflow[] = [
  {
    title: "Quick route + confirm",
    goal: "Pick a moon quickly and get past confirm prompts.",
    steps: [
      { label: "List options", commands: ["moons"] },
      { label: "Set destination", commands: ["route assurance"] },
      { label: "Confirm", commands: ["confirm"] },
    ],
  },
  {
    title: "Store buy (fast)",
    goal: "Buy essentials without fumbling item names.",
    steps: [
      { label: "Open store", commands: ["store"] },
      { label: "Check credits", commands: ["credits"] },
      { label: "Buy", commands: ["buy flashlight", "buy walkie"] },
      { label: "Confirm", commands: ["confirm"] },
    ],
  },
  {
    title: "Ship scouting loop",
    goal: "Support teammates from ship with monitor + scan.",
    steps: [
      { label: "Monitor", commands: ["view monitor"] },
      { label: "Cycle", commands: ["switch", "switch"] },
      { label: "Scan", commands: ["scan"] },
    ],
  },
];


export default function TerminalCommandsPage() {
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What are the essential terminal commands every ship person should know?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Start with moons, route <moon>, confirm, view monitor, and switch. Add store/buy for prep and scan for quick readouts.",
        },
      },
      {
        "@type": "Question",
        name: "Can you shorten terminal commands (abbreviations) and still have them work?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Some builds accept abbreviations (like c for confirm), but it depends on version/mods. When in doubt, type the full command.",
        },
      },
      {
        "@type": "Question",
        name: "How do CONFIRM shortcuts work when buying items in the terminal?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "After certain actions (routing or store purchases), the terminal may wait at a prompt. Type confirm (or c, if supported) to proceed.",
        },
      },
    ],
  };

  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `Terminal Commands Cheat Sheet (Searchable) | ${SITE.name}`,
      url: `${SITE.url}/terminal/commands`,
      description:
        "Searchable Lethal Company terminal commands cheat sheet with shortcuts, examples, and copy-paste workflows.",
      isPartOf: {
        "@type": "WebSite",
        name: SITE.name,
        url: SITE.url,
      },
    },
    faqJsonLd,
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      <main className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            href="/tools/lethal-company/"
            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            ← Back to Lethal Company Tools
          </Link>
          <span className="text-xs font-mono text-zinc-500">
            /terminal/commands
          </span>
        </div>

        <header className="mb-6">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Terminal Commands Cheat Sheet (Searchable)
          </h1>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            A run-friendly command index with shortcuts, examples, and
            copy-paste workflows.
          </p>
        </header>

        <TerminalCommandsClient
          commands={COMMANDS}
          workflows={WORKFLOWS}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </main>
    </div>
  );
}

