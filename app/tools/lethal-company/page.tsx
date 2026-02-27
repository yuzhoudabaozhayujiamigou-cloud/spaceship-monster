import Link from "next/link";

export const metadata = {
  title: "Lethal Company Tools | Spaceship Monster",
  description:
    "Handy Lethal Company tools: quota calculator now, more coming soon.",
};

const tools = [
  {
    title: "Quota Calculator",
    description:
      "Compute remaining scrap needed to hit quota (with sell ratio).",
    href: "/tools/lethal-company/quota-calculator/",
    status: "available" as const,
  },
  {
    title: "Moon Risk Analyzer",
    description: "Coming soon.",
    href: "#",
    status: "coming" as const,
  },
  {
    title: "Terminal Commands Reference",
    description: "Coming soon.",
    href: "#",
    status: "coming" as const,
  },
];

export default function LethalCompanyToolsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        <div className="mb-8">
          <Link
            href="/tools/"
            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            ← Back to Tools
          </Link>
        </div>

        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Lethal Company Tools
          </h1>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            Dark, fast utilities for quota runs. More tools soon.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4">
          {tools.map((tool) => (
            <div
              key={tool.title}
              className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold">{tool.title}</h2>
                  <p className="mt-2 text-sm text-zinc-400">
                    {tool.description}
                  </p>
                </div>

                {tool.status === "available" ? (
                  <span className="shrink-0 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono text-emerald-300">
                    AVAILABLE
                  </span>
                ) : (
                  <span className="shrink-0 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-mono text-amber-300">
                    COMING SOON
                  </span>
                )}
              </div>

              <div className="mt-4">
                {tool.status === "available" ? (
                  <Link
                    href={tool.href}
                    className="inline-flex items-center rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950 hover:bg-white transition-colors"
                  >
                    Open
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="cursor-not-allowed inline-flex items-center rounded-lg border border-zinc-800 bg-[#0a0a0a] px-4 py-2 text-sm font-medium text-zinc-500"
                    disabled
                  >
                    Coming soon
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
