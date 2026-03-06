import Link from "next/link";

import { buildMetadata } from "../../../_seo/metadata";
import { SITE } from "../../../_seo/site";
import FaqJsonLd from "../../../components/FaqJsonLd";

export const metadata = buildMetadata({
  title: `Lethal Company Bestiary – All Monsters & How to Survive | ${SITE.name}`,
  description:
    "Complete Lethal Company bestiary: every monster, their behavior patterns, danger level, and proven survival strategies.",
  path: "/tools/lethal-company/bestiary",
});

type Threat = "Extreme" | "High" | "Medium" | "Low";

type MonsterItem = {
  name: string;
  location: "Indoor" | "Outdoor" | "Both";
  behavior: string;
  survival: string;
  threat: Threat;
};

type MonsterSection = {
  id: string;
  title: string;
  label: string;
  accent: {
    border: string;
    chip: string;
    chipText: string;
  };
  monsters: MonsterItem[];
};

type Faq = {
  question: string;
  answer: string;
};

const sections: MonsterSection[] = [
  {
    id: "extreme",
    title: "Extreme Threat",
    label: "🔴 Extreme",
    accent: {
      border: "border-red-900/50",
      chip: "bg-red-500/10",
      chipText: "text-red-200",
    },
    monsters: [
      {
        name: "Bracken",
        location: "Indoor",
        behavior:
          "Stalks quietly and tries to approach from behind. If you keep staring, it backs off and repositions, waiting for an opening.",
        survival:
          "Assign a buddy to ‘watch your back’ and do quick shoulder checks. If you spot it, keep brief eye contact while backing toward teammates, then leave the area—don’t get isolated.",
        threat: "Extreme",
      },
      {
        name: "Coil-Head",
        location: "Indoor",
        behavior:
          "Moves when not observed and closes distance extremely fast. It punishes split focus and chaotic retreats.",
        survival:
          "One person hard-watches it while others pathfind and open doors. Rotate the watcher only with clear callouts; never turn your camera away while it’s in the same corridor.",
        threat: "Extreme",
      },
      {
        name: "Jester",
        location: "Indoor",
        behavior:
          "Starts in a ‘cranked’ state and escalates after enough time/interaction, becoming a lethal pursuer that forces evacuations.",
        survival:
          "Treat it as a timer: grab nearby scrap and start moving out early. If it begins ramping, call the retreat immediately and avoid dead-end loops.",
        threat: "Extreme",
      },
      {
        name: "Ghost Girl",
        location: "Indoor",
        behavior:
          "Targets a specific player and manifests unpredictably; being alone and panicking tends to make outcomes worse.",
        survival:
          "If you’re being haunted, stick close to teammates and keep routes simple. Communicate early, avoid solo looting, and prioritize extraction over ‘one more room.’",
        threat: "Extreme",
      },
    ],
  },
  {
    id: "high",
    title: "High Threat",
    label: "🟠 High",
    accent: {
      border: "border-orange-900/50",
      chip: "bg-orange-500/10",
      chipText: "text-orange-200",
    },
    monsters: [
      {
        name: "Thumper",
        location: "Indoor",
        behavior:
          "Charges aggressively down corridors and punishes slow turns and narrow chokepoints. It’s loud, fast, and relentless once engaged.",
        survival:
          "Break line-of-sight with doors and hard corners; don’t kite it into teammates. If you must fight, coordinate stuns/spacing—otherwise disengage and reroute.",
        threat: "High",
      },
      {
        name: "Bunker Spider",
        location: "Indoor",
        behavior:
          "Sets up in rooms and can control space with webs and surprise pressure. It often guards valuable scrap spots.",
        survival:
          "Listen for cues and avoid sprinting blindly into webbed rooms. Clear a safe path first, keep distance, and use doors to reset the encounter while you extract loot.",
        threat: "High",
      },
      {
        name: "Earth Leviathan",
        location: "Outdoor",
        behavior:
          "Burrows and attacks from below, punishing loud movement and predictable routes in open terrain.",
        survival:
          "Move in short bursts and avoid long straight sprints across open ground. If you hear/feel it tracking, change direction, use rocks/structures, and time your crossings.",
        threat: "High",
      },
      {
        name: "Eyeless Dog",
        location: "Outdoor",
        behavior:
          "Hunts by sound; noise can pull it to the ship or to your extraction route. It turns small mistakes into instant wipes.",
        survival:
          "Go silent: stop talking in proximity, avoid sprinting/jumping, and close doors gently. If it’s near the ship, wait it out and coordinate a quiet, single-file entry.",
        threat: "High",
      },
    ],
  },
  {
    id: "medium",
    title: "Medium Threat",
    label: "🟡 Medium",
    accent: {
      border: "border-yellow-900/50",
      chip: "bg-yellow-500/10",
      chipText: "text-yellow-200",
    },
    monsters: [
      {
        name: "Snare Flea",
        location: "Indoor",
        behavior:
          "Drops onto a player’s head and restricts vision/movement, turning a normal hallway into a panic trap.",
        survival:
          "Stay close enough to help each other: if someone gets grabbed, teammates should react instantly and clear it. Move carefully under ceilings and check corners with a flashlight.",
        threat: "Medium",
      },
      {
        name: "Hygrodere (Slime)",
        location: "Indoor",
        behavior:
          "Slow but persistent, it blocks paths and forces detours. It becomes dangerous when it pins you between other threats.",
        survival:
          "Don’t try to ‘thread the needle’—reroute early and mark a safe return corridor. If it’s on the shortest exit path, bank loot sooner and leave before the maze collapses.",
        threat: "Medium",
      },
      {
        name: "Baboon Hawk",
        location: "Outdoor",
        behavior:
          "Harasses and tests for openings, especially when players are separated. It’s more dangerous as a distraction than as a direct killer.",
        survival:
          "Stay grouped when hauling and avoid dropping items in panic. If it commits, back up together and keep your ship approach controlled instead of scattering.",
        threat: "Medium",
      },
      {
        name: "Forest Keeper",
        location: "Outdoor",
        behavior:
          "Patrols forested areas and can spot and pursue players, making long outdoor carries risky.",
        survival:
          "Plan a safer haul route before you commit to heavy scrap. Use cover and break sightlines; if it’s on your line, stash loot closer to ship first and make fewer trips.",
        threat: "Medium",
      },
    ],
  },
  {
    id: "low",
    title: "Low Threat",
    label: "🟢 Low",
    accent: {
      border: "border-emerald-900/50",
      chip: "bg-emerald-500/10",
      chipText: "text-emerald-200",
    },
    monsters: [
      {
        name: "Hoarding Bug",
        location: "Indoor",
        behavior:
          "Collects items and can get territorial near its stash. It’s often more annoying than lethal—until you provoke it.",
        survival:
          "Avoid stealing from its pile unless you’re ready to leave. If you need the loot, do it fast with a buddy and an exit plan; don’t chase it deep into rooms.",
        threat: "Low",
      },
      {
        name: "Spore Lizard",
        location: "Indoor",
        behavior:
          "Usually non-aggressive and tries to flee; it can startle players into bad decisions rather than directly causing deaths.",
        survival:
          "Treat it as a noise/jumpscare risk: don’t sprint blindly after it. Keep your route discipline and save stamina for real threats.",
        threat: "Low",
      },
      {
        name: "Manticoil",
        location: "Outdoor",
        behavior:
          "Generally harmless wildlife that can distract attention or mask audio cues from more serious outdoor threats.",
        survival:
          "Don’t waste time on it—use the moment to scan your surroundings. Keep comms focused on dogs/keepers and save your stamina for extraction.",
        threat: "Low",
      },
      {
        name: "Roaming Locusts",
        location: "Outdoor",
        behavior:
          "A moving swarm that reduces visibility and can disorient you during hauling or night returns.",
        survival:
          "Slow down and navigate deliberately; use landmarks and ping teammates for guidance. If visibility is terrible, consolidate scrap and do fewer, safer trips.",
        threat: "Low",
      },
    ],
  },
];

