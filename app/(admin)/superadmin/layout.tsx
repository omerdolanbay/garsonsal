import Link from 'next/link'

const links = [
  { href: '/admindolanbay', label: 'İşletmeler', icon: '🏢' },
  { href: '/admindolanbay/discounts', label: 'İndirim Kodları', icon: '🎟️' },
  { href: '/admindolanbay/subscriptions', label: 'Abonelikler', icon: '💳' },
]

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen" style={{ background: 'var(--color-bg)' }}>
      <aside className="w-56 flex flex-col"
        style={{
          background: 'var(--color-surface)',
          borderRight: '1px solid var(--color-border)',
        }}>
        <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <div className="text-white font-bold text-sm flex items-center gap-2">
            <span>🔐</span> Süper Admin
          </div>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
              style={{ color: 'var(--color-muted)', border: '1px solid transparent' }}
            >
              <span>{l.icon}</span>
              <span>{l.label}</span>
            </Link>
          ))}
        </nav>
        <div className="px-3 py-4" style={{ borderTop: '1px solid var(--color-border)' }}>
          <form action="/api/admin/logout" method="POST">
            <button type="submit" className="w-full text-left px-3 py-2.5 text-sm transition-colors"
              style={{ color: 'var(--color-muted)' }}>
              🚪 Çıkış
            </button>
          </form>
        </div>
      </aside>
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  )
}
