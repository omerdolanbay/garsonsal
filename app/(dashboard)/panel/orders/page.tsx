import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth/actions'
import { redirect } from 'next/navigation'
import OrdersClient from './OrdersClient'
import type { Order, WaiterCall } from '@/lib/supabase/types'

export default async function OrdersPage() {
  const user = await getUser()
  if (!user) redirect('/giris')

  const supabase = await createServerSupabaseClient()

  // Son 24 saatlik siparişler + bekleyen garson çağrıları
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()

  const [{ data: orders }, { data: calls }] = await Promise.all([
    supabase
      .from('orders')
      .select('*')
      .eq('business_id', user.id)
      .neq('status', 'delivered')
      .gte('created_at', since)
      .order('created_at', { ascending: false }),
    supabase
      .from('waiter_calls')
      .select('*')
      .eq('business_id', user.id)
      .eq('status', 'pending')
      .order('created_at', { ascending: false }),
  ])

  return (
    <div>
      <div className="px-6 py-5 border-b border-[#E0D4C0] bg-white">
        <h1 className="text-2xl font-serif text-[#4A2C2A]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          Sipariş Paneli
        </h1>
        <p className="text-[#7A6358] text-xs mt-0.5">Gerçek zamanlı — otomatik güncellenir</p>
      </div>
      <OrdersClient
        businessId={user.id}
        initialOrders={(orders ?? []) as Order[]}
        initialCalls={(calls ?? []) as WaiterCall[]}
      />
    </div>
  )
}
