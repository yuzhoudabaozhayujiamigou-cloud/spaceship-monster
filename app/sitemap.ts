import type { MetadataRoute } from "next";

import { lastModForPath } from "./_seo/gitLastMod";
import { SITE } from "./_seo/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = SITE.url;

  return [
    {
      url: baseUrl,
      lastModified: lastModForPath("app/page.tsx"),
      changeFrequency: "monthly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/tools`,
      lastModified: lastModForPath("app/tools/page.tsx"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tools/lethal-company`,
      lastModified: lastModForPath("app/tools/lethal-company/page.tsx"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/lethal-company/quota-calculator`,
      lastModified: lastModForPath(
        "app/tools/lethal-company/quota-calculator/page.tsx",
      ),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/tools/lethal-company/bestiary`,
      lastModified: lastModForPath("app/tools/lethal-company/bestiary/page.tsx"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: lastModForPath("app/blog/page.tsx"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog/lethal-company-beginner-survival-guide`,
      lastModified: lastModForPath(
        "app/blog/lethal-company-beginner-survival-guide/page.tsx",
      ),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];
}
