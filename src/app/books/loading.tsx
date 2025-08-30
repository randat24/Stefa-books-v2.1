import { BookOpen } from "lucide-react";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="space-y-8">
        {/* Header skeleton */}
        <div className="space-y-4">
          <div className="h-8 bg-slate-200 rounded animate-pulse w-64"></div>
          <div className="h-4 bg-slate-200 rounded animate-pulse w-96"></div>
        </div>

        {/* Books grid skeleton */}
        <div className="max-w-[1000px] mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="space-y-3 w-full max-w-[240px]">
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
    </div>
  );
}