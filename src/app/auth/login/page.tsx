import { redirect } from 'next/navigation'
import { AuthLayout } from '@/components/auth/auth-layout'
import { LoginForm } from '@/components/auth/login-form'
import { getCurrentUser } from '@/lib/auth'

export default async function LoginPage() {
  const user = await getCurrentUser()
  if (user) {
    redirect('/dashboard')
  }

  return (
    <AuthLayout
      title="Connexion"
      subtitle="Accédez à votre espace pour suivre les problèmes, données et solutions en cours."
    >
      <LoginForm />
    </AuthLayout>
  )
}
