'use client'

import { useState, useRef } from 'react'
import type { LoyaltySettings, LoyaltyMember } from '@/lib/supabase/types'
import { updateLoyaltySettings } from './actions'

type Tab = 'stamp' | 'designer' | 'members'

const CARD_COLORS = [
  '#4A2C2A', '#C17F4A', '#4A7C59', '#2C3E6B',
  '#2C2C2C', '#6B2737', '#5B4B8A', '#2A6B6B',
]
const TEXT_COLORS = ['#F5F0E8', '#FFFFFF', '#2C1810', '#000000']

const STAMP_ICONS = [
  { id: 'coffee', label: 'Kahve', icon: '☕' },
  { id: 'star', label: 'Yıldız', icon: '⭐' },
  { id: 'heart', label: 'Kalp', icon: '❤️' },
  { id: 'crown', label: 'Taç', icon: '👑' },
  { id: 'diamond', label: 'Elmas', icon: '💎' },
]

interface StampResult {
  memberName: string
  stampCount: number
  stampsRequired: number
  rewardEarned: boolean
  totalEarned: number
}

interface LocalSettings {
  stamps_required: number
  reward_description: string
  card_bg_color: string
  card_text_color: string
  company_name?: string
  stamp_icon?: string
  logo_url?: string | null
}

