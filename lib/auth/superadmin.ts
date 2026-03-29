import { cookies } from 'next/headers'

const SUPERADMIN_SECRET = process.env.SUPERADMIN_SECRET ?? 'change-me'
const COOKIE_NAME = 'sa_session'

export async function isSuperAdmin(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  return token === SUPERADMIN_SECRET
}

export async function setSuperAdminSession() {
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, SUPERADMIN_SECRET, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 8, // 8 saat
    path: '/',
  })
}

export async function clearSuperAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}
