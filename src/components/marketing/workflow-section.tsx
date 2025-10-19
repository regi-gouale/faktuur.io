import { SectionIntro } from '@/components/marketing/section-intro';
import { Zap } from 'lucide-react';

const workflowSteps = [
  {
    title: 'Créer',
    description:
      'Composez vos devis en quelques secondes avec des produits réutilisables et la TVA automatique.',
  },
  {
    title: 'Partager',
    description:
      'Envoyez un lien sécurisé ou un PDF personnalisé et suivez la lecture en temps réel.',
  },
  {
    title: 'Encaisser',
    description:
      'Relances programmées, statut des paiements et export comptable prêts pour votre expert-comptable.',
  },
] as const;

export function WorkflowSection() {
  return (
    <section className="relative py-24">
      <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
        <div className="flex flex-col gap-6">
          <SectionIntro
            eyebrow={{
              label: 'Workflow guidé',
              variant: 'outline',
              className: 'border-primary/30 bg-primary/10 text-primary',
            }}
            title="Une expérience inspirée des produits Vercel"
            description="De la première estimation à l'encaissement, chaque étape est orchestrée pour vous permettre de livrer vite tout en gardant le contrôle sur vos flux financiers."
            align="start"
            className="max-w-xl"
            titleClassName="text-balance text-3xl font-semibold tracking-tight sm:text-4xl"
            descriptionClassName="text-lg text-muted-foreground"
          />
          <div className="space-y-4">
            {workflowSteps.map((step, index) => (
              <div
                key={step.title}
                className="border-border/70 bg-background/90 shadow-primary/5 flex gap-4 rounded-xl border p-4 shadow-sm"
              >
                <div className="border-primary/40 bg-primary/10 text-primary flex size-10 items-center justify-center rounded-full border text-sm font-semibold">
                  0{index + 1}
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-foreground text-lg font-medium">{step.title}</h3>
                  <p className="text-muted-foreground text-sm">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative flex items-center justify-center">
          <div className="border-border/60 bg-background/80 shadow-primary/10 w-full max-w-md rounded-3xl border p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm font-medium">Vue d&apos;ensemble</span>
              <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">
                Temps réel
              </span>
            </div>
            <div className="mt-6 space-y-4">
              <div className="border-border/70 bg-muted/40 rounded-2xl border p-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground text-xs tracking-wide uppercase">
                    Revenus MRR
                  </span>
                  <span className="text-xs font-semibold text-emerald-500">+18%</span>
                </div>
                <p className="text-foreground mt-2 text-2xl font-semibold">7 540 €</p>
              </div>
              <div className="grid gap-3">
                {[
                  {
                    label: 'Devis signés',
                    value: '36',
                  },
                  {
                    label: 'Factures payées',
                    value: '18',
                  },
                  {
                    label: 'Paiements en retard',
                    value: '2',
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="border-border/70 bg-background/90 flex items-center justify-between rounded-xl border px-4 py-3"
                  >
                    <span className="text-muted-foreground text-sm font-medium">{item.label}</span>
                    <span className="text-foreground text-sm font-semibold">{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="border-border/60 bg-primary/10 text-primary flex items-center justify-between rounded-xl border p-4">
                <div>
                  <p className="text-sm font-medium">Automations actives</p>
                  <p className="text-primary/70 text-xs">Relances intelligentes tous les 7 jours</p>
                </div>
                <Zap className="size-5" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
