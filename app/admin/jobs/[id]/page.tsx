import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { getJobById } from '@/lib/dal/job';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  FileText,
  Hash,
  Loader2,
  Mail,
  RefreshCw,
  Trash2,
  XCircle,
} from 'lucide-react';
import Link from 'next/link';
import { notFound } from 'next/navigation';

interface AdminJobDetailPageProps {
  params: {
    id: string;
  };
}

// Fonction pour obtenir le badge de statut
function getStatusBadge(status: string) {
  const statusConfig = {
    PENDING: { label: 'En attente', variant: 'secondary' as const, icon: Clock },
    PROCESSING: { label: 'En cours', variant: 'default' as const, icon: Loader2 },
    COMPLETED: { label: 'Terminée', variant: 'success' as const, icon: CheckCircle2 },
    FAILED: { label: 'Échouée', variant: 'destructive' as const, icon: XCircle },
    CANCELLED: { label: 'Annulée', variant: 'outline' as const, icon: AlertCircle },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING;
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className="flex w-fit items-center gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

// Fonction pour obtenir le badge de type
function getTypeBadge(type: string) {
  const typeConfig = {
    SEND_EMAIL: { label: 'Email', icon: Mail },
    GENERATE_PDF: { label: 'PDF', icon: FileText },
    SEND_REMINDER: { label: 'Rappel', icon: RefreshCw },
    CLEANUP_SESSIONS: { label: 'Nettoyage', icon: Trash2 },
    GENERATE_REPORT: { label: 'Rapport', icon: FileText },
  };

  const config = typeConfig[type as keyof typeof typeConfig] || typeConfig.SEND_EMAIL;
  const Icon = config.icon;

  return (
    <Badge variant="outline" className="flex w-fit items-center gap-1">
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

export default async function AdminJobDetailPage({ params }: AdminJobDetailPageProps) {
  const { id } = params;

  // Récupérer la tâche
  const job = await getJobById(id);

  if (!job) {
    notFound();
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* En-tête avec navigation */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/admin/jobs">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Détails de la Tâche</h1>
          <p className="text-muted-foreground">Informations complètes sur la tâche #{job.id}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Réessayer
          </Button>
          <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Supprimer
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Informations générales */}
        <Card>
          <CardHeader>
            <CardTitle>Informations Générales</CardTitle>
            <CardDescription>Détails de base de la tâche</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">ID</span>
              <div className="flex items-center gap-2">
                <Hash className="text-muted-foreground h-4 w-4" />
                <code className="bg-muted rounded px-2 py-1 text-sm">{job.id}</code>
              </div>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Type</span>
              {getTypeBadge(job.type)}
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Statut</span>
              {getStatusBadge(job.status)}
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Priorité</span>
              <Badge variant={job.priority > 5 ? 'default' : 'secondary'}>
                Niveau {job.priority}
              </Badge>
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <span className="text-muted-foreground text-sm">Tentatives</span>
              <span className="text-sm">
                {job.attempts} / {job.maxAttempts}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Dates */}
        <Card>
          <CardHeader>
            <CardTitle>Dates</CardTitle>
            <CardDescription>Horodatage de la tâche</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start justify-between">
              <span className="text-muted-foreground text-sm">Créée</span>
              <div className="text-right">
                <p className="text-sm font-medium">
                  {formatDistanceToNow(new Date(job.createdAt), {
                    addSuffix: true,
                    locale: fr,
                  })}
                </p>
                <p className="text-muted-foreground text-xs">
                  {new Date(job.createdAt).toLocaleString('fr-FR')}
                </p>
              </div>
            </div>

            <Separator />

            {job.scheduledAt && (
              <>
                <div className="flex items-start justify-between">
                  <span className="text-muted-foreground text-sm">Planifiée pour</span>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {formatDistanceToNow(new Date(job.scheduledAt), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {new Date(job.scheduledAt).toLocaleString('fr-FR')}
                    </p>
                  </div>
                </div>
                <Separator />
              </>
            )}

            {job.startedAt && (
              <>
                <div className="flex items-start justify-between">
                  <span className="text-muted-foreground text-sm">Début du traitement</span>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {formatDistanceToNow(new Date(job.startedAt), {
                        addSuffix: true,
                        locale: fr,
                      })}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      {new Date(job.startedAt).toLocaleString('fr-FR')}
                    </p>
                  </div>
                </div>
                <Separator />
              </>
            )}

            {job.completedAt && (
              <div className="flex items-start justify-between">
                <span className="text-muted-foreground text-sm">Terminée</span>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {formatDistanceToNow(new Date(job.completedAt), {
                      addSuffix: true,
                      locale: fr,
                    })}
                  </p>
                  <p className="text-muted-foreground text-xs">
                    {new Date(job.completedAt).toLocaleString('fr-FR')}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Payload */}
        {job.payload && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Données d'Entrée (Payload)</CardTitle>
              <CardDescription>Paramètres passés à la tâche</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted overflow-auto rounded-lg p-4 text-sm">
                <code>{JSON.stringify(JSON.parse(job.payload), null, 2)}</code>
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Résultat */}
        {job.result && (
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Résultat
              </CardTitle>
              <CardDescription>Données retournées par la tâche</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted overflow-auto rounded-lg p-4 text-sm">
                <code>{JSON.stringify(JSON.parse(job.result), null, 2)}</code>
              </pre>
            </CardContent>
          </Card>
        )}

        {/* Erreur */}
        {job.error && (
          <Card className="border-destructive md:col-span-2">
            <CardHeader>
              <CardTitle className="text-destructive flex items-center gap-2">
                <XCircle className="h-5 w-5" />
                Erreur
              </CardTitle>
              <CardDescription>Détails de l'erreur rencontrée</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-destructive/10 text-destructive overflow-auto rounded-lg p-4 text-sm">
                <code>{JSON.stringify(JSON.parse(job.error), null, 2)}</code>
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
