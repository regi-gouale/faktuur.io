// hooks/use-session.ts
"use client";

import { useQuery } from "@tanstack/react-query";

interface User {
  name: string;
  email: string;
  image?: string;
}

interface Session {
  user: User;
  orgSlug?: string;
}

async function fetchSession(): Promise<Session | null> {
  const response = await fetch("/api/auth/get-session");

  if (response.status === 401) {
    return null;
  }

  if (!response.ok) {
    throw new Error("Erreur lors de la récupération de la session");
  }

  const data = await response.json();

  if (data?.user) {
    return {
      user: {
        name: data.user.name,
        email: data.user.email,
        image: data.user.image,
      },
      orgSlug: data.orgSlug,
    };
  }

  return null;
}

export function useSession() {
  const {
    data: session,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["session"],
    queryFn: fetchSession,
    staleTime: 5 * 60 * 1000, // 5 minutes - correspond au cookieCache de better-auth
    retry: 1,
    refetchOnWindowFocus: false, // Évite refetch inutile
  });

  return {
    session,
    isLoading,
    error: error ? String(error) : null,
  };
}
