import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { z } from 'zod';
import {
  getQueueManager,
  queueEmail,
  QueueName,
  queuePDF,
  type EmailJobPayload,
  type PDFJobPayload,
} from '../services/queue';

const jobsRoute = new Hono();

/**
 * Schémas de validation
 */
const createJobSchema = z.object({
  type: z.enum(['email', 'pdf']),
  payload: z.record(z.string(), z.unknown()),
  options: z
    .object({
      priority: z.number().optional(),
      delay: z.number().optional(),
      attempts: z.number().optional(),
    })
    .optional(),
});

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

export default jobsRoute;
