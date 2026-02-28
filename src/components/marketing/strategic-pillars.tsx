import { Boxes, CircleDollarSign, Cpu, ShieldAlert } from 'lucide-react'
import { SectionTitle } from '@/components/ui/section-title'

const pillars = [
  {
    title: 'Enjeux Opérationnels',
    points: ['Fluidité logistique bout-en-bout', 'Optimisation des flux de passage', 'Coordination multimodale en temps quasi réel'],
    icon: Boxes,
  },
  {
    title: 'Enjeux Économiques',
    points: ['Compétitivité internationale', 'Équilibre import/export', 'Anticipation macro-économique des corridors'],
    icon: CircleDollarSign,
  },
  {
    title: 'Enjeux Technologiques',
    points: ['Exploitation Big Data', 'Interopérabilité inter-systèmes', 'Mécanismes prédictifs et prescriptifs'],
    icon: Cpu,
  },
  {
    title: 'Enjeux Systémiques',
    points: ['Résilience opérationnelle', 'Gouvernance data unifiée', 'Coopération multi-acteurs structurée'],
    icon: ShieldAlert,
  },
]

export function StrategicPillars() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Vision stratégique"
          title="Transformer la complexité systémique en avantage piloté par la donnée"
          subtitle="Le projet articule performance opérationnelle, impact économique, excellence technologique et gouvernance durable."
        />
        <div className="grid gap-4 md:grid-cols-2">
          {pillars.map((pillar) => {
            const Icon = pillar.icon
            return (
              <article key={pillar.title} className="rounded-2xl border border-[var(--ink-200)] bg-[var(--ink-50)] p-6">
                <Icon className="mb-4 h-6 w-6 text-[var(--pak-gold-600)]" />
                <h3 className="text-lg font-black text-[var(--ink-900)]">{pillar.title}</h3>
                <ul className="mt-3 grid gap-2 text-sm text-[var(--ink-700)]">
                  {pillar.points.map((point) => (
                    <li key={point}>• {point}</li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>
      </div>
    </section>
  )
}
