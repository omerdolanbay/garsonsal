import jwt from 'jsonwebtoken'

const ISSUER_ID = process.env.GOOGLE_WALLET_ISSUER_ID ?? ''
const CLASS_ID = process.env.GOOGLE_WALLET_CLASS_ID ?? ''
const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'

interface PassData {
  memberCode: string
  memberName: string
  stampCount: number
  stampsRequired: number
  rewardDescription: string
  businessName: string
  cardBgColor: string
  cardTextColor: string
  logoUrl?: string | null
}

/** Google Wallet loyalty pass JWT oluşturur */
export async function createGoogleWalletPassUrl(data: PassData): Promise<string> {
  const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
  if (!credentialsJson || !ISSUER_ID || !CLASS_ID) {
    throw new Error('Google Wallet credentials eksik')
  }

  const credentials = JSON.parse(credentialsJson)

  const loyaltyObject = {
    id: `${ISSUER_ID}.${data.memberCode}`,
    classId: `${ISSUER_ID}.${CLASS_ID}`,
    state: 'ACTIVE',
    accountId: data.memberCode,
    accountName: data.memberName,
    loyaltyPoints: {
      balance: { int: data.stampCount },
      label: 'Pul',
    },
    textModulesData: [
      {
        header: 'Ödül',
        body: data.rewardDescription,
        id: 'reward',
      },
    ],
    barcode: {
      type: 'QR_CODE',
      value: data.memberCode,
    },
    hexBackgroundColor: data.cardBgColor,
  }

  const payload = {
    iss: credentials.client_email,
    aud: 'google',
    origins: [APP_URL],
    typ: 'savetowallet',
    payload: {
      loyaltyObjects: [loyaltyObject],
    },
  }

  const token = jwt.sign(payload, credentials.private_key, { algorithm: 'RS256' })
  return `https://pay.google.com/gp/v/save/${token}`
}

/** Google Wallet loyalty pass günceller (pul basınca) */
export async function updateGoogleWalletPass(memberCode: string, stampCount: number): Promise<void> {
  const credentialsJson = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON
  if (!credentialsJson || !ISSUER_ID) return

  const credentials = JSON.parse(credentialsJson)
  const { GoogleAuth } = await import('google-auth-library')

  const auth = new GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/wallet_object.issuer'],
  })

  const client = await auth.getClient()
  const objectId = `${ISSUER_ID}.${memberCode}`

  await client.request({
    url: `https://walletobjects.googleapis.com/walletobjects/v1/loyaltyObject/${objectId}`,
    method: 'PATCH',
    data: {
      loyaltyPoints: { balance: { int: stampCount } },
    },
  })
}
