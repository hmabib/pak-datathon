import { MarketingLayout } from '@/components/marketing/marketing-layout'

export default function ContactPage() {
  return (
    <MarketingLayout>
      <section className="mx-auto w-full max-w-3xl space-y-8 px-4 py-16 sm:px-6 lg:px-8">
        <header className="space-y-3">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[var(--brand-700)]">Contact</p>
          <h1 className="text-4xl font-black text-[var(--ink-900)]">Parlons de vos défis logistiques</h1>
          <p className="text-[var(--ink-700)]">
            Besoin d’intégrer une institution, un partenaire data ou un sponsor ? Écrivez-nous.
          </p>
        </header>

        <form className="grid gap-4 rounded-2xl border border-[var(--ink-200)] bg-white p-6">
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[var(--ink-900)]">Nom</span>
            <input className="rounded-xl border border-[var(--ink-200)] px-3 py-2" placeholder="Votre nom" />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[var(--ink-900)]">Email</span>
            <input className="rounded-xl border border-[var(--ink-200)] px-3 py-2" placeholder="vous@exemple.com" type="email" />
          </label>
          <label className="grid gap-2">
            <span className="text-sm font-semibold text-[var(--ink-900)]">Message</span>
            <textarea className="min-h-32 rounded-xl border border-[var(--ink-200)] px-3 py-2" placeholder="Décrivez votre besoin" />
          </label>
          <button type="button" className="rounded-xl bg-[var(--brand-500)] px-4 py-2 font-semibold text-white">
            Envoyer
          </button>
        </form>
      </section>
    </MarketingLayout>
  )
}
