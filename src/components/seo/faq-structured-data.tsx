import Script from 'next/script';

export function FAQStructuredData() {
  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'Puis-je changer de plan à tout moment ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Oui, vous pouvez upgrader ou downgrader votre plan à tout moment. Les changements sont effectifs immédiatement et la facturation est ajustée au prorata.',
        },
      },
      {
        '@type': 'Question',
        name: 'Y a-t-il un engagement de durée ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Non, tous nos plans sont sans engagement. Vous pouvez annuler votre abonnement à tout moment sans frais supplémentaires.',
        },
      },
      {
        '@type': 'Question',
        name: 'Quels moyens de paiement acceptez-vous ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Nous acceptons les cartes bancaires (Visa, Mastercard, Amex) et les virements bancaires pour les plans Entreprise.',
        },
      },
      {
        '@type': 'Question',
        name: 'Mes données sont-elles sécurisées ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Absolument. Nous utilisons un chiffrement SSL et nos serveurs sont hébergés en Europe avec des sauvegardes quotidiennes. Vos données sont conformes au RGPD.',
        },
      },
      {
        '@type': 'Question',
        name: 'Puis-je essayer avant de payer ?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Oui ! Le plan gratuit vous permet de tester toutes les fonctionnalités de base sans carte bancaire. Vous pourrez upgrader quand vous serez prêt.',
        },
      },
    ],
  };

  return (
    <Script
      id="faq-structured-data"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
    />
  );
}
