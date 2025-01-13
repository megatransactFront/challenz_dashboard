// components/challenge-detail-modal.tsx
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
  import { useState, useEffect } from 'react'
  import { Loader2 } from 'lucide-react'
  
  type ChallengeDetail = {
    id: string
    title: string
    description: string
    category: string
    is_seasonal: boolean
    is_sponsored: boolean
    created_at: string
    updated_at: string
    video_url: string
    user: {
      id: string
      name: string
      avatar_url: string
    }
    creator: {
      id: string
      name: string
      profile_details: string
    }
  }
  
  interface ChallengeDetailModalProps {
    isOpen: boolean
    onClose: () => void
    challengeId: string | null
  }
  
  export function ChallengeDetailModal({ 
    isOpen, 
    onClose, 
    challengeId 
  }: ChallengeDetailModalProps) {
    const [challenge, setChallenge] = useState<ChallengeDetail | null>(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
  
    useEffect(() => {
      async function fetchChallengeDetail() {
        if (!challengeId) return
        
        try {
          setLoading(true)
          setError(null)
          const response = await fetch(`/api/challenz/${challengeId}`)
          if (!response.ok) throw new Error('Failed to fetch challenge details')
          const data = await response.json()
          setChallenge(data)
        } catch (err) {
          setError(err instanceof Error ? err.message : 'An error occurred')
        } finally {
          setLoading(false)
        }
      }
  
      if (isOpen && challengeId) {
        fetchChallengeDetail()
      }
    }, [isOpen, challengeId])
  
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-2xl">
          {loading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : error ? (
            <div className="text-red-500 p-4">{error}</div>
          ) : challenge ? (
            <>
              <DialogHeader>
                <DialogTitle>{challenge.title}</DialogTitle>
                <DialogDescription>
                  Created by {challenge.creator.name}
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Description</h3>
                  <p className="text-sm text-gray-500">{challenge.description}</p>
                </div>
  
                {challenge.video_url && (
                  <div className="space-y-2">
                    <h3 className="font-medium">Challenge Video</h3>
                    <video 
                      src={challenge.video_url}
                      className="w-full rounded-lg"
                      controls
                    />
                  </div>
                )}
  
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium">Category</h3>
                    <p className="text-sm text-gray-500">{challenge.category}</p>
                  </div>
                  <div>
                    <h3 className="font-medium">Created</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(challenge.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">Type</h3>
                    <p className="text-sm text-gray-500">
                      {challenge.is_seasonal ? 'Seasonal' : 'Regular'} •{' '}
                      {challenge.is_sponsored ? 'Sponsored' : 'Not Sponsored'}
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    )
  }