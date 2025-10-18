import { SectionIntro } from "@/components/marketing/section-intro";
import { Zap } from "lucide-react";

const workflowSteps = [
  {
    title: "Créer",
    description:
      "Composez vos devis en quelques secondes avec des produits réutilisables et la TVA automatique.",
  },
  {
    title: "Partager",
    description:
      "Envoyez un lien sécurisé ou un PDF personnalisé et suivez la lecture en temps réel.",
  },
  {
    title: "Encaisser",
    description:
      "Relances programmées, statut des paiements et export comptable prêts pour votre expert-comptable.",
  },
] as const;

export function WorkflowSection() {
  return (
    <section className="relative py-24">
      <div className="container mx-auto grid gap-12 px-4 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
        <div className="flex flex-col gap-6">
          <SectionIntro
            eyebrow={{
              label: "Workflow guidé",
              variant: "outline",
              className: "border-primary/30 bg-primary/10 text-primary",
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
                className="flex gap-4 rounded-xl border border-border/70 bg-background/90 p-4 shadow-sm shadow-primary/5"
              >
                <div className="flex size-10 items-center justify-center rounded-full border border-primary/40 bg-primary/10 text-sm font-semibold text-primary">
                  0{index + 1}
                </div>
                <div className="space-y-1.5">
                  <h3 className="text-lg font-medium text-foreground">
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative flex items-center justify-center">
          <div className="w-full max-w-md rounded-3xl border border-border/60 bg-background/80 p-6 shadow-xl shadow-primary/10">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-muted-foreground">
                Vue d&apos;ensemble
              </span>
              <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                Temps réel
              </span>
            </div>
            <div className="mt-6 space-y-4">
              <div className="rounded-2xl border border-border/70 bg-muted/40 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-wide text-muted-foreground">
                    Revenus MRR
                  </span>
                  <span className="text-xs font-semibold text-emerald-500">
                    +18%
                  </span>
                </div>
                <p className="mt-2 text-2xl font-semibold text-foreground">
                  7 540 €
                </p>
              </div>
              <div className="grid gap-3">
                {[
                  {
                    label: "Devis signés",
                    value: "36",
                  },
                  {
                    label: "Factures payées",
                    value: "18",
                  },
                  {
                    label: "Paiements en retard",
                    value: "2",
                  },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between rounded-xl border border-border/70 bg-background/90 px-4 py-3"
                  >
                    <span className="text-sm font-medium text-muted-foreground">
                      {item.label}
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {item.value}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between rounded-xl border border-border/60 bg-primary/10 p-4 text-primary">
                <div>
                  <p className="text-sm font-medium">Automations actives</p>
                  <p className="text-xs text-primary/70">
                    Relances intelligentes tous les 7 jours
                  </p>
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
