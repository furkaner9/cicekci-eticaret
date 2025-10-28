'use client'

import { useEffect, useState } from 'react'
import { Badge } from '@/components/ui/badge'
import { useCartStore } from '@/store/cart'

export default function CartBadge() {
  const [mounted, setMounted] = useState(false)
  const getTotalItems = useCartStore(state => state.getTotalItems)
  const cartCount = getTotalItems()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || cartCount === 0) {
    return null
  }

  return (
    <Badge 
      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-pink-600 hover:bg-pink-700"
    >
      {cartCount}
    </Badge>
  )
}