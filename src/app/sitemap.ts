import type { MetadataRoute } from "next";
import { siteUrl } from "../site";

// El portfolio es una sola página: actualizar la fecha al cambiar el contenido
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: siteUrl,
      lastModified: "2026-11-17",
      changeFrequency: "monthly",
      priority: 1,
    },
  ];
}
