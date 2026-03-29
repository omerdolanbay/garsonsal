import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'
import { updateGoogleWalletPass } from '@/lib/wallet/googleWallet'
import { pushAppleWalletUpdate } from '@/lib/wallet/appleWallet'

export async function POST(req: NextRequest) {
  const supabase = createServiceRoleClient()
  const { memberCode, businessId, multiplier = 1 } = await req.json()

  if (!memberCode || !businessId) {
    return NextResponse.json({ error: 'Eksik parametre' }, { status: 400 })
  }

  // Üyeyi bul
  const { data: member } = await supabase
    .from('loyalty_members')
    .select('*')
    .eq('member_code', memberCode.toUpperCase())
    .eq('business_id', businessId)
    .single()

  if (!member) return NextResponse.json({ error: 'Üye bulunamadı' }, { status: 404 })

  // Loyalty ayarları
  const { data: settings } = await supabase
    .from('loyalty_settings')
    .select('stamps_required')
    .eq('business_id', businessId)
    .single()

  const stampsRequired = settings?.stamps_required ?? 7
  const stampsToAdd = multiplier
  const newStampCount = member.stamp_count + stampsToAdd
  const newTotal = member.total_stamps_earned + stampsToAdd

  let rewardEarned = false
  let finalStampCount = newStampCount

  // Kart doldu mu?
  if (newStampCount >= stampsRequired) {
    rewardEarned = true
    finalStampCount = newStampCount - stampsRequired
  }

  // Güncelle
  const { error } = await supabase
    .from('loyalty_members')
    .update({
      stamp_count: finalStampCount,
      total_stamps_earned: newTotal,
    })
    .eq('id', member.id)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // İşlem kaydı
  await supabase.from('loyalty_transactions').insert({
    business_id: businessId,
    member_id: member.id,
    type: 'stamp',
    stamps_changed: stampsToAdd,
    note: multiplier > 1 ? `${multiplier}x kampanya` : null,
  })

  // Wallet push (arka planda, hataları yoksay)
  Promise.all([
    member.wallet_type === 'google'
      ? updateGoogleWalletPass(memberCode, finalStampCount).catch(console.error)
      : Promise.resolve(),
    member.wallet_type === 'apple' && member.push_token
      ? pushAppleWalletUpdate(member.push_token).catch(console.error)
      : Promise.resolve(),
  ])

  return NextResponse.json({
    success: true,
    memberName: member.name,
    stampCount: finalStampCount,
    stampsRequired,
    rewardEarned,
    totalEarned: newTotal,
  })
}
