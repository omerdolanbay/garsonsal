import Link from 'next/link'

export const metadata = {
  title: 'Çerez Politikası — Garsonsal',
  description: 'Garsonsal GDPR uyumlu çerez politikası',
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-8">
    <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--color-white)' }}>{title}</h2>
    <div className="text-sm leading-relaxed space-y-2" style={{ color: 'var(--color-muted)' }}>{children}</div>
  </div>
)

export default function CerezPolitikasi() {
  return (
    <div className="min-h-screen py-16" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <Link href="/" className="text-sm hover:underline" style={{ color: 'var(--color-accent-2)' }}>← Ana Sayfa</Link>
        </div>

        <div className="glass-elevated p-8 md:p-12">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-white)' }}>Çerez Politikası</h1>
          <p className="text-sm mb-8" style={{ color: 'var(--color-muted)' }}>Son güncelleme: Ocak 2025 · GDPR Uyumlu</p>

          <Section title="1. Çerezler Nedir?">
            <p>
              Çerezler (&quot;cookies&quot;), web sitelerinin tarayıcınıza gönderdiği ve cihazınızda saklanan küçük metin dosyalarıdır. Bu dosyalar oturum yönetimi, tercih hatırlama ve analitik gibi amaçlarla kullanılır.
            </p>
          </Section>

          <Section title="2. Kullandığımız Çerez Türleri">
            <div className="space-y-4 mt-2">
              <div className="p-4 rounded-xl" style={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-border)' }}>
                <p className="font-semibold mb-1" style={{ color: 'var(--color-white)' }}>Zorunlu Çerezler</p>
                <p>Platform işlevselliği için gereklidir. Oturum yönetimi ve güvenlik için kullanılır. Bu çerezler devre dışı bırakılamaz.</p>
                <p className="mt-2 text-xs" style={{ color: 'var(--color-accent-2)' }}>Örnekler: sb-auth-token (Supabase oturumu), theme (tema tercihi)</p>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-border)' }}>
                <p className="font-semibold mb-1" style={{ color: 'var(--color-white)' }}>Tercih Çerezleri</p>
                <p>Dil seçimi, tema tercihi gibi kişiselleştirme ayarlarını hatırlamak için kullanılır.</p>
                <p className="mt-2 text-xs" style={{ color: 'var(--color-accent-2)' }}>Örnekler: lang (dil), theme (dark/light modu)</p>
              </div>
              <div className="p-4 rounded-xl" style={{ background: 'var(--color-card-bg)', border: '1px solid var(--color-border)' }}>
                <p className="font-semibold mb-1" style={{ color: 'var(--color-white)' }}>Analitik Çerezler (İsteğe Bağlı)</p>
                <p>Platformun nasıl kullanıldığını anlamak ve iyileştirmek amacıyla anonim kullanım verisi toplanır. Kişisel veri içermez.</p>
              </div>
            </div>
          </Section>

          <Section title="3. Çerez Yönetimi">
            <p>Tarayıcı ayarlarınızdan çerezleri yönetebilirsiniz:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong style={{ color: 'var(--color-white)' }}>Chrome:</strong> Ayarlar → Gizlilik ve Güvenlik → Çerezler</li>
              <li><strong style={{ color: 'var(--color-white)' }}>Firefox:</strong> Ayarlar → Gizlilik ve Güvenlik → Çerezler</li>
              <li><strong style={{ color: 'var(--color-white)' }}>Safari:</strong> Tercihler → Gizlilik → Çerezler</li>
            </ul>
            <p className="mt-3">
              <strong style={{ color: '#f59e0b' }}>Dikkat:</strong> Zorunlu çerezlerin engellenmesi, platform işlevselliğini olumsuz etkileyebilir.
            </p>
          </Section>

          <Section title="4. GDPR Kapsamındaki Haklarınız">
            <p>Avrupa Birliği kullanıcıları için GDPR kapsamında:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Çerez kullanımını reddetme veya geri çekme hakkı</li>
              <li>Saklanan verilere erişim talep etme hakkı</li>
              <li>Verilerinizin silinmesini talep etme hakkı (&quot;unutulma hakkı&quot;)</li>
              <li>Veri taşınabilirliği hakkı</li>
            </ul>
          </Section>

          <Section title="5. Üçüncü Taraf Çerezleri">
            <p>
              Garsonsal, Supabase (veritabanı ve kimlik doğrulama) gibi üçüncü taraf hizmetler kullanmaktadır. Bu hizmetlerin kendi çerez politikaları mevcuttur. Ayrıntılar için ilgili servislerin politikalarını inceleyiniz.
            </p>
          </Section>

          <Section title="6. İletişim">
            <p>Çerez politikasına ilişkin sorularınız için: <strong style={{ color: 'var(--color-white)' }}>privacy@garsonsal.com</strong></p>
          </Section>
        </div>
      </div>
    </div>
  )
}
