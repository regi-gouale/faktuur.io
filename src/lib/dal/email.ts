import { sendEmail, sendEmailBatch } from '@/api/services/email';
import { addContactToUseSend, type CreateContactResponse } from '@/api/services/usesend';
import { EmailPayload, EmailResponse } from '@/lib/schemas/email';

/**
 * Data Access Layer for email operations
 * Handles all email-related database and service calls
 */

export async function sendWelcomeEmail(
  email: string,
  userName: string,
  loginUrl: string
): Promise<EmailResponse> {
  return sendEmail({
    to: email,
    templateType: 'WELCOME',
    variables: {
      userName,
      loginUrl,
    },
  });
}

export async function sendPasswordResetEmail(
  email: string,
  resetUrl: string,
  expiresIn: number = 24
): Promise<EmailResponse> {
  return sendEmail({
    to: email,
    templateType: 'PASSWORD_RESET',
    variables: {
      resetUrl,
      expiresIn,
    },
  });
}

export async function sendEmailVerificationEmail(
  email: string,
  verificationUrl: string,
  expiresIn: number = 24
): Promise<EmailResponse> {
  return sendEmail({
    to: email,
    templateType: 'EMAIL_VERIFICATION',
    variables: {
      verificationUrl,
      expiresIn,
    },
  });
}

export async function sendInvoiceReminderEmail(
  email: string,
  invoiceNumber: string,
  amount: string,
  dueDate: string,
  invoiceUrl: string
): Promise<EmailResponse> {
  return sendEmail({
    to: email,
    templateType: 'INVOICE_REMINDER',
    variables: {
      invoiceNumber,
      amount,
      dueDate,
      invoiceUrl,
    },
  });
}

export async function sendPaymentReceivedEmail(
  email: string,
  invoiceNumber: string,
  amount: string,
  paymentDate: string
): Promise<EmailResponse> {
  return sendEmail({
    to: email,
    templateType: 'PAYMENT_RECEIVED',
    variables: {
      invoiceNumber,
      amount,
      paymentDate,
    },
  });
}

export async function sendBulkEmails(payloads: EmailPayload[]): Promise<EmailResponse[]> {
  return sendEmailBatch(payloads);
}

/**
 * Sync a user to UseSend contacts during registration
 * Only runs when UseSend provider is configured
 * Does not block registration if contact sync fails
 */
export async function syncUserToUseSendContacts(
  email: string,
  firstName?: string,
  lastName?: string
): Promise<CreateContactResponse> {
  return addContactToUseSend({
    email,
    firstName: firstName || undefined,
    lastName: lastName || undefined,
  });
}
