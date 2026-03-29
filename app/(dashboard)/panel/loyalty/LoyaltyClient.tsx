'use client'

import { useState } from 'react'
import type { LoyaltySettings, LoyaltyMember } from '@/lib/supabase/types'
import { updateLoyaltySettings } from './actions'

type Tab = 'stamp' | 'settings' | 'members'

const CARD_COLORS = [
  '#4A2C2A', '#C17F4A', '#4A7C59', '#2C3E6B',
  '#2C2C2C', '#6B2737', '#5B4B8A', '#2A6B6B',
]
const TEXT_COLORS = ['#F5F0E8', '#FFFFFF', '#2C1810', '#000000']

interface StampResult {
  memberName: string
  stampCount: number
  stampsRequired: number
  rewardEarned: boolean
  totalEarned: number
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
  const [stampResult, setStampResult] = useState<StampResult | null>(null)
  const [stampError, setStampError] = useState<string | null>(null)
  const [stampLoading, setStampLoading] = useState(false)
  const [settingsMsg, setSettingsMsg] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [localSettings, setLocalSettings] = useState(settings)

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
    if (res.ok) { setStampResult(data); setMemberCode('') }
    else setStampError(data.error ?? 'Hata oluştu')
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

  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.member_code.toLowerCase().includes(search.toLowerCase()) ||
    (m.phone ?? '').includes(search)
  )

  const tabStyle = (active: boolean) => active ? {
    background: 'linear-gradient(135deg, rgba(0,119,182,0.5), rgba(0,180,216,0.3))',
    color: 'var(--color-white)',
    fontWeight: 600,
    border: '1px solid var(--color-accent-1)',
  } : {
    background: 'var(--color-tab-inactive)',
    color: 'var(--color-muted)',
    border: '1px solid var(--color-border)',
  }

  return (
    <div className="p-6 max-w-4xl">
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
      <div className="flex gap-2 mb-6">
        {([['stamp', 'Pul Bas'], ['settings', 'Ayarlar'], ['members', 'Üyeler']] as [Tab, string][]).map(([t, label]) => (
          <button key={t} onClick={() => setTab(t)} className="px-4 py-2 rounded-xl text-sm transition" style={tabStyle(tab === t)}>
            {label}
          </button>
        ))}
      </div>

      {/* PUL BAS */}
      {tab === 'stamp' && (
        <div className="space-y-4 max-w-sm">
          <div className="glass-elevated p-6">
            <h2 className="font-semibold mb-4" style={{ color: 'var(--color-white)' }}>Pul Bas</h2>
            <div className="space-y-3">
              <input
                value={memberCode}
                onChange={e => setMemberCode(e.target.value.toUpperCase())}
                onKeyDown={e => e.key === 'Enter' && handleStamp()}
                placeholder="Üye Kodu (örn: AB3X7K)"
                maxLength={6}
                className="input-dark text-center text-xl tracking-widest font-mono"
              />
              <button
                onClick={handleStamp}
                disabled={stampLoading || !memberCode.trim()}
                className="gradient-btn w-full py-3 rounded-xl font-semibold disabled:opacity-60"
              >
                {stampLoading ? 'İşleniyor...' : 'Pul Bas ☕'}
              </button>
            </div>
            {stampError && (
              <div className="mt-3 px-4 py-3 rounded-xl text-sm" style={{ background: 'rgba(248,113,113,0.08)', color: '#f87171', border: '1px solid rgba(248,113,113,0.2)' }}>
                {stampError}
              </div>
            )}
          </div>

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
                        {i < stampResult.stampCount ? '☕' : '○'}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* AYARLAR */}
      {tab === 'settings' && (
        <div className="grid grid-cols-2 gap-6">
          <div className="glass-elevated p-6">
            <h2 className="font-semibold mb-4" style={{ color: 'var(--color-white)' }}>Kart Ayarları</h2>
            <form action={handleSettings} className="space-y-4">
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted)' }}>Ödül için kaç pul?</label>
                <input
                  name="stamps_required"
                  type="number" min={3} max={20}
                  defaultValue={localSettings.stamps_required}
                  onChange={e => setLocalSettings(s => ({ ...s, stamps_required: parseInt(e.target.value) || 7 }))}
                  className="input-dark"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted)' }}>Ödül açıklaması</label>
                <input
                  name="reward_description"
                  defaultValue={localSettings.reward_description}
                  onChange={e => setLocalSettings(s => ({ ...s, reward_description: e.target.value }))}
                  className="input-dark"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: 'var(--color-muted)' }}>Kart Rengi</label>
                <div className="grid grid-cols-4 gap-2">
                  {CARD_COLORS.map(c => (
                    <label key={c} className="cursor-pointer">
                      <input type="radio" name="card_bg_color" value={c} defaultChecked={localSettings.card_bg_color === c}
                        onChange={() => setLocalSettings(s => ({ ...s, card_bg_color: c }))} className="sr-only" />
                      <div className="w-full aspect-square rounded-xl border-2 border-transparent has-[:checked]:border-[#0077b6] transition" style={{ background: c }} />
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium mb-2" style={{ color: 'var(--color-muted)' }}>Yazı Rengi</label>
                <div className="flex gap-2">
                  {TEXT_COLORS.map(c => (
                    <label key={c} className="cursor-pointer flex-1">
                      <input type="radio" name="card_text_color" value={c} defaultChecked={localSettings.card_text_color === c}
                        onChange={() => setLocalSettings(s => ({ ...s, card_text_color: c }))} className="sr-only" />
                      <div className="w-full h-8 rounded-lg border-2 border-[#0e2a4a] has-[:checked]:border-[#0077b6] transition" style={{ background: c }} />
                    </label>
                  ))}
                </div>
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

          {/* Canlı önizleme */}
          <div>
            <h2 className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--color-muted)' }}>Canlı Önizleme</h2>
            <div className="rounded-3xl p-6 shadow-xl" style={{ background: localSettings.card_bg_color, color: localSettings.card_text_color }}>
              <div className="text-xs opacity-60 mb-1">{businessName}</div>
              <div className="font-bold text-lg mb-3">Sadakat Kartı</div>
              <div className="grid grid-cols-7 gap-1.5 mb-3">
                {Array.from({ length: localSettings.stamps_required }).map((_, i) => (
                  <div key={i} className="aspect-square rounded-full bg-white/20 flex items-center justify-center text-xs">
                    {i < 3 ? '☕' : '○'}
                  </div>
                ))}
              </div>
              <div className="text-xs opacity-70">Her {localSettings.stamps_required} pul → {localSettings.reward_description}</div>
              <div className="text-xs opacity-40 mt-2">Üye Kodu: AB3X7K</div>
            </div>
          </div>
        </div>
      )}

      {/* ÜYELER */}
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
