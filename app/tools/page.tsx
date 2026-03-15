import Link from "next/link";

import { buildMetadata } from "../_seo/metadata";
import { SITE } from "../_seo/site";

export const metadata = buildMetadata({
  title: `Tools | ${SITE.name}`,
  description: "Collection of useful tools and utilities.",
  path: "/tools",
});

export default function ToolsPage() {
  const tools = [
    {
      name: "UI Streaming Demo",
      description:
        "Structured event-stream rendering demo (init/block/patch/done) for interactive dashboard output.",
      href: "/tools/ui-streaming-demo",
    },
    {
      name: "SimpleClaw (OpenClaw one-click deploy)",
      description:
        "High-conversion landing page for deploying OpenClaw with reproducible, self-hosted defaults.",
      href: "/simpleclaw/",
    },
    {
      name: "Satisfactory Tools",
      description:
        "Production, power, logistics, building planner, and resource map for scalable factories.",
      href: "/tools/satisfactory/",
    },
    {
      name: "Satisfactory Production Calculator",
      description:
        "Calculate production chains, required raw resources, and machine counts per minute.",
      href: "/tools/satisfactory/production-calculator/",
    },
    {
      name: "Lethal Company",
      description: "Quota calculator, moons guide, terminal commands reference, and more.",
      href: "/tools/lethal-company/",
    },
    {
      name: "Lethal Company Moons Guide",
      description: "Moon tiers, risk factors, quick picks, and FAQ (version-agnostic).",
      href: "/tools/lethal-company/moons/",
    },
    {
      name: "Lethal Company Terminal Commands",
      description: "Categorized terminal commands reference with notes and TOC.",
      href: "/tools/lethal-company/terminal-commands/",
    },
    {
      name: "Palworld Tools",
      description:
        "Breeding calculator MVP live, plus planned paldeck explorer, IV checker, and path planner.",
      href: "/tools/palworld/",
    },
    {
      name: "Palworld Breeding Calculator (MVP)",
      description: "Searchable/filterable breeding combos with static placeholder data.",
      href: "/tools/palworld/breeding-calculator/",
    },
  ];

  const itemListStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: tools.map((tool, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: tool.name,
      url: `${SITE.url}${tool.href.replace(/\/$/, "")}`,
    })),
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6 text-zinc-100">
      <main className="mx-auto max-w-3xl">
        <div className="mb-8">
          <Link href="/" className="text-zinc-400 transition-colors hover:text-zinc-100">
            ← Back to home
          </Link>
        </div>

        <h1 className="mb-4 text-4xl font-bold">Tools</h1>
        <p className="mb-8 text-zinc-400">A collection of useful tools and utilities.</p>

        <div className="space-y-4">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="block rounded-xl border border-zinc-800 bg-zinc-950/40 p-5 transition-colors hover:bg-zinc-950/60"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">{tool.name}</h2>
                  <p className="mt-1 text-sm text-zinc-400">{tool.description}</p>
                </div>
                <span className="shrink-0 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono text-emerald-300">
                  NEW
                </span>
              </div>
            </Link>
          ))}

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/20 p-5">
            <h2 className="text-lg font-semibold">More coming soon...</h2>
            <p className="mt-1 text-zinc-400">
              We are working on building helpful tools for developers and creators.
            </p>
          </div>
        </div>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(itemListStructuredData),
          }}
        />
      </main>
    </div>
  );
}
