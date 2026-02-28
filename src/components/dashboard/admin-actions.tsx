'use client'

import { useState } from 'react'

export function AdminActions() {
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  async function bootstrapClusters() {
    setLoading(true)
    setStatus('')
    try {
      const response = await fetch('/api/admin/bootstrap-clusters', { method: 'POST' })
      const data = (await response.json()) as { seeded?: number; message?: string }
      if (!response.ok) {
        setStatus(data.message || 'Échec bootstrap clusters')
        return
      }
      setStatus(`${data.seeded || 0} clusters mis à jour.`)
    } catch {
      setStatus('Erreur réseau')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <button
        onClick={bootstrapClusters}
        disabled={loading}
        className="rounded-xl bg-[var(--brand-500)] px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
      >
        {loading ? 'Bootstrap...' : 'Bootstrap clusters'}
      </button>
      {status ? <p className="text-sm text-[var(--ink-700)]">{status}</p> : null}
    </div>
  )
}
