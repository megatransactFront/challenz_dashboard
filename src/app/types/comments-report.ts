export interface CommentReport {
    id: string
    reason: string
    created_at: Date
    comments: {
        id: string
        content: string
        likes: number
        video?: {
            id: string
            title: string
            video_url: string
        }
    },
    reporters: {
        id: string
        username: string
    }
}