const faqs: Faq[] = [
  {
    question: "What’s the most dangerous monster in Lethal Company?",
    answer:
      "It depends on your team size and habits, but Bracken, Coil-Heads, Jester, and Ghost Girl consistently cause wipes because they punish isolation, bad comms, and over-staying inside.",
  },
  {
    question: "How should a 4-player team handle extreme threats?",
    answer:
      "Run roles: one ship/monitor support when possible, one scout, and two haulers. Extreme threats get easier when you keep line-of-sight discipline, call retreats early, and avoid solo looting.",
  },
  {
    question: "What’s the safest way to extract scrap when outdoor threats are active?",
    answer:
      "Consolidate loot closer to the ship, make fewer trips, and keep movement quiet when dogs are possible. If a route becomes unsafe, stash and rotate rather than forcing a long carry.",
  },
  {
    question: "Do terminal commands help you survive monsters?",
    answer:
      "Indirectly: faster routing, ship-side monitoring, and clean callouts reduce time loss and confusion. See the terminal command reference for practical ship workflows and common gotchas.",
  },
  {
    question: "How do we pick safer moons while learning the game?",
    answer:
      "Choose lower-variance moons you can clear consistently, leave earlier, and sell with buffer. The moons guide helps you think in tiers and risk factors rather than chasing one ‘best’ moon.",
  },
];

function threatToCopy(threat: Threat) {
  if (threat === "Extreme") return "Extreme threat";
  if (threat === "High") return "High threat";
  if (threat === "Medium") return "Medium threat";
  return "Low threat";
}

function locationChip(location: MonsterItem["location"]) {
  if (location === "Indoor") return "Indoor";
  if (location === "Outdoor") return "Outdoor";
  return "Indoor + Outdoor";
}

