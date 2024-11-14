// app/challenz/loading.tsx
import { Loader2 } from "lucide-react"

export default function Loading() {
  return (
    <div className="h-full w-full flex items-center justify-center min-h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-teal-700" />
    </div>
  )
}