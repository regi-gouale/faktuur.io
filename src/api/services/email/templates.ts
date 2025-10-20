import { EmailTemplate } from '@/lib/schemas/email';

export interface TemplateData {
  subject: string;
  html: string;
  text: string;
}

export function renderTemplate(
  templateType: EmailTemplate,
  variables: Record<string, string | number | boolean>
): TemplateData {
  const templates: Record<EmailTemplate, () => TemplateData> = {
    WELCOME: () => renderWelcomeTemplate(variables),
    PASSWORD_RESET: () => renderPasswordResetTemplate(variables),
    EMAIL_VERIFICATION: () => renderEmailVerificationTemplate(variables),
    INVOICE_REMINDER: () => renderInvoiceReminderTemplate(variables),
    PAYMENT_RECEIVED: () => renderPaymentReceivedTemplate(variables),
  };

  const renderer = templates[templateType];
  if (!renderer) {
    throw new Error(`Unknown email template: ${templateType}`);
  }

  return renderer();
}

function renderWelcomeTemplate(variables: Record<string, string | number | boolean>): TemplateData {
  const userName = variables.userName || 'User';

  return {
    subject: `Bienvenue sur Faktuur.io, ${userName}!`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Bienvenue sur Faktuur.io!</h1>
        <p>Bonjour ${userName},</p>
        <p>Merci de vous être inscrit sur Faktuur.io. Nous sommes ravi de vous accueillir!</p>
        <p>Vous pouvez maintenant commencer à créer vos devis et factures en toute conformité avec les régulations locales.</p>
        <p><a href="${variables.loginUrl}" style="display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">Commencer</a></p>
        <hr />
        <p style="color: #666; font-size: 12px;">© 2025 Faktuur.io. Tous droits réservés.</p>
      </div>
    `,
    text: `
Bienvenue sur Faktuur.io!

Bonjour ${userName},

Merci de vous être inscrit sur Faktuur.io. Nous sommes ravi de vous accueillir!

Vous pouvez maintenant commencer à créer vos devis et factures en toute conformité avec les régulations locales.

Connectez-vous: ${variables.loginUrl}

© 2025 Faktuur.io. Tous droits réservés.
    `.trim(),
  };
}

function renderPasswordResetTemplate(
  variables: Record<string, string | number | boolean>
): TemplateData {
  return {
    subject: 'Réinitialiser votre mot de passe Faktuur.io',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Réinitialiser votre mot de passe</h1>
        <p>Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte.</p>
        <p><a href="${
          variables.resetUrl
        }" style="display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">Réinitialiser le mot de passe</a></p>
        <p style="color: #666; font-size: 12px;">Ce lien expire dans ${
          variables.expiresIn
        } heure${(variables.expiresIn as number) > 1 ? 's' : ''}.</p>
        <p style="color: #666; font-size: 12px;">Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
        <hr />
        <p style="color: #666; font-size: 12px;">© 2025 Faktuur.io. Tous droits réservés.</p>
      </div>
    `,
    text: `
Réinitialiser votre mot de passe

Nous avons reçu une demande de réinitialisation de mot de passe pour votre compte.

Réinitialiser le mot de passe: ${variables.resetUrl}

Ce lien expire dans ${variables.expiresIn} heures.

Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.

© 2025 Faktuur.io. Tous droits réservés.
    `.trim(),
  };
}

function renderEmailVerificationTemplate(
  variables: Record<string, string | number | boolean>
): TemplateData {
  return {
    subject: 'Vérifiez votre adresse email sur Faktuur.io',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Vérifiez votre adresse email</h1>
        <p>Merci de vous être inscrit sur Faktuur.io!</p>
        <p>Veuillez vérifier votre adresse email en cliquant sur le lien ci-dessous:</p>
        <p><a href="${variables.verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">Vérifier l'email</a></p>
        <p style="color: #666; font-size: 12px;">Ce lien expire dans ${variables.expiresIn} heures.</p>
        <hr />
        <p style="color: #666; font-size: 12px;">© 2025 Faktuur.io. Tous droits réservés.</p>
      </div>
    `,
    text: `
Vérifiez votre adresse email

Merci de vous être inscrit sur Faktuur.io!

Veuillez vérifier votre adresse email: ${variables.verificationUrl}

Ce lien expire dans ${variables.expiresIn} heures.

© 2025 Faktuur.io. Tous droits réservés.
    `.trim(),
  };
}

function renderInvoiceReminderTemplate(
  variables: Record<string, string | number | boolean>
): TemplateData {
  return {
    subject: `Rappel: Facture ${variables.invoiceNumber} en attente de paiement`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Rappel de paiement</h1>
        <p>Bonjour,</p>
        <p>Nous vous rappelons que la facture <strong>${variables.invoiceNumber}</strong> est en attente de paiement.</p>
        <p><strong>Montant:</strong> ${variables.amount}</p>
        <p><strong>Date d'échéance:</strong> ${variables.dueDate}</p>
        <p><a href="${variables.invoiceUrl}" style="display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px;">Voir la facture</a></p>
        <hr />
        <p style="color: #666; font-size: 12px;">© 2025 Faktuur.io. Tous droits réservés.</p>
      </div>
    `,
    text: `
Rappel de paiement

Bonjour,

Nous vous rappelons que la facture ${variables.invoiceNumber} est en attente de paiement.

Montant: ${variables.amount}
Date d'échéance: ${variables.dueDate}

Voir la facture: ${variables.invoiceUrl}

© 2025 Faktuur.io. Tous droits réservés.
    `.trim(),
  };
}

function renderPaymentReceivedTemplate(
  variables: Record<string, string | number | boolean>
): TemplateData {
  return {
    subject: `Paiement reçu pour la facture ${variables.invoiceNumber}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1>Paiement reçu</h1>
        <p>Bonjour,</p>
        <p>Merci! Nous avons bien reçu le paiement pour la facture <strong>${variables.invoiceNumber}</strong>.</p>
        <p><strong>Montant payé:</strong> ${variables.amount}</p>
        <p><strong>Date de paiement:</strong> ${variables.paymentDate}</p>
        <p>Votre compte est à jour.</p>
        <hr />
        <p style="color: #666; font-size: 12px;">© 2025 Faktuur.io. Tous droits réservés.</p>
      </div>
    `,
    text: `
Paiement reçu

Bonjour,

Merci! Nous avons bien reçu le paiement pour la facture ${variables.invoiceNumber}.

Montant payé: ${variables.amount}
Date de paiement: ${variables.paymentDate}

Votre compte est à jour.

© 2025 Faktuur.io. Tous droits réservés.
    `.trim(),
  };
}
