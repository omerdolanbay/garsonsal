'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useTheme } from '@/components/ThemeProvider'

/* ── useReveal hook ─────────────────────────────────────────────────────────── */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

/* ── Pricing plans ──────────────────────────────────────────────────────────── */
const PLANS = [
  {
    name: 'Başlangıç', price: 89, period: '/ay',
    desc: 'Tek şubelik işletmeler için ideal başlangıç paketi.',
    features: ['1 şube', '10 masa & QR', 'Dijital menü', 'Temel analitik', 'E-posta desteği'],
    cta: 'Ücretsiz Dene', highlight: false,
  },
  {
    name: 'Büyüme', price: 119, period: '/ay',
    desc: 'Sadakat programı ve gelişmiş özellikler dahil.',
    features: ['3 şube', '50 masa & QR', 'Dijital menü', 'Sadakat kartı', 'SMS bildirim', 'Öncelikli destek'],
    cta: 'Hemen Başla', highlight: true,
  },
  {
    name: 'Profesyonel', price: 189, period: '/ay',
    desc: 'Zincir kafeler için tam güç, tam kontrol.',
    features: ['Sınırsız şube', 'Sınırsız masa', 'Özel domain', 'API erişimi', 'Beyaz etiket', '7/24 destek'],
    cta: 'Satış Ekibiyle Görüş', highlight: false,
  },
]

/* ── FAQ items ──────────────────────────────────────────────────────────────── */
const FAQS = [
  { q: 'Kurulum için teknik bilgi gerekiyor mu?', a: 'Hayır. Hesap açın, menünüzü yükleyin, masalara QR kodu yapıştırın — bitti. Ortalama kurulum süresi 20 dakika.' },
  { q: 'Müşteriler uygulamayı indirmek zorunda mı?', a: 'Kesinlikle hayır. QR kodu okutan her telefon, tarayıcıdan doğrudan menüye erişir.' },
  { q: 'Menüyü ne sıklıkta güncelleyebilirim?', a: 'Dilediğiniz kadar, anında. Fiyat değişikliği, sezonluk kampanya, günlük tükendi — tüm değişiklikler QR\'a anında yansır.' },
  { q: 'Sadakat kartı nasıl çalışıyor?', a: 'Müşteri QR\'ı okuttuğunda telefon numarasıyla kaydolur. Siz belirleyebileceğiniz pul sayısına ulaşınca hediyesini kazanır.' },
  { q: 'Verilerimi başka sisteme taşıyabilir miyim?', a: 'Evet. CSV ve JSON formatında dilediğiniz zaman tam dışa aktarım yapabilirsiniz.' },
  { q: 'Ödeme güvenli mi?', a: 'Tüm ödemeler Stripe altyapısıyla işlenir. Kart bilgileriniz sistemlerimizde saklanmaz.' },
  { q: 'İptal etmek istersem ne olur?', a: 'Sözleşme yok, ceza yok. Dilediğiniz an iptal edersiniz; dönem sonuna kadar erişim devam eder.' },
  { q: '14 günlük deneme sırasında kredi kartı gerekiyor mu?', a: 'Hayır. Deneme bitince planınızı seçersiniz, o zaman kart bilgisi alınır.' },
  { q: 'Birden fazla şubem var, ayrı hesap açmam gerekiyor mu?', a: 'Büyüme ve Profesyonel paketlerde tek hesaptan tüm şubelerinizi yönetirsiniz.' },
  { q: 'Türkçe dışında dil destekleniyor mu?', a: 'Menüler çok dilli oluşturulabilir. Panel arayüzü şimdilik Türkçe ve İngilizce.' },
]

