'use client'

import { useState } from 'react'
import type { Business } from '@/lib/supabase/types'
import { updateBusinessSettings, updatePassword } from './actions'

type Tab = 'general' | 'appearance' | 'security' | 'subscription'

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

const PLAN_FEATURES: Record<string, string[]> = {
  starter: ['1 Şube', '15 Masaya Kadar QR', 'Sipariş Paneli', 'Garson Çağırma', 'Menü Yönetimi', 'Loyalty (500 Üye)', '7 Gün Ücretsiz Deneme'],
  growth: ['3 Şube', 'Sınırsız Masa QR', 'Starter\'daki Her Şey', 'Loyalty (5.000 Üye)', 'Push Bildirim & Kampanya', 'Müşteri CRM & Analitik', '7 Gün Ücretsiz Deneme'],
  pro: ['Sınırsız Şube', 'Sınırsız Her Şey', 'Growth\'daki Her Şey', 'White-label', 'Öncelikli Destek', '7 Gün Ücretsiz Deneme'],
}

const tabStyle = (active: boolean): React.CSSProperties => active
  ? {
    background: 'linear-gradient(135deg, rgba(0,119,182,0.5), rgba(0,180,216,0.3))',
    color: 'var(--color-white)',
    fontWeight: 600,
    border: '1px solid var(--color-accent-1)',
  }
  : {
    background: 'var(--color-tab-inactive)',
    color: 'var(--color-muted)',
    border: '1px solid var(--color-border)',
  }

