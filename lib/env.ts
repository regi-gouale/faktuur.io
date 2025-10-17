import { z } from "zod";

const envSchema = z.object({
  // Email configuration
  EMAIL_PROVIDER: z
    .enum(["resend", "nodemailer", "usesend"])
    .default("nodemailer"),
  EMAIL_FROM: z.email("Invalid email address"),

  // Resend configuration
  RESEND_API_KEY: z.string().optional(),

  // UseSend configuration
  USESEND_API_KEY: z.string().optional(),
  USESEND_CONTACT_BOOK_ID: z.string().optional(),

  // Nodemailer configuration
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),

  // Database
  DATABASE_URL: z.url("Invalid database URL"),

  // Auth
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.url("Invalid auth URL"),
});

type Environment = z.infer<typeof envSchema>;

let validated: Environment | null = null;

export function getEnv(): Environment {
  if (validated) return validated;

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error("Environment variables validation failed:", result.error);
    throw new Error("Invalid environment configuration");
  }

  validated = result.data;
  return validated;
}
