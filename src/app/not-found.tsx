// app/not-found.tsx
"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#2D5F72]">
      <div className="relative">
        {/* 404 Text */}
        <h1 className="text-[200px] font-bold text-white relative z-10">
          404
        </h1>
        
        {/* Red Overlay */}
        <div className="absolute top-0 right-0 bottom-0 left-1/2 bg-[#E55F77] -skew-x-12 z-0" />
      </div>

      {/* Error Message */}
      <h2 className="text-white text-xl mt-4">Oops! Page Not Found</h2>

      {/* Go Back Button */}
      <Button
        onClick={() => router.push('/')}
        className="mt-8 bg-yellow-400 hover:bg-yellow-500 text-black"
      >
        Go Back Home
      </Button>
    </div>
  )
}