export default function LoyaltyClient({
  businessId,
  businessSlug,
  businessName,
  settings,
  members,
}: {
  businessId: string
  businessSlug: string
  businessName: string
  settings: LoyaltySettings
  members: LoyaltyMember[]
}) {
  const [tab, setTab] = useState<Tab>('stamp')
  const [memberCode, setMemberCode] = useState('')
  const [foundMember, setFoundMember] = useState<{ name: string; stamp_count: number } | null>(null)
  const [stampResult, setStampResult] = useState<StampResult | null>(null)
  const [stampError, setStampError] = useState<string | null>(null)
  const [stampLoading, setStampLoading] = useState(false)
  const [settingsMsg, setSettingsMsg] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [localSettings, setLocalSettings] = useState<LocalSettings>({
    ...settings,
    company_name: businessName,
    stamp_icon: '☕',
    logo_url: null,
  })
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoUploading, setLogoUploading] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleSearch() {
    if (!memberCode.trim()) return
    setFoundMember(null)
    setStampError(null)
    const code = memberCode.toUpperCase()
    // Quick search from the existing members list
    const found = members.find(m => m.member_code === code)
    if (found) {
      setFoundMember({ name: found.name, stamp_count: found.stamp_count })
    } else {
      setStampError('Üye bulunamadı')
    }
  }

  async function handleStamp() {
    if (!memberCode.trim()) return
    setStampLoading(true)
    setStampResult(null)
    setStampError(null)
    const res = await fetch('/api/loyalty/stamp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberCode: memberCode.toUpperCase(), businessId }),
    })
    const data = await res.json()
    if (res.ok) {
      setStampResult(data)
      setFoundMember(null)
      setMemberCode('')
    } else {
      setStampError(data.error ?? 'Hata oluştu')
    }
    setStampLoading(false)
  }

  async function handleUseReward(code: string) {
    const res = await fetch('/api/loyalty/use-reward', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ memberCode: code, businessId }),
    })
    if (res.ok) setStampResult(prev => prev ? { ...prev, stampCount: 0, rewardEarned: false } : null)
  }

  async function handleSettings(fd: FormData) {
    setSettingsMsg(null)
    const res = await updateLoyaltySettings(fd)
    setSettingsMsg(res?.error ?? 'Ayarlar kaydedildi ✓')
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) { setSettingsMsg('Logo 2MB\'den küçük olmalı'); return }

    setLogoUploading(true)
    const reader = new FileReader()
    reader.onload = ev => {
      const url = ev.target?.result as string
      setLogoPreview(url)
      setLocalSettings(s => ({ ...s, logo_url: url }))
    }
    reader.readAsDataURL(file)

    // Upload to Supabase Storage
    try {
      const formData = new FormData()
      formData.append('file', file)
      const res = await fetch('/api/loyalty/upload-logo', { method: 'POST', body: formData })
      if (res.ok) {
        const { url } = await res.json()
        setLocalSettings(s => ({ ...s, logo_url: url }))
      }
    } catch {}
    setLogoUploading(false)
  }

  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.member_code.toLowerCase().includes(search.toLowerCase()) ||
    (m.phone ?? '').includes(search)
  )

  const tabStyle = (active: boolean): React.CSSProperties => active ? {
    background: 'linear-gradient(135deg, rgba(0,119,182,0.5), rgba(0,180,216,0.3))',
    color: 'var(--color-white)',
    fontWeight: 600,
    border: '1px solid var(--color-accent-1)',
  } : {
    background: 'var(--color-tab-inactive)',
    color: 'var(--color-muted)',
    border: '1px solid var(--color-border)',
  }

  const currentIcon = STAMP_ICONS.find(i => i.icon === localSettings.stamp_icon) ?? STAMP_ICONS[0]

  return (
    <div className="p-6 max-w-5xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-white)' }}>Sadakat Kartı</h1>
          <p className="text-xs mt-0.5" style={{ color: 'var(--color-muted)' }}>
            Kayıt linki: <span style={{ color: 'var(--color-accent-2)' }}>/loyalty/{businessSlug}</span>
            <span className="ml-2">· {members.length} üye</span>
          </p>
        </div>
      </div>

      {/* Sekmeler */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {([['stamp', 'Pul Bas'], ['designer', 'Kart Tasarımcısı'], ['members', 'Üyeler']] as [Tab, string][]).map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)} className="px-4 py-2 rounded-xl text-sm transition" style={tabStyle(tab === t)}>
            {label}
          </button>
        ))}
      </div>

      {/* ── PUL BAS ─────────────────────────────────────────────────────── */}
      {tab === 'stamp' && (
        <div className="space-y-4 max-w-md">
          <div className="glass-elevated p-6">
            <h2 className="font-semibold mb-5" style={{ color: 'var(--color-white)' }}>Pul Bas</h2>

            {/* Search area */}
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted)' }}>Müşteri Kodu</label>
                <div className="flex gap-2">
                  <input
                    value={memberCode}
                    onChange={e => { setMemberCode(e.target.value.toUpperCase()); setFoundMember(null); setStampError(null); setStampResult(null) }}
                    onKeyDown={e => { if (e.key === 'Enter') handleSearch() }}
                    placeholder="AB3X7K"
                    maxLength={6}
                    className="input-dark flex-1 text-center text-xl tracking-widest font-mono"
                  />
                  <button
                    onClick={handleSearch}
                    disabled={!memberCode.trim()}
                    className="px-4 py-2 rounded-xl text-sm font-semibold transition disabled:opacity-50"
                    style={{ background: 'var(--color-accent-bg)', color: 'var(--color-accent-2)', border: '1px solid var(--color-border)' }}
                  >
                    Ara
                  </button>
                </div>
              </div>

              {/* Found member preview */}
              {foundMember && !stampResult && (
                <div className="p-4 rounded-xl" style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)' }}>
                  <div className="font-semibold mb-1" style={{ color: '#22c55e' }}>{foundMember.name}</div>
                  <div className="text-sm mb-3" style={{ color: 'var(--color-muted)' }}>
                    Mevcut pul:
                    <span className="mx-2">
                      {Array.from({ length: settings.stamps_required }).map((_, i) => (
                        <span key={i}>{i < foundMember.stamp_count ? currentIcon.icon : '○'}</span>
                      ))}
                    </span>
                    ({foundMember.stamp_count}/{settings.stamps_required})
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleStamp}
                      disabled={stampLoading}
                      className="flex-1 gradient-btn py-2.5 rounded-xl text-sm font-semibold disabled:opacity-60"
                    >
                      {stampLoading ? 'İşleniyor...' : '+ Pul Ekle'}
                    </button>
                    <button
                      onClick={() => handleUseReward(memberCode)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition"
                      style={{ background: 'rgba(245,158,11,0.1)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }}
                    >
                      Ödül Kullanıldı
                    </button>
                  </div>
                </div>
              )}

              {/* Direct stamp button when no search done */}
              {!foundMember && !stampResult && memberCode.length === 6 && (
                <button
                  onClick={handleStamp}
                  disabled={stampLoading || !memberCode.trim()}
                  className="gradient-btn w-full py-3 rounded-xl font-semibold disabled:opacity-60"
                >
                  {stampLoading ? 'İşleniyor...' : 'Pul Bas ' + currentIcon.icon}
                </button>
              )}
            </div>

            {stampError && (
              <div className="px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(248,113,113,0.08)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' }}>
                {stampError}
              </div>
            )}
          </div>

          {/* Stamp result */}
          {stampResult && (
            <div className="glass-card p-5" style={stampResult.rewardEarned ? { borderColor: 'rgba(245,158,11,0.4)' } : { borderColor: 'rgba(34,197,94,0.3)' }}>
              {stampResult.rewardEarned ? (
                <div className="text-center">
                  <div className="text-3xl mb-2">🎉</div>
                  <div className="font-bold text-lg" style={{ color: '#f59e0b' }}>{stampResult.memberName}</div>
                  <div className="text-sm mt-1" style={{ color: '#f59e0b' }}>Ödül kazandı!</div>
                  <div className="text-xs mt-1" style={{ color: 'var(--color-muted)' }}>{settings.reward_description}</div>
                  <button
                    onClick={() => handleUseReward(memberCode)}
                    className="mt-3 px-4 py-2 rounded-xl text-sm font-semibold transition"
                    style={{ background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)' }}
                  >
                    Ödülü Kullan & Kartı Sıfırla
                  </button>
                </div>
              ) : (
                <div>
                  <div className="font-semibold" style={{ color: '#22c55e' }}>{stampResult.memberName}</div>
                  <div className="text-sm mt-1" style={{ color: '#22c55e' }}>
                    Pul eklendi ✓ — {stampResult.stampCount}/{stampResult.stampsRequired}
                  </div>
                  <div className="flex gap-1.5 mt-3 flex-wrap">
                    {Array.from({ length: stampResult.stampsRequired }).map((_, i) => (
                      <div key={i} className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
                        style={i < stampResult.stampCount
                          ? { background: 'var(--color-accent-1)', color: '#fff' }
                          : { background: 'var(--color-input-bg)', border: '1px solid var(--color-border)', color: 'var(--color-muted)' }
                        }
                      >
                        {i < stampResult.stampCount ? currentIcon.icon : '○'}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ── KART TASARIMCISI ─────────────────────────────────────────────── */}
      {tab === 'designer' && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Controls */}
          <div className="glass-elevated p-6 space-y-5">
            <h2 className="font-semibold" style={{ color: 'var(--color-white)' }}>Kart Ayarları</h2>

            <form action={handleSettings} className="space-y-4">
              {/* Ödül ayarları */}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted)' }}>Ödül için kaç pul?</label>
                <input
                  name="stamps_required" type="number" min={3} max={10}
                  value={localSettings.stamps_required}
                  onChange={e => setLocalSettings(s => ({ ...s, stamps_required: parseInt(e.target.value) || 7 }))}
                  className="input-dark"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted)' }}>Ödül açıklaması</label>
                <input
                  name="reward_description"
                  value={localSettings.reward_description}
                  onChange={e => setLocalSettings(s => ({ ...s, reward_description: e.target.value }))}
                  className="input-dark"
                />
              </div>

              {/* Şirket adı */}
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted)' }}>Şirket Adı (kartta görünür)</label>
                <input
                  value={localSettings.company_name ?? businessName}
                  onChange={e => setLocalSettings(s => ({ ...s, company_name: e.target.value }))}
                  className="input-dark"
                />
              </div>

              {/* Stamp icon */}
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: 'var(--color-muted)' }}>Pul İkonu</label>
                <div className="flex gap-2 flex-wrap">
                  {STAMP_ICONS.map(icon => (
                    <button
                      key={icon.id}
                      type="button"
                      onClick={() => setLocalSettings(s => ({ ...s, stamp_icon: icon.icon }))}
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-lg transition"
                      style={{
                        background: localSettings.stamp_icon === icon.icon ? 'rgba(0,119,182,0.3)' : 'var(--color-input-bg)',
                        border: localSettings.stamp_icon === icon.icon ? '2px solid #0077b6' : '1px solid var(--color-border)',
                      }}
                      title={icon.label}
                    >
                      {icon.icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Kart rengi */}
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: 'var(--color-muted)' }}>Kart Arka Plan Rengi</label>
                <div className="grid grid-cols-4 gap-2">
                  {CARD_COLORS.map(c => (
                    <label key={c} className="cursor-pointer">
                      <input type="radio" name="card_bg_color" value={c}
                        checked={localSettings.card_bg_color === c}
                        onChange={() => setLocalSettings(s => ({ ...s, card_bg_color: c }))}
                        className="sr-only"
                      />
                      <div className="w-full aspect-square rounded-xl border-2 transition"
                        style={{ background: c, borderColor: localSettings.card_bg_color === c ? '#0077b6' : 'transparent' }} />
                    </label>
                  ))}
                </div>
              </div>

              {/* Yazı rengi */}
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: 'var(--color-muted)' }}>Yazı Rengi</label>
                <div className="flex gap-2">
                  {TEXT_COLORS.map(c => (
                    <label key={c} className="cursor-pointer flex-1">
                      <input type="radio" name="card_text_color" value={c}
                        checked={localSettings.card_text_color === c}
                        onChange={() => setLocalSettings(s => ({ ...s, card_text_color: c }))}
                        className="sr-only"
                      />
                      <div className="w-full h-8 rounded-lg border-2 transition"
                        style={{ background: c, borderColor: localSettings.card_text_color === c ? '#0077b6' : 'rgba(14,42,74,0.8)' }} />
                    </label>
                  ))}
                </div>
              </div>

              {/* Logo yükleme */}
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: 'var(--color-muted)' }}>Logo Yükle (PNG, SVG, JPG — maks 2MB)</label>
                <input ref={fileRef} type="file" accept="image/png,image/svg+xml,image/jpeg" onChange={handleLogoUpload} className="sr-only" />
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  disabled={logoUploading}
                  className="px-4 py-2 rounded-xl text-sm font-medium transition disabled:opacity-60"
                  style={{ background: 'var(--color-input-bg)', color: 'var(--color-muted)', border: '1px solid var(--color-border)' }}
                >
                  {logoUploading ? 'Yükleniyor...' : logoPreview ? 'Logoyu Değiştir' : 'Logo Yükle'}
                </button>
                {logoPreview && (
                  <div className="mt-2 flex items-center gap-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logoPreview} alt="Logo" className="h-8 rounded" />
                    <button type="button" onClick={() => { setLogoPreview(null); setLocalSettings(s => ({ ...s, logo_url: null })) }}
                      className="text-xs" style={{ color: '#f87171' }}>Kaldır</button>
                  </div>
                )}
              </div>

              {settingsMsg && (
                <div className="text-sm px-3 py-2 rounded-xl"
                  style={settingsMsg.includes('✓')
                    ? { background: 'rgba(34,197,94,0.08)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.2)' }
                    : { background: 'rgba(248,113,113,0.08)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' }
                  }
                >
                  {settingsMsg}
                </div>
              )}
              <button type="submit" className="gradient-btn w-full py-2.5 rounded-xl text-sm">Kaydet</button>
            </form>
          </div>

          {/* Canlı kart önizleme */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--color-muted)' }}>Canlı Önizleme</h2>
            <div
              className="relative overflow-hidden"
              style={{
                width: '100%',
                maxWidth: 380,
                aspectRatio: '380/240',
                borderRadius: 20,
                background: localSettings.card_bg_color,
                color: localSettings.card_text_color,
                padding: '24px 28px',
                boxShadow: '0 16px 48px rgba(0,0,0,0.5)',
                backdropFilter: 'blur(20px)',
              }}
            >
              {/* Glassmorphism overlay */}
              <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.05)', borderRadius: 20 }} />
              <div style={{ position: 'relative', zIndex: 1 }}>
                {/* Header */}
                <div className="flex items-center gap-2 mb-4">
                  {logoPreview
                    // eslint-disable-next-line @next/next/no-img-element
                    ? <img src={logoPreview} alt="logo" style={{ height: 28, width: 'auto', borderRadius: 4 }} />
                    : <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>G</div>
                  }
                  <span style={{ fontWeight: 700, fontSize: 15, color: localSettings.card_text_color }}>
                    {localSettings.company_name ?? businessName}
                  </span>
                </div>

                {/* Stamps */}
                <div className="flex gap-1.5 flex-wrap mb-3">
                  {Array.from({ length: localSettings.stamps_required }).map((_, i) => (
                    <span key={i} style={{ fontSize: 18, opacity: i < 3 ? 1 : 0.3 }}>
                      {i < 3 ? localSettings.stamp_icon : '○'}
                    </span>
                  ))}
                  <span style={{ fontSize: 11, color: localSettings.card_text_color, opacity: 0.7, marginLeft: 4, alignSelf: 'center' }}>
                    3/{localSettings.stamps_required}
                  </span>
                </div>

                {/* Reward */}
                <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 8 }}>
                  Ödül: {localSettings.reward_description}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between">
                  <div>
                    <div style={{ fontSize: 10, opacity: 0.5 }}>Üye Kodu</div>
                    <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace' }}>AB3X7K</div>
                  </div>
                  <div style={{ fontSize: 9, opacity: 0.4, textAlign: 'right' }}>
                    by Garsonsal
                  </div>
                </div>
              </div>
            </div>
            <p className="text-xs mt-3" style={{ color: 'var(--color-muted)' }}>Boyut: 380×240px · Apple Wallet tarzı</p>
          </div>
        </div>
      )}

      {/* ── ÜYELER ──────────────────────────────────────────────────────── */}
      {tab === 'members' && (
        <div className="space-y-4">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Ad, kod veya telefon ile ara..."
            className="input-dark max-w-sm"
          />
          <div className="glass-card overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)', background: 'var(--color-table-header)' }}>
                  {['Ad', 'Kod', 'Telefon', 'Pul', 'Toplam', 'Wallet', 'Kayıt'].map(h => (
                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-muted)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((m, i) => (
                  <tr key={m.id} style={{ borderBottom: '1px solid var(--color-row-border)', background: i % 2 === 1 ? 'var(--color-row-alt)' : 'transparent' }}>
                    <td className="px-4 py-3 font-medium" style={{ color: 'var(--color-white)' }}>{m.name}</td>
                    <td className="px-4 py-3 font-mono font-semibold" style={{ color: 'var(--color-accent-2)' }}>{m.member_code}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--color-muted)' }}>{m.phone ?? '—'}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="font-semibold" style={{ color: 'var(--color-white)' }}>{m.stamp_count}</span>
                      <span style={{ color: 'var(--color-muted)' }}>/{settings.stamps_required}</span>
                    </td>
                    <td className="px-4 py-3 text-center" style={{ color: 'var(--color-muted)' }}>{m.total_stamps_earned}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-muted)' }}>
                      {m.wallet_type === 'apple' ? '🍎' : m.wallet_type === 'google' ? '🔵' : '—'}
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-muted)' }}>
                      {new Date(m.created_at).toLocaleDateString('tr-TR')}
                    </td>
                  </tr>
                ))}
                {filteredMembers.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-10 text-center" style={{ color: 'var(--color-muted)' }}>Üye bulunamadı</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
