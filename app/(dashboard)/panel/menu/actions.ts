'use server'

import { revalidatePath } from 'next/cache'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth/actions'

// --- KATEGORİLER ---

export async function addCategory(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const user = await getUser()
  if (!user) return { error: 'Yetkisiz' }

  const name = formData.get('name') as string

  const { error } = await supabase.from('menu_categories').insert({
    business_id: user.id,
    name,
    sort_order: 0,
  })

  if (error) return { error: error.message }
  revalidatePath('/panel/menu')
}

export async function deleteCategory(id: string) {
  const supabase = await createServerSupabaseClient()
  const user = await getUser()
  if (!user) return { error: 'Yetkisiz' }

  const { error } = await supabase
    .from('menu_categories')
    .delete()
    .eq('id', id)
    .eq('business_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/panel/menu')
}

export async function updateCategoryOrder(id: string, sort_order: number) {
  const supabase = await createServerSupabaseClient()
  const user = await getUser()
  if (!user) return

  await supabase
    .from('menu_categories')
    .update({ sort_order })
    .eq('id', id)
    .eq('business_id', user.id)

  revalidatePath('/panel/menu')
}

// --- ÜRÜNLER ---

export async function addMenuItem(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const user = await getUser()
  if (!user) return { error: 'Yetkisiz' }

  const category_id = formData.get('category_id') as string
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)

  const { error } = await supabase.from('menu_items').insert({
    business_id: user.id,
    category_id: category_id || null,
    name,
    description: description || null,
    price,
  })

  if (error) return { error: error.message }
  revalidatePath('/panel/menu')
}

export async function updateMenuItem(formData: FormData) {
  const supabase = await createServerSupabaseClient()
  const user = await getUser()
  if (!user) return { error: 'Yetkisiz' }

  const id = formData.get('id') as string
  const name = formData.get('name') as string
  const description = formData.get('description') as string
  const price = parseFloat(formData.get('price') as string)
  const category_id = formData.get('category_id') as string
  const is_active = formData.get('is_active') === 'true'

  const { error } = await supabase
    .from('menu_items')
    .update({ name, description: description || null, price, category_id: category_id || null, is_active })
    .eq('id', id)
    .eq('business_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/panel/menu')
}

export async function deleteMenuItem(id: string) {
  const supabase = await createServerSupabaseClient()
  const user = await getUser()
  if (!user) return { error: 'Yetkisiz' }

  const { error } = await supabase
    .from('menu_items')
    .delete()
    .eq('id', id)
    .eq('business_id', user.id)

  if (error) return { error: error.message }
  revalidatePath('/panel/menu')
}

export async function toggleMenuItem(id: string, is_active: boolean) {
  const supabase = await createServerSupabaseClient()
  const user = await getUser()
  if (!user) return

  await supabase
    .from('menu_items')
    .update({ is_active })
    .eq('id', id)
    .eq('business_id', user.id)

  revalidatePath('/panel/menu')
}
