"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  createOrganizationSchema,
  type CreateOrganizationInput,
} from "@/lib/schemas/organization";
import { generateSlug } from "@/lib/utils/slug";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

/**
 * Server Action pour créer une nouvelle organisation
 * @param data - Les données du formulaire (nom de l'organisation)
 * @returns Objet avec succès ou erreur
 */
export async function createOrganizationAction(data: CreateOrganizationInput) {
  try {
    // Validation des données
    const validatedData = createOrganizationSchema.parse(data);

    // Vérification de la session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return {
        success: false,
        error: "Vous devez être connecté pour créer une organisation",
      };
    }

    // Génération du slug
    const baseSlug = generateSlug(validatedData.name);
    let slug = baseSlug;
    let counter = 1;

    // Vérification de l'unicité du slug
    while (true) {
      const existingOrg = await prisma.organization.findUnique({
        where: { slug },
        select: { id: true },
      });

      if (!existingOrg) {
        break;
      }

      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Création de l'organisation
    const organization = await prisma.organization.create({
      data: {
        id: crypto.randomUUID(),
        name: validatedData.name,
        slug,
        createdAt: new Date(),
        members: {
          create: {
            id: crypto.randomUUID(),
            userId: session.user.id,
            role: "owner",
            createdAt: new Date(),
          },
        },
      },
      select: {
        id: true,
        slug: true,
        name: true,
      },
    });

    console.log(
      `[Organization] Created organization "${organization.name}" (${organization.slug}) for user ${session.user.id}`
    );

    // Redirection vers le dashboard de l'organisation
    redirect(`/dashboard/${organization.slug}`);
  } catch (error) {
    console.error("[Organization] Error creating organization:", error);

    if (error instanceof Error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: false,
      error: "Une erreur est survenue lors de la création de l'organisation",
    };
  }
}
