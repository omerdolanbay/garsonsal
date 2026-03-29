import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { generateMemberCode } from '@/lib/wallet/memberCode'
import { createGoogleWalletPassUrl } from '@/lib/wallet/googleWallet'

export async function POST(req: NextRequest) {
  const supabase = createServiceRoleClient()
  const { businessId, name, phone, email } = await req.json()

  if (!businessId || !name) {
    return NextResponse.json({ error: 'Ad ve işletme gerekli' }, { status: 400 })
  }

  // Benzersiz üye kodu üret
  let memberCode = generateMemberCode()
  let attempts = 0
  while (attempts < 10) {
    const { data } = await supabase
      .from('loyalty_members')
      .select('id')
      .eq('member_code', memberCode)
      .single()
    if (!data) break
    memberCode = generateMemberCode()
    attempts++
  }

  // Üyeyi kaydet
  const { data: member, error } = await supabase
    .from('loyalty_members')
    .insert({ business_id: businessId, name, phone, email, member_code: memberCode })
    .select('id, member_code')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Loyalty ayarlarını al
  const { data: settings } = await supabase
    .from('loyalty_settings')
    .select('*')
    .eq('business_id', businessId)
    .single()

  const { data: business } = await supabase
    .from('businesses')
    .select('name, brand_primary_color, brand_secondary_color, logo_url')
    .eq('id', businessId)
    .single()

  // Google Wallet URL dene
  let googleWalletUrl: string | undefined
  let appleWalletAvailable = false

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON && process.env.GOOGLE_WALLET_ISSUER_ID) {
    try {
      googleWalletUrl = await createGoogleWalletPassUrl({
        memberCode,
        memberName: name,
        stampCount: 0,
        stampsRequired: settings?.stamps_required ?? 7,
        rewardDescription: settings?.reward_description ?? '1 Bedava İçecek',
        businessName: business?.name ?? '',
        cardBgColor: settings?.card_bg_color ?? '#4A2C2A',
        cardTextColor: settings?.card_text_color ?? '#F5F0E8',
        logoUrl: business?.logo_url,
      })
    } catch (e) {
      console.error('Google Wallet URL oluşturulamadı:', e)
    }
  }

  if (process.env.APPLE_TEAM_ID && process.env.APPLE_CERT_PEM) {
    appleWalletAvailable = true
  }

  return NextResponse.json({
    memberCode: member.member_code,
    googleWalletUrl,
    appleWalletAvailable,
  })
}
