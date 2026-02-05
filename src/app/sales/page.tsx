'use client'

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import FlashSalesListPage from "./list/page"


export default function FlashSalesPage() {
  const router = useRouter()

  return (
    <div className="p-6 space-y-0">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6 border-b pb-4">
        <Button
          onClick={() => router.push('/sales/add')}
          className="py-1 px-6 text-lg font-bold rounded-xl w-full sm:w-auto"
        >
          Add Flash Sale
        </Button>
      </div>
      <>
        <FlashSalesListPage />
      </>

    </div>
  )
}
