import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getUser, getBusiness } from '@/lib/auth/actions'
import { isSuperAdmin } from '@/lib/auth/superadmin'
import { createServiceRoleClient } from '@/lib/supabase/server'
import Sidebar from '@/components/panel/Sidebar'
import ImpersonationBanner from '@/components/panel/ImpersonationBanner'
import ThemeProvider from '@/components/ThemeProvider'
import ThemeToggle from '@/components/ThemeToggle'
import type { Business } from '@/lib/supabase/types'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const impersonateId = cookieStore.get('sa_impersonate')?.value

  let business: Business | null = null
  let isImpersonating = false

  if (impersonateId && (await isSuperAdmin())) {
    const supabase = createServiceRoleClient()
    const { data } = await supabase
      .from('businesses')
      .select('*')
      .eq('id', impersonateId)
      .single()
    business = data as Business | null
    isImpersonating = !!business
  } else {
    const user = await getUser()
    if (!user) redirect('/giris')
    business = await getBusiness() as Business | null
    if (!business) redirect('/giris')
  }

  if (!business) redirect('/giris')

  return (
    <ThemeProvider>
      <div className="flex min-h-screen" style={{ background: 'var(--color-layout-gradient)' }}>
        <Sidebar businessName={business.name} />
        <div className="flex-1 flex flex-col overflow-hidden" style={{ background: 'var(--color-panel-bg)' }}>
          {isImpersonating && <ImpersonationBanner businessName={business.name} />}
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
