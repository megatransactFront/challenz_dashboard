'use client';

import React from 'react';
import type { ContentPerformanceData } from '@/app/types/content-performance';

const ContentPerformanceTables = ({ topPosts, topCategories }: ContentPerformanceData) => {
  return (
    <div className="space-y-6">
      {/* Top Performing Posts Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <h2 className="text-lg font-semibold p-6 pb-4">Top Performing Posts</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 w-12">#</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">CHALLENGE TITLE</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">CREATOR</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">VIEWS</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">LIKES</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">SHARES</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">CATEGORY</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {topPosts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-4 text-sm text-gray-600">{post.id}</td>
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">{post.title}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{post.creator}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{post.views}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{post.likes}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{post.shares}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{post.category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Top Performing Category Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <h2 className="text-lg font-semibold p-6 pb-4">Top Performing Category</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500 w-12">#</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">CATEGORY</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">TOTAL CHALLENGES</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">VIEWS</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">LIKES</th>
                <th className="py-3 px-4 text-left text-sm font-medium text-gray-500">SHARES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {topCategories.map((category) => (
                <tr key={category.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-4 text-sm text-gray-600">{category.id}</td>
                  <td className="py-4 px-4 text-sm font-medium text-gray-900">{category.category}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{category.totalChallenges}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{category.views}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{category.likes}</td>
                  <td className="py-4 px-4 text-sm text-gray-600">{category.shares}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Learning Together Button */}
      <div className="flex justify-center py-4">
        <button className="bg-red-400 hover:bg-red-500 text-white px-8 py-3 rounded-lg font-medium transition-colors">
          LEARNING TOGETHER
        </button>
      </div>
    </div>
  );
};

export default ContentPerformanceTables;