import { getQueueEnv } from '@/lib/env';
import { Redis } from 'ioredis';

/**
 * Configuration Redis pour BullMQ
 */
export function createRedisConnection(): Redis {
  const env = getQueueEnv();

  // Si REDIS_URL est fourni, l'utiliser directement
  if (env.REDIS_URL) {
    return new Redis(env.REDIS_URL, {
      maxRetriesPerRequest: null,
      enableReadyCheck: false,
    });
  }

  // Sinon, utiliser les variables individuelles
  return new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });
}

/**
 * Options par défaut pour BullMQ
 */
export const defaultQueueOptions = {
  connection: createRedisConnection(),
};
