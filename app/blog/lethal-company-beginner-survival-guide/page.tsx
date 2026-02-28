import Link from "next/link";

import { buildMetadata } from "../../_seo/metadata";
import { SITE } from "../../_seo/site";

export const metadata = buildMetadata({
  title: `Lethal Company Beginner Survival Guide: 10 Tips to Stop Dying | ${SITE.name}`,
  description:
    "New to Lethal Company? These 10 survival tips will keep you alive longer, help you hit quota, and stop your crew from wiping on day one.",
  path: "/blog/lethal-company-beginner-survival-guide",
});

type Tip = {
  id: string;
  title: string;
  kicker: string;
  body: string[];
  links?: { href: string; label: string }[];
};

type QuickRef = {
  situation: string;
  action: string;
  why: string;
};

type Faq = {
  question: string;
  answer: string;
};

const tips: Tip[] = [
  {
    id: "terminal",
    title: "Tip 1: Learn the Terminal Before You Land",
    kicker:
      "The terminal is your squad’s best defensive tool—if you can use it under pressure.",
    body: [
      "Most new crews treat the terminal like a weird minigame. Veterans treat it like the team’s air traffic control.",
      "If nobody can quickly route, check weather, or pull basic info, you waste time and end up over-staying inside.",
      "Before you drop, practice a tiny ‘ship routine’: check moon conditions, confirm the route, and know how to recover when someone gets lost.",
      "You don’t need to be a speedrunner—you just need to be faster than the chaos.",
    ],
    links: [
      {
        href: "/tools/lethal-company/terminal-commands/",
        label: "Terminal Commands Reference",
      },
    ],
  },
  {
    id: "time-budget",
    title: "Tip 2: Set a Time Budget and Stick to It",
    kicker:
      "The most common cause of death is greed: ‘one more room’ becomes a wipe.",
    body: [
      "Lethal Company punishes late-game tunnel vision. The longer you stay, the more problems stack: stamina management gets sloppy, comms degrade, and threats snowball.",
      "Set a simple budget before you enter: a hard ‘turnaround time’ and a ‘last call’ time. Make the call early, not when you’re already sprinting blind.",
      "If your crew is new, leave with less scrap but more consistency. A small, safe haul beats a heroic wipe.",
      "Rule of thumb: if two bad things happen back-to-back (lost teammate + new threat, or low stamina + confusing layout), you’re already in the danger zone—extract.",
    ],
  },
  {
    id: "roles",
    title: "Tip 3: Assign Roles",
    kicker:
      "Roles reduce panic. When everyone does everything, nobody does the important things.",
    body: [
      "A simple role split makes your run feel 10x calmer:",
      "Scout: moves light, checks rooms/paths, calls danger early. Doesn’t over-carry.",
      "Hauler: focuses on scrap movement, consolidates piles, keeps extraction tidy.",
      "Ship Operator: stays near ship when possible, monitors, relays info, coordinates exits.",
      "Rotate roles between days so everyone learns. The goal isn’t perfection—it’s clarity.",
    ],
  },
  {
    id: "monsters",
    title: "Tip 4: Know Your Monsters",
    kicker:
      "You don’t die because monsters are unfair—you die because you didn’t recognize the pattern fast enough.",
    body: [
      "New players often react to the *moment* (a sound, a shadow, a scream). Good crews react to the *type* of problem.",
      "Learn a few ‘instant recognition’ rules: what is silent and stalky, what is loud and charging, what is a timer, and what punishes being alone.",
      "Don’t aim to memorize everything. Aim to remember one behavior cue and one survival rule per monster.",
      "If you want one habit that saves runs: call threats early, even if you’re not 100% sure. False alarms cost seconds; late calls cost teammates.",
    ],
    links: [
      {
        href: "/tools/lethal-company/bestiary/",
        label: "Lethal Company Bestiary",
      },
    ],
  },
  {
    id: "moons",
    title: "Tip 5: Pick the Right Moon for Your Skill Level",
    kicker:
      "You don’t need the ‘best’ moon—you need the moon you can clear without panicking.",
    body: [
      "Beginners often chase high-value routes and then wonder why every day ends in a corpse pile.",
      "Pick lower-variance moons while learning: fewer ‘surprise’ layouts, cleaner extraction, and less time lost to confusion.",
      "Your moon choice should match your team’s current skill: if comms are messy, choose simpler runs. If hauling is slow, pick moons with safer returns.",
      "The fastest way to improve is to repeat a plan until it becomes routine—then move up in risk.",
    ],
    links: [{ href: "/tools/lethal-company/moons/", label: "Moons Guide" }],
  },
  {
    id: "exit-plan",
    title: "Tip 6: Always Have an Exit Plan",
    kicker:
      "If you can’t describe your exit in one sentence, you don’t have one.",
    body: [
      "The map becomes scarier when you’re carrying scrap. Make exits boring by planning them early.",
      "When you enter a new area, quickly note: nearest door, nearest long corridor, and the ‘safe’ route back to your last known landmark.",
      "Consolidate loot in a spot that’s on your return path, not deep in a dead-end. Your future self will thank you.",
      "When things go wrong, do not improvise three new turns. Backtrack to a known landmark, then choose.",
    ],
  },
  {
    id: "monitor",
    title: "Tip 7: Use the Ship Monitor",
    kicker: "Someone on the ship turns chaos into information.",
    body: [
      "Ship play looks ‘boring’ until it saves your run. A ship operator can do three high-impact things:",
      "Track teammate positions and call safe routes to the exit.",
      "Notice when two people drift apart and fix it before it becomes a rescue mission.",
      "Coordinate extraction timing so you’re not all sprinting outside at the worst moment.",
      "If you’re only two players, you can still do ‘half ship’: one person stays near entrance for quick comms while the other scouts deeper.",
    ],
  },
  {
    id: "sell-early",
    title: "Tip 8: Don’t Hoard – Sell Early, Sell Often",
    kicker: "Scrap in your ship is points. Scrap in your hands is risk.",
    body: [
      "Beginners hoard because selling feels like ‘giving up.’ In reality, selling is how you stabilize quota and reduce pressure.",
      "If you’re ahead of quota, you can play safer moons. If you’re behind, you can plan targeted runs instead of panic runs.",
      "Treat scrap like fuel: convert it into certainty whenever you can. A clean sell day makes the next days easier.",
      "The most painful wipe is dying while carrying a high-value item you could’ve banked earlier.",
    ],
  },
  {
    id: "sound-cues",
    title: "Tip 9: Sound Cues Save Lives",
    kicker:
      "The game warns you—quietly. Learn the language: footsteps, music, breathing.",
    body: [
      "If you play like it’s a shooter, you’ll miss the real info stream.",
      "Footsteps tell you distance and speed. Heavy, fast steps usually mean you should stop ‘looting’ and start ‘leaving.’",
      "Music and ambient shifts often signal escalation. Treat them as timers.",
      "Breathing, whispery cues, and sudden silence are not flavor. They’re the game telling you to regroup.",
      "Pro tip: in tense zones, talk less. Clear callouts beat constant chatter.",
    ],
  },
  {
    id: "quota-plan",
    title: "Tip 10: Plan Your Quota, Not Just Your Run",
    kicker:
      "A single good run doesn’t matter if you don’t have a quota plan for the whole cycle.",
    body: [
      "New teams obsess over today’s loot and ignore tomorrow’s math. That leads to risky desperation runs.",
      "Plan in chunks: what you want after Day 1, how much buffer you need, and when you’ll schedule a sell day.",
      "Once you know your target, you can choose safer moons and leave earlier—because you’re not guessing.",
      "Your goal isn’t ‘max scrap.’ Your goal is ‘hit quota with minimum wipe chance.’",
    ],
    links: [
      {
        href: "/tools/lethal-company/quota-calculator/",
        label: "Quota Calculator",
      },
    ],
  },
];

