// app/challenz/components/video-detail-modal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Video } from "lucide-react";

interface VideoDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: Video | null;
}
interface Video {
  id: string
  title: string
  video_url: string
}
export default function VideoCommentsTab({ isOpen, onClose, video }: VideoDetailModalProps) {
  if (!video) return null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Video className="w-6 h-6" />
            Video
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          {/* Video Player */}
          <div className="aspect-video">
            <video
              src={video?.video_url}
              className="w-full h-full rounded-lg object-cover"
              controls
              autoPlay
            />
          </div>
        </div>
        <div>
          {video?.title && (
            <h3 className="flex font-medium items-center gap-2"><p className="font-bold">Title:</p> {video.title}</h3>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}