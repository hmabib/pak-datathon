import { redirect } from 'next/navigation'
import { OnboardingStep } from '@prisma/client'
import { OnboardingForm } from '@/components/onboarding/onboarding-form'
import { getCurrentUser } from '@/lib/auth'

export default async function OnboardingPage() {
  const user = await getCurrentUser()

  if (!user) {
    redirect('/auth/login')
  }

  if (user.onboardingStep === OnboardingStep.DASHBOARD_ACTIF) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen bg-[var(--sand-50)] py-10">
      <div className="mx-auto w-full max-w-4xl space-y-6 px-4 sm:px-6 lg:px-8">
        <header className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-[var(--brand-700)]">Onboarding</p>
          <h1 className="text-4xl font-black text-[var(--ink-900)]">Activez votre profil contributeur</h1>
          <p className="text-[var(--ink-700)]">
            Complétez votre profil, vos compétences et vos engagements pour recevoir un scoring de compatibilité.
          </p>
        </header>
        <OnboardingForm />
      </div>
    </div>
  )
}
