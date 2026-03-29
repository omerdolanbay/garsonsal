import { NextRequest, NextResponse } from 'next/server'
import { setSuperAdminSession } from '@/lib/auth/superadmin'

export async function POST(req: NextRequest) {
  const { secret } = await req.json()
  if (secret !== process.env.SUPERADMIN_SECRET) {
    return NextResponse.json({ error: 'Geçersiz şifre' }, { status: 401 })
  }
  await setSuperAdminSession()
  return NextResponse.json({ ok: true })
}
