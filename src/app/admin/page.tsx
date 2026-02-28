import { redirect } from 'next/navigation'
import { Role } from '@prisma/client'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { StatCard } from '@/components/dashboard/stat-card'
import { AdminActions } from '@/components/dashboard/admin-actions'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { clusterLabels } from '@/lib/site'

export default async function AdminPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/auth/login')
  }

  if (user.role !== Role.ADMIN && user.role !== Role.MODERATOR) {
    redirect('/dashboard')
  }

  const [usersCount, problemsCount, openRequests, recentRequests, pendingProblems, simulationsCount, clustersCount, accessLogsCount, requestHeatmap, topTags, latestSimulations] = await Promise.all([
    prisma.user.count(),
    prisma.problem.count(),
    prisma.dataRequest.count({ where: { status: { in: ['SOUMISE', 'EN_REVUE', 'ATTRIBUEE'] } } }),
    prisma.dataRequest.findMany({
      take: 6,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        datasetType: true,
        cluster: true,
        status: true,
        requester: { select: { name: true, email: true } },
      },
    }),
    prisma.problem.findMany({
      take: 6,
      where: { status: { in: ['IDENTIFIE', 'EN_ANALYSE', 'EQUIPE_FORMEE'] } },
      orderBy: { updatedAt: 'desc' },
      select: {
        id: true,
        title: true,
        status: true,
        cluster: true,
      },
    }),
    prisma.simulation.count(),
    prisma.clusterCatalog.count(),
    prisma.datasetAccessLog.count(),
    prisma.dataRequest.groupBy({
      by: ['cluster'],
      _count: { _all: true },
      orderBy: {
        _count: {
          cluster: 'desc',
        },
      },
    }),
    prisma.problemTag.groupBy({
      by: ['tag'],
      _count: { _all: true },
      orderBy: {
        _count: {
          tag: 'desc',
        },
      },
      take: 10,
    }),
    prisma.simulation.findMany({
      orderBy: { createdAt: 'desc' },
      take: 6,
      select: {
        id: true,
        title: true,
        type: true,
        status: true,
        user: { select: { name: true, email: true } },
      },
    }),
  ])

  return (
    <DashboardShell title="Administration" subtitle="Pilotage global de la plateforme" role="admin">
      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Utilisateurs" value={usersCount} />
        <StatCard label="Problèmes" value={problemsCount} />
        <StatCard label="Demandes ouvertes" value={openRequests} />
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Simulations" value={simulationsCount} />
        <StatCard label="Clusters catalogués" value={clustersCount} />
        <StatCard label="Logs d'accès dataset" value={accessLogsCount} />
      </section>

      <section className="rounded-2xl border border-[var(--ink-200)] bg-white p-5">
        <h2 className="text-lg font-black text-[var(--ink-900)]">Actions de gouvernance</h2>
        <p className="mt-1 text-sm text-[var(--ink-700)]">Seed des clusters, synchronisation taxonomie et opération d’administration.</p>
        <div className="mt-4">
          <AdminActions />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-[var(--ink-200)] bg-white p-5">
          <h2 className="text-lg font-black text-[var(--ink-900)]">Dernières demandes datasets</h2>
          <ul className="mt-4 grid gap-3 text-sm">
            {recentRequests.map((request) => (
              <li key={request.id} className="rounded-xl border border-[var(--ink-200)] p-3">
                <p className="font-semibold text-[var(--ink-900)]">{request.datasetType}</p>
                <p className="text-xs text-[var(--ink-700)]">
                  {clusterLabels[request.cluster]} • {request.status}
                </p>
                <p className="text-xs text-[var(--ink-700)]">{request.requester.name || request.requester.email}</p>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-[var(--ink-200)] bg-white p-5">
          <h2 className="text-lg font-black text-[var(--ink-900)]">Problèmes à arbitrer</h2>
          <ul className="mt-4 grid gap-3 text-sm">
            {pendingProblems.map((problem) => (
              <li key={problem.id} className="rounded-xl border border-[var(--ink-200)] p-3">
                <p className="font-semibold text-[var(--ink-900)]">{problem.title}</p>
                <p className="text-xs text-[var(--ink-700)]">
                  {clusterLabels[problem.cluster]} • {problem.status}
                </p>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-[var(--ink-200)] bg-white p-5">
          <h2 className="text-lg font-black text-[var(--ink-900)]">Heatmap besoins data (par cluster)</h2>
          <ul className="mt-4 grid gap-2 text-sm">
            {requestHeatmap.map((entry) => (
              <li key={entry.cluster} className="flex items-center justify-between rounded-lg border border-[var(--ink-200)] px-3 py-2">
                <span>{clusterLabels[entry.cluster]}</span>
                <span className="font-semibold text-[var(--ink-900)]">{entry._count._all}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-[var(--ink-200)] bg-white p-5">
          <h2 className="text-lg font-black text-[var(--ink-900)]">Typologies dominantes (tags)</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {topTags.map((tag) => (
              <span key={tag.tag} className="rounded-full border border-[var(--ink-200)] bg-[var(--sand-50)] px-3 py-1 text-xs font-semibold text-[var(--ink-700)]">
                {tag.tag} ({tag._count._all})
              </span>
            ))}
          </div>
        </article>
      </section>

      <section className="rounded-2xl border border-[var(--ink-200)] bg-white p-5">
        <h2 className="text-lg font-black text-[var(--ink-900)]">Dernières simulations multi-scénarios</h2>
        <ul className="mt-4 grid gap-3 text-sm md:grid-cols-2">
          {latestSimulations.map((simulation) => (
            <li key={simulation.id} className="rounded-xl border border-[var(--ink-200)] p-3">
              <p className="font-semibold text-[var(--ink-900)]">{simulation.title}</p>
              <p className="text-xs text-[var(--ink-700)]">
                {simulation.type} • {simulation.status}
              </p>
              <p className="text-xs text-[var(--ink-700)]">{simulation.user.name || simulation.user.email}</p>
            </li>
          ))}
        </ul>
      </section>
    </DashboardShell>
  )
}
