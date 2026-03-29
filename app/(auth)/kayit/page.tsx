'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signUp } from '@/lib/auth/actions'
import Logo from '@/components/Logo'

const PLANS = [
  { id: 'starter', label: 'Starter', price: '$89/ay', desc: '1 şube, 15 masa' },
  { id: 'growth',  label: 'Growth',  price: '$119/ay', desc: '3 şube, sınırsız masa' },
  { id: 'pro',     label: 'Pro',     price: '$189/ay', desc: 'Sınırsız + white-label' },
]

export default function KayitPage() {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('starter')
  const [discountCode, setDiscountCode] = useState('')
  const [discountInfo, setDiscountInfo] = useState<{ label: string } | null>(null)
  const [discountError, setDiscountError] = useState<string | null>(null)

  async function handleSubmit(formData: FormData) {
    setLoading(true)
    setError(null)
    formData.set('plan', selectedPlan)
    formData.set('discount_code', discountCode)
    const result = await signUp(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    }
  }

  async function validateDiscount() {
    if (!discountCode.trim()) return
    setDiscountError(null)
    setDiscountInfo(null)
    const res = await fetch('/api/discount/validate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: discountCode, plan: selectedPlan }),
    })
    const data = await res.json()
    if (res.ok) setDiscountInfo(data)
    else setDiscountError(data.error)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
      style={{ background: 'var(--color-bg)' }}>
      <div className="orb w-96 h-96 -top-32 -right-32" style={{ background: 'rgba(0,119,182,0.18)' }} />
      <div className="orb w-72 h-72 bottom-0 -left-20" style={{ background: 'rgba(0,180,216,0.1)' }} />

      <div className="relative z-10 w-full max-w-lg py-8">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-5">
            <Logo />
          </div>
          <p style={{ color: 'var(--color-muted)', fontSize: '0.9rem' }}>
            7 gün ücretsiz deneyin — kredi kartı gerekmez
          </p>
        </div>

        <div className="glass-elevated p-8">
          <form action={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-muted)' }}>İşletme Adı</label>
              <input name="name" type="text" required placeholder="Kafe İstanbul" className="input-dark" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-muted)' }}>URL Adresi</label>
              <div className="flex items-center gap-2">
                <span className="text-sm whitespace-nowrap" style={{ color: 'var(--color-muted)' }}>/menu/</span>
                <input name="slug" type="text" placeholder="kafe-istanbul" className="input-dark" style={{ flex: 1 }} />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-muted)' }}>E-posta</label>
              <input name="email" type="email" required placeholder="kafe@example.com" className="input-dark" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-muted)' }}>Şifre</label>
              <input name="password" type="password" required minLength={6} placeholder="En az 6 karakter" className="input-dark" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-muted)' }}>Plan</label>
              <div className="grid grid-cols-3 gap-2">
                {PLANS.map(p => (
                  <button key={p.id} type="button"
                    onClick={() => { setSelectedPlan(p.id); setDiscountInfo(null); setDiscountError(null) }}
                    className="p-3 rounded-xl text-left transition-all"
                    style={{
                      background: selectedPlan === p.id ? 'rgba(0,119,182,0.2)' : 'rgba(10,22,40,0.8)',
                      border: `2px solid ${selectedPlan === p.id ? 'var(--color-accent-1)' : 'var(--color-border)'}`,
                      boxShadow: selectedPlan === p.id ? '0 0 16px rgba(0,119,182,0.2)' : 'none',
                    }}>
                    <div className="font-semibold text-white text-sm">{p.label}</div>
                    <div className="text-xs font-medium mt-0.5" style={{ color: 'var(--color-accent-2)' }}>{p.price}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>{p.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-muted)' }}>İndirim Kodu (isteğe bağlı)</label>
              <div className="flex gap-2">
                <input
                  value={discountCode}
                  onChange={e => { setDiscountCode(e.target.value.toUpperCase()); setDiscountInfo(null); setDiscountError(null) }}
                  placeholder="ACILIS2025"
                  className="input-dark uppercase tracking-wider"
                  style={{ flex: 1 }}
                />
                <button type="button" onClick={validateDiscount} className="ghost-btn px-4 py-2.5 rounded-xl text-sm font-medium">
                  Uygula
                </button>
              </div>
              {discountInfo && (
                <p className="text-xs mt-1.5 px-3 py-1.5 rounded-lg"
                  style={{ background: 'rgba(0,119,182,0.1)', color: 'var(--color-accent-3)', border: '1px solid var(--color-border)' }}>
                  ✓ {discountInfo.label} uygulanacak
                </p>
              )}
              {discountError && <p className="text-xs mt-1.5" style={{ color: '#fca5a5' }}>{discountError}</p>}
            </div>

            {error && (
              <div className="px-4 py-3 rounded-xl text-sm"
                style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: '#fca5a5' }}>
                {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="gradient-btn w-full py-3 px-4 rounded-xl text-sm disabled:opacity-60">
              {loading ? 'Hesap oluşturuluyor...' : 'Ücretsiz Başla →'}
            </button>
          </form>

          <p className="text-center text-sm mt-6" style={{ color: 'var(--color-muted)' }}>
            Zaten hesabınız var mı?{' '}
            <Link href="/giris" className="font-semibold hover:underline" style={{ color: 'var(--color-accent-2)' }}>
              Giriş yapın
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
