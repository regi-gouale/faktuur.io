import { z } from 'zod';

export const EmailTemplateType = z.enum([
  'WELCOME',
  'PASSWORD_RESET',
  'EMAIL_VERIFICATION',
  'INVOICE_REMINDER',
  'PAYMENT_RECEIVED',
]);

export type EmailTemplate = z.infer<typeof EmailTemplateType>;

export interface EmailPayload {
  to: string;
  templateType: EmailTemplate;
  variables: Record<string, string | number | boolean>;
}

export interface EmailResponse {
  success: boolean;
  messageId?: string;
  error?: string;
}

export const sendEmailSchema = z.object({
  to: z.string().email('Invalid recipient email'),
  templateType: EmailTemplateType,
  variables: z.record(z.string(), z.union([z.string(), z.number(), z.boolean()])),
});

export type SendEmailRequest = z.infer<typeof sendEmailSchema>;
