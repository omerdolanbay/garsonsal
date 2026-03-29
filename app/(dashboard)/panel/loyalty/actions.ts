'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth/actions'

export async function updateLoyaltySettings(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const user = await getUser()
  if (!user) return { error: 'Yetkisiz' }

  const stamps_required = parseInt(formData.get('stamps_required') as string)
  const reward_description = formData.get('reward_description') as string
  const card_bg_color = formData.get('card_bg_color') as string
  const card_text_color = formData.get('card_text_color') as string

  const { error } = await supabase
    .from('loyalty_settings')
    .update({ stamps_required, reward_description, card_bg_color, card_text_color })
    .eq('business_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/panel/loyalty')
  return { success: true }
}
