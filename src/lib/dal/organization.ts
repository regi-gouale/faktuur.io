import { prisma } from "@/lib/prisma";
import { trackQueryPerformance } from "../types/monitoring";

/**
 * Récupère le slug de la première organisation d'un utilisateur
 * Optimisé avec sélection minimale des champs
 */
export async function getUserFirstOrganizationSlug(
  userId: string
): Promise<string | undefined> {
  return trackQueryPerformance("getUserFirstOrganizationSlug", async () => {
    const membership = await prisma.member.findFirst({
      where: { userId },
      select: {
        organization: {
          select: {
            slug: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return membership?.organization?.slug;
  }) as Promise<string | undefined>;
}

/**
 * Vérifie si un utilisateur est membre d'une organisation
 * @param userId - ID de l'utilisateur
 * @param organizationSlug - Slug de l'organisation
 * @returns true si l'utilisateur est membre, false sinon
 */
export async function isUserMemberOfOrganization(
  userId: string,
  organizationSlug: string
): Promise<boolean> {
  const start = performance.now();
  try {
    const membership = await prisma.member.findFirst({
      where: {
        userId,
        organization: {
          slug: organizationSlug,
        },
      },
      select: {
        id: true, // Sélection minimale pour performance
      },
    });

    return membership !== null;
  } finally {
    const duration = performance.now() - start;
    console.log(
      `[Performance] isUserMemberOfOrganization: ${duration.toFixed(2)}ms`
    );
  }
}

/**
 * Récupère les informations d'une organisation avec vérification d'appartenance
 * @param userId - ID de l'utilisateur
 * @param organizationSlug - Slug de l'organisation
 * @returns Informations de l'organisation si l'utilisateur est membre, null sinon
 */
export async function getOrganizationForUser(
  userId: string,
  organizationSlug: string
): Promise<{
  id: string;
  name: string;
  slug: string;
  logo: string | null;
  role: string;
} | null> {
  const start = performance.now();
  try {
    const membership = await prisma.member.findFirst({
      where: {
        userId,
        organization: {
          slug: organizationSlug,
        },
      },
      select: {
        role: true,
        organization: {
          select: {
            id: true,
            name: true,
            slug: true,
            logo: true,
          },
        },
      },
    });

    if (!membership) {
      return null;
    }

    return {
      ...membership.organization,
      role: membership.role,
    };
  } finally {
    const duration = performance.now() - start;
    console.log(
      `[Performance] getOrganizationForUser: ${duration.toFixed(2)}ms`
    );
  }
}
