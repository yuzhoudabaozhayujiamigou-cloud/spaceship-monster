import Link from "next/link";

import { buildMetadata } from "../../../../_seo/metadata";
import { SITE } from "../../../../_seo/site";
import FaqJsonLd from "../../../../components/FaqJsonLd";

export const metadata = buildMetadata({
  title: `Lethal Company Secret Terminal Commands | ${SITE.name}`,
  description:
    "Lethal Company secret terminal commands guide: contextual commands, community-discovered tricks, easter-egg style behaviors, and version differences.",
  path: "/tools/lethal-company/terminal-commands/secret",
});

type SecretCommand = {
  id: string;
  command: string;
  category: "Contextual" | "Upgrade-Gated" | "Community/Modded";
  whyItFeelsSecret: string;
  howToUse: string;
  reliability: string;
};

const SECRET_LIKE_COMMANDS: SecretCommand[] = [
  {
    id: "confirm-cancel",
    command: "CONFIRM / CANCEL",
    category: "Contextual",
    whyItFeelsSecret:
      "Many players forget prompt-state commands and assume the terminal is bugged when actions do not execute.",
    howToUse: "Use immediately after ROUTE, BUY, or other prompt-driven actions.",
    reliability: "High when prompt is active.",
  },
  {
    id: "doors-open-close",
    command: "DOORS -> OPEN / CLOSE",
    category: "Contextual",
    whyItFeelsSecret:
      "Door controls are invisible in some states, so players often think these are hidden commands.",
    howToUse: "Enter DOORS state first, then run OPEN or CLOSE with team callouts.",
    reliability: "Medium; depends on current state and ship setup.",
  },
  {
    id: "teleporter-pair",
    command: "TELEPORTER / INVERSE TELEPORTER",
    category: "Upgrade-Gated",
    whyItFeelsSecret:
      "These commands appear only when specific upgrades are installed, so they can look like secret unlocks.",
    howToUse: "Install the relevant teleporter system, then activate from ship terminal with role coordination.",
    reliability: "High once upgrade is present.",
  },
  {
    id: "switch-target",
    command: "SWITCH [player]",
    category: "Contextual",
    whyItFeelsSecret:
      "Player-target syntax differs by lobby behavior, so many crews only discover this through trial and error.",
    howToUse: "Use on monitor context to cycle or target teammates during support play.",
    reliability: "Medium; parser details vary.",
  },
  {
    id: "bestiary-command",
    command: "BESTIARY",
    category: "Contextual",
    whyItFeelsSecret:
      "Some versions expose bestiary via UI flow rather than terminal text, creating confusion.",
    howToUse: "Test with HELP in your current build and use if listed.",
    reliability: "Low to medium across versions.",
  },
  {
    id: "broadcast-ping",
    command: "BROADCAST <message> / PING",
    category: "Community/Modded",
    whyItFeelsSecret:
      "These are often shared in community clips as hidden tricks, but most are mod-driven features.",
    howToUse: "Treat as optional. Confirm command support in your modpack docs.",
    reliability: "Low in vanilla, high in matching modded setups.",
  },
];

const EASTER_EGG_NOTES = [
  {
    title: 'Prompt-state behavior is the real "secret"',
    detail:
      "Most so-called secret commands are actually normal commands that only appear in specific terminal states.",
  },
  {
    title: "Ship upgrade unlock behavior",
    detail:
      "Teleporter-related actions feel like hidden content because command availability changes with upgrade progression.",
  },
  {
    title: "Community shorthand vs actual parser",
    detail:
      "Clip-worthy shortcuts often spread faster than their compatibility notes. Always test with HELP before relying on them.",
  },
];

const COMMUNITY_DISCOVERIES = [
  "Create a shared 'safe command pack' for your team with only verified vanilla commands.",
  "Track one 'failed command incident' after each session to identify parser patterns in your lobby.",
  "Use monitor-switch callout macros (name + location + risk) to reduce ship-side hesitation.",
  "Avoid unexplained copy-paste commands from social posts unless they are tested in your exact build.",
];

const VERSION_DIFFS = [
  {
    title: "Vanilla patches can shift command visibility",
    detail:
      "A command may move between always-visible and contextual-visible behavior across updates.",
  },
  {
    title: "Host and lobby state changes command outcomes",
    detail:
      "Even in the same version, terminal state and installed upgrades change which commands execute.",
  },
  {
    title: "Modpacks redefine parser tolerance",
    detail:
      "Abbreviations and extra commands may work perfectly in one modpack and fail completely in another.",
  },
  {
    title: "Guide drift is common",
    detail:
      "Older videos or posts may show commands that no longer exist, or that were never vanilla commands.",
  },
];

