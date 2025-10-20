import { FeatureSection } from '@/components/marketing/feature-section';
import { HeroSection } from '@/components/marketing/hero-section';
import SupportSection from '@/components/marketing/support-section';
import { WorkflowSection } from '@/components/marketing/workflow-section';
import { marketingMetadata } from '@/lib/metadata';
import type { Metadata } from 'next';

export const metadata: Metadata = marketingMetadata;

export default async function Home() {
  return (
    <>
      <HeroSection />
      <FeatureSection />
      <WorkflowSection />
      <SupportSection />
    </>
  );
}
