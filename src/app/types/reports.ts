export interface CommentReport {
    id: string
    reason: string
    created_at: Date
    comment: {
        id: string
        content: string
        likes: number
        video: Video
    },
    reporter: Reporter
}

export interface Video {
    id: number;
    title: string;
    video_url: string;
    description: string;
}

export interface Reporter {
    id: number;
    username: string;
}

export interface VideoReport {
    id: number;
    title: string;
    description: string;
    created_at: string; // or Date, depending on how you handle dates
    video: Video;
    reporter: Reporter;
}