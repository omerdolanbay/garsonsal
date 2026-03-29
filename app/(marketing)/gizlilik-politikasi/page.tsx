import Link from 'next/link'

export const metadata = {
  title: 'Gizlilik Politikası — Garsonsal',
  description: 'Garsonsal KVKK uyumlu gizlilik politikası',
}

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="mb-8">
    <h2 className="text-lg font-bold mb-3" style={{ color: 'var(--color-white)' }}>{title}</h2>
    <div className="text-sm leading-relaxed space-y-2" style={{ color: 'var(--color-muted)' }}>{children}</div>
  </div>
)

export default function GizlilikPolitikasi() {
  return (
    <div className="min-h-screen py-16" style={{ background: 'var(--color-bg)' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <Link href="/" className="text-sm hover:underline" style={{ color: 'var(--color-accent-2)' }}>← Ana Sayfa</Link>
        </div>

        <div className="glass-elevated p-8 md:p-12">
          <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-white)' }}>Gizlilik Politikası</h1>
          <p className="text-sm mb-8" style={{ color: 'var(--color-muted)' }}>Son güncelleme: Ocak 2025 · KVKK Uyumlu</p>

          <Section title="1. Toplanan Veriler">
            <p>Garsonsal olarak hizmetlerimizi sunabilmek için aşağıdaki kişisel verilerinizi işlemekteyiz:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li><strong style={{ color: 'var(--color-white)' }}>İşletme sahipleri:</strong> Ad soyad, e-posta adresi, telefon numarası, işletme adı ve adresi.</li>
              <li><strong style={{ color: 'var(--color-white)' }}>Sadakat programı üyeleri:</strong> Ad soyad, telefon numarası, e-posta adresi (isteğe bağlı), üyelik kodu, pul geçmişi.</li>
              <li><strong style={{ color: 'var(--color-white)' }}>Teknik veriler:</strong> IP adresi, tarayıcı türü, kullanım istatistikleri, çerez verileri.</li>
            </ul>
          </Section>

          <Section title="2. Kullanım Amacı">
            <p>Toplanan veriler yalnızca aşağıdaki amaçlarla kullanılmaktadır:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Sipariş yönetimi, menü gösterimi ve garson çağırma hizmetlerinin sunulması</li>
              <li>Dijital sadakat kartı sisteminin işletilmesi</li>
              <li>Hesap güvenliğinin sağlanması ve kimlik doğrulama</li>
              <li>Hizmet kalitesinin iyileştirilmesi ve teknik destek</li>
              <li>Yasal yükümlülüklerin yerine getirilmesi</li>
            </ul>
          </Section>

          <Section title="3. Saklama Süresi">
            <p>Kişisel verileriniz, işleme amacının ortadan kalkmasına kadar veya yasal saklama süreleri boyunca saklanır:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>İşletme hesap verileri: Hesap silme tarihinden itibaren 3 yıl</li>
              <li>Sadakat üye verileri: Son işlem tarihinden itibaren 2 yıl</li>
              <li>Sipariş kayıtları: Yasal gereklilik kapsamında 5 yıl</li>
              <li>Log kayıtları: 1 yıl</li>
            </ul>
          </Section>

          <Section title="4. Veri Güvenliği">
            <p>Verileriniz endüstri standardı güvenlik önlemleriyle korunmaktadır:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Tüm iletişim TLS/SSL şifreleme ile korunmaktadır</li>
              <li>Veriler Supabase altyapısında (EU bölgesi) şifreli olarak depolanmaktadır</li>
              <li>Şifreler bcrypt ile hashlenerek saklanmaktadır</li>
              <li>Üçüncü taraflarla verileriniz paylaşılmamaktadır</li>
            </ul>
          </Section>

          <Section title="5. Haklarınız (KVKK Madde 11)">
            <p>6698 sayılı KVKK kapsamında aşağıdaki haklara sahipsiniz:</p>
            <ul className="list-disc pl-5 space-y-1 mt-2">
              <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
              <li>İşlenmişse bilgi talep etme</li>
              <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
              <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
              <li>Eksik veya yanlış işlenmişse düzeltilmesini isteme</li>
              <li>Silinmesini veya yok edilmesini isteme</li>
              <li>Otomatik sistemler vasıtasıyla aleyhinize sonuç doğurması durumunda itiraz etme</li>
            </ul>
          </Section>

          <Section title="6. İletişim">
            <p>Gizlilik politikası hakkındaki sorularınız için:</p>
            <p className="mt-2"><strong style={{ color: 'var(--color-white)' }}>E-posta:</strong> privacy@garsonsal.com</p>
            <p><strong style={{ color: 'var(--color-white)' }}>Adres:</strong> Garsonsal Teknoloji, Türkiye</p>
          </Section>
        </div>
      </div>
    </div>
  )
}
