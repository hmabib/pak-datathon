import Link from 'next/link'
import { siteConfig } from '@/lib/site'
import { ButtonLink } from '@/components/ui/button-link'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-[var(--ink-200)] bg-white/80 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="group inline-flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--brand-500)] text-lg font-black text-white">
            P
          </div>
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.12em] text-[var(--brand-600)]">PAK</p>
            <p className="text-sm font-medium text-[var(--ink-700)]">DataThon Platform</p>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {siteConfig.navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-[var(--ink-700)] transition-colors hover:text-[var(--ink-900)]"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ButtonLink href="/auth/login" variant="secondary" className="hidden sm:inline-flex">
            Connexion
          </ButtonLink>
          <ButtonLink href="/auth/register">Commencer</ButtonLink>
        </div>
      </div>
    </header>
  )
}
