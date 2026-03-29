import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const envFile = readFileSync(join(__dirname, '../.env.local'), 'utf8')
const env = Object.fromEntries(
  envFile.split('\n')
    .filter(l => l.includes('=') && !l.startsWith('#'))
    .map(l => [l.split('=')[0].trim(), l.split('=').slice(1).join('=').trim()])
)

const SUPABASE_URL = env['NEXT_PUBLIC_SUPABASE_URL']
const SERVICE_ROLE_KEY = env['SUPABASE_SERVICE_ROLE_KEY']
const DB_PASSWORD = env['SUPABASE_DB_PASSWORD']
const ACCESS_TOKEN = env['SUPABASE_ACCESS_TOKEN']
const PROJECT_REF = SUPABASE_URL.replace('https://', '').split('.')[0]

console.log(`\n=== Supabase Migration Runner ===`)
console.log(`Project: ${PROJECT_REF}\n`)

const migrations = [
  { file: '../supabase/migrations/001_initial_schema.sql', label: 'Migration 1: Schema' },
  { file: '../supabase/migrations/002_rls_policies.sql',   label: 'Migration 2: RLS' },
  { file: '../supabase/migrations/003_auth_setup.sql',     label: 'Migration 3: Auth Trigger' },
]

// --- Seçenek A: Management API (Personal Access Token) ---
async function runViaManagementAPI(sql, label) {
  const res = await fetch(
    `https://api.supabase.com/v1/projects/${PROJECT_REF}/database/query`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`,
      },
      body: JSON.stringify({ query: sql }),
    }
  )
  const text = await res.text()
  if (res.ok) {
    console.log(`✅ ${label} — tamamlandı`)
    return true
  }
  console.error(`❌ ${label} (${res.status}): ${text}`)
  return false
}

// --- Seçenek B: Doğrudan PostgreSQL bağlantısı ---
async function runViaPG(sql, label) {
  const { default: pg } = await import('pg')
  const client = new pg.Client({
    host: `db.${PROJECT_REF}.supabase.co`,
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: DB_PASSWORD,
    ssl: { rejectUnauthorized: false },
  })
  try {
    await client.connect()
    await client.query(sql)
    console.log(`✅ ${label} — tamamlandı`)
    return true
  } catch (e) {
    if (e.message.includes('already exists')) {
      console.log(`✅ ${label} — (zaten vardı, atlandı)`)
      return true
    }
    console.error(`❌ ${label}: ${e.message}`)
    return false
  } finally {
    await client.end()
  }
}

// Hangi yöntemi kullanacağımızı belirle
if (!ACCESS_TOKEN && !DB_PASSWORD) {
  console.error('❌ Kimlik bilgisi eksik!')
  console.log('\n.env.local dosyasına şunlardan birini ekleyin:\n')
  console.log('  Seçenek A: SUPABASE_ACCESS_TOKEN=sbp_xxxx')
  console.log('  → https://supabase.com/dashboard/account/tokens\n')
  console.log('  Seçenek B: SUPABASE_DB_PASSWORD=your-db-password')
  console.log('  → Supabase Dashboard > Settings > Database > Connection string\n')
  process.exit(1)
}

const runner = ACCESS_TOKEN ? runViaManagementAPI : runViaPG
const method = ACCESS_TOKEN ? 'Management API (Access Token)' : 'Doğrudan PostgreSQL (DB Password)'
console.log(`Yöntem: ${method}\n`)

for (const { file, label } of migrations) {
  const sql = readFileSync(join(__dirname, file), 'utf8')
  const ok = await runner(sql, label)
  if (!ok) {
    console.error('\nMigration başarısız, durduruluyor.')
    process.exit(1)
  }
}

console.log('\n🎉 Tüm migration\'lar başarıyla tamamlandı!')
console.log('Artık ADIM 2\'ye geçilebilir.\n')
