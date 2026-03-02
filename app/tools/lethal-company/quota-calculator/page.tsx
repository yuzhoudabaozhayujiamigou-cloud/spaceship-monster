import Link from "next/link";

import { buildMetadata } from "../../../_seo/metadata";
import { SITE } from "../../../_seo/site";

export const metadata = buildMetadata({
  title: `Lethal Company Quota Calculator | ${SITE.name}`,
  description:
    "Estimate how much scrap value you need to sell to safely hit quota, with presets and per-day planning.",
  path: "/tools/lethal-company/quota-calculator",
});

type ScrapPreset = "low" | "avg" | "high" | "custom";

type RiskPreset = "conservative" | "balanced" | "aggressive";

const SCRAP_PRESETS: Record<Exclude<ScrapPreset, "custom">, number> = {
  low: 250,
  avg: 400,
  high: 600,
};

const RISK_PRESETS: Record<RiskPreset, { label: string; bufferPercent: number; scrapPerRun: number }> = {
  conservative: { label: "Conservative", bufferPercent: 25, scrapPerRun: 350 },
  balanced: { label: "Balanced", bufferPercent: 15, scrapPerRun: 400 },
  aggressive: { label: "Aggressive", bufferPercent: 5, scrapPerRun: 500 },
};

export default function LethalCompanyQuotaCalculatorPage() {
  const jsonLdWebApp = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Lethal Company Quota Calculator",
    url: `${SITE.url}/tools/lethal-company/quota-calculator`,
    applicationCategory: "Calculator",
    operatingSystem: "Web",
    description:
      "Plan how much scrap value you need to sell to safely hit quota, with presets and per-day planning.",
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "Does quota count items on the ship, or only what you sell?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Quota progress is based on sold value. Items sitting on the ship don’t count toward quota until you sell them at the Company.",
        },
      },
      {
        "@type": "Question",
        name: "How much buffer should I keep above quota?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A common rule is +10% to +25%. If your runs are risky or inconsistent, a larger buffer helps absorb bad luck and wipes.",
        },
      },
      {
        "@type": "Question",
        name: "What’s a good scrap-per-run number to enter?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Use the presets (low/average/high) as a starting point, then adjust after 1–2 runs based on your team and moon difficulty.",
        },
      },
      {
        "@type": "Question",
        name: "Is this calculator accurate for modded games?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "It’s designed around vanilla assumptions, but it still works for modded runs if you set an appropriate scrap-per-run and buffer.",
        },
      },
      {
        "@type": "Question",
        name: "Should I sell early or wait until the last day?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "If you’re unsure you’ll hit quota, selling earlier can reduce end-of-cycle panic. If you’re comfortably above target, you can choose a sell timing that matches your risk tolerance.",
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100">
      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebApp) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }}
        />

        <div className="mb-8 flex items-center justify-between gap-3">
          <Link
            href="/tools/lethal-company/"
            className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            ← Back to Lethal Company tools
          </Link>
          <div className="hidden sm:block text-xs font-mono text-zinc-500">v2.0</div>
        </div>

        <header className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Lethal Company Quota Calculator (Vanilla)
          </h1>
          <p className="mt-3 text-zinc-400 leading-relaxed">
            Estimate how much scrap value you need to sell to safely clear quota.
            Includes buffer presets, runs-per-day pacing, and a copyable plan you can share with your team.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <a
              href="#calculator"
              className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
            >
              Jump to calculator
            </a>
            <Link
              href="/tools/lethal-company/terminal-commands"
              className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
            >
              Terminal commands
            </Link>
            <Link
              href="/guides/profit-quota-formula"
              className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
            >
              Quota formula (guide)
            </Link>
            <Link
              href="/tools/lethal-company/moons"
              className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
            >
              Moons & risk notes
            </Link>
            <Link
              href="/tools/lethal-company/bestiary"
              className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
            >
              Bestiary
            </Link>
          </div>
        </header>

        <QuotaCalculator />

        <section className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-xl font-semibold">Result Explanation</h2>
          <div className="mt-3 space-y-3 text-sm text-zinc-400 leading-relaxed">
            <p>
              This calculator gives you a simple plan: how much total value to sell
              (including a safety buffer), how many runs that might take, and how
              many runs per day you should aim for.
            </p>
            <p>
              Quota progress is based on <span className="text-zinc-200">sold value</span>.
              Items sitting on the ship don’t complete quota until you sell them at
              the Company.
            </p>
            <p>
              The buffer helps absorb failed runs, bad RNG, weather, and team wipes.
              If your runs are inconsistent, increase buffer or use the Conservative preset.
            </p>
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-xl font-semibold">FAQ</h2>
          <div className="mt-4 space-y-4">
            <FaqItem
              q="Does quota count items on the ship, or only what you sell?"
              a="Quota progress is based on sold value. Items sitting on the ship don’t count until you sell them."
            />
            <FaqItem
              q="How much buffer should I keep above quota?"
              a="Usually +10% to +25%. If your runs are risky or inconsistent, keep more buffer."
            />
            <FaqItem
              q="What’s a good scrap-per-run number to enter?"
              a="Start with low/average/high presets, then adjust after 1–2 runs based on your team and moon difficulty."
            />
            <FaqItem
              q="Is this calculator accurate for modded games?"
              a="It’s built for vanilla assumptions, but it still works if you set an appropriate scrap-per-run and buffer."
            />
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6">
          <h2 className="text-xl font-semibold">Related tools</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <RelatedCard
              title="Terminal Commands"
              desc="Command list, examples, and gotchas."
              href="/tools/lethal-company/terminal-commands"
            />
            <RelatedCard
              title="Moons (coming soon)"
              desc="Moon tiers, risk notes, and quick picks."
              href="/tools/lethal-company"
            />
          </div>
        </section>
      </main>
    </div>
  );
}

