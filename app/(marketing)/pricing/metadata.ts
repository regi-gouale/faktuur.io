import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tarifs - Plans de facturation adaptés à votre activité",
  description:
    "Découvrez nos tarifs transparents pour freelances et auto-entrepreneurs. Plan gratuit disponible. Devis et factures illimités dès 29€/mois. Sans engagement.",
  keywords: [
    "tarifs facturation",
    "prix logiciel facturation",
    "plan gratuit facturation",
    "abonnement facturation freelance",
    "tarif devis facture",
  ],
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    title: "Tarifs faktuur.io - Plans adaptés aux freelances",
    description:
      "Plan gratuit disponible. Devis et factures illimités dès 29€/mois. Sans engagement.",
    url: "/pricing",
    type: "website",
    images: [
      {
        url: "/og-pricing.png",
        width: 1200,
        height: 630,
        alt: "Tarifs faktuur.io",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tarifs faktuur.io - Plans adaptés aux freelances",
    description:
      "Plan gratuit disponible. Devis et factures illimités dès 29€/mois.",
    images: ["/og-pricing.png"],
  },
};
