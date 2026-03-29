import { NextRequest, NextResponse } from 'next/server'
import { isSuperAdmin } from '@/lib/auth/superadmin'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  if (!(await isSuperAdmin())) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }

  const { businessId, status } = await req.json()
  const supabase = createServiceRoleClient()

  const { error } = await supabase
    .from('businesses')
    .update({ plan_status: status })
    .eq('id', businessId)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
