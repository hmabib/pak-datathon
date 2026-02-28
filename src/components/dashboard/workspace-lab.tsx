'use client'

import { FormEvent, useMemo, useState } from 'react'
import { clusterLabels } from '@/lib/site'

type ClusterType = keyof typeof clusterLabels
type SimulationType = 'CONGESTION' | 'FLUX_COMMERCE' | 'IMPORT_EXPORT_STRESS' | 'TRAFIC_CAMIONS' | 'CAPACITE_TERMINAL'

type TeamLite = {
  id: string
  name: string
  cluster: ClusterType | null
  description: string | null
  maxMembers: number
  isOpen: boolean
  _count?: { members: number }
  members?: Array<{ userId: string; role: string; user: { name: string | null; email: string } }>
}

type ClassificationResult = {
  cluster: ClusterType
  score: number
  keywords: string[]
  suggestedDatasets: string[]
  similarProblemTypes: string[]
  maturityScore: number
}

const simulationTypes: SimulationType[] = [
  'CONGESTION',
  'FLUX_COMMERCE',
  'IMPORT_EXPORT_STRESS',
  'TRAFIC_CAMIONS',
  'CAPACITE_TERMINAL',
]

export function WorkspaceLab() {
  const [analysisText, setAnalysisText] = useState('')
  const [classification, setClassification] = useState<ClassificationResult | null>(null)
  const [analysisError, setAnalysisError] = useState('')
  const [analysisLoading, setAnalysisLoading] = useState(false)

  const [teamForm, setTeamForm] = useState({
    name: '',
    description: '',
    cluster: 'COORDINATION',
    maxMembers: '6',
  })
  const [teams, setTeams] = useState<TeamLite[]>([])
  const [teamsLoading, setTeamsLoading] = useState(false)
  const [teamsError, setTeamsError] = useState('')

  const [simulationForm, setSimulationForm] = useState({
    title: 'Stress test de fluidité',
    type: 'CONGESTION',
    baselineFlow: '100',
    congestionRate: '0.25',
    incidentRate: '0.08',
  })
  const [simulationOutput, setSimulationOutput] = useState<string>('')
  const [simulationError, setSimulationError] = useState('')

  const [requestForm, setRequestForm] = useState({
    cluster: 'COORDINATION',
    datasetType: 'Flux navires + camions',
    objective: 'Réduire les temps d’attente de 20%',
    justification: 'Corréler congestion quai, trafic camions et readiness documentaire.',
    estimatedImpact: 'Diminution délai moyen de cycle',
    duration: '6 semaines',
    sensitivityLevel: '2',
  })
  const [requestStatus, setRequestStatus] = useState('')

  const [myTeams, setMyTeams] = useState<TeamLite[]>([])
  const [selectedTeamId, setSelectedTeamId] = useState('')
  const [chatMessage, setChatMessage] = useState('')
  const [chatFeed, setChatFeed] = useState<Array<{ id: string; content: string; createdAt: string; sender?: { name?: string | null; email?: string } | null }>>([])
  const [chatError, setChatError] = useState('')

  const canAnalyze = analysisText.trim().length >= 20

  async function loadTeams() {
    setTeamsLoading(true)
    setTeamsError('')
    try {
      const response = await fetch('/api/teams?open=true')
      const data = (await response.json()) as { teams?: TeamLite[]; message?: string }
      if (!response.ok) {
        setTeamsError(data.message || 'Impossible de charger les équipes')
        return
      }
      setTeams(data.teams || [])
    } catch {
      setTeamsError('Erreur réseau')
    } finally {
      setTeamsLoading(false)
    }
  }

  async function handleAnalyze(event: FormEvent) {
    event.preventDefault()
    if (!canAnalyze) return

    setAnalysisLoading(true)
    setAnalysisError('')
    setClassification(null)

    try {
      const response = await fetch('/api/problems/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: analysisText }),
      })
      const data = (await response.json()) as { classification?: ClassificationResult; message?: string }
      const result = data.classification
      if (!response.ok || !result) {
        setAnalysisError(data.message || 'Analyse impossible')
        return
      }
      setClassification(result)
      setRequestForm((prev) => ({
        ...prev,
        cluster: result.cluster,
        datasetType: result.suggestedDatasets.slice(0, 2).join(' + ') || prev.datasetType,
      }))
    } catch {
      setAnalysisError('Erreur réseau')
    } finally {
      setAnalysisLoading(false)
    }
  }

  async function handleCreateTeam(event: FormEvent) {
    event.preventDefault()
    setTeamsError('')

    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: teamForm.name,
          description: teamForm.description,
          cluster: teamForm.cluster,
          maxMembers: Number(teamForm.maxMembers),
        }),
      })
      const data = (await response.json()) as { message?: string }
      if (!response.ok) {
        setTeamsError(data.message || 'Création impossible')
        return
      }
      setTeamForm((prev) => ({ ...prev, name: '', description: '' }))
      await loadTeams()
    } catch {
      setTeamsError('Erreur réseau')
    }
  }

  async function handleJoinTeam(teamId: string) {
    setTeamsError('')
    try {
      const response = await fetch(`/api/teams/${teamId}/join`, { method: 'POST' })
      const data = (await response.json()) as { message?: string }
      if (!response.ok) {
        setTeamsError(data.message || 'Impossible de rejoindre')
        return
      }
      await loadTeams()
    } catch {
      setTeamsError('Erreur réseau')
    }
  }

  async function handleRunSimulation(event: FormEvent) {
    event.preventDefault()
    setSimulationError('')
    setSimulationOutput('')

    try {
      const response = await fetch('/api/simulations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: simulationForm.title,
          type: simulationForm.type,
          inputs: {
            baselineFlow: Number(simulationForm.baselineFlow),
            congestionRate: Number(simulationForm.congestionRate),
            incidentRate: Number(simulationForm.incidentRate),
          },
        }),
      })
      const data = (await response.json()) as { simulation?: { resultSummary?: string }; message?: string }
      if (!response.ok) {
        setSimulationError(data.message || 'Simulation impossible')
        return
      }
      setSimulationOutput(data.simulation?.resultSummary || 'Simulation exécutée')
    } catch {
      setSimulationError('Erreur réseau')
    }
  }

  async function handleSubmitRequest(event: FormEvent) {
    event.preventDefault()
    setRequestStatus('')

    try {
      const response = await fetch('/api/data-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...requestForm,
          sensitivityLevel: Number(requestForm.sensitivityLevel),
        }),
      })
      const data = (await response.json()) as { message?: string }
      if (!response.ok) {
        setRequestStatus(data.message || 'Soumission impossible')
        return
      }
      setRequestStatus('Requête data soumise pour revue admin.')
    } catch {
      setRequestStatus('Erreur réseau')
    }
  }

  async function loadMyTeams() {
    try {
      const meResponse = await fetch('/api/auth/me')
      const meData = (await meResponse.json()) as { user?: { id: string } }
      const myUserId = meData.user?.id
      if (!myUserId) {
        setChatError('Session utilisateur introuvable.')
        return
      }

      const response = await fetch('/api/teams')
      const data = (await response.json()) as { teams?: TeamLite[] }
      const all = data.teams || []
      const mine = all.filter((team) => (team.members || []).some((member) => member.userId === myUserId))
      setMyTeams(mine)
      if (!selectedTeamId && mine[0]) setSelectedTeamId(mine[0].id)
    } catch {
      setChatError('Impossible de charger les équipes.')
    }
  }

  async function loadMessages(teamId: string) {
    if (!teamId) return
    try {
      const response = await fetch(`/api/teams/${teamId}/messages`)
      const data = (await response.json()) as { messages?: Array<{ id: string; content: string; createdAt: string; sender?: { name?: string | null; email?: string } | null }>; message?: string }
      if (!response.ok) {
        setChatError(data.message || 'Impossible de charger le chat')
        return
      }
      setChatFeed(data.messages || [])
    } catch {
      setChatError('Erreur de chargement du chat')
    }
  }

  async function handleSendChat(event: FormEvent) {
    event.preventDefault()
    if (!selectedTeamId || chatMessage.trim().length < 2) return

    try {
      const response = await fetch(`/api/teams/${selectedTeamId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: chatMessage }),
      })
      const data = (await response.json()) as { message?: string }
      if (!response.ok) {
        setChatError(data.message || 'Envoi impossible')
        return
      }
      setChatMessage('')
      await loadMessages(selectedTeamId)
    } catch {
      setChatError('Erreur réseau')
    }
  }

  const selectedTeam = useMemo(() => myTeams.find((team) => team.id === selectedTeamId), [myTeams, selectedTeamId])

  return (
    <div className="grid gap-6">
      <section className="rounded-2xl border border-[var(--ink-200)] bg-white p-6">
        <h2 className="text-lg font-black text-[var(--ink-900)]">Analyse automatique des problèmes</h2>
        <p className="mt-1 text-sm text-[var(--ink-700)]">
          NLP de classification, détection de mots-clés, suggestion datasets et score de maturité.
        </p>
        <form className="mt-4 grid gap-3" onSubmit={handleAnalyze}>
          <textarea
            value={analysisText}
            onChange={(event) => setAnalysisText(event.target.value)}
            className="min-h-28 rounded-xl border border-[var(--ink-200)] px-3 py-2"
            placeholder="Décrivez une difficulté opérationnelle à analyser"
          />
          <button
            type="submit"
            disabled={!canAnalyze || analysisLoading}
            className="w-fit rounded-xl bg-[var(--brand-500)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          >
            {analysisLoading ? 'Analyse en cours...' : 'Classifier le problème'}
          </button>
        </form>
        {analysisError ? <p className="mt-3 text-sm text-[var(--danger-500)]">{analysisError}</p> : null}
        {classification ? (
          <div className="mt-4 grid gap-3 rounded-xl border border-[var(--ink-200)] bg-[var(--sand-50)] p-4 text-sm">
            <p>
              <span className="font-semibold">Cluster:</span> {clusterLabels[classification.cluster]}
            </p>
            <p>
              <span className="font-semibold">Score classification:</span> {classification.score}/100
            </p>
            <p>
              <span className="font-semibold">Maturité:</span> {classification.maturityScore}/100
            </p>
            <p>
              <span className="font-semibold">Mots-clés:</span> {classification.keywords.join(' • ') || 'Aucun'}
            </p>
            <p>
              <span className="font-semibold">Datasets suggérés:</span> {classification.suggestedDatasets.slice(0, 5).join(' • ')}
            </p>
          </div>
        ) : null}
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-[var(--ink-200)] bg-white p-6">
          <h2 className="text-lg font-black text-[var(--ink-900)]">Constitution d’équipes</h2>
          <form className="mt-4 grid gap-3" onSubmit={handleCreateTeam}>
            <input
              value={teamForm.name}
              onChange={(event) => setTeamForm((prev) => ({ ...prev, name: event.target.value }))}
              placeholder="Nom équipe"
              className="rounded-xl border border-[var(--ink-200)] px-3 py-2"
              required
            />
            <textarea
              value={teamForm.description}
              onChange={(event) => setTeamForm((prev) => ({ ...prev, description: event.target.value }))}
              placeholder="Objectif stratégique"
              className="min-h-20 rounded-xl border border-[var(--ink-200)] px-3 py-2"
            />
            <div className="grid gap-2 sm:grid-cols-2">
              <select
                value={teamForm.cluster}
                onChange={(event) => setTeamForm((prev) => ({ ...prev, cluster: event.target.value }))}
                className="rounded-xl border border-[var(--ink-200)] px-3 py-2"
              >
                {Object.entries(clusterLabels).map(([key, label]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min={3}
                max={12}
                value={teamForm.maxMembers}
                onChange={(event) => setTeamForm((prev) => ({ ...prev, maxMembers: event.target.value }))}
                className="rounded-xl border border-[var(--ink-200)] px-3 py-2"
              />
            </div>
            <button className="w-fit rounded-xl bg-[var(--brand-500)] px-4 py-2 text-sm font-semibold text-white">
              Créer équipe
            </button>
          </form>

          <button
            onClick={loadTeams}
            className="mt-4 rounded-xl border border-[var(--ink-200)] px-4 py-2 text-sm font-semibold text-[var(--ink-700)]"
          >
            {teamsLoading ? 'Chargement...' : 'Rafraîchir équipes ouvertes'}
          </button>

          <ul className="mt-4 grid gap-2 text-sm">
            {teams.map((team) => (
              <li key={team.id} className="flex items-center justify-between gap-2 rounded-xl border border-[var(--ink-200)] p-3">
                <div>
                  <p className="font-semibold text-[var(--ink-900)]">{team.name}</p>
                  <p className="text-xs text-[var(--ink-700)]">
                    {(team.cluster && clusterLabels[team.cluster]) || 'Cluster ouvert'} • {team._count?.members || 0}/{team.maxMembers}
                  </p>
                </div>
                <button
                  onClick={() => handleJoinTeam(team.id)}
                  className="rounded-lg bg-[var(--pak-gold-500)] px-3 py-1 text-xs font-semibold text-[var(--ink-900)]"
                >
                  Rejoindre
                </button>
              </li>
            ))}
          </ul>
          {teamsError ? <p className="mt-2 text-sm text-[var(--danger-500)]">{teamsError}</p> : null}
        </article>

        <article className="rounded-2xl border border-[var(--ink-200)] bg-white p-6">
          <h2 className="text-lg font-black text-[var(--ink-900)]">Simulation & scénarios</h2>
          <form className="mt-4 grid gap-3" onSubmit={handleRunSimulation}>
            <input
              value={simulationForm.title}
              onChange={(event) => setSimulationForm((prev) => ({ ...prev, title: event.target.value }))}
              className="rounded-xl border border-[var(--ink-200)] px-3 py-2"
            />
            <select
              value={simulationForm.type}
              onChange={(event) => setSimulationForm((prev) => ({ ...prev, type: event.target.value }))}
              className="rounded-xl border border-[var(--ink-200)] px-3 py-2"
            >
              {simulationTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <div className="grid gap-2 sm:grid-cols-3">
              <input
                type="number"
                value={simulationForm.baselineFlow}
                onChange={(event) => setSimulationForm((prev) => ({ ...prev, baselineFlow: event.target.value }))}
                className="rounded-xl border border-[var(--ink-200)] px-3 py-2"
                placeholder="Flow"
              />
              <input
                type="number"
                step="0.01"
                value={simulationForm.congestionRate}
                onChange={(event) => setSimulationForm((prev) => ({ ...prev, congestionRate: event.target.value }))}
                className="rounded-xl border border-[var(--ink-200)] px-3 py-2"
                placeholder="Congestion"
              />
              <input
                type="number"
                step="0.01"
                value={simulationForm.incidentRate}
                onChange={(event) => setSimulationForm((prev) => ({ ...prev, incidentRate: event.target.value }))}
                className="rounded-xl border border-[var(--ink-200)] px-3 py-2"
                placeholder="Incident"
              />
            </div>
            <button className="w-fit rounded-xl bg-[var(--brand-500)] px-4 py-2 text-sm font-semibold text-white">
              Lancer simulation
            </button>
          </form>
          {simulationOutput ? <p className="mt-3 rounded-xl bg-[var(--sand-50)] p-3 text-sm text-[var(--ink-700)]">{simulationOutput}</p> : null}
          {simulationError ? <p className="mt-2 text-sm text-[var(--danger-500)]">{simulationError}</p> : null}
        </article>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-[var(--ink-200)] bg-white p-6">
          <h2 className="text-lg font-black text-[var(--ink-900)]">Requête avancée PAK</h2>
          <form className="mt-4 grid gap-3" onSubmit={handleSubmitRequest}>
            <select
              value={requestForm.cluster}
              onChange={(event) => setRequestForm((prev) => ({ ...prev, cluster: event.target.value }))}
              className="rounded-xl border border-[var(--ink-200)] px-3 py-2"
            >
              {Object.entries(clusterLabels).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
            </select>
            <input
              value={requestForm.datasetType}
              onChange={(event) => setRequestForm((prev) => ({ ...prev, datasetType: event.target.value }))}
              className="rounded-xl border border-[var(--ink-200)] px-3 py-2"
              placeholder="Dataset demandé"
            />
            <textarea
              value={requestForm.objective}
              onChange={(event) => setRequestForm((prev) => ({ ...prev, objective: event.target.value }))}
              className="min-h-16 rounded-xl border border-[var(--ink-200)] px-3 py-2"
              placeholder="Objectif mesurable"
            />
            <textarea
              value={requestForm.justification}
              onChange={(event) => setRequestForm((prev) => ({ ...prev, justification: event.target.value }))}
              className="min-h-20 rounded-xl border border-[var(--ink-200)] px-3 py-2"
              placeholder="Justification analytique"
            />
            <div className="grid gap-2 sm:grid-cols-3">
              <input
                value={requestForm.estimatedImpact}
                onChange={(event) => setRequestForm((prev) => ({ ...prev, estimatedImpact: event.target.value }))}
                className="rounded-xl border border-[var(--ink-200)] px-3 py-2"
                placeholder="Impact"
              />
              <input
                value={requestForm.duration}
                onChange={(event) => setRequestForm((prev) => ({ ...prev, duration: event.target.value }))}
                className="rounded-xl border border-[var(--ink-200)] px-3 py-2"
                placeholder="Durée"
              />
              <input
                type="number"
                min={1}
                max={5}
                value={requestForm.sensitivityLevel}
                onChange={(event) => setRequestForm((prev) => ({ ...prev, sensitivityLevel: event.target.value }))}
                className="rounded-xl border border-[var(--ink-200)] px-3 py-2"
                placeholder="Sensibilité"
              />
            </div>
            <button className="w-fit rounded-xl bg-[var(--brand-500)] px-4 py-2 text-sm font-semibold text-white">Soumettre</button>
          </form>
          {requestStatus ? <p className="mt-3 text-sm text-[var(--ink-700)]">{requestStatus}</p> : null}
        </article>

        <article className="rounded-2xl border border-[var(--ink-200)] bg-white p-6">
          <h2 className="text-lg font-black text-[var(--ink-900)]">Collaboration temps réel (chat équipe)</h2>
          <div className="mt-4 grid gap-3">
            <div className="flex gap-2">
              <button
                onClick={loadMyTeams}
                className="rounded-xl border border-[var(--ink-200)] px-3 py-2 text-sm font-semibold text-[var(--ink-700)]"
              >
                Charger mes équipes
              </button>
              <button
                onClick={() => loadMessages(selectedTeamId)}
                disabled={!selectedTeamId}
                className="rounded-xl border border-[var(--ink-200)] px-3 py-2 text-sm font-semibold text-[var(--ink-700)] disabled:opacity-60"
              >
                Charger chat
              </button>
            </div>

            <select
              value={selectedTeamId}
              onChange={(event) => setSelectedTeamId(event.target.value)}
              className="rounded-xl border border-[var(--ink-200)] px-3 py-2"
            >
              <option value="">Sélectionnez une équipe</option>
              {myTeams.map((team) => (
                <option key={team.id} value={team.id}>
                  {team.name}
                </option>
              ))}
            </select>

            {selectedTeam ? <p className="text-xs text-[var(--ink-700)]">Équipe active: {selectedTeam.name}</p> : null}

            <div className="max-h-44 space-y-2 overflow-auto rounded-xl border border-[var(--ink-200)] bg-[var(--sand-50)] p-3 text-sm">
              {chatFeed.length ? (
                chatFeed.map((message) => (
                  <div key={message.id} className="rounded-lg border border-[var(--ink-200)] bg-white p-2">
                    <p className="text-xs text-[var(--ink-700)]">{message.sender?.name || message.sender?.email || 'Système'}</p>
                    <p className="text-sm text-[var(--ink-900)]">{message.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-[var(--ink-700)]">Aucun message.</p>
              )}
            </div>

            <form className="flex gap-2" onSubmit={handleSendChat}>
              <input
                value={chatMessage}
                onChange={(event) => setChatMessage(event.target.value)}
                className="flex-1 rounded-xl border border-[var(--ink-200)] px-3 py-2"
                placeholder="Message équipe"
              />
              <button className="rounded-xl bg-[var(--brand-500)] px-4 py-2 text-sm font-semibold text-white">Envoyer</button>
            </form>
            {chatError ? <p className="text-sm text-[var(--danger-500)]">{chatError}</p> : null}
          </div>
        </article>
      </section>
    </div>
  )
}
