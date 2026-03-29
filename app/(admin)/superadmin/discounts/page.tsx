import { createServiceRoleClient } from '@/lib/supabase/server'
import DiscountsClient from './DiscountsClient'
import type { DiscountCode } from '@/lib/supabase/types'

export default async function DiscountsPage() {
  const supabase = createServiceRoleClient()
  const { data: codes } = await supabase
    .from('discount_codes')
    .select('*')
    .order('created_at', { ascending: false })

  return <DiscountsClient codes={(codes ?? []) as DiscountCode[]} />
}
