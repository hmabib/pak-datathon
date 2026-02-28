'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

export function RegisterForm() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      })

      if (!response.ok) {
        const data = (await response.json()) as { message?: string }
        setError(data.message ?? 'Inscription impossible')
        return
      }

      router.push('/onboarding')
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
        <span className="text-sm font-semibold text-[var(--ink-900)]">Nom complet</span>
        <input
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="rounded-xl border border-[var(--ink-200)] px-3 py-2"
          placeholder="Votre nom"
        />
      </label>

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
          minLength={8}
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="rounded-xl border border-[var(--ink-200)] px-3 py-2"
          placeholder="8 caractères minimum"
        />
      </label>

      {error ? <p className="text-sm font-medium text-[var(--danger-500)]">{error}</p> : null}

      <button
        disabled={loading}
        type="submit"
        className="rounded-xl bg-[var(--brand-500)] px-4 py-2 font-semibold text-white disabled:opacity-60"
      >
        {loading ? 'Création...' : 'Créer le compte'}
      </button>

      <p className="text-sm text-[var(--ink-700)]">
        Déjà membre ?{' '}
        <Link href="/auth/login" className="font-semibold text-[var(--brand-700)]">
          Connexion
        </Link>
      </p>
    </form>
  )
}
