import { test } from '@playwright/test'
import fs from 'fs'
import path from 'path'

const BASE = 'http://localhost:3333'
const DIR = path.join(process.cwd(), 'test-results', 'adim7')

test.beforeAll(() => {
  fs.mkdirSync(DIR, { recursive: true })
})

test('landing-page', async ({ page }) => {
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 20000 })
  await page.screenshot({ path: path.join(DIR, '01-landing-hero.png'), fullPage: false })
  // Scroll to loyalty card designer section
  await page.evaluate(() => window.scrollBy(0, 2800))
  await page.waitForTimeout(600)
  await page.screenshot({ path: path.join(DIR, '02-loyalty-designer-section.png') })
  // Scroll to pricing
  await page.evaluate(() => window.scrollBy(0, 1200))
  await page.waitForTimeout(600)
  await page.screenshot({ path: path.join(DIR, '03-pricing.png') })
  // Scroll to footer
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
  await page.waitForTimeout(400)
  await page.screenshot({ path: path.join(DIR, '04-footer.png') })
  // Light mode toggle
  const themeBtn = page.locator('.theme-toggle').first()
  if (await themeBtn.isVisible()) {
    await themeBtn.click()
    await page.waitForTimeout(400)
    await page.evaluate(() => window.scrollTo(0, 0))
    await page.screenshot({ path: path.join(DIR, '05-landing-light-mode.png') })
    await themeBtn.click() // toggle back to dark
  }
})

test('giris-page', async ({ page }) => {
  await page.goto(`${BASE}/giris`, { waitUntil: 'networkidle', timeout: 15000 })
  await page.screenshot({ path: path.join(DIR, '06-giris.png') })
})

test('gizlilik-politikasi', async ({ page }) => {
  await page.goto(`${BASE}/gizlilik-politikasi`, { waitUntil: 'networkidle', timeout: 15000 })
  await page.screenshot({ path: path.join(DIR, '07-gizlilik-politikasi.png'), fullPage: true })
})

test('kullanim-kosullari', async ({ page }) => {
  await page.goto(`${BASE}/kullanim-kosullari`, { waitUntil: 'networkidle', timeout: 15000 })
  await page.screenshot({ path: path.join(DIR, '08-kullanim-kosullari.png'), fullPage: true })
})

test('cerez-politikasi', async ({ page }) => {
  await page.goto(`${BASE}/cerez-politikasi`, { waitUntil: 'networkidle', timeout: 15000 })
  await page.screenshot({ path: path.join(DIR, '09-cerez-politikasi.png'), fullPage: true })
})
