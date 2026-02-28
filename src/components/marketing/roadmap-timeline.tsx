import { siteConfig } from '@/lib/site'
import { SectionTitle } from '@/components/ui/section-title'

const phases = [
  'Phase 1: Architecture et cadrage',
  'Phase 2: Core features (auth, onboarding, dashboards)',
  'Phase 3: Onboarding intelligent et matching',
  'Phase 4: Classification problèmes + data mapping',
  'Phase 5: Simulations et analytics décisionnelles',
  'Phase 6: Sécurité, audit trail et gouvernance',
  'Phase 7: Industrialisation CI/CD et déploiement',
]

export function RoadmapTimeline() {
  return (
    <section className="bg-[var(--ink-50)] py-16 sm:py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Roadmap"
          title={`Plan d’exécution à partir du ${siteConfig.startDate}`}
          subtitle="La montée en capacité suit un séquencement progressif orienté valeur opérationnelle et adoption des acteurs."
        />

        <ol className="grid gap-4">
          {phases.map((phase, index) => (
            <li key={phase} className="flex gap-4 rounded-2xl border border-[var(--ink-200)] bg-white p-5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[var(--pak-gold-500)] text-xs font-bold text-[var(--ink-900)]">
                {index + 1}
              </span>
              <p className="text-sm font-semibold text-[var(--ink-900)]">{phase}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
