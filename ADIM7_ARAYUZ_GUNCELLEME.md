# ADIM 7 — Kapsamlı Arayüz & Özellik Güncellemesi

## CLAUDE CODE KURALLARI
- Kullanıcı onayı bekleme, kendi ilerle
- Her adımı tamamla, sonrakine geç
- Playwright ile her değişiklik sonrası screenshot al
- Hata görürsen düzelt, tekrar screenshot al
- Bitince GitHub'a push et

---

## 1. DARK/LIGHT MODE SİSTEMİ

Tüm sitede (landing page + tüm paneller) dark/light mode ekle.

### Teknik Kurulum
```bash
npm install next-themes
```

- `app/layout.tsx` içine `ThemeProvider` ekle
- Navbar'a theme toggle butonu ekle (Güneş/Ay ikonu, lucide-react)
- Tüm renkler CSS variables ile çalışsın

### Renk Değişkenleri
```css
/* Light Mode */
:root {
  --bg: #ffffff;
  --bg-surface: #f8fafc;
  --bg-card: #ffffff;
  --border: #e2e8f0;
  --text-primary: #0f172a;
  --text-muted: #64748b;
  --primary: #0077b6;
  --accent: #00b4d8;
}

/* Dark Mode */
.dark {
  --bg: #000d1a;
  --bg-surface: #0a1628;
  --bg-card: rgba(255,255,255,0.04);
  --border: #0e2a4a;
  --text-primary: #ffffff;
  --text-muted: #94a3b8;
  --primary: #0077b6;
  --accent: #00b4d8;
}
```

