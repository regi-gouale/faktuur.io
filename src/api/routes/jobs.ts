import {
  getQueueManager,
  queueEmail,
  QueueName,
  queuePDF,
  type EmailJobPayload,
  type PDFJobPayload,
} from '@/api/services/queue';
import { getWorkerManager } from '@/api/services/queue/workers';
import { requireAdmin } from '@/lib/middleware/admin';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { rateLimiter } from 'hono-rate-limiter';
import { z } from 'zod';

const jobsRoute = new Hono();

/**
 * Rate Limiting : Protection contre le spam de jobs
 * 20 jobs par minute maximum par IP
 */
const jobRateLimiter = rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  limit: 20, // 20 requêtes max par minute
  standardHeaders: 'draft-6',
  keyGenerator: (c) => {
    // Utiliser l'IP du client
    return c.req.header('x-forwarded-for') || c.req.header('x-real-ip') || 'anonymous';
  },
  handler: (c) => {
    return c.json(
      {
        success: false,
        error: 'Trop de requêtes. Veuillez réessayer dans quelques instants.',
      },
      429
    );
  },
});

/**
 * Middleware : Protéger toutes les routes jobs (admin uniquement)
 */
jobsRoute.use('/*', requireAdmin);

/**
 * Middleware : Rate limiting sur la création de jobs
 */
jobsRoute.post('/', jobRateLimiter);

/**
 * Schémas de validation stricts avec discriminated union
 */
const jobOptionsSchema = z
  .object({
    priority: z.number().min(1).max(10).optional(),
    delay: z.number().min(0).max(86400000).optional(), // Max 24h en ms
    attempts: z.number().min(1).max(5).optional(),
  })
  .optional();

const createJobSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('email'),
    payload: z.object({
      to: z.union([z.string().email(), z.array(z.string().email())]),
      template: z.string().min(1),
      data: z.record(z.string(), z.unknown()),
      from: z.string().email().optional(),
      subject: z.string().optional(),
      attachments: z
        .array(
          z.object({
            filename: z.string(),
            path: z.string().optional(),
            content: z.any().optional(),
          })
        )
        .optional(),
    }),
    options: jobOptionsSchema,
  }),
  z.object({
    type: z.literal('pdf'),
    payload: z.object({
      type: z.enum(['invoice', 'quote', 'report']),
      documentId: z.string().uuid('Invalid document ID'),
      userId: z.string().uuid().optional(),
      organizationId: z.string().uuid().optional(),
      options: z
        .object({
          format: z.enum(['A4', 'Letter']).optional(),
          orientation: z.enum(['portrait', 'landscape']).optional(),
          margin: z
            .object({
              top: z.string().optional(),
              right: z.string().optional(),
              bottom: z.string().optional(),
              left: z.string().optional(),
            })
            .optional(),
        })
        .optional(),
    }),
    options: jobOptionsSchema,
  }),
]);

/**
 * POST /api/jobs - Créer un nouveau job
 */
jobsRoute.post('/', zValidator('json', createJobSchema), async (c) => {
  const { type, payload, options } = c.req.valid('json');

  try {
    let job;

    if (type === 'email') {
      job = await queueEmail(payload as EmailJobPayload, options);
    } else if (type === 'pdf') {
      job = await queuePDF(payload as PDFJobPayload, options);
    }

    return c.json({
      success: true,
      data: {
        id: job!.id,
        name: job!.name,
        queueName: job!.queueName,
        timestamp: job!.timestamp,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ success: false, error: message }, 500);
  }
});

/**
 * GET /api/jobs/:queue/:id - Obtenir les détails d'un job
 */
jobsRoute.get('/:queue/:id', async (c) => {
  const { queue, id } = c.req.param();
  const manager = getQueueManager();

  try {
    const queueName = queue as QueueName;
    const job = await manager.getJob(queueName, id);

    if (!job) {
      return c.json({ success: false, error: 'Job not found' }, 404);
    }

    const state = await job.getState();

    return c.json({
      success: true,
      data: {
        id: job.id,
        name: job.name,
        data: job.data,
        state,
        progress: job.progress,
        attemptsMade: job.attemptsMade,
        timestamp: job.timestamp,
        processedOn: job.processedOn,
        finishedOn: job.finishedOn,
        returnvalue: job.returnvalue,
        failedReason: job.failedReason,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ success: false, error: message }, 500);
  }
});

/**
 * GET /api/jobs/stats/:queue - Obtenir les statistiques d'une queue
 */
jobsRoute.get('/stats/:queue', async (c) => {
  const { queue } = c.req.param();
  const manager = getQueueManager();

  try {
    const queueName = queue as QueueName;
    const stats = await manager.getQueueStats(queueName);

    return c.json({
      success: true,
      data: stats,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ success: false, error: message }, 500);
  }
});

/**
 * POST /api/jobs/:queue/clean - Nettoyer une queue
 */
jobsRoute.post('/:queue/clean', async (c) => {
  const { queue } = c.req.param();
  const manager = getQueueManager();

  try {
    const queueName = queue as QueueName;
    await manager.clean(queueName);

    return c.json({
      success: true,
      message: `Queue ${queue} cleaned successfully`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ success: false, error: message }, 500);
  }
});

/**
 * POST /api/jobs/:queue/pause - Mettre une queue en pause
 */
jobsRoute.post('/:queue/pause', async (c) => {
  const { queue } = c.req.param();
  const manager = getQueueManager();

  try {
    const queueName = queue as QueueName;
    await manager.pause(queueName);

    return c.json({
      success: true,
      message: `Queue ${queue} paused successfully`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ success: false, error: message }, 500);
  }
});

/**
 * POST /api/jobs/:queue/resume - Reprendre une queue
 */
jobsRoute.post('/:queue/resume', async (c) => {
  const { queue } = c.req.param();
  const manager = getQueueManager();

  try {
    const queueName = queue as QueueName;
    await manager.resume(queueName);

    return c.json({
      success: true,
      message: `Queue ${queue} resumed successfully`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ success: false, error: message }, 500);
  }
});

/**
 * DELETE /api/jobs/:queue/:id - Annuler/supprimer un job
 */
jobsRoute.delete('/:queue/:id', async (c) => {
  const { queue, id } = c.req.param();
  const manager = getQueueManager();

  try {
    const queueName = queue as QueueName;
    const job = await manager.getJob(queueName, id);

    if (!job) {
      return c.json({ success: false, error: 'Job not found' }, 404);
    }

    await job.remove();

    return c.json({
      success: true,
      message: `Job ${id} removed successfully`,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ success: false, error: message }, 500);
  }
});

/**
 * GET /api/jobs/metrics - Obtenir les métriques des workers
 */
jobsRoute.get('/metrics', async (c) => {
  try {
    const workerManager = getWorkerManager();
    const emailMetrics = workerManager.getEmailWorker()?.getMetrics();
    const pdfMetrics = workerManager.getPDFWorker()?.getMetrics();

    return c.json({
      success: true,
      data: {
        email: emailMetrics || null,
        pdf: pdfMetrics || null,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return c.json({ success: false, error: message }, 500);
  }
});

export default jobsRoute;
