import { Queue, QueueOptions } from 'bullmq';
import { getDefaultQueueOptions } from './redis';
import { JobOptions, JobPayload, QueueName } from './types';

/**
 * Gestionnaire de queues BullMQ
 */
export class QueueManager {
  private queues: Map<QueueName, Queue>;

  constructor() {
    this.queues = new Map();
  }

  /**
   * Obtenir ou créer une queue
   */
  getQueue(name: QueueName, options?: Partial<QueueOptions>): Queue {
    if (!this.queues.has(name)) {
      const queue = new Queue(name, {
        ...getDefaultQueueOptions(),
        ...options,
        defaultJobOptions: {
          attempts: 3,
          backoff: {
            type: 'exponential',
            delay: 2000,
          },
          removeOnComplete: {
            count: 100, // Garder les 100 derniers jobs complétés
          },
          removeOnFail: {
            count: 500, // Garder les 500 derniers jobs échoués
          },
          ...options?.defaultJobOptions,
        },
      });

      this.queues.set(name, queue);
      console.log(`✅ Queue "${name}" créée`);
    }

    return this.queues.get(name)!;
  }

  /**
   * Ajouter un job à une queue
   */
  async addJob<T extends JobPayload>(
    queueName: QueueName,
    jobName: string,
    payload: T,
    options?: JobOptions
  ) {
    const queue = this.getQueue(queueName);

    const job = await queue.add(jobName, payload, {
      priority: options?.priority,
      delay: options?.delay,
      attempts: options?.attempts,
      backoff: options?.backoff,
      removeOnComplete: options?.removeOnComplete,
      removeOnFail: options?.removeOnFail,
    });

    console.log(`📨 Job "${jobName}" ajouté à la queue "${queueName}" avec l'ID ${job.id}`);

    return job;
  }

  /**
   * Ajouter plusieurs jobs en masse
   */
  async addBulk<T extends JobPayload>(
    queueName: QueueName,
    jobs: Array<{
      name: string;
      data: T;
      opts?: JobOptions;
    }>
  ) {
    const queue = this.getQueue(queueName);

    const bulkJobs = jobs.map((job) => ({
      name: job.name,
      data: job.data,
      opts: {
        priority: job.opts?.priority,
        delay: job.opts?.delay,
        attempts: job.opts?.attempts,
        backoff: job.opts?.backoff,
        removeOnComplete: job.opts?.removeOnComplete,
        removeOnFail: job.opts?.removeOnFail,
      },
    }));

    const addedJobs = await queue.addBulk(bulkJobs);

    console.log(`📦 ${addedJobs.length} jobs ajoutés en masse à la queue "${queueName}"`);

    return addedJobs;
  }

  /**
   * Obtenir un job par son ID
   */
  async getJob(queueName: QueueName, jobId: string) {
    const queue = this.getQueue(queueName);
    return await queue.getJob(jobId);
  }

  /**
   * Obtenir les statistiques d'une queue
   */
  async getQueueStats(queueName: QueueName) {
    const queue = this.getQueue(queueName);

    const [waiting, active, completed, failed, delayed] = await Promise.all([
      queue.getWaitingCount(),
      queue.getActiveCount(),
      queue.getCompletedCount(),
      queue.getFailedCount(),
      queue.getDelayedCount(),
    ]);

    return {
      waiting,
      active,
      completed,
      failed,
      delayed,
      total: waiting + active + completed + failed + delayed,
    };
  }

  /**
   * Nettoyer les jobs complétés et échoués
   */
  async clean(queueName: QueueName, grace: number = 3600000) {
    const queue = this.getQueue(queueName);

    await queue.clean(grace, 1000, 'completed');
    await queue.clean(grace, 1000, 'failed');

    console.log(`🧹 Queue "${queueName}" nettoyée`);
  }

  /**
   * Vider complètement une queue
   */
  async drain(queueName: QueueName) {
    const queue = this.getQueue(queueName);
    await queue.drain();
    console.log(`🗑️ Queue "${queueName}" vidée`);
  }

  /**
   * Mettre une queue en pause
   */
  async pause(queueName: QueueName) {
    const queue = this.getQueue(queueName);
    await queue.pause();
    console.log(`⏸️ Queue "${queueName}" en pause`);
  }

  /**
   * Reprendre une queue
   */
  async resume(queueName: QueueName) {
    const queue = this.getQueue(queueName);
    await queue.resume();
    console.log(`▶️ Queue "${queueName}" reprise`);
  }

  /**
   * Fermer toutes les queues
   */
  async close() {
    for (const [name, queue] of this.queues.entries()) {
      await queue.close();
      console.log(`🔒 Queue "${name}" fermée`);
    }
    this.queues.clear();
  }
}

// Instance singleton
let queueManager: QueueManager | null = null;

export function getQueueManager(): QueueManager {
  if (!queueManager) {
    queueManager = new QueueManager();
  }
  return queueManager;
}
