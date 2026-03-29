'use client'

import { useState } from 'react'
import { motion, AnimatePresence, type Variants } from 'framer-motion'
import Link from 'next/link'
import Logo from '@/components/Logo'
import { useTheme } from '@/components/ThemeProvider'

// ─── Color tokens ──────────────────────────────────────────────────────────────
const C = {
  c1: '#001f3f', c2: '#003d6b', c3: '#0077b6', c4: '#00b4d8', c5: '#ffffff',
  glass: 'rgba(0,61,107,0.38)',
  glassB: 'rgba(0,180,216,0.14)',
  muted: 'rgba(255,255,255,0.55)',
  faint: 'rgba(255,255,255,0.3)',
  grad: 'linear-gradient(135deg,#0077b6,#00b4d8)',
  gradH: 'linear-gradient(90deg,#0077b6,#00b4d8)',
}

// ─── i18n ─────────────────────────────────────────────────────────────────────
const content = {
  TR: {
    nav: { features: 'Özellikler', pricing: 'Fiyatlandırma', about: 'Hakkımızda', faq: 'SSS', contact: 'İletişim', login: 'Giriş Yap', trial: 'Ücretsiz Dene' },
    hero: {
      badge: '✦ Restoran & Kafe Yönetiminde Yeni Nesil',
      title1: 'Garsonunuza Gerek', title2: 'Kalmadan Sipariş Alın',
      subtitle: 'QR kod ile masadan sipariş, dijital sadakat kartı ve gerçek zamanlı panel. Tek platformda.',
      cta1: '7 Gün Ücretsiz Dene →', cta2: 'Demo İzle',
      proof: '⭐ 500+ işletme tarafından kullanılıyor',
      n1: '🔔 Yeni Sipariş — Masa 7', n2: '✅ 23 Sipariş Bugün',
    },
    steps: { title: '4 Adımda Başlayın', items: [
      { num: '01', title: 'QR Oluştur', desc: 'Masalarınız için saniyeler içinde QR kod üretin' },
      { num: '02', title: 'Menünüzü Yükleyin', desc: 'Excel ile ya da manuel olarak menünüzü ekleyin' },
      { num: '03', title: 'Sipariş Alın', desc: "Müşteriler QR okutarak sipariş verir, panel'e anında düşer" },
      { num: '04', title: 'Büyüyün', desc: 'Sadakat programı ile müşterilerinizi geri getirin' },
    ]},
    features: { title: 'Her Şey Tek Platformda', items: [
      { icon: '📱', title: 'QR ile Sipariş', desc: 'Müşteri uygulamasız, direkt tarayıcıdan sipariş verir' },
      { icon: '⚡', title: 'Gerçek Zamanlı Panel', desc: 'Sipariş anında panelde görünür, gecikme sıfır' },
      { icon: '🎁', title: 'Dijital Sadakat Kartı', desc: 'Apple & Google Wallet entegrasyonu, pul sistemi' },
      { icon: '🔔', title: 'Garson Çağırma', desc: 'Tek tuşla garson çağrısı, masa numarası ile' },
      { icon: '🎨', title: 'Marka Özelleştirme', desc: 'Logo, renkler, kart tasarımı tamamen size özel' },
      { icon: '📊', title: 'Analitik & CRM', desc: 'Müşteri verileri, satış raporları, kampanya takibi' },
    ]},
    stats: { title: 'Rakamlar Konuşuyor', items: [
      { value: '%40', label: 'Daha az sipariş hatası' },
      { value: '3x', label: 'Daha hızlı sipariş alma' },
      { value: '%68', label: 'Loyalty üye erişim oranı' },
      { value: '7dk', label: 'Ortalama kurulum süresi' },
    ]},
    showcase: { title: 'Paneli Görün', tabs: ['Sipariş Paneli', 'Menü Yönetimi', 'Loyalty Paneli'] },
    pricing: {
      title: 'Şeffaf Fiyatlandırma',
      subtitle: 'Kredi kartı gerekmez. 7 gün ücretsiz deneyin.',
      monthly: 'Aylık', yearly: 'Yıllık', yearlyBadge: '%17 indirim',
      plans: [
        { name: 'Starter', monthly: '$89/ay', yearly: '$890/yıl', features: ['1 şube', '15 masaya kadar', 'Sipariş paneli + garson çağırma', 'Menü yönetimi', 'Loyalty (500 üye)', '7 gün ücretsiz deneme'], cta: 'Başlayın →', popular: false },
        { name: 'Growth', monthly: '$119/ay', yearly: '$1.190/yıl', features: ['3 şube', 'Sınırsız masa', "Starter'daki her şey", 'Loyalty (5.000 üye)', 'Push bildirim + kampanya', 'Müşteri CRM + analitik'], cta: 'Başlayın →', popular: true },
        { name: 'Pro', monthly: '$189/ay', yearly: '$1.890/yıl', features: ['Sınırsız şube', 'Sınırsız her şey', 'White-label', 'Öncelikli destek'], cta: 'İletişime Geçin', popular: false },
      ],
    },
    faq: { title: 'Sık Sorulan Sorular', items: [
      { q: 'Müşterilerin uygulama indirmesi gerekiyor mu?', a: 'Hayır. QR kodu tarayan müşteri direkt tarayıcısında menüyü görür. İndirme, kayıt, şifre yok.' },
      { q: 'QR kodları nasıl alıyorum?', a: "Panelden masa sayınızı girin, sistem QR'ları otomatik üretir. PDF olarak indirip yazıcıdan çıktı alır, masalarınıza koyarsınız." },
      { q: 'Menümü nasıl yüklerim?', a: 'Excel/CSV şablonumuzu indirin, doldurun, yükleyin. Ya da panel üzerinden tek tek ekleyebilirsiniz.' },
      { q: 'Apple/Google Wallet entegrasyonu nasıl çalışıyor?', a: "Müşteri loyalty sayfanızdaki QR'ı okutup bilgilerini girer. Kart otomatik oluşturulur ve telefonuna eklenir. Siz pul bastıkça kart gerçek zamanlı güncellenir." },
      { q: 'Birden fazla şubem var, destekliyor musunuz?', a: 'Evet. Growth planında 3, Pro planında sınırsız şube. Her şubenin kendi paneli ve QR\'ları ayrıdır.' },
      { q: 'Ödeme sistemi var mı?', a: 'Şu an müşteri kasada ödeme yapıyor. Online ödeme yol haritamızda.' },
      { q: 'Verilerimi kaybeder miyim? Güvenli mi?', a: 'Verileriniz Supabase altyapısında şifreli olarak saklanır. Üçüncü taraflarla paylaşılmaz.' },
      { q: '7 günlük denemeyi nasıl başlatırım?', a: '"Ücretsiz Dene" butonuna tıklayın. Kredi kartı gerekmez.' },
      { q: 'İndirim kodum var, nasıl kullanırım?', a: 'Kayıt sırasında "İndirim Kodu" alanına kodunuzu girin, indirim otomatik uygulanır.' },
      { q: 'Destek alabilir miyim?', a: 'Tüm planlarda e-posta desteği. Pro planında öncelikli destek ve kurulum yardımı.' },
    ]},
    about: { title: 'Hakkımızda', text: 'Garsonsal, kafe ve restoranların daha az personelle daha verimli çalışması için tasarlandı. QR sipariş, dijital sadakat ve gerçek zamanlı yönetimi tek platformda sunuyoruz. Amacımız; teknoloji ile operasyonel karmaşıklığı sıfıra indirmek.' },
    contact: { title: 'İletişime Geçin', subtitle: 'Genellikle 24 saat içinde yanıt veririz', name: 'Ad Soyad', email: 'E-posta', business: 'İşletme Adı', message: 'Mesaj', send: 'Gönder' },
    footer: {
      desc: 'Kafe ve restoranlar için modern sipariş ve sadakat platformu.',
      product: 'Ürün', company: 'Şirket', legal: 'Yasal',
      productLinks: ['Özellikler', 'Fiyatlandırma', 'Demo', 'Güncellemeler'],
      companyLinks: ['Hakkımızda', 'İletişim', 'Kariyer'],
      legalLinks: ['Hizmet Kesintisi & İade Politikası', 'Gizlilik Politikası', 'Kullanım Koşulları', 'Çerez Politikası'],
      copy: '© 2025 Garsonsal. Tüm hakları saklıdır.',
      policy: 'Garsonsal, kesintisiz hizmet sunmayı hedefler; ancak beklenmedik teknik sorunlar veya olağanüstü durumlar nedeniyle hizmetin sonlandırılması halinde, ödenen abonelik ücretleri iade edilemez niteliktedir.',
    },
  },
  EN: {
    nav: { features: 'Features', pricing: 'Pricing', about: 'About', faq: 'FAQ', contact: 'Contact', login: 'Sign In', trial: 'Free Trial' },
    hero: {
      badge: '✦ Next Generation Restaurant & Cafe Management',
      title1: 'Take Orders Without', title2: 'Needing a Waiter',
      subtitle: 'Table ordering via QR, digital loyalty cards, and real-time dashboard. All in one platform.',
      cta1: '7-Day Free Trial →', cta2: 'Watch Demo',
      proof: '⭐ Used by 500+ businesses',
      n1: '🔔 New Order — Table 7', n2: '✅ 23 Orders Today',
    },
    steps: { title: 'Get Started in 4 Steps', items: [
      { num: '01', title: 'Create QR', desc: 'Generate QR codes for your tables in seconds' },
      { num: '02', title: 'Upload Menu', desc: 'Add your menu via Excel or manually' },
      { num: '03', title: 'Receive Orders', desc: 'Customers scan QR and order, it instantly appears in your panel' },
      { num: '04', title: 'Grow', desc: 'Bring customers back with your loyalty program' },
    ]},
    features: { title: 'Everything in One Platform', items: [
      { icon: '📱', title: 'QR Ordering', desc: 'Customers order directly from browser, no app needed' },
      { icon: '⚡', title: 'Real-time Dashboard', desc: 'Orders appear instantly in your panel, zero latency' },
      { icon: '🎁', title: 'Digital Loyalty Card', desc: 'Apple & Google Wallet integration, stamp system' },
      { icon: '🔔', title: 'Waiter Call', desc: 'One-tap waiter call with table number' },
      { icon: '🎨', title: 'Brand Customization', desc: 'Logo, colors, card design fully customized for you' },
      { icon: '📊', title: 'Analytics & CRM', desc: 'Customer data, sales reports, campaign tracking' },
    ]},
    stats: { title: 'Numbers Speak', items: [
      { value: '40%', label: 'Fewer order errors' },
      { value: '3x', label: 'Faster order taking' },
      { value: '68%', label: 'Loyalty member reach' },
      { value: '7min', label: 'Average setup time' },
    ]},
    showcase: { title: 'See the Dashboard', tabs: ['Order Panel', 'Menu Management', 'Loyalty Panel'] },
    pricing: {
      title: 'Transparent Pricing', subtitle: 'No credit card required. Try free for 7 days.',
      monthly: 'Monthly', yearly: 'Yearly', yearlyBadge: '17% off',
      plans: [
        { name: 'Starter', monthly: '$89/mo', yearly: '$890/yr', features: ['1 branch', 'Up to 15 tables', 'Order panel + waiter call', 'Menu management', 'Loyalty (500 members)', '7-day free trial'], cta: 'Get Started →', popular: false },
        { name: 'Growth', monthly: '$119/mo', yearly: '$1,190/yr', features: ['3 branches', 'Unlimited tables', 'Everything in Starter', 'Loyalty (5,000 members)', 'Push notifications + campaigns', 'Customer CRM + analytics'], cta: 'Get Started →', popular: true },
        { name: 'Pro', monthly: '$189/mo', yearly: '$1,890/yr', features: ['Unlimited branches', 'Unlimited everything', 'White-label', 'Priority support'], cta: 'Contact Us', popular: false },
      ],
    },
    faq: { title: 'Frequently Asked Questions', items: [
      { q: 'Do customers need to download an app?', a: 'No. Customers see the menu directly in their browser. No download, registration, or password.' },
      { q: 'How do I get QR codes?', a: 'Enter your table count in the panel, the system generates QRs automatically. Download as PDF and print.' },
      { q: 'How do I upload my menu?', a: 'Download our Excel/CSV template, fill it in, and upload. Or add items one by one through the panel.' },
      { q: 'How does Apple/Google Wallet integration work?', a: 'The customer scans the QR on your loyalty page. The card is created and added to their phone, updating in real-time as you stamp.' },
      { q: 'Do you support multiple branches?', a: 'Yes. Growth plan: 3 branches, Pro plan: unlimited. Each branch has its own panel and QRs.' },
      { q: 'Is there a payment system?', a: 'Currently customers pay at the register. Online payment is on our roadmap.' },
      { q: 'Is my data safe?', a: 'Data is stored encrypted in Supabase infrastructure. Not shared with third parties.' },
      { q: 'How do I start the 7-day trial?', a: 'Click "Free Trial". No credit card required.' },
      { q: 'I have a discount code, how do I use it?', a: 'Enter your code in the "Discount Code" field during registration.' },
      { q: 'Can I get support?', a: 'Email support on all plans. Priority support + setup help on Pro.' },
    ]},
    about: { title: 'About Us', text: 'Garsonsal is built to help cafes and restaurants operate more efficiently with less staff. We bring QR ordering, digital loyalty, and real-time management into one platform.' },
    contact: { title: 'Get in Touch', subtitle: 'We usually reply within 24 hours', name: 'Full Name', email: 'Email', business: 'Business Name', message: 'Message', send: 'Send' },
    footer: {
      desc: 'Modern ordering and loyalty platform for cafes and restaurants.',
      product: 'Product', company: 'Company', legal: 'Legal',
      productLinks: ['Features', 'Pricing', 'Demo', 'Updates'],
      companyLinks: ['About', 'Contact', 'Careers'],
      legalLinks: ['Service & Refund Policy', 'Privacy Policy', 'Terms of Service', 'Cookie Policy'],
      copy: '© 2025 Garsonsal. All rights reserved.',
      policy: 'Garsonsal aims to provide uninterrupted service; however, in the event of service termination due to unexpected issues, paid subscription fees are non-refundable.',
    },
  },
}

