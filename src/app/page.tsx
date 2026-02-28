import { MarketingLayout } from '@/components/marketing/marketing-layout'
import { Hero } from '@/components/marketing/hero'
import { ValueGrid } from '@/components/marketing/value-grid'
import { StrategicPillars } from '@/components/marketing/strategic-pillars'
import { ProblemClustersPreview } from '@/components/marketing/problem-clusters-preview'
import { RseFramework } from '@/components/marketing/rse-framework'
import { ActorsEcosystem } from '@/components/marketing/actors-ecosystem'
import { MethodologyMap } from '@/components/marketing/methodology-map'
import { Journey } from '@/components/marketing/journey'
import { RoadmapTimeline } from '@/components/marketing/roadmap-timeline'
import { CtaBand } from '@/components/marketing/cta-band'

export default function HomePage() {
  return (
    <MarketingLayout>
      <Hero />
      <ValueGrid />
      <StrategicPillars />
      <ProblemClustersPreview />
      <RseFramework />
      <ActorsEcosystem />
      <MethodologyMap />
      <Journey />
      <RoadmapTimeline />
      <CtaBand />
    </MarketingLayout>
  )
}
