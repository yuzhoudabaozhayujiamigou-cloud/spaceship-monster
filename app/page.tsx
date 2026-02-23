import Link from "next/link";

export const metadata = {
  title: "Home - Spaceship Monster",
  description: "Building useful tools and sharing insights about development, design, and technology.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <main className="max-w-2xl w-full text-center">
        <h1 className="text-5xl font-bold mb-4 tracking-tight">
          Spaceship Monster
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
      </main>
    </div>
  );
}
