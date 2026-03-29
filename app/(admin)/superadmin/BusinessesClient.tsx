'use client'

import { useState } from 'react'
import type { Business } from '@/lib/supabase/types'

const PLAN_STYLES: Record<string, { bg: string; color: string }> = {
  starter: { bg: 'rgba(0,110,163,0.18)', color: '#67C6EE' },
  growth:  { bg: 'rgba(0,173,243,0.18)', color: '#00b4d8' },
  pro:     { bg: 'rgba(99,102,241,0.18)', color: '#a5b4fc' },
}

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  trial:     { bg: 'rgba(251,191,36,0.15)', color: '#fbbf24' },
  active:    { bg: 'rgba(34,197,94,0.15)',  color: '#4ade80' },
  cancelled: { bg: 'rgba(239,68,68,0.15)',  color: '#f87171' },
}

export default function BusinessesClient({
  businesses,
  stats,
}: {
  businesses: Business[]
  stats: { id: string; memberCount: number; orderCount: number }[]
}) {
  const [search, setSearch] = useState('')
  const [impersonating, setImpersonating] = useState<string | null>(null)

  const filtered = businesses.filter(
    b =>
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.email.toLowerCase().includes(search.toLowerCase()) ||
      b.slug.toLowerCase().includes(search.toLowerCase())
  )

  async function handleImpersonate(businessId: string) {
    setImpersonating(businessId)
    const res = await fetch('/api/admin/impersonate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessId }),
    })
    if (res.ok) {
      window.location.href = '/panel/orders'
    } else {
      setImpersonating(null)
    }
  }

  async function handleToggleStatus(business: Business) {
    const newStatus = business.plan_status === 'active' ? 'cancelled' : 'active'
    await fetch('/api/admin/business-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ businessId: business.id, status: newStatus }),
    })
    window.location.reload()
  }

  const statMap = Object.fromEntries(stats.map(s => [s.id, s]))

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white" style={{ letterSpacing: '-0.02em' }}>
            İşletmeler
          </h1>
          <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
            {businesses.length} kayıtlı işletme
          </p>
        </div>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Ad, e-posta veya slug ara..."
          className="input-dark w-64"
        />
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(0,180,216,0.1)', background: 'rgba(0,61,107,0.3)' }}>
              {['İşletme', 'Plan', 'Durum', 'Üye', 'Sipariş', 'Kayıt', 'İşlem'].map((h, i) => (
                <th key={h}
                  className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide ${i >= 3 && i <= 4 ? 'text-center' : i === 6 ? 'text-right' : 'text-left'}`}
                  style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((b, i) => {
              const s = statMap[b.id] ?? { memberCount: 0, orderCount: 0 }
              const planStyle = PLAN_STYLES[b.plan] ?? PLAN_STYLES.starter
              const statusStyle = STATUS_STYLES[b.plan_status] ?? STATUS_STYLES.trial
              return (
                <tr key={b.id}
                  style={{ borderBottom: '1px solid rgba(0,180,216,0.06)', background: i % 2 === 1 ? 'rgba(0,61,107,0.1)' : 'transparent' }}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{b.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{b.email}</div>
                    <div className="text-xs mt-0.5" style={{ color: '#00b4d8' }}>/{b.slug}</div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium capitalize"
                      style={{ background: planStyle.bg, color: planStyle.color }}>
                      {b.plan}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                      style={{ background: statusStyle.bg, color: statusStyle.color }}>
                      {b.plan_status === 'trial' ? 'Deneme' : b.plan_status === 'active' ? 'Aktif' : 'İptal'}
                    </span>
                    {b.plan_status === 'trial' && b.trial_ends_at && (
                      <div className="text-xs mt-0.5" style={{ color: '#fbbf24' }}>
                        {new Date(b.trial_ends_at).toLocaleDateString('tr-TR')}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center font-semibold text-white">{s.memberCount}</td>
                  <td className="px-4 py-3 text-center" style={{ color: 'rgba(255,255,255,0.6)' }}>{s.orderCount}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {new Date(b.created_at).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleImpersonate(b.id)}
                        disabled={impersonating === b.id}
                        className="gradient-btn px-3 py-1.5 rounded-lg text-xs disabled:opacity-60"
                      >
                        {impersonating === b.id ? '...' : 'Giriş Yap'}
                      </button>
                      <button
                        onClick={() => handleToggleStatus(b)}
                        className="px-3 py-1.5 rounded-lg text-xs font-medium transition-all"
                        style={b.plan_status === 'cancelled'
                          ? { background: 'rgba(34,197,94,0.15)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.25)' }
                          : { background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' }}
                      >
                        {b.plan_status === 'cancelled' ? 'Aktifleştir' : 'Askıya Al'}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  İşletme bulunamadı
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
