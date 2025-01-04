// challenges.ts

// Type definitions
export interface Challenge {
  id: string;
  title: string;
  creator: string;
  datePosted: string;
  dateExpired?: string;
  topic?: string;
  voting?: string;
  views: number;
  usersJoined: number;
  likes: number;
  comments: number;
  sponsored: string;
  prizes?: {
    first: string;
    second: string;
    third: string;
  };
}

export interface Comment {
  id: string;
  username: string;
  comment: string;
  commentLikes: number;
  reports: number;
  replies: number;
  challengeId: string;
  createdAt: string;
}

// Mock data
const challengesData: Challenge[] = [
  {
    id: "1",
    title: "Dance Challenge",
    creator: "James Thor",
    datePosted: "26/11/24",
    dateExpired: "26/12/24",
    topic: "Dance/Entertainment",
    voting: "Off",
    views: 853,
    usersJoined: 500,
    likes: 244,
    comments: 57,
    sponsored: "Adidas",
    prizes: {
      first: "$5,000",
      second: "$2,500",
      third: "$1,000"
    }
  },
  {
    id: "2",
    title: "Jump and Jacks",
    creator: "James Thor",
    datePosted: "26/11/24",
    dateExpired: "26/12/24",
    topic: "Dance/Entertainment",
    voting: "Off",
    views: 853,
    usersJoined: 500,
    likes: 244,
    comments: 57,
    sponsored: "Adidas",
    prizes: {
      first: "$5,000",
      second: "$2,500",
      third: "$1,000"
    }
  }
];

const commentsData: Comment[] = [
  {
    id: "1",
    challengeId: "1",
    username: "Jacob Evans",
    comment: "This workout was intense! I'm definitely feeling the burn. Can't wait to try it again tomorrow!",
    commentLikes: 74,
    reports: 0,
    replies: 40,
    createdAt: "2024-11-26"
  },
  {
    id: "2",
    challengeId: "1",
    username: "Stephanie Kerr",
    comment: "Wow, this recipe looks amazing! I love how simple it is. I'm going to make this for dinner tonight",
    commentLikes: 74,
    reports: 1,
    replies: 60,
    createdAt: "2024-11-26"
  },
  {
    id: "3",
    challengeId: "2",
    username: "John Wild",
    comment: "Wow, this recipe looks amazing! I love how simple it is. I'm going to make this for dinner tonight",
    commentLikes: 74,
    reports: 1,
    replies: 60,
    createdAt: "2024-11-26"
  }
];

// Utility functions
export const getChallengeById = (id: string): Challenge | undefined => {
  return challengesData.find(challenge => challenge.id === id);
};

export const getChallengeComments = (challengeId: string): Comment[] => {
  return commentsData.filter(comment => comment.challengeId === challengeId);
};

// Export the data
export { challengesData, commentsData };