const quickRef: QuickRef[] = [
  {
    situation: "You hear fast footsteps in a tight corridor",
    action:
      "Stop looting. Group up. Move to a known landmark and pick an exit route.",
    why: "Speed + narrow space usually means you can’t outplay—only out-position.",
  },
  {
    situation: "Two teammates drift apart while carrying",
    action: "Call ‘pause’ and regroup before entering another room.",
    why: "Most wipes start as a rescue mission that snowballs.",
  },
  {
    situation: "You find high-value scrap early",
    action: "Consolidate it on the return path and bank it quickly.",
    why: "Scrap in ship is safety; scrap in hands is a future death.",
  },
  {
    situation: "Comms get messy and nobody knows where the exit is",
    action: "Ship operator calls a single rally point; everyone returns there.",
    why: "One clear instruction beats four conflicting plans.",
  },
  {
    situation: "You’re tempted to go ‘one more room’",
    action: "Check time budget. If you’re past it, leave—no debate.",
    why: "Greed is the #1 beginner killer.",
  },
  {
    situation: "Outdoor return feels unsafe",
    action: "Move quieter, take shorter bursts, and commit as a group.",
    why: "Outdoor threats punish noise, splitting, and long straight sprints.",
  },
];

const faqs: Faq[] = [
  {
    question: "What is the #1 survival rule for beginners?",
    answer:
      "Leave earlier than you think you should. Most beginner deaths happen late, when stamina is low, comms are messy, and the building feels like a maze.",
  },
  {
    question: "Should someone always stay on the ship?",
    answer:
      "If you have 3-4 players, yes—having a ship operator stabilizes runs. With 2 players, you can do a ‘soft ship’ approach where one person stays near the entrance and plays comms/monitor.",
  },
  {
    question: "How do we stop wiping when we’re carrying good loot?",
    answer:
      "Consolidate on the return path, bank early, and avoid deep dead-ends while heavy. Treat extraction as a phase with its own plan, not an afterthought.",
  },
  {
    question: "Do we need to memorize every monster?",
    answer:
      "No. Learn a few recognition patterns (stalker, charger, timer, sound-hunter) and one survival rule for each. You’ll improve faster than trying to memorize the whole bestiary.",
  },
  {
    question:
      "How do we get better at the terminal without feeling overwhelmed?",
    answer:
      "Practice a tiny pre-drop routine: check conditions, confirm route, and keep a simple comms style. You’re not trying to be fast—you’re trying to be consistent under pressure.",
  },
];

