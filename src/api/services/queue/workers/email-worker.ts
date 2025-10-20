import { sendEmail } from '@/api/services/email';
import { defaultQueueOptions } from '@/api/services/queue/redis';
import { EmailJobPayload, JobResult, QueueName } from '@/api/services/queue/types';
import { getQueueEnv } from '@/lib/env';
import { EmailTemplate, sendEmailSchema } from '@/lib/schemas/email';
import { Job, Worker } from 'bullmq';

/**
 * Worker pour traiter les jobs d'email
 */
export class EmailWorker {
  private worker: Worker;
  private metrics = {
    emailsSent: 0,
    emailsFailed: 0,
    totalProcessingTime: 0,
    lastProcessedAt: null as Date | null,
  };

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
    const startTime = Date.now();

    console.log(`📧 Traitement du job email ${job.id} - Template: ${template}`);

    try {
      // Convertir le destinataire en string si c'est un tableau
      const recipient = Array.isArray(to) ? to[0] : to;

      // Construire le payload email
      const emailPayload = {
        to: recipient,
        templateType: template as EmailTemplate,
        variables: data as Record<string, string | number | boolean>,
      };

      // Valider le payload avec Zod
      const validated = sendEmailSchema.safeParse(emailPayload);
      if (!validated.success) {
        throw new Error(`Invalid email payload: ${validated.error.message}`);
      }

      // Envoyer l'email avec le payload validé
      const result = await sendEmail(validated.data);

      // Mettre à jour les métriques
      const processingTime = Date.now() - startTime;
      this.metrics.emailsSent++;
      this.metrics.totalProcessingTime += processingTime;
      this.metrics.lastProcessedAt = new Date();

      console.log(`✅ Email envoyé (${processingTime}ms)`);

      return {
        success: true,
        data: result,
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const processingTime = Date.now() - startTime;

      this.metrics.emailsFailed++;
      this.metrics.totalProcessingTime += processingTime;

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

  /**
   * Obtenir les métriques du worker
   */
  getMetrics() {
    const avgProcessingTime =
      this.metrics.emailsSent > 0 ? this.metrics.totalProcessingTime / this.metrics.emailsSent : 0;

    return {
      emailsSent: this.metrics.emailsSent,
      emailsFailed: this.metrics.emailsFailed,
      totalProcessed: this.metrics.emailsSent + this.metrics.emailsFailed,
      successRate:
        this.metrics.emailsSent + this.metrics.emailsFailed > 0
          ? (
              (this.metrics.emailsSent / (this.metrics.emailsSent + this.metrics.emailsFailed)) *
              100
            ).toFixed(2) + '%'
          : '0%',
      avgProcessingTime: Math.round(avgProcessingTime),
      lastProcessedAt: this.metrics.lastProcessedAt,
    };
  }
}
