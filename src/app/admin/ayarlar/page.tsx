'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Save, Globe, Truck, Mail, Share2, Search } from 'lucide-react';

interface Settings {
  id: string;
  siteName: string;
  siteDescription?: string;
  siteLogo?: string;
  phone?: string;
  email?: string;
  address?: string;
  freeShippingLimit: number;
  shippingCost: number;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPassword?: string;
  emailFrom?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  whatsapp?: string;
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  maintenanceMode: boolean;
}

export default function AdminSettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (session?.user?.role !== 'admin') {
      router.push('/');
    }
  }, [status, session, router]);

  useEffect(() => {
    if (status === 'authenticated' && session?.user?.role === 'admin') {
      fetchSettings();
    }
  }, [status, session]);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data.settings);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Ayarlar yüklenirken hata oluştu');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings) return;

    try {
      setSaving(true);
      const response = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (response.ok) {
        toast.success('Ayarlar başarıyla kaydedildi');
        fetchSettings();
      } else {
        toast.error('Ayarlar kaydedilirken hata oluştu');
      }
    } catch (error) {
      toast.error('Bir hata oluştu');
    } finally {
      setSaving(false);
    }
  };

  const updateSetting = (key: keyof Settings, value: any) => {
    if (!settings) return;
    setSettings({ ...settings, [key]: value });
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-96 bg-gray-200 rounded" />
        </div>
      </div>
    );
  }

  if (!settings) return null;

  return (
    <div className="p-8 space-y-6">
      {/* Başlık */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Site Ayarları</h1>
          <p className="text-gray-600 mt-1">
            Web sitenizin genel ayarlarını yönetin
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">
            <Globe className="w-4 h-4 mr-2" />
            Genel
          </TabsTrigger>
          <TabsTrigger value="shipping">
            <Truck className="w-4 h-4 mr-2" />
            Kargo
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="w-4 h-4 mr-2" />
            E-posta
          </TabsTrigger>
          <TabsTrigger value="social">
            <Share2 className="w-4 h-4 mr-2" />
            Sosyal Medya
          </TabsTrigger>
          <TabsTrigger value="seo">
            <Search className="w-4 h-4 mr-2" />
            SEO
          </TabsTrigger>
        </TabsList>

        {/* Genel Ayarlar */}
        <TabsContent value="general">
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Site Bilgileri</CardTitle>
                <CardDescription>
                  Sitenizin temel bilgilerini düzenleyin
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Site Adı *</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => updateSetting('siteName', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteDescription">Site Açıklaması</Label>
                  <Textarea
                    id="siteDescription"
                    value={settings.siteDescription || ''}
                    onChange={(e) => updateSetting('siteDescription', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="siteLogo">Logo URL</Label>
                  <Input
                    id="siteLogo"
                    value={settings.siteLogo || ''}
                    onChange={(e) => updateSetting('siteLogo', e.target.value)}
                    placeholder="https://..."
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>İletişim Bilgileri</CardTitle>
                <CardDescription>
                  Müşterilerinizle iletişim bilgileri
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Telefon</Label>
                    <Input
                      id="phone"
                      value={settings.phone || ''}
                      onChange={(e) => updateSetting('phone', e.target.value)}
                      placeholder="+90 XXX XXX XX XX"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">E-posta</Label>
                    <Input
                      id="email"
                      type="email"
                      value={settings.email || ''}
                      onChange={(e) => updateSetting('email', e.target.value)}
                      placeholder="info@site.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adres</Label>
                  <Textarea
                    id="address"
                    value={settings.address || ''}
                    onChange={(e) => updateSetting('address', e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bakım Modu</CardTitle>
                <CardDescription>
                  Siteyi geçici olarak kapatın
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Bakım Modu</p>
                    <p className="text-sm text-gray-600">
                      Aktif olduğunda site ziyaretçilere kapalı olur
                    </p>
                  </div>
                  <Switch
                    checked={settings.maintenanceMode}
                    onCheckedChange={(checked) => updateSetting('maintenanceMode', checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Kargo Ayarları */}
        <TabsContent value="shipping">
          <Card>
            <CardHeader>
              <CardTitle>Kargo Ayarları</CardTitle>
              <CardDescription>
                Kargo ücretleri ve limitleri
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="freeShippingLimit">Ücretsiz Kargo Limiti (₺)</Label>
                  <Input
                    id="freeShippingLimit"
                    type="number"
                    step="0.01"
                    value={settings.freeShippingLimit}
                    onChange={(e) => updateSetting('freeShippingLimit', e.target.value)}
                  />
                  <p className="text-xs text-gray-600">
                    Bu tutarın üzerindeki siparişlerde kargo ücretsiz
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shippingCost">Kargo Ücreti (₺)</Label>
                  <Input
                    id="shippingCost"
                    type="number"
                    step="0.01"
                    value={settings.shippingCost}
                    onChange={(e) => updateSetting('shippingCost', e.target.value)}
                  />
                  <p className="text-xs text-gray-600">
                    Standart kargo ücreti
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* E-posta Ayarları */}
        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>SMTP Ayarları</CardTitle>
              <CardDescription>
                E-posta gönderimi için SMTP sunucu bilgileri
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    value={settings.smtpHost || ''}
                    onChange={(e) => updateSetting('smtpHost', e.target.value)}
                    placeholder="smtp.gmail.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    value={settings.smtpPort || ''}
                    onChange={(e) => updateSetting('smtpPort', e.target.value)}
                    placeholder="587"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpUser">SMTP Kullanıcı</Label>
                  <Input
                    id="smtpUser"
                    value={settings.smtpUser || ''}
                    onChange={(e) => updateSetting('smtpUser', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="smtpPassword">SMTP Şifre</Label>
                  <Input
                    id="smtpPassword"
                    type="password"
                    value={settings.smtpPassword || ''}
                    onChange={(e) => updateSetting('smtpPassword', e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="emailFrom">Gönderici E-posta</Label>
                <Input
                  id="emailFrom"
                  type="email"
                  value={settings.emailFrom || ''}
                  onChange={(e) => updateSetting('emailFrom', e.target.value)}
                  placeholder="noreply@site.com"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sosyal Medya */}
        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Sosyal Medya Linkleri</CardTitle>
              <CardDescription>
                Sosyal medya hesaplarınızın bağlantıları
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="facebook">Facebook</Label>
                <Input
                  id="facebook"
                  value={settings.facebook || ''}
                  onChange={(e) => updateSetting('facebook', e.target.value)}
                  placeholder="https://facebook.com/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input
                  id="instagram"
                  value={settings.instagram || ''}
                  onChange={(e) => updateSetting('instagram', e.target.value)}
                  placeholder="https://instagram.com/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input
                  id="twitter"
                  value={settings.twitter || ''}
                  onChange={(e) => updateSetting('twitter', e.target.value)}
                  placeholder="https://twitter.com/..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp">WhatsApp</Label>
                <Input
                  id="whatsapp"
                  value={settings.whatsapp || ''}
                  onChange={(e) => updateSetting('whatsapp', e.target.value)}
                  placeholder="+90XXXXXXXXXX"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* SEO */}
        <TabsContent value="seo">
          <Card>
            <CardHeader>
              <CardTitle>SEO Ayarları</CardTitle>
              <CardDescription>
                Arama motoru optimizasyonu için meta bilgiler
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="metaTitle">Meta Başlık</Label>
                <Input
                  id="metaTitle"
                  value={settings.metaTitle || ''}
                  onChange={(e) => updateSetting('metaTitle', e.target.value)}
                  maxLength={60}
                />
                <p className="text-xs text-gray-600">
                  Önerilen: 50-60 karakter
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaDescription">Meta Açıklama</Label>
                <Textarea
                  id="metaDescription"
                  value={settings.metaDescription || ''}
                  onChange={(e) => updateSetting('metaDescription', e.target.value)}
                  rows={3}
                  maxLength={160}
                />
                <p className="text-xs text-gray-600">
                  Önerilen: 150-160 karakter
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="metaKeywords">Meta Anahtar Kelimeler</Label>
                <Input
                  id="metaKeywords"
                  value={settings.metaKeywords || ''}
                  onChange={(e) => updateSetting('metaKeywords', e.target.value)}
                  placeholder="çiçek, buket, gül, ..."
                />
                <p className="text-xs text-gray-600">
                  Virgülle ayırarak yazın
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Kaydet Butonu (Alt) */}
      <div className="flex justify-end pt-6 border-t">
        <Button onClick={handleSave} disabled={saving} size="lg">
          <Save className="w-4 h-4 mr-2" />
          {saving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
        </Button>
      </div>
    </div>
  );
}