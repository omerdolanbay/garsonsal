'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Logo from '@/components/Logo'

export default function SuperAdminGiris() {
  const [secret, setSecret] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret }),
    })
    if (res.ok) router.push('/admindolanbay')
    else setError('Geçersiz şifre')
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'var(--color-bg)' }}>
      <div className="orb w-96 h-96 -top-20 -left-20" style={{ background: 'rgba(0,119,182,0.15)' }} />
      <div className="orb w-80 h-80 -bottom-20 -right-20" style={{ background: 'rgba(0,180,216,0.1)' }} />

      <div className="relative z-10 w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <Logo />
          </div>
          <h1 className="text-xl font-bold text-white" style={{ letterSpacing: '-0.02em' }}>
            Süper Admin
          </h1>
          <p className="text-sm mt-1" style={{ color: 'var(--color-muted)' }}>
            Garsonsal yönetim paneli
          </p>
        </div>

        <div className="glass-elevated p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="password"
              value={secret}
              onChange={e => setSecret(e.target.value)}
              placeholder="Admin şifresi"
              required
              className="input-dark"
            />
            {error && <p className="text-sm" style={{ color: '#f87171' }}>{error}</p>}
            <button type="submit" className="gradient-btn w-full py-3 rounded-xl text-sm">
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
