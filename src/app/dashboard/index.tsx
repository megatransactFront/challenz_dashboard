"use client"

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Clock, Trophy, Target, DollarSign, BarChart } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from 'recharts';

// Mock data - replace with actual API endpoints
const mockUserData = [
  { month: 'March', totalUsers: 8000, newUsers: 2000 },
  { month: 'Feb', totalUsers: 7000, newUsers: 1500 },
  // ... add more months
];

const mockEngagementData = Array.from({ length: 24 }, (_, i) => ({
  time: `${String(i).padStart(2, '0')}:00`,
  users: Math.floor(Math.random() * 100) + 50,
}));

const mockTopPosts = [
  {
    id: 1,
    title: "Ice Bucket Challenge",
    creator: "James Thor",
    views: "11 Mil",
    likes: "45k",
    shares: "190k",
    category: "Fundraiser"
  },
  // ... add more posts
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const StatCard = ({ title, value, icon: Icon }) => (
    <Card className="bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <Icon className="h-4 w-4 text-gray-500" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );

  const OverviewTab = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Total Registrations" value="1,125 Users" icon={Users} />
        <StatCard title="New Users" value="154 Users" icon={Users} />
        <StatCard title="Total Challenges" value="7,560" icon={Trophy} />
        <StatCard title="Total Revenue" value="$10,450.00" icon={DollarSign} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Users</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockUserData}>
                <defs>
                  <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1f4d5b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#1f4d5b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="totalUsers" stroke="#1f4d5b" fillOpacity={1} fill="url(#colorUv)" />
                <Area type="monotone" dataKey="newUsers" stroke="#ff4d4f" fill="#ff4d4f" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const EngagementTab = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Active Users" value="5,021" icon={Users} />
        <StatCard title="Average Daily Usage" value="24 Minutes" icon={Clock} />
        <StatCard title="New Challenges" value="250 Daily" icon={Trophy} />
        <StatCard title="Challenges Participated" value="270 Daily" icon={Target} />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <StatCard title="Best Time To Post" value="7pm - 9pm" icon={Clock} />
        <StatCard title="Hot Categories" value="Entertainment" icon={BarChart} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>User Engagement</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockEngagementData}>
                <defs>
                  <linearGradient id="colorEngagement" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1f4d5b" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#1f4d5b" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="users" stroke="#1f4d5b" fill="url(#colorEngagement)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const ContentPerformanceTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Posts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                <tr>
                  <th className="px-6 py-3">#</th>
                  <th className="px-6 py-3">Challenge Title</th>
                  <th className="px-6 py-3">Creator</th>
                  <th className="px-6 py-3">Views</th>
                  <th className="px-6 py-3">Likes</th>
                  <th className="px-6 py-3">Shares</th>
                  <th className="px-6 py-3">Category</th>
                </tr>
              </thead>
              <tbody>
                {mockTopPosts.map((post, index) => (
                  <tr key={post.id} className="bg-white border-b">
                    <td className="px-6 py-4">{index + 1}</td>
                    <td className="px-6 py-4 font-medium">{post.title}</td>
                    <td className="px-6 py-4">{post.creator}</td>
                    <td className="px-6 py-4">{post.views}</td>
                    <td className="px-6 py-4">{post.likes}</td>
                    <td className="px-6 py-4">{post.shares}</td>
                    <td className="px-6 py-4">{post.category}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Master Dashboard</h1>
          <p className="text-gray-500">Administrator</p>
        </div>
        <div className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search Overview"
            className="rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="mb-6">
        <nav className="flex space-x-4">
          {['Overview', 'Revenues', 'Engagement', 'Content Performance'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase().replace(' ', '-'))}
              className={`px-4 py-2 text-sm font-medium rounded-lg ${
                activeTab === tab.toLowerCase().replace(' ', '-')
                  ? 'bg-white text-gray-900 shadow'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      <div className="py-4">
        {activeTab === 'overview' && <OverviewTab />}
        {activeTab === 'engagement' && <EngagementTab />}
        {activeTab === 'content-performance' && <ContentPerformanceTab />}
      </div>
    </div>
  );
}