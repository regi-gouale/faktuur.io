import { AuthShell } from '@/components/auth/auth-shell';
import {
  ResetPasswordForm,
  ResetPasswordFormFallback,
} from '@/components/auth/reset-password-form';
import { ShieldCheck } from 'lucide-react';
import { Suspense } from 'react';

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordPageFallback />}>
      <AuthShell
        eyebrow={{
          label: 'Définissez un nouveau mot de passe',
          icon: ShieldCheck,
          className: 'border-border/70 bg-background/80 text-muted-foreground',
        }}
        title="Sécurisez votre accès en quelques instants"
        description="Choisissez un nouveau mot de passe robuste pour protéger votre compte Solide Cotizoo."
      >
        <ResetPasswordForm />
      </AuthShell>
    </Suspense>
  );
}

const ResetPasswordPageFallback = () => {
  return (
    <AuthShell
      eyebrow={{
        label: 'Définissez un nouveau mot de passe',
        icon: ShieldCheck,
        className: 'border-border/70 bg-background/80 text-muted-foreground',
      }}
      title="Sécurisez votre accès en quelques instants"
      description="Chargement du formulaire de réinitialisation..."
    >
      <ResetPasswordFormFallback />
    </AuthShell>
  );
};
