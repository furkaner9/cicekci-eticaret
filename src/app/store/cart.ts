import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Product } from '../../types'

export interface CartItem {
  product: Product
  quantity: number
  message?: string
  deliveryDate?: Date
}

interface CartStore {
  items: CartItem[]
  addItem: (product: Product, quantity?: number, message?: string) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  updateMessage: (productId: string, message: string) => void
  clearCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
  getItem: (productId: string) => CartItem | undefined
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product, quantity = 1, message) => {
        const items = get().items
        const existingItem = items.find(item => item.product.id === product.id)

        if (existingItem) {
          // Ürün zaten sepette varsa, miktarı artır
          set({
            items: items.map(item =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          })
        } else {
          // Yeni ürün ekle
          set({
            items: [...items, { product, quantity, message }]
          })
        }
      },

      removeItem: (productId) => {
        set({
          items: get().items.filter(item => item.product.id !== productId)
        })
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId)
          return
        }

        set({
          items: get().items.map(item =>
            item.product.id === productId
              ? { ...item, quantity }
              : item
          )
        })
      },

      updateMessage: (productId, message) => {
        set({
          items: get().items.map(item =>
            item.product.id === productId
              ? { ...item, message }
              : item
          )
        })
      },

      clearCart: () => {
        set({ items: [] })
      },

      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0)
      },

      getTotalPrice: () => {
        return get().items.reduce(
          (total, item) => total + (item.product.price * item.quantity),
          0
        )
      },

      getItem: (productId) => {
        return get().items.find(item => item.product.id === productId)
      }
    }),
    {
      name: 'cart-storage', // localStorage key
    }
  )
)