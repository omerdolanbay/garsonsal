'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ImpersonationBanner({ businessName }: { businessName: string }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleEnd() {
    setLoading(true)
    await fetch('/api/admin/end-impersonate', { method: 'POST' })
    router.push('/admindolanbay')
  }

  return (
    <div style={{
      background: 'rgba(251,191,36,0.15)',
      borderBottom: '1px solid rgba(251,191,36,0.3)',
      padding: '8px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
    }}>
      <span style={{ color: '#fbbf24', fontSize: 13, fontWeight: 500 }}>
        ⚠ Süper Admin olarak görüntülüyorsunuz: <strong>{businessName}</strong>
      </span>
      <button
        onClick={handleEnd}
        disabled={loading}
        style={{
          background: 'rgba(251,191,36,0.2)',
          border: '1px solid rgba(251,191,36,0.4)',
          color: '#fbbf24',
          padding: '4px 12px',
          borderRadius: 8,
          fontSize: 12,
          fontWeight: 600,
          cursor: 'pointer',
          opacity: loading ? 0.6 : 1,
        }}
      >
        {loading ? '...' : 'Süper Admin\'e Dön'}
      </button>
    </div>
  )
}
