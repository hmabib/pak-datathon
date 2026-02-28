import { SectionTitle } from '@/components/ui/section-title'

const steps = [
  'Identification du problème',
  'Classification par cluster',
  'Data mapping et datasets nécessaires',
  'Constitution d’équipe multidisciplinaire',
  'Conception et versioning de solution',
  'Soumission/validation des requêtes data',
  'Mesure d’impact opérationnel et économique',
]

export function MethodologyMap() {
  return (
    <section className="bg-[var(--sand-100)] py-16 sm:py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Méthodologie"
          title="Un framework d’exécution de bout en bout"
          subtitle="Chaque étape produit des artefacts exploitables par les équipes, le comité de revue et l’administration data."
        />

        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {steps.map((step, index) => (
            <li key={step} className="rounded-2xl border border-[var(--ink-200)] bg-white p-5">
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand-700)]">Étape {index + 1}</p>
              <p className="mt-2 text-sm font-semibold text-[var(--ink-900)]">{step}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
