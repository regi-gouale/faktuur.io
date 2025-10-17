import { FeatureSection } from "@/components/marketing/feature-section";
import { HeroSection } from "@/components/marketing/hero-section";
import SupportSection from "@/components/marketing/support-section";
import { WorkflowSection } from "@/components/marketing/workflow-section";
import { auth } from "@/lib/auth";
import { marketingMetadata } from "@/lib/metadata";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import { headers } from "next/headers";

export const metadata: Metadata = marketingMetadata;

export default async function Home() {
  // Récupérer la session utilisateur
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Si connecté, récupérer l'organisation par défaut
  let orgSlug: string | undefined;
  if (session?.user?.id) {
    const membership = await prisma.member.findFirst({
      where: {
        userId: session.user.id,
      },
      include: {
        organization: true,
      },
      orderBy: {
        createdAt: "asc",
      },
    });
    orgSlug = membership?.organization?.slug ?? undefined;
  }
  return (
    <>
      <HeroSection />
      <FeatureSection />
      <WorkflowSection />
      <SupportSection />
    </>
  );
}
