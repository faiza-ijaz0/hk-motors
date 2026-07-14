import { Skeleton } from "@/components/ui/skeleton";

export default function AdminGalleryLoading() {
  return (
    <div>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-8 w-32" />
          <Skeleton className="mt-2 h-4 w-72" />
        </div>
        <Skeleton className="h-9 w-32" />
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <Skeleton className="h-9 w-full sm:w-56" />
        <Skeleton className="h-9 w-full sm:w-48" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="border-border overflow-hidden rounded-xl border"
          >
            <Skeleton className="aspect-4/3 w-full rounded-none" />
            <div className="space-y-2 p-3">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-3 w-2/3" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
