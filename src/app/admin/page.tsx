import { redirect } from 'next/navigation'
import { Role } from '@prisma/client'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { StatCard } from '@/components/dashboard/stat-card'
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

  const [usersCount, problemsCount, openRequests, recentRequests, pendingProblems] = await Promise.all([
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
  ])

  return (
    <DashboardShell title="Administration" subtitle="Pilotage global de la plateforme" role="admin">
      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Utilisateurs" value={usersCount} />
        <StatCard label="Problèmes" value={problemsCount} />
        <StatCard label="Demandes ouvertes" value={openRequests} />
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
    </DashboardShell>
  )
}
