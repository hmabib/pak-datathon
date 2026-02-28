import { SectionTitle } from '@/components/ui/section-title'

const actors = [
  'Institution PAK (détenteur stratégique de data)',
  'Acteurs logistiques et opérateurs de flux',
  'Experts data et analystes métiers',
  'Startups technologiques',
  'Universités et centres de recherche',
  'Analystes commerce international',
  'Opérateurs transport',
  'Décideurs économiques et régulateurs',
]

export function ActorsEcosystem() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Écosystème"
          title="Une coopération structurée entre institutions, experts et opérateurs"
          subtitle="Le modèle repose sur l’intelligence collective: chaque acteur contribue sur son périmètre pour produire une solution mesurable."
        />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {actors.map((actor) => (
            <article key={actor} className="rounded-xl border border-[var(--ink-200)] bg-[var(--sand-50)] p-4 text-sm text-[var(--ink-700)]">
              {actor}
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
