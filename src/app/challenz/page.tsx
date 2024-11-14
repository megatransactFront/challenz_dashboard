// app/challenz/page.tsx
"use client"

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Crown, Coins, Wallet, ChevronLeft, ChevronRight, Search, Download, Filter } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Mock data
const mockChallenges = [
  { title: 'Dance Challenge', creator: 'James Thoi', datePosted: '26/11/24', views: 74, usersJoined: 74, likes: 560, comments: 40, sponsored: 'Adidas' },
  { title: 'ALS Ice Bucket Challenge', creator: 'Joseph Lee', datePosted: '26/11/24', views: 74, usersJoined: 74, likes: 700, comments: 60, sponsored: 'Noel Leeming' },
  // ... add more challenges
];

const mockBadges = [
  { date: '30/04/2024', badge: 'Bronze', category: '1st Place', challenge: 'Dance Challenge', coinsEarned: '$1,250' },
  { date: '29/04/2024', badge: 'Silver', category: '2nd Place', challenge: 'Dance Challenge', coinsEarned: '$1,250' },
  // ... add more badges
];

export default function ChallenzPage() {
  const [activeTab, setActiveTab] = useState('challenges');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const StatCard = ({ title, value, icon: Icon }) => (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <Icon className="h-4 w-4 text-teal-700" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  );

  const filteredData = useMemo(() => {
    return mockChallenges.filter(item =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.creator.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);

  const ChallengesView = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Input
            placeholder="Search challenges..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-xs"
          />
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <Button onClick={() => {/* Add export logic */}}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Challenge Uploads</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>CHALLENGE TITLE</TableHead>
                <TableHead>CREATOR</TableHead>
                <TableHead>DATE POSTED</TableHead>
                <TableHead>VIEWS</TableHead>
                <TableHead>USER'S JOINED</TableHead>
                <TableHead>LIKES</TableHead>
                <TableHead>COMMENTS</TableHead>
                <TableHead>SPONSORED</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.map((challenge, index) => (
                <TableRow key={index} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{challenge.title}</TableCell>
                  <TableCell>{challenge.creator}</TableCell>
                  <TableCell>{challenge.datePosted}</TableCell>
                  <TableCell>{challenge.views}</TableCell>
                  <TableCell>{challenge.usersJoined}</TableCell>
                  <TableCell>{challenge.likes}</TableCell>
                  <TableCell className="text-teal-700">{challenge.comments}</TableCell>
                  <TableCell className="text-teal-700">{challenge.sponsored || '-'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="flex justify-center mt-4 gap-2">
            <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => Math.max(1, p - 1))}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline">{currentPage}</Button>
            <Button variant="outline" size="icon" onClick={() => setCurrentPage(p => p + 1)}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const BadgesView = () => (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Badges Earned" value="25 Badges" icon={Award} />
        <StatCard title="Highest Badge" value="Amethyst" icon={Crown} />
        <StatCard title="Total Coins Earned" value="$5,980.00" icon={Coins} />
        <StatCard title="Total Coins Spent" value="$3,450.00" icon={Wallet} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Badge Progression</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>DATE</TableHead>
                <TableHead>BADGE</TableHead>
                <TableHead>CATEGORY</TableHead>
                <TableHead>CHALLENGE</TableHead>
                <TableHead>COINS EARNED</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockBadges.map((badge, index) => (
                <TableRow key={index}>
                  <TableCell>{badge.date}</TableCell>
                  <TableCell>{badge.badge}</TableCell>
                  <TableCell>{badge.category}</TableCell>
                  <TableCell>{badge.challenge}</TableCell>
                  <TableCell>{badge.coinsEarned}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Challenz Dashboard</h1>
        <p className="text-gray-500">Monitor and manage challenges</p>
      </div>

      <div className="mb-6">
        <div className="border-b flex gap-4">
          {['Challenges', 'Profile Details', 'Badges', 'KPIs', 'User Engagement'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase())}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === tab.toLowerCase()
                  ? 'border-teal-700 text-teal-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'challenges' && <ChallengesView />}
      {activeTab === 'badges' && <BadgesView />}
    </div>
  );
}