import { getQueueManager, QueueName } from '@/api/services/queue';
import { Hono } from 'hono';

const queueStatsRouter = new Hono();

/**
 * GET /api/admin/queue-stats
 * Récupérer les statistiques de toutes les queues
 */
queueStatsRouter.get('/', async (c) => {
  try {
    const queueManager = getQueueManager();
    const queues = [QueueName.EMAIL, QueueName.PDF];

    const stats = await Promise.all(
      queues.map(async (queueName) => {
        const queue = queueManager.getQueue(queueName);
        const counts = await queue.getJobCounts();

        return {
          name: queueName,
          waiting: counts.waiting || 0,
          active: counts.active || 0,
          completed: counts.completed || 0,
          failed: counts.failed || 0,
          delayed: counts.delayed || 0,
          paused: counts.paused || 0,
        };
      })
    );

    return c.json({ success: true, data: stats });
  } catch (error: any) {
    console.error('Error fetching queue stats:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

/**
 * GET /api/admin/queue-stats/:queueName
 * Récupérer les statistiques d'une queue spécifique
 */
queueStatsRouter.get('/:queueName', async (c) => {
  try {
    const queueName = c.req.param('queueName') as QueueName;
    const queueManager = getQueueManager();
    const queue = queueManager.getQueue(queueName);

    const counts = await queue.getJobCounts();

    return c.json({
      success: true,
      data: {
        name: queueName,
        waiting: counts.waiting || 0,
        active: counts.active || 0,
        completed: counts.completed || 0,
        failed: counts.failed || 0,
        delayed: counts.delayed || 0,
        paused: counts.paused || 0,
      },
    });
  } catch (error: any) {
    console.error('Error fetching queue stats:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

/**
 * POST /api/admin/queue-stats/:queueName/pause
 * Mettre en pause une queue
 */
queueStatsRouter.post('/:queueName/pause', async (c) => {
  try {
    const queueName = c.req.param('queueName') as QueueName;
    const queueManager = getQueueManager();
    await queueManager.pause(queueName);

    return c.json({ success: true, message: `Queue ${queueName} mise en pause` });
  } catch (error: any) {
    console.error('Error pausing queue:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

/**
 * POST /api/admin/queue-stats/:queueName/resume
 * Reprendre une queue
 */
queueStatsRouter.post('/:queueName/resume', async (c) => {
  try {
    const queueName = c.req.param('queueName') as QueueName;
    const queueManager = getQueueManager();
    await queueManager.resume(queueName);

    return c.json({ success: true, message: `Queue ${queueName} reprise` });
  } catch (error: any) {
    console.error('Error resuming queue:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

/**
 * POST /api/admin/queue-stats/:queueName/clean
 * Nettoyer les jobs terminés d'une queue
 */
queueStatsRouter.post('/:queueName/clean', async (c) => {
  try {
    const queueName = c.req.param('queueName') as QueueName;
    const queueManager = getQueueManager();

    await queueManager.clean(queueName, 0);

    return c.json({
      success: true,
      message: `Jobs nettoyés de la queue ${queueName}`,
    });
  } catch (error: any) {
    console.error('Error cleaning queue:', error);
    return c.json({ success: false, error: error.message }, 500);
  }
});

export default queueStatsRouter;
