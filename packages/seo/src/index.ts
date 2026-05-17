export interface SeoMetadata {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImageUrl?: string;
  robots?: string;
}

export const buildCanonicalUrl = (origin: string, pathname: string): string => {
  const normalizedOrigin = origin.replace(/\/$/, "");
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${normalizedOrigin}${normalizedPath}`;
};

export const buildSeoMetaTags = (
  meta: SeoMetadata
): Array<{ name?: string; property?: string; content: string }> => {
  const tags: Array<{ name?: string; property?: string; content: string }> = [
    { name: "description", content: meta.description },
    { name: "robots", content: meta.robots ?? "index,follow" },
    { property: "og:title", content: meta.title },
    { property: "og:description", content: meta.description },
    { property: "og:type", content: "article" },
  ];

  if (meta.ogImageUrl) {
    tags.push({ property: "og:image", content: meta.ogImageUrl });
  }

  return tags;
};
