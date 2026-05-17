interface SeoMetadata {
  title: string;
  description: string;
  canonicalUrl?: string;
  ogImage?: string;
  robots?: string;
}

export function SeoHead({
  title,
  description,
  canonicalUrl,
  ogImage,
  robots = "index,follow",
}: SeoMetadata) {
  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="article" />
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
    </>
  );
}
