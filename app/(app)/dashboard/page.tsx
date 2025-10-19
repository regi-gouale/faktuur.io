"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function DashboardPage() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkOrganization = async () => {
      try {
        // Récupérer la session avec orgSlug
        const response = await fetch("/api/session");

        if (!response.ok) {
          // Pas de session, le layout va rediriger vers /login
          return;
        }

        const data = await response.json();

        // Si pas d'organisation, rediriger vers création
        if (!data.orgSlug) {
          router.push("/create-organization");
          return;
        }

        // Si organisation existe, rediriger vers le dashboard de l'organisation
        router.push(`/dashboard/${data.orgSlug}`);
      } catch (error) {
        console.error("Error checking organization:", error);
        router.push("/create-organization");
      } finally {
        setIsChecking(false);
      }
    };

    checkOrganization();
  }, [router]);

  // Loader pendant la vérification
  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="text-muted-foreground">
            Chargement de votre organisation...
          </p>
        </div>
      </div>
    );
  }

  // Ne devrait jamais être affiché (redirection en cours)
  return null;
}