function chipTone(id: string) {
  if (id === "terminal") {
    return {
      ring: "ring-cyan-500/20",
      bg: "bg-cyan-500/10",
      text: "text-cyan-200",
      border: "border-cyan-900/50",
    };
  }
  if (id === "time-budget") {
    return {
      ring: "ring-amber-500/20",
      bg: "bg-amber-500/10",
      text: "text-amber-200",
      border: "border-amber-900/50",
    };
  }
  if (id === "roles") {
    return {
      ring: "ring-emerald-500/20",
      bg: "bg-emerald-500/10",
      text: "text-emerald-200",
      border: "border-emerald-900/50",
    };
  }
  if (id === "monsters") {
    return {
      ring: "ring-red-500/20",
      bg: "bg-red-500/10",
      text: "text-red-200",
      border: "border-red-900/50",
    };
  }
  if (id === "moons") {
    return {
      ring: "ring-indigo-500/20",
      bg: "bg-indigo-500/10",
      text: "text-indigo-200",
      border: "border-indigo-900/50",
    };
  }
  if (id === "exit-plan") {
    return {
      ring: "ring-zinc-500/20",
      bg: "bg-zinc-500/10",
      text: "text-zinc-200",
      border: "border-zinc-800",
    };
  }
  if (id === "monitor") {
    return {
      ring: "ring-fuchsia-500/20",
      bg: "bg-fuchsia-500/10",
      text: "text-fuchsia-200",
      border: "border-fuchsia-900/50",
    };
  }
  if (id === "sell-early") {
    return {
      ring: "ring-lime-500/20",
      bg: "bg-lime-500/10",
      text: "text-lime-200",
      border: "border-lime-900/50",
    };
  }
  if (id === "sound-cues") {
    return {
      ring: "ring-sky-500/20",
      bg: "bg-sky-500/10",
      text: "text-sky-200",
      border: "border-sky-900/50",
    };
  }
  return {
    ring: "ring-violet-500/20",
    bg: "bg-violet-500/10",
    text: "text-violet-200",
    border: "border-violet-900/50",
  };
}

