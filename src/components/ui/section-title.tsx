type SectionTitleProps = {
  eyebrow: string
  title: string
  subtitle: string
  tone?: 'default' | 'light'
}

export function SectionTitle({ eyebrow, title, subtitle, tone = 'default' }: SectionTitleProps) {
  const isLight = tone === 'light'

  return (
    <header className="max-w-3xl space-y-3">
      <p
        className={`text-sm font-semibold uppercase tracking-[0.2em] ${
          isLight ? 'text-[var(--sand-100)]' : 'text-[var(--brand-600)]'
        }`}
      >
        {eyebrow}
      </p>
      <h2
        className={`text-balance text-3xl font-black leading-tight sm:text-4xl ${
          isLight ? 'text-white' : 'text-[var(--ink-900)]'
        }`}
      >
        {title}
      </h2>
      <p className={`text-lg leading-relaxed ${isLight ? 'text-white/80' : 'text-[var(--ink-700)]'}`}>{subtitle}</p>
    </header>
  )
}
