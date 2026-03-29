'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signIn } from '@/lib/auth/actions'
import Logo from '@/components/Logo'

export default function GirisPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    const result = await signIn(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'var(--color-bg)' }}>
      <div className="orb w-80 h-80 -top-20 -left-20" style={{ background: 'rgba(0,119,182,0.2)' }} />
      <div className="orb w-64 h-64 bottom-0 right-0" style={{ background: 'rgba(0,180,216,0.1)' }} />

      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <Logo />
          </div>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>
            İşletme panelinize giriş yapın
          </p>
        </div>

        <div className="glass-elevated p-8">
          <form action={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-muted)' }}>
                E-posta
              </label>
              <input name="email" type="email" required placeholder="kafe@example.com" className="input-dark" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-muted)' }}>
                Şifre
              </label>
              <input name="password" type="password" required placeholder="••••••••" className="input-dark" />
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl text-sm"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="gradient-btn w-full py-3 px-4 rounded-xl text-sm disabled:opacity-60">
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap →'}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--color-muted)' }}>
            Hesabınız yok mu?{' '}
            <Link href="/kayit" className="font-semibold hover:underline" style={{ color: 'var(--color-accent-2)' }}>
              Ücretsiz deneyin
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
