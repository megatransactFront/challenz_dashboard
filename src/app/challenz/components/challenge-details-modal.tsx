// app/challenz/components/video-detail-modal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import type { Challenge } from '@/app/types/challenz';

interface VideoDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  challenge: Challenge | null;
}

export function VideoDetailModal({ isOpen, onClose, challenge }: VideoDetailModalProps) {
  if (!challenge) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{challenge.title}</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* Video Player */}
          <div className="aspect-video">
            <video 
              src={challenge.video_url}
              className="w-full h-full rounded-lg object-cover"
              controls
              autoPlay
            />
          </div>

          {/* Creator Info */}
          {challenge.creator && (
            <div className="flex items-center gap-3">
              {challenge.creator.profile_picture_url && (
                <img 
                  src={challenge.creator.profile_picture_url}
                  alt={challenge.creator.username}
                  className="w-10 h-10 rounded-full object-cover"
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

          {/* Challenge Description */}
          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-gray-600">{challenge.description}</p>
          </div>

          {/* Additional Details */}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            {challenge.category && (
              <div>
                <span className="text-sm text-gray-500">Category:</span>
                <p>{challenge.category}</p>
              </div>
            )}
            <div>
              <span className="text-sm text-gray-500">Type:</span>
              <p>
                {challenge.is_seasonal ? 'Seasonal' : 'Regular'} •{' '}
                {challenge.is_sponsored ? 'Sponsored' : 'Not Sponsored'}
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}