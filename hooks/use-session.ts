"use client";

import { useEffect, useState } from "react";

interface User {
  name: string;
  email: string;
  image?: string;
}

interface Session {
  user: User;
  orgSlug?: string;
}

/**
 * Hook pour récupérer la session utilisateur côté client
 * Utilisé pour afficher les informations d'authentification sur les pages statiques
 */
export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSession() {
      try {
        const response = await fetch("/api/auth/get-session");

        if (response.status === 401) {
          setSession(null);
          return;
        }

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération de la session");
        }

        const data = await response.json();

        if (data?.user) {
          setSession({
            user: {
              name: data.user.name,
              email: data.user.email,
              image: data.user.image,
            },
            orgSlug: data.orgSlug,
          });
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue");
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    }

    fetchSession();
  }, []);

  return { session, isLoading, error };
}
