import Link from "next/link";

import { buildMetadata } from "../../_seo/metadata";
import { SITE } from "../../_seo/site";
import DemoClient from "./DemoClient";

export const metadata = buildMetadata({
  title: `UI Streaming Demo | ${SITE.name}`,
  description: "Demo page for streaming structured UI events into interactive cards/charts.",
  path: "/tools/ui-streaming-demo",
});

export default function UIStreamingDemoPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6 text-zinc-100">
      <main className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Link href="/tools" className="text-zinc-400 transition-colors hover:text-zinc-100">
            ← Back to tools
          </Link>
        </div>

        <h1 className="mb-2 text-4xl font-bold">UI Streaming Demo</h1>
        <p className="mb-8 text-zinc-400">
          A minimal inner-page demo that renders structured JSONL-style events into interactive UI blocks.
        </p>

        <DemoClient />
      </main>
    </div>
  );
}
