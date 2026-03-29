/**
 * Apple Wallet (.pkpass) üretimi — passkit-generator kullanır
 * Gerekli env vars:
 *   APPLE_TEAM_ID, APPLE_PASS_TYPE_ID
 *   APPLE_CERT_PEM, APPLE_KEY_PEM, APPLE_WWDR_PEM  (base64 veya PEM string)
 */

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

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `rgb(${r},${g},${b})`
}

export async function createAppleWalletPass(data: PassData): Promise<Buffer> {
  const TEAM_ID = process.env.APPLE_TEAM_ID
  const PASS_TYPE_ID = process.env.APPLE_PASS_TYPE_ID
  const CERT_PEM = process.env.APPLE_CERT_PEM
  const KEY_PEM = process.env.APPLE_KEY_PEM
  const WWDR_PEM = process.env.APPLE_WWDR_PEM

  if (!TEAM_ID || !PASS_TYPE_ID || !CERT_PEM || !KEY_PEM || !WWDR_PEM) {
    throw new Error('Apple Wallet sertifikaları eksik (.env.local: APPLE_TEAM_ID, APPLE_PASS_TYPE_ID, APPLE_CERT_PEM, APPLE_KEY_PEM, APPLE_WWDR_PEM)')
  }

  const { PKPass } = await import('passkit-generator')

  const pass = new PKPass(
    {},
    {
      signerCert: Buffer.from(CERT_PEM),
      signerKey: Buffer.from(KEY_PEM),
      wwdr: Buffer.from(WWDR_PEM),
    },
    {
      formatVersion: 1,
      passTypeIdentifier: PASS_TYPE_ID,
      serialNumber: data.memberCode,
      teamIdentifier: TEAM_ID,
      organizationName: data.businessName,
      description: `${data.businessName} Sadakat Kartı`,
      backgroundColor: hexToRgb(data.cardBgColor),
      foregroundColor: hexToRgb(data.cardTextColor),
      webServiceURL: `${process.env.NEXT_PUBLIC_APP_URL}/api/wallet/apple/update`,
      authenticationToken: data.memberCode,
    }
  )

  pass.type = 'storeCard'
  pass.primaryFields.push({ key: 'stamps', label: 'Pul', value: `${data.stampCount}/${data.stampsRequired}` })
  pass.secondaryFields.push({ key: 'reward', label: 'Ödül', value: data.rewardDescription })
  pass.auxiliaryFields.push({ key: 'name', label: 'Üye', value: data.memberName })
  pass.backFields.push({ key: 'code', label: 'Üye Kodu', value: data.memberCode })

  pass.setBarcodes({
    message: data.memberCode,
    format: 'PKBarcodeFormatQR',
    messageEncoding: 'iso-8859-1',
  })

  const buffer = pass.getAsBuffer()
  return buffer as unknown as Buffer
}

/** Apple Push Notification ile kartı güncelle */
export async function pushAppleWalletUpdate(pushToken: string): Promise<void> {
  const PUSH_KEY = process.env.APPLE_PUSH_KEY
  const PASS_TYPE_ID = process.env.APPLE_PASS_TYPE_ID

  if (!PUSH_KEY || !PASS_TYPE_ID || !pushToken) return

  const http2 = await import('http2')
  const client = http2.connect('https://api.push.apple.com')

  return new Promise((resolve) => {
    const req = client.request({
      ':method': 'POST',
      ':path': `/3/device/${pushToken}`,
      'apns-topic': PASS_TYPE_ID,
      'apns-push-type': 'background',
      'authorization': `bearer ${PUSH_KEY}`,
    })
    req.on('response', () => { client.close(); resolve() })
    req.on('error', () => { client.close(); resolve() })
    req.end('{}')
  })
}
