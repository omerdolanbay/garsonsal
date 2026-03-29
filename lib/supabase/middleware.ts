import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import type { Database } from '@/lib/supabase/types'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          )
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Panel rotaları — auth veya superadmin impersonation gerekli
  const impersonateId = request.cookies.get('sa_impersonate')?.value
  const saToken = request.cookies.get('sa_session')?.value
  const isImpersonating = !!(impersonateId && saToken === (process.env.SUPERADMIN_SECRET ?? 'change-me'))

  if (
    !user && !isImpersonating &&
    request.nextUrl.pathname.startsWith('/panel')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/giris'
    return NextResponse.redirect(url)
  }

  // Giriş/kayıt sayfaları — zaten giriş yapılmışsa panel'e yönlendir
  if (
    user &&
    (request.nextUrl.pathname === '/giris' ||
      request.nextUrl.pathname === '/kayit')
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/panel/orders'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
