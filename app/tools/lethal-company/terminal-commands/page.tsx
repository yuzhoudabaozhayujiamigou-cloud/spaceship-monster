import Link from "next/link";

import { buildMetadata } from "../../../_seo/metadata";
import { SITE } from "../../../_seo/site";

export const metadata = buildMetadata({
  title: `Lethal Company Terminal Commands Reference | ${SITE.name}`,
  description:
    "Quick, categorized reference of Lethal Company terminal commands with notes and common gotchas.",
  path: "/tools/lethal-company/terminal-commands",
});

type CommandItem = {
  command: string;
  purpose: string;
  notes: string;
};

type CommandSection = {
  id: string;
  title: string;
  description?: string;
  items: CommandItem[];
};

const sections: CommandSection[] = [
  {
    id: "travel",
    title: "Travel & Routing",
    description: "Find moons, set a destination, and handle confirmations.",
    items: [
      {
        command: "moons",
        purpose: "Lists moons you can route to (and their costs, if applicable).",
        notes:
          "Moon availability/costs can vary by version; always confirm in-game.",
      },
      {
        command: "route <moon>",
        purpose: "Sets your destination moon.",
        notes:
          "Usually requires confirmation; routing does not automatically launch.",
      },
      {
        command: "confirm",
        purpose: "Confirms certain actions (commonly routing/travel-related prompts).",
        notes:
          "If you typed a command and nothing happens, you may be at a confirm prompt.",
      },
      {
        command: "cancel",
        purpose: "Cancels a pending prompt/selection (if supported).",
        notes:
          "Not always available; some prompts only accept confirm.",
      },
    ],
  },
  {
    id: "info",
    title: "Info & Scanning",
    description: "Quick readouts and lightweight recon from the terminal.",
    items: [
      {
        command: "help",
        purpose: "Shows a list of available commands (varies by context).",
        notes:
          "If you are unsure what is valid in your current terminal state, start here.",
      },
      {
        command: "scan",
        purpose:
          "Pings the current area for info (commonly used to get a quick readout).",
        notes:
          "If scan output seems limited, that can be normal; it is not a full map reveal.",
      },
    ],
  },
  {
    id: "store",
    title: "Store & Purchases",
    description:
      "Common store interactions. Item names depend on the in-game store rotation/version.",
    items: [
      {
        command: "store",
        purpose: "Opens the company store listing.",
        notes:
          "Use this to confirm exact item names before buying.",
      },
      {
        command: "buy <item> [quantity]",
        purpose: "Purchases an item from the store.",
        notes:
          "Spelling matters; items are whatever the in-game store currently offers.",
      },
      {
        command: "credits",
        purpose: "Shows your current credits (store currency).",
        notes:
          "If this does not work in your build, check the store screen instead.",
      },
    ],
  },
  {
    id: "basics",
    title: "Run Basics (Common Items to Buy)",
    description:
      "Examples of typical store buys. Only use these if your store shows the exact item name.",
    items: [
      {
        command: "buy walkie",
        purpose: "Buys a walkie-talkie (if available in your store).",
        notes:
          "Item names vary (e.g. walkie-talkie vs walkie); copy what your store shows.",
      },
      {
        command: "buy flashlight",
        purpose: "Buys a flashlight (if available).",
        notes:
          "There are multiple flashlight types in some versions/modpacks.",
      },
      {
        command: "buy shovel",
        purpose: "Buys a shovel (if available).",
        notes:
          "Useful for some threats; costs can be steep early on.",
      },
      {
        command: "buy lockpicker",
        purpose: "Buys a lockpicker (if available).",
        notes:
          "Spelling is often the gotcha; check the store list.",
      },
      {
        command: "buy stun grenade",
        purpose: "Buys a stun grenade (if available).",
        notes:
          "Friendly fire / chaos potential; coordinate before throwing.",
      },
      {
        command: "buy boom box",
        purpose: "Buys a boombox (if available).",
        notes:
          "Mostly utility/fun; may draw attention depending on situation.",
      },
      {
        command: "buy extension ladder",
        purpose: "Buys an extension ladder (if available).",
        notes:
          "Some builds only have one ladder item; use the exact store name.",
      },
      {
        command: "buy radar booster",
        purpose: "Buys a radar booster (if available).",
        notes:
          "Pairs with ship monitoring; not every run needs it.",
      },
      {
        command: "buy tzp-inhalant",
        purpose: "Buys TZP inhalant (if available).",
        notes:
          "Name punctuation matters; in doubt, paste from store list.",
      },
      {
        command: "buy jetpack",
        purpose: "Buys a jetpack (if available).",
        notes:
          "Expensive; learn controls in a safe area first.",
      },
      {
        command: "buy ladder",
        purpose: "Buys a ladder (if available).",
        notes:
          "Only if your store carries it; item availability varies.",
      },
    ],
  },
  {
    id: "ship",
    title: "Ship Systems",
    description:
      "Commands tied to the ship terminal: monitor, doors, teleporter, and other ship-side actions.",
    items: [
      {
        command: "view monitor",
        purpose: "Shows the player monitor (useful for finding teammates).",
        notes:
          "Exact wording can differ by version; use help if your build uses a different phrase.",
      },
      {
        command: "switch",
        purpose: "Cycles the monitor camera feed.",
        notes:
          "Most useful while someone is inside; keep cycling to find the correct feed.",
      },
      {
        command: "doors",
        purpose: "Toggles facility doors from the terminal (when applicable).",
        notes:
          "Requires being on a moon/inside context; can be situational and not always available.",
      },
      {
        command: "open",
        purpose: "Opens the currently selected door system (context-dependent).",
        notes:
          "Often paired with door controls; if it does nothing, you may need to select a door first.",
      },
      {
        command: "close",
        purpose: "Closes the currently selected door system (context-dependent).",
        notes:
          "Door control can grief teammates; coordinate in voice chat.",
      },
      {
        command: "teleporter",
        purpose: "Activates the ship teleporter (if installed).",
        notes:
          "Teleporter targets can be finicky; make sure the intended teammate is selected/eligible.",
      },
      {
        command: "inverse teleporter",
        purpose: "Activates the inverse teleporter (if installed).",
        notes:
          "High risk; coordinate before sending someone in.",
      },
    ],
  },
  {
    id: "company",
    title: "Company, Quota & Selling",
    description:
      "Things you do between moons: quota info and selling loops.",
    items: [
      {
        command: "company",
        purpose: "Shows company-related info / takes you to the company context.",
        notes:
          "In some versions, this is mostly used at the company building.",
      },
      {
        command: "quota",
        purpose: "Shows current quota and deadline info.",
        notes:
          "If not available, the relevant info is usually visible on ship UI.",
      },
      {
        command: "deposit",
        purpose: "Deposits sold scrap value toward quota (company building context).",
        notes:
          "Some actions are only possible at the company; you may need to be routed there.",
      },
      {
        command: "sell",
        purpose: "Starts a selling interaction (company building context).",
        notes:
          "Exact prompts vary; follow on-screen instructions.",
      },
      {
        command: "balance",
        purpose: "Shows current balance/credits status (context-dependent).",
        notes:
          "If it fails, rely on store/credits readouts; builds differ.",
      },
    ],
  },
  {
    id: "communication",
    title: "Communication & Notes",
    description:
      "Terminal is often used as a hub to coordinate routes and quick info.",
    items: [
      {
        command: "ping",
        purpose: "Basic attention-getter (context-dependent).",
        notes:
          "Not present in every build; treat as optional.",
      },
      {
        command: "broadcast <message>",
        purpose: "Sends a message to teammates (if supported in your version/modpack).",
        notes:
          "Marked as community/modded; not a guaranteed vanilla command.",
      },
      {
        command: "notes",
        purpose: "Opens a notes-like screen (if supported).",
        notes:
          "Often seen as a modded/quality-of-life feature.",
      },
    ],
  },
  {
    id: "community-modded",
    title: "Community Shorthand / Modded (Not Guaranteed Vanilla)",
    description:
      "These are terms or commands players commonly mention. Only use them if your setup/version supports them.",
    items: [
      {
        command: "seed",
        purpose: "Shows/sets run seed (modded / community feature).",
        notes:
          "Not vanilla in most versions; typically a mod option.",
      },
      {
        command: "weather",
        purpose: "Shows moon weather details (often modded).",
        notes:
          "In vanilla, weather is usually shown in moon listings rather than a separate command.",
      },
      {
        command: "prices",
        purpose: "Prints store prices in a compact list (often shorthand).",
        notes:
          "If you want this in vanilla, use store and read the list.",
      },
      {
        command: "scan moon",
        purpose: "Asks for a moon info dump (community shorthand).",
        notes:
          "In vanilla, scan is context-based; moon info is typically from moons/route UI.",
      },
    ],
  },
];

