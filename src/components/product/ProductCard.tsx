import Link from 'next/link'
import { ShoppingCart, Heart } from 'lucide-react'
import { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 group">
      <Link href={`/urun/${product.slug}`}>
        <div className="relative bg-gray-200 h-64 overflow-hidden">
          {/* Görsel varsa göster, yoksa placeholder */}
          {product.image ? (
            <img 
              src={product.image} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl">🌸</span>
            </div>
          )}
          
          {/* Öne çıkan badge */}
          {product.featured && (
            <div className="absolute top-2 left-2 bg-pink-600 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Öne Çıkan
            </div>
          )}
          
          {/* Stok durumu */}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold">
                Tükendi
              </span>
            </div>
          )}
          
          {/* Favori butonu */}
          <button 
            className="absolute top-2 right-2 bg-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-pink-50"
            onClick={(e) => {
              e.preventDefault()
              // Favori ekleme fonksiyonu buraya gelecek
              console.log('Favorilere eklendi:', product.name)
            }}
          >
            <Heart size={20} className="text-pink-600" />
          </button>
        </div>
      </Link>
      
      <div className="p-4">
        <Link href={`/urun/${product.slug}`}>
          <h3 className="font-semibold text-lg mb-2 hover:text-pink-600 transition line-clamp-1">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.description}
        </p>
        
        {/* Kategori */}
        {product.category && (
          <Link 
            href={`/kategori/${product.category.slug}`}
            className="text-xs text-pink-600 hover:underline"
          >
            {product.category.name}
          </Link>
        )}
        
        <div className="flex items-center justify-between mt-4">
          <span className="text-2xl font-bold text-pink-600">
            ₺{product.price.toFixed(2)}
          </span>
          
          <button 
            className="bg-pink-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-pink-700 transition flex items-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
            disabled={product.stock === 0}
            onClick={() => {
              // Sepete ekleme fonksiyonu buraya gelecek
              console.log('Sepete eklendi:', product.name)
            }}
          >
            <ShoppingCart size={16} />
            Sepete Ekle
          </button>
        </div>
        
        {/* Stok bilgisi */}
        {product.stock > 0 && product.stock <= 5 && (
          <p className="text-xs text-orange-600 mt-2">
            ⚠️ Son {product.stock} ürün!
          </p>
        )}
      </div>
    </div>
  )
}