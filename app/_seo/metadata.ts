import type { Metadata } from "next";

import { SITE } from "./site";

type SeoInput = {
  title: string;
  description: string;
  path: string;
};

export function buildMetadata({ title, description, path }: SeoInput): Metadata {
  const url = new URL(path, SITE.url).toString();

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      siteName: SITE.name,
      title,
      description,
      url,
      images: [
        {
          url: `/og?title=${encodeURIComponent(title)}`,
          width: 1200,
          height: 630,
          alt: `${SITE.name}: ${title}`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/og?title=${encodeURIComponent(title)}`],
    },
  };
}
