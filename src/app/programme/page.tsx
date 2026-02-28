import { MarketingLayout } from '@/components/marketing/marketing-layout'
import { SectionTitle } from '@/components/ui/section-title'

const agenda = [
  { phase: 'Semaine 1', title: 'Onboarding et cadrage', detail: 'Activation des comptes, scoring et engagement de gouvernance.' },
  { phase: 'Semaine 2', title: 'Collecte des problèmes', detail: 'Consolidation des cas logistiques et qualification des besoins data.' },
  { phase: 'Semaine 3', title: 'Sprint de solutions', detail: 'Formation des équipes et prototypage des solutions analytiques.' },
  { phase: 'Semaine 4', title: 'Validation finale', detail: 'Démonstration, vote, arbitrage et plan de déploiement.' },
]

export default function ProgrammePage() {
  return (
    <MarketingLayout>
      <section className="mx-auto w-full max-w-6xl space-y-10 px-4 py-16 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Programme"
          title="Un cycle intensif en 4 phases"
          subtitle="La progression est orientée livraison: chaque phase produit des artefacts exploitables immédiatement."
        />

        <div className="grid gap-4">
          {agenda.map((item) => (
            <article key={item.phase} className="rounded-2xl border border-[var(--ink-200)] bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--brand-700)]">{item.phase}</p>
              <h3 className="mt-2 text-xl font-black text-[var(--ink-900)]">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--ink-700)]">{item.detail}</p>
            </article>
          ))}
        </div>
      </section>
    </MarketingLayout>
  )
}
