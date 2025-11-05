// app/hakkimizda/page.tsx
import { Metadata } from 'next'
import { Card, CardContent } from '@/components/ui/card'
import { Heart, Award, Truck, Shield } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Hakkımızda',
  description: 'Çiçek Dükkanım olarak, 2020 yılından bu yana taze çiçekler ve özel buketlerle özel günlerinizi daha anlamlı hale getiriyoruz.',
}

export default function AboutPage() {
  const features = [
    {
      icon: Heart,
      title: 'Taze & Kaliteli',
      description: 'Her gün taze çiçeklerle özenle hazırladığımız buketler',
    },
    {
      icon: Award,
      title: 'Profesyonel Ekip',
      description: 'Deneyimli floristlerimizle kusursuz aranjmanlar',
    },
    {
      icon: Truck,
      title: 'Hızlı Teslimat',
      description: 'Aynı gün teslimat garantisi ile kapınıza kadar',
    },
    {
      icon: Shield,
      title: 'Güvenli Alışveriş',
      description: '100% güvenli ödeme ve müşteri memnuniyeti',
    },
  ]

  const timeline = [
    { year: '2020', title: 'Kuruluş', description: 'İstanbul\'da ilk çiçekçimizi açtık' },
    { year: '2021', title: 'Büyüme', description: 'Online satışa başladık ve Türkiye geneline teslimat' },
    { year: '2022', title: 'Genişleme', description: '10.000+ mutlu müşteri' },
    { year: '2023', title: 'Yenileme', description: 'Yeni mağaza ve geniş ürün yelpazesi' },
    { year: '2024', title: 'Bugün', description: 'Türkiye\'nin en güvenilir çiçek markası' },
  ]

  return (
    <div className="container mx-auto px-4 py-12 space-y-16">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          Hakkımızda
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          2020 yılından bu yana, taze çiçekler ve özel buketlerle 
          özel günlerinizi daha anlamlı hale getiriyoruz. Her buket, 
          sevginizi ve özel hislerinizi en güzel şekilde ifade etmeniz için 
          özenle tasarlanır.
        </p>
      </section>

      {/* Özellikler */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-12">
          Neden Bizi Tercih Etmelisiniz?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                <CardContent className="pt-8 pb-6">
                  <div className="bg-pink-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="text-pink-600" size={32} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      {/* Hikayemiz */}
      <section className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12">
          Hikayemiz
        </h2>
        <div className="prose prose-lg max-w-none">
          <p className="text-gray-700 leading-relaxed mb-6">
            Çiçek Dükkanım, çiçeklere olan tutkumuzla başlayan bir yolculuk. 
            2020 yılında İstanbul'da küçük bir çiçekçi dükkanı olarak hayata 
            başladık. Amacımız basitti: insanların sevdiklerine duygularını 
            en güzel şekilde ifade etmelerine yardımcı olmak.
          </p>
          <p className="text-gray-700 leading-relaxed mb-6">
            Her geçen gün daha fazla müşterimizin güvenini kazandık. Taze çiçekler, 
            özenli paketleme ve zamanında teslimat ile fark yarattık. Bugün, 
            Türkiye'nin dört bir yanına binlerce buket göndererek, özel günleri 
            unutulmaz kılıyoruz.
          </p>
          <p className="text-gray-700 leading-relaxed">
            Profesyonel florist ekibimiz, her bukeyi bir sanat eseri gibi hazırlıyor. 
            En taze çiçekleri seçiyor, en uygun renk kombinasyonlarını oluşturuyor 
            ve her detayı özenle işliyoruz. Çünkü biliyoruz ki, göndereceğiniz her 
            çiçek, bir gülümseme, bir mutluluk ve bir anıdır.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-12">
          Yolculuğumuz
        </h2>
        <div className="max-w-4xl mx-auto">
          <div className="space-y-8">
            {timeline.map((item, index) => (
              <div key={index} className="flex gap-6 group">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-pink-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                    {item.year}
                  </div>
                  {index !== timeline.length - 1 && (
                    <div className="w-0.5 h-full bg-pink-200 mt-2" />
                  )}
                </div>
                <Card className="flex-1 group-hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                    <p className="text-gray-600">{item.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vizyonumuz */}
      <section className="bg-pink-50 rounded-2xl p-8 md:p-12">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Vizyonumuz</h2>
          <p className="text-xl text-gray-700 leading-relaxed mb-8">
            Türkiye'nin her köşesine sevgiyi, mutluluğu ve güzelliği taşımak. 
            Her özel günü, her anı unutulmaz kılmak için en taze çiçekleri, 
            en özenli hizmetle sunmak.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div>
              <div className="text-4xl font-bold text-pink-600 mb-2">10,000+</div>
              <div className="text-gray-600">Mutlu Müşteri</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-600 mb-2">50,000+</div>
              <div className="text-gray-600">Teslim Edilen Buket</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-pink-600 mb-2">%99</div>
              <div className="text-gray-600">Müşteri Memnuniyeti</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}