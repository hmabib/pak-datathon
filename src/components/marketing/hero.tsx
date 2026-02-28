import Image from 'next/image'
import { ButtonLink } from '@/components/ui/button-link'

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--ink-200)] bg-[radial-gradient(circle_at_30%_20%,#ffe3b6_0%,transparent_45%),radial-gradient(circle_at_85%_10%,#d8f3ff_0%,transparent_40%),var(--sand-50)]">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 lg:py-24">
        <div className="space-y-6">
          <p className="inline-flex rounded-full bg-white px-4 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[var(--brand-700)] ring-1 ring-[var(--ink-200)]">
            Datathon logistique panafricain
          </p>
          <h1 className="text-balance text-4xl font-black leading-tight text-[var(--ink-900)] sm:text-5xl">
            Transformez des défis supply chain en solutions pilotées par la donnée.
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-[var(--ink-700)]">
            Centralisez les problématiques terrain, constituez des équipes mixtes, orchestrez la gouvernance data et
            suivez l’impact opérationnel en continu.
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/auth/register">Créer un compte</ButtonLink>
            <ButtonLink href="/programme" variant="secondary">
              Voir le programme
            </ButtonLink>
          </div>
        </div>

        <div className="relative rounded-3xl border border-[var(--ink-200)] bg-white p-4 shadow-xl shadow-black/5">
          <Image
            src="/labox-datathon.png"
            alt="PAK DataThon"
            width={1200}
            height={900}
            className="h-auto w-full rounded-2xl object-cover"
            priority
          />
        </div>
      </div>
    </section>
  )
}
