import { NextRequest, NextResponse } from 'next/server'
import { isSuperAdmin } from '@/lib/auth/superadmin'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  if (!(await isSuperAdmin())) {
    return NextResponse.json({ error: 'Yetkisiz' }, { status: 403 })
  }

  const { businessId } = await req.json()
  const supabase = createServiceRoleClient()

  // İşletmenin e-postasını bul
  const { data: business } = await supabase
    .from('businesses')
    .select('email')
    .eq('id', businessId)
    .single()

  if (!business) return NextResponse.json({ error: 'İşletme bulunamadı' }, { status: 404 })

  // Magic link ile şifresiz giriş linki üret
  const { data: linkData, error: linkError } = await supabase.auth.admin.generateLink({
    type: 'magiclink',
    email: business.email,
  })

  if (linkError) return NextResponse.json({ error: linkError.message }, { status: 500 })

  return NextResponse.json({ url: linkData.properties?.action_link })
}