// ─── Animations ───────────────────────────────────────────────────────────────
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.25, 0.46, 0.45, 0.94] } },
}
const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
}

// ─── Mockups ─────────────────────────────────────────────────────────────────
function OrderPanelMockup() {
  const orders = [
    { table: 'Masa 3', item: 'Latte, Kruvasan', status: 'Yeni', color: C.c4 },
    { table: 'Masa 7', item: 'Espresso x2', status: 'Hazırlanıyor', color: C.c3 },
    { table: 'Masa 12', item: 'Çay, Kek', status: 'Teslim', color: '#4ade80' },
  ]
  return (
    <div className="space-y-2.5">
      <div className="flex items-center gap-2 mb-4">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="text-xs" style={{ color: C.muted }}>Canlı — 3 aktif sipariş</span>
      </div>
      {orders.map((o, i) => (
        <div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-xl"
          style={{ background: C.glass, border: `1px solid ${C.glassB}` }}>
          <div>
            <p className="text-sm font-medium text-white">{o.table}</p>
            <p className="text-xs" style={{ color: C.muted }}>{o.item}</p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full font-medium"
            style={{ background: o.color + '22', color: o.color, border: `1px solid ${o.color}44` }}>
            {o.status}
          </span>
        </div>
      ))}
    </div>
  )
}

