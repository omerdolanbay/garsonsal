'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/lib/auth/actions'
import Logo from '@/components/Logo'

const links = [
  { href: '/panel/orders',   label: 'Siparişler',    icon: '📋' },
  { href: '/panel/menu',     label: 'Menü',          icon: '🍽️' },
  { href: '/panel/qr',       label: 'QR Kodları',    icon: '📱' },
  { href: '/panel/loyalty',  label: 'Sadakat Kartı', icon: '⭐' },
  { href: '/panel/settings', label: 'Ayarlar',       icon: '⚙️' },
]

export default function Sidebar({ businessName }: { businessName: string }) {
  const pathname = usePathname()

  return (
    <aside className="w-60 min-h-screen flex flex-col"
      style={{
        background: 'var(--color-surface)',
        borderRight: '1px solid var(--color-border)',
      }}>
      <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--color-border)' }}>
        <Logo size={40} />
        <div className="mt-2 text-xs font-medium truncate" style={{ color: 'var(--color-muted)' }}>
          {businessName}
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {links.map(({ href, label, icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
              style={active ? {
                background: 'linear-gradient(135deg, rgba(0,119,182,0.4), rgba(0,180,216,0.2))',
                color: 'var(--color-white)',
                fontWeight: 600,
                border: '1px solid var(--color-accent-1)',
              } : {
                color: 'var(--color-muted)',
                border: '1px solid transparent',
              }}>
              <span>{icon}</span>
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="px-3 py-4" style={{ borderTop: '1px solid var(--color-border)' }}>
        <form action={signOut}>
          <button type="submit"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
            style={{ color: 'var(--color-muted)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--color-white)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--color-muted)')}>
            <span>🚪</span>
            <span>Çıkış Yap</span>
          </button>
        </form>
      </div>
    </aside>
  )
}
