"use client"
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb Skeleton */}
      <div className="flex items-center gap-2 mb-8">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
        <Skeleton className="h-4 w-32" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
        {/* Görsel Skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-96 lg:h-[500px] w-full rounded-lg" />
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-full rounded-lg" />
            ))}
          </div>
        </div>

        {/* Bilgi Skeleton */}
        <div className="space-y-6">
          <div>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="h-12 w-40" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-12 w-32" />
            <div className="flex gap-3">
              <Skeleton className="h-12 flex-1" />
              <Skeleton className="h-12 flex-1" />
              <Skeleton className="h-12 w-12" />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <Card key={i}>
                <CardContent className="p-4">
                  <Skeleton className="h-16 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs Skeleton */}
      <Card className="mb-16">
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
            <Skeleton className="h-32 w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Benzer Ürünler Skeleton */}
      <div>
        <Skeleton className="h-8 w-48 mb-6" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <Skeleton className="h-64 w-full" />
              <CardContent className="p-4 space-y-2">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <Skeleton className="h-8 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
