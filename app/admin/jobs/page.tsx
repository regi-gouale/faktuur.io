import { JobsStats } from '@/components/app/jobs-stats';
import { JobsTable } from '@/components/app/jobs-table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getJobs, getJobsStats } from '@/lib/dal/job';
import { RefreshCw, Trash2 } from 'lucide-react';
import Link from 'next/link';

export default async function AdminJobsPage() {
  // Récupérer les statistiques
  const stats = await getJobsStats();

  // Récupérer tous les jobs
  const allJobs = await getJobs({ limit: 100 });

  // Filtrer par statut
  const pendingJobs = allJobs.filter((job) => job.status === 'PENDING');
  const processingJobs = allJobs.filter((job) => job.status === 'PROCESSING');
  const completedJobs = allJobs.filter((job) => job.status === 'COMPLETED');
  const failedJobs = allJobs.filter((job) => job.status === 'FAILED');

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Tâches</h1>
          <p className="text-muted-foreground">
            Suivez et gérez les tâches asynchrones de votre application
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button variant="outline">
            <Trash2 className="mr-2 h-4 w-4" />
            Nettoyer
          </Button>
        </div>
      </div>

      {/* Statistiques */}
      <JobsStats stats={stats} />

      {/* Tableau des tâches avec onglets */}
      <Card>
        <CardHeader>
          <CardTitle>Liste des Tâches</CardTitle>
          <CardDescription>Visualisez toutes les tâches par statut</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" className="w-full">
            <TabsList>
              <TabsTrigger value="all">
                Toutes <span className="text-muted-foreground ml-2 text-xs">({stats.total})</span>
              </TabsTrigger>
              <TabsTrigger value="pending">
                En attente{' '}
                <span className="text-muted-foreground ml-2 text-xs">({stats.pending})</span>
              </TabsTrigger>
              <TabsTrigger value="processing">
                En cours{' '}
                <span className="text-muted-foreground ml-2 text-xs">({stats.processing})</span>
              </TabsTrigger>
              <TabsTrigger value="completed">
                Terminées{' '}
                <span className="text-muted-foreground ml-2 text-xs">({stats.completed})</span>
              </TabsTrigger>
              <TabsTrigger value="failed">
                Échouées{' '}
                <span className="text-muted-foreground ml-2 text-xs">({stats.failed})</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <JobsTable jobs={allJobs} />
            </TabsContent>

            <TabsContent value="pending" className="mt-6">
              <JobsTable jobs={pendingJobs} />
            </TabsContent>

            <TabsContent value="processing" className="mt-6">
              <JobsTable jobs={processingJobs} />
            </TabsContent>

            <TabsContent value="completed" className="mt-6">
              <JobsTable jobs={completedJobs} />
            </TabsContent>

            <TabsContent value="failed" className="mt-6">
              <JobsTable jobs={failedJobs} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Info */}
      <Card>
        <CardHeader>
          <CardTitle>Besoin d'aide ?</CardTitle>
          <CardDescription>
            Consultez la documentation pour en savoir plus sur le système de tâches
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/docs/queue-usage" target="_blank">
                Documentation
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/api/admin/queues" target="_blank">
                Bull Board Dashboard
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
