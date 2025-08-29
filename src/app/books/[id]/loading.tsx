export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-12">
      {/* Main book info skeleton */}
      <div className="grid gap-8 lg:grid-cols-[420px_1fr]">
        {/* Book cover skeleton */}
        <div className="card overflow-hidden">
          <div className="relative aspect-[3/4] bg-slate-200 animate-pulse"></div>
        </div>

        {/* Book details skeleton */}
        <div className="grid gap-4">
          <div className="space-y-4">
            <div className="h-8 bg-slate-200 rounded animate-pulse w-3/4"></div>
            <div className="h-6 bg-slate-200 rounded animate-pulse w-1/2"></div>
            <div className="h-4 bg-slate-200 rounded animate-pulse w-2/3"></div>
          </div>

          {/* Price skeleton */}
          <div className="flex items-center gap-3">
            <div className="h-6 bg-slate-200 rounded animate-pulse w-32"></div>
            <div className="h-8 bg-slate-200 rounded animate-pulse w-24"></div>
          </div>

          {/* Buttons skeleton */}
          <div className="grid sm:grid-cols-2 gap-3 pt-4">
            <div className="h-12 bg-slate-200 rounded-full animate-pulse"></div>
            <div className="h-12 bg-slate-200 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Description skeleton */}
      <div className="card p-6">
        <div className="h-6 bg-slate-200 rounded animate-pulse w-32 mb-4"></div>
        <div className="space-y-2">
          <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
          <div className="h-4 bg-slate-200 rounded animate-pulse w-4/5"></div>
          <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4"></div>
        </div>
      </div>

      {/* Related books skeleton */}
      <div>
        <div className="h-6 bg-slate-200 rounded animate-pulse w-48 mb-6"></div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <div className="aspect-[3/4] bg-slate-200 rounded-lg animate-pulse"></div>
              <div className="space-y-2">
                <div className="h-4 bg-slate-200 rounded animate-pulse"></div>
                <div className="h-3 bg-slate-200 rounded animate-pulse w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}