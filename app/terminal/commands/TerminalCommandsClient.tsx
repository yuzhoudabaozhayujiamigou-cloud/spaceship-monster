"use client";

import { useMemo, useState } from "react";

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

function normalize(s: string) {
  return s.toLowerCase().trim();
}

function buildCommandText(cmd: Command) {
  const parts = [cmd.name, cmd.what, cmd.example, cmd.when, cmd.category];
  if (cmd.shortcuts.length) parts.push(cmd.shortcuts.join(" "));
  return normalize(parts.join(" | "));
}

function copyBlock(commands: string[]) {
  return commands.join("\n");
}

export default function TerminalCommandsClient({
  commands,
  workflows,
}: {
  commands: Command[];
  workflows: Workflow[];
}) {
  const [query, setQuery] = useState("");
  const [cat, setCat] = useState<CommandCategory | "All">("All");
  const [toast, setToast] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = normalize(query);
    return commands.filter((c) => {
      if (cat !== "All" && c.category !== cat) return false;
      if (!q) return true;
      return buildCommandText(c).includes(q);
    });
  }, [commands, query, cat]);

  const categories: Array<CommandCategory | "All"> = [
    "All",
    "Routing",
    "Store",
    "Scan",
    "Ship",
    "Other",
  ];

  async function copyToClipboard(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setToast("Copied!");
      window.setTimeout(() => setToast(null), 1800);
    } catch {
      setToast("Copy failed");
      window.setTimeout(() => setToast(null), 1800);
    }
  }

  return (
    <>
      {toast ? (
        <div className="fixed left-1/2 top-5 z-50 -translate-x-1/2 rounded-full border border-zinc-700 bg-zinc-950/90 px-4 py-2 text-xs font-mono text-zinc-100 shadow-lg">
          {toast}
        </div>
      ) : null}
      <section className="mb-8 rounded-2xl border border-zinc-800 bg-zinc-950/30 p-5">
        <div className="flex flex-col sm:flex-row sm:items-end gap-4">
          <div className="flex-1">
            <div className="text-xs font-mono text-zinc-500">search</div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search commands, shortcuts, examples…"
              className="mt-2 w-full rounded-xl border border-zinc-800 bg-[#0a0a0a] px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-zinc-600"
            />
          </div>
          <div>
            <div className="text-xs font-mono text-zinc-500">filter</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {categories.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCat(c)}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    cat === c
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                      : "border-zinc-800 bg-[#0a0a0a] text-zinc-300 hover:bg-zinc-950/60"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl font-semibold">Copy-paste workflows</h2>
          <span className="text-xs text-zinc-500">Click to copy</span>
        </div>
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-3 gap-3">
          {workflows.map((wf) => (
            <button
              key={wf.title}
              type="button"
              onClick={() =>
                copyToClipboard(copyBlock(wf.steps.flatMap((s) => s.commands)))
              }
              className="text-left rounded-2xl border border-zinc-800 bg-zinc-950/30 p-5 hover:bg-zinc-950/50 transition-colors"
            >
              <div className="text-sm font-semibold">{wf.title}</div>
              <div className="mt-1 text-xs text-zinc-400">{wf.goal}</div>
              <div className="mt-4 space-y-2">
                {wf.steps.map((s) => (
                  <div key={s.label} className="text-xs">
                    <div className="text-zinc-500 font-mono">{s.label}</div>
                    <div className="mt-1 rounded-xl border border-zinc-800 bg-[#0a0a0a] px-3 py-2 font-mono text-zinc-200 whitespace-pre-wrap">
                      {copyBlock(s.commands)}
                    </div>
                  </div>
                ))}
              </div>
            </button>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-xl font-semibold">Full command list</h2>
          <span className="text-xs text-zinc-500">{filtered.length} results</span>
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3">
          {filtered.map((item) => (
            <div
              key={item.name}
              className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <div className="text-xs font-mono text-zinc-500">command</div>
                  <div className="mt-1 font-mono text-zinc-100">{item.name}</div>
                  {item.shortcuts.length ? (
                    <div className="mt-2 text-xs text-zinc-400">
                      Shortcuts:{" "}
                      <span className="font-mono">
                        {item.shortcuts.join(", ")}
                      </span>
                    </div>
                  ) : null}
                </div>
                <div className="text-xs text-zinc-500">{item.category}</div>
              </div>

              <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="text-xs font-mono text-zinc-500">what it does</div>
                  <p className="mt-1 text-sm text-zinc-200 leading-relaxed">
                    {item.what}
                  </p>
                </div>
                <div>
                  <div className="text-xs font-mono text-zinc-500">when to use</div>
                  <p className="mt-1 text-sm text-zinc-400 leading-relaxed">
                    {item.when}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <div className="text-xs font-mono text-zinc-500">example</div>
                <div className="mt-1 rounded-xl border border-zinc-800 bg-[#0a0a0a] px-3 py-2 font-mono text-zinc-200 whitespace-pre-wrap">
                  {item.example}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