function slugToHref(id: string) {
  return `#${id}`;
}

export default function LethalCompanyTerminalCommandsPage() {
  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Lethal Company Terminal Commands Reference | ${SITE.name}`,
    url: `${SITE.url}/tools/lethal-company/terminal-commands`,
    description:
      "Quick, categorized reference of Lethal Company terminal commands with notes and common gotchas.",
    isPartOf: {
      "@type": "WebSite",
      name: SITE.name,
      url: SITE.url,
    },
  };

  const vanillaCommands = sections
    .filter((s) => s.id !== "community-modded")
    .reduce((sum, section) => sum + section.items.length, 0);
  const moddedCommands = sections
    .filter((s) => s.id === "community-modded")
    .reduce((sum, section) => sum + section.items.length, 0);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            href="/tools/lethal-company/"
            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            ← Back to Lethal Company Tools
          </Link>
          <span className="text-xs font-mono text-zinc-500">
            {vanillaCommands} core · {moddedCommands} community
          </span>
        </div>

        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Lethal Company Terminal Commands Reference
          </h1>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            A compact, run-friendly list of common terminal commands, grouped by
            what you usually do: route moons, use ship systems, open the store,
            and avoid common gotchas.
          </p>
        </header>

        <section className="mb-10 rounded-2xl border border-zinc-800 bg-zinc-950/30 p-5">
          <h2 className="text-lg font-semibold">Table of contents</h2>
          <p className="mt-2 text-sm text-zinc-400">
            Jump to a section. Commands marked as community/modded are separated
            to avoid mixing them with vanilla basics.
          </p>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
            {sections.map((section) => (
              <a
                key={section.id}
                href={slugToHref(section.id)}
                className="rounded-lg border border-zinc-800 bg-[#0a0a0a] px-3 py-2 text-sm text-zinc-200 hover:bg-zinc-950/60 transition-colors"
              >
                <span className="font-medium">{section.title}</span>
                <span className="ml-2 text-zinc-500">
                  ({section.items.length})
                </span>
              </a>
            ))}
          </div>
        </section>

        <div className="space-y-10">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-20">
              <div className="mb-4">
                <h2 className="text-2xl font-semibold tracking-tight">
                  {section.title}
                </h2>
                {section.description ? (
                  <p className="mt-2 text-zinc-400">{section.description}</p>
                ) : null}
              </div>

              <div className="grid grid-cols-1 gap-3">
                {section.items.map((item) => (
                  <div
                    key={`${section.id}:${item.command}`}
                    className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                      <div>
                        <div className="text-xs font-mono text-zinc-500">
                          command
                        </div>
                        <div className="mt-1 font-mono text-zinc-100">
                          {item.command}
                        </div>
                      </div>
                      <a
                        href={slugToHref(section.id)}
                        className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                      >
                        #{section.id}
                      </a>
                    </div>

                    <div className="mt-4">
                      <div className="text-xs font-mono text-zinc-500">
                        purpose
                      </div>
                      <p className="mt-1 text-sm text-zinc-200 leading-relaxed">
                        {item.purpose}
                      </p>
                    </div>

                    <div className="mt-4">
                      <div className="text-xs font-mono text-zinc-500">notes</div>
                      <p className="mt-1 text-sm text-zinc-400 leading-relaxed">
                        {item.notes}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>

        <section className="mt-12 rounded-2xl border border-zinc-800 bg-zinc-950/20 p-5">
          <h2 className="text-lg font-semibold">Accuracy notes</h2>
          <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
            Lethal Company has changed over time, and some terms you see online
            are shorthand or modded features. This page keeps uncertain entries
            in a separate section so the core reference stays safe.
          </p>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(webPageJsonLd),
          }}
        />
      </main>
    </div>
  );
}