export default function LethalCompanyBeginnerSurvivalGuidePage() {
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
      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <div className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[520px] overflow-hidden">
          <div className="absolute -top-24 left-1/2 h-[520px] w-[980px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.14),transparent_60%)] blur-2xl" />
          <div className="absolute -top-16 left-[10%] h-[320px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(244,114,182,0.10),transparent_60%)] blur-2xl" />
          <div className="absolute top-10 right-[6%] h-[260px] w-[420px] rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.10),transparent_60%)] blur-2xl" />
        </div>
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link
            href="/blog/"
            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            ← Back to Blog
          </Link>
          <div className="hidden sm:flex items-center gap-2 text-xs text-zinc-500">
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-zinc-700" />
            <span className="font-mono">spaceship.monster</span>
          </div>
        </div>

        <nav aria-label="Breadcrumb" className="mb-6">
          <ol className="flex flex-wrap items-center gap-2 text-sm text-zinc-500">
            <li>
              <Link href="/" className="hover:text-zinc-200 transition-colors">
                Home
              </Link>
            </li>
            <li className="text-zinc-700">/</li>
            <li>
              <Link
                href="/blog/"
                className="hover:text-zinc-200 transition-colors"
              >
                Blog
              </Link>
            </li>
            <li className="text-zinc-700">/</li>
            <li className="text-zinc-200">
              Lethal Company Beginner Survival Guide
            </li>
          </ol>
        </nav>

        <header className="mb-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950/40 px-3 py-1 text-xs text-zinc-400">
            <span className="font-mono text-zinc-300">LC</span>
            <span>Beginner survival</span>
          </div>

          <h1 className="mt-4 text-3xl sm:text-4xl font-semibold tracking-tight">
            Lethal Company Beginner Survival Guide: 10 Tips to Stop Dying
          </h1>

          <p className="mt-3 text-zinc-400 leading-relaxed">
            You drop in feeling confident, take five steps into the facility,
            and then—nothing. Your screen goes dark. A Bracken just deleted you
            before you even learned where the fire exit is. Welcome.
          </p>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            The cruel part is it often doesn’t feel like you made a mistake. It
            feels like the game is chaos. But once you learn what chaos
            *means*—time pressure, roles, audio cues, and clean exits—you start
            living longer. These 10 tips are the fastest path to “we make quota”
            instead of “we wipe on day one.”
          </p>
        </header>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5">
          <h2 className="text-lg font-semibold">The 10-tip mindset</h2>
          <ul className="mt-3 space-y-2 text-sm text-zinc-300 list-disc pl-5">
            <li>Survival is a system: time budget + roles + exits.</li>
            <li>
              Information beats bravery: monitor + sound cues + early calls.
            </li>
            <li>Bank value early: scrap in ship is points you can’t lose.</li>
          </ul>
        </section>

        <section className="mt-10">
          <h2 className="text-2xl font-semibold tracking-tight">10 Tips</h2>
          <div className="mt-5 space-y-4">
            {tips.map((tip, index) => {
              const tone = chipTone(tip.id);
              return (
                <article
                  key={tip.id}
                  id={tip.id}
                  className={`scroll-mt-20 rounded-2xl border ${tone.border} bg-[#0a0a0a] p-5`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-mono ${tone.bg} ${tone.text} ring-1 ${tone.ring}`}
                        >
                          tip {String(index + 1).padStart(2, "0")}
                        </span>
                        <a
                          href={`#${tip.id}`}
                          className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                        >
                          #{tip.id}
                        </a>
                      </div>
                      <h3 className="mt-3 text-xl font-semibold tracking-tight">
                        {tip.title}
                      </h3>
                      <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                        {tip.kicker}
                      </p>
                    </div>
                    <div className="shrink-0">
                      <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 px-3 py-2">
                        <div className="text-[11px] font-mono text-zinc-500">
                          remember
                        </div>
                        <div className="mt-1 text-xs text-zinc-200">
                          {tip.id === "time-budget"
                            ? "Greed kills. Leave on schedule."
                            : tip.id === "terminal"
                              ? "Terminal = speed + info."
                              : tip.id === "roles"
                                ? "Roles reduce panic."
                                : tip.id === "monsters"
                                  ? "Recognize pattern, not panic."
                                  : tip.id === "moons"
                                    ? "Pick consistency over hype."
                                    : tip.id === "exit-plan"
                                      ? "Exit in one sentence."
                                      : tip.id === "monitor"
                                        ? "Ship = information."
                                        : tip.id === "sell-early"
                                          ? "Bank value early."
                                          : tip.id === "sound-cues"
                                            ? "Listen like it’s a radar."
                                            : "Plan quota, reduce risk."}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 space-y-3">
                    {tip.body.map((p) => (
                      <p
                        key={`${tip.id}:${p.slice(0, 24)}`}
                        className="text-sm text-zinc-300 leading-relaxed"
                      >
                        {p}
                      </p>
                    ))}
                  </div>

                  {tip.links && tip.links.length > 0 ? (
                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      {tip.links.map((l) => (
                        <Link
                          key={`${tip.id}:${l.href}`}
                          href={l.href}
                          className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950/40 px-4 py-2 text-sm text-zinc-100 hover:bg-zinc-950/70 transition-colors"
                        >
                          {l.label} →
                        </Link>
                      ))}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-12">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">
                Quick Reference
              </h2>
              <p className="mt-2 text-sm text-zinc-400 leading-relaxed">
                When your brain goes blank mid-run, use this as a tiny decision
                engine: situation → action → why.
              </p>
            </div>
            <div className="text-xs text-zinc-500 font-mono">
              built for panic moments
            </div>
          </div>

          <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4 sm:p-5">
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs font-mono text-zinc-500 px-1">
              <div className="sm:col-span-4">situation</div>
              <div className="sm:col-span-5">what to do</div>
              <div className="sm:col-span-3">why it works</div>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3">
              {quickRef.map((row) => (
                <div
                  key={row.situation}
                  className="rounded-2xl border border-zinc-800 bg-[#0a0a0a] p-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-4">
                      <div className="text-xs font-mono text-zinc-500">
                        situation
                      </div>
                      <div className="mt-1 text-sm text-zinc-200 leading-relaxed">
                        {row.situation}
                      </div>
                    </div>
                    <div className="sm:col-span-5">
                      <div className="text-xs font-mono text-zinc-500">
                        what to do
                      </div>
                      <div className="mt-1 text-sm text-zinc-300 leading-relaxed">
                        {row.action}
                      </div>
                    </div>
                    <div className="sm:col-span-3">
                      <div className="text-xs font-mono text-zinc-500">why</div>
                      <div className="mt-1 text-sm text-zinc-400 leading-relaxed">
                        {row.why}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

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

          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(faqStructuredData),
            }}
          />
        </section>

        <footer className="mt-12">
          <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <div className="text-xs font-mono text-zinc-500">next</div>
                <div className="mt-1 text-sm text-zinc-300">
                  Keep improving: tools make good habits easier.
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/blog/"
                  className="inline-flex items-center rounded-full border border-zinc-800 bg-[#0a0a0a] px-4 py-2 text-sm text-zinc-100 hover:bg-zinc-950/70 transition-colors"
                >
                  Back to Blog
                </Link>
                <Link
                  href="/tools/lethal-company/"
                  className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950/40 px-4 py-2 text-sm text-zinc-100 hover:bg-zinc-950/70 transition-colors"
                >
                  Lethal Company Tools →
                </Link>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <Link
                href="/tools/lethal-company/terminal-commands/"
                className="rounded-2xl border border-zinc-800 bg-[#0a0a0a] p-4 hover:bg-zinc-950/70 transition-colors"
              >
                <div className="text-xs font-mono text-zinc-500">tool</div>
                <div className="mt-1 text-sm font-semibold">
                  Terminal Commands
                </div>
                <div className="mt-1 text-sm text-zinc-400">
                  Ship-side speed and clean workflows.
                </div>
              </Link>
              <Link
                href="/tools/lethal-company/bestiary/"
                className="rounded-2xl border border-zinc-800 bg-[#0a0a0a] p-4 hover:bg-zinc-950/70 transition-colors"
              >
                <div className="text-xs font-mono text-zinc-500">tool</div>
                <div className="mt-1 text-sm font-semibold">Bestiary</div>
                <div className="mt-1 text-sm text-zinc-400">
                  Learn patterns fast, stop panic deaths.
                </div>
              </Link>
              <Link
                href="/tools/lethal-company/moons/"
                className="rounded-2xl border border-zinc-800 bg-[#0a0a0a] p-4 hover:bg-zinc-950/70 transition-colors"
              >
                <div className="text-xs font-mono text-zinc-500">tool</div>
                <div className="mt-1 text-sm font-semibold">Moons</div>
                <div className="mt-1 text-sm text-zinc-400">
                  Choose the right risk for your squad.
                </div>
              </Link>
            </div>

            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
              <Link
                href="/tools/lethal-company/quota-calculator/"
                className="rounded-2xl border border-zinc-800 bg-[#0a0a0a] p-4 hover:bg-zinc-950/70 transition-colors"
              >
                <div className="text-xs font-mono text-zinc-500">tool</div>
                <div className="mt-1 text-sm font-semibold">
                  Quota Calculator
                </div>
                <div className="mt-1 text-sm text-zinc-400">
                  Plan the whole cycle, not just today’s loot.
                </div>
              </Link>
              <div className="rounded-2xl border border-zinc-800 bg-[#0a0a0a] p-4">
                <div className="text-xs font-mono text-zinc-500">
                  breadcrumb
                </div>
                <div className="mt-1 text-sm text-zinc-300">
                  Home / Blog / Beginner Survival Guide
                </div>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
