import { syncUserToUseSendContacts } from '@/lib/dal/email';

/**
 * Data Access Layer for user operations
 * Handles user-related business logic and service coordination
 */

/**
 * Sync user to UseSend contacts during registration
 * Called after successful user account creation
 * Does not throw - returns error result if sync fails
 * This ensures signup continues even if UseSend sync fails
 *
 * @param email - User's email address
 * @param name - User's full name (optional)
 * @returns Success/error result with contact ID if applicable
 */
export async function syncUserOnRegistration(
  email: string,
  name?: string
): Promise<{
  success: boolean;
  contactId?: string;
  error?: string;
}> {
  try {
    // Parse name if provided
    let firstName: string | undefined;
    let lastName: string | undefined;

    // NOTE: Cette logique suppose une convention de nom occidentale (Prénom Nom).
    // Elle peut ne pas fonctionner correctement pour d'autres cultures ou formats de nom.
    // TODO: Utiliser une bibliothèque de parsing de nom ou améliorer la gestion des cas non occidentaux si nécessaire.
    if (name) {
      const nameParts = name.trim().split(/\s+/);
      firstName = nameParts[0];
      lastName = nameParts.slice(1).join(' ') || undefined;
    }

    const result = await syncUserToUseSendContacts(email, firstName, lastName);

    if (result.success) {
      return {
        success: true,
        contactId: result.contactId,
      };
    }

    // Log warning but don't fail the signup
    console.warn(`[UseSend] Failed to sync contact for ${email}: ${result.error}`);

    return {
      success: false,
      error: result.error,
    };
  } catch (error) {
    // Graceful error handling - never block signup
    console.error(`[UseSend] Error syncing user contact: ${error}`);

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}
