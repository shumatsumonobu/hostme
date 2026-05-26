import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: "https://hostme.dev", lastModified: new Date(), priority: 1.0 },
    { url: "https://hostme.dev/diagnose", lastModified: new Date(), priority: 0.9 },
    { url: "https://hostme.dev/about", lastModified: new Date(), priority: 0.6 },
    { url: "https://hostme.dev/lp", lastModified: new Date(), priority: 0.8 },
    { url: "https://hostme.dev/lp?l=ja", lastModified: new Date(), priority: 0.8 },
  ];
}
