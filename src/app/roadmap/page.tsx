import { MarketingLayout } from '@/components/marketing/marketing-layout'
import { RoadmapTimeline } from '@/components/marketing/roadmap-timeline'
import { SectionTitle } from '@/components/ui/section-title'
import { siteConfig } from '@/lib/site'

export default function RoadmapPage() {
  return (
    <MarketingLayout>
      <section className="mx-auto w-full max-w-6xl space-y-8 px-4 py-16 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Exécution"
          title={`Roadmap produit et data à partir du ${siteConfig.startDate}`}
          subtitle="Le programme s’exécute en phases successives avec gouvernance, sécurité et industrialisation progressive jusqu’au déploiement à grande échelle."
        />
        <RoadmapTimeline />
      </section>
    </MarketingLayout>
  )
}