export default function SettingsClient({ business }: { business: Business }) {
  const [tab, setTab] = useState<Tab>('general')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState<{ type: 'ok' | 'err'; text: string } | null>(null)
  const [primaryColor, setPrimaryColor] = useState(business.brand_primary_color ?? '#2C3E6B')
  const [bgColor, setBgColor] = useState(business.brand_secondary_color ?? '#F5F0E8')

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

  const tabs: [Tab, string][] = [['general', 'Genel Bilgiler'], ['appearance', 'Görünüm & Marka'], ['security', 'Güvenlik'], ['subscription', 'Abonelik']]

  return (
    <div className="p-6 md:p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-white)' }}>Ayarlar</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--color-muted)' }}>İşletme bilgileri ve hesap ayarları</p>
      </div>

      {/* Tab bar */}
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map(([t, label]) => (
          <button key={t} onClick={() => { setTab(t); setMsg(null) }}
            className="px-4 py-2 rounded-xl text-sm transition-all" style={tabStyle(tab === t)}>
            {label}
          </button>
        ))}
      </div>

      {msg && (
        <div className="mb-4 px-4 py-3 rounded-xl text-sm font-medium"
          style={msg.type === 'ok'
            ? { background: 'rgba(34,197,94,0.08)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }
            : { background: 'rgba(248,113,113,0.08)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' }
          }
        >
          {msg.type === 'ok' ? '✓ ' : '✕ '}{msg.text}
        </div>
      )}

      {/* ── TAB 1: Genel Bilgiler ─────────────────────────────────────────── */}
      {tab === 'general' && (
        <div className="glass-elevated p-6">
          <h2 className="font-semibold mb-4" style={{ color: 'var(--color-white)' }}>Genel Bilgiler</h2>
          <form action={handleSettings} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted)' }}>İşletme Adı</label>
              <input name="name" defaultValue={business.name} required className="input-dark" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted)' }}>E-posta</label>
              <input name="email" type="email" defaultValue={business.email ?? ''} className="input-dark" placeholder="ornek@isletme.com" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted)' }}>Telefon</label>
              <input name="phone" type="tel" defaultValue={(business as unknown as { phone?: string }).phone ?? ''} className="input-dark" placeholder="+90 555 123 45 67" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted)' }}>Adres</label>
              <textarea name="address" rows={2} defaultValue={(business as unknown as { address?: string }).address ?? ''} className="input-dark resize-none" placeholder="İşletme adresi" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted)' }}>Menü URL</label>
              <div className="px-4 py-2.5 rounded-xl text-sm" style={{ background: 'var(--color-input-bg)', border: '1px solid var(--color-border)', color: 'var(--color-muted)' }}>
                /menu/<strong style={{ color: 'var(--color-accent-2)' }}>{business.slug}</strong>
              </div>
            </div>
            {/* hidden color fields carry forward current values */}
            <input type="hidden" name="brand_primary_color" value={primaryColor} />
            <input type="hidden" name="brand_secondary_color" value={bgColor} />
            <button type="submit" disabled={loading} className="gradient-btn w-full py-2.5 rounded-xl text-sm disabled:opacity-60">
              {loading ? 'Kaydediliyor...' : 'Kaydet'}
            </button>
          </form>
        </div>
      )}

      {/* ── TAB 2: Görünüm & Marka ───────────────────────────────────────── */}
      {tab === 'appearance' && (
        <div className="space-y-5">
          <div className="glass-elevated p-6">
            <h2 className="font-semibold mb-4" style={{ color: 'var(--color-white)' }}>Görünüm & Marka</h2>
            <form action={handleSettings} className="space-y-5">
              <input type="hidden" name="name" value={business.name} />
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: 'var(--color-muted)' }}>Ana Renk</label>
                <div className="grid grid-cols-4 gap-2">
                  {BRAND_COLORS.map(c => (
                    <label key={c.value} className="cursor-pointer">
                      <input type="radio" name="brand_primary_color" value={c.value}
                        defaultChecked={business.brand_primary_color === c.value}
                        onChange={() => setPrimaryColor(c.value)}
                        className="sr-only"
                      />
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
                      <input type="radio" name="brand_secondary_color" value={c.value}
                        defaultChecked={business.brand_secondary_color === c.value}
                        onChange={() => setBgColor(c.value)}
                        className="sr-only"
                      />
                      <div className="flex items-center gap-2 px-3 py-2 rounded-xl border-2 border-transparent has-[:checked]:border-[#0077b6] transition"
                        style={{ background: c.value }}>
                        <span className="text-xs" style={{ color: '#2C1810' }}>{c.label}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Live preview */}
              <div>
                <p className="text-xs font-medium mb-2" style={{ color: 'var(--color-muted)' }}>Menünüz şöyle görünecek</p>
                <div className="rounded-2xl p-5 transition-all" style={{ background: bgColor }}>
                  <div className="font-bold text-lg mb-2" style={{ color: primaryColor }}>{business.name}</div>
                  <div className="flex gap-2 mb-3">
                    {['Kahveler', 'Pastane', 'İçecekler'].map((c, i) => (
                      <span key={c} className="text-xs px-3 py-1 rounded-full" style={{ background: i === 0 ? primaryColor : 'rgba(0,0,0,0.06)', color: i === 0 ? '#fff' : '#666' }}>{c}</span>
                    ))}
                  </div>
                  {[{ name: 'Latte', price: '₺65' }, { name: 'Cappuccino', price: '₺60' }].map(item => (
                    <div key={item.name} className="flex items-center justify-between py-2.5 px-3 rounded-xl mb-2" style={{ background: 'rgba(0,0,0,0.04)' }}>
                      <span className="text-sm font-medium" style={{ color: primaryColor }}>{item.name}</span>
                      <span className="text-sm font-bold" style={{ color: primaryColor }}>{item.price}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button type="submit" disabled={loading} className="gradient-btn w-full py-2.5 rounded-xl text-sm disabled:opacity-60">
                {loading ? 'Kaydediliyor...' : 'Kaydet'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── TAB 3: Güvenlik ──────────────────────────────────────────────── */}
      {tab === 'security' && (
        <div className="glass-elevated p-6">
          <h2 className="font-semibold mb-1" style={{ color: 'var(--color-white)' }}>Şifre Değiştir</h2>
          <p className="text-xs mb-5" style={{ color: 'var(--color-muted)' }}>En az 6 karakter olmalıdır</p>
          <form action={handlePassword} className="space-y-4">
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted)' }}>Yeni Şifre</label>
              <input name="password" type="password" required minLength={6} placeholder="••••••••" className="input-dark" />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted)' }}>Şifre Tekrar</label>
              <input name="password_confirm" type="password" required minLength={6} placeholder="••••••••" className="input-dark" />
            </div>
            <button type="submit" disabled={loading} className="gradient-btn w-full py-2.5 rounded-xl text-sm disabled:opacity-60">
              {loading ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
            </button>
          </form>
        </div>
      )}

      {/* ── TAB 4: Abonelik ──────────────────────────────────────────────── */}
      {tab === 'subscription' && (
        <div className="glass-elevated p-6">
          <h2 className="font-semibold mb-4" style={{ color: 'var(--color-white)' }}>Abonelik</h2>
          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="px-4 py-1.5 rounded-lg text-sm font-bold capitalize"
              style={{ background: 'var(--color-accent-bg)', color: 'var(--color-accent-2)', border: '1px solid var(--color-border)' }}>
              {business.plan} Plan
            </span>
            <span className="px-3 py-1.5 rounded-lg text-sm font-medium"
              style={business.plan_status === 'trial'
                ? { background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }
                : business.plan_status === 'active'
                ? { background: 'rgba(34,197,94,0.1)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }
                : { background: 'rgba(248,113,113,0.08)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' }
              }
            >
              {business.plan_status === 'trial' ? 'Deneme' : business.plan_status === 'active' ? 'Aktif' : 'İptal'}
            </span>
          </div>

          {business.trial_ends_at && business.plan_status === 'trial' && (
            <div className="mb-5 px-4 py-3 rounded-xl text-sm"
              style={{ background: 'rgba(245,158,11,0.08)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }}>
              ⏳ Deneme süresi: <strong>{new Date(business.trial_ends_at).toLocaleDateString('tr-TR')}</strong> tarihinde sona erer
            </div>
          )}

          {business.subscription_ends_at && business.plan_status === 'active' && (
            <div className="mb-5 px-4 py-3 rounded-xl text-sm"
              style={{ background: 'rgba(34,197,94,0.08)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }}>
              ✓ Abonelik: <strong>{new Date(business.subscription_ends_at).toLocaleDateString('tr-TR')}</strong> tarihine kadar aktif
            </div>
          )}

          <div>
            <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: 'var(--color-muted)' }}>Plan Özellikleri</p>
            <ul className="space-y-2.5">
              {(PLAN_FEATURES[business.plan] ?? PLAN_FEATURES.starter).map((f, i) => (
                <li key={i} className="flex items-center gap-2.5 text-sm" style={{ color: 'var(--color-muted)' }}>
                  <span className="flex-shrink-0 font-bold" style={{ color: '#00b4d8' }}>✓</span>{f}
                </li>
              ))}
            </ul>
          </div>

          {business.plan !== 'pro' && (
            <div className="mt-6 pt-5" style={{ borderTop: '1px solid var(--color-border)' }}>
              <p className="text-sm mb-3" style={{ color: 'var(--color-muted)' }}>
                {business.plan === 'starter' ? 'Growth veya Pro\'ya geçerek daha fazla özelliğe ulaşın.' : 'Pro\'ya geçerek sınırsız güce ulaşın.'}
              </p>
              <a href="/kayit-plan" className="gradient-btn inline-block text-sm px-6 py-2.5 rounded-xl font-semibold">
                Planı Yükselt →
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
