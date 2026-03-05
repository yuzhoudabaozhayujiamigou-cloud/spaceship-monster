import Link from "next/link";

type RelatedLink = {
  href: string;
  label: string;
};

export default function CalculatorCta({
  relatedLinks,
}: {
  relatedLinks: RelatedLink[];
}) {
  return (
    <section className="mt-10 rounded-2xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-zinc-950/60 p-6">
      <p className="text-xs font-mono uppercase tracking-wider text-emerald-200/90">
        Next Step
      </p>
      <h2 className="mt-2 text-2xl font-semibold tracking-tight">
        Run The Stardew Profit Calculator
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-300">
        Stop guessing crop economics. Compare seeds, processing paths, and season timing in one place, then apply the result to your current farm stage.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <Link
          href="/calculator"
          className="inline-flex items-center rounded-lg bg-emerald-300 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition-colors hover:bg-emerald-200"
        >
          Open /calculator
        </Link>
        <Link
          href="/presets"
          className="inline-flex items-center rounded-lg border border-zinc-700 bg-zinc-950/70 px-5 py-2.5 text-sm font-semibold text-zinc-100 transition-colors hover:bg-zinc-900"
        >
          View presets
        </Link>
      </div>

      <div className="mt-6 border-t border-zinc-800 pt-4">
        <div className="text-xs font-mono text-zinc-500">Related reads</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {relatedLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-flex items-center rounded-full border border-zinc-700 bg-[#0a0a0a] px-3 py-1.5 text-xs text-zinc-200 transition-colors hover:bg-zinc-900"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
