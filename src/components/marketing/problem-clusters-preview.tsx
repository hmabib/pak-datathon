import Link from 'next/link'
import { clusterDescriptions } from '@/lib/problem-clusters'
import { clusterLabels } from '@/lib/site'
import { SectionTitle } from '@/components/ui/section-title'

export function ProblemClustersPreview() {
  const entries = Object.entries(clusterDescriptions) as Array<
    [keyof typeof clusterLabels, (typeof clusterDescriptions)[keyof typeof clusterDescriptions]]
  >

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Problématiques"
          title="Clusterisation exhaustive des difficultés systémiques"
          subtitle="La plateforme ne cite pas de sites spécifiques; elle structure des types de problèmes réplicables à l’échelle de l’écosystème."
        />

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {entries.map(([code, item]) => (
            <article key={code} className="rounded-2xl border border-[var(--ink-200)] bg-[var(--sand-50)] p-5">
              <h3 className="text-sm font-black uppercase tracking-[0.12em] text-[var(--brand-700)]">{clusterLabels[code]}</h3>
              <p className="mt-2 text-sm text-[var(--ink-700)]">{item.overview}</p>
            </article>
          ))}
        </div>

        <Link
          href="/problematiques"
          className="inline-flex w-fit items-center rounded-xl bg-[var(--brand-500)] px-5 py-3 text-sm font-semibold text-white hover:bg-[var(--brand-600)]"
        >
          Voir l’analyse détaillée par type
        </Link>
      </div>
    </section>
  )
}
