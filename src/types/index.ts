export interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  image: string
  images: string[]
  stock: number
  categoryId: string
  category?: Category
  featured: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  image: string | null
  createdAt: Date
  updatedAt: Date
}

export interface CartItem {
  product: Product
  quantity: number
  message?: string
}