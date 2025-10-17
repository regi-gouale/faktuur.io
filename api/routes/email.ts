import {
  sendEmailVerificationEmail,
  sendInvoiceReminderEmail,
  sendPasswordResetEmail,
  sendPaymentReceivedEmail,
  sendWelcomeEmail,
} from "@/lib/dal/email";
import { sendEmailSchema } from "@/lib/schemas/email";
import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

const emailRouter = new Hono();

/**
 * POST /api/email/send
 * Send an email using a specific template
 */
emailRouter.post("/send", zValidator("json", sendEmailSchema), async (c) => {
  try {
    const { to, templateType, variables } = c.req.valid("json");

    let result;

    switch (templateType) {
      case "WELCOME":
        result = await sendWelcomeEmail(
          to,
          String(variables.userName || "User"),
          String(variables.loginUrl || "")
        );
        break;

      case "PASSWORD_RESET":
        result = await sendPasswordResetEmail(
          to,
          String(variables.resetUrl || ""),
          Number(variables.expiresIn || 24)
        );
        break;

      case "EMAIL_VERIFICATION":
        result = await sendEmailVerificationEmail(
          to,
          String(variables.verificationUrl || ""),
          Number(variables.expiresIn || 24)
        );
        break;

      case "INVOICE_REMINDER":
        result = await sendInvoiceReminderEmail(
          to,
          String(variables.invoiceNumber || ""),
          String(variables.amount || ""),
          String(variables.dueDate || ""),
          String(variables.invoiceUrl || "")
        );
        break;

      case "PAYMENT_RECEIVED":
        result = await sendPaymentReceivedEmail(
          to,
          String(variables.invoiceNumber || ""),
          String(variables.amount || ""),
          String(variables.paymentDate || "")
        );
        break;

      default:
        return c.json({ success: false, error: "Unknown template type" }, 400);
    }

    if (!result.success) {
      return c.json({ success: false, error: result.error }, 500);
    }

    return c.json({ success: true, messageId: result.messageId }, 200);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    console.error("Email route error:", errorMessage);

    return c.json(
      {
        success: false,
        error: errorMessage,
      },
      500
    );
  }
});

/**
 * GET /api/email/templates
 * List available email templates
 */
emailRouter.get("/templates", (c) => {
  return c.json({
    templates: [
      {
        type: "WELCOME",
        description: "Email de bienvenue pour les nouveaux utilisateurs",
        requiredVariables: ["userName", "loginUrl"],
      },
      {
        type: "PASSWORD_RESET",
        description: "Email de réinitialisation de mot de passe",
        requiredVariables: ["resetUrl", "expiresIn"],
      },
      {
        type: "EMAIL_VERIFICATION",
        description: "Email de vérification d'adresse email",
        requiredVariables: ["verificationUrl", "expiresIn"],
      },
      {
        type: "INVOICE_REMINDER",
        description: "Rappel de paiement de facture",
        requiredVariables: ["invoiceNumber", "amount", "dueDate", "invoiceUrl"],
      },
      {
        type: "PAYMENT_RECEIVED",
        description: "Confirmation de paiement reçu",
        requiredVariables: ["invoiceNumber", "amount", "paymentDate"],
      },
    ],
  });
});

export default emailRouter;
