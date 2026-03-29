import { NextRequest, NextResponse } from 'next/server'
import { isSuperAdmin } from '@/lib/auth/superadmin'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  if (!(await isSuperAdmin())) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })

  const supabase = createServiceRoleClient()
  const body = await req.json()

  const { data: code, error } = await supabase
    .from('discount_codes')
    .insert(body)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ code })
}

export async function PATCH(req: NextRequest) {
  if (!(await isSuperAdmin())) return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })

  const supabase = createServiceRoleClient()
  const { id, is_active } = await req.json()

  const { error } = await supabase
    .from('discount_codes')
    .update({ is_active })
    .eq('id', id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
