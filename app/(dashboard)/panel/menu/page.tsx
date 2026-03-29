import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth/actions'
import { redirect } from 'next/navigation'
import MenuClient from './MenuClient'
import type { MenuCategory, MenuItem } from '@/lib/supabase/types'

export default async function MenuPage() {
  const user = await getUser()
  if (!user) redirect('/giris')

  const supabase = await createServerSupabaseClient()

  const [{ data: categories }, { data: items }] = await Promise.all([
    supabase
      .from('menu_categories')
      .select('*')
      .eq('business_id', user.id)
      .order('sort_order'),
    supabase
      .from('menu_items')
      .select('*')
      .eq('business_id', user.id)
      .order('sort_order'),
  ])

  return (
    <MenuClient
      categories={(categories ?? []) as MenuCategory[]}
      items={(items ?? []) as MenuItem[]}
    />
  )
}
