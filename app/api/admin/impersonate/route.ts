import { NextRequest, NextResponse } from 'next/server'
import { isSuperAdmin } from '@/lib/auth/superadmin'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function POST(req: NextRequest) {
  if (!(await isSuperAdmin())) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }

  const { businessId } = await req.json()
  const supabase = createServiceRoleClient()

  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('id', businessId)
    .single()

  if (!business) return NextResponse.json({ error: 'İşletme bulunamadı' }, { status: 404 })

  const cookieStore = cookies()
  cookieStore.set('sa_impersonate', businessId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 8,
    path: '/',
  })

  return NextResponse.json({ ok: true })
}
