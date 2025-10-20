import { getQueueEnv } from '@/lib/env';
import { Job, Worker } from 'bullmq';
import { sendEmail } from '../../email';
import { defaultQueueOptions } from '../redis';
import { EmailJobPayload, JobResult, QueueName } from '../types';

/**
 * Worker pour traiter les jobs d'email
 */
export class EmailWorker {
  private worker: Worker;

  constructor() {
    const env = getQueueEnv();

    this.worker = new Worker(
      QueueName.EMAIL,
      async (job: Job<EmailJobPayload>) => {
        return await this.process(job);
      },
      {
        ...defaultQueueOptions,
        concurrency: env.QUEUE_CONCURRENCY || 5,
        limiter: {
          max: 10, // Maximum 10 jobs
          duration: 1000, // par seconde
        },
      }
    );

    this.setupEventHandlers();
  }

  /**
   * Traiter un job d'email
   */
  private async process(job: Job<EmailJobPayload>): Promise<JobResult> {
    const { to, template, data } = job.data;

    console.log(`📧 Traitement du job email ${job.id} - Template: ${template}`);

    try {
      // Convertir le destinataire en string si c'est un tableau
      const recipient = Array.isArray(to) ? to[0] : to;

      const result = await sendEmail({
        to: recipient,
        templateType: template as
          | 'WELCOME'
          | 'PASSWORD_RESET'
          | 'EMAIL_VERIFICATION'
          | 'INVOICE_REMINDER'
          | 'PAYMENT_RECEIVED',
        variables: data as Record<string, string | number | boolean>,
      });

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error(`❌ Erreur lors de l'envoi de l'email ${job.id}:`, errorMessage);

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Configurer les gestionnaires d'événements
   */
  private setupEventHandlers(): void {
    this.worker.on('completed', (job) => {
      console.log(`✅ Email job ${job.id} complété avec succès`);
    });

    this.worker.on('failed', (job, err) => {
      console.error(`❌ Email job ${job?.id} échoué:`, err.message);
    });

    this.worker.on('error', (err) => {
      console.error('❌ Erreur du worker email:', err);
    });

    this.worker.on('stalled', (jobId) => {
      console.warn(`⚠️ Email job ${jobId} est bloqué`);
    });

    this.worker.on('progress', (job, progress) => {
      console.log(`📊 Email job ${job.id} - Progression: ${progress}%`);
    });
  }

  /**
   * Fermer le worker
   */
  async close(): Promise<void> {
    await this.worker.close();
    console.log('🔒 Email worker fermé');
  }

  /**
   * Obtenir le worker
   */
  getWorker(): Worker {
    return this.worker;
  }
}
