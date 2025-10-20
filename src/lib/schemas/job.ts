import { z } from 'zod';

/**
 * Schéma pour les statistiques de queue
 */
export const queueStatsSchema = z.object({
  waiting: z.number(),
  active: z.number(),
  completed: z.number(),
  failed: z.number(),
  delayed: z.number(),
  total: z.number(),
});

export type QueueStats = z.infer<typeof queueStatsSchema>;

/**
 * Schéma pour un job (conforme au modèle Prisma)
 */
export const jobSchema = z.object({
  id: z.string(),
  type: z.string(),
  status: z.string(),
  priority: z.number(),
  payload: z.string(),
  result: z.string().nullable(),
  error: z.string().nullable(),
  attempts: z.number(),
  maxAttempts: z.number(),
  createdAt: z.date(),
  scheduledAt: z.date().nullable(),
  startedAt: z.date().nullable(),
  completedAt: z.date().nullable(),
  userId: z.string().nullable(),
  organizationId: z.string().nullable(),
});

export type Job = z.infer<typeof jobSchema>;