export default function LethalCompanyBestiaryPage() {
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
      <FaqJsonLd faqs={faqs.map(f => ({ question: f.question, answer: f.answer }))} />
      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            href="/tools/lethal-company/"
            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            ← Back to Lethal Company Tools
          </Link>
        </div>

        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
            <li>
              <Link
                href="/"
                className="hover:text-zinc-200 transition-colors"
              >
                Home
              </Link>
            </li>
            <li className="text-zinc-700">/</li>
            <li>
              <Link
                href="/tools/"
                className="hover:text-zinc-200 transition-colors"
              >
                Tools
              </Link>
            </li>
            <li className="text-zinc-700">/</li>
            <li>
              <Link
                href="/tools/lethal-company/"
                className="hover:text-zinc-200 transition-colors"
              >
                Lethal Company
              </Link>
            </li>
            <li className="text-zinc-700">/</li>
            <li className="text-zinc-200">Bestiary</li>
          </ol>
        </nav>

        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Lethal Company Bestiary – All Monsters &amp; How to Survive
          </h1>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            This bestiary is a run-first reference: what each monster does,
            where it typically shows up, and the most reliable ways to stay
            alive when things get loud. Treat it as a practical checklist,
            not a lore book.
          </p>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            If your squad is still learning, pair this page with the {" "}
            <Link
              href="/tools/lethal-company/moons/"
              className="text-zinc-100 underline decoration-zinc-600 hover:decoration-zinc-200"
            >
              moons guide
            </Link>
            {" "}for lower-variance routes, and keep your ship-side workflow clean
            using the {" "}
            <Link
              href="/tools/lethal-company/terminal-commands/"
              className="text-zinc-100 underline decoration-zinc-600 hover:decoration-zinc-200"
            >
              terminal commands reference
            </Link>
            {" "}and use the {" "}
            <Link
              href="/tools/lethal-company/items/"
              className="text-zinc-100 underline decoration-zinc-600 hover:decoration-zinc-200"
            >
              items guide
            </Link>
            {" "}to avoid risky low-value carries. Want a quota plan that doesn’t collapse after one bad run? Use the {" "}
            <Link
              href="/tools/lethal-company/quota-calculator/"
              className="text-zinc-100 underline decoration-zinc-600 hover:decoration-zinc-200"
            >
              quota calculator
            </Link>
            .
          </p>
        </header>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5">
          <h2 className="text-lg font-semibold">How to use this bestiary</h2>
          <ul className="mt-3 space-y-2 text-sm text-zinc-300 list-disc pl-5">
            <li>
              Use threat level to set your run plan (roles, time budget, and
              when you should leave).
            </li>
            <li>
              Don’t memorize everything: remember 1 behavior cue + 1 survival
              rule per monster.
            </li>
            <li>
              When in doubt, pick extraction over exploration. Over-staying is
              how most wipes happen.
            </li>
          </ul>
        </section>

        <div className="mt-10 space-y-10">
          {sections.map((section) => (
            <section key={section.id} id={section.id} className="scroll-mt-20">
              <div
                className={`rounded-2xl border ${section.accent.border} bg-zinc-950/30 p-5`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <h2 className="text-2xl font-semibold tracking-tight">
                      {section.title}
                    </h2>
                    <p className="mt-2 text-sm text-zinc-400">
                      {section.monsters.length} monster
                      {section.monsters.length === 1 ? "" : "s"} in this tier.
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-mono ${section.accent.chip} ${section.accent.chipText}`}
                  >
                    {section.label}
                  </span>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-3">
                  {section.monsters.map((monster) => (
                    <article
                      key={`${section.id}:${monster.name}`}
                      className="rounded-2xl border border-zinc-800 bg-[#0a0a0a] p-5"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div>
                          <h3 className="text-lg font-semibold">
                            {monster.name}
                          </h3>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <span className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950/40 px-3 py-1 text-xs text-zinc-300">
                              {locationChip(monster.location)}
                            </span>
                            <span
                              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-mono ${section.accent.chip} ${section.accent.chipText}`}
                            >
                              {threatToCopy(monster.threat)}
                            </span>
                          </div>
                        </div>
                        <a
                          href={`#${section.id}`}
                          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                        >
                          #{section.id}
                        </a>
                      </div>

                      <div className="mt-4 grid grid-cols-1 gap-4">
                        <div>
                          <div className="text-xs font-mono text-zinc-500">
                            behavior
                          </div>
                          <p className="mt-1 text-sm text-zinc-200 leading-relaxed">
                            {monster.behavior}
                          </p>
                        </div>
                        <div>
                          <div className="text-xs font-mono text-zinc-500">
                            survival
                          </div>
                          <p className="mt-1 text-sm text-zinc-400 leading-relaxed">
                            {monster.survival}
                          </p>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </section>
          ))}
        </div>

        <section className="mt-12">
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
            __html: JSON.stringify(faqStructuredData),
          }}
        />
      </main>
    </div>
  );
}
