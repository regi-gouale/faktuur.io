import { z } from "zod";

/**
 * Schéma de validation pour un utilisateur dans les composants publics
 */
export const PublicUserSchema = z.object({
  name: z.string().min(1, "Le nom est requis").trim(),
  email: z.string().email("Email invalide"),
  image: z
    .url("URL d'image invalide")
    .optional()
    .transform((val) => val ?? undefined),
});

export type PublicUser = z.infer<typeof PublicUserSchema>;

/**
 * Valide et transforme les données utilisateur en type sécurisé
 */
export function validatePublicUser(
  user: unknown
): PublicUser | { error: string } {
  try {
    return PublicUserSchema.parse(user);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const messages = error.issues
        .map((issue: z.core.$ZodIssue) => issue.message)
        .join(", ");
      return {
        error: `Données utilisateur invalides: ${messages}`,
      };
    }
    return { error: "Erreur de validation utilisateur" };
  }
}
