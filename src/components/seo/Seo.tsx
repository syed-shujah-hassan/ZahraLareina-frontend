import { Helmet } from 'react-helmet-async';

type SeoProps = {
  title?: string;
  description?: string;
  canonicalPath?: string;
  imageUrl?: string;
  keywords?: string;
  noIndex?: boolean;
  jsonLd?: Record<string, any> | Array<Record<string, any>>;
};

const DEFAULT_SITE_URL = 'https://zahralareina.com';
const DEFAULT_OG_IMAGE =
  'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80&auto=format&fit=crop';

const getSiteUrl = () => {
  const envUrl = (import.meta as any).env.VITE_SITE_URL as string | undefined;
  if (envUrl && typeof envUrl === 'string') return envUrl.replace(/\/$/, '');
  if (typeof window !== 'undefined' && window.location?.origin) return window.location.origin;
  return DEFAULT_SITE_URL;
};

export const Seo = ({
  title,
  description,
  canonicalPath,
  imageUrl,
  keywords,
  noIndex,
  jsonLd,
}: SeoProps) => {
  const siteUrl = getSiteUrl();
  const canonical = canonicalPath
    ? `${siteUrl}${canonicalPath.startsWith('/') ? '' : '/'}${canonicalPath}`
    : siteUrl;

  const ogImage = imageUrl || DEFAULT_OG_IMAGE;

  const resolvedTitle = title || 'Zahralareina | Luxury Fashion Store';
  const resolvedDescription =
    description ||
    'Zahralareina is a curated luxury fashion store for timeless bags, shoes, and accessories.';

  const ldArray = Array.isArray(jsonLd) ? jsonLd : jsonLd ? [jsonLd] : [];

  return (
    <Helmet>
      <title>{resolvedTitle}</title>
      <link rel="canonical" href={canonical} />
      <meta name="description" content={resolvedDescription} />
      {keywords ? <meta name="keywords" content={keywords} /> : null}
      {noIndex ? <meta name="robots" content="noindex,nofollow" /> : null}

      <meta property="og:title" content={resolvedTitle} />
      <meta property="og:description" content={resolvedDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={resolvedTitle} />
      <meta name="twitter:description" content={resolvedDescription} />
      <meta name="twitter:image" content={ogImage} />

      {ldArray.map((obj, idx) => (
        <script key={idx} type="application/ld+json">
          {JSON.stringify(obj)}
        </script>
      ))}
    </Helmet>
  );
};
