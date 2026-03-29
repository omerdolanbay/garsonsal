'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth/actions'

export async function updateBusinessSettings(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const user = await getUser()
  if (!user) return { error: 'Yetkisiz' }

  const name = formData.get('name') as string
  const brand_primary_color = formData.get('brand_primary_color') as string
  const brand_secondary_color = formData.get('brand_secondary_color') as string

  const { error } = await supabase
    .from('businesses')
    .update({ name, brand_primary_color, brand_secondary_color })
    .eq('id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/panel/settings')
  return { success: true }
}

export async function updatePassword(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const newPassword = formData.get('password') as string

  if (newPassword.length < 6) return { error: 'Şifre en az 6 karakter olmalı' }

  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) return { error: error.message }
  return { success: true }
}
