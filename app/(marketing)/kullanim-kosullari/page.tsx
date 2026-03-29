import Link from 'next/link'

export const metadata = {
  title: 'Kullanım Koşulları — Garsonsal',
  description: 'Garsonsal hizmet kullanım koşulları',
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-8">
    <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--color-white)' }}>{title}</h2>
    <div className="text-sm leading-relaxed space-y-2" style={{ color: 'var(--color-muted)' }}>{children}</div>
  </div>
)

export default function KullanimKosullari() {
  return (
    <div className="min-h-screen py-16" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <Link href="/" className="text-sm hover:underline" style={{ color: 'var(--color-accent-2)' }}>← Ana Sayfa</Link>
        </div>

        <div className="glass-elevated p-8 md:p-12">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-white)' }}>Kullanım Koşulları</h1>
          <p className="text-sm mb-8" style={{ color: 'var(--color-muted)' }}>Son güncelleme: Ocak 2025</p>

          <Section title="1. Hizmet Tanımı">
            <p>
              Garsonsal; kafe ve restoranlar için QR tabanlı sipariş yönetimi, dijital sadakat kartı ve gerçek zamanlı panel hizmetleri sunan bir SaaS (Hizmet Olarak Yazılım) platformudur.
            </p>
            <p>
              Platform kullanımına başlamanız, bu Kullanım Koşulları&apos;nı okuduğunuzu ve kabul ettiğinizi gösterir.
            </p>
          </Section>

          <Section title="2. Kullanım Kuralları">
            <p>Platforma erişim ve kullanım için aşağıdaki kurallara uymanız gerekmektedir:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Hesap bilgilerini üçüncü taraflarla paylaşmamak</li>

              <li>Sisteme zarar verebilecek kötü amaçlı yazılım veya kod yüklememek</li>
              <li>Platformu yalnızca yasal amaçlarla kullanmak</li>
              <li>Diğer kullanıcıların verilerine yetkisiz erişim sağlamamak</li>
              <li>Hizmetlerin normal işleyişini engelleyecek aşırı yük oluşturmamak</li>
            </ul>
          </Section>

          <Section title="3. Abonelik & Ödeme">
            <p>
              Garsonsal hizmetleri aylık veya yıllık abonelik modeliyle sunulmaktadır. Fiyatlandırma, plan özellikleri ve ödeme koşulları web sitesinde belirtildiği şekilde geçerlidir.
            </p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Abonelikler otomatik olarak yenilenmez; manuel uzatma gerektirir</li>
              <li>Ödeme başarısız olduğunda hizmet erişimi askıya alınabilir</li>
              <li>İndirim kodları yalnızca geçerli oldukları plan ve dönem için uygulanır</li>
              <li>7 günlük ücretsiz deneme süreci sonunda otomatik ücret alınmaz</li>
            </ul>
          </Section>

          <Section title="4. Hizmet Kesintisi Politikası">
            <div className="p-4 rounded-xl" style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)' }}>
              <p style={{ color: 'var(--color-white)' }}>
                Garsonsal, kesintisiz ve güvenilir hizmet sunmayı öncelikli hedef olarak benimser. Bununla birlikte, öngörülemeyen teknik arızalar, altyapı kesintileri veya olağanüstü durumlar nedeniyle hizmetin geçici ya da kalıcı olarak sonlandırılması halinde, kullanıcılar tarafından önceden ödenmiş abonelik ücretleri iade kapsamı dışında tutulmaktadır. Abonelik satın alımının tamamlanması, işbu koşulların kullanıcı tarafından okunup kabul edildiği anlamına gelmektedir.
              </p>
            </div>
          </Section>

          <Section title="5. Fikri Mülkiyet">
            <p>
              Garsonsal platformu, logosu, marka adı, arayüzü ve yazılım kodu dahil tüm içerikler Garsonsal Teknoloji&apos;nin mülkiyetindedir ve telif hakkı yasalarıyla korunmaktadır.
            </p>
            <p>
              Kullanıcılar, platforma yükledikleri menü içerikleri, logo ve görsellerin fikri mülkiyet haklarına sahip olduklarını beyan ederler. Üçüncü şahıs haklarını ihlal eden içerikler kaldırılabilir.
            </p>
          </Section>

          <Section title="6. Sorumluluk Sınırlaması">
            <p>
              Garsonsal, platformun kullanımından doğabilecek dolaylı, tesadüfi veya sonuçsal zararlardan sorumlu değildir. Platformun maksimum sorumluluğu, ilgili dönemde ödenen abonelik ücreti ile sınırlıdır.
            </p>
          </Section>

          <Section title="7. Değişiklikler">
            <p>
              Garsonsal, bu koşulları önceden bildirmeksizin güncelleme hakkını saklı tutar. Değişiklikler web sitesinde yayınlandığı andan itibaren geçerli olur. Platform kullanımının sürdürülmesi, güncel koşulların kabul edildiği anlamına gelir.
            </p>
          </Section>

          <Section title="8. İletişim">
            <p><strong style={{ color: 'var(--color-white)' }}>E-posta:</strong> legal@garsonsal.com</p>
          </Section>
        </div>
      </div>
    </div>
  )
}
