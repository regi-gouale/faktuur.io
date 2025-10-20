import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { HonoAdapter } from '@bull-board/hono';
import { getQueueManager, QueueName } from '../services/queue';

/**
 * Créer le dashboard Bull Board pour Hono
 * Compatible avec Next.js + Node.js
 */
export function createQueueDashboard() {
  // Pour Next.js avec Hono, on utilise un handler vide
  const serverAdapter = new HonoAdapter(() => async () => {
    return new Response('Static files', { status: 200 });
  });

  serverAdapter.setBasePath('/api/admin/queues');

  const queueManager = getQueueManager();

  createBullBoard({
    queues: [
      new BullMQAdapter(queueManager.getQueue(QueueName.EMAIL)),
      new BullMQAdapter(queueManager.getQueue(QueueName.PDF)),
    ],
    serverAdapter,
  });

  return serverAdapter;
}
