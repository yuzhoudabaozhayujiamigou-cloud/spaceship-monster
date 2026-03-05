"use client";

import { useMemo, useState } from "react";

export type TerminalCommandEntry = {
  id: string;
  command: string;
  category: string;
  source: "Core" | "Community/Modded";
  purpose: string;
  notes: string;
};

function normalize(value: string) {
  return value.toLowerCase().trim();
}

function toCopyBlock(commands: TerminalCommandEntry[]) {
  return commands.map((item) => item.command).join("\n");
}

export default function TerminalCommandsToolClient({
  commands,
}: {
  commands: TerminalCommandEntry[];
}) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [source, setSource] = useState<"All" | "Core" | "Community/Modded">("All");
  const [toast, setToast] = useState<string | null>(null);

  const categories = useMemo(
    () => ["All", ...new Set(commands.map((item) => item.category))],
    [commands],
  );

  const filtered = useMemo(() => {
    const q = normalize(query);
    return commands.filter((item) => {
      if (category !== "All" && item.category !== category) return false;
      if (source !== "All" && item.source !== source) return false;
      if (!q) return true;
      const haystack = normalize(
        `${item.command} ${item.category} ${item.purpose} ${item.notes} ${item.source}`,
      );
      return haystack.includes(q);
    });
  }, [category, commands, query, source]);

  async function copyText(value: string, successText: string) {
    try {
      await navigator.clipboard.writeText(value);
      setToast(successText);
    } catch {
      setToast("Copy failed");
    } finally {
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

      <section className="rounded-2xl border border-zinc-800 bg-zinc-950/30 p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div className="md:col-span-2">
            <div className="text-xs font-mono text-zinc-500">search</div>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search command, purpose, or notes..."
              className="mt-2 w-full rounded-xl border border-zinc-800 bg-[#0a0a0a] px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-zinc-600"
            />
          </div>
          <div>
            <div className="text-xs font-mono text-zinc-500">source</div>
            <div className="mt-2 flex flex-wrap gap-2">
              {(["All", "Core", "Community/Modded"] as const).map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setSource(opt)}
                  className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                    source === opt
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
                      : "border-zinc-800 bg-[#0a0a0a] text-zinc-300 hover:bg-zinc-950/60"
                  }`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="text-xs font-mono text-zinc-500">category</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {categories.map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => setCategory(opt)}
                className={`rounded-full border px-3 py-1 text-xs transition-colors ${
                  category === opt
                    ? "border-zinc-600 bg-zinc-900 text-zinc-100"
                    : "border-zinc-800 bg-[#0a0a0a] text-zinc-300 hover:bg-zinc-950/60"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-zinc-800 bg-zinc-950/60 p-3">
          <div className="text-xs text-zinc-400">
            Showing <span className="font-mono text-zinc-200">{filtered.length}</span> of{" "}
            <span className="font-mono text-zinc-200">{commands.length}</span> commands
          </div>
          <button
            type="button"
            onClick={() =>
              copyText(
                toCopyBlock(filtered),
                filtered.length ? "Copied filtered command list" : "No commands to copy",
              )
            }
            className="rounded-lg border border-zinc-700 bg-[#0a0a0a] px-3 py-2 text-xs font-mono text-zinc-200 hover:bg-zinc-950/70"
          >
            Copy filtered list
          </button>
        </div>
      </section>

      <section className="mt-6">
        <div className="grid grid-cols-1 gap-3">
          {filtered.map((item) => (
            <article
              key={item.id}
              id={item.id}
              className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="text-xs font-mono text-zinc-500">command</div>
                  <div className="mt-1 font-mono text-zinc-100">{item.command}</div>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-zinc-700 bg-zinc-900 px-2 py-1 text-[11px] text-zinc-300">
                      {item.category}
                    </span>
                    <span
                      className={`rounded-full border px-2 py-1 text-[11px] ${
                        item.source === "Core"
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
                          : "border-amber-500/30 bg-amber-500/10 text-amber-200"
                      }`}
                    >
                      {item.source}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => copyText(item.command, `Copied: ${item.command}`)}
                  className="rounded-lg border border-zinc-700 bg-[#0a0a0a] px-3 py-2 text-xs font-mono text-zinc-200 hover:bg-zinc-950/70"
                >
                  Copy
                </button>
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <div className="text-xs font-mono text-zinc-500">purpose</div>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-200">{item.purpose}</p>
                </div>
                <div>
                  <div className="text-xs font-mono text-zinc-500">notes</div>
                  <p className="mt-1 text-sm leading-relaxed text-zinc-400">{item.notes}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
