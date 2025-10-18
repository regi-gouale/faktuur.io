import { z } from "zod";

/**
 * Schéma de validation pour la création d'une organisation
 */
export const createOrganizationSchema = z.object({
  name: z
    .string()
    .min(2, "Le nom de l'organisation doit contenir au moins 2 caractères")
    .max(
      100,
      "Le nom de l'organisation doit contenir au maximum 100 caractères"
    )
    .trim(),
  logo: z.url("Le logo doit être une URL valide").optional().or(z.literal("")),
});

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