/* ── StampCard preview ──────────────────────────────────────────────────────── */
function StampCardPreview({ filled = 6 }: { filled?: number }) {
  const stamps = Array.from({ length: 10 }, (_, i) => i < filled)
  return (
    <div style={{
      width: 340, maxWidth: '100%',
      background: 'linear-gradient(135deg, #1A0F05 0%, #2A1A08 100%)',
      borderRadius: 20,
      padding: '24px 24px 20px',
      boxShadow: '0 20px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(200,136,40,0.3)',
      border: '1px solid rgba(200,136,40,0.25)',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 11, color: '#C88828', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 3 }}>Sadakat Kartı</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#EAE0C8', letterSpacing: '-0.02em' }}>Aromas Coffee</div>
        </div>
        <div style={{ fontSize: 26 }}>☕</div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 8, marginBottom: 16 }}>
        {stamps.map((f, i) => (
          <div key={i} style={{
            aspectRatio: '1', borderRadius: 10,
            background: f ? 'linear-gradient(135deg, #C88828, #E8A030)' : 'rgba(200,136,40,0.1)',
            border: `1px solid ${f ? '#C88828' : 'rgba(200,136,40,0.25)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>
            {f ? '☕' : ''}
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 11, color: '#786450' }}>{filled}/10 pul toplandı</div>
        <div style={{ fontSize: 11, color: '#C88828', fontWeight: 600 }}>
          {10 - filled} pul kaldı → Ücretsiz Kahve
        </div>
      </div>
    </div>
  )
}

/* ── Page component ─────────────────────────────────────────────────────────── */
export default function HomePage() {
  const { theme, toggle } = useTheme()
  const isLight = theme === 'light'

  const [stampCount, setStampCount] = useState(6)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [contact, setContact] = useState({ name: '', email: '', phone: '', msg: '' })
  const [sent, setSent] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  function handleContact(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 4000)
  }

  const statsReveal = useReveal()
  const howReveal = useReveal()
  const featReveal = useReveal()
  const loyaltyReveal = useReveal()
  const pricingReveal = useReveal()
  const faqReveal = useReveal()
  const contactReveal = useReveal()

  const pg = isLight ? {
    bg: '#FAF5EA', bg2: '#F3EBD6', amber: '#A06820', amberBright: '#C88828',
    cream: '#1A1008', muted: '#786450', surface: '#FFFDF7',
    border: 'rgba(160,104,32,0.25)', navBg: 'rgba(250,245,234,0.92)',
  } : {
    bg: '#080507', bg2: '#0F0A05', amber: '#C88828', amberBright: '#E8A030',
    cream: '#EAE0C8', muted: '#786450', surface: 'rgba(26,15,5,0.85)',
    border: 'rgba(200,136,40,0.2)', navBg: 'rgba(8,5,7,0.88)',
  }

  return (
    <>
      <style>{`
        .pg-body { font-family: 'Plus Jakarta Sans', sans-serif; }
        .pg-display { font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; letter-spacing: -0.04em; line-height: 1.0; }

        .pg-btn-amber {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 14px 32px; border-radius: 12px; font-weight: 700; font-size: 0.9375rem;
          background: linear-gradient(135deg, #C88828, #E8A030);
          color: #0F0A05; border: none; cursor: pointer;
          transition: transform 0.2s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(200,136,40,0.35);
          text-decoration: none; white-space: nowrap;
          position: relative; overflow: hidden;
        }
        .pg-btn-amber::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%);
          transform: translateX(-120%); transition: transform 0.5s;
        }
        .pg-btn-amber:hover::after { transform: translateX(120%); }
        .pg-btn-amber:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(200,136,40,0.5); }

        .pg-btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 28px; border-radius: 12px; font-weight: 600; font-size: 0.9375rem;
          background: transparent; cursor: pointer;
          transition: background 0.2s, transform 0.2s;
          text-decoration: none; white-space: nowrap;
        }
        .pg-btn-ghost:hover { transform: translateY(-1px); background: rgba(200,136,40,0.08); }

        .pg-nav-link {
          font-size: 0.875rem; font-weight: 500; text-decoration: none;
          position: relative; padding: 4px 0; transition: opacity 0.15s;
        }
        .pg-nav-link::after {
          content: ''; position: absolute; bottom: 0; left: 50%; right: 50%;
          height: 1.5px; background: #C88828; border-radius: 2px;
          transition: left 0.25s, right 0.25s;
        }
        .pg-nav-link:hover::after { left: 0; right: 0; }

        .pg-feature-card {
          border-radius: 20px; padding: 2rem;
          transition: transform 0.35s cubic-bezier(.2,.8,.4,1), box-shadow 0.35s;
          transform: translateZ(0); will-change: transform;
        }
        .pg-feature-card:hover { transform: translateY(-8px) rotateX(2deg); }

        .pg-step-num {
          font-family: 'Bricolage Grotesque', sans-serif; font-weight: 800; font-size: 3.5rem; line-height: 1;
          background: linear-gradient(135deg, #C88828, #E8A030);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
        }

        .pg-pricing-card {
          border-radius: 24px; padding: 2rem;
          transition: transform 0.3s, box-shadow 0.3s;
          position: relative;
        }
        .pg-pricing-card:not(.pg-highlight):hover { transform: translateY(-6px); }
        .pg-highlight { transform: translateY(-12px); box-shadow: 0 32px 80px rgba(200,136,40,0.3) !important; }
        .pg-highlight:hover { transform: translateY(-18px); }

        .pg-reveal { opacity: 0; transform: translateY(32px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .pg-visible { opacity: 1; transform: translateY(0); }
        .pg-d1 { transition-delay: 0.1s; }
        .pg-d2 { transition-delay: 0.2s; }
        .pg-d3 { transition-delay: 0.3s; }
        .pg-d4 { transition-delay: 0.4s; }

        .pg-faq-item { border-bottom: 1px solid; overflow: hidden; }
        .pg-faq-q {
          width: 100%; text-align: left; display: flex; justify-content: space-between;
          align-items: center; padding: 20px 0; background: none; border: none; cursor: pointer; gap: 16px;
        }
        .pg-chevron { transition: transform 0.25s; flex-shrink: 0; }
        .pg-chevron.open { transform: rotate(45deg); }
        .pg-faq-body { overflow: hidden; transition: max-height 0.35s ease, opacity 0.3s; }
        .pg-faq-body.open { max-height: 300px; opacity: 1; }
        .pg-faq-body.closed { max-height: 0; opacity: 0; }

        .pg-grain {
          position: fixed; inset: 0; pointer-events: none; z-index: 0; opacity: 0.035;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-repeat: repeat; background-size: 200px 200px;
        }

        @media (max-width: 900px) {
          .pg-hero-grid { grid-template-columns: 1fr !important; }
          .pg-hero-mockup { display: none !important; }
          .pg-nav-links { display: none !important; }
          .pg-steps-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .pg-features-asym { grid-template-columns: 1fr !important; }
          .pg-features-asym > div[style*="grid-row"] { grid-row: auto !important; }
          .pg-features-asym > div[style*="grid-column"] { grid-column: auto !important; }
          .pg-pricing-grid { grid-template-columns: 1fr !important; }
          .pg-contact-grid { grid-template-columns: 1fr !important; }
          .pg-footer-grid { grid-template-columns: 1fr 1fr !important; }
          .pg-stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .pg-stats-grid > div:nth-child(2) { border-right: none !important; }
        }
        @media (max-width: 600px) {
          .pg-steps-grid { grid-template-columns: 1fr !important; }
          .pg-footer-grid { grid-template-columns: 1fr !important; }
          .pg-stats-grid { grid-template-columns: 1fr !important; }
          .pg-stats-grid > div { border-right: none !important; border-bottom: 1px solid rgba(200,136,40,0.2); }
        }
      `}</style>

      <div className="pg-body" style={{ background: pg.bg, color: pg.cream, minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
        <div className="pg-grain" />
        <div style={{
          position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
          background: isLight
            ? 'radial-gradient(ellipse 70% 50% at 15% 20%, rgba(200,136,40,0.08) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 85% 70%, rgba(160,104,32,0.06) 0%, transparent 60%)'
            : 'radial-gradient(ellipse 70% 50% at 15% 20%, rgba(200,136,40,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 85% 70%, rgba(232,160,48,0.07) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 50% 100%, rgba(200,136,40,0.06) 0%, transparent 50%)',
        }} />

        {/* ── NAVBAR ──────────────────────────────────────────────────────────── */}
        <nav style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 clamp(20px, 5vw, 64px)', height: 68,
          background: scrolled ? pg.navBg : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          borderBottom: scrolled ? `1px solid ${pg.border}` : '1px solid transparent',
          transition: 'background 0.3s, backdrop-filter 0.3s, border-color 0.3s',
        }}>
          <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 22 }}>☕</span>
            <span className="pg-display" style={{
              fontSize: '1.3rem', letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #C88828, #E8A030)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Garsonsal</span>
          </Link>

          <div style={{ display: 'flex', alignItems: 'center', gap: 32 }}>
            <div className="pg-nav-links" style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
              {[['Özellikler', 'ozellikler'], ['Fiyatlar', 'fiyatlar'], ['SSS', 'sss'], ['İletişim', 'iletisim']].map(([label, anchor]) => (
                <a key={anchor} href={`#${anchor}`} className="pg-nav-link" style={{ color: pg.muted }}>{label}</a>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <button
                onClick={toggle}
                className="theme-toggle"
                aria-label="Tema değiştir"
                style={{
                  width: 36, height: 36, borderRadius: 10, border: `1px solid ${pg.border}`,
                  background: 'transparent', color: pg.muted, cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15,
                }}
              >
                {isLight ? '🌙' : '☀️'}
              </button>
              <Link href="/giris" className="pg-btn-amber" style={{ padding: '9px 22px', fontSize: '0.875rem', borderRadius: 10 }}>
                Giriş Yap
              </Link>
            </div>
          </div>
        </nav>

        {/* ── HERO ────────────────────────────────────────────────────────────── */}
        <section style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center',
          padding: 'clamp(100px, 12vh, 140px) clamp(20px, 5vw, 64px) clamp(60px, 8vh, 100px)',
          position: 'relative', zIndex: 1,
        }}>
          <div className="pg-hero-grid" style={{ maxWidth: 1240, margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }}>
            <div>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 24,
                padding: '6px 14px', borderRadius: 100,
                background: isLight ? 'rgba(200,136,40,0.12)' : 'rgba(200,136,40,0.1)',
                border: `1px solid ${pg.border}`,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#C88828', display: 'block' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: pg.amber, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Türkiye&apos;de 1.200+ Kafe Kullanıyor
                </span>
              </div>

              <h1 className="pg-display" style={{ fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)', color: pg.cream, marginBottom: 24 }}>
                Menü. Sipariş.<br />
                <span style={{ background: 'linear-gradient(135deg, #C88828, #E8A030)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Sadakat.
                </span><br />
                Tek QR&apos;da.
              </h1>

              <p style={{ fontSize: 'clamp(1rem, 1.5vw, 1.125rem)', color: pg.muted, lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
                Masaya QR yapıştır, menün dijitale taşın. Müşteriler sipariş verir, pul toplar,
                ödülünü kazanır — sen sadece en iyi kahveye odaklanırsın.
              </p>

              <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                <Link href="/giris" className="pg-btn-amber">14 Gün Ücretsiz Başla →</Link>
                <a href="#ozellikler" className="pg-btn-ghost" style={{ color: pg.muted, border: `1px solid ${pg.border}` }}>
                  Nasıl çalışır?
                </a>
              </div>

              <p style={{ fontSize: '0.75rem', color: pg.muted, marginTop: 14, opacity: 0.7 }}>
                Kredi kartı gerekmez · Kurulum 20 dakika · İptal kolayca
              </p>
            </div>

            {/* Dashboard mockup */}
            <div className="pg-hero-mockup" style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <div style={{
                width: '100%', maxWidth: 460,
                background: isLight ? 'rgba(255,253,247,0.9)' : 'rgba(26,15,5,0.8)',
                backdropFilter: 'blur(24px)',
                border: `1px solid ${pg.border}`,
                borderRadius: 24, overflow: 'hidden',
                boxShadow: isLight
                  ? '0 24px 80px rgba(0,0,0,0.12)'
                  : '0 24px 80px rgba(0,0,0,0.5), 0 4px 20px rgba(200,136,40,0.08)',
              }}>
                <div style={{
                  padding: '12px 16px', borderBottom: `1px solid ${pg.border}`,
                  display: 'flex', alignItems: 'center', gap: 8,
                  background: isLight ? 'rgba(250,245,234,0.6)' : 'rgba(15,10,5,0.6)',
                }}>
                  <div style={{ display: 'flex', gap: 5 }}>
                    {['#ff5f57', '#febc2e', '#28c840'].map(c => (
                      <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
                    ))}
                  </div>
                  <div style={{
                    flex: 1, height: 22, borderRadius: 6, marginLeft: 4,
                    background: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'center', paddingLeft: 8,
                  }}>
                    <span style={{ fontSize: '0.65rem', color: pg.muted }}>garsonsal.app/aromas-coffee</span>
                  </div>
                </div>
                <div style={{ padding: '20px 20px 24px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 16 }}>
                    {([['☕', '247', 'Bugün'], ['⭐', '89', 'Yeni üye'], ['💰', '₺4.280', 'Ciro']] as const).map(([icon, val, label]) => (
                      <div key={label} style={{
                        borderRadius: 12, padding: '12px 10px', textAlign: 'center',
                        background: isLight ? 'rgba(200,136,40,0.08)' : 'rgba(200,136,40,0.1)',
                        border: `1px solid ${pg.border}`,
                      }}>
                        <div style={{ fontSize: 16, marginBottom: 4 }}>{icon}</div>
                        <div style={{ fontSize: '1rem', fontWeight: 700, color: pg.cream, lineHeight: 1 }}>{val}</div>
                        <div style={{ fontSize: '0.625rem', color: pg.muted, marginTop: 3 }}>{label}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 700, color: pg.muted, letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 8 }}>Popüler Ürünler</div>
                    {([['Filtre Kahve', '₺65', true], ['Cappuccino', '₺80', false], ['Cheesecake', '₺95', false]] as const).map(([name, price, active]) => (
                      <div key={name} style={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        padding: '9px 12px', borderRadius: 10, marginBottom: 5,
                        background: active ? (isLight ? 'rgba(200,136,40,0.12)' : 'rgba(200,136,40,0.15)') : 'transparent',
                        border: `1px solid ${active ? pg.border : 'transparent'}`,
                      }}>
                        <span style={{ fontSize: '0.8rem', color: pg.cream, fontWeight: active ? 600 : 400 }}>{name}</span>
                        <span style={{ fontSize: '0.8rem', color: pg.amber, fontWeight: 700 }}>{price}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{
                    borderRadius: 12, padding: '12px 14px',
                    background: 'linear-gradient(135deg, rgba(200,136,40,0.2), rgba(232,160,48,0.08))',
                    border: `1px solid ${pg.border}`,
                  }}>
                    <div style={{ fontSize: '0.65rem', color: pg.amber, fontWeight: 700, letterSpacing: '0.08em', marginBottom: 8 }}>SADAKAT KARTI — Ayla K.</div>
                    <div style={{ display: 'flex', gap: 5 }}>
                      {Array.from({ length: 10 }, (_, i) => (
                        <div key={i} style={{
                          flex: 1, aspectRatio: '1', borderRadius: 5,
                          background: i < 7 ? 'linear-gradient(135deg, #C88828, #E8A030)' : 'rgba(200,136,40,0.15)',
                          border: `1px solid ${i < 7 ? '#C88828' : 'rgba(200,136,40,0.2)'}`,
                          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9,
                        }}>{i < 7 ? '☕' : ''}</div>
                      ))}
                    </div>
                    <div style={{ fontSize: '0.6rem', color: pg.muted, marginTop: 6 }}>3 pul kaldı → Ücretsiz Kahve</div>
                  </div>
                </div>
              </div>
              <div style={{
                position: 'absolute', top: -16, right: -10,
                background: 'linear-gradient(135deg, #C88828, #E8A030)',
                borderRadius: 12, padding: '10px 14px',
                boxShadow: '0 8px 24px rgba(200,136,40,0.4)',
                color: '#0F0A05', fontWeight: 700, fontSize: '0.75rem', textAlign: 'center',
              }}>
                <div style={{ fontSize: '1.25rem', lineHeight: 1, marginBottom: 2 }}>+34%</div>
                <div>tekrar ziyaret</div>
              </div>
            </div>
          </div>
        </section>

        {/* ── STATS BAR ───────────────────────────────────────────────────────── */}
        <section style={{ padding: '0 clamp(20px, 5vw, 64px) 80px', position: 'relative', zIndex: 1 }}>
          <div
            ref={statsReveal.ref}
            className={`pg-reveal${statsReveal.visible ? ' pg-visible' : ''}`}
            style={{ maxWidth: 1240, margin: '0 auto' }}
          >
            <div
              className="pg-stats-grid"
              style={{
                display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0,
                borderRadius: 20, overflow: 'hidden',
                border: `1px solid ${pg.border}`,
                background: isLight ? 'rgba(255,253,247,0.8)' : 'rgba(26,15,5,0.6)',
              }}
            >
              {([['1.200+', 'Aktif kafe'], ['₺2.4M+', 'Aylık işlem hacmi'], ['14 dk', 'Ortalama kurulum'], ['98%', 'Müşteri memnuniyeti']] as const).map(([val, label], i) => (
                <div key={i} style={{
                  padding: 'clamp(20px, 3vw, 32px)',
                  borderRight: i < 3 ? `1px solid ${pg.border}` : 'none',
                  textAlign: 'center',
                }}>
                  <div className="pg-display" style={{ fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', color: pg.amber, marginBottom: 6 }}>{val}</div>
                  <div style={{ fontSize: '0.875rem', color: pg.muted }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ────────────────────────────────────────────────────── */}
        <section id="nasil-calisir" style={{ padding: '80px clamp(20px, 5vw, 64px)', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 1240, margin: '0 auto' }}>
            <div ref={howReveal.ref} className={`pg-reveal${howReveal.visible ? ' pg-visible' : ''}`} style={{ textAlign: 'center', marginBottom: 64 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: pg.amber, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Nasıl Çalışır</div>
              <h2 className="pg-display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: pg.cream }}>4 adımda dijital dönüşüm</h2>
            </div>
            <div className="pg-steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, position: 'relative' }}>
              <div style={{
                position: 'absolute', top: 28, left: '12.5%', right: '12.5%',
                height: 1, background: `linear-gradient(to right, transparent, ${pg.border}, ${pg.border}, transparent)`, zIndex: 0,
              }} />
              {[
                { num: '01', icon: '📝', title: 'Hesap Aç', desc: 'E-posta ve şube adınla 2 dakikada kaydol. Onay bekleme, anında başla.' },
                { num: '02', icon: '🍽️', title: 'Menü Ekle', desc: 'Kategoriler, ürünler, fotoğraflar — sürükle bırak ile düzenle.' },
                { num: '03', icon: '📱', title: 'QR Yapıştır', desc: 'Her masa için QR üret, yazdır, masaya koy. Müşteriler okuttu mu? Hazır.' },
                { num: '04', icon: '⭐', title: 'Sadakat Kazan', desc: 'Pul topla sistemi otomatik çalışır. Sen sadece kahve yap.' },
              ].map((step, i) => (
                <div key={i} className={`pg-reveal${howReveal.visible ? ' pg-visible' : ''} pg-d${i + 1}`} style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: 16, margin: '0 auto 20px',
                    background: isLight ? 'rgba(255,253,247,0.9)' : 'rgba(26,15,5,0.8)',
                    border: `1px solid ${pg.border}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24,
                    boxShadow: isLight ? '0 4px 16px rgba(0,0,0,0.06)' : '0 4px 16px rgba(0,0,0,0.3)',
                  }}>{step.icon}</div>
                  <div className="pg-step-num" style={{ marginBottom: 8 }}>{step.num}</div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, color: pg.cream, marginBottom: 8 }}>{step.title}</h3>
                  <p style={{ fontSize: '0.875rem', color: pg.muted, lineHeight: 1.6 }}>{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ────────────────────────────────────────────────────────── */}
        <section id="ozellikler" style={{ padding: '80px clamp(20px, 5vw, 64px)', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 1240, margin: '0 auto' }}>
            <div ref={featReveal.ref} className={`pg-reveal${featReveal.visible ? ' pg-visible' : ''}`} style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: pg.amber, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Özellikler</div>
              <h2 className="pg-display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: pg.cream }}>
                Kafeye özel her şey<br />tek çatı altında
              </h2>
            </div>

            <div className="pg-features-asym" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gridTemplateRows: 'auto auto', gap: 16 }}>
              {/* Big card */}
              <div
                className={`pg-feature-card pg-reveal${featReveal.visible ? ' pg-visible' : ''} pg-d1`}
                style={{
                  gridRow: '1 / 3',
                  background: isLight ? 'rgba(255,253,247,0.9)' : 'rgba(26,15,5,0.75)',
                  border: `1px solid ${pg.border}`,
                  boxShadow: isLight ? '0 4px 24px rgba(0,0,0,0.06)' : '0 8px 32px rgba(0,0,0,0.3)',
                  display: 'flex', flexDirection: 'column',
                }}
              >
                <div style={{ fontSize: 40, marginBottom: 20 }}>📱</div>
                <h3 className="pg-display" style={{ fontSize: '1.75rem', color: pg.cream, marginBottom: 12 }}>Dijital Menü</h3>
                <p style={{ fontSize: '0.9375rem', color: pg.muted, lineHeight: 1.7, marginBottom: 24 }}>
                  Fotoğraflı, kategorili, filtrelenebilir dijital menü. Herhangi bir cihazda mükemmel görünür.
                  Fiyat değişikliği saniyeler içinde yansır — yeniden baskı yok, sticker yok.
                </p>
                <div style={{ marginTop: 'auto', display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {['Türkçe & İngilizce', 'Alerjen bilgisi', 'Kalori değeri', 'Anlık güncelleme'].map(tag => (
                    <span key={tag} style={{
                      padding: '4px 12px', borderRadius: 100, fontSize: '0.75rem', fontWeight: 600,
                      background: 'rgba(200,136,40,0.1)', border: `1px solid ${pg.border}`, color: pg.amber,
                    }}>{tag}</span>
                  ))}
                </div>
              </div>

              <div
                className={`pg-feature-card pg-reveal${featReveal.visible ? ' pg-visible' : ''} pg-d2`}
                style={{
                  background: 'linear-gradient(135deg, rgba(200,136,40,0.15), rgba(200,136,40,0.05))',
                  border: `1px solid ${pg.border}`,
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 16 }}>⭐</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: pg.cream, marginBottom: 10 }}>Sadakat Programı</h3>
                <p style={{ fontSize: '0.875rem', color: pg.muted, lineHeight: 1.6 }}>Pul bas sistemiyle müşterileri geri getir. Ödülü sen belirlersin.</p>
              </div>

              <div
                className={`pg-feature-card pg-reveal${featReveal.visible ? ' pg-visible' : ''} pg-d3`}
                style={{
                  background: isLight ? 'rgba(255,253,247,0.9)' : 'rgba(26,15,5,0.75)',
                  border: `1px solid ${pg.border}`,
                }}
              >
                <div style={{ fontSize: 32, marginBottom: 16 }}>📊</div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: pg.cream, marginBottom: 10 }}>Anlık Analitik</h3>
                <p style={{ fontSize: '0.875rem', color: pg.muted, lineHeight: 1.6 }}>En çok sipariş edilen ürünler, yoğun saatler, yeni vs. tekrar müşteri oranı.</p>
              </div>

              <div
                className={`pg-feature-card pg-reveal${featReveal.visible ? ' pg-visible' : ''} pg-d4`}
                style={{
                  gridColumn: '2 / 4',
                  background: isLight ? 'rgba(255,253,247,0.9)' : 'rgba(26,15,5,0.75)',
                  border: `1px solid ${pg.border}`,
                  display: 'flex', gap: 24, alignItems: 'flex-start',
                }}
              >
                <div style={{ fontSize: 36, flexShrink: 0 }}>🔗</div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: pg.cream, marginBottom: 8 }}>QR + Sipariş Entegrasyonu</h3>
                  <p style={{ fontSize: '0.875rem', color: pg.muted, lineHeight: 1.6 }}>
                    Her masa için benzersiz QR. Müşteri kendi telefonundan sipariş verir, sen panelden görürsün. Çaycı çağırmak yok.
                  </p>
                </div>
              </div>
            </div>

            <div className={`pg-reveal${featReveal.visible ? ' pg-visible' : ''}`} style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginTop: 16 }}>
              {[
                { icon: '🖨️', title: 'Kişiselleştir', desc: 'Logo, renk, font — markanı yansıt.' },
                { icon: '📲', title: 'SMS Bildirimi', desc: 'Sipariş, ödül, kampanya bildirimleri.' },
                { icon: '🔒', title: 'KVKK Uyumlu', desc: "Müşteri verisi Türkiye'de tutulur." },
              ].map((f, i) => (
                <div key={i} className="pg-feature-card" style={{
                  background: isLight ? 'rgba(255,253,247,0.7)' : 'rgba(26,15,5,0.5)',
                  border: `1px solid ${pg.border}`,
                  display: 'flex', gap: 16, alignItems: 'flex-start',
                }}>
                  <span style={{ fontSize: 24, flexShrink: 0 }}>{f.icon}</span>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: pg.cream, marginBottom: 4 }}>{f.title}</div>
                    <div style={{ fontSize: '0.85rem', color: pg.muted }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── LOYALTY CARD DESIGNER ───────────────────────────────────────────── */}
        <section id="sadakat" style={{ padding: '80px clamp(20px, 5vw, 64px)', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 1240, margin: '0 auto' }}>
            <div ref={loyaltyReveal.ref} className={`pg-reveal${loyaltyReveal.visible ? ' pg-visible' : ''}`}>
              <div style={{
                borderRadius: 28,
                background: isLight
                  ? 'linear-gradient(135deg, rgba(255,253,247,0.95) 0%, rgba(243,235,214,0.7) 100%)'
                  : 'linear-gradient(135deg, rgba(26,15,5,0.85) 0%, rgba(15,10,5,0.9) 100%)',
                border: `1px solid ${pg.border}`,
                padding: 'clamp(32px, 5vw, 56px)',
                boxShadow: isLight ? '0 4px 32px rgba(0,0,0,0.06)' : '0 8px 48px rgba(0,0,0,0.4)',
                display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center',
              }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: pg.amber, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Sadakat Tasarımcısı</div>
                  <h2 className="pg-display" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', color: pg.cream, marginBottom: 16 }}>
                    Müşterini geri<br />getiren kart
                  </h2>
                  <p style={{ fontSize: '1rem', color: pg.muted, lineHeight: 1.7, marginBottom: 32 }}>
                    Kaç pul, ne ödül — sen belirlersin. Kartı markanla tasarla, müşteriler QR&apos;ı okutunca otomatik pul kazanır.
                  </p>
                  <div style={{ marginBottom: 24 }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 600, color: pg.muted, display: 'block', marginBottom: 10 }}>
                      Dolu pul sayısı: <span style={{ color: pg.amber }}>{stampCount}/10</span>
                    </label>
                    <input
                      type="range" min={0} max={10} value={stampCount}
                      onChange={e => setStampCount(Number(e.target.value))}
                      style={{ width: '100%', accentColor: '#C88828' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    {['☕ Kahve', '⭐ Puan', '❤️ Kalp', '👑 Taç', '💎 Elmas'].map(s => (
                      <button key={s} style={{
                        padding: '7px 14px', borderRadius: 100, fontSize: '0.8rem', fontWeight: 600,
                        background: 'rgba(200,136,40,0.1)', border: `1px solid ${pg.border}`,
                        color: pg.amber, cursor: 'pointer',
                        transition: 'background 0.2s, transform 0.15s',
                      }}
                        onMouseEnter={e => { (e.currentTarget).style.background = 'rgba(200,136,40,0.25)'; (e.currentTarget).style.transform = 'scale(1.05)' }}
                        onMouseLeave={e => { (e.currentTarget).style.background = 'rgba(200,136,40,0.1)'; (e.currentTarget).style.transform = 'scale(1)' }}
                      >{s}</button>
                    ))}
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <StampCardPreview filled={stampCount} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── PRICING ─────────────────────────────────────────────────────────── */}
        <section id="fiyatlar" style={{ padding: '80px clamp(20px, 5vw, 64px)', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 1240, margin: '0 auto' }}>
            <div ref={pricingReveal.ref} className={`pg-reveal${pricingReveal.visible ? ' pg-visible' : ''}`} style={{ textAlign: 'center', marginBottom: 56 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: pg.amber, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>Fiyatlandırma</div>
              <h2 className="pg-display" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)', color: pg.cream, marginBottom: 14 }}>
                Şeffaf fiyat,<br />sürpriz yok
              </h2>
              <p style={{ color: pg.muted, fontSize: '1rem' }}>14 gün ücretsiz dene. Kredi kartı gerekmez.</p>
            </div>
            <div className="pg-pricing-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20, alignItems: 'end', paddingBottom: 12 }}>
              {PLANS.map((plan, i) => (
                <div
                  key={i}
                  className={`pg-pricing-card pg-reveal${pricingReveal.visible ? ' pg-visible' : ''} pg-d${i + 1}${plan.highlight ? ' pg-highlight' : ''}`}
                  style={{
                    background: plan.highlight
                      ? 'linear-gradient(135deg, rgba(200,136,40,0.2), rgba(200,136,40,0.08))'
                      : (isLight ? 'rgba(255,253,247,0.9)' : 'rgba(26,15,5,0.75)'),
                    border: plan.highlight ? `2px solid ${pg.amber}` : `1px solid ${pg.border}`,
                    boxShadow: isLight
                      ? (plan.highlight ? '0 24px 64px rgba(200,136,40,0.2)' : '0 4px 20px rgba(0,0,0,0.06)')
                      : (plan.highlight ? '0 24px 64px rgba(200,136,40,0.25)' : '0 8px 32px rgba(0,0,0,0.3)'),
                  }}
                >
                  {plan.highlight && (
                    <div style={{
                      position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                      background: 'linear-gradient(135deg, #C88828, #E8A030)',
                      color: '#0F0A05', fontSize: '0.7rem', fontWeight: 700, letterSpacing: '0.08em',
                      textTransform: 'uppercase', padding: '4px 14px', borderRadius: 100, whiteSpace: 'nowrap',
                    }}>En Popüler</div>
                  )}
                  <div style={{ marginBottom: 6, fontSize: '0.75rem', fontWeight: 700, color: pg.amber, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{plan.name}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 10 }}>
                    <span className="pg-display" style={{ fontSize: '3rem', color: pg.cream }}>₺{plan.price}</span>
                    <span style={{ color: pg.muted, fontSize: '0.875rem' }}>{plan.period}</span>
                  </div>
                  <p style={{ fontSize: '0.875rem', color: pg.muted, marginBottom: 20, lineHeight: 1.6 }}>{plan.desc}</p>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {plan.features.map(f => (
                      <li key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.875rem', color: pg.cream }}>
                        <span style={{ color: pg.amber, fontWeight: 700, fontSize: '1rem', lineHeight: 1 }}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/giris"
                    className={plan.highlight ? 'pg-btn-amber' : 'pg-btn-ghost'}
                    style={{
                      width: '100%', justifyContent: 'center', display: 'inline-flex',
                      ...(plan.highlight ? {} : { color: pg.cream, border: `1px solid ${pg.border}` }),
                    }}
                  >
                    {plan.cta}
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────────────────── */}
        <section id="sss" style={{ padding: '80px clamp(20px, 5vw, 64px)', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 780, margin: '0 auto' }}>
            <div ref={faqReveal.ref} className={`pg-reveal${faqReveal.visible ? ' pg-visible' : ''}`} style={{ textAlign: 'center', marginBottom: 48 }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: pg.amber, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>SSS</div>
              <h2 className="pg-display" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', color: pg.cream }}>Sık sorulan sorular</h2>
            </div>
            <div className={`pg-reveal${faqReveal.visible ? ' pg-visible' : ''}`}>
              {FAQS.map((faq, i) => (
                <div key={i} className="pg-faq-item" style={{ borderColor: pg.border }}>
                  <button className="pg-faq-q" onClick={() => setOpenFaq(openFaq === i ? null : i)} style={{ color: pg.cream }}>
                    <span style={{ fontWeight: 600, fontSize: '0.9375rem', textAlign: 'left' }}>{faq.q}</span>
                    <span className={`pg-chevron${openFaq === i ? ' open' : ''}`} style={{ color: pg.amber, fontSize: '1.25rem', lineHeight: 1 }}>+</span>
                  </button>
                  <div className={`pg-faq-body${openFaq === i ? ' open' : ' closed'}`}>
                    <p style={{ paddingBottom: 20, color: pg.muted, fontSize: '0.9rem', lineHeight: 1.75 }}>{faq.a}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CONTACT ─────────────────────────────────────────────────────────── */}
        <section id="iletisim" style={{ padding: '80px clamp(20px, 5vw, 64px)', position: 'relative', zIndex: 1 }}>
          <div style={{ maxWidth: 1240, margin: '0 auto' }}>
            <div className="pg-contact-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}>
              <div ref={contactReveal.ref} className={`pg-reveal${contactReveal.visible ? ' pg-visible' : ''}`}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: pg.amber, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 12 }}>İletişim</div>
                <h2 className="pg-display" style={{ fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)', color: pg.cream, marginBottom: 16 }}>
                  Soruların mı var?<br />Yazalım.
                </h2>
                <p style={{ color: pg.muted, lineHeight: 1.7, marginBottom: 32 }}>
                  Demo için randevu al, fiyatlar hakkında konuşalım ya da sadece merhaba de.
                  Ekibimiz en geç 1 iş günü içinde döner.
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {[
                    { icon: '📧', label: 'E-posta', val: 'merhaba@garsonsal.app' },
                    { icon: '📍', label: 'Konum', val: 'İstanbul, Türkiye' },
                    { icon: '⏰', label: 'Yanıt süresi', val: 'Genellikle birkaç saat içinde' },
                  ].map(item => (
                    <div key={item.label} style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 12,
                        background: 'rgba(200,136,40,0.1)', border: `1px solid ${pg.border}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0,
                      }}>{item.icon}</div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: pg.muted, marginBottom: 2 }}>{item.label}</div>
                        <div style={{ fontSize: '0.9rem', fontWeight: 600, color: pg.cream }}>{item.val}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={`pg-reveal${contactReveal.visible ? ' pg-visible' : ''} pg-d2`} style={{
                borderRadius: 24,
                background: isLight ? 'rgba(255,253,247,0.9)' : 'rgba(26,15,5,0.75)',
                border: `1px solid ${pg.border}`,
                padding: 32,
                boxShadow: isLight ? '0 4px 24px rgba(0,0,0,0.06)' : '0 8px 32px rgba(0,0,0,0.3)',
              }}>
                {sent ? (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: pg.cream, marginBottom: 8 }}>Mesajın ulaştı!</div>
                    <div style={{ color: pg.muted }}>En kısa sürede geri döneceğiz.</div>
                  </div>
                ) : (
                  <form onSubmit={handleContact} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: pg.muted, marginBottom: 6 }}>Ad Soyad</label>
                        <input className="input-dark" placeholder="Ahmet Yılmaz" value={contact.name} onChange={e => setContact(p => ({ ...p, name: e.target.value }))} required />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: pg.muted, marginBottom: 6 }}>Telefon</label>
                        <input className="input-dark" placeholder="0532 000 00 00" value={contact.phone} onChange={e => setContact(p => ({ ...p, phone: e.target.value }))} />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: pg.muted, marginBottom: 6 }}>E-posta</label>
                      <input className="input-dark" type="email" placeholder="ahmet@kafem.com" value={contact.email} onChange={e => setContact(p => ({ ...p, email: e.target.value }))} required />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: pg.muted, marginBottom: 6 }}>Mesajın</label>
                      <textarea className="input-dark" placeholder="Merhaba, Garsonsal hakkında bilgi almak istiyorum..." value={contact.msg} onChange={e => setContact(p => ({ ...p, msg: e.target.value }))} rows={4} required style={{ resize: 'none' }} />
                    </div>
                    <button type="submit" className="pg-btn-amber" style={{ width: '100%', justifyContent: 'center' }}>
                      Gönder →
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ── FOOTER ──────────────────────────────────────────────────────────── */}
        <footer style={{
          padding: '48px clamp(20px, 5vw, 64px) 32px',
          borderTop: `1px solid ${pg.border}`,
          position: 'relative', zIndex: 1,
        }}>
          <div style={{ maxWidth: 1240, margin: '0 auto' }}>
            <div className="pg-footer-grid" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 48, marginBottom: 48 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <span style={{ fontSize: 22 }}>☕</span>
                  <span className="pg-display" style={{
                    fontSize: '1.3rem',
                    background: 'linear-gradient(135deg, #C88828, #E8A030)',
                    WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                  }}>Garsonsal</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: pg.muted, lineHeight: 1.7, maxWidth: 280 }}>
                  Türkiye&apos;nin kafeleri için dijital menü, QR sipariş ve sadakat platformu.
                </p>
              </div>
              {[
                { title: 'Ürün', links: ['Özellikler', 'Fiyatlar', 'Güvenlik', 'Güncellemeler'] },
                { title: 'Şirket', links: ['Hakkımızda', 'Blog', 'Kariyer', 'İletişim'] },
              ].map(col => (
                <div key={col.title}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: pg.amber, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>{col.title}</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {col.links.map(l => (
                      <a key={l} href="#" style={{ fontSize: '0.875rem', color: pg.muted, textDecoration: 'none', transition: 'color 0.15s' }}
                        onMouseEnter={e => (e.currentTarget.style.color = pg.cream)}
                        onMouseLeave={e => (e.currentTarget.style.color = pg.muted)}
                      >{l}</a>
                    ))}
                  </div>
                </div>
              ))}
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: pg.amber, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16 }}>Hukuki</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {[
                    { label: 'Gizlilik Politikası', href: '/gizlilik-politikasi' },
                    { label: 'Kullanım Koşulları', href: '/kullanim-kosullari' },
                    { label: 'Çerez Politikası', href: '/cerez-politikasi' },
                    { label: 'KVKK', href: '#' },
                  ].map(l => (
                    <Link key={l.label} href={l.href} style={{ fontSize: '0.875rem', color: pg.muted, textDecoration: 'none', transition: 'color 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.color = pg.cream)}
                      onMouseLeave={e => (e.currentTarget.style.color = pg.muted)}
                    >{l.label}</Link>
                  ))}
                </div>
              </div>
            </div>
            <div style={{
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              paddingTop: 24, borderTop: `1px solid ${pg.border}`, flexWrap: 'wrap', gap: 12,
            }}>
              <div style={{ fontSize: '0.8rem', color: pg.muted }}>© 2025 Garsonsal Teknoloji A.Ş. Tüm hakları saklıdır.</div>
              <div style={{ display: 'flex', gap: 20 }}>
                {['Twitter', 'LinkedIn', 'Instagram'].map(s => (
                  <a key={s} href="#" style={{ fontSize: '0.8rem', color: pg.muted, textDecoration: 'none', transition: 'color 0.15s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = pg.amber)}
                    onMouseLeave={e => (e.currentTarget.style.color = pg.muted)}
                  >{s}</a>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}
