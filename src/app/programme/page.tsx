import { MarketingLayout } from '@/components/marketing/marketing-layout'
import { SectionTitle } from '@/components/ui/section-title'
import { siteConfig } from '@/lib/site'

const agenda = [
  { phase: 'Phase 1', title: 'Architecture & cadrage', detail: 'Cadrage stratégique, architecture ERP data et objectifs de transformation.' },
  { phase: 'Phase 2', title: 'Core features', detail: 'Auth, onboarding, dashboards user/admin, socle SQL et APIs métiers.' },
  { phase: 'Phase 3', title: 'Onboarding intelligent', detail: 'Scoring de compatibilité, matching équipes/problèmes/datasets.' },
  { phase: 'Phase 4', title: 'Classification & data mapping', detail: 'Analyse NLP, typologie clusterisée et cartographie des besoins data.' },
  { phase: 'Phase 5', title: 'Simulations & analytics', detail: 'Scénarios de congestion, flux commerce et stress tests logistiques.' },
  { phase: 'Phase 6', title: 'Sécurité & audit', detail: 'Audit trail, gouvernance data, contrôle accès et traçabilité complète.' },
  { phase: 'Phase 7', title: 'Industrialisation', detail: 'CI/CD, observabilité, optimisation coûts, déploiement production.' },
]

export default function ProgrammePage() {
  return (
    <MarketingLayout>
      <section className="mx-auto w-full max-w-6xl space-y-10 px-4 py-16 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Programme"
          title={`Plan d’exécution à partir du ${siteConfig.startDate}`}
          subtitle="Le programme est construit pour livrer rapidement des solutions actionnables tout en consolidant la gouvernance data."
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
