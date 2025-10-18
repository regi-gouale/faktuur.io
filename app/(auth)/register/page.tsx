import { AuthShell } from "@/components/auth/auth-shell";
import {
  RegisterForm,
  RegisterFormFallback,
} from "@/components/auth/register-form";
import { Sparkles } from "lucide-react";
import { Suspense } from "react";

export const revalidate = false;

const SignupPageFallback = () => {
  return (
    <AuthShell
      eyebrow={{
        label: "Créer un compte",
        icon: Sparkles,
        className: "border-border/70 bg-background/80 text-muted-foreground",
      }}
      title="Lancez votre cockpit en quelques minutes"
      description="Chargement du formulaire d'inscription..."
    >
      <RegisterFormFallback />
    </AuthShell>
  );
};

export default function SignupPage() {
  return (
    <Suspense fallback={<SignupPageFallback />}>
      <AuthShell
        eyebrow={{
          label: "Créer un compte",
          icon: Sparkles,
          className: "border-border/70 bg-background/80 text-muted-foreground",
        }}
        title="Lancez votre cockpit en quelques minutes"
        description="Inscrivez-vous pour automatiser vos devis, factures et relances client."
      >
        <RegisterForm />
      </AuthShell>
    </Suspense>
  );
}
