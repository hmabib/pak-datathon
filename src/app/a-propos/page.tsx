import { MarketingLayout } from '@/components/marketing/marketing-layout'
import { SectionTitle } from '@/components/ui/section-title'

export default function AboutPage() {
  return (
    <MarketingLayout>
      <section className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
        <SectionTitle
          eyebrow="Mission"
          title="Créer un socle commun entre opération, data et décision"
          subtitle="PAK DataThon Platform structure la collaboration entre acteurs publics et privés pour accélérer la modernisation logistique."
        />
        <div className="space-y-4 rounded-2xl border border-[var(--ink-200)] bg-white p-6">
          <h3 className="text-xl font-black text-[var(--ink-900)]">Nos principes</h3>
          <ul className="space-y-3 text-sm leading-relaxed text-[var(--ink-700)]">
            <li>Priorisation orientée impact opérationnel et mesurable.</li>
            <li>Éthique, conformité et confidentialité des données.</li>
            <li>Co-construction avec des profils complémentaires.</li>
            <li>Transparence via audit logs, votes et suivi des statuts.</li>
          </ul>
        </div>
      </section>
    </MarketingLayout>
  )
}