const FAQS = [
  {
    question: "Are there real secret cheat commands in vanilla Lethal Company terminal?",
    answer:
      "There is no stable, officially documented list of hidden cheat-style vanilla commands. Most 'secret' behavior is contextual, upgrade-gated, or modded.",
  },
  {
    question: "Why do players report commands that I cannot use?",
    answer:
      "Their clip may come from another patch, a different lobby state, or a modded environment with extra parser support.",
  },
  {
    question: "How can I verify if a secret command is real for my run?",
    answer:
      "Use HELP in your current terminal context, test in a low-risk moment, and document whether the command appears and executes consistently.",
  },
  {
    question: "What is the safest approach to community command tips?",
    answer:
      "Treat them as hypotheses. Test locally first, then add only repeatable commands to your team standard list.",
  },
  {
    question: "Do these secret-command tips still matter if we only play vanilla?",
    answer:
      "Yes. Understanding contextual and upgrade-gated commands prevents many 'terminal is broken' moments in vanilla runs.",
  },
];

const CATEGORY_CLASS: Record<SecretCommand["category"], string> = {
  Contextual: "border-sky-500/40 bg-sky-500/10 text-sky-200",
  "Upgrade-Gated": "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
  "Community/Modded": "border-amber-500/40 bg-amber-500/10 text-amber-200",
};

export default function TerminalSecretCommandsPage() {
  const itemListStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Lethal Company secret-like terminal commands",
    itemListElement: SECRET_LIKE_COMMANDS.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.command,
      url: `${SITE.url}/tools/lethal-company/terminal-commands/secret#${item.id}`,
    })),
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
            Lethal Company Secret Terminal Commands
          </h1>
          <p className="mt-3 max-w-4xl text-zinc-400 leading-relaxed">
            Most &quot;secret commands&quot; are not hidden cheats. They are usually contextual commands,
            upgrade-gated commands, or community/modded parser extensions. This page helps you
            separate reliable workflows from rumor-driven command lists.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              href="/tools/lethal-company/terminal-commands/"
              className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
            >
              Terminal commands list
            </Link>
            <Link
              href="/tools/lethal-company/terminal-commands/shortcuts-tips/"
              className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
            >
              Shortcuts and tips
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
              href="/tools/lethal-company/quota-calculator/"
              className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
            >
              Quota calculator
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
          <h2 className="text-2xl font-semibold tracking-tight">Hidden Commands List (What Actually Exists)</h2>
          <p className="mt-2 text-sm text-zinc-400">
            These are command patterns players often call &quot;secret.&quot; Reliability depends on state,
            upgrades, and whether your lobby is vanilla or modded.
          </p>
          <div className="mt-4 space-y-4">
            {SECRET_LIKE_COMMANDS.map((item) => (
              <article
                key={item.id}
                id={item.id}
                className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <h3 className="font-mono text-zinc-100">{item.command}</h3>
                  <span className={`rounded-full border px-3 py-1 text-xs ${CATEGORY_CLASS[item.category]}`}>
                    {item.category}
                  </span>
                </div>
                <p className="mt-2 text-sm text-zinc-400">{item.whyItFeelsSecret}</p>
                <p className="mt-2 text-sm text-zinc-300">
                  <span className="text-zinc-100">How to use:</span> {item.howToUse}
                </p>
                <p className="mt-2 text-sm text-zinc-300">
                  <span className="text-zinc-100">Reliability:</span> {item.reliability}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-2xl font-semibold tracking-tight">Easter Eggs and Special Behavior</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">
            {EASTER_EGG_NOTES.map((item) => (
              <article
                key={item.title}
                className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4"
              >
                <h3 className="text-sm font-semibold text-zinc-100">{item.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{item.detail}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-2xl font-semibold tracking-tight">Community-Discovered Tricks</h2>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-zinc-300">
            {COMMUNITY_DISCOVERIES.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-zinc-400">
            Keep your baseline command source in the{" "}
            <Link
              href="/tools/lethal-company/terminal-commands/"
              className="text-zinc-100 underline decoration-zinc-600 hover:decoration-zinc-200"
            >
              full terminal commands list
            </Link>
            {" "}and use the{" "}
            <Link
              href="/tools/lethal-company/terminal/shortcuts-abbreviations/"
              className="text-zinc-100 underline decoration-zinc-600 hover:decoration-zinc-200"
            >
              terminal guide
            </Link>
            {" "}for stable shorthand patterns.
          </p>
        </section>

        <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-2xl font-semibold tracking-tight">Version Difference Notes</h2>
          <div className="mt-4 space-y-3">
            {VERSION_DIFFS.map((item) => (
              <article
                key={item.title}
                className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-4"
              >
                <h3 className="text-sm font-semibold text-zinc-100">{item.title}</h3>
                <p className="mt-2 text-sm text-zinc-400">{item.detail}</p>
              </article>
            ))}
          </div>
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListStructuredData) }}
        />
      </main>
    </div>
  );
}
