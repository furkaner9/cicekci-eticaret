'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function SortSelect() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentSort = searchParams.get('sort') || 'newest'

  const handleSortChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('sort', value)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <Select value={currentSort} onValueChange={handleSortChange}>
      <SelectTrigger className="w-full sm:w-[200px]">
        <SelectValue placeholder="Sırala" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="newest">En Yeni</SelectItem>
        <SelectItem value="price-asc">Fiyat: Düşükten Yükseğe</SelectItem>
        <SelectItem value="price-desc">Fiyat: Yüksekten Düşüğe</SelectItem>
        <SelectItem value="name-asc">İsim: A-Z</SelectItem>
      </SelectContent>
    </Select>
  )
}