import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { SearchX } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-md mx-auto text-center">
        <CardContent className="pt-12 pb-8">
          <SearchX size={64} className="mx-auto text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Kategori Bulunamadı</h2>
          <p className="text-muted-foreground mb-6">
            Aradığınız kategori mevcut değil veya kaldırılmış olabilir.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-pink-600 hover:bg-pink-700">
              <Link href="/urun">Tüm Ürünler</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Ana Sayfa</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}