type StatCardProps = {
  label: string
  value: string | number
  hint?: string
}

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <article className="rounded-2xl border border-[var(--ink-200)] bg-white p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-[var(--ink-700)]">{label}</p>
      <p className="mt-2 text-3xl font-black text-[var(--ink-900)]">{value}</p>
      {hint ? <p className="mt-1 text-xs text-[var(--ink-700)]">{hint}</p> : null}
    </article>
  )
}
