// app/sss/page.tsx
'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ChevronDown, Search } from 'lucide-react'

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  const faqs = [
    {
      category: 'Sipariş & Teslimat',
      questions: [
        {
          q: 'Aynı gün teslimat yapıyor musunuz?',
          a: 'Evet! Saat 14:00\'e kadar verilen siparişlerinizi aynı gün teslim ediyoruz. 14:00\'den sonraki siparişler ertesi gün teslim edilir.',
        },
        {
          q: 'Hangi şehirlere teslimat yapıyorsunuz?',
          a: 'Türkiye\'nin tüm illerine teslimat yapıyoruz. Büyükşehirlerde aynı gün, diğer şehirlerde 1-2 gün içinde teslimat gerçekleştirilir.',
        },
        {
          q: 'Kargo ücreti ne kadar?',
          a: 'Tüm siparişlerimizde kargo ücretsizdir! Hiçbir ek ücret ödemeden çiçeklerinizi kapınıza kadar getiriyoruz.',
        },
        {
          q: 'Teslimat saatini seçebilir miyim?',
          a: 'Evet, sipariş verirken tercih ettiğiniz teslimat saatini seçebilirsiniz. Sabah (09:00-12:00), öğlen (12:00-15:00) veya akşam (15:00-18:00) aralıklarından birini seçebilirsiniz.',
        },
      ],
    },
    {
      category: 'Ödeme & Güvenlik',
      questions: [
        {
          q: 'Hangi ödeme yöntemlerini kabul ediyorsunuz?',
          a: 'Kredi kartı, banka kartı ve kapıda ödeme seçeneklerini sunuyoruz. Tüm kredi kartlarına taksit imkanı mevcuttur.',
        },
        {
          q: 'Ödeme güvenli mi?',
          a: 'Evet, %100 güvenli. SSL sertifikası ile korunan sistemimizde ödeme bilgileriniz şifrelenir ve güvenle işlem yapabilirsiniz.',
        },
        {
          q: 'Fatura alabilir miyim?',
          a: 'Evet, sipariş verirken fatura bilgilerinizi girdiğinizde e-fatura otomatik olarak e-posta adresinize gönderilir.',
        },
      ],
    },
    {
      category: 'Ürünler & Tazelik',
      questions: [
        {
          q: 'Çiçekler taze mi?',
          a: 'Evet! Her gün taze çiçekler tedarik ediyoruz. Buketleriniz sipariş sonrası özenle hazırlanır ve taze olarak teslim edilir.',
        },
        {
          q: 'Çiçeklerin ömrü ne kadar?',
          a: 'Uygun bakım koşullarında çiçekleriniz 5-10 gün arasında taze kalabilir. Her ürünle birlikte bakım kartı gönderiyoruz.',
        },
        {
          q: 'Çiçekleri nasıl saklamalıyım?',
          a: 'Çiçekleri serin bir ortamda tutun, her gün suyunu değiştirin ve saplarını 2cm kadar kesin. Doğrudan güneş ışığından uzak tutun.',
        },
        {
          q: 'Özel buket siparişi verebilir miyim?',
          a: 'Evet! Özel istek ve tasarımlarınız için bizimle iletişime geçebilirsiniz. Uzman floristlerimiz size özel buket hazırlayabilir.',
        },
      ],
    },
    {
      category: 'İade & Değişim',
      questions: [
        {
          q: 'İade yapabilir miyim?',
          a: 'Çiçekler doğal ürünler olduğu için iade kabul edilmemektedir. Ancak hasarlı veya eksik teslimat durumunda 24 saat içinde bizimle iletişime geçebilirsiniz.',
        },
        {
          q: 'Hasar görmüş çiçek aldım, ne yapmalıyım?',
          a: 'Lütfen derhal bizimle iletişime geçin ve fotoğraf gönderin. Hasarlı ürünler için anında yeni ürün gönderimi veya iade işlemi yapıyoruz.',
        },
        {
          q: 'Yanlış adrese teslimat yapıldı, ne olacak?',
          a: 'Lütfen hemen bizimle iletişime geçin. Durumu inceleyip en kısa sürede çözüm üreteceğiz.',
        },
      ],
    },
    {
      category: 'Diğer',
      questions: [
        {
          q: 'Mesaj kartı eklenebilir mi?',
          a: 'Evet! Sipariş verirken özel mesajınızı yazabilirsiniz. Mesaj kartı ücretsizdir ve buketinizle birlikte teslim edilir.',
        },
        {
          q: 'Sürpriz teslimat yapılabilir mi?',
          a: 'Evet, alıcı kişinin bilgilerini vererek sürpriz teslimat yaptırabilirsiniz. Teslimat sırasında sizin adınız gizli kalır.',
        },
        {
          q: 'Toplu sipariş indirim var mı?',
          a: 'Evet! Kurumsal ve toplu siparişler için özel fiyat ve indirimler sunuyoruz. Detaylı bilgi için bizimle iletişime geçin.',
        },
        {
          q: 'Hediye paketi yapılıyor mu?',
          a: 'Tüm buketlerimiz özel ambalaj ve kurdelelerle hazırlanır. Ek bir ücret talep etmiyoruz.',
        },
      ],
    },
  ]

  const filteredFaqs = faqs.map(category => ({
    ...category,
    questions: category.questions.filter(
      faq =>
        faq.q.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter(category => category.questions.length > 0)

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        {/* Başlık */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">
            Sıkça Sorulan Sorular
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Aklınıza takılan sorulara hızlı cevaplar bulun
          </p>

          {/* Arama */}
          <div className="relative max-w-xl mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <Input
              type="text"
              placeholder="Soru ara..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 py-6 text-lg"
            />
          </div>
        </div>

        {/* SSS Liste */}
        {filteredFaqs.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Aradığınız soru bulunamadı.</p>
          </div>
        ) : (
          <div className="space-y-8">
            {filteredFaqs.map((category, categoryIndex) => (
              <div key={categoryIndex}>
                <h2 className="text-2xl font-bold mb-4 text-pink-600">
                  {category.category}
                </h2>
                <div className="space-y-3">
                  {category.questions.map((faq, faqIndex) => {
                    const globalIndex = categoryIndex * 100 + faqIndex
                    const isOpen = openIndex === globalIndex

                    return (
                      <Card
                        key={faqIndex}
                        className="overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                        onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                      >
                        <CardContent className="p-0">
                          <div className="p-4 flex justify-between items-center">
                            <h3 className="font-semibold text-lg pr-4">
                              {faq.q}
                            </h3>
                            <ChevronDown
                              className={`text-gray-400 flex-shrink-0 transition-transform ${
                                isOpen ? 'rotate-180' : ''
                              }`}
                              size={20}
                            />
                          </div>
                          {isOpen && (
                            <div className="px-4 pb-4 pt-2 border-t">
                              <p className="text-gray-600 leading-relaxed">
                                {faq.a}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Hala Cevap Bulamadınız mı? */}
        <Card className="mt-12 bg-pink-50 border-pink-200">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold mb-4">
              Hala Cevap Bulamadınız mı?
            </h3>
            <p className="text-gray-600 mb-6">
              Bizimle iletişime geçin, size yardımcı olmaktan mutluluk duyarız!
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <a
                href="/iletisim"
                className="px-6 py-3 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition"
              >
                İletişim Formu
              </a>
              <a
                href="tel:+902121234567"
                className="px-6 py-3 bg-white border-2 border-pink-600 text-pink-600 rounded-lg hover:bg-pink-50 transition"
              >
                📞 Bizi Arayın
              </a>
              <a
                href="https://wa.me/905321234567"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                💬 WhatsApp
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}