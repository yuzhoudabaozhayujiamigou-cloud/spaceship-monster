import Link from "next/link";

import { buildMetadata } from "../../../_seo/metadata";
import { SITE } from "../../../_seo/site";

export const metadata = buildMetadata({
  title: `Lethal Company Quota Calculator | ${SITE.name}`,
  description:
    "Calculate remaining scrap needed to hit your Lethal Company quota target, factoring in sell ratio.",
  path: "/tools/lethal-company/quota-calculator",
});

export default function LethalCompanyQuotaCalculatorPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      <main className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              name: "Lethal Company Quota Calculator",
              url: `${SITE.url}/tools/lethal-company/quota-calculator`,
              applicationCategory: "Calculator",
              operatingSystem: "Web",
              description:
                "Calculator for remaining scrap needed to hit your Lethal Company quota target.",
              publisher: {
                "@type": "Organization",
                name: SITE.name,
                url: SITE.url,
              },
            }),
          }}
        />

        <div className="mb-8 flex items-center justify-between gap-3">
          <Link
            href="/tools/lethal-company/"
            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            ← Back to Lethal Company tools
          </Link>
          <div className="hidden sm:block text-xs font-mono text-zinc-500">
            v1.0
          </div>
        </div>

        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Lethal Company Quota Calculator
          </h1>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            Enter your quota target, current scrap value, and sell ratio to see
            how much more you need.
          </p>
        </header>

        <Calculator />

        <section className="mt-10 rounded-xl border border-zinc-800 bg-zinc-950/40 p-5">
          <h2 className="text-sm font-mono uppercase tracking-wider text-zinc-300">
            Notes
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-zinc-400 leading-relaxed">
            <li>
              Sell ratio is how much of collected scrap converts to quota value
              (e.g. 100% = full value).
            </li>
            <li>
              The calculator clamps sell ratio between 1% and 200% to avoid
              invalid inputs.
            </li>
          </ul>
        </section>
      </main>
    </div>
  );
}

function Calculator() {
  return (
    <div className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-950/70 to-zinc-950/30 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-mono uppercase tracking-wider text-amber-300/90">
              Live Calculator
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Real-time quota progress with terminal vibes.
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs font-mono text-zinc-500">STATUS</div>
            <div className="mt-1 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1 text-xs font-mono text-emerald-300">
              ONLINE
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field
            label="Quota target"
            hint="Required value"
            name="quota"
            defaultValue={130}
            min={0}
            step={1}
          />
          <Field
            label="Scrap collected"
            hint="Current value"
            name="collected"
            defaultValue={0}
            min={0}
            step={1}
          />
          <Field
            label="Sell ratio"
            hint="% value sold"
            name="ratio"
            defaultValue={100}
            min={1}
            max={200}
            step={1}
            suffix="%"
          />
        </div>

        <Result />
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  name,
  defaultValue,
  min,
  max,
  step,
  suffix,
}: {
  label: string;
  hint: string;
  name: string;
  defaultValue: number;
  min?: number;
  max?: number;
  step: number;
  suffix?: string;
}) {
  const inputId = `lc-${name}`;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
      <label htmlFor={inputId} className="block">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-sm font-medium text-zinc-200">{label}</span>
          <span className="text-xs font-mono text-zinc-500">{hint}</span>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <input
            id={inputId}
            name={name}
            type="number"
            inputMode="numeric"
            defaultValue={defaultValue}
            min={min}
            max={max}
            step={step}
            className="w-full rounded-lg border border-zinc-800 bg-[#0a0a0a] px-3 py-2 font-mono text-zinc-100 outline-none ring-0 placeholder:text-zinc-600 focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/15"
          />
          {suffix ? (
            <span className="shrink-0 text-xs font-mono text-zinc-500">
              {suffix}
            </span>
          ) : null}
        </div>
      </label>
    </div>
  );
}

function Result() {
  return (
    <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Readout label="Remaining needed" valueRef="remaining" accent="emerald" />
        <Readout label="Progress" valueRef="progress" accent="amber" />
        <Readout label="Effective sold" valueRef="effective" accent="zinc" />
      </div>

      <script
        // Small, dependency-free: reads inputs and updates readouts.
        dangerouslySetInnerHTML={{
          __html: `
(function () {
  var quotaEl = document.getElementById('lc-quota');
  var collectedEl = document.getElementById('lc-collected');
  var ratioEl = document.getElementById('lc-ratio');
  var remainingEl = document.querySelector('[data-lc-readout="remaining"]');
  var progressEl = document.querySelector('[data-lc-readout="progress"]');
  var effectiveEl = document.querySelector('[data-lc-readout="effective"]');

  function num(v) {
    var n = Number(v);
    return Number.isFinite(n) ? n : 0;
  }

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function fmtInt(value) {
    if (!Number.isFinite(value)) return '—';
    return new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(Math.round(value));
  }

  function update() {
    var quota = Math.max(0, num(quotaEl.value));
    var collected = Math.max(0, num(collectedEl.value));
    var ratio = clamp(num(ratioEl.value), 1, 200);

    var effectiveSold = collected * (ratio / 100);
    var remaining = Math.max(0, quota - effectiveSold);
    var progressPct = quota > 0 ? clamp((effectiveSold / quota) * 100, 0, 999) : 0;

    remainingEl.textContent = fmtInt(remaining);
    effectiveEl.textContent = fmtInt(effectiveSold);
    progressEl.textContent = progressPct.toFixed(0) + '%';
  }

  ['input', 'change'].forEach(function (evt) {
    quotaEl.addEventListener(evt, update);
    collectedEl.addEventListener(evt, update);
    ratioEl.addEventListener(evt, update);
  });

  update();
})();
`,
        }}
      />
    </div>
  );
}

function Readout({
  label,
  valueRef,
  accent,
}: {
  label: string;
  valueRef: string;
  accent: "emerald" | "amber" | "zinc";
}) {
  const accentClass =
    accent === "emerald"
      ? "text-emerald-300"
      : accent === "amber"
        ? "text-amber-300"
        : "text-zinc-200";

  return (
    <div className="rounded-lg border border-zinc-800 bg-[#0a0a0a] p-4">
      <div className="text-xs font-mono text-zinc-500">{label}</div>
      <div
        className={`mt-2 text-2xl font-mono tracking-tight ${accentClass}`}
        data-lc-readout={valueRef}
      >
        —
      </div>
    </div>
  );
}
