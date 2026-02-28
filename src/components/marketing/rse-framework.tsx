import { Leaf, Users2, ShieldCheck } from 'lucide-react'
import { SectionTitle } from '@/components/ui/section-title'

const pillars = [
  {
    title: 'Environnement',
    icon: Leaf,
    items: [
      'Optimisation des flux pour réduire les émissions CO₂',
      'Réduction des temps d’attente navires',
      'Diminution de la congestion camions',
      'Smart planning énergétique des opérations',
    ],
  },
  {
    title: 'Social',
    icon: Users2,
    items: [
      'Collaboration inter-acteurs et inter-disciplines',
      'Développement des compétences data',
      'Inclusion startups, chercheurs et universités',
      'Co-construction d’innovations applicables',
    ],
  },
  {
    title: 'Gouvernance',
    icon: ShieldCheck,
    items: [
      'Transparence des requêtes data',
      'Audit trail et traçabilité des décisions',
      'Contrôle d’accès par niveau de sensibilité',
      'Cadre éthique et sécurité des données',
    ],
  },
]

export function RseFramework() {
  return (
    <section className="bg-[var(--ink-900)] py-16 text-white sm:py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Démarche RSE"
          title="Performance durable, transparence et responsabilité"
          subtitle="La plateforme intègre nativement les exigences environnementales, sociales et de gouvernance pour garantir un impact durable."
          tone="light"
        />
        <div className="grid gap-4 md:grid-cols-3">
          {pillars.map((pillar) => {
            const Icon = pillar.icon
            return (
              <article key={pillar.title} className="rounded-2xl border border-white/20 bg-white/5 p-6">
                <Icon className="mb-4 h-6 w-6 text-[var(--pak-gold-500)]" />
                <h3 className="text-lg font-black">{pillar.title}</h3>
                <ul className="mt-3 grid gap-2 text-sm text-white/85">
                  {pillar.items.map((item) => (
                    <li key={item}>• {item}</li>
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
