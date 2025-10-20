import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Job } from '@/lib/schemas/job';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Eye, Trash2 } from 'lucide-react';
import Link from 'next/link';

interface JobsTableProps {
  jobs: Job[];
  basePath?: string;
}

function getStatusBadge(status: string) {
  const variants: Record<string, { variant: any; label: string }> = {
    PENDING: { variant: 'secondary', label: 'En attente' },
    PROCESSING: { variant: 'default', label: 'En cours' },
    COMPLETED: { variant: 'default', label: 'Terminé' },
    FAILED: { variant: 'destructive', label: 'Échoué' },
    CANCELLED: { variant: 'outline', label: 'Annulé' },
  };

  const config = variants[status] || { variant: 'outline', label: status };

  return <Badge variant={config.variant}>{config.label}</Badge>;
}

function getTypeBadge(type: string) {
  const types: Record<string, string> = {
    SEND_EMAIL: 'Email',
    GENERATE_PDF: 'PDF',
    SEND_REMINDER: 'Rappel',
    CLEANUP_SESSIONS: 'Nettoyage',
    GENERATE_REPORT: 'Rapport',
  };

  return <Badge variant="outline">{types[type] || type}</Badge>;
}

export function JobsTable({ jobs, basePath = '/admin/jobs' }: JobsTableProps) {
  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
        <p className="text-muted-foreground text-sm">Aucune tâche trouvée</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Type</TableHead>
            <TableHead>État</TableHead>
            <TableHead>Priorité</TableHead>
            <TableHead>Tentatives</TableHead>
            <TableHead>Créé</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell>{getTypeBadge(job.type)}</TableCell>
              <TableCell>{getStatusBadge(job.status)}</TableCell>
              <TableCell>
                <Badge variant={job.priority > 5 ? 'default' : 'secondary'}>{job.priority}</Badge>
              </TableCell>
              <TableCell>
                {job.attempts} / {job.maxAttempts}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {formatDistanceToNow(new Date(job.createdAt), {
                  addSuffix: true,
                  locale: fr,
                })}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Link href={`${basePath}/${job.id}`}>
                    <Button variant="ghost" size="icon">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
