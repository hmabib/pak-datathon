import Link from 'next/link'

type ButtonLinkProps = {
  href: string
  children: React.ReactNode
  variant?: 'primary' | 'secondary'
  className?: string
}

export function ButtonLink({ href, children, variant = 'primary', className }: ButtonLinkProps) {
  const base =
    'inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2'
  const style =
    variant === 'primary'
      ? 'bg-[var(--brand-500)] text-white hover:bg-[var(--brand-600)] focus-visible:ring-[var(--brand-500)]'
      : 'bg-white/90 text-[var(--ink-900)] ring-1 ring-[var(--ink-200)] hover:bg-[var(--sand-100)] focus-visible:ring-[var(--brand-400)]'

  return (
    <Link href={href} className={`${base} ${style} ${className ?? ''}`.trim()}>
      {children}
    </Link>
  )
}
