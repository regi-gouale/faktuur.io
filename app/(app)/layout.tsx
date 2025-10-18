"use client";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<unknown | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const response = await fetch("/api/auth/get-session");

        if (!response.ok || response.status !== 200) {
          // Pas de session, rediriger vers login
          router.push("/login?callbackUrl=/dashboard");
          return;
        }

        const data = await response.json();
        setSession(data);
      } catch (error) {
        console.error("Error checking session:", error);
        router.push("/login?callbackUrl=/dashboard");
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, [router]);

  // Afficher un loader pendant la vérification
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-pulse text-muted-foreground">
          Vérification de la session...
        </div>
      </div>
    );
  }

  // Si pas de session, ne rien afficher (redirection en cours)
  if (!session) {
    return null;
  }

  return (
    <SidebarProvider defaultOpen={true}>
      {/* <AppSidebar /> */}
      <SidebarInset className="min-h-screen flex-1 items-center justify-center">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
