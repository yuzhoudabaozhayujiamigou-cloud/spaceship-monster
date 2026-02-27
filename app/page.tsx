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
    <div className="min-h-screen flex items-center justify-center p-6">
      <main className="max-w-2xl w-full text-center">
        <h1 className="text-5xl font-bold mb-4 tracking-tight">
          {SITE.name}
        </h1>
        <p className="text-xl text-gray-600 mb-12">
          Building useful tools and sharing insights.
        </p>

        <nav className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/tools/"
            className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            Tools
          </Link>
          <Link
            href="/tools/lethal-company/"
            className="px-6 py-3 border border-emerald-500/30 text-emerald-300 rounded-lg hover:bg-emerald-500/10 transition-colors"
          >
            Lethal Company
          </Link>
          <Link
            href="https://stardewprofit.com"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Stardewprofit
          </Link>
          <Link
            href="/blog/"
            className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
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