function MenuMockup() {
  const items = [
    { name: 'Latte', price: '₺65', cat: 'Kahveler' },
    { name: 'Kruvasan', price: '₺45', cat: 'Pastane' },
    { name: 'Smoothie', price: '₺85', cat: 'İçecekler' },
  ]
  return (
    <div className="space-y-3">
      <div className="flex gap-2 mb-3 flex-wrap">
        {['Kahveler', 'Pastane', 'İçecekler'].map((c, i) => (
          <span key={i} className="text-xs px-3 py-1 rounded-full"
            style={{ background: i === 0 ? 'rgba(0,173,243,0.2)' : C.glass, color: i === 0 ? C.c4 : C.muted, border: `1px solid ${C.glassB}` }}>
            {c}
          </span>
        ))}
      </div>
      {items.map((item, i) => (
        <div key={i} className="flex items-center justify-between px-3 py-2.5 rounded-xl"
          style={{ background: C.glass, border: `1px solid ${C.glassB}` }}>
          <div>
            <p className="text-sm font-medium text-white">{item.name}</p>
            <p className="text-xs" style={{ color: C.muted }}>{item.cat}</p>
          </div>
          <span className="text-sm font-semibold" style={{ color: C.c4 }}>{item.price}</span>
        </div>
      ))}
    </div>
  )
}

