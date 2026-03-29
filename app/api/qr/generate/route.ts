import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { getUser } from '@/lib/auth/actions'
import QRCode from 'qrcode'

export async function POST(req: NextRequest) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: 'Yetkisiz' }, { status: 401 })

  const { tableCount } = await req.json()
  if (!tableCount || tableCount < 1 || tableCount > 100) {
    return NextResponse.json({ error: 'Geçersiz masa sayısı (1-100)' }, { status: 400 })
  }

  const supabase = await createServerSupabaseClient()
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

  // İşletme slug'ını al
  const { data: business } = await supabase
    .from('businesses')
    .select('slug')
    .eq('id', user.id)
    .single()

  if (!business) return NextResponse.json({ error: 'İşletme bulunamadı' }, { status: 404 })

  // Mevcut masaları sil, yenilerini oluştur
  await supabase.from('tables').delete().eq('business_id', user.id)

  const tableRows = Array.from({ length: tableCount }, (_, i) => ({
    business_id: user.id,
    table_number: i + 1,
  }))

  const { data: tables, error } = await supabase
    .from('tables')
    .insert(tableRows)
    .select()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Her masa için QR data URL üret
  const qrData = await Promise.all(
    (tables ?? []).map(async (t) => {
      const url = `${appUrl}/menu/${business.slug}/${t.table_number}?token=${t.qr_token}`
      const dataUrl = await QRCode.toDataURL(url, {
        width: 300,
        margin: 2,
        color: { dark: '#4A2C2A', light: '#FFFFFF' },
      })
      return { tableNumber: t.table_number, qrToken: t.qr_token, url, dataUrl }
    })
  )

  return NextResponse.json({ tables: qrData })
}
