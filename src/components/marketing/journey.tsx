import { SectionTitle } from '@/components/ui/section-title'

const steps = [
  {
    title: '1. Onboarding ciblé',
    detail: 'Profil acteur, niveau data, compétences et engagements pour calibrer votre contribution.',
  },
  {
    title: '2. Diagnostic partagé',
    detail: 'Déposez ou enrichissez des problèmes en précisant cluster, sévérité et besoin de datasets.',
  },
  {
    title: '3. Exécution en équipe',
    detail: 'Constituez des équipes multi-compétences et collaborez sur les solutions proposées.',
  },
  {
    title: '4. Validation et diffusion',
    detail: 'Vote, commentaires et suivi des KPI pour transformer les meilleures idées en déploiements.',
  },
]

export function Journey() {
  return (
    <section className="bg-[var(--ink-900)] py-16 text-white sm:py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Parcours"
          title="Un flux d’exécution clair, du profil à l’impact"
          subtitle="Chaque participant suit un workflow simple pour contribuer, collaborer et livrer des solutions actionnables."
          tone="light"
        />

        <ol className="grid gap-4 md:grid-cols-2">
          {steps.map((step) => (
            <li key={step.title} className="rounded-2xl border border-white/20 bg-white/5 p-6 backdrop-blur">
              <h3 className="text-xl font-bold text-white">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/85">{step.detail}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
