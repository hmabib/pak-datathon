import { MarketingLayout } from '@/components/marketing/marketing-layout'
import { Hero } from '@/components/marketing/hero'
import { ValueGrid } from '@/components/marketing/value-grid'
import { Journey } from '@/components/marketing/journey'
import { CtaBand } from '@/components/marketing/cta-band'

export default function HomePage() {
  return (
    <MarketingLayout>
      <Hero />
      <ValueGrid />
      <Journey />
      <CtaBand />
    </MarketingLayout>
  )
}
