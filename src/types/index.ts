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

export interface Order {
  id: string
  orderNumber: string
  customerName: string
  customerEmail: string
  customerPhone: string
  deliveryAddress: string
  deliveryCity: string
  deliveryDistrict: string
  deliveryDate: Date
  deliveryTime: string
  items: CartItem[]
  subtotal: number
  shipping: number
  total: number
  paymentMethod: string
  paymentStatus: string
  status: string
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface OrderFormData {
  customerName: string
  customerEmail: string
  customerPhone: string
  deliveryAddress: string
  deliveryCity: string
  deliveryDistrict: string
  deliveryDate: string
  deliveryTime: string
  paymentMethod: string
  notes?: string
}