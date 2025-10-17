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

export const loginSchema = z.object({
  email: z.email("L'email doit être valide"),
  password: z
    .string()
    .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères." })
    .max(128, {
      message: "Le mot de passe doit contenir au maximum 128 caractères.",
    })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/,
      {
        message:
          "Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial (@$!%*?&)",
      }
    ),
});

export const signupSchema = z.object({
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.email("L'email doit être valide"),
  company: z.string().optional(),
  password: z
    .string()
    .min(8, { message: "Le mot de passe doit contenir au moins 8 caractères." })
    .max(128, {
      message: "Le mot de passe doit contenir au maximum 128 caractères.",
    })
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/,
      {
        message:
          "Le mot de passe doit contenir au moins une minuscule, une majuscule, un chiffre et un caractère spécial (@$!%*?&)",
      }
    ),
});
