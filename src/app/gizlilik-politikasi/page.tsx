// app/gizlilik-politikasi/page.tsx
import { Card, CardContent } from '@/components/ui/card'

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Gizlilik Politikası</h1>
        
        <div className="prose prose-lg max-w-none space-y-6">
          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">1. Genel Bilgiler</h2>
              <p className="text-gray-700 leading-relaxed">
                Çiçek Dükkanım olarak, kişisel verilerinizin güvenliği bizim için son derece önemlidir. 
                Bu politika, topladığımız bilgileri, nasıl kullandığımızı ve koruduğumuzu açıklar.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">2. Toplanan Bilgiler</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Hizmetlerimizi sunabilmek için aşağıdaki bilgileri topluyoruz:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Ad, soyad ve iletişim bilgileri</li>
                <li>E-posta adresi ve telefon numarası</li>
                <li>Teslimat adresi bilgileri</li>
                <li>Ödeme bilgileri (güvenli ödeme sistemleri üzerinden)</li>
                <li>Sipariş geçmişi ve tercihler</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">3. Bilgilerin Kullanımı</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                Topladığımız bilgileri şu amaçlarla kullanırız:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Siparişlerinizi işlemek ve teslimat yapmak</li>
                <li>Müşteri hizmetleri desteği sağlamak</li>
                <li>Hesabınızı yönetmek ve güvenliğini sağlamak</li>
                <li>Kampanya ve özel teklifler hakkında bilgilendirmek (onay vermeniz durumunda)</li>
                <li>Hizmet kalitemizi geliştirmek</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">4. Bilgi Güvenliği</h2>
              <p className="text-gray-700 leading-relaxed">
                Kişisel verilerinizin güvenliğini sağlamak için SSL sertifikası, güvenli ödeme sistemleri 
                ve şifreleme teknolojileri kullanıyoruz. Bilgileriniz üçüncü şahıslarla paylaşılmaz.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">5. Çerezler (Cookies)</h2>
              <p className="text-gray-700 leading-relaxed">
                Web sitemiz, kullanıcı deneyimini iyileştirmek için çerezler kullanır. Çerezleri 
                tarayıcı ayarlarınızdan yönetebilirsiniz.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">6. Haklarınız</h2>
              <p className="text-gray-700 leading-relaxed mb-3">
                KVKK kapsamında aşağıdaki haklara sahipsiniz:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Kişisel verilerinizin işlenip işlenmediğini öğrenme</li>
                <li>İşlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme</li>
                <li>Yurt içinde veya yurt dışında aktarıldığı üçüncü kişileri bilme</li>
                <li>Eksik veya yanlış işlenmiş verilerin düzeltilmesini isteme</li>
                <li>Verilerin silinmesini veya yok edilmesini isteme</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">7. İletişim</h2>
              <p className="text-gray-700 leading-relaxed">
                Gizlilik politikamız hakkında sorularınız için: <br />
                <strong>E-posta:</strong> kvkk@cicekdukkanim.com<br />
                <strong>Telefon:</strong> +90 (212) 123 45 67
              </p>
            </CardContent>
          </Card>

          <p className="text-sm text-gray-500 text-center pt-6">
            Son Güncelleme: Kasım 2024
          </p>
        </div>
      </div>
    </div>
  )
}

// app/kullanim-kosullari/page.tsx
export function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Kullanım Koşulları</h1>
        
        <div className="prose prose-lg max-w-none space-y-6">
          <Card>
            <CardContent className="pt-6">
              <p className="text-gray-700 leading-relaxed">
                Çiçek Dükkanım web sitesini kullanarak aşağıdaki koşulları kabul etmiş sayılırsınız.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">1. Hizmet Kapsamı</h2>
              <p className="text-gray-700 leading-relaxed">
                Çiçek Dükkanım, online çiçek siparişi ve teslimat hizmeti sunmaktadır. 
                Ürün görselleri temsilidir ve gerçek ürünlerde küçük farklılıklar olabilir.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">2. Sipariş ve Teslimat</h2>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li>Siparişler onaylandıktan sonra iptal edilemez</li>
                <li>Teslimat adresi doğru girilmelidir</li>
                <li>Alıcı teslimat sırasında ulaşılabilir olmalıdır</li>
                <li>Teslim edilemeyen siparişler için ek ücret talep edilebilir</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">3. Ödeme</h2>
              <p className="text-gray-700 leading-relaxed">
                Tüm ödemeler güvenli ödeme sistemleri üzerinden yapılır. Kredi kartı bilgileriniz 
                saklanmaz ve üçüncü şahıslarla paylaşılmaz.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">4. İade ve İptal</h2>
              <p className="text-gray-700 leading-relaxed">
                Çiçekler doğal ürün olduğu için iade kabul edilmez. Ancak hasarlı veya eksik 
                teslimat durumunda 24 saat içinde bildirilmesi halinde yeni ürün gönderilir veya 
                ücret iadesi yapılır.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold mb-4">5. Fikri Mülkiyet</h2>
              <p className="text-gray-700 leading-relaxed">
                Web sitesindeki tüm içerik, görsel ve tasarımlar Çiçek Dükkanım'a aittir ve 
                izinsiz kullanılamaz.
              </p>
            </CardContent>
          </Card>

          <p className="text-sm text-gray-500 text-center pt-6">
            Son Güncelleme: Kasım 2024
          </p>
        </div>
      </div>
    </div>
  )
}