import Link from "next/link";

import { SATISFACTORY_TOOL_LINKS } from "../_data/satisfactory";

export default function SatisfactoryToolLinks({
  currentSlug,
  compact = false,
}: {
  currentSlug?: string;
  compact?: boolean;
}) {
  const links = SATISFACTORY_TOOL_LINKS.filter((link) => link.slug !== currentSlug);

  if (compact) {
    return (
      <div className="mt-5 flex flex-wrap gap-2">
        <Link
          href="/tools/satisfactory/"
          className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
        >
          Satisfactory Hub
        </Link>
        {links.map((link) => (
          <Link
            key={link.slug}
            href={link.href}
            className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
          >
            {link.name}
          </Link>
        ))}
      </div>
    );
  }

  return (
    <section className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
      <h2 className="text-2xl font-semibold tracking-tight">Related Satisfactory Tools</h2>
      <p className="mt-3 text-zinc-400 leading-relaxed">
        Switch between the calculators and map to move from planning to execution without losing
        your assumptions.
      </p>

      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/tools/satisfactory/"
          className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 hover:border-zinc-700"
        >
          <div className="text-sm font-semibold">Satisfactory Tools Hub</div>
          <p className="mt-2 text-sm text-zinc-400">
            Overview page with all five tools and quick routing.
          </p>
        </Link>

        {links.map((link) => (
          <Link
            key={link.slug}
            href={link.href}
            className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4 hover:border-zinc-700"
          >
            <div className="text-sm font-semibold">{link.name}</div>
            <p className="mt-2 text-sm text-zinc-400">{link.description}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
