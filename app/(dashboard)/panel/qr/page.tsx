import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth/actions'
import { redirect } from 'next/navigation'
import QRClient from './QRClient'
import type { Table } from '@/lib/supabase/types'

export default async function QRPage() {
  const user = await getUser()
  if (!user) redirect('/giris')

  const supabase = await createServerSupabaseClient()

  const [{ data: tables }, { data: business }] = await Promise.all([
    supabase.from('tables').select('*').eq('business_id', user.id).order('table_number'),
    supabase.from('businesses').select('slug').eq('id', user.id).single(),
  ])

  return (
    <QRClient
      existingTables={(tables ?? []) as Table[]}
      businessSlug={business?.slug ?? ''}
    />
  )
}
