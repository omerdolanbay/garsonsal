'use client'

import { useState } from 'react'
import type { DiscountCode } from '@/lib/supabase/types'

export default function DiscountsClient({ codes }: { codes: DiscountCode[] }) {
  const [loading, setLoading] = useState(false)
  const [list, setList] = useState(codes)

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const res = await fetch('/api/admin/discount', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: (fd.get('code') as string).toUpperCase(),
        discount_type: fd.get('discount_type'),
        discount_value: parseFloat(fd.get('discount_value') as string),
        applicable_plan: fd.get('applicable_plan') || null,
        max_uses: fd.get('max_uses') ? parseInt(fd.get('max_uses') as string) : null,
        valid_until: fd.get('valid_until') || null,
      }),
    })
    if (res.ok) {
      const { code } = await res.json()
      setList(prev => [code, ...prev])
      ;(e.target as HTMLFormElement).reset()
    }
    setLoading(false)
  }

  async function toggleCode(id: string, is_active: boolean) {
    await fetch('/api/admin/discount', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, is_active }),
    })
    setList(prev => prev.map(c => c.id === id ? { ...c, is_active } : c))
  }

  const inputCls = 'input-dark text-sm'
  const selectCls = 'input-dark text-sm'

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white" style={{ letterSpacing: '-0.02em' }}>
          İndirim Kodları
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
          {list.length} kod tanımlandı
        </p>
      </div>

      {/* Create form */}
      <div className="glass-elevated p-6 mb-6">
        <h2 className="text-sm font-semibold text-white mb-4" style={{ letterSpacing: '0.05em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)' }}>
          Yeni Kod Oluştur
        </h2>
        <form onSubmit={handleCreate} className="grid grid-cols-3 gap-3">
          <input
            name="code"
            required
            placeholder="Kod (örn: ACILIS2025)"
            className={`col-span-2 ${inputCls} uppercase`}
          />
          <select name="applicable_plan" className={selectCls}
            style={{ background: 'rgba(0,61,107,0.5)', border: '1px solid rgba(0,180,216,0.18)', borderRadius: 12, color: '#fff', padding: '0.625rem 1rem', fontSize: '0.875rem', outline: 'none' }}>
            <option value="">Tüm planlar</option>
            <option value="starter">Starter</option>
            <option value="growth">Growth</option>
            <option value="pro">Pro</option>
          </select>
          <select name="discount_type" required
            style={{ background: 'rgba(0,61,107,0.5)', border: '1px solid rgba(0,180,216,0.18)', borderRadius: 12, color: '#fff', padding: '0.625rem 1rem', fontSize: '0.875rem', outline: 'none' }}>
            <option value="percent">% Yüzde</option>
            <option value="fixed">₺ Sabit</option>
          </select>
          <input
            name="discount_value"
            type="number"
            min="0.01"
            step="0.01"
            required
            placeholder="İndirim değeri"
            className={inputCls}
          />
          <input
            name="max_uses"
            type="number"
            min="1"
            placeholder="Max kullanım (boş=sınırsız)"
            className={inputCls}
          />
          <input
            name="valid_until"
            type="date"
            className={inputCls}
            style={{ colorScheme: 'dark' }}
          />
          <button
            type="submit"
            disabled={loading}
            className="col-span-2 gradient-btn py-2.5 rounded-xl text-sm disabled:opacity-60"
          >
            {loading ? 'Oluşturuluyor...' : 'Kod Oluştur'}
          </button>
        </form>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(0,180,216,0.1)', background: 'rgba(0,61,107,0.3)' }}>
              {['Kod', 'İndirim', 'Plan', 'Kullanım', 'Son Tarih', 'Durum', ''].map((h, i) => (
                <th key={i}
                  className={`px-4 py-3 text-xs font-semibold uppercase tracking-wide ${i === 3 ? 'text-center' : i === 6 ? 'text-right' : 'text-left'}`}
                  style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((c, i) => (
              <tr key={c.id} style={{ borderBottom: '1px solid rgba(0,180,216,0.06)', background: i % 2 === 1 ? 'rgba(0,61,107,0.1)' : 'transparent' }}>
                <td className="px-4 py-3">
                  <span className="font-mono font-bold" style={{ color: '#00b4d8' }}>{c.code}</span>
                </td>
                <td className="px-4 py-3 font-semibold text-white">
                  {c.discount_type === 'percent' ? `%${c.discount_value}` : `₺${c.discount_value}`}
                </td>
                <td className="px-4 py-3 capitalize" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {c.applicable_plan ?? 'Hepsi'}
                </td>
                <td className="px-4 py-3 text-center" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  {c.used_count}{c.max_uses ? `/${c.max_uses}` : ''}
                </td>
                <td className="px-4 py-3 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  {c.valid_until ? new Date(c.valid_until).toLocaleDateString('tr-TR') : '—'}
                </td>
                <td className="px-4 py-3">
                  <span className="text-xs px-2.5 py-1 rounded-full font-medium"
                    style={c.is_active
                      ? { background: 'rgba(34,197,94,0.15)', color: '#4ade80' }
                      : { background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.35)' }}>
                    {c.is_active ? 'Aktif' : 'Pasif'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => toggleCode(c.id, !c.is_active)}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium transition-all"
                    style={c.is_active
                      ? { background: 'rgba(239,68,68,0.12)', color: '#f87171', border: '1px solid rgba(239,68,68,0.2)' }
                      : { background: 'rgba(34,197,94,0.12)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }}>
                    {c.is_active ? 'Pasifleştir' : 'Aktifleştir'}
                  </button>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  Henüz indirim kodu oluşturulmadı
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
