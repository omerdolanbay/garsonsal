import { NextResponse } from 'next/server'
import { clearSuperAdminSession } from '@/lib/auth/superadmin'

export async function POST() {
  await clearSuperAdminSession()
  return NextResponse.redirect(new URL('/admindolanbay/giris', process.env.NEXT_PUBLIC_APP_URL!))
}
