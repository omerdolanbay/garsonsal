import { redirect } from 'next/navigation'
import { getUser, getBusiness } from '@/lib/auth/actions'
import Sidebar from '@/components/panel/Sidebar'
import ThemeProvider from '@/components/ThemeProvider'
import ThemeToggle from '@/components/ThemeToggle'
import type { Business } from '@/lib/supabase/types'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()
  if (!user) redirect('/giris')

  const business = await getBusiness() as Business | null
  if (!business) redirect('/giris')

  return (
    <ThemeProvider>
      <div className="flex min-h-screen" style={{ background: 'var(--color-layout-gradient)' }}>
        <Sidebar businessName={business.name} />
        <div className="flex-1 flex flex-col overflow-hidden" style={{ background: 'var(--color-panel-bg)' }}>
          <header className="panel-topbar">
            <ThemeToggle />
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  )
}
