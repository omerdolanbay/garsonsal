import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth/actions'
import { redirect } from 'next/navigation'
import SettingsClient from './SettingsClient'
import type { Business } from '@/lib/supabase/types'

export default async function SettingsPage() {
  const user = await getUser()
  if (!user) redirect('/giris')

  const supabase = await createServerSupabaseClient()
  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', user.id)
    .single()

  return <SettingsClient business={business as Business} />
}
