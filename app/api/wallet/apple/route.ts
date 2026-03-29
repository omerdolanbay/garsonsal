import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { createAppleWalletPass } from '@/lib/wallet/appleWallet'

export async function POST(req: NextRequest) {
  const supabase = createServiceRoleClient()
  const { memberCode, businessId } = await req.json()

  if (!memberCode || !businessId) {
    return NextResponse.json({ error: 'Eksik parametre' }, { status: 400 })
  }

  const [{ data: member }, { data: settings }, { data: business }] = await Promise.all([
    supabase.from('loyalty_members').select('*').eq('member_code', memberCode).eq('business_id', businessId).single(),
    supabase.from('loyalty_settings').select('*').eq('business_id', businessId).single(),
    supabase.from('businesses').select('name, logo_url').eq('id', businessId).single(),
  ])

  if (!member) return NextResponse.json({ error: 'Üye bulunamadı' }, { status: 404 })

  try {
    const passBuffer = await createAppleWalletPass({
      memberCode,
      memberName: member.name,
      stampCount: member.stamp_count,
      stampsRequired: settings?.stamps_required ?? 7,
      rewardDescription: settings?.reward_description ?? '1 Bedava İçecek',
      businessName: business?.name ?? '',
      cardBgColor: settings?.card_bg_color ?? '#4A2C2A',
      cardTextColor: settings?.card_text_color ?? '#F5F0E8',
      logoUrl: business?.logo_url,
    })

    // wallet_type güncelle
    await supabase.from('loyalty_members').update({ wallet_type: 'apple' }).eq('id', member.id)

    return new NextResponse(passBuffer as unknown as BodyInit, {
      headers: {
        'Content-Type': 'application/vnd.apple.pkpass',
        'Content-Disposition': `attachment; filename="${memberCode}.pkpass"`,
      },
    })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Pass oluşturulamadı'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
