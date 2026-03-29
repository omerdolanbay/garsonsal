import { createServiceRoleClient } from '@/lib/supabase/server'

const PLAN_STYLES: Record<string, { bg: string; color: string }> = {
  starter: { bg: 'rgba(0,119,182,0.18)', color: '#67C6EE' },
  growth:  { bg: 'rgba(0,180,216,0.18)', color: '#00b4d8' },
  pro:     { bg: 'rgba(99,102,241,0.18)', color: '#a5b4fc' },
}

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  trial:     { bg: 'rgba(251,191,36,0.15)', color: '#fbbf24' },
  active:    { bg: 'rgba(34,197,94,0.15)',  color: '#4ade80' },
  cancelled: { bg: 'rgba(239,68,68,0.15)',  color: '#f87171' },
}

export default async function SubscriptionsPage() {
  const supabase = createServiceRoleClient()

  const { data: businesses } = await supabase
    .from('businesses')
    .select('id, name, email, plan, plan_status, trial_ends_at, subscription_ends_at, created_at')
    .order('trial_ends_at', { ascending: true })

  const now = new Date()

  const trialEnding = (businesses ?? []).filter(b => {
    if (b.plan_status !== 'trial' || !b.trial_ends_at) return false
    const diff = new Date(b.trial_ends_at).getTime() - now.getTime()
    return diff > 0 && diff < 3 * 24 * 60 * 60 * 1000
  })

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white" style={{ letterSpacing: '-0.02em' }}>
          Abonelik Takibi
        </h1>
        <p className="text-sm mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>
          {(businesses ?? []).length} işletme
        </p>
      </div>

      {trialEnding.length > 0 && (
        <div className="mb-6 p-4 rounded-2xl" style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.2)' }}>
          <h2 className="font-semibold mb-2 text-sm" style={{ color: '#fbbf24' }}>
            ⚠️ 3 gün içinde deneme süresi dolacak ({trialEnding.length} işletme)
          </h2>
          {trialEnding.map(b => (
            <div key={b.id} className="text-sm" style={{ color: 'rgba(251,191,36,0.75)' }}>
              {b.name} — {new Date(b.trial_ends_at!).toLocaleDateString('tr-TR')}
            </div>
          ))}
        </div>
      )}

      <div className="glass-card overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(0,180,216,0.1)', background: 'rgba(0,61,107,0.3)' }}>
              {['İşletme', 'Plan', 'Durum', 'Deneme Bitiş', 'Abonelik Bitiş'].map((h) => (
                <th key={h}
                  className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-left"
                  style={{ color: 'rgba(255,255,255,0.5)' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {(businesses ?? []).map((b, i) => {
              const planStyle = PLAN_STYLES[b.plan] ?? PLAN_STYLES.starter
              const statusStyle = STATUS_STYLES[b.plan_status] ?? STATUS_STYLES.trial
              return (
                <tr key={b.id} style={{ borderBottom: '1px solid rgba(0,180,216,0.06)', background: i % 2 === 1 ? 'rgba(0,61,107,0.1)' : 'transparent' }}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-white">{b.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{b.email}</div>
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
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: b.trial_ends_at ? '#fbbf24' : 'rgba(255,255,255,0.35)' }}>
                    {b.trial_ends_at ? new Date(b.trial_ends_at).toLocaleDateString('tr-TR') : '—'}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                    {b.subscription_ends_at ? new Date(b.subscription_ends_at).toLocaleDateString('tr-TR') : '—'}
                  </td>
                </tr>
              )
            })}
            {(businesses ?? []).length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
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
