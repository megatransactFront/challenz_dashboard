'use client'

import { useState } from "react"
import Page from "./list/page"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

const regionOptions = [
  { value: "", label: "All Countries" },
  { value: "NZ", label: "New Zealand" },
  { value: "AU", label: "Australia" },
  { value: "US", label: "United States" }
]

export default function ServicesPage() {
  const router = useRouter()
  const [region, setRegion] = useState("")

  return (
    <div className="p-6 space-y-0">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mb-6 border-b pb-4">
        <div className="w-full sm:w-auto flex items-center gap-2">
          <label htmlFor="region" className="text-base font-medium text-gray-700">Filter by Country:</label>
          <select
            id="region"
            value={region}
            onChange={e => setRegion(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400"
            style={{ minWidth: 250 }}
          >
            {regionOptions.map(opt =>
              <option value={opt.value} key={opt.value}>{opt.label}</option>
            )}
          </select>
        </div>
        <Button
          onClick={() => router.push('/services_ID/add')}
          className="py-1 px-6 text-lg font-bold rounded-xl w-full sm:w-auto"
        >
          Add Service
        </Button>
      </div>
      <Page region={region} />
    </div>
  )
}
