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
      url: `${baseUrl}/tools/lethal-company/moons`,
      lastModified: lastModForPath("app/tools/lethal-company/moons/page.tsx"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/tools/lethal-company/moons/tier-list`,
      lastModified: lastModForPath(
        "app/tools/lethal-company/moons/tier-list/page.tsx",
      ),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/tools/lethal-company/terminal-commands`,
      lastModified: lastModForPath(
        "app/tools/lethal-company/terminal-commands/page.tsx",
      ),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/tools/lethal-company/terminal/shortcuts-abbreviations`,
      lastModified: lastModForPath(
        "app/tools/lethal-company/terminal/shortcuts-abbreviations/page.tsx",
      ),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/tools/lethal-company/items`,
      lastModified: lastModForPath("app/tools/lethal-company/items/page.tsx"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/tools/lethal-company/ship-upgrades`,
      lastModified: lastModForPath(
        "app/tools/lethal-company/ship-upgrades/page.tsx",
      ),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/tools/palworld`,
      lastModified: lastModForPath("app/tools/palworld/page.tsx"),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/tools/palworld/breeding-calculator`,
      lastModified: lastModForPath(
        "app/tools/palworld/breeding-calculator/page.tsx",
      ),
      changeFrequency: "weekly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/tools/palworld/paldeck`,
      lastModified: lastModForPath("app/tools/palworld/paldeck/page.tsx"),
      changeFrequency: "weekly",
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
    {
      url: `${baseUrl}/blog/best-crops-every-season`,
      lastModified: lastModForPath("app/blog/best-crops-every-season/page.tsx"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/greenhouse-layout-guide`,
      lastModified: lastModForPath("app/blog/greenhouse-layout-guide/page.tsx"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/blog/keg-vs-jar-profit-guide`,
      lastModified: lastModForPath("app/blog/keg-vs-jar-profit-guide/page.tsx"),
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${baseUrl}/presets`,
      lastModified: lastModForPath("app/presets/page.tsx"),
      changeFrequency: "weekly",
      priority: 0.6,
    },
  ];
}
