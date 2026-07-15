import { siteConfig } from "@/config/site";
import { getAllPublishedBlogSlugs } from "@/services/blog";
import { getAllPublishedCarSlugs } from "@/services/cars";

import type { MetadataRoute } from "next";

const STATIC_ROUTES = [
  { path: "", priority: 1, changeFrequency: "weekly" as const },
  { path: "/about", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/services", priority: 0.6, changeFrequency: "monthly" as const },
  { path: "/ceo", priority: 0.4, changeFrequency: "monthly" as const },
  { path: "/cars", priority: 0.9, changeFrequency: "daily" as const },
  { path: "/gallery", priority: 0.5, changeFrequency: "weekly" as const },
  { path: "/blog", priority: 0.7, changeFrequency: "daily" as const },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" as const },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [cars, posts] = await Promise.all([
    getAllPublishedCarSlugs(),
    getAllPublishedBlogSlugs(),
  ]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${siteConfig.url}${route.path}`,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));

  const carEntries: MetadataRoute.Sitemap = cars.map((car) => ({
    url: `${siteConfig.url}/cars/${car.slug}`,
    lastModified: car.updatedAt,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const blogEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${siteConfig.url}/blog/${post.slug}`,
    lastModified: post.updatedAt,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticEntries, ...carEntries, ...blogEntries];
}
