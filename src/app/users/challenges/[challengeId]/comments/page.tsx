// app/users/challenges/[challengeId]/comments/page.tsx
'use client'

import React from 'react'
import { ArrowLeft, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { getChallengeById, getChallengeComments } from '@/app/types/challenges'

export default function CommentsPage() {
  const params = useParams();
  const challengeId = params.challengeId as string;
  
  const challenge = getChallengeById(challengeId);
  const comments = getChallengeComments(challengeId);

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
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link 
              href="/users/challenges" 
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Comments for {challenge.title}</h1>
          </div>
          <Link
            href={`/users/challenges/${challengeId}/details`}
            className="text-teal-600 hover:text-teal-700"
          >
            View Challenge Details
          </Link>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            {/* Desktop View - Table Layout */}
            <div className="hidden md:block">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-4 font-semibold">USERNAME</th>
                    <th className="text-left py-4 px-4 font-semibold">COMMENT</th>
                    <th className="text-left py-4 px-4 font-semibold text-center">COMMENT LIKES</th>
                    <th className="text-left py-4 px-4 font-semibold text-center">REPORTS</th>
                    <th className="text-left py-4 px-4 font-semibold text-center">REPLIES</th>
                  </tr>
                </thead>
                <tbody>
                  {comments.map((comment) => (
                    <tr key={comment.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 font-medium">{comment.username}</td>
                      <td className="py-4 px-4">{comment.comment}</td>
                      <td className="py-4 px-4 text-center">{comment.commentLikes}</td>
                      <td className="py-4 px-4 text-center">{comment.reports || '-'}</td>
                      <td className="py-4 px-4 text-center">{comment.replies || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile View - Card Layout */}
            <div className="md:hidden space-y-4">
              {comments.map((comment) => (
                <div 
                  key={comment.id}
                  className="bg-white rounded-lg border p-4"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-medium">{comment.username}</span>
                    <div className="text-sm text-gray-500">
                      {comment.commentLikes} likes
                    </div>
                  </div>
                  <p className="text-gray-800 mb-3">{comment.comment}</p>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>{comment.replies ? `${comment.replies} replies` : 'No replies'}</span>
                    {comment.reports > 0 && (
                      <span className="text-red-500">{comment.reports} reports</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors">
            Previous
          </button>
          <div className="flex items-center gap-2">
            <button className="px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800 transition-colors">
              1
            </button>
          </div>
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors">
            Next
          </button>
        </div>

        {/* Learning Together Button */}
        <div className="flex justify-center mt-8">
          <button className="px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors">
            LEARNING TOGETHER
          </button>
        </div>
      </div>
    </div>
  );
}