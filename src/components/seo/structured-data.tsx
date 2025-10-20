import Script from 'next/script';

export function StructuredData() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'faktuur.io',
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web Browser',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'EUR',
      priceSpecification: {
        '@type': 'UnitPriceSpecification',
        price: '0',
        priceCurrency: 'EUR',
        name: 'Plan Gratuit',
      },
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '127',
      bestRating: '5',
      worstRating: '1',
    },
    description:
      'Logiciel de facturation en ligne pour freelances et auto-entrepreneurs. Créez et gérez vos devis et factures facilement.',
    featureList: [
      'Création de devis',
      'Création de factures',
      'Gestion des clients',
      'Export PDF',
      'Envoi par email',
      'Suivi des paiements',
      'Statistiques avancées',
      'Conforme à la réglementation française',
    ],
    screenshot: [
      `${process.env.NEXT_PUBLIC_APP_URL}/screenshots/dashboard.png`,
      `${process.env.NEXT_PUBLIC_APP_URL}/screenshots/invoice.png`,
    ],
    softwareVersion: '1.0',
    author: {
      '@type': 'Organization',
      name: 'faktuur.io',
      url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    },
    provider: {
      '@type': 'Organization',
      name: 'faktuur.io',
      url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    },
  };

  const organizationLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'faktuur.io',
    url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    logo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/logo.png`,
    description:
      'Solution de facturation en ligne pour les freelances et auto-entrepreneurs français',
    foundingDate: '2023',
    sameAs: [
      'https://twitter.com/faktuur_io',
      'https://linkedin.com/company/faktuur-io',
      'https://facebook.com/faktuur.io',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Support',
      email: 'support@faktuur.io',
      availableLanguage: ['French'],
    },
  };

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Accueil',
        item: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      },
    ],
  };

  return (
    <>
      <Script
        id="structured-data-software"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Script
        id="structured-data-organization"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }}
      />
      <Script
        id="structured-data-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
    </>
  );
}
