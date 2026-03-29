import { NextResponse } from 'next/server'
import { isSuperAdmin } from '@/lib/auth/superadmin'
import { cookies } from 'next/headers'

export async function POST() {
  if (!(await isSuperAdmin())) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }

  const cookieStore = cookies()
  cookieStore.delete('sa_impersonate')

  return NextResponse.json({ ok: true })
}
