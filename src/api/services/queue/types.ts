/**
 * Types pour le système de queue
 */

export enum QueueName {
  EMAIL = 'email',
  PDF = 'pdf',
  NOTIFICATION = 'notification',
}

export interface JobPayload {
  [key: string]: unknown;
}

export interface JobResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

export interface JobOptions {
  priority?: number;
  delay?: number; // Délai en millisecondes
  attempts?: number;
  backoff?: {
    type: 'exponential' | 'fixed';
    delay: number;
  };
  removeOnComplete?: boolean | number;
  removeOnFail?: boolean | number;
}

/**
 * Payload pour les jobs d'email
 */
export interface EmailJobPayload extends JobPayload {
  to: string | string[];
  template: string;
  data: Record<string, unknown>;
  from?: string;
  subject?: string;
  attachments?: Array<{
    filename: string;
    path?: string;
    content?: Buffer;
  }>;
}

/**
 * Payload pour les jobs de génération PDF
 */
export interface PDFJobPayload extends JobPayload {
  type: 'invoice' | 'quote' | 'report';
  documentId: string;
  userId?: string;
  organizationId?: string;
  options?: {
    format?: 'A4' | 'Letter';
    orientation?: 'portrait' | 'landscape';
    margin?: {
      top?: string;
      right?: string;
      bottom?: string;
      left?: string;
    };
  };
}

/**
 * Payload pour les jobs de notification
 */
export interface NotificationJobPayload extends JobPayload {
  userId: string;
  type: 'email' | 'push' | 'sms';
  title: string;
  message: string;
  data?: Record<string, unknown>;
}