function QuotaCalculator() {
  return (
    <section
      id="calculator"
      className="rounded-2xl border border-zinc-800 bg-gradient-to-b from-zinc-950/70 to-zinc-950/30 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]"
    >
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-sm font-mono uppercase tracking-wider text-amber-300/90">
              Live Calculator
            </h2>
            <p className="mt-2 text-sm text-zinc-400">
              Fast planning with presets, buffer, and per-day pacing.
            </p>
          </div>
          <div className="text-right">
            <div className="text-xs font-mono text-zinc-500">STATUS</div>
            <div className="mt-1 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1 text-xs font-mono text-emerald-300">
              ONLINE
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="text-xs font-mono text-zinc-500">QUICK PRESETS</div>
          <div className="mt-2 flex flex-wrap gap-2">
            {(
              [
                ["conservative", RISK_PRESETS.conservative],
                ["balanced", RISK_PRESETS.balanced],
                ["aggressive", RISK_PRESETS.aggressive],
              ] as const
            ).map(([key, preset]) => (
              <button
                key={key}
                type="button"
                className="rounded-full border border-zinc-800 bg-zinc-950 px-3 py-1.5 text-xs font-mono text-zinc-200 hover:border-zinc-700"
                data-lc-risk-preset={key}
                data-lc-buffer={preset.bufferPercent}
                data-lc-scrap={preset.scrapPerRun}
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Field label="Quota target" hint="Required value" name="quotaTarget" defaultValue={520} min={0} step={1} />
          <Field label="Days remaining" hint="Including today" name="daysRemaining" defaultValue={3} min={1} step={1} />
          <SelectField
            label="Team size"
            hint="Solo / 2 / 3 / 4"
            name="teamSize"
            defaultValue="4"
            options={[
              { value: "1", label: "Solo" },
              { value: "2", label: "2" },
              { value: "3", label: "3" },
              { value: "4", label: "4" },
            ]}
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SelectField
            label="Scrap per run"
            hint="Preset or custom"
            name="scrapPreset"
            defaultValue="avg"
            options={[
              { value: "low", label: `Low (~${SCRAP_PRESETS.low})` },
              { value: "avg", label: `Average (~${SCRAP_PRESETS.avg})` },
              { value: "high", label: `High (~${SCRAP_PRESETS.high})` },
              { value: "custom", label: "Custom" },
            ]}
          />
          <Field
            label="Custom scrap/run"
            hint="Only if Custom"
            name="scrapCustom"
            defaultValue={400}
            min={0}
            step={1}
          />
          <Field
            label="Risk buffer"
            hint="% above quota"
            name="bufferPercent"
            defaultValue={15}
            min={0}
            max={50}
            step={1}
            suffix="%"
          />
        </div>

        <Result />

        <div className="mt-6 flex flex-col gap-3 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-zinc-400">
            Shareable plan is generated live. Use it for quick team alignment — then adjust based on your moon choice.
            <div className="mt-2 flex flex-wrap gap-2">
              <Link
                href="/tools/lethal-company/terminal-commands"
                className="text-zinc-100 underline decoration-zinc-600 hover:decoration-zinc-300"
              >
                Terminal commands
              </Link>
              <span className="text-zinc-600">·</span>
              <Link
                href="/tools/lethal-company/moons"
                className="text-zinc-100 underline decoration-zinc-600 hover:decoration-zinc-300"
              >
                Moons
              </Link>
              <span className="text-zinc-600">·</span>
              <Link
                href="/tools/lethal-company/bestiary"
                className="text-zinc-100 underline decoration-zinc-600 hover:decoration-zinc-300"
              >
                Bestiary
              </Link>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
              data-lc-copy
            >
              Copy plan
            </button>
            <button
              type="button"
              className="rounded-full border border-zinc-800 bg-zinc-950 px-4 py-2 text-sm text-zinc-100 hover:border-zinc-700"
              data-lc-copy-link
            >
              Copy link
            </button>
          </div>
        </div>

        <p className="mt-3 text-xs text-zinc-500">
          Notes: This is a planning tool. Real results vary by moon difficulty, RNG, and team execution.
        </p>
      </div>
    </section>
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
            <span className="shrink-0 text-xs font-mono text-zinc-500">{suffix}</span>
          ) : null}
        </div>
      </label>
    </div>
  );
}

function SelectField({
  label,
  hint,
  name,
  defaultValue,
  options,
}: {
  label: string;
  hint: string;
  name: string;
  defaultValue: string;
  options: Array<{ value: string; label: string }>;
}) {
  const inputId = `lc-${name}`;

  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
      <label htmlFor={inputId} className="block">
        <div className="flex items-baseline justify-between gap-2">
          <span className="text-sm font-medium text-zinc-200">{label}</span>
          <span className="text-xs font-mono text-zinc-500">{hint}</span>
        </div>

        <div className="mt-3">
          <select
            id={inputId}
            name={name}
            defaultValue={defaultValue}
            className="w-full rounded-lg border border-zinc-800 bg-[#0a0a0a] px-3 py-2 font-mono text-zinc-100 outline-none ring-0 focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/15"
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </label>
    </div>
  );
}

