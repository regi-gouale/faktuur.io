import { prisma } from '@/lib/prisma';
import type { Job } from '@/lib/schemas/job';

/**
 * Récupérer les statistiques des jobs
 */
export async function getJobsStats() {
  const [pending, processing, completed, failed, cancelled] = await Promise.all([
    prisma.job.count({ where: { status: 'PENDING' } }),
    prisma.job.count({ where: { status: 'PROCESSING' } }),
    prisma.job.count({ where: { status: 'COMPLETED' } }),
    prisma.job.count({ where: { status: 'FAILED' } }),
    prisma.job.count({ where: { status: 'CANCELLED' } }),
  ]);

  const total = pending + processing + completed + failed + cancelled;

  return {
    pending,
    processing,
    completed,
    failed,
    cancelled,
    total,
  };
}

/**
 * Récupérer la liste des jobs avec pagination
 */
export async function getJobs({
  status,
  type,
  limit = 50,
  offset = 0,
}: {
  status?: string;
  type?: string;
  limit?: number;
  offset?: number;
} = {}): Promise<Job[]> {
  const jobs = await prisma.job.findMany({
    where: {
      ...(status && { status: status as any }),
      ...(type && { type: type as any }),
    },
    orderBy: [{ priority: 'desc' }, { createdAt: 'desc' }],
    take: limit,
    skip: offset,
  });

  return jobs as Job[];
}

/**
 * Récupérer un job par son ID
 */
export async function getJobById(id: string): Promise<Job | null> {
  const job = await prisma.job.findUnique({
    where: { id },
  });

  return job as Job | null;
}

/**
 * Récupérer les jobs récents
 */
export async function getRecentJobs(limit = 10): Promise<Job[]> {
  const jobs = await prisma.job.findMany({
    orderBy: { createdAt: 'desc' },
    take: limit,
  });

  return jobs as Job[];
}

/**
 * Supprimer un job
 */
export async function deleteJob(id: string): Promise<void> {
  await prisma.job.delete({
    where: { id },
  });
}

/**
 * Nettoyer les jobs terminés (plus anciens que X jours)
 */
export async function cleanupOldJobs(daysOld = 7): Promise<number> {
  const date = new Date();
  date.setDate(date.getDate() - daysOld);

  const result = await prisma.job.deleteMany({
    where: {
      status: 'COMPLETED',
      completedAt: {
        lt: date,
      },
    },
  });

  return result.count;
}
