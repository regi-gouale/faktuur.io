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
  console.log(`🔌 Redis: ${env.REDIS_HOST}:${env.REDIS_PORT}`);
  if (env.REDIS_PASSWORD) {
    console.log('🔐 Redis authentifié : ✓');
  }
  console.log();
} catch (error) {
  console.error('❌ Erreur de configuration:', error);
  process.exit(1);
}

// Démarrer les workers
const workerManager = getWorkerManager();

/**
 * Arrêt gracieux avec timeout de sécurité
 */
async function gracefulShutdown(signal: string) {
  console.log(`\n⚠️  Signal ${signal} reçu, arrêt du worker...`);
  console.log('🛑 Arrêt des workers...\n');

  const timeout = setTimeout(() => {
    console.error("❌ Timeout lors de l'arrêt (10s), force kill");
    process.exit(1);
  }, 10000); // 10s max pour l'arrêt

  try {
    await workerManager.close();
    clearTimeout(timeout);
    console.log('✅ Tous les workers sont arrêtés proprement');
    process.exit(0);
  } catch (error) {
    clearTimeout(timeout);
    console.error("❌ Erreur lors de l'arrêt:", error);
    process.exit(1);
  }
}

// Gérer l'arrêt gracieux
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

console.log('✅ Worker démarré et prêt à traiter des jobs');
console.log('🛑 Appuyez sur Ctrl+C pour arrêter\n');

// Garder le processus en vie
process.stdin.resume();
