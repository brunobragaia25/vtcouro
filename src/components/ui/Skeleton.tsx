export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div
      className={`bg-gray-300 animate-pulse rounded ${className}`}
    />
  )
}

export function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="space-y-4">
          <Skeleton className="w-full aspect-square rounded-2xl" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      ))}
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
      <div className="space-y-5">
        <Skeleton className="w-full aspect-square rounded-3xl" />
        <div className="flex gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="w-24 h-24 rounded-2xl" />
          ))}
        </div>
      </div>

      <div className="space-y-8">
        <div className="space-y-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-8 w-3/4" />
        </div>

        <Skeleton className="h-20 w-full" />

        <Skeleton className="h-32 w-full rounded-2xl" />

        <div className="space-y-4">
          <Skeleton className="h-4 w-20" />
          <div className="flex gap-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="w-10 h-10 rounded-full" />
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-12 w-full" />
        </div>

        <div className="flex gap-4">
          <Skeleton className="flex-1 h-12 rounded-lg" />
          <Skeleton className="flex-1 h-12 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
