'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  AlertCircle,
  CheckCircle,
  Circle,
  Loader2,
  Pause,
  Play,
  RefreshCw,
  Trash2,
} from 'lucide-react';
import { useEffect, useState } from 'react';

interface QueueStats {
  name: string;
  waiting: number;
  active: number;
  completed: number;
  failed: number;
  delayed: number;
  paused: number;
}

export default function QueuesPage() {
  const [stats, setStats] = useState<QueueStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/queue-stats');
      const data = await response.json();

      if (data.success) {
        setStats(data.data);
        setError(null);
      } else {
        setError(data.error);
      }
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000); // Rafraîchir toutes les 5 secondes
    return () => clearInterval(interval);
  }, []);

  const handlePause = async (queueName: string) => {
    try {
      const response = await fetch(`/api/admin/queue-stats/${queueName}/pause`, {
        method: 'POST',
      });
      const data = await response.json();

      if (data.success) {
        await fetchStats();
      } else {
        alert(`Erreur: ${data.error}`);
      }
    } catch (err: unknown) {
      alert(`Erreur: ${(err as Error).message}`);
    }
  };

  const handleResume = async (queueName: string) => {
    try {
      const response = await fetch(`/api/admin/queue-stats/${queueName}/resume`, {
        method: 'POST',
      });
      const data = await response.json();

      if (data.success) {
        await fetchStats();
      } else {
        alert(`Erreur: ${data.error}`);
      }
    } catch (err: unknown) {
      alert(`Erreur: ${(err as Error).message}`);
    }
  };

  const handleClean = async (queueName: string) => {
    if (!confirm(`Êtes-vous sûr de vouloir nettoyer la queue ${queueName} ?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/queue-stats/${queueName}/clean`, {
        method: 'POST',
      });
      const data = await response.json();

      if (data.success) {
        alert(data.message);
        await fetchStats();
      } else {
        alert(`Erreur: ${data.error}`);
      }
    } catch (err: unknown) {
      alert(`Erreur: ${(err as Error).message}`);
    }
  };

  if (loading && stats.length === 0) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <Loader2 className="text-muted-foreground mx-auto h-8 w-8 animate-spin" />
          <p className="text-muted-foreground mt-2 text-sm">Chargement des queues...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[400px] items-center justify-center">
        <div className="text-center">
          <AlertCircle className="text-destructive mx-auto h-8 w-8" />
          <p className="text-destructive mt-2 text-sm">{error}</p>
          <Button onClick={fetchStats} variant="outline" className="mt-4">
            <RefreshCw className="mr-2 h-4 w-4" />
            Réessayer
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gestion des Queues</h1>
          <p className="text-muted-foreground">
            Surveillez et gérez les queues Redis en temps réel
          </p>
        </div>
        <Button onClick={fetchStats} variant="outline" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>

      {/* Grille des queues */}
      <div className="grid gap-6 md:grid-cols-2">
        {stats.map((queue) => (
          <Card key={queue.name}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">{queue.name}</CardTitle>
                  <CardDescription>Queue BullMQ</CardDescription>
                </div>
                {queue.paused > 0 ? (
                  <Badge variant="outline" className="gap-1">
                    <Pause className="h-3 w-3" />
                    En pause
                  </Badge>
                ) : (
                  <Badge variant="default" className="gap-1">
                    <Play className="h-3 w-3" />
                    Active
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Statistiques */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <Circle className="text-muted-foreground mx-auto h-4 w-4" />
                  <p className="mt-1 text-2xl font-bold">{queue.waiting}</p>
                  <p className="text-muted-foreground text-xs">En attente</p>
                </div>
                <div className="text-center">
                  <Loader2 className="mx-auto h-4 w-4 text-blue-600" />
                  <p className="mt-1 text-2xl font-bold">{queue.active}</p>
                  <p className="text-muted-foreground text-xs">En cours</p>
                </div>
                <div className="text-center">
                  <CheckCircle className="mx-auto h-4 w-4 text-green-600" />
                  <p className="mt-1 text-2xl font-bold">{queue.completed}</p>
                  <p className="text-muted-foreground text-xs">Terminés</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <AlertCircle className="text-destructive mx-auto h-4 w-4" />
                  <p className="mt-1 text-xl font-bold">{queue.failed}</p>
                  <p className="text-muted-foreground text-xs">Échoués</p>
                </div>
                <div className="text-center">
                  <RefreshCw className="mx-auto h-4 w-4 text-orange-600" />
                  <p className="mt-1 text-xl font-bold">{queue.delayed}</p>
                  <p className="text-muted-foreground text-xs">Différés</p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {queue.paused > 0 ? (
                  <Button
                    onClick={() => handleResume(queue.name)}
                    variant="default"
                    size="sm"
                    className="flex-1"
                  >
                    <Play className="mr-2 h-4 w-4" />
                    Reprendre
                  </Button>
                ) : (
                  <Button
                    onClick={() => handlePause(queue.name)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Pause className="mr-2 h-4 w-4" />
                    Pause
                  </Button>
                )}
                <Button
                  onClick={() => handleClean(queue.name)}
                  variant="outline"
                  size="sm"
                  className="flex-1"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Nettoyer
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Info */}
      <Card>
        <CardHeader>
          <CardTitle>À propos</CardTitle>
          <CardDescription>Informations sur les queues</CardDescription>
        </CardHeader>
        <CardContent className="text-muted-foreground space-y-2 text-sm">
          <p>• Les statistiques sont automatiquement rafraîchies toutes les 5 secondes</p>
          <p>• La pause arrête le traitement des nouveaux jobs sans les supprimer</p>
          <p>• Le nettoyage supprime les jobs terminés et échoués (ne peut pas être annulé)</p>
          <p>
            • Pour une gestion plus avancée, utilisez le{' '}
            <a href="/api/admin/queues" target="_blank" className="text-primary hover:underline">
              Bull Board Dashboard
            </a>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
