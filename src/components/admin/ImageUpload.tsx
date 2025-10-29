'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Upload, Link as LinkIcon, X, Loader2, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  onFileNameChange?: (fileName: string) => void
}

export default function ImageUpload({ value, onChange, onFileNameChange }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [urlInput, setUrlInput] = useState(value || '')
  const [previewUrl, setPreviewUrl] = useState(value || '')
  const [uploadedFileName, setUploadedFileName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Önizleme için local URL oluştur
    const localPreview = URL.createObjectURL(file)
    setPreviewUrl(localPreview)

    setUploading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Upload failed')
      }

      const data = await response.json()
      
      onChange(data.url)
      setPreviewUrl(data.url)
      setUploadedFileName(data.fileName)
      if (onFileNameChange) {
        onFileNameChange(data.fileName)
      }

      toast.success('Görsel Yüklendi', {
        description: 'Görsel başarıyla yüklendi.',
      })

      // Local preview URL'i temizle
      URL.revokeObjectURL(localPreview)

    } catch (error: any) {
      toast.error('Hata', {
        description: error.message || 'Görsel yüklenirken bir hata oluştu.',
      })
      setPreviewUrl('')
      URL.revokeObjectURL(localPreview)
    } finally {
      setUploading(false)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) {
      toast.error('Hata', {
        description: 'Lütfen geçerli bir URL girin.',
      })
      return
    }

    // URL validasyonu
    try {
      new URL(urlInput)
      onChange(urlInput)
      setPreviewUrl(urlInput)
      toast.success('URL Eklendi', {
        description: 'Görsel URL\'si başarıyla eklendi.',
      })
    } catch {
      toast.error('Hata', {
        description: 'Geçersiz URL formatı.',
      })
    }
  }

  const handleRemoveImage = async () => {
    // Eğer yüklenen bir dosya varsa, sunucudan da sil
    if (uploadedFileName) {
      try {
        await fetch(`/api/upload?fileName=${uploadedFileName}`, {
          method: 'DELETE',
        })
      } catch (error) {
        console.error('Dosya silinemedi:', error)
      }
    }

    onChange('')
    setPreviewUrl('')
    setUrlInput('')
    setUploadedFileName('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }

    toast.info('Görsel Kaldırıldı', {
      description: 'Görsel başarıyla kaldırıldı.',
    })
  }

  return (
    <div className="space-y-4">
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">
            <Upload size={16} className="mr-2" />
            Dosya Yükle
          </TabsTrigger>
          <TabsTrigger value="url">
            <LinkIcon size={16} className="mr-2" />
            URL Ekle
          </TabsTrigger>
        </TabsList>

        {/* Dosya Yükleme */}
        <TabsContent value="upload" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="file-upload">Görsel Dosyası</Label>
            <div className="flex gap-2">
              <Input
                id="file-upload"
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileUpload}
                disabled={uploading}
                className="flex-1"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              JPG, PNG veya WEBP formatında, maksimum 5MB
            </p>
          </div>
        </TabsContent>

        {/* URL Ekleme */}
        <TabsContent value="url" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="image-url">Görsel URL</Label>
            <div className="flex gap-2">
              <Input
                id="image-url"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                className="flex-1"
              />
              <Button 
                type="button" 
                onClick={handleUrlSubmit}
                variant="outline"
              >
                Ekle
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Önizleme */}
      {(previewUrl || uploading) && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <Label>Önizleme</Label>
                {previewUrl && !uploading && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveImage}
                  >
                    <X size={16} className="mr-1" />
                    Kaldır
                  </Button>
                )}
              </div>
              
              <div className="relative w-full h-64 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                {uploading ? (
                  <div className="flex flex-col items-center gap-2">
                    <Loader2 className="animate-spin text-pink-600" size={32} />
                    <p className="text-sm text-muted-foreground">Yükleniyor...</p>
                  </div>
                ) : previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="Önizleme" 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none'
                      toast.error('Görsel Yüklenemedi', {
                        description: 'Görsel URL\'si geçersiz veya erişilemiyor.',
                      })
                    }}
                  />
                ) : (
                  <ImageIcon size={48} className="text-muted-foreground" />
                )}
              </div>

              {previewUrl && !uploading && (
                <p className="text-xs text-muted-foreground break-all">
                  {previewUrl}
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}