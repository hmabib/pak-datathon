'use client'

import { useRouter } from 'next/navigation'
import { FormEvent, useState } from 'react'

const actorTypes = [
  'CHERCHEUR',
  'ANALYSTE',
  'DEVELOPPEUR',
  'LOGISTICIEN',
  'ECONOMISTE',
  'DATA_SCIENTIST',
  'CONSULTANT',
  'ETUDIANT',
  'INSTITUTIONNEL',
  'AUTRE',
] as const

const dataLevels = ['DEBUTANT', 'INTERMEDIAIRE', 'AVANCE', 'EXPERT'] as const

const clusterTypes = [
  'OPERATIONNEL',
  'DOCUMENTAIRE',
  'SYSTEMES_IT',
  'LOGISTIQUE_TRANSPORT',
  'REGLEMENTAIRE',
  'FINANCIER',
  'INFRASTRUCTURE',
  'COORDINATION',
] as const

export function OnboardingForm() {
  const router = useRouter()

  const [formState, setFormState] = useState({
    actorType: 'AUTRE',
    dataLevel: 'DEBUTANT',
    domaineExpertise: '',
    organisation: '',
    poste: '',
    yearsExperience: '0',
    disponibilite: '6-8h/semaine',
    interetClusters: ['OPERATIONNEL'],
    skills: 'Logistique; SQL; DataViz',
    environmentAware: true,
    socialCommit: true,
    governanceAccept: true,
    dataCharterAccepted: true,
    ethicsAccepted: true,
    confidentialityAccepted: true,
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  function toggleCluster(cluster: string) {
    setFormState((prev) => {
      const exists = prev.interetClusters.includes(cluster)
      if (exists) {
        const nextValues = prev.interetClusters.filter((item) => item !== cluster)
        return { ...prev, interetClusters: nextValues.length ? nextValues : [cluster] }
      }
      return { ...prev, interetClusters: [...prev.interetClusters, cluster] }
    })
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formState,
          yearsExperience: Number(formState.yearsExperience),
          skills: formState.skills
            .split(';')
            .map((skill) => skill.trim())
            .filter(Boolean),
        }),
      })

      if (!response.ok) {
        const data = (await response.json()) as { message?: string }
        setError(data.message ?? 'Onboarding impossible')
        return
      }

      router.push('/dashboard')
      router.refresh()
    } catch {
      setError('Erreur réseau, réessayez.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 rounded-2xl border border-[var(--ink-200)] bg-white p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-semibold">Type d’acteur</span>
          <select
            value={formState.actorType}
            onChange={(event) => setFormState((prev) => ({ ...prev, actorType: event.target.value }))}
            className="rounded-xl border border-[var(--ink-200)] px-3 py-2"
          >
            {actorTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold">Niveau data</span>
          <select
            value={formState.dataLevel}
            onChange={(event) => setFormState((prev) => ({ ...prev, dataLevel: event.target.value }))}
            className="rounded-xl border border-[var(--ink-200)] px-3 py-2"
          >
            {dataLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-semibold">Organisation</span>
          <input
            value={formState.organisation}
            onChange={(event) => setFormState((prev) => ({ ...prev, organisation: event.target.value }))}
            className="rounded-xl border border-[var(--ink-200)] px-3 py-2"
            placeholder="PAK / Port / Transporteur"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold">Poste</span>
          <input
            value={formState.poste}
            onChange={(event) => setFormState((prev) => ({ ...prev, poste: event.target.value }))}
            className="rounded-xl border border-[var(--ink-200)] px-3 py-2"
            placeholder="Responsable opération"
          />
        </label>
      </div>

      <label className="grid gap-2">
        <span className="text-sm font-semibold">Domaine d’expertise</span>
        <input
          value={formState.domaineExpertise}
          onChange={(event) => setFormState((prev) => ({ ...prev, domaineExpertise: event.target.value }))}
          className="rounded-xl border border-[var(--ink-200)] px-3 py-2"
          placeholder="Supply Chain, Data engineering, Commerce extérieur..."
        />
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-semibold">Expérience logistique (années)</span>
          <input
            type="number"
            min={0}
            max={40}
            value={formState.yearsExperience}
            onChange={(event) => setFormState((prev) => ({ ...prev, yearsExperience: event.target.value }))}
            className="rounded-xl border border-[var(--ink-200)] px-3 py-2"
          />
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-semibold">Disponibilité</span>
          <input
            value={formState.disponibilite}
            onChange={(event) => setFormState((prev) => ({ ...prev, disponibilite: event.target.value }))}
            className="rounded-xl border border-[var(--ink-200)] px-3 py-2"
            placeholder="6-8h/semaine"
          />
        </label>
      </div>

      <label className="grid gap-2">
        <span className="text-sm font-semibold">Compétences (séparées par ;)</span>
        <input
          value={formState.skills}
          onChange={(event) => setFormState((prev) => ({ ...prev, skills: event.target.value }))}
          className="rounded-xl border border-[var(--ink-200)] px-3 py-2"
        />
      </label>

      <fieldset className="grid gap-3">
        <legend className="text-sm font-semibold">Clusters d’intérêt</legend>
        <div className="grid gap-2 sm:grid-cols-2">
          {clusterTypes.map((cluster) => (
            <label key={cluster} className="flex items-center gap-2 rounded-lg border border-[var(--ink-200)] px-3 py-2 text-sm">
              <input
                type="checkbox"
                checked={formState.interetClusters.includes(cluster)}
                onChange={() => toggleCluster(cluster)}
              />
              {cluster}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="grid gap-2 rounded-xl border border-[var(--ink-200)] bg-[var(--sand-50)] p-4">
        <legend className="text-sm font-semibold">Engagements</legend>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={formState.environmentAware}
            onChange={(event) => setFormState((prev) => ({ ...prev, environmentAware: event.target.checked }))}
          />
          Je prends en compte l’impact environnemental
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={formState.socialCommit}
            onChange={(event) => setFormState((prev) => ({ ...prev, socialCommit: event.target.checked }))}
          />
          Je respecte les engagements sociaux
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={formState.governanceAccept}
            onChange={(event) => setFormState((prev) => ({ ...prev, governanceAccept: event.target.checked }))}
          />
          J’accepte la gouvernance de la plateforme
        </label>
      </fieldset>

      {error ? <p className="text-sm font-medium text-[var(--danger-500)]">{error}</p> : null}

      <button
        disabled={loading}
        type="submit"
        className="rounded-xl bg-[var(--brand-500)] px-4 py-2 font-semibold text-white disabled:opacity-70"
      >
        {loading ? 'Validation...' : 'Finaliser mon onboarding'}
      </button>
    </form>
  )
}
