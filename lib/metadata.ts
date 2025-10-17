import type { Metadata } from "next";

const DESCRIPTION =
  "Créez vos devis et factures en ligne gratuitement. Logiciel simple et intuitif pour freelances, auto-entrepreneurs et TPE. Envoi par email, export PDF, suivi des paiements. Conforme à la réglementation française.";

const TITLE =
  "Logiciel de facturation gratuit pour freelances et auto-entrepreneurs";

const KEYWORDS = [
  "logiciel facturation gratuit",
  "créer facture en ligne",
  "devis gratuit",
  "facturation freelance",
  "logiciel devis auto-entrepreneur",
  "gestion facturation TPE",
  "facture conforme",
  "suivi paiement facture",
] as const satisfies ReadonlyArray<string>;

export const marketingMetadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  keywords: [...KEYWORDS],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "faktuur.io - Logiciel de facturation pour freelances",
    description: DESCRIPTION,
    url: "/",
    type: "website",
  },
};

export function buildMarketingMetadata(
  overrides?: Partial<Metadata>
): Metadata {
  return {
    ...marketingMetadata,
    ...overrides,
    openGraph: {
      ...marketingMetadata.openGraph,
      ...overrides?.openGraph,
    },
    twitter: {
      card: "summary_large_image",
      title: overrides?.title ?? TITLE,
      description: overrides?.description ?? DESCRIPTION,
      images: ["/og-image.png"],
      creator: "@solidecotizoo",
      ...overrides?.twitter,
    },
  };
}
