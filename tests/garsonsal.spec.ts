import { test, expect } from '@playwright/test'
import fs from 'fs'
import path from 'path'

const BASE_URL = 'https://garsonsal.vercel.app'
const RESULTS_DIR = path.join(process.cwd(), 'test-results')
const SUPERADMIN_SECRET = 'Od158200$'

test.beforeAll(() => {
  if (!fs.existsSync(RESULTS_DIR)) fs.mkdirSync(RESULTS_DIR, { recursive: true })
})

// Yardımcı: Superadmin girişi + impersonation (UI üzerinden)
async function setupImpersonation(page: import('@playwright/test').Page) {
  // 1. Superadmin login sayfasına git
  await page.goto(`${BASE_URL}/admindolanbay/giris`, { waitUntil: 'networkidle' })
  await page.locator('input[type="password"]').fill(SUPERADMIN_SECRET)
  await page.locator('button[type="submit"]').click()
  await page.waitForURL(`${BASE_URL}/admindolanbay`, { timeout: 10000 })

  // 2. "Giriş Yap" butonuna tıkla (ilk işletme)
  const impersonateBtn = page.locator('button', { hasText: 'Giriş Yap' }).first()
  await impersonateBtn.click()
  await page.waitForURL(`${BASE_URL}/panel/**`, { timeout: 10000 })
}

// ─── 1. Ana Sayfa ─────────────────────────────────────────────────────────────
test('1. Ana sayfa açılıyor', async ({ page }) => {
  await page.goto(BASE_URL, { waitUntil: 'networkidle' })
  await page.screenshot({ path: path.join(RESULTS_DIR, '01-anasayfa.png'), fullPage: true })

  console.log('Title:', await page.title())
  console.log('URL:', page.url())
  await expect(page.locator('body')).toBeVisible()
  expect(page.url()).toContain('garsonsal')
})

// ─── 2. Kayıt Sayfası ─────────────────────────────────────────────────────────
test('2. /kayit sayfası form çalışıyor', async ({ page }) => {
  await page.goto(`${BASE_URL}/kayit`, { waitUntil: 'networkidle' })
  await page.screenshot({ path: path.join(RESULTS_DIR, '02-kayit-yuklendi.png'), fullPage: true })

  const emailInput = page.locator('input[type="email"], input[name="email"]').first()
  const passwordInput = page.locator('input[type="password"]').first()
  const submitBtn = page.locator('button[type="submit"]').first()

  await expect(emailInput).toBeVisible()
  await expect(passwordInput).toBeVisible()
  await expect(submitBtn).toBeVisible()

  await emailInput.fill('test@example.com')
  await passwordInput.fill('Test123!')
  await page.screenshot({ path: path.join(RESULTS_DIR, '02-kayit-form-dolu.png'), fullPage: true })
  console.log('Kayıt formu: OK')
})

// ─── 3. Giriş Sayfası ─────────────────────────────────────────────────────────
test('3. /giris sayfası yükleniyor', async ({ page }) => {
  await page.goto(`${BASE_URL}/giris`, { waitUntil: 'networkidle' })
  await page.screenshot({ path: path.join(RESULTS_DIR, '03-giris-yuklendi.png'), fullPage: true })

  await expect(page.locator('input[type="email"], input[name="email"]').first()).toBeVisible()
  await expect(page.locator('input[type="password"]').first()).toBeVisible()
  await expect(page.locator('button[type="submit"]').first()).toBeVisible()
  console.log('Giriş formu: OK')
})

// ─── 4. Superadmin Girişi ─────────────────────────────────────────────────────
test('4. Superadmin girişi çalışıyor', async ({ page }) => {
  await page.goto(`${BASE_URL}/admindolanbay/giris`, { waitUntil: 'networkidle' })
  await page.screenshot({ path: path.join(RESULTS_DIR, '04-superadmin-giris.png'), fullPage: true })

  await page.locator('input[type="password"]').fill(SUPERADMIN_SECRET)
  await page.locator('button[type="submit"]').click()
  await page.waitForURL(`${BASE_URL}/admindolanbay`, { timeout: 10000 })
  await page.screenshot({ path: path.join(RESULTS_DIR, '04-superadmin-panel.png'), fullPage: true })

  console.log('Superadmin URL:', page.url())
  expect(page.url()).toContain('/admindolanbay')
})

// ─── 5. Impersonation → Panel ─────────────────────────────────────────────────
test('5. Impersonation ile panel erişimi', async ({ page }) => {
  await setupImpersonation(page)

  const url = page.url()
  console.log('Impersonation sonrası URL:', url)
  expect(url).toContain('/panel')

  await page.screenshot({ path: path.join(RESULTS_DIR, '05-impersonation-panel.png'), fullPage: true })
})

// ─── 6. Impersonation Banner ──────────────────────────────────────────────────
test('6. İmpersonation banner görünüyor', async ({ page }) => {
  await setupImpersonation(page)
  await page.screenshot({ path: path.join(RESULTS_DIR, '06-banner.png'), fullPage: true })

  const banner = page.getByText('Süper Admin olarak görüntülüyorsunuz')
  await expect(banner).toBeVisible({ timeout: 8000 })

  const returnBtn = page.getByText("Süper Admin'e Dön")
  await expect(returnBtn).toBeVisible()
  console.log('Banner: OK')
})

// ─── 7. Panel Alt Sayfaları ───────────────────────────────────────────────────
test('7. Panel sayfaları yükleniyor', async ({ page }) => {
  await setupImpersonation(page)

  const panelPages = [
    { path: '/panel/orders', name: 'orders' },
    { path: '/panel/menu', name: 'menu' },
    { path: '/panel/loyalty', name: 'loyalty' },
    { path: '/panel/qr', name: 'qr' },
    { path: '/panel/settings', name: 'settings' },
  ]

  for (const p of panelPages) {
    await page.goto(`${BASE_URL}${p.path}`, { waitUntil: 'networkidle' })
    await page.screenshot({
      path: path.join(RESULTS_DIR, `07-panel-${p.name}.png`),
      fullPage: true,
    })
    const loaded = !page.url().includes('/giris')
    console.log(`${p.path}: ${loaded ? '✓ OK' : '✗ LOGIN\'a REDIRECT'}`)
    expect(loaded).toBe(true)
  }
})

// ─── 8. Süper Admin'e Dön butonu ─────────────────────────────────────────────
test("8. 'Süper Admin'e Dön' butonu çalışıyor", async ({ page }) => {
  await setupImpersonation(page)

  const returnBtn = page.getByText("Süper Admin'e Dön")
  await returnBtn.click()
  await page.waitForURL(`${BASE_URL}/admindolanbay`, { timeout: 10000 })
  await page.screenshot({ path: path.join(RESULTS_DIR, '08-geri-donus.png'), fullPage: true })

  console.log('Dönüş URL:', page.url())
  expect(page.url()).toContain('/admindolanbay')
})

// ─── 9. Oturumsuz panel erişimi engelleniyor ──────────────────────────────────
test('9. Oturumsuz panel erişimi /giris\'e yönlendiriyor', async ({ page }) => {
  await page.goto(`${BASE_URL}/panel/orders`, { waitUntil: 'networkidle' })
  await page.screenshot({ path: path.join(RESULTS_DIR, '09-yetkisiz-panel.png'), fullPage: true })

  console.log('Redirect URL:', page.url())
  expect(page.url()).toContain('/giris')
})
