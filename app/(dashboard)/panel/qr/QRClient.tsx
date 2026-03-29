'use client'

import { useState } from 'react'
import type { Table } from '@/lib/supabase/types'

interface QRTableData {
  tableNumber: number
  qrToken: string
  url: string
  dataUrl: string
}

export default function QRClient({
  existingTables,
  businessSlug,
}: {
  existingTables: Table[]
  businessSlug: string
}) {
  const [tableCount, setTableCount] = useState(existingTables.length || 10)
  const [qrTables, setQrTables] = useState<QRTableData[]>([])
  const [loading, setLoading] = useState(false)
  const [generated, setGenerated] = useState(false)

  async function generate() {
    setLoading(true)
    const res = await fetch('/api/qr/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tableCount }),
    })
    const data = await res.json()
    if (res.ok) { setQrTables(data.tables); setGenerated(true) }
    setLoading(false)
  }

  function downloadPDF() {
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(`
      <html>
        <head>
          <title>QR Kodları — ${businessSlug}</title>
          <style>
            body { font-family: Georgia, serif; margin: 0; padding: 0; }
            .page { width: 210mm; min-height: 297mm; display: flex; flex-direction: column; align-items: center; justify-content: center; page-break-after: always; padding: 40px; box-sizing: border-box; }
            .table-num { font-size: 48px; font-weight: bold; color: #0077b6; margin-bottom: 20px; }
            img { width: 250px; height: 250px; }
            .url { font-size: 11px; color: #666; margin-top: 16px; word-break: break-all; text-align: center; max-width: 260px; }
            @media print { .page { page-break-after: always; } }
          </style>
        </head>
        <body>
          ${qrTables.map(t => `
            <div class="page">
              <div class="table-num">Masa ${t.tableNumber}</div>
              <img src="${t.dataUrl}" />
              <div class="url">${t.url}</div>
            </div>
          `).join('')}
        </body>
      </html>
    `)
    win.document.close()
    win.print()
  }

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold" style={{ color: 'var(--color-white)' }}>QR Kod Yönetimi</h1>
        <p className="text-sm mt-0.5" style={{ color: 'var(--color-muted)' }}>
          {existingTables.length > 0
            ? `Mevcut: ${existingTables.length} masa — yeniden oluşturmak eski QR'ları geçersiz kılar`
            : 'Henüz QR oluşturulmadı'}
        </p>
      </div>

      <div className="glass-elevated p-6 mb-6">
        <h2 className="font-semibold mb-4" style={{ color: 'var(--color-white)' }}>QR Kod Oluştur</h2>
        <div className="flex items-end gap-4 flex-wrap">
          <div>
            <label className="block text-xs font-medium mb-1.5" style={{ color: 'var(--color-muted)' }}>Masa sayısı</label>
            <input
              type="number"
              min={1}
              max={100}
              value={tableCount}
              onChange={e => setTableCount(Number(e.target.value))}
              className="input-dark w-32"
            />
          </div>
          <button onClick={generate} disabled={loading} className="gradient-btn px-6 py-2.5 rounded-xl text-sm disabled:opacity-60">
            {loading ? 'Oluşturuluyor...' : 'QR Kodları Oluştur'}
          </button>
          {generated && (
            <button
              onClick={downloadPDF}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold transition"
              style={{ background: 'var(--color-accent-bg)', color: 'var(--color-accent-2)', border: '1px solid var(--color-border)' }}
            >
              PDF İndir / Yazdır
            </button>
          )}
        </div>
        {existingTables.length > 0 && !generated && (
          <div className="mt-4 text-xs px-3 py-2.5 rounded-xl" style={{ background: 'rgba(245,158,11,0.08)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.2)' }}>
            ⚠️ Yeniden oluşturmak mevcut {existingTables.length} masanın QR kodlarını geçersiz kılar.
          </div>
        )}
      </div>

      {generated && qrTables.length > 0 && (
        <div className="grid grid-cols-3 gap-4 sm:grid-cols-4">
          {qrTables.map(t => (
            <div key={t.tableNumber} className="glass-card p-4 flex flex-col items-center">
              <div className="text-sm font-semibold mb-2" style={{ color: 'var(--color-white)' }}>Masa {t.tableNumber}</div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={t.dataUrl} alt={`Masa ${t.tableNumber} QR`} className="w-full max-w-[160px] rounded-lg" />
              <div className="text-[9px] mt-2 text-center break-all" style={{ color: 'var(--color-muted)' }}>{t.url.split('?')[0]}</div>
            </div>
          ))}
        </div>
      )}

      {!generated && existingTables.length > 0 && (
        <div className="glass-card p-5">
          <h2 className="font-semibold mb-3" style={{ color: 'var(--color-white)' }}>Mevcut Masalar</h2>
          <div className="grid grid-cols-6 gap-2">
            {existingTables.map(t => (
              <div key={t.id} className="text-center py-2 px-3 rounded-xl text-sm font-semibold"
                style={{ background: 'var(--color-accent-bg)', color: 'var(--color-accent-2)', border: '1px solid var(--color-border)' }}>
                {t.table_number}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
