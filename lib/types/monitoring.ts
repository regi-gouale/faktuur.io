export async function trackQueryPerformance(
  queryName: string,
  fn: () => Promise<unknown>
) {
  const start = performance.now();
  try {
    return await fn();
  } finally {
    const duration = performance.now() - start;
    console.log(`[Performance] ${queryName}: ${duration.toFixed(2)}ms`);

    // Optionnel: Envoyer à service d'analytics
    // analytics.track('query_performance', { queryName, duration });
  }
}
