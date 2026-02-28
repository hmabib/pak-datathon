import { redirect } from 'next/navigation'
import { DashboardShell } from '@/components/dashboard/dashboard-shell'
import { WorkspaceLab } from '@/components/dashboard/workspace-lab'
import { getCurrentUser } from '@/lib/auth'

export default async function WorkspacePage() {
  const user = await getCurrentUser()

  if (!user) redirect('/auth/login')
  if (user.onboardingStep !== 'DASHBOARD_ACTIF') redirect('/onboarding')

  return (
    <DashboardShell
      title="Workspace collaboratif"
      subtitle="Intelligence collective, classification automatique, simulations et requêtes data"
      role={user.role === 'ADMIN' ? 'admin' : 'user'}
    >
      <WorkspaceLab />
    </DashboardShell>
  )
}
