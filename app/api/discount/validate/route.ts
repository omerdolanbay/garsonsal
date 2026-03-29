import { NextRequest, NextResponse } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  const supabase = createServiceRoleClient()
  const { code, plan } = await req.json()

  if (!code) return NextResponse.json({ error: 'Kod gerekli' }, { status: 400 })

  const { data } = await supabase
    .from('discount_codes')
    .select('*')
    .eq('code', code.toUpperCase())
    .eq('is_active', true)
    .single()

  if (!data) return NextResponse.json({ error: 'Geçersiz kod' }, { status: 404 })

  // Plan kontrolü
  if (data.applicable_plan && plan && data.applicable_plan !== plan) {
    return NextResponse.json({ error: `Bu kod yalnızca ${data.applicable_plan} planı için geçerli` }, { status: 400 })
  }

  // Tarih kontrolü
  if (data.valid_until && new Date(data.valid_until) < new Date()) {
    return NextResponse.json({ error: 'Kodun süresi dolmuş' }, { status: 400 })
  }

  // Kullanım limiti
  if (data.max_uses && data.used_count >= data.max_uses) {
    return NextResponse.json({ error: 'Kod kullanım limitine ulaştı' }, { status: 400 })
  }

  return NextResponse.json({
    valid: true,
    discountType: data.discount_type,
    discountValue: data.discount_value,
    label: data.discount_type === 'percent'
      ? `%${data.discount_value} indirim`
      : `$${data.discount_value} indirim`,
  })
}
