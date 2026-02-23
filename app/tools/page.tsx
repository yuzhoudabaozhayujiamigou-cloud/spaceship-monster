import Link from "next/link";

export const metadata = {
  title: "Tools - Spaceship Monster",
  description: "Collection of useful tools and utilities.",
};

export default function ToolsPage() {
  return (
    <div className="min-h-screen p-6">
      <main className="max-w-2xl mx-auto">
        <div className="mb-8">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            ← Back to home
          </Link>
        </div>

        <h1 className="text-4xl font-bold mb-4">Tools</h1>
        <p className="text-gray-600 mb-8">
          A collection of useful tools and utilities.
        </p>

        <div className="space-y-4">
          <div className="p-4 border border-gray-200 rounded-lg">
            <h2 className="font-semibold text-lg">More coming soon...</h2>
            <p className="text-gray-600 mt-1">
              We are working on building helpful tools for developers and creators.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
