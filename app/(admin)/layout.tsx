import { redirect } from 'next/navigation'
import { isSuperAdmin } from '@/lib/auth/superadmin'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const ok = await isSuperAdmin()
  if (!ok) redirect('/admindolanbay/giris')
  return <>{children}</>
}
