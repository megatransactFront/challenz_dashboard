'use client';

import { useCallback, useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Challenge, DashboardData } from '@/app/types/challenz';

export default function ChallenzPage() {
  // Fixed state declarations
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Fixed this line
  const [page, setPage] = useState(1);
  const [selectedChallenge, setSelectedChallenge] = useState<Challenge | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <Card>
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-6">Challenge Uploads</h2>
            
            {loading ? (
              <div className="flex justify-center items-center min-h-[400px]">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>TITLE</TableHead>
                        <TableHead>DESCRIPTION</TableHead>
                        <TableHead>CREATED AT</TableHead>
                        <TableHead>STATUS</TableHead>
                        <TableHead>VIDEO</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data?.challenges.map((challenge) => (
                        <TableRow 
                          key={challenge.id}
                          className="cursor-pointer hover:bg-gray-50"
                          onClick={() => setSelectedChallenge(challenge)}
                        >
                          <TableCell className="font-medium">{challenge.title}</TableCell>
                          <TableCell className="max-w-xs truncate">{challenge.description}</TableCell>
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
                              onClick={(e) => {
                                e.stopPropagation();
                                window.open(challenge.video_url, '_blank');
                              }}
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
                {data && (
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

        {/* Challenge Detail Modal */}
        <Dialog 
          open={!!selectedChallenge} 
          onOpenChange={(open) => !open && setSelectedChallenge(null)}
        >
          <DialogContent className="sm:max-w-2xl">
            {selectedChallenge && (
              <>
                <DialogHeader>
                  <DialogTitle>{selectedChallenge.title}</DialogTitle>
                </DialogHeader>
                
                <div className="grid gap-4 py-4">
                  <div className="space-y-2">
                    <h3 className="font-medium">Description</h3>
                    <p className="text-sm text-gray-500">{selectedChallenge.description}</p>
                  </div>

                  <div className="space-y-2">
                    <h3 className="font-medium">Challenge Video</h3>
                    <div className="aspect-video">
                      <video 
                        src={selectedChallenge.video_url}
                        className="w-full h-full rounded-lg object-cover"
                        controls
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    {selectedChallenge.category && (
                      <div>
                        <h3 className="font-medium">Category</h3>
                        <p className="text-sm text-gray-500">{selectedChallenge.category}</p>
                      </div>
                    )}
                    <div>
                      <h3 className="font-medium">Created</h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(selectedChallenge.created_at)}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Last Updated</h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(selectedChallenge.updated_at)}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium">Challenge Type</h3>
                      <p className="text-sm text-gray-500">
                        {selectedChallenge.is_seasonal ? 'Seasonal' : 'Regular'} •{' '}
                        {selectedChallenge.is_sponsored ? 'Sponsored' : 'Not Sponsored'}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}