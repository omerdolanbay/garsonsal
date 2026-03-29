'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

// Slugify yardımcısı
function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

export async function signUp(formData: FormData) {
  const supabase = await createServerSupabaseClient()

  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const rawSlug = formData.get('slug') as string
  const plan = (formData.get('plan') as string) || 'starter'
  const discountCode = (formData.get('discount_code') as string) || null

  const slug = rawSlug ? slugify(rawSlug) : slugify(name)

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        slug,
        plan,
        discount_code: discountCode,
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/panel/orders')
}

export async function signIn(formData: FormData) {
  const supabase = await createServerSupabaseClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/panel/orders')
}

export async function signOut() {
  const supabase = await createServerSupabaseClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/giris')
}

export async function getSession() {
  const supabase = await createServerSupabaseClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

export async function getUser() {
  const cookieStore = cookies()
  const impersonateId = cookieStore.get('sa_impersonate')?.value
  const saToken = cookieStore.get('sa_session')?.value
  if (impersonateId && saToken === (process.env.SUPERADMIN_SECRET ?? 'change-me')) {
    return { id: impersonateId } as { id: string }
  }

  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getBusiness() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return null

  const { data: business } = await supabase
    .from('businesses')
    .select('*')
    .eq('id', user.id)
    .single()

  return business
}
