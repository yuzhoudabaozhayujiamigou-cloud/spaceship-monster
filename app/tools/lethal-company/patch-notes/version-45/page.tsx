import Link from "next/link";

export const metadata = {
  title: "Lethal Company Version 45 Patch Notes (Quick Overview) | Spaceship Monster",
  description:
    "A structured, updateable overview of Lethal Company Version 45 patch notes. Includes confirmed vs unknown changes, plus how the update may affect quota planning.",
  alternates: {
    canonical: "https://www.spaceship.monster/tools/lethal-company/patch-notes/version-45",
  },
};

function SectionTitle({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} style={{ scrollMarginTop: 80 }}>
      {children}
    </h2>
  );
}

export default function Version45PatchNotesPage() {
  return (
    <main className="container" style={{ padding: "24px 0" }}>
      <header style={{ marginBottom: 16 }}>
        <p style={{ opacity: 0.8, margin: 0 }}>
          <Link href="/">Home</Link> / <Link href="/tools">Tools</Link> /{" "}
          <Link href="/tools/lethal-company">Lethal Company</Link> / Patch Notes
        </p>
        <h1 style={{ margin: "10px 0 8px" }}>Lethal Company — Version 45 Patch Notes (Quick Overview)</h1>
        <p style={{ marginTop: 0, opacity: 0.9 }}>
          This page is intentionally a <strong>living skeleton</strong>: we avoid guessing. Items are grouped by certainty so you
          can track what’s confirmed vs what still needs verification.
        </p>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginTop: 10 }}>
          <a href="#confirmed" className="btn">
            Confirmed
          </a>
          <a href="#unknown" className="btn">
            Unknown / Unverified
          </a>
          <a href="#how-it-affects-quota" className="btn">
            Quota impact
          </a>
          <a href="#faq" className="btn">
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
        </div>
      </header>

      <section style={{ marginTop: 18 }}>
        <SectionTitle id="confirmed">Confirmed changes (Version 45)</SectionTitle>
        <p style={{ opacity: 0.85 }}>
          Add confirmed patch note bullets here with a source link (official notes / trusted mirrors). Keep each bullet short.
        </p>
        <ul>
          <li>
            <strong>[TBD]</strong> Confirmed change #1 — <em>Source:</em> <span style={{ opacity: 0.8 }}>(add link)</span>
          </li>
          <li>
            <strong>[TBD]</strong> Confirmed change #2 — <em>Source:</em> <span style={{ opacity: 0.8 }}>(add link)</span>
          </li>
        </ul>
      </section>

      <section style={{ marginTop: 22 }}>
        <SectionTitle id="unknown">Unknown / Unverified (needs sources)</SectionTitle>
        <p style={{ opacity: 0.85 }}>
          These are commonly repeated claims or player-reported observations. Treat as unverified until we add a reliable
          source.
        </p>
        <ul>
          <li>
            <strong>[Unverified]</strong> Claim about item/monster/mechanic change — <em>Reported by:</em> <span style={{ opacity: 0.8 }}>(community)
            </span>
          </li>
          <li>
            <strong>[Unverified]</strong> Another rumor/observation — <em>Reported by:</em> <span style={{ opacity: 0.8 }}>(community)</span>
          </li>
        </ul>
      </section>

      <section style={{ marginTop: 22 }}>
        <SectionTitle id="how-it-affects-quota">How Version 45 may affect quota planning</SectionTitle>
        <p style={{ opacity: 0.9 }}>
          We don’t assume specific balance numbers here. Instead, we map changes to decision points.
        </p>
        <ol>
          <li>
            <strong>Scrap value variance:</strong> If values shift, re-check your minimum daily scrap target with the{" "}
            <Link href="/tools/lethal-company/quota-calculator">quota calculator</Link>.
          </li>
          <li>
            <strong>Risk profile changes:</strong> If enemy behavior or weather frequency changed, adjust “leave early vs stay” rules.
          </li>
          <li>
            <strong>Team coordination:</strong> If comms/tools changed, update your team roles and callouts.
          </li>
        </ol>
      </section>

      <section id="faq" style={{ marginTop: 22 }}>
        <SectionTitle id="faq">FAQ</SectionTitle>
        <h3>Where are the official patch notes for Version 45?</h3>
        <p style={{ opacity: 0.85 }}>Add a link once verified. We avoid linking to low-quality mirrors.</p>

        <h3>What’s the safest money route after Version 45?</h3>
        <p style={{ opacity: 0.85 }}>Depends on confirmed changes. We’ll publish a checklist once sources are in place.</p>

        <h3>Which changes matter for solo vs team?</h3>
        <p style={{ opacity: 0.85 }}>We’ll split tips into Solo / Duo / Team once confirmed items are added.</p>
      </section>

      <footer style={{ marginTop: 24, opacity: 0.8 }}>
        <p style={{ margin: 0 }}>
          Note: This page is a structured placeholder to prevent misinformation. If you have the official notes link, send it
          and we’ll cite it.
        </p>
      </footer>
    </main>
  );
}
