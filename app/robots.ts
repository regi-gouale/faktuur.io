import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/pricing", "/about", "/login", "/signup"],
        disallow: [
          "/dashboard/*",
          "/api/*",
          "/forgot-password",
          "/reset-password",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/pricing", "/about"],
        disallow: ["/dashboard/*", "/api/*"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
