'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UserDetailModal } from './components/user-details-modal';
import { VideoDetailModal } from './components/challenge-details-modal';
import type { Challenge, DashboardData } from '@/app/types/challenz';
import { formatDate } from '@/helpers/formaters';


export default function ChallenzPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  // Modal states
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });

      const response = await fetch(`/api/challenz?${params}`);
      if (!response.ok) throw new Error('Failed to fetch data');

      const result = await response.json();

      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="p-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-6">Challenge Uploads</h2>

          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-8">{error}</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>TITLE</TableHead>
                      <TableHead>CREATOR</TableHead>
                      <TableHead>DESCRIPTION</TableHead>
                      <TableHead>CREATED AT</TableHead>
                      <TableHead>STATUS</TableHead>
                      <TableHead>VIDEO</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data?.challenges.map((challenge, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{challenge.title}</TableCell>
                        <TableCell>
                          {challenge.creator && (
                            <div
                              className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded-lg"
                              onClick={() => setSelectedUserId(challenge.creator!.id)}
                            >
                              {challenge.creator.profile_picture_url && (
                                <img
                                  src={challenge.creator.profile_picture_url}
                                  alt={challenge.creator.username}
                                  className="w-8 h-8 rounded-full object-cover"
                                />
                              )}
                              <div>
                                <div className="font-medium">
                                  {challenge.creator.first_name} {challenge.creator.last_name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  @{challenge.creator.username}
                                </div>
                              </div>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="max-w-xs truncate">
                          <div className='px-6 sm:px-0'>
                            {challenge.description}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(challenge.created_at)}</TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            {challenge.is_sponsored && (
                              <span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">
                                Sponsored
                              </span>
                            )}
                            {challenge.is_seasonal && (
                              <span className="px-2 py-1 rounded-full text-xs bg-orange-100 text-orange-800">
                                Seasonal
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            className="text-blue-600 hover:text-blue-800"
                            onClick={() => setSelectedChallenge(challenge)}
                          >
                            View Video
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination */}
              {data && data.pagination.totalPages > 1 && (
                <div className="flex items-center justify-between mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-500">
                    Page {page} of {data.pagination.totalPages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() => setPage(p => Math.min(data.pagination.totalPages, p + 1))}
                    disabled={page === data.pagination.totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <UserDetailModal
        isOpen={!!selectedUserId}
        onClose={() => setSelectedUserId(null)}
        userId={selectedUserId}
      />

      <VideoDetailModal
        isOpen={!!selectedChallenge}
        onClose={() => setSelectedChallenge(null)}
        challenge={selectedChallenge}
      />
    </div>
  );
}