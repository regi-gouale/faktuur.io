/**
 * Health Check Route
 * Endpoint pour vérifier l'état de santé de l'application
 */

import { prisma } from '@/lib/prisma';
import { Hono } from 'hono';
import { getQueueManager, QueueName } from '../services/queue';

const health = new Hono();

/**
 * GET /api/health
 * Simple health check
 */
health.get('/', (c) => {
  return c.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

/**
 * GET /api/health/detailed
 * Health check détaillé avec vérification des services
 */
health.get('/detailed', async (c) => {
  const checks: Record<string, { status: 'ok' | 'error'; message?: string }> = {
    api: { status: 'ok' },
    database: { status: 'ok' },
    redis: { status: 'ok' },
  };

  // Vérifier la connexion à la base de données
  try {
    await prisma.$queryRaw`SELECT 1`;
    checks.database = { status: 'ok' };
  } catch (error) {
    checks.database = {
      status: 'error',
      message: error instanceof Error ? error.message : 'Database connection failed',
    };
  }

  // Vérifier la connexion à Redis
  try {
    const queueManager = getQueueManager();
    const emailQueue = queueManager.getQueue(QueueName.EMAIL);
    // Vérifier que la queue est accessible
    await emailQueue.getJobCounts();
    checks.redis = { status: 'ok' };
  } catch (error) {
    checks.redis = {
      status: 'error',
      message: error instanceof Error ? error.message : 'Redis connection failed',
    };
  }

  const isHealthy = Object.values(checks).every((check) => check.status === 'ok');

  return c.json(
    {
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      checks,
    },
    isHealthy ? 200 : 503
  );
});

/**
 * GET /api/health/ready
 * Kubernetes-style readiness probe
 */
health.get('/ready', async (c) => {
  try {
    // Vérifier que tous les services critiques sont disponibles
    await prisma.$queryRaw`SELECT 1`;
    const queueManager = getQueueManager();
    const emailQueue = queueManager.getQueue(QueueName.EMAIL);
    await emailQueue.getJobCounts();

    return c.json({ ready: true }, 200);
  } catch (error) {
    return c.json(
      {
        ready: false,
        error: error instanceof Error ? error.message : 'Service not ready',
      },
      503
    );
  }
});

/**
 * GET /api/health/live
 * Kubernetes-style liveness probe
 */
health.get('/live', (c) => {
  return c.json({ alive: true }, 200);
});

export default health;
