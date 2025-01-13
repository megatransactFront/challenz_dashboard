'use client'

import { useEffect, useState, useCallback } from 'react'
import { Loader2 } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"

type User = {
  id: string
  username: string
  email: string
  first_name: string
  last_name: string
  phone_number: string | null
  birthday: string | null
  parent_id: string | null
  coins: number
  total_coins_earned: number
  role: string
  is_locked: boolean
  created_at: string
  updated_at: string
  age: number | null
  profile_picture_url: string | null
  bio: string | null
  location: string | null
  isabove18: boolean | null
  acceptterms: boolean | null
  referral_code: string | null
}

type PaginationData = {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10
  })

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      })

      const response = await fetch(`/api/users?${params}`)
      if (!response.ok) throw new Error('Failed to fetch users')
      
      const data = await response.json()
      setUsers(data.users || [])
      setPagination(data.pagination)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }, [page])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  return (
    <div className="p-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-6">Users List</h2>
          
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">{error}</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-4 px-4 font-semibold">USER INFO</th>
                      <th className="text-left py-4 px-4 font-semibold">CONTACT</th>
                      <th className="text-left py-4 px-4 font-semibold">STATUS</th>
                      <th className="text-left py-4 px-4 font-semibold">COINS</th>
                      <th className="text-left py-4 px-4 font-semibold">JOINED</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => (
                      <tr 
                        key={user.id} 
                        className="border-b hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div>
                            <div className="font-medium">{user.username}</div>
                            <div className="text-sm text-gray-500">
                              {user.first_name} {user.last_name}
                            </div>
                            {user.age && (
                              <div className="text-xs text-gray-400">
                                Age: {user.age}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm">
                            <div>{user.email}</div>
                            {user.phone_number && (
                              <div className="text-gray-500">{user.phone_number}</div>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex flex-col gap-2">
                            <span className={`px-2 py-1 rounded-full text-xs ${
                              user.is_locked 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {user.is_locked ? 'Locked' : 'Active'}
                            </span>
                            <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                              {user.role}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm">
                            <div className="font-medium">{user.coins}</div>
                            <div className="text-xs text-gray-500">
                              Total earned: {user.total_coins_earned}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="text-sm text-gray-500">
                            {formatDate(user.created_at)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex justify-between items-center mt-6">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm text-gray-600">
                    Page {page} of {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                    disabled={page === pagination.totalPages}
                    className="px-4 py-2 border rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50"
                  >
                    Next
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