### Logo Dark/Light Uyumu
- Dark modda: logo beyaz (#ffffff) renkte görünsün
- Light modda: logo koyu (#0f172a) renkte görünsün
- `public/logo.svg` içinde `currentColor` kullan
- `<img>` yerine inline SVG veya CSS filter ile renk değiştir:
  ```css
  .dark .logo { filter: brightness(0) invert(1); }
  .light .logo { filter: brightness(0); }
  ```

---

## 2. BUTON BİLEŞENLERİ (21st.dev)

### Kurulum
```bash
npm install @radix-ui/react-slot class-variance-authority
```

### Dosyalar
- `components/ui/liquid-glass-button.tsx` — LiquidButton, MetalButton
- `components/ui/multi-type-ripple-buttons.tsx` — RippleButton
- `components/ui/animated-glassy-pricing.tsx` — ModernPricingPage, PricingCard

### Kullanım
- CTA butonları (Hero, Pricing): `LiquidButton`
- Panel butonları: `RippleButton` default variant
- Fiyatlandırma sayfası: `ModernPricingPage` component

---

## 3. FİYATLANDIRMA SAYFASI

Landing page fiyatlandırma seksiyonunu `ModernPricingPage` ile değiştir:

```tsx
const plans = [
  {
    planName: 'Starter',
    description: 'Küçük kafeler için ideal başlangıç.',
    price: '89',
    features: [
      '1 Şube',
      '15 Masaya Kadar QR',
      'Sipariş Paneli',
      'Garson Çağırma',
      'Menü Yönetimi',
      'Loyalty (500 Üye)',
      '7 Gün Ücretsiz Deneme'
    ],
    buttonText: 'Başlayın',
    buttonVariant: 'secondary'
  },
  {
    planName: 'Growth',
    description: 'Büyümek isteyen işletmeler için.',
    price: '119',
    features: [
      '3 Şube',
      'Sınırsız Masa QR',
      'Starter\'daki Her Şey',
      'Loyalty (5.000 Üye)',
      'Push Bildirim & Kampanya',
      'Müşteri CRM & Analitik',
      '7 Gün Ücretsiz Deneme'
    ],
    buttonText: 'Başlayın',
    isPopular: true,
    buttonVariant: 'primary'
  },
  {
    planName: 'Pro',
    description: 'Zincir işletmeler için sınırsız güç.',
    price: '189',
    features: [
      'Sınırsız Şube',
      'Sınırsız Her Şey',
      'Growth\'daki Her Şey',
      'White-label',
      'Öncelikli Destek',
      '7 Gün Ücretsiz Deneme'
    ],
    buttonText: 'İletişime Geçin',
    buttonVariant: 'primary'
  }
]
```

---

## 4. LANDING PAGE — LOYALTY KARTI CANLI ÖNİZLEME

Referans: `https://sadakart.net/tr` — "Kendi Sadakat Kartınızı Tasarımlayın" bölümü

Landing page'e yeni bir seksiyon ekle:

### Başlık
"Sadakat Kartınızı Tasarımlayın"
Alt: "Müşterilerinizin telefonuna eklenecek kartı şimdi özelleştirin"

### Sol Panel — Kontroller
- **Renkler:**
  - Kart arka plan rengi (color picker, 8 hazır seçenek)
  - Metin rengi (color picker)
- **Şirket Bilgileri:**
  - Şirket adı (text input)
  - Logo URL (optional input)
- **Pullar:**
  - Pul adı (text input)
  - İkon seçimi (kahve, yıldız, kalp, taç, elmas — SVG ikonlar)
  - Maksimum pul sayısı (1-10 slider)
- **Ödül:**
  - Ödül açıklaması (text input)

### Sağ Panel — Canlı Önizleme
Apple Wallet tarzı kart önizlemesi (CSS ile):
```
┌─────────────────────────────┐
│ [Logo]  Şirket Adı          │
│                             │
│  ☕ ☕ ☕ ○ ○ ○ ○           │
│  Kahve  3/7                 │
│                             │
│  Ödül: 1 Bedava Kahve       │
│  Üye Kodu: 123456           │
│  ▣ QR                       │
│              by Garsonsal   │
└─────────────────────────────┘
```

Kart stilleri:
- Rounded corners: 20px
- Kart boyutu: 380x240px
- Glassmorphism efekt
- Seçilen renkler anında yansır (useState)
- Pul ikonları dolu/boş durumu gösterir

---

## 5. LOYALTY PANELİ GÜNCELLEMESİ

`app/(dashboard)/panel/loyalty/` sayfasını yeniden tasarla.

### Kart Tasarımcısı Bölümü
Landing page'deki canlı önizleme bileşenini buraya da entegre et.
İşletme buradan kart tasarımını kaydedebilsin.

### Logo Yükleme
- "Logo Yükle" butonu — Supabase Storage'a yükle
- Yüklenen logo kart önizlemesinde anında görünsün
- Desteklenen formatlar: PNG, SVG, JPG (max 2MB)

### Pul Basma Arayüzü
Mevcut arayüzü temizle, şu şekilde yeniden düzenle:
```
┌─────────────────────────────────┐
│ Pul Bas                         │
│                                 │
│ Müşteri Kodu: [_____________]   │
│                    [Ara]        │
│                                 │
│ Bulunan: Ahmet Yılmaz          │
│ Mevcut pul: ☕☕☕○○○○ (3/7)   │
│                                 │
│ [+ Pul Ekle]  [Ödül Kullanıldı]│
└─────────────────────────────────┘
```

---

## 6. QR KODLARI PANELİ GÜNCELLEMESİ

`app/(dashboard)/panel/qr/` sayfasını yeniden düzenle.

### Mevcut QR Grid
- Her masa için kart görünümü
- Kart üzerinde: Masa No, QR kod görseli (qrcode.react ile render)
- Her kartın altında:
  - "İndir" butonu — PNG olarak indirir
  - "Yazdır" butonu — sadece o QR'ı yazdırır

### QR Üretim Mantığı
```tsx
import QRCode from 'qrcode'
// Her masa için:
// URL: https://garsonsal.vercel.app/menu/[slug]/[masa-no]
// QR data URL olarak üret, <img> içinde göster
// İndirme: canvas.toBlob() ile PNG indir
```

### PDF Export
"Tümünü PDF İndir" butonu — tüm masaların QR kodlarını tek PDF'de topla
Her sayfada: 1 QR kodu + Masa No yazısı + İşletme adı

---

## 7. AYARLAR PANELİ YENİDEN TASARIMI

`app/(dashboard)/panel/settings/` sayfasını sıfırdan yaz.

### Sekmeli Yapı
Tab 1: **Genel Bilgiler**
- İşletme adı
- E-posta
- Telefon
- Adres

Tab 2: **Görünüm & Marka**
- Logo yükle (Supabase Storage)
- Menü sayfası renkleri:
  - "Ana Renk" — 8 hazır seçenek, görsel renk kutuları
  - "Arka Plan Rengi" — 8 hazır seçenek
  - Canlı önizleme: "Menünüz şöyle görünecek"
- Açıklama: Her renk kutusunun altında kısa etiket

Tab 3: **Güvenlik**
- Mevcut şifre
- Yeni şifre
- Şifre tekrar
- Kaydet butonu

Tab 4: **Abonelik**
- Mevcut plan badge
- Plan özellikleri listesi
- "Planı Yükselt" butonu (Growth/Pro için)
- Trial kalan süre (varsa)

---

## 8. POLİTİKA SAYFALARI

Şu sayfalara boş şablon oluştur, içini Garsonsal adına doldur:

### `app/(marketing)/gizlilik-politikasi/page.tsx`
KVKK uyumlu gizlilik politikası.
Başlıklar: Toplanan Veriler, Kullanım Amacı, Saklama Süresi, Haklarınız, İletişim

### `app/(marketing)/kullanim-kosullari/page.tsx`
Hizmet şartları.
Başlıklar: Hizmet Tanımı, Kullanım Kuralları, Abonelik & Ödeme, Hizmet Kesintisi Politikası, Fikri Mülkiyet

**Hizmet Kesintisi maddesi (bu metni kullan):**
> "Garsonsal, kesintisiz ve güvenilir hizmet sunmayı öncelikli hedef olarak benimser. Bununla birlikte, öngörülemeyen teknik arızalar, altyapı kesintileri veya olağanüstü durumlar nedeniyle hizmetin geçici ya da kalıcı olarak sonlandırılması halinde, kullanıcılar tarafından önceden ödenmiş abonelik ücretleri iade kapsamı dışında tutulmaktadır. Abonelik satın alımının tamamlanması, işbu koşulların kullanıcı tarafından okunup kabul edildiği anlamına gelmektedir."

### `app/(marketing)/cerez-politikasi/page.tsx`
Çerez politikası. GDPR uyumlu.

### Footer Güncellemesi
Footer'daki politika linklerini bu sayfalara bağla.

---

## 9. REFERANS SİTE ANALİZİ & TASARIM KALİTESİ

Referans: `https://happyhorizon.com/en/`

### Happy Horizon'dan Alınacak Tasarım İlkeleri
- Temiz, nefes alan layout
- Büyük bold başlıklar, hafif alt metinler
- Minimal navbar — logo sol, menü sağ
- Seksiyonlar arası bol whitespace
- İçerik önce, dekorasyon sonra

### Garsonsal'a Uyarlama
- Happy Horizon: light, beyaz arkaplan
- Garsonsal: dark base (#000d1a) + light mode seçeneği
- Aynı temiz layout anlayışı, dark renk paletinde

---

## 10. MOBİL UYUMLULUK

Tüm sayfalar için:
- Breakpoints: sm(640) md(768) lg(1024) xl(1280)
- Navbar: mobile hamburger menu
- Panel sidebar: mobile'da drawer/overlay
- Kartlar: mobile'da tek kolon
- QR grid: mobile'da 2 kolon
- Loyalty kart önizleme: mobile'da tam genişlik

---

## 11. PLAYWRIGHT VISUAL FEEDBACK LOOP

```bash
npm install -D @playwright/test
npx playwright install chromium
```

Test senaryoları:
1. Her sayfanın dark mode screenshot'ı
2. Her sayfanın light mode screenshot'ı  
3. Mobile (375px) screenshot'lar
4. Tablet (768px) screenshot'lar

Döngü:
- Screenshot al → incele → hata varsa düzelt → tekrar screenshot → karşılaştır
- Tüm sayfalar temiz görünene kadar devam et

Screenshot klasörü: `test-results/screenshots/`

---

## 12. GITHUB PUSH

Tüm değişiklikler tamamlandıktan sonra:
```bash
git add .
git commit -m "feat: dark/light mode, UI overhaul, QR download, loyalty designer"
git push
```

Vercel otomatik deploy başlatacak.
