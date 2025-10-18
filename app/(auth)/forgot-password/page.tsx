import { AuthShell } from "@/components/auth/auth-shell";
import {
  ForgotPasswordForm,
  ForgotPasswordFormFallback,
} from "@/components/auth/forgot-password-form";
import { KeyRound } from "lucide-react";
import { Suspense } from "react";

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordPageFallback />}>
      <AuthShell
        eyebrow={{
          label: "Réinitialiser votre mot de passe",
          icon: KeyRound,
          className: "border-border/70 bg-background/80 text-muted-foreground",
        }}
        title="Recevez un lien sécurisé en quelques secondes"
        description="Indiquez l'adresse associée à votre compte pour recevoir un email de réinitialisation."
      >
        <ForgotPasswordForm />
      </AuthShell>
    </Suspense>
  );
}

const ResetPasswordPageFallback = () => {
  return (
    <AuthShell
      eyebrow={{
        label: "Réinitialiser votre mot de passe",
        icon: KeyRound,
        className: "border-border/70 bg-background/80 text-muted-foreground",
      }}
      title="Recevez un lien sécurisé en quelques secondes"
      description="Préparation du formulaire de récupération..."
    >
      <ForgotPasswordFormFallback />
    </AuthShell>
  );
};
