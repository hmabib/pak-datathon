import Link from 'next/link'

type AuthLayoutProps = {
  title: string
  subtitle: string
  children: React.ReactNode
}

export function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="grid min-h-screen bg-[radial-gradient(circle_at_20%_20%,#fff1d6_0%,transparent_35%),var(--sand-50)] lg:grid-cols-2">
      <aside className="hidden border-r border-[var(--ink-200)] bg-[var(--ink-900)] p-10 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="space-y-3">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--brand-400)]">PAK DataThon</p>
          <h2 className="text-4xl font-black leading-tight">Collaborez sur les enjeux logistiques qui comptent.</h2>
          <p className="text-sm leading-relaxed text-white/80">
            Authentification sécurisée, onboarding guidé et dashboards pilotés par les données terrain.
          </p>
        </div>

        <p className="text-xs text-white/60">PAK Platform • Build for impact</p>
      </aside>

      <main className="flex items-center justify-center p-4 sm:p-8">
        <section className="w-full max-w-md rounded-3xl border border-[var(--ink-200)] bg-white p-6 sm:p-8">
          <header className="space-y-2">
            <Link href="/" className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--brand-700)]">
              ← Retour au site
            </Link>
            <h1 className="text-3xl font-black text-[var(--ink-900)]">{title}</h1>
            <p className="text-sm text-[var(--ink-700)]">{subtitle}</p>
          </header>
          <div className="mt-6">{children}</div>
        </section>
      </main>
    </div>
  )
}
