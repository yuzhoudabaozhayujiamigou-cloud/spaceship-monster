import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Spaceship Monster",
  description: "Building useful tools and sharing insights about development, design, and technology.",
  metadataBase: new URL("https://spaceship.monster"),
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-white text-gray-900">
        {children}
      </body>
    </html>
  );
}
