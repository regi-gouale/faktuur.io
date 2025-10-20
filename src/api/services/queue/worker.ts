#!/usr/bin/env tsx
/**
 * Worker standalone pour traiter les jobs en background
 *
 * Utilisation :
 *   pnpm tsx src/api/services/queue/worker.ts
 *
 * Ou en arrière-plan :
 *   pnpm tsx src/api/services/queue/worker.ts &
 */

// Charger les variables d'environnement AVANT tout import
import dotenv from 'dotenv';
dotenv.config();

import { getQueueEnv } from '@/lib/env';
import { getWorkerManager } from './workers';

console.log('🚀 Démarrage du worker BullMQ...\n');

// Valider les variables d'environnement
try {
  const env = getQueueEnv();
  console.log('✅ Configuration validée');
  console.log(`📊 Concurrency: ${env.QUEUE_CONCURRENCY}`);
  console.log(`🔌 Redis: ${env.REDIS_HOST}:${env.REDIS_PORT}\n`);
} catch (error) {
  console.error('❌ Erreur de configuration:', error);
  process.exit(1);
}

// Démarrer les workers
const workerManager = getWorkerManager();

// Gérer l'arrêt gracieux
process.on('SIGTERM', async () => {
  console.log('\n⚠️ Signal SIGTERM reçu, arrêt du worker...');
  await workerManager.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('\n⚠️ Signal SIGINT reçu, arrêt du worker...');
  await workerManager.close();
  process.exit(0);
});

console.log('✅ Worker démarré et prêt à traiter des jobs');
console.log('🛑 Appuyez sur Ctrl+C pour arrêter\n');

// Garder le processus en vie
process.stdin.resume();
