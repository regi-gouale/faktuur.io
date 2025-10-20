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
      lazyConnect: true, // Ne pas se connecter immédiatement
    });
  }

  // Sinon, utiliser les variables individuelles
  return new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD,
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    lazyConnect: true, // Ne pas se connecter immédiatement
  });
}

/**
 * Options par défaut pour BullMQ
 * Lazy initialization pour éviter la connexion pendant le build
 */
export function getDefaultQueueOptions() {
  return {
    connection: createRedisConnection(),
  };
}
