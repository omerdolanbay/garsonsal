import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth/actions'
import { redirect } from 'next/navigation'
import LoyaltyClient from './LoyaltyClient'
import type { LoyaltySettings, LoyaltyMember } from '@/lib/supabase/types'

export default async function LoyaltyPage() {
  const user = await getUser()
  if (!user) redirect('/giris')

  const supabase = await createServerSupabaseClient()

  const [{ data: settings }, { data: members }, { data: business }] = await Promise.all([
    supabase.from('loyalty_settings').select('*').eq('business_id', user.id).single(),
    supabase.from('loyalty_members').select('*').eq('business_id', user.id).order('created_at', { ascending: false }),
    supabase.from('businesses').select('slug, name, brand_primary_color').eq('id', user.id).single(),
  ])

  return (
    <LoyaltyClient
      businessId={user.id}
      businessSlug={business?.slug ?? ''}
      businessName={business?.name ?? ''}
      settings={settings as LoyaltySettings}
      members={(members ?? []) as LoyaltyMember[]}
    />
  )
}
