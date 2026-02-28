'use client'

import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { FormEvent, useState } from 'react'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const nextPath = searchParams.get('next') || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = (await response.json()) as { message?: string }
        setError(data.message ?? 'Connexion impossible')
        return
      }

      router.push(nextPath)
      router.refresh()
    } catch {
      setError('Erreur réseau, réessayez.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <label className="grid gap-2">
        <span className="text-sm font-semibold text-[var(--ink-900)]">Email</span>
        <input
          type="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="rounded-xl border border-[var(--ink-200)] px-3 py-2"
          placeholder="vous@organisation.com"
        />
      </label>

      <label className="grid gap-2">
        <span className="text-sm font-semibold text-[var(--ink-900)]">Mot de passe</span>
        <input
          type="password"
          required
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="rounded-xl border border-[var(--ink-200)] px-3 py-2"
          placeholder="********"
        />
      </label>

      {error ? <p className="text-sm font-medium text-[var(--danger-500)]">{error}</p> : null}

      <button
        disabled={loading}
        type="submit"
        className="rounded-xl bg-[var(--brand-500)] px-4 py-2 font-semibold text-white disabled:opacity-60"
      >
        {loading ? 'Connexion...' : 'Se connecter'}
      </button>

      <p className="text-sm text-[var(--ink-700)]">
        Pas de compte ?{' '}
        <Link href="/auth/register" className="font-semibold text-[var(--brand-700)]">
          Inscription
        </Link>
      </p>
    </form>
  )
}
