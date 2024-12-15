// app/users/challenges/[challengeId]/details/page.tsx
'use client'

import React from 'react';
import { SaveIcon, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getChallengeById } from '@/app/types/challenges';

export default function ChallengeDetails() {
  const params = useParams();
  const challengeId = params.challengeId as string;
  const challenge = getChallengeById(challengeId);

  if (!challenge) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-lg p-8 text-center">
            <h2 className="text-xl font-semibold mb-4">Challenge not found</h2>
            <Link 
              href="/users/challenges"
              className="text-teal-600 hover:text-teal-700"
            >
              Return to challenges
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-6">
          <Link
            href="/users/challenges"
            className="inline-flex items-center text-teal-600 hover:text-teal-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Challenges
          </Link>
          <Link
            href={`/users/challenges/${challengeId}/comments`}
            className="text-teal-600 hover:text-teal-700"
          >
            View Comments ({challenge.comments})
          </Link>
        </div>

        <div className="bg-white rounded-lg p-8">
          {/* Challenge Details Section */}
          <div className="mb-12">
            <h3 className="text-gray-500 text-lg mb-6">Challenge Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <div className="mb-6">
                  <p className="text-gray-900 font-medium mb-2">Challenge Title</p>
                  <div className="border-b border-gray-200 pb-1">{challenge.title}</div>
                </div>
                <div className="mb-6">
                  <p className="text-gray-900 font-medium mb-2">Content Creator</p>
                  <div className="border-b border-gray-200 pb-1">{challenge.creator}</div>
                </div>
                <div>
                  <p className="text-gray-900 font-medium mb-2">Date Posted</p>
                  <div className="border-b border-gray-200 pb-1">{challenge.datePosted}</div>
                </div>
              </div>
              <div>
                <div className="mb-6">
                  <p className="text-gray-900 font-medium mb-2">Topic</p>
                  <div className="border-b border-gray-200 pb-1">{challenge.topic}</div>
                </div>
                <div className="mb-6">
                  <p className="text-gray-900 font-medium mb-2">Voting</p>
                  <div className="border-b border-gray-200 pb-1">{challenge.voting}</div>
                </div>
                <div>
                  <p className="text-gray-900 font-medium mb-2">Date Expired</p>
                  <div className="border-b border-gray-200 pb-1">{challenge.dateExpired}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Summary Section */}
          <div className="mb-12">
            <h3 className="text-gray-500 text-lg mb-6">Performance Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div>
                <div className="mb-6">
                  <p className="text-gray-900 font-medium mb-2">Views</p>
                  <div className="border-b border-gray-200 pb-1">{challenge.views}</div>
                </div>
                <div>
                  <p className="text-gray-900 font-medium mb-2">Users Joined Challenge</p>
                  <div className="border-b border-gray-200 pb-1">{challenge.usersJoined}</div>
                </div>
              </div>
              <div>
                <div className="mb-6">
                  <p className="text-gray-900 font-medium mb-2">Likes</p>
                  <div className="border-b border-gray-200 pb-1">{challenge.likes}</div>
                </div>
                <div>
                  <p className="text-gray-900 font-medium mb-2">Comments</p>
                  <div className="border-b border-gray-200 pb-1 flex justify-between">
                    <span>{challenge.comments} Comments</span>
                    <Link 
                      href={`/users/challenges/${challengeId}/comments`} 
                      className="text-rose-500 text-sm"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sponsored Challenge Section */}
          {challenge.prizes && (
            <div>
              <h3 className="text-gray-500 text-lg mb-6">Sponsored Challenge</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <div className="mb-6">
                    <p className="text-gray-900 font-medium mb-2">Sponsor Name</p>
                    <div className="border-b border-gray-200 pb-1">{challenge.sponsored}</div>
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium mb-2">2nd Place Prize</p>
                    <div className="border-b border-gray-200 pb-1">{challenge.prizes.second}</div>
                  </div>
                </div>
                <div>
                  <div className="mb-6">
                    <p className="text-gray-900 font-medium mb-2">1st Place Prize</p>
                    <div className="border-b border-gray-200 pb-1">{challenge.prizes.first}</div>
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium mb-2">3rd Place Prize</p>
                    <div className="border-b border-gray-200 pb-1">{challenge.prizes.third}</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="mt-8">
            <button className="bg-rose-500 text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-rose-600 transition-colors">
              <SaveIcon className="w-5 h-5" />
              Save
            </button>
          </div>
        </div>

        {/* Learning Together Button */}
        <div className="mt-8 flex justify-center">
          <button className="bg-rose-500 text-white px-8 py-3 rounded-lg hover:bg-rose-600 transition-colors">
            LEARNING TOGETHER
          </button>
        </div>
      </div>
    </div>
  );
}