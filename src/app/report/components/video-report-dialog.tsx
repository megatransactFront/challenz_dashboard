// app/challenz/components/video-detail-modal.tsx
import { Video } from "@/app/types/reports";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Video as VideoIcon } from "lucide-react";

interface VideoDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  video: Video | null;
}

export default function VideoReportDialog({ isOpen, onClose, video }: VideoDetailModalProps) {
  if (!video) return null
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <VideoIcon /> Video Details
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
          <h3 className="flex font-light items-center gap-2"><p className="font-bold">Title:</p> {video?.title}</h3>
          <h3 className="flex font-light items-center gap-2"><p className="font-bold">Description:</p> {video?.description}</h3>
        </div>
      </DialogContent>
    </Dialog>
  );
}