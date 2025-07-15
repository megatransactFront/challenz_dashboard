'use client'

import { useEffect, useState, useCallback } from 'react'
import { Loader2 } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { formatDate } from '@/helpers/formaters'
import { createClient } from '@supabase/supabase-js'

// Supabase client setup (replace if already initialized elsewhere)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

type ParentalControlEntry = {
  id: string
  parent_id: string
  child_id: string
  consent_given: boolean
  is_locked: boolean
  created_at: string
  updated_at: string
}

export default function ParentalControlPage() {
  const [data, setData] = useState<ParentalControlEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)

  const pageSize = 15

  const fetchParentalControl = useCallback(async () => {
    setLoading(true)
    setError(null)

    const from = (page - 1) * pageSize
    const to = from + pageSize - 1

    const { data, error, count } = await supabase
      .from('parental_controls')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) {
      setError(error.message)
    } else {
      setData(data || [])
      setTotalCount(count || 0)
    }

    setLoading(false)
  }, [page])

  useEffect(() => {
    fetchParentalControl()
  }, [fetchParentalControl])

  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="p-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-6">Parental Control Records</h2>

          {loading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Parent ID</th>
                      <th className="text-left py-3 px-4 font-semibold">Child ID</th>
                      <th className="text-left py-3 px-4 font-semibold">Consent</th>
                      <th className="text-left py-3 px-4 font-semibold">Locked</th>
                      <th className="text-left py-3 px-4 font-semibold">Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((entry) => (
                      <tr key={entry.id} className="border-b hover:bg-gray-50 transition-colors">
                        <td className="py-3 px-4">{entry.parent_id}</td>
                        <td className="py-3 px-4">{entry.child_id}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${entry.consent_given
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                          }`}>
                            {entry.consent_given ? 'Given' : 'Not Given'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-1 rounded-full text-xs ${entry.is_locked
                            ? 'bg-red-100 text-red-800'
                            : 'bg-green-100 text-green-800'
                          }`}>
                            {entry.is_locked ? 'Locked' : 'Unlocked'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-500">{formatDate(entry.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-6">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  >
                    &lt; Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next &gt;
                  </button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
