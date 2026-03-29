import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = createServiceRoleClient()
  const { businessId, tableId, tableNumber, items, total, note } = await req.json()

  if (!businessId || !tableId || !items?.length || !total) {
    return NextResponse.json({ error: 'Eksik parametre' }, { status: 400 })
  }

  // Aktif session var mı kontrol et
  const { data: existingSession } = await supabase
    .from('order_sessions')
    .select('id')
    .eq('business_id', businessId)
    .eq('table_id', tableId)
    .eq('status', 'active')
    .gt('expires_at', new Date().toISOString())
    .single()

  let sessionId = existingSession?.id

  // Yoksa yeni session oluştur
  if (!sessionId) {
    const expiresAt = new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString()
    const { data: newSession, error: sessionErr } = await supabase
      .from('order_sessions')
      .insert({ business_id: businessId, table_id: tableId, expires_at: expiresAt })
      .select('id')
      .single()

    if (sessionErr) return NextResponse.json({ error: sessionErr.message }, { status: 500 })
    sessionId = newSession.id
  }

  // Siparişi oluştur
  const { data: order, error } = await supabase
    .from('orders')
    .insert({
      business_id: businessId,
      session_id: sessionId,
      table_id: tableId,
      table_number: tableNumber,
      items,
      total,
      note: note || null,
      status: 'new',
    })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ orderId: order.id })
}
