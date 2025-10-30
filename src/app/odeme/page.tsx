'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Separator } from '@/components/ui/separator'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2, Calendar as CalendarIcon, CreditCard, Banknote, ShoppingBag, Truck, MapPin } from 'lucide-react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { cn } from '@/lib/utils'
import Link from 'next/link'

export default function CheckoutPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { items, getTotalPrice, clearCart } = useCartStore()
  const [isLoading, setIsLoading] = useState(false)
  const [loadingUserData, setLoadingUserData] = useState(true)
  const [addresses, setAddresses] = useState<any[]>([])
  const [selectedAddressId, setSelectedAddressId] = useState<string>('')

  // Form state
  const [customerName, setCustomerName] = useState('')
  const [customerEmail, setCustomerEmail] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [deliveryCity, setDeliveryCity] = useState('')
  const [deliveryDistrict, setDeliveryDistrict] = useState('')
  const [deliveryDate, setDeliveryDate] = useState<Date>()
  const [deliveryTime, setDeliveryTime] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery')
  const [notes, setNotes] = useState('')

  const subtotal = getTotalPrice()
  const shipping = 0
  const total = subtotal + shipping

  // Kullanıcı verilerini yükle
  useEffect(() => {
    const loadUserData = async () => {
      if (session?.user) {
        try {
          // Kullanıcı bilgilerini doldur
          setCustomerName(session.user.name || '')
          setCustomerEmail(session.user.email || '')

          // Profil bilgilerini çek
          const profileRes = await fetch('/api/user/profile')
          if (profileRes.ok) {
            const profile = await profileRes.json()
            setCustomerPhone(profile.phone || '')
          }

          // Adresleri çek
          const addressRes = await fetch('/api/addresses')
          if (addressRes.ok) {
            const userAddresses = await addressRes.json()
            setAddresses(userAddresses)
            
            // Varsayılan adresi seç
            const defaultAddress = userAddresses.find((addr: any) => addr.isDefault)
            if (defaultAddress) {
              setSelectedAddressId(defaultAddress.id)
              fillAddressData(defaultAddress)
            }
          }
        } catch (error) {
          console.error('Kullanıcı verileri yüklenirken hata:', error)
        }
      }
      setLoadingUserData(false)
    }

    loadUserData()
  }, [session])

  // Seçili adresi form'a doldur
  const fillAddressData = (address: any) => {
    setDeliveryAddress(address.address)
    setDeliveryCity(address.city)
    setDeliveryDistrict(address.district)
    setCustomerPhone(address.phone)
  }

  // Adres seçimi değiştiğinde
  const handleAddressChange = (addressId: string) => {
    setSelectedAddressId(addressId)
    const address = addresses.find(addr => addr.id === addressId)
    if (address) {
      fillAddressData(address)
    }
  }

  // Sepet boşsa yönlendir
  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto text-center">
          <CardContent className="pt-12 pb-8">
            <ShoppingBag size={64} className="mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-2">Sepetiniz Boş</h2>
            <p className="text-muted-foreground mb-6">
              Ödeme yapabilmek için sepetinizde ürün olmalıdır.
            </p>
            <Button asChild className="bg-pink-600 hover:bg-pink-700">
              <Link href="/urun">Alışverişe Başla</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validasyon
    if (!customerName || !customerEmail || !customerPhone) {
      toast.error('Hata', {
        description: 'Lütfen tüm müşteri bilgilerini doldurun.',
      })
      setIsLoading(false)
      return
    }

    if (!deliveryAddress || !deliveryCity || !deliveryDistrict) {
      toast.error('Hata', {
        description: 'Lütfen tüm teslimat bilgilerini doldurun.',
      })
      setIsLoading(false)
      return
    }

    if (!deliveryDate || !deliveryTime) {
      toast.error('Hata', {
        description: 'Lütfen teslimat tarihi ve saatini seçin.',
      })
      setIsLoading(false)
      return
    }

    try {
      const orderData = {
        userId: session?.user?.id || null,
        customerName,
        customerEmail,
        customerPhone,
        deliveryAddress,
        deliveryCity,
        deliveryDistrict,
        deliveryDate: deliveryDate.toISOString(),
        deliveryTime,
        items: items.map(item => ({
          product: {
            id: item.product.id,
            name: item.product.name,
            price: item.product.price,
            image: item.product.image
          },
          quantity: item.quantity,
          message: item.message
        })),
        subtotal,
        shipping,
        total,
        paymentMethod,
        notes
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Sipariş oluşturulamadı')
      }

      const data = await response.json()

      clearCart()

      toast.success('Siparişiniz Alındı! 🎉', {
        description: `Sipariş numaranız: ${data.order.orderNumber}`,
      })

      router.push(`/siparis-onay/${data.order.id}`)

    } catch (error: any) {
      toast.error('Hata', {
        description: error.message || 'Sipariş oluşturulurken bir hata oluştu.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Ödeme</h1>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sol Taraf - Formlar */}
          <div className="lg:col-span-2 space-y-6">
            {/* Giriş Önerisi */}
            {!session && (
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="pt-6">
                  <p className="text-sm mb-2">
                    <strong>Hesabınız var mı?</strong> Giriş yaparak daha hızlı alışveriş yapabilirsiniz.
                  </p>
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/giris?callbackUrl=/odeme`}>
                      Giriş Yap
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Kayıtlı Adresler */}
            {session && addresses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin size={20} />
                    Kayıtlı Adreslerim
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={selectedAddressId} onValueChange={handleAddressChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Adres seçin" />
                    </SelectTrigger>
                    <SelectContent>
                      {addresses.map((address) => (
                        <SelectItem key={address.id} value={address.id}>
                          {address.title} - {address.district}/{address.city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-2">
                    Veya aşağıdaki formu manuel olarak doldurun
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Müşteri Bilgileri */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin size={20} />
                  Müşteri Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Ad Soyad *</Label>
                    <Input
                      id="name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Ahmet Yılmaz"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="0555 123 45 67"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-posta *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="ornek@email.com"
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Teslimat Bilgileri */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Truck size={20} />
                  Teslimat Bilgileri
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">İl *</Label>
                    <Input
                      id="city"
                      value={deliveryCity}
                      onChange={(e) => setDeliveryCity(e.target.value)}
                      placeholder="Bursa"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="district">İlçe *</Label>
                    <Input
                      id="district"
                      value={deliveryDistrict}
                      onChange={(e) => setDeliveryDistrict(e.target.value)}
                      placeholder="Nilüfer"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adres *</Label>
                  <Textarea
                    id="address"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    placeholder="Mahalle, sokak, bina no, daire no..."
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Teslimat Tarihi *</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full justify-start text-left font-normal',
                            !deliveryDate && 'text-muted-foreground'
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {deliveryDate ? (
                            format(deliveryDate, 'PPP', { locale: tr })
                          ) : (
                            <span>Tarih seçin</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={deliveryDate}
                          onSelect={setDeliveryDate}
                          disabled={(date) =>
                            date < new Date() || date < new Date('1900-01-01')
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="time">Teslimat Saati *</Label>
                    <Select value={deliveryTime} onValueChange={setDeliveryTime} required>
                      <SelectTrigger>
                        <SelectValue placeholder="Saat seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="09:00-12:00">09:00 - 12:00</SelectItem>
                        <SelectItem value="12:00-15:00">12:00 - 15:00</SelectItem>
                        <SelectItem value="15:00-18:00">15:00 - 18:00</SelectItem>
                        <SelectItem value="18:00-21:00">18:00 - 21:00</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Sipariş Notu (Opsiyonel)</Label>
                  <Textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Kapı kodu, ek talimatlar..."
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Ödeme Yöntemi */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard size={20} />
                  Ödeme Yöntemi
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted">
                    <RadioGroupItem value="cash_on_delivery" id="cash" />
                    <Label htmlFor="cash" className="flex items-center gap-3 cursor-pointer flex-1">
                      <Banknote size={24} className="text-green-600" />
                      <div>
                        <p className="font-medium">Kapıda Ödeme</p>
                        <p className="text-sm text-muted-foreground">Nakit veya kredi kartı ile</p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 border rounded-lg p-4 cursor-pointer hover:bg-muted opacity-50">
                    <RadioGroupItem value="credit_card" id="card" disabled />
                    <Label htmlFor="card" className="flex items-center gap-3 cursor-not-allowed flex-1">
                      <CreditCard size={24} className="text-blue-600" />
                      <div>
                        <p className="font-medium">Kredi Kartı</p>
                        <p className="text-sm text-muted-foreground">Yakında aktif olacak</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>
          </div>

          {/* Sağ Taraf - Sipariş Özeti */}
          <div className="lg:col-span-1">
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle>Sipariş Özeti</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Ürünler */}
                <div className="space-y-3 max-h-64 overflow-auto">
                  {items.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <div className="w-16 h-16 bg-muted rounded flex-shrink-0 overflow-hidden">
                        {item.product.image ? (
                          <img 
                            src={item.product.image} 
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">
                            🌸
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">{item.product.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.quantity} x ₺{item.product.price.toFixed(2)}
                        </p>
                      </div>
                      <div className="text-sm font-semibold">
                        ₺{(item.product.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Fiyat Detayları */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Ara Toplam</span>
                    <span className="font-medium">₺{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Kargo</span>
                    <span className="font-medium text-green-600">Ücretsiz</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Toplam</span>
                    <span className="text-pink-600">₺{total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading || loadingUserData}
                  className="w-full bg-pink-600 hover:bg-pink-700"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      İşleniyor...
                    </>
                  ) : (
                    'Siparişi Tamamla'
                  )}
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Siparişinizi tamamlayarak{' '}
                  <Link href="/gizlilik" className="underline">
                    Gizlilik Politikası
                  </Link>
                  'nı ve{' '}
                  <Link href="/kullanim-kosullari" className="underline">
                    Kullanım Koşulları
                  </Link>
                  'nı kabul etmiş olursunuz.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>
    </div>
  )
}