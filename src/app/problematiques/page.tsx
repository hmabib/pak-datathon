import { MarketingLayout } from '@/components/marketing/marketing-layout'
import { SectionTitle } from '@/components/ui/section-title'
import { clusterLabels } from '@/lib/site'
import { clusterProblemTypes, type ClusterProblemType } from '@/lib/problem-clusters'
import Link from 'next/link'

function DataList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-xl border border-[var(--ink-200)] bg-white p-4">
      <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand-700)]">{title}</p>
      <ul className="mt-2 grid gap-1 text-xs text-[var(--ink-700)]">
        {items.map((item) => (
          <li key={item}>• {item}</li>
        ))}
      </ul>
    </div>
  )
}

function ProblemCard({ problem }: { problem: ClusterProblemType }) {
  return (
    <article className="rounded-2xl border border-[var(--ink-200)] bg-[var(--sand-50)] p-6">
      <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--brand-700)]">{clusterLabels[problem.cluster]}</p>
      <h3 className="mt-2 text-xl font-black text-[var(--ink-900)]">{problem.type}</h3>
      <p className="mt-2 text-sm text-[var(--ink-700)]">{problem.challenge}</p>

      <div className="mt-4 grid gap-2 text-sm text-[var(--ink-700)]">
        <p>
          <span className="font-semibold text-[var(--ink-900)]">Symptômes:</span> {problem.symptoms.join(' • ')}
        </p>
        <p>
          <span className="font-semibold text-[var(--ink-900)]">Impact:</span> {problem.businessImpact.join(' • ')}
        </p>
        <p>
          <span className="font-semibold text-[var(--ink-900)]">Volume data indicatif:</span> {problem.indicativeVolume}
        </p>
        <p>
          <span className="font-semibold text-[var(--ink-900)]">Complexité analytique:</span> {problem.analyticalComplexity}/5
        </p>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2">
        <DataList title="Données navires" items={problem.requiredData.vessel} />
        <DataList title="Données marchandises" items={problem.requiredData.cargo} />
        <DataList title="Données commerce international" items={problem.requiredData.trade} />
        <DataList title="Données camions" items={problem.requiredData.truck} />
      </div>

      <div className="mt-4 rounded-xl border border-[var(--ink-200)] bg-white p-4">
        <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--brand-700)]">Approches recommandées</p>
        <p className="mt-2 text-sm text-[var(--ink-700)]">{problem.recommendedMethods.join(' • ')}</p>
      </div>
    </article>
  )
}

export default function ProblematiquesPage() {
  return (
    <MarketingLayout>
      <section className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 py-16 sm:px-6 lg:px-8">
        <SectionTitle
          eyebrow="Analyse exhaustive"
          title="Typologie des difficultés systémiques et mapping data"
          subtitle="Cette cartographie couvre les principaux types de problèmes logistiques sans citer de sites spécifiques, avec les données PAK nécessaires pour orienter la résolution."
        />

        <div className="rounded-2xl border border-[var(--ink-200)] bg-white p-5 text-sm text-[var(--ink-700)]">
          <p>
            Pour une lecture “terrain” basée sur les incidents réellement remontés dans les échanges opérationnels,
            consultez aussi le blog d’analyse.
          </p>
          <Link
            href="/blog/problemes-rencontres"
            className="mt-3 inline-flex rounded-xl bg-[var(--brand-500)] px-4 py-2 font-semibold text-white"
          >
            Ouvrir le blog des problèmes rencontrés
          </Link>
        </div>

        <div className="grid gap-6">
          {clusterProblemTypes.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} />
          ))}
        </div>
      </section>
    </MarketingLayout>
  )
}
