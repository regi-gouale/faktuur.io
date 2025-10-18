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
});

export type CreateOrganizationInput = z.infer<typeof createOrganizationSchema>;
