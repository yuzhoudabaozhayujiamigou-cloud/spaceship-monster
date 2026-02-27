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
      name: "Lethal Company",
      description: "Quota calculator and more (coming soon).",
      href: "/tools/lethal-company/",
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
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 p-6">
      <main className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            ← Back to home
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-4">Tools</h1>
        <p className="text-zinc-400 mb-8">
          A collection of useful tools and utilities.
        </p>

        <div className="space-y-4">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="block rounded-xl border border-zinc-800 bg-zinc-950/40 p-5 hover:bg-zinc-950/60 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-lg">{tool.name}</h2>
                  <p className="text-sm text-zinc-400 mt-1">
                    {tool.description}
                  </p>
                </div>
                <span className="shrink-0 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono text-emerald-300">
                  NEW
                </span>
              </div>
            </Link>
          ))}

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/20 p-5">
            <h2 className="font-semibold text-lg">More coming soon...</h2>
            <p className="text-zinc-400 mt-1">
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
