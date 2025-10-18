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
    // const organization = await prisma.organization.create({
    //   data: {
    //     id: crypto.randomUUID(),
    //     name: validatedData.name,
    //     slug,
    //     logo: validatedData.logo || null,
    //     createdAt: new Date(),
    //     members: {
    //       create: {
    //         id: crypto.randomUUID(),
    //         userId: session.user.id,
    //         role: "owner",
    //         createdAt: new Date(),
    //       },
    //     },
    //   },
    //   select: {
    //     id: true,
    //     slug: true,
    //     name: true,
    //   },
    // });
    console.log("userId:", session.user.id);

    // Construction de l'URL absolue pour l'appel côté serveur
    const headersList = await headers();
    const host = headersList.get("host") || "localhost:3000";
    const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
    const baseUrl = `${protocol}://${host}`;

    // Récupérer le cookie d'authentification pour l'API Better-auth
    const cookie = headersList.get("cookie") || "";

    const organization = await fetch(
      `${baseUrl}/api/auth/organization/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Cookie: cookie, // Transmettre les cookies pour l'authentification
        },
        body: JSON.stringify({
          name: validatedData.name,
          slug,
          userId: session.user.id,
          logo: validatedData.logo || "",
        }),
      }
    );

    // console.log("organization response:", organization);
    if (organization.status !== 200) {
      throw new Error(organization.statusText);
    }

    const organizationData = await organization.json();

    console.log(
      `[Organization] Created organization "${organizationData.name}" (${organizationData.slug}) for user ${session.user.id}`
    );

    // Redirection vers le dashboard de l'organisation
    redirect(`${baseUrl}/dashboard/${organizationData.slug}`);
  } catch (error) {
    // Ne pas logger l'erreur NEXT_REDIRECT (comportement normal)
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      throw error; // Re-throw pour permettre la redirection
    }

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
