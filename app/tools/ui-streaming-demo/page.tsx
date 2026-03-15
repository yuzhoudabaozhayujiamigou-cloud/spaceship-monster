import Link from "next/link";

import { buildMetadata } from "../../_seo/metadata";
import { SITE } from "../../_seo/site";
import FaqJsonLd from "../../components/FaqJsonLd";
import DemoClient from "./DemoClient";

export const metadata = buildMetadata({
  title: `UI Streaming Demo | ${SITE.name}`,
  description:
    "Interactive UI streaming demo for structured SSE events (ui.init/ui.block/ui.patch/ui.done) with start, abort/reset, retry, and fallback flows.",
  path: "/tools/ui-streaming-demo",
});

const FAQS = [
  {
    question: "What happens when I click Start API Stream?",
    answer:
      "The demo POSTs your prompt to /api/ui-stream and renders events incrementally. You will usually see ui.init first, then ui.block and ui.patch updates, and finally ui.done.",
  },
  {
    question: "How do I abort a run?",
    answer:
      "Use Reset to clear the current demo state and return to Idle immediately. After reset, you can start a fresh run with a new prompt.",
  },
  {
    question: "How does retry work in this demo?",
    answer:
      "If auto reconnect is enabled, the client retries once when it detects a retryable interruption such as timeout, network failure, or a 5xx response.",
  },
  {
    question: "When does fallback mode run?",
    answer:
      "Fallback runs when OPENAI_API_KEY is missing or when upstream generation fails. You can also use Local Fallback Replay to test incremental UI rendering without the API.",
  },
  {
    question: "Which events should a compatible stream send?",
    answer:
      "A compatible stream should send ui.init, one or more ui.block entries, zero or more ui.patch updates, and end with ui.done. Errors can be reported with ui.error.",
  },
];

export default function UIStreamingDemoPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6 text-zinc-100">
      <FaqJsonLd faqs={FAQS.map((faq) => ({ question: faq.question, answer: faq.answer }))} />
      <main className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Link href="/tools" className="text-zinc-400 transition-colors hover:text-zinc-100">
            ← Back to tools
          </Link>
        </div>

        <h1 className="mb-2 text-4xl font-bold">UI Streaming Demo</h1>
        <p className="mb-8 text-zinc-400">
          Test a practical UI streaming flow that calls <code>/api/ui-stream</code> and incrementally renders
          structured SSE events into text and KPI cards.
        </p>

        <section className="mb-8 rounded-xl border border-zinc-800 bg-zinc-950/40 p-5">
          <h2 className="text-xl font-semibold">Start / Abort / Retry / Fallback</h2>
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-zinc-300">
            <li>
              <span className="font-semibold text-zinc-100">Start:</span> Click <code>Start API Stream</code> to send
              the prompt and render incoming events in real time.
            </li>
            <li>
              <span className="font-semibold text-zinc-100">Abort:</span> Click <code>Reset</code> to clear the current
              run and return to <code>Idle</code> so you can start again cleanly.
            </li>
            <li>
              <span className="font-semibold text-zinc-100">Retry:</span> Keep{" "}
              <code>Auto reconnect once on interruption</code> enabled to retry one transient failure automatically.
            </li>
            <li>
              <span className="font-semibold text-zinc-100">Fallback:</span> If upstream streaming is unavailable, the
              API switches to fallback events. You can also validate this path with{" "}
              <code>Local Fallback Replay</code>.
            </li>
          </ul>
        </section>

        <DemoClient />

        <section className="mt-10 rounded-xl border border-zinc-800 bg-zinc-950/40 p-5">
          <h2 className="text-2xl font-semibold">FAQ</h2>
          <div className="mt-4 space-y-4">
            {FAQS.map((faq) => (
              <article key={faq.question} className="rounded-lg border border-zinc-800 bg-zinc-950/50 p-4">
                <h3 className="text-sm font-semibold text-zinc-100">{faq.question}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">{faq.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
