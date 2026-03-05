import Link from "next/link";

import { buildMetadata } from "../_seo/metadata";
import { SITE } from "../_seo/site";

export const metadata = buildMetadata({
  title: `Blog | ${SITE.name}`,
  description: "Thoughts on development, design, and technology.",
  path: "/blog",
});

const featuredPosts = [
  {
    href: "/blog/best-crops-every-season",
    title: "Best Crops Every Season",
    description:
      "Season-by-season crop picks with practical cash-flow logic for Year 1 through mid-game.",
  },
  {
    href: "/blog/greenhouse-layout-guide",
    title: "Greenhouse Layout Guide",
    description:
      "Profit-first greenhouse design focused on throughput, pathing, and machine sync.",
  },
  {
    href: "/blog/keg-vs-jar-profit-guide",
    title: "Keg vs Jar Profit Guide",
    description:
      "Processing math and transition strategy so your machine choices match your farm stage.",
  },
];

const otherPosts = [
  {
    href: "/blog/lethal-company-beginner-survival-guide",
    title: "Lethal Company Beginner Survival Guide: 10 Tips to Stop Dying",
    description:
      "New to Lethal Company? 10 survival tips to live longer, hit quota, and stop wiping on day one.",
  },
];

export default function BlogPage() {
  const itemListStructuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: [...featuredPosts, ...otherPosts].map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: post.title,
      url: `${SITE.url}${post.href}`,
    })),
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-6 text-zinc-100">
      <main className="mx-auto w-full max-w-4xl">
        <div className="mb-8">
          <Link
            href="/"
            className="text-zinc-400 transition-colors hover:text-zinc-100"
          >
            ← Back to home
          </Link>
        </div>

        <h1 className="mb-4 text-4xl font-bold">Blog</h1>
        <p className="mb-8 text-zinc-400">
          Thoughts on development, design, and technology.
        </p>

        <section className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-mono text-emerald-300">
              TOP
            </span>
            <h2 className="text-xl font-semibold">Featured</h2>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {featuredPosts.map((post) => (
              <article
                key={post.href}
                className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-5 transition-colors hover:bg-zinc-950/70"
              >
                <h3 className="text-lg font-semibold">
                  <Link href={post.href} className="hover:underline">
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-2 text-sm text-zinc-400">{post.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section>
          <h2 className="mb-4 text-xl font-semibold">More Posts</h2>
          <div className="space-y-4">
            {otherPosts.map((post) => (
              <article
                key={post.href}
                className="rounded-xl border border-zinc-800 bg-zinc-950/30 p-5 transition-colors hover:bg-zinc-950/50"
              >
                <h3 className="text-lg font-semibold">
                  <Link href={post.href} className="hover:underline">
                    {post.title}
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-zinc-400">{post.description}</p>
              </article>
            ))}
          </div>
        </section>

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(itemListStructuredData),
          }}
        />
      </main>
    </div>
  );
}
