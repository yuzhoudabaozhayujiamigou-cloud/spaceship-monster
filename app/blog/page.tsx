import Link from "next/link";

import { buildMetadata } from "../_seo/metadata";
import { SITE } from "../_seo/site";

export const metadata = buildMetadata({
  title: `Blog | ${SITE.name}`,
  description: "Thoughts on development, design, and technology.",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <div className="min-h-screen p-6">
      <main className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            ← Back to home
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-4">Blog</h1>
        <p className="text-gray-600 mb-8">
          Thoughts on development, design, and technology.
        </p>

        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h2 className="font-semibold text-lg">More coming soon...</h2>
            <p className="text-gray-600 mt-1">
              We are working on writing helpful articles and tutorials.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
