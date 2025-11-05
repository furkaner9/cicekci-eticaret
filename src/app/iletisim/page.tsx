// app/iletisim/page.tsx
'use client'

import { useState } from 'react'
import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { MapPin, Phone, Mail, Clock, Send } from 'lucide-react'
import { toast } from 'sonner'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Burada API'ye gönderme işlemi yapılabilir
    // Şimdilik sadece toast gösterelim
    setTimeout(() => {
      toast.success('Mesajınız başarıyla gönderildi!', {
        description: 'En kısa sürede size dönüş yapacağız.',
      })
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      })
      setLoading(false)
    }, 1000)
  }

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Adres',
      content: 'Örnek Mahallesi, Çiçek Sokak No:123\nKadıköy / İstanbul',
    },
    {
      icon: Phone,
      title: 'Telefon',
      content: '+90 (212) 123 45 67\n+90 (532) 123 45 67',
    },
    {
      icon: Mail,
      title: 'E-posta',
      content: 'info@cicekdukkanim.com\ndestek@cicekdukkanim.com',
    },
    {
      icon: Clock,
      title: 'Çalışma Saatleri',
      content: 'Pazartesi - Cumartesi: 09:00 - 18:00\nPazar: Kapalı',
    },
  ]

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        {/* Başlık */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">İletişim</h1>
          <p className="text-xl text-gray-600">
            Sorularınız için bize ulaşın. Size yardımcı olmaktan mutluluk duyarız!
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* İletişim Bilgileri */}
          <div className="lg:col-span-1 space-y-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon
              return (
                <Card key={index}>
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-4">
                      <div className="bg-pink-100 p-3 rounded-lg">
                        <Icon className="text-pink-600" size={24} />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-2">{info.title}</h3>
                        <p className="text-sm text-gray-600 whitespace-pre-line">
                          {info.content}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}

            {/* Sosyal Medya */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-4">Sosyal Medya</h3>
                <div className="flex gap-3">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center hover:bg-blue-700 transition"
                  >
                    f
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-full flex items-center justify-center hover:opacity-90 transition"
                  >
                    📷
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 bg-sky-500 text-white rounded-full flex items-center justify-center hover:bg-sky-600 transition"
                  >
                    🐦
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* İletişim Formu */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Bize Mesaj Gönderin</CardTitle>
                <CardDescription>
                  Formu doldurun, en kısa sürede size dönüş yapalım
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Ad Soyad *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">E-posta *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefon</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+90 5XX XXX XX XX"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Konu *</Label>
                      <Input
                        id="subject"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mesajınız *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      rows={6}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-pink-600 hover:bg-pink-700"
                    disabled={loading}
                  >
                    {loading ? (
                      'Gönderiliyor...'
                    ) : (
                      <>
                        <Send className="mr-2" size={18} />
                        Mesajı Gönder
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Harita */}
            <Card className="mt-6">
              <CardContent className="p-0">
                <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.6939094446!2d29.01234567890123!3d41.015137!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDAwJzU0LjUiTiAyOcKwMDAnNDQuNCJF!5e0!3m2!1str!2str!4v1234567890123!5m2!1str!2str"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}