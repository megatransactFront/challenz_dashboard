// app/api/dashboard/content-performance/route.ts
import { NextResponse } from 'next/server';
import type { Post, Category } from '@/app/types/content-performance';

interface ContentPerformanceData {
  topPosts: Post[];
  topCategories: Category[];
}

const mockContentPerformanceData: ContentPerformanceData = {
  topPosts: [
    { id: 1, title: 'Ice Bucket Challenge', creator: 'James Thoi', views: '11 Mil', likes: '45k', shares: '190k', category: 'Fundraiser' },
    { id: 2, title: 'Screen Time Challenge', creator: 'Joseph Lee', views: '900.2k', likes: '40k', shares: '175k', category: 'Wellbeing' },
    { id: 3, title: 'Yoga Challenge', creator: 'Marcus Ferrari', views: '850.5k', likes: '37k', shares: '150k', category: 'Health' },
    { id: 4, title: 'Hip-Hop Challenge', creator: 'Ivan Dimitri', views: '772.0k', likes: '30k', shares: '125k', category: 'Entertainment' },
    { id: 5, title: 'Plank Challenge', creator: 'Mick Schumacher', views: '665.9k', likes: '25k', shares: '110k', category: 'Fitness' },
    { id: 6, title: 'Mannequin Challenge', creator: 'Hugh Hamilton', views: '632.5k', likes: '20k', shares: '80k', category: 'Entertainment' },
    { id: 7, title: 'Coding Challenge', creator: 'Panbio Chiron', views: '500.0k', likes: '10k', shares: '5k', category: 'Education' },
  ],
  topCategories: [
    { id: 1, category: 'Entertainment', totalChallenges: '5.2 Mil', views: '11 Mil', likes: '45k', shares: '190k' },
    { id: 2, category: 'Fitness', totalChallenges: '1.2 Mil', views: '900.2k', likes: '40k', shares: '175k' },
  ]
};

export const GET = async () => {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return NextResponse.json(mockContentPerformanceData);
}