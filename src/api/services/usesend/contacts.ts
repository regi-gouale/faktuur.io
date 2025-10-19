import { getEnv } from "@/lib/env";
import { UseSend } from "usesend-js";

let usesendClient: InstanceType<typeof UseSend> | null = null;

function getUseSendClient(): InstanceType<typeof UseSend> {
  if (usesendClient) return usesendClient;

  const env = getEnv();

  if (!env.USESEND_API_KEY) {
    throw new Error("USESEND_API_KEY is not configured");
  }

  usesendClient = new UseSend(env.USESEND_API_KEY);
  return usesendClient;
}

export interface CreateContactInput {
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface CreateContactResponse {
  success: boolean;
  contactId?: string;
  error?: string;
}

/**
 * Add a user to UseSend contacts
 * Only works when EMAIL_PROVIDER is "usesend"
 */
export async function addContactToUseSend(
  input: CreateContactInput
): Promise<CreateContactResponse> {
  try {
    const env = getEnv();

    // Only proceed if UseSend is enabled
    if (env.EMAIL_PROVIDER !== "usesend") {
      return {
        success: true, // Not an error - just not applicable
        error: "UseSend is not the active email provider",
      };
    }

    // Contact book ID is required
    if (!env.USESEND_CONTACT_BOOK_ID) {
      console.warn(
        "USESEND_CONTACT_BOOK_ID not configured. Skipping contact creation."
      );
      return {
        success: true, // Not an error - just skipped
        error: "USESEND_CONTACT_BOOK_ID not configured",
      };
    }

    const usesend = getUseSendClient();

    const contact = await usesend.contacts.create(env.USESEND_CONTACT_BOOK_ID, {
      email: input.email,
      firstName: input.firstName,
      lastName: input.lastName,
    });

    return {
      success: true,
      contactId: (contact as Record<string, unknown>)?.id
        ? String((contact as Record<string, unknown>).id)
        : (contact as unknown as string),
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    console.error("Error adding contact to UseSend:", errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }
}

/**
 * Update a contact in UseSend
 */
export async function updateContactInUseSend(
  contactId: string,
  input: Partial<CreateContactInput>
): Promise<CreateContactResponse> {
  try {
    const env = getEnv();

    // Only proceed if UseSend is enabled
    if (env.EMAIL_PROVIDER !== "usesend") {
      return {
        success: true,
        error: "UseSend is not the active email provider",
      };
    }

    // Contact book ID is required
    if (!env.USESEND_CONTACT_BOOK_ID) {
      console.warn(
        "USESEND_CONTACT_BOOK_ID not configured. Skipping contact update."
      );
      return {
        success: true,
        error: "USESEND_CONTACT_BOOK_ID not configured",
      };
    }

    const usesend = getUseSendClient();

    const updateData: Record<string, unknown> = {};
    if (input.firstName) updateData.firstName = input.firstName;
    if (input.lastName) updateData.lastName = input.lastName;
    if (input.email) updateData.email = input.email;

    await usesend.contacts.update(
      env.USESEND_CONTACT_BOOK_ID,
      contactId,
      updateData
    );

    return {
      success: true,
      contactId,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    console.error("Error updating contact in UseSend:", errorMessage);

    return {
      success: false,
      error: errorMessage,
    };
  }
}
