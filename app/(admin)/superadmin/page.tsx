import { createServiceRoleClient } from '@/lib/supabase/server'
import BusinessesClient from './BusinessesClient'

export default async function SuperAdminPage() {
  const supabase = createServiceRoleClient()

  const { data: businesses } = await supabase
    .from('businesses')
    .select('*')
    .order('created_at', { ascending: false })

  // Her işletmenin üye + sipariş sayısını al
  const stats = await Promise.all(
    (businesses ?? []).map(async (b) => {
      const [{ count: memberCount }, { count: orderCount }] = await Promise.all([
        supabase.from('loyalty_members').select('id', { count: 'exact', head: true }).eq('business_id', b.id),
        supabase.from('orders').select('id', { count: 'exact', head: true }).eq('business_id', b.id),
      ])
      return { id: b.id, memberCount: memberCount ?? 0, orderCount: orderCount ?? 0 }
    })
  )

  return <BusinessesClient businesses={businesses ?? []} stats={stats} />
}
