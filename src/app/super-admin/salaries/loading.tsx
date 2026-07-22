import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SalariesLoading() {
  return (
    <>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Skeleton className="h-8 w-52" />
          <Skeleton className="mt-2 h-4 w-80" />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="flex items-start justify-between">
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-7 w-16" />
              </div>
              <Skeleton className="size-10 rounded-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-6 mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:flex lg:flex-wrap">
        <Skeleton className="h-9 w-full lg:w-52" />
        <Skeleton className="h-9 w-full lg:w-36" />
        <Skeleton className="h-9 w-full lg:w-32" />
        <Skeleton className="h-9 w-full lg:w-32" />
        <Skeleton className="h-9 w-full lg:w-60" />
      </div>

      <Card>
        <CardContent className="space-y-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </CardContent>
      </Card>
    </>
  );
}
