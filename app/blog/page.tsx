import Link from "next/link";

import { buildMetadata } from "../_seo/metadata";
import { SITE } from "../_seo/site";

export const metadata = buildMetadata({
  title: `Blog | ${SITE.name}`,
  description: "Thoughts on development, design, and technology.",
  path: "/blog",
});

const posts = [
  {
    href: "/blog/lethal-company-beginner-survival-guide",
    title: "Lethal Company Beginner Survival Guide: 10 Tips to Stop Dying",
    description:
      "New to Lethal Company? 10 survival tips to live longer, hit quota, and stop wiping on day one.",
  },
];

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
          {posts.map((post) => (
            <article
              key={post.href}
              className="p-4 border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
            >
              <h2 className="font-semibold text-lg">
                <Link href={post.href} className="hover:underline">
                  {post.title}
                </Link>
              </h2>
              <p className="text-gray-600 mt-1">{post.description}</p>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
