type PageMetadataProps = {
  title: string;
  description: string;
  path: string;
};

const siteUrl = "https://dudeldups.dev";

const PageMetadata = ({ title, description, path }: PageMetadataProps) => {
  const canonicalUrl = new URL(path, siteUrl).toString();

  return (
    <>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
    </>
  );
};

export default PageMetadata;
