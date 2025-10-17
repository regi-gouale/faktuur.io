import Script from "next/script";

interface PricingStructuredDataProps {
  plans: Array<{
    name: string;
    price: string;
    period: string;
    description: string;
    features: Array<{ name: string; included: boolean }>;
  }>;
}

export function PricingStructuredData({ plans }: PricingStructuredDataProps) {
  const offers = plans.map((plan) => {
    const priceValue =
      plan.price === "Sur devis" ? "0" : plan.price.replace("€", "");

    return {
      "@type": "Offer",
      name: `Plan ${plan.name}`,
      description: plan.description,
      price: priceValue,
      priceCurrency: "EUR",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: priceValue,
        priceCurrency: "EUR",
        referenceQuantity: {
          "@type": "QuantityValue",
          value: "1",
          unitCode: "MON",
        },
      },
    };
  });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "faktuur.io",
    description:
      "Logiciel de facturation pour freelances et auto-entrepreneurs",
    offers: offers,
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      ratingCount: "127",
      bestRating: "5",
      worstRating: "1",
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Accueil",
        item: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Tarifs",
        item: `${
          process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        }/pricing`,
      },
    ],
  };

  return (
    <>
      <Script
        id="pricing-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Script
        id="pricing-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
    </>
  );
}