function Result() {
  return (
    <div className="mt-6 rounded-xl border border-zinc-800 bg-zinc-950/60 p-5">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
        <Readout label="Buffer" valueRef="buffer" accent="zinc" />
        <Readout label="Total to sell" valueRef="total" accent="amber" />
        <Readout label="Runs needed" valueRef="runs" accent="emerald" />
        <Readout label="Runs/day" valueRef="perday" accent="emerald" />
        <Readout label="Status" valueRef="status" accent="zinc" />
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
(function () {
  var quotaEl = document.getElementById('lc-quotaTarget');
  var daysEl = document.getElementById('lc-daysRemaining');
  var teamEl = document.getElementById('lc-teamSize');
  var presetEl = document.getElementById('lc-scrapPreset');
  var scrapCustomEl = document.getElementById('lc-scrapCustom');
  var bufferEl = document.getElementById('lc-bufferPercent');

  var readoutBuffer = document.querySelector('[data-lc-readout="buffer"]');
  var readoutTotal = document.querySelector('[data-lc-readout="total"]');
  var readoutRuns = document.querySelector('[data-lc-readout="runs"]');
  var readoutPerDay = document.querySelector('[data-lc-readout="perday"]');
  var readoutStatus = document.querySelector('[data-lc-readout="status"]');

  var copyBtn = document.querySelector('[data-lc-copy]');

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

  function getScrapPerRun() {
    var preset = String(presetEl.value || 'avg');
    if (preset === 'custom') return Math.max(0, num(scrapCustomEl.value));
    if (preset === 'low') return 250;
    if (preset === 'high') return 600;
    return 400;
  }

  function updateCustomVisibility() {
    var preset = String(presetEl.value || 'avg');
    var wrapper = scrapCustomEl && scrapCustomEl.closest('div');
    if (!wrapper) return;
    if (preset === 'custom') {
      wrapper.style.opacity = '1';
      scrapCustomEl.removeAttribute('disabled');
    } else {
      wrapper.style.opacity = '0.45';
      scrapCustomEl.setAttribute('disabled', 'true');
    }
  }

  function compute() {
    var quota = Math.max(0, num(quotaEl.value));
    var days = Math.max(1, Math.floor(num(daysEl.value)));
    var bufferPct = clamp(num(bufferEl.value), 0, 50);
    var scrapPerRun = Math.max(0, getScrapPerRun());

    var bufferValue = Math.ceil(quota * (bufferPct / 100));
    var totalToSell = quota + bufferValue;
    var runsNeeded = scrapPerRun > 0 ? Math.ceil(totalToSell / scrapPerRun) : 0;
    var runsPerDay = Math.ceil(runsNeeded / days);

    var status = '';
    if (days === 1) status = 'Last day: consider more buffer.';
    else if (runsPerDay > 3) status = 'High pace: increase value/run or risk.';
    else status = 'Plan looks doable.';

    return {
      quota: quota,
      days: days,
      bufferPct: bufferPct,
      scrapPerRun: scrapPerRun,
      bufferValue: bufferValue,
      totalToSell: totalToSell,
      runsNeeded: runsNeeded,
      runsPerDay: runsPerDay,
      status: status,
    };
  }

  function render() {
    updateCustomVisibility();
    var r = compute();
    readoutBuffer.textContent = fmtInt(r.bufferValue);
    readoutTotal.textContent = fmtInt(r.totalToSell);
    readoutRuns.textContent = r.scrapPerRun > 0 ? String(r.runsNeeded) : '—';
    readoutPerDay.textContent = r.scrapPerRun > 0 ? String(r.runsPerDay) : '—';
    readoutStatus.textContent = r.status;

    if (copyBtn) {
      copyBtn.dataset.plan = 'Sell about ' + fmtInt(r.totalToSell) + ' total (quota ' + fmtInt(r.quota) + ' + ' + r.bufferPct + '% buffer). ' +
        'At ~' + fmtInt(r.scrapPerRun) + '/run, that\'s ~' + r.runsNeeded + ' runs (~' + r.runsPerDay + '/day for ' + r.days + ' days).';
    }

    // Apply query params (shareable link) once on load.
    if (!render._lcInit) {
      render._lcInit = true;
      try {
        var params = new URLSearchParams(window.location.search);
        var quotaQ = params.get('quota');
        var daysQ = params.get('days');
        var bufferQ = params.get('buffer');
        var sprQ = params.get('spr');

        if (quotaQ != null && quotaQ !== '') quotaEl.value = String(Math.max(0, num(quotaQ)));
        if (daysQ != null && daysQ !== '') daysEl.value = String(Math.max(1, Math.floor(num(daysQ))));
        if (bufferQ != null && bufferQ !== '') bufferEl.value = String(clamp(num(bufferQ), 0, 50));
        if (sprQ != null && sprQ !== '') {
          presetEl.value = 'custom';
          scrapCustomEl.value = String(Math.max(0, Math.round(num(sprQ))));
        }
      } catch (e) {
        // best effort
      }

      // re-render after applying query params
      var r2 = compute();
      readoutBuffer.textContent = fmtInt(r2.bufferValue);
      readoutTotal.textContent = fmtInt(r2.totalToSell);
      readoutRuns.textContent = r2.scrapPerRun > 0 ? String(r2.runsNeeded) : '—';
      readoutPerDay.textContent = r2.scrapPerRun > 0 ? String(r2.runsPerDay) : '—';
      readoutStatus.textContent = r2.status;

      if (copyBtn) {
        copyBtn.dataset.plan = 'Sell about ' + fmtInt(r2.totalToSell) + ' total (quota ' + fmtInt(r2.quota) + ' + ' + r2.bufferPct + '% buffer). ' +
          'At ~' + fmtInt(r2.scrapPerRun) + '/run, that\'s ~' + r2.runsNeeded + ' runs (~' + r2.runsPerDay + '/day for ' + r2.days + ' days).';
      }
    }
  }

  function applyPreset(btn) {
    var buffer = btn.getAttribute('data-lc-buffer');
    var scrap = btn.getAttribute('data-lc-scrap');
    if (buffer != null) bufferEl.value = String(buffer);
    if (scrap != null) {
      presetEl.value = 'custom';
      scrapCustomEl.value = String(scrap);
    }
    render();
  }

  document.querySelectorAll('[data-lc-risk-preset]').forEach(function (btn) {
    btn.addEventListener('click', function () { applyPreset(btn); });
  });

  ['input', 'change'].forEach(function (evt) {
    quotaEl.addEventListener(evt, render);
    daysEl.addEventListener(evt, render);
    teamEl.addEventListener(evt, render);
    presetEl.addEventListener(evt, render);
    scrapCustomEl.addEventListener(evt, render);
    bufferEl.addEventListener(evt, render);
  });

  var copyLinkBtn = document.querySelector('[data-lc-copy-link]');

  async function copyWithFeedback(btn, text, okLabel, failLabel, resetLabel) {
    try {
      await navigator.clipboard.writeText(text);
      btn.textContent = okLabel;
      setTimeout(function(){ btn.textContent = resetLabel; }, 1200);
    } catch (e) {
      btn.textContent = failLabel;
      setTimeout(function(){ btn.textContent = resetLabel; }, 1200);
    }
  }

  if (copyBtn) {
    copyBtn.addEventListener('click', async function () {
      var text = copyBtn.dataset.plan || '';
      await copyWithFeedback(copyBtn, text, 'Copied!', 'Copy failed', 'Copy plan');
    });
  }

  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', async function () {
      var r = compute();
      var url = new URL(window.location.href);
      url.searchParams.set('quota', String(r.quota));
      url.searchParams.set('days', String(r.days));
      url.searchParams.set('buffer', String(r.bufferPct));
      url.searchParams.set('spr', String(Math.round(r.scrapPerRun)));
      await copyWithFeedback(copyLinkBtn, url.toString(), 'Link copied!', 'Copy failed', 'Copy link');
    });
  }

  render();
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
  const color =
    accent === "emerald"
      ? "text-emerald-300"
      : accent === "amber"
        ? "text-amber-300"
        : "text-zinc-200";

  return (
    <div className="rounded-lg border border-zinc-800 bg-[#0a0a0a] p-4">
      <div className="text-xs font-mono text-zinc-500">{label}</div>
      <div className={`mt-2 text-2xl font-mono ${color}`} data-lc-readout={valueRef}>
        —
      </div>
    </div>
  );
}

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-4">
      <div className="text-sm font-medium text-zinc-100">{q}</div>
      <div className="mt-2 text-sm text-zinc-400 leading-relaxed">{a}</div>
    </div>
  );
}

function RelatedCard({
  title,
  desc,
  href,
}: {
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5 hover:border-zinc-700 transition-colors"
    >
      <div className="text-sm font-mono uppercase tracking-wider text-zinc-300">
        {title}
      </div>
      <div className="mt-2 text-sm text-zinc-400 leading-relaxed">{desc}</div>
    </Link>
  );
}
