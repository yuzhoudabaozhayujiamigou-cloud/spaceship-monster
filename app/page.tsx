import Link from "next/link";

import { buildMetadata } from "./_seo/metadata";
import { SITE } from "./_seo/site";

export const metadata = buildMetadata({
  title: `${SITE.name}`,
  description: SITE.defaultDescription,
  path: "/",
});

export default function HomePage() {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: SITE.name,
      url: SITE.url,
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: SITE.name,
      url: SITE.url,
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE.url}/tools`,
        "query-input": "required name=search_term_string",
      },
    },
  ];

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      <main className="w-full max-w-2xl text-center">
        <h1 className="mb-4 text-5xl font-bold tracking-tight">{SITE.name}</h1>
        <p className="mb-12 text-xl text-gray-600">Building useful tools and sharing insights.</p>

        <nav className="flex flex-col justify-center gap-4 sm:flex-row sm:flex-wrap">
          <Link
            href="/tools/"
            className="rounded-lg bg-gray-900 px-6 py-3 text-white transition-colors hover:bg-gray-800"
          >
            Tools
          </Link>
          <Link
            href="/tools/satisfactory/"
            className="rounded-lg border border-sky-500/30 px-6 py-3 text-sky-300 transition-colors hover:bg-sky-500/10"
          >
            Satisfactory Tools
          </Link>
          <Link
            href="/tools/lethal-company/"
            className="rounded-lg border border-emerald-500/30 px-6 py-3 text-emerald-300 transition-colors hover:bg-emerald-500/10"
          >
            Lethal Company
          </Link>
          <Link
            href="https://stardewprofit.com"
            className="rounded-lg border border-gray-300 px-6 py-3 transition-colors hover:bg-gray-50"
          >
            Stardewprofit
          </Link>
          <Link
            href="/blog/"
            className="rounded-lg border border-gray-300 px-6 py-3 transition-colors hover:bg-gray-50"
          >
            Blog
          </Link>
        </nav>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </main>
    </div>
  );
}
