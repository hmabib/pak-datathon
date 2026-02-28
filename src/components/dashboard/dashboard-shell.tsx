import Link from 'next/link'

type DashboardShellProps = {
  title: string
  subtitle: string
  children: React.ReactNode
  role?: 'user' | 'admin'
}

export function DashboardShell({ title, subtitle, children, role = 'user' }: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-[var(--sand-50)]">
      <header className="border-b border-[var(--ink-200)] bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--brand-700)]">PAK Platform</p>
            <h1 className="text-xl font-black text-[var(--ink-900)]">{title}</h1>
            <p className="text-sm text-[var(--ink-700)]">{subtitle}</p>
          </div>
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/dashboard" className="rounded-lg px-3 py-2 hover:bg-[var(--sand-100)]">
              Vue globale
            </Link>
            <Link href="/dashboard/workspace" className="rounded-lg px-3 py-2 hover:bg-[var(--sand-100)]">
              Workspace
            </Link>
            <Link href="/problematiques" className="rounded-lg px-3 py-2 hover:bg-[var(--sand-100)]">
              Clusters
            </Link>
            {role === 'admin' ? (
              <Link href="/admin" className="rounded-lg px-3 py-2 hover:bg-[var(--sand-100)]">
                Admin
              </Link>
            ) : null}
            <Link href="/api/auth/logout" className="rounded-lg px-3 py-2 text-[var(--danger-500)] hover:bg-red-50">
              Déconnexion
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  )
}
