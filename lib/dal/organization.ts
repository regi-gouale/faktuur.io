import { prisma } from "@/lib/prisma";

/**
 * Récupère le slug de la première organisation d'un utilisateur
 * Optimisé avec sélection minimale des champs
 */
export async function getUserFirstOrganizationSlug(
  userId: string
): Promise<string | undefined> {
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
}
