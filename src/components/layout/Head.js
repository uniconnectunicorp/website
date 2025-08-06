'use client';

import NextHead from 'next/head';

export default function Head({ title, description, image, url }) {
  const siteTitle = 'Uniconnect | Cursos Técnicos EAD';
  const siteDescription = 'Cursos técnicos de alta qualidade na modalidade EAD. Transforme sua carreira com a Uniconnect.';
  const siteUrl = 'https://unicorponline.com.br';
  const siteImage = '/og-image.jpeg';
  const metaTitle = title ? `${title}` : siteTitle;
  const metaDescription = description || siteDescription;
  const metaImage = image || siteImage;
  const metaUrl = url || siteUrl;

  return (
    <head>
      <title>{metaTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content="cursos técnicos, EAD, educação a distância, cursos profissionalizantes, Uniconnect" />
      <meta name="author" content="Uniconnect" />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={metaTitle} />
      <meta property="og:description" content={metaDescription} />
      <meta property="og:url" content={metaUrl} />
      <meta property="og:image" content={metaImage} />
      <meta property="og:site_name" content="Uniconnect" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={metaTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:image" content={metaImage} />

      {/* Favicons and App Icons */}
      <link rel="icon" href="/favicon.ico" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#0b3b75" />
      <link rel="manifest" href="/site.webmanifest" />

      {/* Theme Color and Viewport */}
      <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: light)" />
      <meta name="theme-color" content="#ffffff" media="(prefers-color-scheme: dark)" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </head>
  );
}