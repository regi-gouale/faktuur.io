import { z } from 'zod';

const envSchema = z.object({
  // Email configuration
  EMAIL_PROVIDER: z.enum(['resend', 'nodemailer', 'usesend']).default('nodemailer'),
  EMAIL_FROM: z.email('Invalid email address'),

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

  // Redis configuration
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_URL: z.string().optional(),

  // Queue configuration
  QUEUE_ENABLED: z.coerce.boolean().default(true),
  QUEUE_CONCURRENCY: z.coerce.number().default(5),

  // Database
  DATABASE_URL: z.url('Invalid database URL'),

  // Auth
  BETTER_AUTH_SECRET: z.string(),
  BETTER_AUTH_URL: z.url('Invalid auth URL'),
});

type Environment = z.infer<typeof envSchema>;

let validated: Environment | null = null;

export function getEnv(): Environment {
  if (validated) return validated;

  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    console.error('Environment variables validation failed:', result.error);
    throw new Error('Invalid environment configuration');
  }

  validated = result.data;
  return validated;
}

/**
 * Schéma minimal pour le worker de queue
 * Seules les variables Redis et Queue sont requises
 */
const queueEnvSchema = z.object({
  // Redis configuration
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional(),
  REDIS_URL: z.string().optional(),

  // Queue configuration
  QUEUE_ENABLED: z.coerce.boolean().default(true),
  QUEUE_CONCURRENCY: z.coerce.number().default(5),

  // Email configuration (optionnel pour le worker)
  EMAIL_PROVIDER: z.enum(['resend', 'nodemailer', 'usesend']).default('nodemailer'),
  EMAIL_FROM: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  USESEND_API_KEY: z.string().optional(),
  RESEND_API_KEY: z.string().optional(),

  // Database (optionnel pour le worker)
  DATABASE_URL: z.string().optional(),

  // Auth (optionnel pour le worker)
  BETTER_AUTH_SECRET: z.string().optional(),
  BETTER_AUTH_URL: z.string().optional(),
});

type QueueEnvironment = z.infer<typeof queueEnvSchema>;

let queueValidated: QueueEnvironment | null = null;

/**
 * Obtenir les variables d'environnement pour le worker de queue
 * Validation plus permissive que getEnv()
 */
export function getQueueEnv(): QueueEnvironment {
  if (queueValidated) return queueValidated;

  const result = queueEnvSchema.safeParse(process.env);

  if (!result.success) {
    console.error('Queue environment variables validation failed:', result.error);
    throw new Error('Invalid queue environment configuration');
  }

  queueValidated = result.data;
  return queueValidated;
}
