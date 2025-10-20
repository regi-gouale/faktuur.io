export { QueueManager, getQueueManager } from './manager';
export { WorkerManager, getWorkerManager, EmailWorker, PDFWorker } from './workers';
export { QueueName } from './types';
export type {
  JobPayload,
  JobResult,
  JobOptions,
  EmailJobPayload,
  PDFJobPayload,
  NotificationJobPayload,
} from './types';

// Helpers pour ajouter des jobs rapidement
import { getQueueManager } from './manager';
import { QueueName, EmailJobPayload, PDFJobPayload, JobOptions } from './types';

/**
 * Helper pour envoyer un email via la queue
 */
export async function queueEmail(payload: EmailJobPayload, options?: JobOptions) {
  const manager = getQueueManager();
  return await manager.addJob(QueueName.EMAIL, 'send-email', payload, options);
}

/**
 * Helper pour générer un PDF via la queue
 */
export async function queuePDF(payload: PDFJobPayload, options?: JobOptions) {
  const manager = getQueueManager();
  return await manager.addJob(QueueName.PDF, 'generate-pdf', payload, options);
}

/**
 * Helper pour envoyer plusieurs emails en masse
 */
export async function queueEmailBatch(
  emails: Array<{ payload: EmailJobPayload; options?: JobOptions }>
) {
  const manager = getQueueManager();
  return await manager.addBulk(
    QueueName.EMAIL,
    emails.map((email, index) => ({
      name: `send-email-${index}`,
      data: email.payload,
      opts: email.options,
    }))
  );
}
