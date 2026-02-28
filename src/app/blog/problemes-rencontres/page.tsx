import { MarketingLayout } from '@/components/marketing/marketing-layout'
import { SectionTitle } from '@/components/ui/section-title'
import { chatProblemInsights, chatSourceSummary } from '@/lib/chat-problem-analysis'
import { clusterLabels } from '@/lib/site'

function scoreColor(value: number) {
  if (value >= 90) return 'text-[var(--success-500)]'
  if (value >= 75) return 'text-[var(--pak-gold-600)]'
  return 'text-[var(--danger-500)]'
}

export default function BlogProblemesRencontresPage() {
  return (
    <MarketingLayout>
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Blog terrain"
          title="Problèmes rencontrés: analyse clusterisée depuis le chat opérationnel"
          subtitle="Objectif: transformer les incidents récurrents en connaissances actionnables, avec un niveau d’accuracy et de compréhension explicite."
        />

        <article className="rounded-2xl border border-[var(--ink-200)] bg-white p-6">
          <p className="text-sm text-[var(--ink-700)]">
            <span className="font-semibold text-[var(--ink-900)]">Source:</span> {chatSourceSummary.channel} ({chatSourceSummary.period})
          </p>
          <p className="mt-2 text-sm text-[var(--ink-700)]">{chatSourceSummary.note}</p>
          <p className="mt-3 text-xs text-[var(--ink-700)]">
            Les clusters ci-dessous résument les motifs les plus fréquents observés dans les conversations d’assistance
            (BAS, scan/inspection, accès, instabilités plateformes, retours vides, coordination inter-acteurs).
          </p>
        </article>

        <div className="grid gap-6">
          {chatProblemInsights.map((entry) => (
            <article key={entry.slug} className="rounded-2xl border border-[var(--ink-200)] bg-[var(--sand-50)] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand-700)]">{clusterLabels[entry.cluster]}</p>
              <h2 className="mt-2 text-2xl font-black text-[var(--ink-900)]">{entry.title}</h2>
              <p className="mt-2 text-sm text-[var(--ink-700)]">{entry.operationalNarrative}</p>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-[var(--ink-200)] bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand-700)]">Signal observé</p>
                  <p className="mt-2 text-sm text-[var(--ink-700)]">{entry.evidencePattern}</p>
                  <p className="mt-2 text-xs font-semibold text-[var(--ink-700)]">{entry.frequencySignal}</p>
                </div>

                <div className="rounded-xl border border-[var(--ink-200)] bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand-700)]">Niveau d’analyse</p>
                  <p className={`mt-2 text-sm font-semibold ${scoreColor(entry.confidence)}`}>
                    Accuracy: {entry.confidence}/100
                  </p>
                  <p className={`text-sm font-semibold ${scoreColor(entry.comprehension)}`}>
                    Compréhension du problème: {entry.comprehension}/100
                  </p>
                </div>
              </div>

              <div className="mt-4 grid gap-3 md:grid-cols-2">
                <div className="rounded-xl border border-[var(--ink-200)] bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand-700)]">Causes probables</p>
                  <ul className="mt-2 grid gap-1 text-sm text-[var(--ink-700)]">
                    {entry.rootCauses.map((cause) => (
                      <li key={cause}>• {cause}</li>
                    ))}
                  </ul>
                </div>

                <div className="rounded-xl border border-[var(--ink-200)] bg-white p-4">
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand-700)]">Actions recommandées</p>
                  <ul className="mt-2 grid gap-1 text-sm text-[var(--ink-700)]">
                    {entry.recommendedActions.map((action) => (
                      <li key={action}>• {action}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 rounded-xl border border-[var(--ink-200)] bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand-700)]">Data mapping pour résolution</p>
                <div className="mt-2 grid gap-2 text-sm text-[var(--ink-700)] md:grid-cols-2">
                  <p>
                    <span className="font-semibold text-[var(--ink-900)]">Navires:</span> {entry.requiredData.vessel.join(' • ')}
                  </p>
                  <p>
                    <span className="font-semibold text-[var(--ink-900)]">Marchandises:</span> {entry.requiredData.cargo.join(' • ')}
                  </p>
                  <p>
                    <span className="font-semibold text-[var(--ink-900)]">Commerce international:</span> {entry.requiredData.trade.join(' • ')}
                  </p>
                  <p>
                    <span className="font-semibold text-[var(--ink-900)]">Camions:</span> {entry.requiredData.truck.join(' • ')}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </MarketingLayout>
  )
}
