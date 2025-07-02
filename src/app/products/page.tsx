// app/products/page.tsx (or wherever this lives)
'use client'

import Page from "./list/page"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export default function ProductsPage() {
  const router = useRouter()

  return (
    <div className="p-6 space-y-4">
      <div className="flex justify-end">
        <Button onClick={() => router.push('/products/add')}>Add Product</Button>
      </div>
      <Page />
    </div>
  )
}
