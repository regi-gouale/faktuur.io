import { EmailWorker } from './email-worker';
import { PDFWorker } from './pdf-worker';

export { EmailWorker, PDFWorker };

/**
 * Gestionnaire centralisé des workers
 */
export class WorkerManager {
  private emailWorker: EmailWorker;
  private pdfWorker: PDFWorker;

  constructor() {
    console.log('🚀 Démarrage des workers...');

    this.emailWorker = new EmailWorker();
    this.pdfWorker = new PDFWorker();

    console.log('✅ Tous les workers sont démarrés');
  }

  /**
   * Fermer tous les workers
   */
  async close(): Promise<void> {
    console.log('🛑 Arrêt des workers...');

    await Promise.all([this.emailWorker.close(), this.pdfWorker.close()]);

    console.log('✅ Tous les workers sont arrêtés');
  }

  /**
   * Obtenir les workers individuels
   */
  getEmailWorker(): EmailWorker {
    return this.emailWorker;
  }

  getPDFWorker(): PDFWorker {
    return this.pdfWorker;
  }
}

// Instance singleton
let workerManager: WorkerManager | null = null;

export function getWorkerManager(): WorkerManager {
  if (!workerManager) {
    workerManager = new WorkerManager();
  }
  return workerManager;
}
