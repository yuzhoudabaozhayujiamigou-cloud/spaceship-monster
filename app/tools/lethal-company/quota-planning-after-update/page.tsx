import Link from "next/link";

export const metadata = {
  title: "Quota Planning After Updates (Checklist + Rules) | Lethal Company",
  description:
    "A practical checklist for quota planning after Lethal Company updates. Focused on decision rules, risk control, and adapting when patch notes change the meta.",
  alternates: {
    canonical: "https://www.spaceship.monster/tools/lethal-company/quota-planning-after-update",
  },
};

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} style={{ scrollMarginTop: 80 }}>
      {children}
    </h2>
  );
}

export default function QuotaPlanningAfterUpdatePage() {
  return (
    <main className="container" style={{ padding: "24px 0" }}>
      <header style={{ marginBottom: 16 }}>
        <p style={{ opacity: 0.8, margin: 0 }}>
          <Link href="/">Home</Link> / <Link href="/tools">Tools</Link> /{" "}
          <Link href="/tools/lethal-company">Lethal Company</Link>
        </p>
        <h1 style={{ margin: "10px 0 8px" }}>Quota planning after updates</h1>
        <p style={{ marginTop: 0, opacity: 0.9 }}>
          Updates can change values, risks, and routes. This page is a <strong>rules-first checklist</strong> you can reuse after
          any patch — without assuming specific numbers.
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
          <a className="btn" href="#checklist">
            Checklist
          </a>
          <a className="btn" href="#rules">
            Rules
          </a>
          <a className="btn" href="#example-week">
            Example week
          </a>
          <a className="btn" href="#faq">
            FAQ
          </a>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 12 }}>
          <Link className="btn primary" href="/tools/lethal-company/quota-calculator">
            Quota Calculator
          </Link>
          <Link className="btn" href="/tools/lethal-company/terminal-commands">
            Terminal Commands
          </Link>
          <Link className="btn" href="/tools/lethal-company/patch-notes/version-45">
            Version 45 patch notes (skeleton)
          </Link>
        </div>
      </header>

      <section>
        <H2 id="checklist">Quota planning checklist (after a patch)</H2>
        <ol>
          <li>
            <strong>Re-anchor your math:</strong> re-check required totals using the <Link href="/tools/lethal-company/quota-calculator">quota calculator</Link>.
          </li>
          <li>
            <strong>Re-rank risk:</strong> identify what got riskier/safer (enemy behavior, weather frequency, item safety).
          </li>
          <li>
            <strong>Set a “leave early” rule:</strong> decide what conditions trigger extraction vs staying longer.
          </li>
          <li>
            <strong>Set a “recovery” rule:</strong> define what you do after a wipe / bad day.
          </li>
          <li>
            <strong>Lock roles & comms:</strong> who scans, who carries, who navigates. Keep it consistent.
          </li>
        </ol>
      </section>

      <section style={{ marginTop: 22 }}>
        <H2 id="rules">Item priority rules (patch-proof)</H2>
        <p style={{ opacity: 0.9 }}>
          We intentionally avoid claiming specific values here. Treat these as decision heuristics.
        </p>
        <ul>
          <li>
            <strong>Rule 1:</strong> prioritize <em>high certainty</em> value over <em>high variance</em> value when you’re behind quota.
          </li>
          <li>
            <strong>Rule 2:</strong> if a patch increases risk, reduce time-in-building and increase extraction frequency.
          </li>
          <li>
            <strong>Rule 3:</strong> if the team is inconsistent, aim for a lower target per day but higher consistency across days.
          </li>
        </ul>

        <h3>Unknown / Unverified (fill after reading patch notes)</h3>
        <ul>
          <li>
            <strong>[Unknown]</strong> Did item values change materially in this patch?
          </li>
          <li>
            <strong>[Unknown]</strong> Did any enemy/weather mechanic change your expected survival time?
          </li>
        </ul>
      </section>

      <section id="example-week" style={{ marginTop: 22 }}>
        <H2 id="example-week">Example week plan (template)</H2>
        <p style={{ opacity: 0.9 }}>
          Use this as a template. Replace numbers with your calculator outputs and your team’s real performance.
        </p>
        <ol>
          <li>
            <strong>Day 1:</strong> gather baseline scrap, don’t over-risk. Log actual haul.
          </li>
          <li>
            <strong>Day 2:</strong> adjust targets based on Day 1 variance.
          </li>
          <li>
            <strong>Day 3:</strong> if behind, switch to safer routes and extract earlier.
          </li>
        </ol>
      </section>

      <section id="faq" style={{ marginTop: 22 }}>
        <H2 id="faq">FAQ</H2>

        <h3>How do I plan quota if my team keeps wiping?</h3>
        <p style={{ opacity: 0.85 }}>
          Lower your per-run risk and increase extraction frequency. Use the calculator to re-anchor what “enough” looks like.
        </p>

        <h3>What is a good minimum scrap target per day?</h3>
        <p style={{ opacity: 0.85 }}>
          It depends on your quota and day count. Use the quota calculator and add a buffer for variance.
        </p>

        <h3>How should I adapt plans after updates?</h3>
        <p style={{ opacity: 0.85 }}>
          Read patch notes, label unknowns, and re-validate assumptions with 1–2 runs before committing to a new route.
        </p>
      </section>

      <footer style={{ marginTop: 24, opacity: 0.8 }}>
        <p style={{ margin: 0 }}>
          This page is designed to be update-proof: it emphasizes checklists and rules over potentially incorrect patch claims.
        </p>
      </footer>
    </main>
  );
}
