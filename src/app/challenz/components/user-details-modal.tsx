// app/challenz/components/user-detail-modal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState, useEffect } from 'react';
import { Loader2, Video } from 'lucide-react';
import { formatDate } from "@/helpers/formater";

type UserDetails = {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  profile_picture_url: string | null;
  created_at: string;
  challenges: Array<{
    id: string;
    title: string;
    created_at: string;
    views_count: number;
  }>;
}

interface UserDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string | null;
}

export function UserDetailModal({ isOpen, onClose, userId }: UserDetailModalProps) {
  const [user, setUser] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUserDetails() {
      if (!userId) return;

      try {
        setLoading(true);
        setError(null);
        // Log the userId being requested
        console.log('Fetching user details for ID:', userId);

        const response = await fetch(`/api/users?userId=${userId}`);

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error('Failed to fetch user details');
        }

        const data = await response.json();
        console.log('Received user data:', data);

        if (!data) {
          throw new Error('No user data received');
        }

        setUser(data);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    if (isOpen && userId) {
      fetchUserDetails();
    } else {
      setUser(null);
    }
  }, [isOpen, userId]);

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-red-500 p-4">{error}</div>
        ) : user ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {user.first_name} {user.last_name}
              </DialogTitle>
              <p className="text-gray-500">@{user.username}</p>
            </DialogHeader>

            <div className="mt-6 space-y-6">
              <div className="flex items-start gap-4">
                {user.profile_picture_url ? (
                  <img
                    src={user.profile_picture_url}
                    alt={`${user.first_name} ${user.last_name}`}
                    className="w-24 h-24 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-2xl text-gray-500">
                      {user.first_name[0]}{user.last_name[0]}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <p className="text-sm text-gray-500">
                    Joined {formatDate(user.created_at)}
                  </p>
                </div>
              </div>

              {user.challenges?.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Recent Challenges</h3>
                  <div className="space-y-2">
                    {user.challenges.map(challenge => (
                      <div
                        key={challenge.id}
                        className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4 text-gray-500" />
                          <span className="font-medium">{challenge.title}</span>
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
        ) : (
          <div className="text-center py-8">
            <p>No user data available</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}