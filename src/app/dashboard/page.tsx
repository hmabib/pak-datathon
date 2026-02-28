import { redirect } from 'next/navigation'
import Link from 'next/link'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { StatCard } from '@/components/dashboard/stat-card'
import { getCurrentUser } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { clusterLabels } from '@/lib/site'
import { clusterProblemTypes } from '@/lib/problem-clusters'

export default async function DashboardPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/auth/login')
  }

  if (user.onboardingStep !== 'DASHBOARD_ACTIF') {
    redirect('/onboarding')
  }

  const [problems, dataRequests, notifications, profile, teamMemberships, simulations] = await Promise.all([
    prisma.problem.findMany({
      where: { createdById: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        cluster: true,
        status: true,
        createdAt: true,
      },
    }),
    prisma.dataRequest.findMany({
      where: { requesterId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        datasetType: true,
        status: true,
        cluster: true,
        createdAt: true,
      },
    }),
    prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: 'desc' },
      take: 5,
      select: {
        id: true,
        title: true,
        type: true,
        read: true,
        createdAt: true,
      },
    }),
    prisma.userProfile.findUnique({
      where: { userId: user.id },
      select: {
        actorType: true,
        dataLevel: true,
        organisation: true,
        interetClusters: true,
      },
    }),
    prisma.teamMember.findMany({
      where: { userId: user.id },
      select: {
        teamId: true,
        role: true,
        team: {
          select: {
            name: true,
            cluster: true,
          },
        },
      },
      take: 5,
      orderBy: { joinedAt: 'desc' },
    }),
    prisma.simulation.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        title: true,
        type: true,
        status: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ])

  const recommendedProblemTypes = clusterProblemTypes
    .filter((item) => profile?.interetClusters?.includes(item.cluster))
    .slice(0, 4)

  return (
    <DashboardShell
      title={`Bienvenue ${user.name}`}
      subtitle="Vue consolidée de votre activité DataThon"
      role={user.role === 'ADMIN' ? 'admin' : 'user'}
    >
      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Problèmes créés" value={problems.length} />
        <StatCard label="Demandes de données" value={dataRequests.length} />
        <StatCard label="Notifications" value={notifications.length} />
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Équipes rejointes" value={teamMemberships.length} />
        <StatCard label="Simulations" value={simulations.length} />
        <StatCard label="Clusters ciblés" value={profile?.interetClusters?.length || 0} />
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-[var(--ink-200)] bg-white p-5">
          <h2 className="text-lg font-black text-[var(--ink-900)]">Mon profil</h2>
          <dl className="mt-4 grid gap-2 text-sm text-[var(--ink-700)]">
            <div className="flex justify-between gap-4">
              <dt>Type acteur</dt>
              <dd className="font-semibold text-[var(--ink-900)]">{profile?.actorType ?? 'Non renseigné'}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Niveau data</dt>
              <dd className="font-semibold text-[var(--ink-900)]">{profile?.dataLevel ?? 'Non renseigné'}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt>Organisation</dt>
              <dd className="font-semibold text-[var(--ink-900)]">{profile?.organisation ?? 'Non renseigné'}</dd>
            </div>
          </dl>
          <div className="mt-4 flex flex-wrap gap-2">
            {profile?.interetClusters?.map((cluster) => (
              <span key={cluster} className="rounded-full bg-[var(--sand-100)] px-3 py-1 text-xs font-semibold text-[var(--brand-700)]">
                {clusterLabels[cluster]}
              </span>
            ))}
          </div>
        </article>

        <article className="rounded-2xl border border-[var(--ink-200)] bg-white p-5">
          <h2 className="text-lg font-black text-[var(--ink-900)]">Dernières notifications</h2>
          <ul className="mt-4 grid gap-3">
            {notifications.length ? (
              notifications.map((notification) => (
                <li key={notification.id} className="rounded-xl border border-[var(--ink-200)] p-3">
                  <p className="text-sm font-semibold text-[var(--ink-900)]">{notification.title}</p>
                  <p className="text-xs text-[var(--ink-700)]">
                    {notification.type} • {new Date(notification.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </li>
              ))
            ) : (
              <li className="text-sm text-[var(--ink-700)]">Aucune notification.</li>
            )}
          </ul>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-[var(--ink-200)] bg-white p-5">
          <h2 className="text-lg font-black text-[var(--ink-900)]">Mes problèmes</h2>
          <ul className="mt-4 grid gap-3 text-sm">
            {problems.length ? (
              problems.map((problem) => (
                <li key={problem.id} className="rounded-xl border border-[var(--ink-200)] p-3">
                  <p className="font-semibold text-[var(--ink-900)]">{problem.title}</p>
                  <p className="text-xs text-[var(--ink-700)]">
                    {clusterLabels[problem.cluster]} • {problem.status}
                  </p>
                </li>
              ))
            ) : (
              <li className="text-[var(--ink-700)]">Aucun problème soumis.</li>
            )}
          </ul>
        </article>

        <article className="rounded-2xl border border-[var(--ink-200)] bg-white p-5">
          <h2 className="text-lg font-black text-[var(--ink-900)]">Mes demandes de datasets</h2>
          <ul className="mt-4 grid gap-3 text-sm">
            {dataRequests.length ? (
              dataRequests.map((request) => (
                <li key={request.id} className="rounded-xl border border-[var(--ink-200)] p-3">
                  <p className="font-semibold text-[var(--ink-900)]">{request.datasetType}</p>
                  <p className="text-xs text-[var(--ink-700)]">
                    {clusterLabels[request.cluster]} • {request.status}
                  </p>
                </li>
              ))
            ) : (
              <li className="text-[var(--ink-700)]">Aucune demande de données.</li>
            )}
          </ul>
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-[var(--ink-200)] bg-white p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-lg font-black text-[var(--ink-900)]">Équipes recommandées / rejointes</h2>
            <Link href="/dashboard/workspace" className="text-xs font-semibold text-[var(--brand-700)]">
              Ouvrir workspace
            </Link>
          </div>
          <ul className="mt-4 grid gap-3 text-sm">
            {teamMemberships.length ? (
              teamMemberships.map((membership) => (
                <li key={membership.teamId} className="rounded-xl border border-[var(--ink-200)] p-3">
                  <p className="font-semibold text-[var(--ink-900)]">{membership.team.name}</p>
                  <p className="text-xs text-[var(--ink-700)]">
                    {(membership.team.cluster && clusterLabels[membership.team.cluster]) || 'Multi-cluster'} •{' '}
                    {membership.role}
                  </p>
                </li>
              ))
            ) : (
              <li className="text-[var(--ink-700)]">Aucune équipe rejointe.</li>
            )}
          </ul>
        </article>

        <article className="rounded-2xl border border-[var(--ink-200)] bg-white p-5">
          <h2 className="text-lg font-black text-[var(--ink-900)]">Simulation & scénarios récents</h2>
          <ul className="mt-4 grid gap-3 text-sm">
            {simulations.length ? (
              simulations.map((simulation) => (
                <li key={simulation.id} className="rounded-xl border border-[var(--ink-200)] p-3">
                  <p className="font-semibold text-[var(--ink-900)]">{simulation.title}</p>
                  <p className="text-xs text-[var(--ink-700)]">
                    {simulation.type} • {simulation.status} • {new Date(simulation.createdAt).toLocaleDateString('fr-FR')}
                  </p>
                </li>
              ))
            ) : (
              <li className="text-[var(--ink-700)]">Aucune simulation exécutée.</li>
            )}
          </ul>
        </article>
      </section>

      <section className="rounded-2xl border border-[var(--ink-200)] bg-white p-5">
        <h2 className="text-lg font-black text-[var(--ink-900)]">Problèmes recommandés selon vos clusters</h2>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          {recommendedProblemTypes.length ? (
            recommendedProblemTypes.map((item) => (
              <li key={item.id} className="rounded-xl border border-[var(--ink-200)] p-3">
                <p className="font-semibold text-[var(--ink-900)]">{item.type}</p>
                <p className="text-xs text-[var(--ink-700)]">{item.challenge}</p>
              </li>
            ))
          ) : (
            <li className="text-sm text-[var(--ink-700)]">Complétez votre onboarding pour obtenir des recommandations.</li>
          )}
        </ul>
      </section>
    </DashboardShell>
  )
}