function LoyaltyMockup() {
  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl text-center"
        style={{ background: `linear-gradient(135deg, rgba(0,110,163,0.2), rgba(0,173,243,0.12))`, border: `1px solid rgba(0,173,243,0.25)` }}>
        <p className="text-white font-bold text-lg mb-3">Kafe İstanbul</p>
        <div className="flex justify-center gap-1.5 my-3 flex-wrap">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="w-5 h-5 rounded-full"
              style={{ background: i < 7 ? C.grad : 'rgba(255,255,255,0.08)', boxShadow: i < 7 ? `0 0 6px ${C.c4}66` : 'none' }} />
          ))}
        </div>
        <p className="text-xs" style={{ color: C.muted }}>7 / 10 pul — 3 pul kaldı</p>
      </div>
      <p className="text-xs text-center" style={{ color: C.muted }}>342 üye · Bu ay +28 yeni</p>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const [lang, setLang] = useState<'TR' | 'EN'>('TR')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [billingYearly, setBillingYearly] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [showcaseTab, setShowcaseTab] = useState(0)
  const [policyOpen, setPolicyOpen] = useState(false)
  const [contactSent, setContactSent] = useState(false)
  const { theme, toggle: toggleTheme } = useTheme()
  // Loyalty card designer state
  const [cardBg, setCardBg] = useState('#2C3E6B')
  const [cardTextColor, setCardTextColor] = useState('#F5F0E8')
  const [cardCompany, setCardCompany] = useState('')
  const [stampIcon, setStampIcon] = useState('☕')
  const [stampCount, setStampCount] = useState(7)
  const [reward, setReward] = useState(lang === 'TR' ? '1 Bedava Kahve' : '1 Free Coffee')
  const CARD_COLORS_LP = ['#2C3E6B', '#4A2C2A', '#C17F4A', '#4A7C59', '#2C2C2C', '#6B2737', '#5B4B8A', '#2A6B6B']
  const STAMP_ICONS_LP = ['☕', '⭐', '❤️', '👑', '💎']

  const t = content[lang]
  const navLinks = [
    { label: t.nav.features, href: '#ozellikler' },
    { label: t.nav.pricing, href: '#fiyatlandirma' },
    { label: t.nav.about, href: '#hakkimizda' },
    { label: t.nav.faq, href: '#sss' },
    { label: t.nav.contact, href: '#iletisim' },
  ]

  return (
    <div style={{ background: 'var(--color-bg)', minHeight: '100vh' }}>

      {/* ═══ NAVBAR ═══════════════════════════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50"
        style={{ backdropFilter: 'blur(20px)', background: 'var(--color-nav-bg)', borderBottom: `1px solid ${C.glassB}` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <a href="#"><Logo variant="navbar" /></a>

            {/* Desktop links */}
            <div className="hidden lg:flex items-center gap-7">
              {navLinks.map(l => (
                <a key={l.label} href={l.href} className="nav-link font-medium">{l.label}</a>
              ))}
            </div>

            {/* Desktop right */}
            <div className="hidden lg:flex items-center gap-2.5">
              <button onClick={() => setLang(lang === 'TR' ? 'EN' : 'TR')}
                className="ghost-btn text-xs px-3 py-1.5 rounded-lg font-medium cursor-pointer">
                {lang === 'TR' ? '🇺🇸 EN' : '🇹🇷 TR'}
              </button>
              <button onClick={toggleTheme} className="theme-toggle" title={theme === 'dark' ? 'Açık Mod' : 'Koyu Mod'}>
                {theme === 'dark'
                  ? <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                  : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                }
              </button>
              <Link href="/giris" className="ghost-btn text-sm px-4 py-2 rounded-xl font-medium">{t.nav.login}</Link>
              <Link href="/kayit" className="gradient-btn text-sm px-4 py-2 rounded-xl">{t.nav.trial}</Link>
            </div>

            {/* Hamburger */}
            <button className="lg:hidden ghost-btn p-2 rounded-xl" onClick={() => setMobileOpen(!mobileOpen)}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                {mobileOpen
                  ? <><line x1="4" y1="4" x2="16" y2="16" stroke="#fff" strokeWidth="2" strokeLinecap="round" /><line x1="16" y1="4" x2="4" y2="16" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></>
                  : <><line x1="3" y1="5" x2="17" y2="5" stroke="#fff" strokeWidth="2" strokeLinecap="round" /><line x1="3" y1="10" x2="17" y2="10" stroke="#fff" strokeWidth="2" strokeLinecap="round" /><line x1="3" y1="15" x2="17" y2="15" stroke="#fff" strokeWidth="2" strokeLinecap="round" /></>}
              </svg>
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="lg:hidden overflow-hidden" style={{ background: 'rgba(0,19,38,0.97)', borderBottom: `1px solid ${C.glassB}` }}>
              <div className="max-w-7xl mx-auto px-4 py-4 space-y-1">
                {navLinks.map(l => (
                  <a key={l.label} href={l.href} onClick={() => setMobileOpen(false)}
                    className="block py-2.5 px-3 rounded-lg text-sm nav-link hover:bg-white/5">{l.label}</a>
                ))}
                <div className="flex gap-2 pt-3 border-t mt-3" style={{ borderColor: C.glassB }}>
                  <button onClick={() => { setLang(lang === 'TR' ? 'EN' : 'TR'); setMobileOpen(false) }} className="ghost-btn text-xs px-3 py-2 rounded-lg">
                    {lang === 'TR' ? '🇺🇸 EN' : '🇹🇷 TR'}
                  </button>
                  <Link href="/giris" onClick={() => setMobileOpen(false)} className="ghost-btn text-sm px-4 py-2 rounded-xl flex-1 text-center">{t.nav.login}</Link>
                  <Link href="/kayit" onClick={() => setMobileOpen(false)} className="gradient-btn text-sm px-4 py-2 rounded-xl flex-1 text-center">{t.nav.trial}</Link>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ═══ HERO ═════════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        <div className="orb w-[560px] h-[560px] -top-20 left-[10%]" style={{ background: 'rgba(0,110,163,0.28)' }} />
        <div className="orb w-[400px] h-[400px] bottom-0 right-[5%]" style={{ background: 'rgba(0,173,243,0.14)' }} />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <motion.div initial="hidden" animate="visible" variants={stagger}>
              <motion.div variants={fadeUp}>
                <span className="badge mb-6">{t.hero.badge}</span>
              </motion.div>
              <motion.h1 variants={fadeUp} className="section-title mb-6">
                {t.hero.title1}<br />
                <span style={{ background: C.gradH, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  {t.hero.title2}
                </span>
              </motion.h1>
              <motion.p variants={fadeUp} className="text-lg mb-8 leading-relaxed max-w-lg" style={{ color: C.muted }}>
                {t.hero.subtitle}
              </motion.p>
              <motion.div variants={fadeUp} className="flex flex-wrap gap-3 mb-8">
                <Link href="/kayit" className="gradient-btn text-sm px-6 py-3 rounded-xl">{t.hero.cta1}</Link>
                <a href="#panel" className="ghost-btn text-sm px-6 py-3 rounded-xl font-medium">{t.hero.cta2}</a>
              </motion.div>
              <motion.p variants={fadeUp} className="text-sm" style={{ color: C.faint }}>{t.hero.proof}</motion.p>
            </motion.div>

            {/* Right — 3D dashboard mockup */}
            <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.75, delay: 0.2 }}
              className="relative hidden lg:block"
              style={{ perspective: '1100px' }}>
              {/* Ambient glow */}
              <div className="absolute inset-0 rounded-3xl"
                style={{ background: `radial-gradient(ellipse at 50% 80%, rgba(0,110,163,0.3) 0%, transparent 70%)`, filter: 'blur(32px)' }} />

              {/* 3D card */}
              <div className="glass-elevated p-6 relative"
                style={{ transform: 'rotateX(8deg) rotateY(-10deg) translateZ(0)', transformStyle: 'preserve-3d', transition: 'transform 0.4s ease', boxShadow: '0 30px 80px rgba(0,19,38,0.7), 0 4px 20px rgba(0,173,243,0.2), inset 0 1px 0 rgba(0,173,243,0.15)' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.transform = 'rotateX(3deg) rotateY(-4deg) translateZ(20px)')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.transform = 'rotateX(8deg) rotateY(-10deg) translateZ(0)')}>
                {/* macOS dots */}
                <div className="flex items-center gap-2 mb-4">
                  <div className="flex gap-1.5">
                    {['#FF5F56', '#FFBD2E', '#27C93F'].map(c => <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />)}
                  </div>
                  <span className="text-xs ml-2" style={{ color: C.faint }}>garsonsal — panel</span>
                  <span className="text-xs ml-auto" style={{ color: C.faint }}>08:47</span>
                </div>
                {/* Table grid */}
                <div className="grid grid-cols-4 gap-2 mb-4">
                  {[1,2,3,4,5,6,7,8].map(n => (
                    <div key={n} className="aspect-square rounded-xl flex items-center justify-center text-xs font-bold"
                      style={{
                        background: n === 3 || n === 7 ? 'rgba(0,173,243,0.2)' : n === 5 ? 'rgba(0,110,163,0.15)' : C.glass,
                        border: `1px solid ${n === 3 || n === 7 ? 'rgba(0,173,243,0.4)' : C.glassB}`,
                        color: n === 3 || n === 7 ? C.c4 : n === 5 ? C.c3 : C.faint,
                        boxShadow: n === 3 || n === 7 ? `0 0 12px rgba(0,173,243,0.25)` : 'none',
                      }}>
                      {n}
                    </div>
                  ))}
                </div>
                <OrderPanelMockup />
              </div>

              {/* Floating notifications */}
              <motion.div animate={{ y: [0, -8, 0] }} transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                className="absolute -top-5 -right-8 glass-card px-4 py-2.5 text-sm font-medium text-white whitespace-nowrap"
                style={{ boxShadow: `0 0 24px rgba(0,173,243,0.3)`, border: `1px solid rgba(0,173,243,0.3)` }}>
                {t.hero.n1}
              </motion.div>
              <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 3.5, ease: 'easeInOut', delay: 0.7 }}
                className="absolute -bottom-5 -left-8 glass-card px-4 py-2.5 text-sm font-medium text-white whitespace-nowrap"
                style={{ boxShadow: `0 0 20px rgba(0,110,163,0.3)`, border: `1px solid rgba(0,110,163,0.3)` }}>
                {t.hero.n2}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═════════════════════════════════════════════════════ */}
      <section className="py-24 relative" style={{ borderTop: `1px solid ${C.glassB}` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="section-title text-center mb-16">{t.steps.title}</motion.h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5" style={{ perspective: '800px' }}>
              {t.steps.items.map((step, i) => (
                <motion.div key={i} variants={fadeUp} className="glass-card p-6 relative"
                  style={{ transform: 'translateZ(0)', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-6px) translateZ(16px) rotateX(3deg)'; (e.currentTarget as HTMLElement).style.boxShadow = `0 24px 48px rgba(0,19,38,0.6), 0 4px 16px rgba(0,173,243,0.2)` }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateZ(0)'; (e.currentTarget as HTMLElement).style.boxShadow = 'var(--glass-shadow)' }}>
                  <div className="text-5xl font-extrabold mb-4" style={{ background: C.gradH, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', lineHeight: 1 }}>
                    {step.num}
                  </div>
                  {i < 3 && <div className="hidden lg:block absolute top-10 -right-2.5 w-5 h-px" style={{ background: `linear-gradient(90deg, ${C.c3}66, ${C.c4}66)` }} />}
                  <h3 className="font-bold text-white text-base mb-2">{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FEATURES ═════════════════════════════════════════════════════════ */}
      <section id="ozellikler" className="py-24 relative">
        <div className="orb w-96 h-96 top-1/2 -translate-y-1/2 left-0" style={{ background: 'rgba(0,173,243,0.1)' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="section-title text-center mb-4">{t.features.title}</motion.h2>
            <motion.p variants={fadeUp} className="text-center mb-14 text-lg" style={{ color: C.muted }}>
              {lang === 'TR' ? 'QR siparişten dijital sadakate, tüm araçlar tek çatı altında.' : 'From QR ordering to digital loyalty, all tools under one roof.'}
            </motion.p>
            {/* 3D perspective grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5" style={{ perspective: '1000px' }}>
              {t.features.items.map((f, i) => (
                <motion.div key={i} variants={fadeUp} className="feature-card">
                  <div className="text-3xl mb-4">{f.icon}</div>
                  <h3 className="font-bold text-white text-base mb-2">{f.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ STATS ════════════════════════════════════════════════════════════ */}
      <section className="py-24 relative"
        style={{ background: `linear-gradient(180deg, transparent 0%, rgba(0,59,94,0.15) 50%, transparent 100%)` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="section-title text-center mb-16">{t.stats.title}</motion.h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {t.stats.items.map((s, i) => (
                <motion.div key={i} variants={fadeUp} className="glass-card p-8 text-center"
                  style={{ boxShadow: `0 8px 32px rgba(0,19,38,0.5), 0 0 0 1px rgba(0,173,243,0.1), inset 0 1px 0 rgba(0,173,243,0.1)` }}>
                  <div className="text-5xl font-extrabold mb-3"
                    style={{ background: C.gradH, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '-0.02em', filter: `drop-shadow(0 0 16px ${C.c4}55)` }}>
                    {s.value}
                  </div>
                  <p className="text-sm" style={{ color: C.muted }}>{s.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ SHOWCASE ═════════════════════════════════════════════════════════ */}
      <section id="panel" className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="section-title text-center mb-4">{t.showcase.title}</motion.h2>
            <motion.p variants={fadeUp} className="text-center mb-8" style={{ color: C.muted }}>
              {lang === 'TR' ? 'Gerçek zamanlı sipariş yönetimi, menü düzenleme ve loyalty takibi.' : 'Real-time order management, menu editing, and loyalty tracking.'}
            </motion.p>
            <motion.div variants={fadeUp} className="flex justify-center gap-2 mb-10 flex-wrap">
              {t.showcase.tabs.map((tab, i) => (
                <button key={i} onClick={() => setShowcaseTab(i)}
                  className="text-sm px-5 py-2 rounded-xl transition-all font-medium"
                  style={{
                    background: showcaseTab === i ? C.grad : C.glass,
                    color: showcaseTab === i ? '#fff' : C.muted,
                    border: `1px solid ${showcaseTab === i ? 'transparent' : C.glassB}`,
                    boxShadow: showcaseTab === i ? `0 4px 16px rgba(0,173,243,0.25)` : 'none',
                  }}>
                  {tab}
                </button>
              ))}
            </motion.div>
            <motion.div variants={fadeUp} className="glass-elevated p-8 max-w-2xl mx-auto relative"
              style={{ boxShadow: `0 32px 80px rgba(0,19,38,0.65), 0 0 0 1px rgba(0,173,243,0.15), inset 0 1px 0 rgba(0,173,243,0.1)` }}>
              <div className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at 50% 110%, rgba(0,110,163,0.15) 0%, transparent 60%)' }} />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-5">
                  {['#FF5F56', '#FFBD2E', '#27C93F'].map(c => <div key={c} className="w-3 h-3 rounded-full" style={{ background: c }} />)}
                  <span className="text-xs ml-2" style={{ color: C.faint }}>{t.showcase.tabs[showcaseTab]}</span>
                </div>
                <AnimatePresence mode="wait">
                  <motion.div key={showcaseTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.22 }}>
                    {showcaseTab === 0 && <OrderPanelMockup />}
                    {showcaseTab === 1 && <MenuMockup />}
                    {showcaseTab === 2 && <LoyaltyMockup />}
                  </motion.div>
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══ LOYALTY CARD DESIGNER ═══════════════════════════════════════════ */}
      <section className="py-24 relative" style={{ borderTop: `1px solid ${C.glassB}` }}>
        <div className="orb w-96 h-96 top-1/2 -translate-y-1/2 left-0" style={{ background: 'rgba(0,119,182,0.1)' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="section-title text-center mb-3">
              {lang === 'TR' ? 'Sadakat Kartınızı Tasarımlayın' : 'Design Your Loyalty Card'}
            </motion.h2>
            <motion.p variants={fadeUp} className="text-center mb-12" style={{ color: C.muted }}>
              {lang === 'TR' ? 'Müşterilerinizin telefonuna eklenecek kartı şimdi özelleştirin' : 'Customize the card that will be added to your customers\' phones'}
            </motion.p>
            <div className="grid lg:grid-cols-2 gap-10 items-start">
              {/* Controls */}
              <motion.div variants={fadeUp} className="glass-card p-6 space-y-5">
                {/* Renkler */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: C.muted }}>
                    {lang === 'TR' ? 'Kart Arka Plan Rengi' : 'Card Background Color'}
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {CARD_COLORS_LP.map(c => (
                      <button key={c} onClick={() => setCardBg(c)}
                        className="w-8 h-8 rounded-lg border-2 transition-all"
                        style={{ background: c, borderColor: cardBg === c ? '#00b4d8' : 'transparent' }} />
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: C.muted }}>
                    {lang === 'TR' ? 'Metin Rengi' : 'Text Color'}
                  </label>
                  <div className="flex gap-2">
                    {['#F5F0E8', '#FFFFFF', '#2C1810', '#000000'].map(c => (
                      <button key={c} onClick={() => setCardTextColor(c)}
                        className="w-8 h-8 rounded-lg border-2 transition-all"
                        style={{ background: c, borderColor: cardTextColor === c ? '#00b4d8' : 'rgba(14,42,74,0.8)' }} />
                    ))}
                  </div>
                </div>
                {/* Şirket adı */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: C.muted }}>
                    {lang === 'TR' ? 'Şirket Adı' : 'Company Name'}
                  </label>
                  <input
                    value={cardCompany}
                    onChange={e => setCardCompany(e.target.value)}
                    placeholder={lang === 'TR' ? 'Kafe İstanbul' : 'Cafe Istanbul'}
                    className="input-dark"
                  />
                </div>
                {/* Pul ikonu */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: C.muted }}>
                    {lang === 'TR' ? 'Pul İkonu' : 'Stamp Icon'}
                  </label>
                  <div className="flex gap-2">
                    {STAMP_ICONS_LP.map(icon => (
                      <button key={icon} onClick={() => setStampIcon(icon)}
                        className="w-10 h-10 rounded-xl flex items-center justify-center text-lg transition"
                        style={{
                          background: stampIcon === icon ? 'rgba(0,119,182,0.3)' : C.glass,
                          border: stampIcon === icon ? '2px solid #00b4d8' : `1px solid ${C.glassB}`,
                        }}>
                        {icon}
                      </button>
                    ))}
                  </div>
                </div>
                {/* Pul sayısı */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: C.muted }}>
                    {lang === 'TR' ? `Maksimum Pul: ${stampCount}` : `Max Stamps: ${stampCount}`}
                  </label>
                  <input type="range" min={3} max={10} value={stampCount} onChange={e => setStampCount(parseInt(e.target.value))}
                    className="w-full accent-[#00b4d8]" />
                  <div className="flex justify-between text-xs mt-1" style={{ color: C.muted }}>
                    <span>3</span><span>10</span>
                  </div>
                </div>
                {/* Ödül */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: C.muted }}>
                    {lang === 'TR' ? 'Ödül Açıklaması' : 'Reward Description'}
                  </label>
                  <input value={reward} onChange={e => setReward(e.target.value)} className="input-dark" />
                </div>
              </motion.div>

              {/* Card preview */}
              <motion.div variants={fadeUp} className="flex flex-col items-center">
                <p className="text-xs font-semibold uppercase tracking-wider mb-5" style={{ color: C.muted }}>
                  {lang === 'TR' ? 'Canlı Önizleme' : 'Live Preview'}
                </p>
                <div
                  style={{
                    width: '100%', maxWidth: 380,
                    aspectRatio: '380/240',
                    borderRadius: 20,
                    background: cardBg,
                    color: cardTextColor,
                    padding: '24px 28px',
                    boxShadow: '0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {/* Glassmorphism overlay */}
                  <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.05)', borderRadius: 20 }} />
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    {/* Header */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 6, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>G</div>
                      <span style={{ fontWeight: 700, fontSize: 15 }}>{cardCompany || (lang === 'TR' ? 'Kafe İstanbul' : 'Cafe Istanbul')}</span>
                    </div>
                    {/* Stamps */}
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
                      {Array.from({ length: stampCount }).map((_, i) => (
                        <span key={i} style={{ fontSize: 18, opacity: i < 3 ? 1 : 0.3 }}>
                          {i < 3 ? stampIcon : '○'}
                        </span>
                      ))}
                      <span style={{ fontSize: 11, opacity: 0.7, marginLeft: 4, alignSelf: 'center' }}>3/{stampCount}</span>
                    </div>
                    {/* Reward */}
                    <div style={{ fontSize: 11, opacity: 0.75, marginBottom: 12 }}>
                      {lang === 'TR' ? 'Ödül: ' : 'Reward: '}{reward}
                    </div>
                    {/* Footer */}
                    <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
                      <div>
                        <div style={{ fontSize: 9, opacity: 0.5 }}>{lang === 'TR' ? 'Üye Kodu' : 'Member Code'}</div>
                        <div style={{ fontSize: 13, fontWeight: 700, fontFamily: 'monospace' }}>AB3X7K</div>
                      </div>
                      <div style={{ fontSize: 9, opacity: 0.4 }}>by Garsonsal</div>
                    </div>
                  </div>
                </div>
                <Link href="/kayit" className="gradient-btn mt-6 text-sm px-8 py-3 rounded-xl inline-block">
                  {lang === 'TR' ? 'Bu Tasarımla Başla →' : 'Start With This Design →'}
                </Link>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ PRICING ══════════════════════════════════════════════════════════ */}
      <section id="fiyatlandirma" className="py-24 relative">
        <div className="orb w-96 h-96 top-1/2 -translate-y-1/2 right-0" style={{ background: 'rgba(0,59,94,0.3)' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="section-title text-center mb-3">{t.pricing.title}</motion.h2>
            <motion.p variants={fadeUp} className="text-center mb-8" style={{ color: C.muted }}>{t.pricing.subtitle}</motion.p>
            {/* Toggle */}
            <motion.div variants={fadeUp} className="flex items-center justify-center gap-3 mb-12">
              <span className="text-sm" style={{ color: billingYearly ? C.faint : '#fff' }}>{t.pricing.monthly}</span>
              <button onClick={() => setBillingYearly(!billingYearly)}
                className="relative w-12 h-6 rounded-full transition-colors"
                style={{ background: billingYearly ? C.grad : 'rgba(255,255,255,0.12)' }}>
                <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all" style={{ left: billingYearly ? '26px' : '4px' }} />
              </button>
              <span className="text-sm flex items-center gap-2" style={{ color: billingYearly ? '#fff' : C.faint }}>
                {t.pricing.yearly}
                <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                  style={{ background: 'rgba(0,173,243,0.15)', color: C.c4, border: `1px solid rgba(0,173,243,0.3)` }}>
                  {t.pricing.yearlyBadge}
                </span>
              </span>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {t.pricing.plans.map((plan, i) => (
                <motion.div key={i} variants={fadeUp} className="glass-card p-8 flex flex-col relative"
                  style={plan.popular ? { border: `1px solid rgba(0,173,243,0.4)`, boxShadow: `0 0 60px rgba(0,173,243,0.12), 0 8px 32px rgba(0,19,38,0.5)` } : {}}>
                  {plan.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                      <span className="gradient-btn text-xs px-4 py-1 rounded-full">
                        {lang === 'TR' ? '✨ En Popüler' : '✨ Most Popular'}
                      </span>
                    </div>
                  )}
                  <h3 className="font-bold text-white text-xl mb-2">{plan.name}</h3>
                  <div className="mb-6">
                    <span className="text-3xl font-extrabold" style={{ background: C.gradH, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', letterSpacing: '-0.02em' }}>
                      {billingYearly ? plan.yearly : plan.monthly}
                    </span>
                  </div>
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((f, fi) => (
                      <li key={fi} className="flex items-start gap-2.5 text-sm" style={{ color: C.muted }}>
                        <span className="mt-0.5 flex-shrink-0 font-bold" style={{ color: C.c4 }}>✓</span>{f}
                      </li>
                    ))}
                  </ul>
                  <Link href="/kayit" className={`block text-center py-3 px-6 rounded-xl font-semibold text-sm ${plan.popular ? 'gradient-btn' : 'ghost-btn'}`}>
                    {plan.cta}
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FAQ ══════════════════════════════════════════════════════════════ */}
      <section id="sss" className="py-24">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
            <motion.h2 variants={fadeUp} className="section-title text-center mb-12">{t.faq.title}</motion.h2>
            <div className="space-y-2.5">
              {t.faq.items.map((item, i) => (
                <motion.div key={i} variants={fadeUp} className="glass-card overflow-hidden">
                  <button className="w-full flex items-center justify-between px-5 py-4 text-left"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                    <span className="font-medium text-white text-sm pr-4">{item.q}</span>
                    <motion.span animate={{ rotate: openFaq === i ? 45 : 0 }} transition={{ duration: 0.2 }}
                      className="flex-shrink-0" style={{ color: C.c4 }}>
                      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                        <line x1="9" y1="3" x2="9" y2="15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        <line x1="3" y1="9" x2="15" y2="9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
                        <p className="px-5 pb-5 text-sm leading-relaxed" style={{ color: C.muted }}>{item.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ ABOUT ════════════════════════════════════════════════════════════ */}
      <section id="hakkimizda" className="py-24" style={{ background: `linear-gradient(180deg, transparent, rgba(0,59,94,0.12), transparent)` }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
            <motion.div variants={fadeUp} className="glass-elevated p-12 text-center">
              <h2 className="section-title mb-6">{t.about.title}</h2>
              <p className="text-lg leading-relaxed mb-8" style={{ color: C.muted }}>{t.about.text}</p>
              <Link href="/kayit" className="gradient-btn inline-block text-sm px-8 py-3 rounded-xl">{t.nav.trial} →</Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══ CONTACT ══════════════════════════════════════════════════════════ */}
      <section id="iletisim" className="py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-80px' }} variants={stagger}>
            <div className="grid md:grid-cols-2 gap-12 items-start">
              <motion.div variants={fadeUp}>
                <h2 className="section-title mb-4">{t.contact.title}</h2>
                <p className="mb-8" style={{ color: C.muted }}>{t.contact.subtitle}</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: `rgba(0,110,163,0.2)`, border: `1px solid rgba(0,173,243,0.25)` }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.c4} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                    </svg>
                  </div>
                  <span className="text-sm text-white">hello@garsonsal.com</span>
                </div>
              </motion.div>
              <motion.div variants={fadeUp}>
                {contactSent ? (
                  <div className="glass-card p-10 text-center">
                    <div className="text-5xl mb-4">✅</div>
                    <h3 className="font-bold text-white text-lg mb-2">{lang === 'TR' ? 'Mesajınız alındı!' : 'Message received!'}</h3>
                    <p className="text-sm" style={{ color: C.muted }}>{lang === 'TR' ? '24 saat içinde geri döneceğiz.' : "We'll get back to you within 24 hours."}</p>
                  </div>
                ) : (
                  <form onSubmit={(e) => { e.preventDefault(); setContactSent(true) }} className="glass-card p-6 space-y-4">
                    {[{ name: 'name', label: t.contact.name, type: 'text' }, { name: 'email', label: t.contact.email, type: 'email' }, { name: 'business', label: t.contact.business, type: 'text' }].map(f => (
                      <div key={f.name}>
                        <label className="block text-xs font-medium mb-1.5" style={{ color: C.muted }}>{f.label}</label>
                        <input name={f.name} type={f.type} required className="input-dark" />
                      </div>
                    ))}
                    <div>
                      <label className="block text-xs font-medium mb-1.5" style={{ color: C.muted }}>{t.contact.message}</label>
                      <textarea name="message" required rows={4} className="input-dark resize-none" />
                    </div>
                    <button type="submit" className="gradient-btn w-full py-3 rounded-xl text-sm">{t.contact.send}</button>
                  </form>
                )}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FOOTER ═══════════════════════════════════════════════════════════ */}
      <footer style={{ background: `rgba(0,59,94,0.2)`, borderTop: `1px solid ${C.glassB}` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            <div>
              <Logo variant="footer" />
              <p className="text-sm mt-4 leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>{t.footer.desc}</p>
              <div className="flex gap-2.5 mt-5">
                {['T', 'I', 'L'].map(s => (
                  <div key={s} className="ghost-btn w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold cursor-pointer" style={{ color: 'rgba(255,255,255,0.4)' }}>{s}</div>
                ))}
              </div>
            </div>
            {[
              { title: t.footer.product, links: t.footer.productLinks },
              { title: t.footer.company, links: t.footer.companyLinks },
            ].map(col => (
              <div key={col.title}>
                <h4 className="font-semibold text-white text-sm mb-4">{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map(l => <li key={l}><a href="#" className="nav-link text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>{l}</a></li>)}
                </ul>
              </div>
            ))}
            <div>
              <h4 className="font-semibold text-white text-sm mb-4">{t.footer.legal}</h4>
              <ul className="space-y-2.5">
                {t.footer.legalLinks.map((l, i) => {
                  const href = i === 0 ? '#' : i === 1 ? '/gizlilik-politikasi' : i === 2 ? '/kullanim-kosullari' : '/cerez-politikasi'
                  return (
                    <li key={l}>
                      {i === 0
                        ? <button onClick={() => setPolicyOpen(true)} className="text-sm hover:underline transition-colors text-left" style={{ color: C.c4 }}>{l}</button>
                        : <Link href={href} className="nav-link text-sm hover:underline" style={{ color: 'rgba(255,255,255,0.4)' }}>{l}</Link>
                      }
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between pt-8 gap-4" style={{ borderTop: `1px solid ${C.glassB}` }}>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>{t.footer.copy}</p>
            <button onClick={() => setLang(lang === 'TR' ? 'EN' : 'TR')}
              className="ghost-btn text-xs px-3 py-1.5 rounded-lg font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>
              {lang === 'TR' ? '🇺🇸 Switch to English' : '🇹🇷 Türkçeye Geç'}
            </button>
          </div>
        </div>
      </footer>

      {/* ═══ POLICY MODAL ═════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {policyOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,10,20,0.8)', backdropFilter: 'blur(8px)' }}
            onClick={() => setPolicyOpen(false)}>
            <motion.div initial={{ scale: 0.94, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.94, opacity: 0 }}
              className="glass-elevated p-8 max-w-lg w-full relative" onClick={e => e.stopPropagation()}>
              <button onClick={() => setPolicyOpen(false)}
                className="absolute top-4 right-4 ghost-btn w-8 h-8 rounded-lg flex items-center justify-center text-sm" style={{ color: C.muted }}>
                ✕
              </button>
              <h3 className="font-bold text-white text-lg mb-4">{lang === 'TR' ? 'Hizmet Kesintisi & İade Politikası' : 'Service & Refund Policy'}</h3>
              <p className="text-sm leading-relaxed" style={{ color: C.muted }}>{t.footer.policy}</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
