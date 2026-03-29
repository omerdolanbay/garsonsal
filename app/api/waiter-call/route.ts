import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = createServiceRoleClient()
  const { businessId, tableId, tableNumber } = await req.json()

  if (!businessId || !tableId || !tableNumber) {
    return NextResponse.json({ error: 'Eksik parametre' }, { status: 400 })
  }

  // Son 2 dakikada bekleyen çağrı var mı?
  const twoMinAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString()
  const { data: existing } = await supabase
    .from('waiter_calls')
    .select('id')
    .eq('business_id', businessId)
    .eq('table_id', tableId)
    .eq('status', 'pending')
    .gt('created_at', twoMinAgo)
    .single()

  if (existing) {
    return NextResponse.json({ message: 'Zaten bekleyen çağrı var' })
  }

  const { error } = await supabase
    .from('waiter_calls')
    .insert({ business_id: businessId, table_id: tableId, table_number: tableNumber })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true })
}
