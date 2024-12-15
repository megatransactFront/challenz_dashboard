// app/users/challenges/page.tsx
'use client'

import React from 'react'
import { BellIcon, MonitorIcon, Search, MessageSquare } from 'lucide-react'
import Link from 'next/link'
import { challengesData } from '@/app/types/challenges'

export default function ChallengePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Master Dashboard</h1>
            <p className="text-gray-500">Administrator</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full md:w-auto">
            <div className="relative flex-grow sm:flex-grow-0">
              <input
                type="text"
                placeholder="Search Overview"
                className="w-full sm:w-64 pl-4 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <BellIcon className="h-5 w-5" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <MonitorIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Challenge Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Challenge Uploads</h2>
            
            {/* Mobile View - Card Layout */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {challengesData.map((challenge) => (
                <div 
                  key={challenge.id}
                  className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <Link 
                      href={`/users/challenges/${challenge.id}/details`}
                      className="hover:text-teal-600 transition-colors"
                    >
                      {challenge.title}
                    </Link>
                    <Link
                      href={`/users/challenges/${challenge.id}/comments`}
                      className="flex items-center gap-1 text-sm text-teal-600 hover:text-teal-700"
                    >
                      <MessageSquare className="h-4 w-4" />
                      <span>{challenge.comments}</span>
                    </Link>
                  </div>
                  {/* ... rest of the mobile card content ... */}
                </div>
              ))}
            </div>

            {/* Desktop View - Table Layout */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-4 px-4 font-semibold">CHALLENGE TITLE</th>
                    <th className="text-left py-4 px-4 font-semibold">CREATOR</th>
                    <th className="text-left py-4 px-4 font-semibold">DATE POSTED</th>
                    <th className="text-left py-4 px-4 font-semibold hidden lg:table-cell">VIEWS</th>
                    <th className="text-left py-4 px-4 font-semibold hidden lg:table-cell">USERS JOINED</th>
                    <th className="text-left py-4 px-4 font-semibold hidden xl:table-cell">LIKES</th>
                    <th className="text-left py-4 px-4 font-semibold hidden xl:table-cell">COMMENTS</th>
                    <th className="text-left py-4 px-4 font-semibold">SPONSORED</th>
                  </tr>
                </thead>
                <tbody>
                  {challengesData.map((challenge) => (
                    <tr 
                      key={challenge.id} 
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="py-4 px-4 font-medium">
                        <Link 
                          href={`/users/challenges/${challenge.id}/details`}
                          className="hover:text-teal-600 transition-colors"
                        >
                          {challenge.title}
                        </Link>
                      </td>
                      <td className="py-4 px-4">{challenge.creator}</td>
                      <td className="py-4 px-4">{challenge.datePosted}</td>
                      <td className="py-4 px-4 hidden lg:table-cell">{challenge.views.toLocaleString()}</td>
                      <td className="py-4 px-4 hidden lg:table-cell">{challenge.usersJoined.toLocaleString()}</td>
                      <td className="py-4 px-4 hidden xl:table-cell">{challenge.likes.toLocaleString()}</td>
                      <td className="py-4 px-4 hidden xl:table-cell">
                        <Link
                          href={`/users/challenges/${challenge.id}/comments`}
                          className="flex items-center justify-center gap-1 text-sm text-teal-600 hover:text-teal-700"
                        >
                          <MessageSquare className="h-4 w-4" />
                          <span>{challenge.comments}</span>
                        </Link>
                      </td>
                      <td className="py-4 px-4 text-teal-600">
                        {challenge.sponsored}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pagination and other UI elements remain the same */}
      </div>
    </div>
  )
}