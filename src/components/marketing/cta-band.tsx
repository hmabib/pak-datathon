import { ButtonLink } from '@/components/ui/button-link'

export function CtaBand() {
  return (
    <section className="border-y border-[var(--ink-200)] bg-[var(--sand-100)] py-14">
      <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
        <div className="space-y-2">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--brand-700)]">Prêt à contribuer ?</p>
          <h2 className="text-2xl font-black text-[var(--ink-900)] sm:text-3xl">
            Lancez votre onboarding et activez votre dashboard.
          </h2>
        </div>
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/auth/register">Créer mon compte</ButtonLink>
          <ButtonLink href="/auth/login" variant="secondary">
            J’ai déjà un compte
          </ButtonLink>
        </div>
      </div>
    </section>
  )
}
