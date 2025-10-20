import { defaultQueueOptions } from '@/api/services/queue/redis';
import { JobResult, PDFJobPayload, QueueName } from '@/api/services/queue/types';
import { getQueueEnv } from '@/lib/env';
import { Job, Worker } from 'bullmq';

/**
 * Worker pour traiter les jobs de génération PDF
 */
export class PDFWorker {
  private worker: Worker;
  private metrics = {
    pdfGenerated: 0,
    pdfFailed: 0,
    totalProcessingTime: 0,
    lastProcessedAt: null as Date | null,
  };

  constructor() {
    const env = getQueueEnv();

    this.worker = new Worker(
      QueueName.PDF,
      async (job: Job<PDFJobPayload>) => {
        return await this.process(job);
      },
      {
        ...defaultQueueOptions,
        concurrency: env.QUEUE_CONCURRENCY || 5,
        limiter: {
          max: 5, // Maximum 5 PDFs
          duration: 1000, // par seconde (les PDFs sont plus lourds)
        },
      }
    );

    this.setupEventHandlers();
  }

  /**
   * Traiter un job de génération PDF
   */
  private async process(job: Job<PDFJobPayload>): Promise<JobResult> {
    const { type, documentId } = job.data;
    const startTime = Date.now();

    console.log(`📄 Traitement du job PDF ${job.id} - Type: ${type}, Document: ${documentId}`);

    try {
      // TODO: Implémenter la génération de PDF avec Puppeteer
      // const pdfBuffer = await generatePDF(type, documentId, options);

      // Pour l'instant, simulation
      await this.simulatePDFGeneration();

      // Mettre à jour les métriques
      const processingTime = Date.now() - startTime;
      this.metrics.pdfGenerated++;
      this.metrics.totalProcessingTime += processingTime;
      this.metrics.lastProcessedAt = new Date();

      console.log(`✅ PDF généré (${processingTime}ms)`);

      return {
        success: true,
        data: {
          documentId,
          type,
          size: 0, // Taille du PDF en bytes
          generatedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      const processingTime = Date.now() - startTime;

      this.metrics.pdfFailed++;
      this.metrics.totalProcessingTime += processingTime;

      console.error(`❌ Erreur lors de la génération du PDF ${job.id}:`, errorMessage);

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Simuler la génération d'un PDF (à remplacer par la vraie implémentation)
   */
  private async simulatePDFGeneration(): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, 1000); // Simulation de 1 seconde
    });
  }

  /**
   * Configurer les gestionnaires d'événements
   */
  private setupEventHandlers(): void {
    this.worker.on('completed', (job) => {
      console.log(`✅ PDF job ${job.id} complété avec succès`);
    });

    this.worker.on('failed', (job, err) => {
      console.error(`❌ PDF job ${job?.id} échoué:`, err.message);
    });

    this.worker.on('error', (err) => {
      console.error('❌ Erreur du worker PDF:', err);
    });

    this.worker.on('stalled', (jobId) => {
      console.warn(`⚠️ PDF job ${jobId} est bloqué`);
    });

    this.worker.on('progress', (job, progress) => {
      console.log(`📊 PDF job ${job.id} - Progression: ${progress}%`);
    });
  }

  /**
   * Fermer le worker
   */
  async close(): Promise<void> {
    await this.worker.close();
    console.log('🔒 PDF worker fermé');
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
      this.metrics.pdfGenerated > 0
        ? this.metrics.totalProcessingTime / this.metrics.pdfGenerated
        : 0;

    return {
      pdfGenerated: this.metrics.pdfGenerated,
      pdfFailed: this.metrics.pdfFailed,
      totalProcessed: this.metrics.pdfGenerated + this.metrics.pdfFailed,
      successRate:
        this.metrics.pdfGenerated + this.metrics.pdfFailed > 0
          ? (
              (this.metrics.pdfGenerated / (this.metrics.pdfGenerated + this.metrics.pdfFailed)) *
              100
            ).toFixed(2) + '%'
          : '0%',
      avgProcessingTime: Math.round(avgProcessingTime),
      lastProcessedAt: this.metrics.lastProcessedAt,
    };
  }
}
