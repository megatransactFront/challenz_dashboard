import React from 'react';
import { BellIcon, MonitorIcon, Search } from 'lucide-react';

const challengeData = [
  {
    title: "Dance Challenge",
    creator: "James Thor",
    datePosted: "26/11/24",
    views: 74,
    usersJoined: 74,
    likes: 560,
    comments: 40,
    sponsored: "Adidas"
  },
  {
    title: "ALS Ice Bucket Challenge",
    creator: "Joseph Lee",
    datePosted: "26/11/24",
    views: 74,
    usersJoined: 74,
    likes: 700,
    comments: 60,
    sponsored: "Noel Learning"
  },
  {
    title: "75 Hard Challenge",
    creator: "Marcus Ferrari",
    datePosted: "26/11/24",
    views: 74,
    usersJoined: 74,
    likes: 56,
    comments: 5,
    sponsored: ""
  },
  {
    title: "Singing Contest",
    creator: "Ivan Dimitri",
    datePosted: "26/11/24",
    views: 56,
    usersJoined: 56,
    likes: 56,
    comments: 57,
    sponsored: "Wellington College"
  },
  {
    title: "Marathon Challenge",
    creator: "Mick Schumacher",
    datePosted: "26/11/24",
    views: 456,
    usersJoined: 456,
    likes: 123,
    comments: 9,
    sponsored: "Nike"
  },
  {
    title: "Make Up Challenge",
    creator: "James Calvin",
    datePosted: "26/11/24",
    views: 6789,
    usersJoined: 6789,
    likes: 766,
    comments: 10,
    sponsored: "NBA"
  },
  {
    title: "Environment Challenge",
    creator: "Richard Cranium",
    datePosted: "26/11/24",
    views: 32,
    usersJoined: 32,
    likes: 1345,
    comments: 60,
    sponsored: ""
  },
  {
    title: "School Spirit Challenge",
    creator: "Pearl James",
    datePosted: "26/11/24",
    views: 2000,
    usersJoined: 2000,
    likes: 4500,
    comments: 50,
    sponsored: ""
  },
  {
    title: "House Challenge",
    creator: "Hugh Rox",
    datePosted: "26/11/24",
    views: 5000,
    usersJoined: 5000,
    likes: 12500,
    comments: 300,
    sponsored: "Apple"
  },
  {
    title: "Yoga Challenge",
    creator: "Benjamin Button",
    datePosted: "26/11/24",
    views: 20000,
    usersJoined: 20000,
    likes: 100000,
    comments: 234,
    sponsored: ""
  }
];

const ChallengeUploads = () => {
  return (
    <div className="p-8">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Master Dashboard</h1>
          <p className="text-gray-500">Administrator</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search Overview"
              className="w-64 pl-4 pr-10 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <BellIcon className="h-5 w-5" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <MonitorIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Challenges Button */}
      <div className="mb-8">
        <button className="px-4 py-2 border border-teal-700 text-teal-700 rounded-lg hover:bg-teal-50">
          Challenges
        </button>
      </div>

      {/* Challenge Uploads Section */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Challenge Uploads</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-4 px-4 font-semibold">CHALLENGE TITLE</th>
                  <th className="text-left py-4 px-4 font-semibold">CREATOR</th>
                  <th className="text-left py-4 px-4 font-semibold">DATE POSTED</th>
                  <th className="text-left py-4 px-4 font-semibold">VIEWS</th>
                  <th className="text-left py-4 px-4 font-semibold">USERS JOINED</th>
                  <th className="text-left py-4 px-4 font-semibold">LIKES</th>
                  <th className="text-left py-4 px-4 font-semibold">COMMENTS</th>
                  <th className="text-left py-4 px-4 font-semibold">SPONSORED</th>
                </tr>
              </thead>
              <tbody>
                {challengeData.map((challenge, index) => (
                  <tr key={index} className="border-b hover:bg-gray-50">
                    <td className="py-4 px-4 font-medium">{challenge.title}</td>
                    <td className="py-4 px-4">{challenge.creator}</td>
                    <td className="py-4 px-4">{challenge.datePosted}</td>
                    <td className="py-4 px-4">{challenge.views.toLocaleString()}</td>
                    <td className="py-4 px-4">{challenge.usersJoined.toLocaleString()}</td>
                    <td className="py-4 px-4">{challenge.likes.toLocaleString()}</td>
                    <td className="py-4 px-4">{challenge.comments}</td>
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

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
          Previous
        </button>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-teal-700 text-white rounded-lg hover:bg-teal-800">
            1
          </button>
        </div>
        <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
          Next
        </button>
      </div>

      {/* Learning Together Button */}
      <div className="flex justify-center mt-8">
        <button className="px-6 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600">
          LEARNING TOGETHER
        </button>
      </div>
    </div>
  );
};

export default ChallengeUploads;