'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { MessageSquare } from 'lucide-react'

interface MessageCardDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (message: string) => void
  productName: string
}

export default function MessageCardDialog({ 
  isOpen, 
  onClose, 
  onSubmit, 
  productName 
}: MessageCardDialogProps) {
  const [message, setMessage] = useState('')
  const maxLength = 200

  const handleSubmit = () => {
    if (message.trim()) {
      onSubmit(message)
      setMessage('')
    }
  }

  const suggestions = [
    "Mutlu yıllar! 🎉",
    "Seni seviyorum ❤️",
    "Sevgiyle, [İsim]",
    "Doğum günün kutlu olsun! 🎂",
    "Geçmiş olsun, acil şifalar! 💐",
    "Tebrikler! 🎊",
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="text-pink-600" size={24} />
            Mesaj Kartı Ekle
          </DialogTitle>
          <DialogDescription>
            {productName} için özel bir mesaj ekleyin. Mesajınız güzel bir kartta 
            çiçeklerinizle birlikte gönderilecektir.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="message">Mesajınız</Label>
            <Textarea
              id="message"
              placeholder="Mesajınızı buraya yazın..."
              value={message}
              onChange={(e) => setMessage(e.target.value.slice(0, maxLength))}
              className="min-h-[120px]"
            />
            <p className="text-xs text-muted-foreground text-right">
              {message.length}/{maxLength} karakter
            </p>
          </div>

          {/* Hazır Mesajlar */}
          <div className="space-y-2">
            <Label className="text-sm">Hazır Mesajlar (Tıklayarak kullanın)</Label>
            <div className="flex flex-wrap gap-2">
              {suggestions.map((suggestion, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setMessage(suggestion)}
                  className="text-xs"
                >
                  {suggestion}
                </Button>
              ))}
            </div>
          </div>

          {/* Önizleme */}
          {message && (
            <div className="border-2 border-dashed border-pink-200 rounded-lg p-4 bg-pink-50">
              <p className="text-xs text-muted-foreground mb-2">Mesaj Önizleme:</p>
              <p className="text-sm italic">{message}</p>
            </div>
          )}
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose}>
            İptal
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={!message.trim()}
            className="bg-pink-600 hover:bg-pink-700"
          >
            Sepete Ekle
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}