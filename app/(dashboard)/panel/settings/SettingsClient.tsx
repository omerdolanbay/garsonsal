'use client'

import { useState } from 'react'
import type { Business } from '@/lib/supabase/types'
import { updateBusinessSettings, updatePassword } from './actions'

const BRAND_COLORS = [
  { label: 'Koyu Kahve', value: '#4A2C2A' },
  { label: 'Terracotta', value: '#C17F4A' },
  { label: 'Orman Yeşili', value: '#4A7C59' },
  { label: 'Lacivert', value: '#2C3E6B' },
  { label: 'Antrasit', value: '#2C2C2C' },
  { label: 'Bordo', value: '#6B2737' },
  { label: 'Mürdüm', value: '#5B4B8A' },
  { label: 'Petrol', value: '#2A6B6B' },
]

const BG_COLORS = [
  { label: 'Krem', value: '#F5F0E8' },
  { label: 'Beyaz', value: '#FFFFFF' },
  { label: 'Bej', value: '#F0E8D8' },
  { label: 'Açık Gri', value: '#F5F5F5' },
  { label: 'Açık Yeşil', value: '#F0F5F0' },
  { label: 'Açık Mavi', value: '#F0F0F5' },
  { label: 'Somon', value: '#FDF0EC' },
  { label: 'Lavanta', value: '#F5F0FF' },
]

export default function SettingsClient({ business }: { business: Business }) {
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)

  async function handleSettings(fd: FormData) {
    setLoading(true); setMsg(null)
    const res = await updateBusinessSettings(fd)
    setMsg(res?.error ? { type: 'err', text: res.error } : { type: 'ok', text: 'Ayarlar kaydedildi' })
    setLoading(false)
  }

  async function handlePassword(fd: FormData) {
    setLoading(true); setMsg(null)
    const res = await updatePassword(fd)
    setMsg(res?.error ? { type: 'err', text: res.error } : { type: 'ok', text: 'Şifre güncellendi' })
    setLoading(false)
  }

  return (
    <div className="p-8 max-w-2xl space-y-6">
      <div className="mb-2">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-white)' }}>Ayarlar</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--color-muted)' }}>İşletme bilgileri ve hesap ayarları</p>
      </div>

      {msg && (
        <div className="px-4 py-3 rounded-xl text-sm font-medium"
          style={msg.type === 'ok'
            ? { background: 'rgba(34,197,94,0.08)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }
            : { background: 'rgba(248,113,113,0.08)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' }
          }
        >
          {msg.type === 'ok' ? '✓ ' : '✕ '}{msg.text}
        </div>
      )}

      {/* İşletme bilgileri */}
      <div className="glass-elevated p-6">
        <h2 className="font-semibold mb-4" style={{ color: 'var(--color-white)' }}>İşletme Bilgileri</h2>
        <form action={handleSettings} className="space-y-4">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted)' }}>İşletme Adı</label>
            <input name="name" defaultValue={business.name} required className="input-dark" />
          </div>

          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted)' }}>Menü URL</label>
            <div className="px-4 py-2.5 rounded-xl text-sm" style={{ background: 'var(--color-input-bg)', border: '1px solid var(--color-border)', color: 'var(--color-muted)' }}>
              /menu/<strong style={{ color: 'var(--color-accent-2)' }}>{business.slug}</strong>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: 'var(--color-muted)' }}>Ana Renk</label>
            <div className="grid grid-cols-4 gap-2">
              {BRAND_COLORS.map(c => (
                <label key={c.value} className="cursor-pointer">
                  <input type="radio" name="brand_primary_color" value={c.value} defaultChecked={business.brand_primary_color === c.value} className="sr-only" />
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-transparent has-[:checked]:border-[#0077b6] transition"
                    style={{ background: 'var(--color-input-bg)' }}>
                    <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ background: c.value }} />
                    <span className="text-xs truncate" style={{ color: 'var(--color-muted)' }}>{c.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium mb-2" style={{ color: 'var(--color-muted)' }}>Arka Plan Rengi</label>
            <div className="grid grid-cols-4 gap-2">
              {BG_COLORS.map(c => (
                <label key={c.value} className="cursor-pointer">
                  <input type="radio" name="brand_secondary_color" value={c.value} defaultChecked={business.brand_secondary_color === c.value} className="sr-only" />
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-transparent has-[:checked]:border-[#0077b6] transition" style={{ background: c.value }}>
                    <span className="text-xs text-[#2C1810]">{c.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading} className="gradient-btn w-full py-2.5 rounded-xl text-sm disabled:opacity-60">
            {loading ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
        </form>
      </div>

      {/* Şifre değiştir */}
      <div className="glass-elevated p-6">
        <h2 className="font-semibold mb-1" style={{ color: 'var(--color-white)' }}>Şifre Değiştir</h2>
        <p className="text-xs mb-4" style={{ color: 'var(--color-muted)' }}>En az 6 karakter olmalıdır</p>
        <form action={handlePassword} className="space-y-3">
          <input
            name="password"
            type="password"
            required
            minLength={6}
            placeholder="Yeni şifre"
            className="input-dark"
          />
          <button type="submit" disabled={loading} className="gradient-btn w-full py-2.5 rounded-xl text-sm disabled:opacity-60">
            Şifreyi Güncelle
          </button>
        </form>
      </div>

      {/* Plan bilgisi */}
      <div className="glass-elevated p-6">
        <h2 className="font-semibold mb-3" style={{ color: 'var(--color-white)' }}>Abonelik</h2>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-lg text-sm font-semibold capitalize"
            style={{ background: 'var(--color-accent-bg)', color: 'var(--color-accent-2)', border: '1px solid var(--color-border)' }}>
            {business.plan}
          </span>
          <span className="px-3 py-1 rounded-lg text-sm font-medium"
            style={business.plan_status === 'trial'
              ? { background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }
              : { background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }
            }
          >
            {business.plan_status === 'trial' ? 'Deneme' : business.plan_status === 'active' ? 'Aktif' : 'İptal'}
          </span>
        </div>
        {business.trial_ends_at && business.plan_status === 'trial' && (
          <p className="text-xs mt-2" style={{ color: 'var(--color-muted)' }}>
            Deneme süresi: {new Date(business.trial_ends_at).toLocaleDateString('tr-TR')}
          </p>
        )}
      </div>
    </div>
  )
}
