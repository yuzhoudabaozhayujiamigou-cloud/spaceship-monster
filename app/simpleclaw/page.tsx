import Link from "next/link";

import { buildMetadata } from "../_seo/metadata";
import { SITE } from "../_seo/site";

type FAQ = {
  q: string;
  a: string;
};

export const metadata = buildMetadata({
  title: `SimpleClaw | One-Click Deploy OpenClaw`,
  description:
    "SimpleClaw is the fastest way to deploy OpenClaw: one command, sane defaults, self-hosted privacy, and reproducible infrastructure.",
  path: "/simpleclaw",
});

function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

export default function SimpleClawLandingPage() {
  const toc = [
    { label: "Overview", href: "#overview" },
    { label: "How it works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
    { label: "Security & trust", href: "#trust" },
  ];

  const steps = [
    {
      title: "Pick your target",
      description:
        "Deploy to a single box or a small cluster. SimpleClaw ships with opinionated defaults that work out of the box.",
    },
    {
      title: "Run one command",
      description:
        "Bootstrap OpenClaw + dependencies in minutes. Config stays readable and version-controlled.",
    },
    {
      title: "Operate confidently",
      description:
        "Self-hosted by default with security-first guardrails: secrets, updates, and observability built in.",
    },
  ];

  const pricing = [
    {
      name: "Free",
      price: "$0",
      blurb: "Try the workflow locally or on a personal server.",
      features: [
        "One-click deploy starter",
        "Self-hosted defaults",
        "Community updates",
      ],
      cta: { label: "Join waitlist", href: "#cta" },
    },
    {
      name: "Pro",
      price: "$\u2014",
      blurb: "For serious builders running OpenClaw for real work.",
      features: [
        "Production presets",
        "Backups & upgrades guide",
        "Priority template updates",
      ],
      cta: { label: "Get early access", href: "#cta" },
      featured: true,
    },
    {
      name: "Team",
      price: "$\u2014",
      blurb: "For organizations that need shared ops and compliance-ready posture.",
      features: [
        "Multi-environment patterns",
        "Audit-friendly configuration",
        "Team onboarding docs",
      ],
      cta: { label: "Talk to us", href: "#cta" },
    },
  ];

  const faqs: FAQ[] = [
    {
      q: "Is SimpleClaw an agent or a deploy tool?",
      a: "SimpleClaw is a deploy tool: it focuses on getting OpenClaw running reliably with reproducible infrastructure, not on changing OpenClaw\u2019s behavior.",
    },
    {
      q: "Do I need Kubernetes?",
      a: "No. Start with a single machine deployment. If you later need a cluster, you can migrate using the same config-first approach.",
    },
    {
      q: "Is it self-hosted?",
      a: "Yes. The default posture is self-hosted with explicit data boundaries. You control where services run and where data lives.",
    },
    {
      q: "What about updates and rollback?",
      a: "The goal is a safe upgrade path with pinned versions and a clear rollback story. Details will ship with the early access release.",
    },
    {
      q: "Will you add billing/auth later?",
      a: "Not on this page. This is a deploy-first landing page. If you need enterprise workflows, we\u2019ll handle that separately.",
    },
  ];

  const softwareAppJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "SimpleClaw",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Linux",
    description:
      "One-click deploy for OpenClaw: reproducible, self-hosted, and security-first.",
    offers: pricing.map((tier) => ({
      "@type": "Offer",
      name: tier.name,
      price: tier.price === "$0" ? 0 : 0,
      priceCurrency: "USD",
      availability: "https://schema.org/PreOrder",
    })),
    url: `${SITE.url}/simpleclaw`,
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.a,
      },
    })),
  };

  return (
    <div className="min-h-screen bg-[#070A0C] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.18),rgba(16,185,129,0.04)_45%,transparent_70%)] blur-2xl" />
        <div className="absolute -bottom-40 right-[-120px] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle_at_center,rgba(34,211,238,0.14),rgba(34,211,238,0.03)_50%,transparent_70%)] blur-2xl" />
        <div className="absolute inset-0 opacity-[0.055] [background-image:radial-gradient(rgba(255,255,255,0.9)_1px,transparent_1px)] [background-size:18px_18px]" />
      </div>

      <header className="relative mx-auto max-w-6xl px-6 pt-8">
        <div className="flex items-center justify-between gap-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-zinc-300 hover:text-white transition-colors"
          >
            <span className="inline-block size-2 rounded-full bg-emerald-400" />
            {SITE.name}
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/tools/"
              className="text-sm text-zinc-300 hover:text-white transition-colors"
            >
              Tools
            </Link>
            <a
              href="#cta"
              className="inline-flex items-center justify-center rounded-lg bg-emerald-400 px-4 py-2 text-sm font-semibold text-black hover:bg-emerald-300 transition-colors"
            >
              Join waitlist
            </a>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-6 pb-20 pt-10">
        <section className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-start">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-mono text-emerald-200">
              one-click deploy for OpenClaw
            </p>

            <h1 className="mt-6 text-balance text-5xl font-bold tracking-tight sm:text-6xl">
              Deploy OpenClaw in minutes.
              <span className="block text-zinc-300">No yak-shaving required.</span>
            </h1>

            <p className="mt-6 max-w-xl text-pretty text-lg leading-relaxed text-zinc-300">
              SimpleClaw packages the boring parts of infrastructure into a clean,
              reproducible workflow: sane defaults, self-hosted boundaries, and a
              deploy story you can trust.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <a
                href="#cta"
                className="inline-flex items-center justify-center rounded-xl bg-emerald-400 px-6 py-3 text-sm font-semibold text-black hover:bg-emerald-300 transition-colors"
              >
                Get early access
              </a>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center rounded-xl border border-zinc-700/70 bg-zinc-950/30 px-6 py-3 text-sm font-semibold text-zinc-100 hover:bg-zinc-950/55 transition-colors"
              >
                See the 3-step flow
              </a>
              <div className="text-xs text-zinc-400">
                CTA links are placeholders (waitlist form coming soon).
              </div>
            </div>

            <div className="mt-10 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
                <div className="text-sm font-semibold">Self-hosted</div>
                <div className="mt-1 text-sm text-zinc-400">
                  Your infra, your data boundaries.
                </div>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
                <div className="text-sm font-semibold">Reproducible</div>
                <div className="mt-1 text-sm text-zinc-400">
                  Config-first; upgrades are predictable.
                </div>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-4">
                <div className="text-sm font-semibold">Secure defaults</div>
                <div className="mt-1 text-sm text-zinc-400">
                  Least-privilege posture from day one.
                </div>
              </div>
            </div>
          </div>

          <aside className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-semibold text-zinc-200">On this page</div>
                <div className="mt-1 text-sm text-zinc-400">
                  Skim the essentials, then hit the CTA.
                </div>
              </div>
              <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-mono text-cyan-200">
                static SEO
              </span>
            </div>
            <nav className="mt-5 space-y-2">
              {toc.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="block rounded-lg px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-900/50 hover:text-white transition-colors"
                >
                  {item.label}
                </a>
              ))}
            </nav>
            <div className="mt-6 rounded-xl border border-zinc-800 bg-black/30 p-4">
              <div className="text-xs font-mono text-zinc-400">Example command</div>
              <pre className="mt-2 overflow-x-auto text-xs leading-relaxed text-zinc-200">
                <code>npx simpleclaw deploy --target server</code>
              </pre>
              <div className="mt-3 text-xs text-zinc-500">
                Placeholder only; CLI details will be published with the first release.
              </div>
            </div>
          </aside>
        </section>

        <section id="overview" className="mt-16 scroll-mt-16">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950/30 p-8">
            <div className="grid gap-8 lg:grid-cols-3">
              <div>
                <h2 className="text-2xl font-bold tracking-tight">Overview</h2>
                <p className="mt-3 text-sm leading-relaxed text-zinc-300">
                  You shouldn\u2019t have to become an SRE to run your own agent stack.
                  SimpleClaw aims to make OpenClaw deployment feel like a product:
                  repeatable, documented, and boring in the best way.
                </p>
              </div>

              <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-zinc-800 bg-black/25 p-5">
                  <div className="text-sm font-semibold">What you get</div>
                  <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                    <li>Opinionated defaults (networks, storage, health checks)</li>
                    <li>Config you can review in Git</li>
                    <li>Easy path to staging \u2192 prod</li>
                  </ul>
                </div>
                <div className="rounded-2xl border border-zinc-800 bg-black/25 p-5">
                  <div className="text-sm font-semibold">What you avoid</div>
                  <ul className="mt-3 space-y-2 text-sm text-zinc-300">
                    <li>Copy-pasting random docker-compose files</li>
                    <li>Secret sprawl across machines</li>
                    <li>Undocumented manual steps</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="mt-16 scroll-mt-16">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">How it works</h2>
              <p className="mt-3 max-w-2xl text-zinc-300">
                A simple 3-step loop: choose a target, deploy once, then operate
                safely.
              </p>
            </div>
            <a
              href="#pricing"
              className="hidden sm:inline-flex items-center justify-center rounded-lg border border-zinc-700/70 bg-zinc-950/20 px-4 py-2 text-sm font-semibold text-zinc-100 hover:bg-zinc-900/40 transition-colors"
            >
              Jump to pricing
            </a>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className="rounded-3xl border border-zinc-800 bg-zinc-950/35 p-6"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="text-xs font-mono text-zinc-500">STEP {index + 1}</div>
                  <div className="h-px flex-1 bg-gradient-to-r from-emerald-400/0 via-emerald-400/30 to-emerald-400/0" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-300">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <section id="pricing" className="mt-16 scroll-mt-16">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Pricing</h2>
              <p className="mt-3 max-w-2xl text-zinc-300">
                Placeholder tiers to communicate intent. Final pricing will land
                with early access.
              </p>
            </div>
            <a href="#cta" className="text-sm text-emerald-200 hover:text-emerald-100">
              Get updates \u2192
            </a>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-3">
            {pricing.map((tier) => (
              <div
                key={tier.name}
                className={
                  tier.featured
                    ? "rounded-3xl border border-emerald-400/35 bg-gradient-to-b from-emerald-400/10 to-zinc-950/40 p-6 shadow-[0_0_0_1px_rgba(16,185,129,0.08)]"
                    : "rounded-3xl border border-zinc-800 bg-zinc-950/35 p-6"
                }
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-zinc-200">
                      {tier.name}
                    </div>
                    <div className="mt-2 text-4xl font-bold tracking-tight">
                      {tier.price}
                    </div>
                  </div>
                  {tier.featured ? (
                    <span className="rounded-full border border-emerald-400/30 bg-emerald-400/15 px-3 py-1 text-xs font-mono text-emerald-200">
                      Most popular
                    </span>
                  ) : null}
                </div>

                <p className="mt-4 text-sm text-zinc-300">{tier.blurb}</p>

                <ul className="mt-5 space-y-2 text-sm text-zinc-300">
                  {tier.features.map((feature) => (
                    <li key={`${tier.name}-${slugify(feature)}`} className="flex gap-2">
                      <span className="mt-1 size-1.5 shrink-0 rounded-full bg-emerald-300" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <a
                  href={tier.cta.href}
                  className={
                    tier.featured
                      ? "mt-6 inline-flex w-full items-center justify-center rounded-xl bg-emerald-400 px-4 py-3 text-sm font-semibold text-black hover:bg-emerald-300 transition-colors"
                      : "mt-6 inline-flex w-full items-center justify-center rounded-xl border border-zinc-700/70 bg-zinc-950/20 px-4 py-3 text-sm font-semibold text-zinc-100 hover:bg-zinc-900/40 transition-colors"
                  }
                >
                  {tier.cta.label}
                </a>
              </div>
            ))}
          </div>
        </section>

        <section id="faq" className="mt-16 scroll-mt-16">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-950/30 p-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">FAQ</h2>
                <p className="mt-2 text-zinc-300">
                  Quick answers. More docs will ship with early access.
                </p>
              </div>
              <a href="#cta" className="text-sm text-zinc-300 hover:text-white">
                Still unsure? Join the waitlist
              </a>
            </div>

            <div className="mt-6 divide-y divide-zinc-800">
              {faqs.map((f) => (
                <details
                  key={f.q}
                  className="group py-4"
                >
                  <summary className="cursor-pointer list-none select-none text-sm font-semibold text-zinc-100">
                    <span className="flex items-center justify-between gap-4">
                      <span>{f.q}</span>
                      <span className="text-zinc-500 transition-transform group-open:rotate-45">
                        +
                      </span>
                    </span>
                  </summary>
                  <div className="mt-3 text-sm leading-relaxed text-zinc-300">
                    {f.a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <section id="trust" className="mt-16 scroll-mt-16">
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="lg:col-span-1">
              <h2 className="text-3xl font-bold tracking-tight">Security & trust</h2>
              <p className="mt-3 text-zinc-300">
                SimpleClaw is designed to keep you in control. No surprise data
                flows.
              </p>
            </div>

            <div className="lg:col-span-2 grid gap-4 sm:grid-cols-3">
              <div className="rounded-3xl border border-zinc-800 bg-zinc-950/35 p-6">
                <div className="text-sm font-semibold">Security-first</div>
                <p className="mt-2 text-sm text-zinc-300">
                  Least-privilege patterns, secrets management, and clear
                  defaults.
                </p>
              </div>
              <div className="rounded-3xl border border-zinc-800 bg-zinc-950/35 p-6">
                <div className="text-sm font-semibold">Privacy</div>
                <p className="mt-2 text-sm text-zinc-300">
                  Self-hosted by default. Your data stays where you deploy.
                </p>
              </div>
              <div className="rounded-3xl border border-zinc-800 bg-zinc-950/35 p-6">
                <div className="text-sm font-semibold">Reproducible ops</div>
                <p className="mt-2 text-sm text-zinc-300">
                  Config is explicit, reviewable, and friendly to audits.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="cta" className="mt-16 scroll-mt-16">
          <div className="rounded-[32px] border border-emerald-400/25 bg-gradient-to-r from-emerald-400/15 via-cyan-400/10 to-transparent p-8">
            <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">
                  Ready to deploy OpenClaw the sane way?
                </h2>
                <p className="mt-3 max-w-xl text-zinc-200">
                  Get notified when SimpleClaw early access opens. The waitlist
                  form is a placeholder for now.
                </p>
                <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                  <a
                    href="#"
                    className="inline-flex items-center justify-center rounded-xl bg-emerald-400 px-6 py-3 text-sm font-semibold text-black hover:bg-emerald-300 transition-colors"
                  >
                    Join waitlist (placeholder)
                  </a>
                  <a
                    href="/tools/"
                    className="inline-flex items-center justify-center rounded-xl border border-zinc-700/70 bg-black/20 px-6 py-3 text-sm font-semibold text-white hover:bg-black/35 transition-colors"
                  >
                    Explore tools
                  </a>
                </div>
              </div>

              <div className="rounded-3xl border border-zinc-800 bg-black/25 p-6">
                <div className="text-xs font-mono text-zinc-400">
                  What happens next
                </div>
                <ol className="mt-4 space-y-3 text-sm text-zinc-200">
                  <li className="flex gap-3">
                    <span className="mt-1 size-6 shrink-0 rounded-full bg-emerald-400/20 text-center text-xs font-semibold text-emerald-200 leading-6">
                      1
                    </span>
                    <span>We\u2019ll share the first deploy template.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 size-6 shrink-0 rounded-full bg-emerald-400/20 text-center text-xs font-semibold text-emerald-200 leading-6">
                      2
                    </span>
                    <span>We\u2019ll publish docs and upgrade guidance.</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="mt-1 size-6 shrink-0 rounded-full bg-emerald-400/20 text-center text-xs font-semibold text-emerald-200 leading-6">
                      3
                    </span>
                    <span>We\u2019ll invite you to the beta cohort.</span>
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([softwareAppJsonLd, faqJsonLd]),
          }}
        />
      </main>

      <footer className="relative mx-auto max-w-6xl px-6 pb-12">
        <div className="flex flex-col gap-2 border-t border-zinc-900 pt-8 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <div>
            \u00a9 {new Date().getFullYear()} {SITE.name}. Built for boring, reliable ops.
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="hover:text-zinc-200">
              Home
            </Link>
            <Link href="/tools/" className="hover:text-zinc-200">
              Tools
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
