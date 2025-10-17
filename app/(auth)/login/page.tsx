import { AuthShell } from "@/components/auth/auth-shell";
import { LoginForm, LoginFormFallback } from "@/components/auth/login-form";
import { auth } from "@/lib/auth";
import { Sparkles } from "lucide-react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { Suspense } from "react";

const LoginPageFallback = () => {
  return (
    <AuthShell
      eyebrow={{
        label: "Connexion sécurisée",
        icon: Sparkles,
        variant: "outline",
        className: "border-border/70 bg-background/80 text-muted-foreground",
      }}
      title="Accédez à votre cockpit de facturation"
      description="Chargement de l'interface de connexion..."
    >
      <LoginFormFallback />
    </AuthShell>
  );
};

export default async function LoginPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (session) {
    redirect("/");
  }
  return (
    <Suspense fallback={<LoginPageFallback />}>
      <AuthShell
        eyebrow={{
          label: "Connexion sécurisée",
          icon: Sparkles,
          variant: "outline",
          className: "border-border/70 bg-background/80 text-muted-foreground",
        }}
        title="Accédez à votre cockpit de facturation"
        description="Connectez-vous pour suivre vos devis, factures et paiements en temps réel."
      >
        <LoginForm />
      </AuthShell>
    </Suspense>
  );
}
