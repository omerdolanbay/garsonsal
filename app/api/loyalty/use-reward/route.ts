import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = createServiceRoleClient()
  const { memberCode, businessId } = await req.json()

  if (!memberCode || !businessId) {
    return NextResponse.json({ error: 'Eksik parametre' }, { status: 400 })
  }

  const { data: member } = await supabase
    .from('loyalty_members')
    .select('*')
    .eq('member_code', memberCode.toUpperCase())
    .eq('business_id', businessId)
    .single()

  if (!member) return NextResponse.json({ error: 'Üye bulunamadı' }, { status: 404 })

  await supabase
    .from('loyalty_members')
    .update({ stamp_count: 0 })
    .eq('id', member.id)

  await supabase.from('loyalty_transactions').insert({
    business_id: businessId,
    member_id: member.id,
    type: 'reward_used',
    stamps_changed: -member.stamp_count,
    note: 'Ödül kullanıldı',
  })

  return NextResponse.json({ success: true })
}
