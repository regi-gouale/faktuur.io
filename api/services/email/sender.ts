import { getEnv } from "@/lib/env";
import { EmailPayload, EmailResponse } from "@/lib/schemas/email";
import nodemailer from "nodemailer";
import { UseSend } from "usesend-js";
import { renderTemplate } from "./templates";

let transporter: nodemailer.Transporter | null = null;
let usesendClient: InstanceType<typeof UseSend> | null = null;

function getNodemailerTransporter(): nodemailer.Transporter {
  if (transporter) return transporter;

  const env = getEnv();

  // Nodemailer configuration
  const config = {
    host: env.SMTP_HOST || "localhost",
    port: env.SMTP_PORT || 587,
    secure: env.SMTP_PORT === 465,
    ...(env.SMTP_USER
      ? {
          auth: {
            user: env.SMTP_USER,
            pass: env.SMTP_PASSWORD || "",
          },
        }
      : {}),
  };

  transporter = nodemailer.createTransport(config);
  return transporter;
}

function getUseSendClient(): InstanceType<typeof UseSend> {
  if (usesendClient) return usesendClient;

  const env = getEnv();

  if (!env.USESEND_API_KEY) {
    throw new Error("USESEND_API_KEY is not configured");
  }

  usesendClient = new UseSend(env.USESEND_API_KEY);
  return usesendClient;
}

export async function sendEmail(payload: EmailPayload): Promise<EmailResponse> {
  try {
    const template = renderTemplate(payload.templateType, payload.variables);
    const env = getEnv();

    if (env.EMAIL_PROVIDER === "usesend") {
      return sendEmailViaUseSend(payload, template, env);
    }

    if (env.EMAIL_PROVIDER === "resend") {
      throw new Error("Resend provider not yet implemented");
    }

    // Default to Nodemailer
    return sendEmailViaNodemailer(payload, template, env);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    console.error("Email send error:", errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }
}

async function sendEmailViaNodemailer(
  payload: EmailPayload,
  template: { subject: string; html: string; text: string },
  env: ReturnType<typeof getEnv>
): Promise<EmailResponse> {
  const transporter = getNodemailerTransporter();

  const result = await transporter.sendMail({
    from: env.EMAIL_FROM,
    to: payload.to,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });

  return {
    success: true,
    messageId: result.messageId || result.response,
  };
}

async function sendEmailViaUseSend(
  payload: EmailPayload,
  template: { subject: string; html: string; text: string },
  env: ReturnType<typeof getEnv>
): Promise<EmailResponse> {
  const usesend = getUseSendClient();

  const result = await usesend.emails.send({
    from: env.EMAIL_FROM,
    to: payload.to,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });

  const messageId = String(
    (result as Record<string, unknown>)?.messageId || "sent"
  );

  return {
    success: true,
    messageId,
  };
}

export async function sendEmailBatch(
  payloads: EmailPayload[]
): Promise<EmailResponse[]> {
  return Promise.all(payloads.map((payload) => sendEmail(payload)));
}
