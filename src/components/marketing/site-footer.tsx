import Link from 'next/link'

export function SiteFooter() {
  return (
    <footer className="border-t border-[var(--ink-200)] bg-[var(--sand-100)]">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-2 lg:px-8">
        <div className="space-y-3">
          <p className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--brand-700)]">PAK DataThon Platform</p>
          <p className="max-w-xl text-sm leading-relaxed text-[var(--ink-700)]">
            Une plateforme d’idéation, de gouvernance et d’exécution orientée impact pour l’écosystème logistique et
            supply chain.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div className="space-y-2">
            <p className="font-bold text-[var(--ink-900)]">Liens</p>
            <ul className="space-y-2 text-[var(--ink-700)]">
              <li>
                <Link href="/programme" className="hover:text-[var(--ink-900)]">
                  Programme
                </Link>
              </li>
              <li>
                <Link href="/problematiques" className="hover:text-[var(--ink-900)]">
                  Problématiques
                </Link>
              </li>
              <li>
                <Link href="/blog/problemes-rencontres" className="hover:text-[var(--ink-900)]">
                  Blog terrain
                </Link>
              </li>
              <li>
                <Link href="/a-propos" className="hover:text-[var(--ink-900)]">
                  À propos
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-2">
            <p className="font-bold text-[var(--ink-900)]">Accès</p>
            <ul className="space-y-2 text-[var(--ink-700)]">
              <li>
                <Link href="/auth/login" className="hover:text-[var(--ink-900)]">
                  Connexion
                </Link>
              </li>
              <li>
                <Link href="/auth/register" className="hover:text-[var(--ink-900)]">
                  Inscription
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
