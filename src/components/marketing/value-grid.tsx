import { BarChart3, DatabaseZap, Handshake, ShieldCheck } from 'lucide-react'
import { SectionTitle } from '@/components/ui/section-title'

const values = [
  {
    title: 'Orchestration des problèmes',
    text: 'Capturez, priorisez et qualifiez chaque problème logistique avec métriques de sévérité et faisabilité.',
    icon: BarChart3,
  },
  {
    title: 'Gouvernance des données',
    text: 'Encadrez les demandes de datasets, l’accès et la traçabilité avec des règles d’éthique et conformité.',
    icon: ShieldCheck,
  },
  {
    title: 'Co-construction des solutions',
    text: 'Reliez experts métier, analystes et développeurs dans des équipes qui livrent rapidement.',
    icon: Handshake,
  },
  {
    title: 'Pilotage de l’impact',
    text: 'Suivez score d’onboarding, progression, usage des données et performance de mise en œuvre.',
    icon: DatabaseZap,
  },
]

export function ValueGrid() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Valeur"
          title="Un hub unique pour la performance collaborative"
          subtitle="La plateforme couvre tout le cycle, de l’idée à la validation terrain, sans perdre la traçabilité métier et data."
        />

        <div className="grid gap-4 md:grid-cols-2">
          {values.map((item) => {
            const Icon = item.icon
            return (
              <article key={item.title} className="rounded-2xl border border-[var(--ink-200)] bg-[var(--sand-50)] p-6">
                <Icon className="mb-4 h-6 w-6 text-[var(--brand-600)]" />
                <h3 className="text-lg font-bold text-[var(--ink-900)]">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[var(--ink-700)]">{item.text}</p>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
