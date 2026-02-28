import { redirect } from 'next/navigation'
import { AuthLayout } from '@/components/auth/auth-layout'
import { RegisterForm } from '@/components/auth/register-form'
import { getCurrentUser } from '@/lib/auth'

export default async function RegisterPage() {
  const user = await getCurrentUser()
  if (user) {
    redirect('/dashboard')
  }

  return (
    <AuthLayout
      title="Créer un compte"
      subtitle="Rejoignez la plateforme et activez votre parcours de contribution en quelques minutes."
    >
      <RegisterForm />
    </AuthLayout>
  )
}
