import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="flex flex-col space-y-3 p-48">
      <Skeleton className="h-96 w-full rounded-xl" />
      <div className="flex flex-col items-start justify-start space-y-2">
        <Skeleton className="h-6 w-96" />
        <Skeleton className="h-6 w-48" />
      </div>
    </div>
  )
}
