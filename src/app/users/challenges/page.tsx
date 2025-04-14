'use client'

import { useEffect, useState, useCallback } from 'react'
import { Loader2, Video } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { formatDate } from '@/helpers/formater'

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
  challenges?: Array<{
    id: string
    title: string
    created_at: string
  }>
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
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [userDetailsLoading, setUserDetailsLoading] = useState(false)
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

  const fetchUserDetails = async (userId: string) => {
    try {
      setUserDetailsLoading(true)
      const response = await fetch(`/api/users?userId=${userId}`)
      if (!response.ok) throw new Error('Failed to fetch user details')
      const data = await response.json()
      setSelectedUser(data)
    } catch (err) {
      console.error('Error fetching user details:', err)
    } finally {
      setUserDetailsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

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
                        className="border-b hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => fetchUserDetails(user.id)}
                      >
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            {user.profile_picture_url ? (
                              <img
                                src={user.profile_picture_url}
                                alt={user.username}
                                className="w-10 h-10 rounded-full object-cover"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-600">
                                  {user.first_name?.[0]}{user.last_name?.[0]}
                                </span>
                              </div>
                            )}
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
                            <span className={`px-2 py-1 rounded-full text-xs ${user.is_locked
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

      {/* User Details Modal */}
      <Dialog
        open={!!selectedUser}
        onOpenChange={(open) => !open && setSelectedUser(null)}
      >
        <DialogContent className="sm:max-w-2xl">
          {userDetailsLoading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : selectedUser ? (
            <>
              <DialogHeader>
                <DialogTitle>User Profile</DialogTitle>
              </DialogHeader>

              <div className="mt-6 space-y-6">
                {/* User Basic Info */}
                <div className="flex items-start gap-4">
                  {selectedUser.profile_picture_url ? (
                    <img
                      src={selectedUser.profile_picture_url}
                      alt={selectedUser.username}
                      className="w-24 h-24 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-2xl text-gray-600">
                        {selectedUser.first_name?.[0]}{selectedUser.last_name?.[0]}
                      </span>
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-semibold">
                      {selectedUser.first_name} {selectedUser.last_name}
                    </h2>
                    <p className="text-gray-500">@{selectedUser.username}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Joined {formatDate(selectedUser.created_at)}
                    </p>
                  </div>
                </div>

                {/* Additional User Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium text-gray-500">Email</h3>
                    <p>{selectedUser.email}</p>
                  </div>
                  {selectedUser.phone_number && (
                    <div>
                      <h3 className="font-medium text-gray-500">Phone</h3>
                      <p>{selectedUser.phone_number}</p>
                    </div>
                  )}
                  {selectedUser.location && (
                    <div>
                      <h3 className="font-medium text-gray-500">Location</h3>
                      <p>{selectedUser.location}</p>
                    </div>
                  )}
                  {selectedUser.bio && (
                    <div className="col-span-2">
                      <h3 className="font-medium text-gray-500">Bio</h3>
                      <p>{selectedUser.bio}</p>
                    </div>
                  )}
                </div>

                {/* User's Challenges */}
                {selectedUser.challenges && selectedUser.challenges.length > 0 && (
                  <div>
                    <h3 className="font-medium text-gray-500 mb-3">Recent Challenges</h3>
                    <div className="space-y-2">
                      {selectedUser.challenges.map(challenge => (
                        <div
                          key={challenge.id}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-2">
                            <Video className="h-4 w-4 text-gray-500" />
                            <span>{challenge.title}</span>
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDate(challenge.created_at)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  )
}