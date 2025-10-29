'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Search, Loader2, X } from 'lucide-react'
import Link from 'next/link'
import { Product } from '@/types'

export default function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const searchRef = useRef<HTMLDivElement>(null)

  // Dışarı tıklandığında kapat
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Debounced arama
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (query.trim().length >= 2) {
        handleSearch(query)
      } else {
        setResults([])
        setIsOpen(false)
      }
    }, 300)

    return () => clearTimeout(delayDebounceFn)
  }, [query])

  const handleSearch = async (searchQuery: string) => {
    setIsLoading(true)
    setIsOpen(true)

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      const data = await response.json()
      setResults(data.products || [])
    } catch (error) {
      console.error('Arama hatası:', error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      router.push(`/arama?q=${encodeURIComponent(query)}`)
      setIsOpen(false)
    }
  }

  const clearSearch = () => {
    setQuery('')
    setResults([])
    setIsOpen(false)
  }

  return (
    <div ref={searchRef} className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <Input
          type="text"
          placeholder="Çiçek veya buket ara..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 2 && setIsOpen(true)}
          className="pr-20"
        />
        
        <div className="absolute right-0 top-0 flex items-center gap-1">
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={clearSearch}
              className="h-10 w-10"
            >
              <X size={18} />
            </Button>
          )}
          <Button 
            type="submit"
            size="icon" 
            variant="ghost" 
            className="h-10 w-10"
            disabled={!query.trim()}
          >
            {isLoading ? (
              <Loader2 size={20} className="animate-spin" />
            ) : (
              <Search size={20} />
            )}
          </Button>
        </div>
      </form>

      {/* Arama Sonuçları Dropdown */}
      {isOpen && (
        <Card className="absolute top-full mt-2 w-full z-50 shadow-lg max-h-96 overflow-auto">
          <CardContent className="p-0">
            {isLoading ? (
              <div className="p-8 text-center">
                <Loader2 className="animate-spin mx-auto mb-2" size={32} />
                <p className="text-sm text-muted-foreground">Aranıyor...</p>
              </div>
            ) : results.length > 0 ? (
              <div className="py-2">
                <div className="px-3 py-2 text-xs font-semibold text-muted-foreground border-b">
                  {results.length} sonuç bulundu
                </div>
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/urun/${product.slug}`}
                    onClick={() => setIsOpen(false)}
                    className="flex items-center gap-3 px-3 py-3 hover:bg-muted transition"
                  >
                    <div className="w-12 h-12 bg-muted rounded flex-shrink-0 overflow-hidden">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xl">
                          🌸
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{product.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm font-semibold text-pink-600">
                          ₺{product.price.toFixed(2)}
                        </span>
                        {product.category && (
                          <Badge variant="outline" className="text-xs">
                            {product.category.name}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
                <div className="px-3 py-2 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full"
                    onClick={handleSubmit}
                  >
                    Tüm sonuçları gör
                  </Button>
                </div>
              </div>
            ) : query.length >= 2 ? (
              <div className="p-8 text-center">
                <Search className="mx-auto mb-2 text-muted-foreground" size={32} />
                <p className="text-sm text-muted-foreground mb-1">
                  Sonuç bulunamadı
                </p>
                <p className="text-xs text-muted-foreground">
                  "{query}" için ürün bulunamadı
                </p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  )
}