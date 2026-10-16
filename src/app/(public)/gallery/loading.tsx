import { Skeleton } from "@/components/ui/skeleton";

// Mirrors the real page's structure (hero, heading, tabs, grid) so the
// streamed-in content replaces it without pushing the layout around.
export default function GalleryLoading() {
  return (
    <>
      <div className="border-border min-h-[50vh] border-b bg-black sm:min-h-[60vh]" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="mt-3 h-8 w-64" />
        </div>

        <div className="mt-6 flex flex-wrap justify-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-20 rounded-full" />
          ))}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="aspect-4/3 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </>
  );
}
