import Image from 'next/image'
import { ButtonLink } from '@/components/ui/button-link'
import { siteConfig } from '@/lib/site'

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--ink-200)] bg-[radial-gradient(circle_at_20%_15%,#f5deb0_0%,transparent_36%),radial-gradient(circle_at_85%_10%,#d4e8ff_0%,transparent_42%),var(--sand-50)]">
      <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8 lg:py-24">
        <div className="space-y-6">
          <p className="inline-flex rounded-full bg-white px-4 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[var(--brand-700)] ring-1 ring-[var(--ink-200)]">
            Démarrage officiel: {siteConfig.startDate}
          </p>
          <h1 className="text-balance text-4xl font-black leading-tight text-[var(--ink-900)] sm:text-5xl">
            Plateforme ERP data collaborative pour transformer les défis logistiques en décisions mesurables.
          </h1>
          <p className="max-w-2xl text-lg leading-relaxed text-[var(--ink-700)]">
            PAK centralise les données navires, marchandises, commerce international et camions. Les membres
            s’onboardent, se regroupent en équipes, classifient les problématiques systémiques et soumettent des
            requêtes data argumentées pour bâtir des solutions robustes.
          </p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/auth/register">Rejoindre la plateforme</ButtonLink>
            <ButtonLink href="/problematiques" variant="secondary">
              Découvrir les enjeux
            </ButtonLink>
            <ButtonLink href="/programme" variant="secondary">
              Voir la méthodologie
            </ButtonLink>
          </div>

          <div className="flex flex-wrap items-center gap-4 rounded-2xl border border-[var(--ink-200)] bg-white/80 px-4 py-3 text-xs text-[var(--ink-700)]">
            <span className="font-semibold uppercase tracking-[0.12em] text-[var(--brand-700)]">Partenaires design</span>
            <Image src="/logoPAK.png" alt="PAK" width={28} height={28} className="h-7 w-7 rounded-full object-cover" />
            <Image src="/pakazure-logo.jpg" alt="PakAzure" width={80} height={28} className="h-7 w-auto object-contain" />
            <Image src="/activspaces.png" alt="ActivSpaces" width={90} height={28} className="h-7 w-auto object-contain" />
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
