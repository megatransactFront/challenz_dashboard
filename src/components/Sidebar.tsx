"use client"

import React from 'react';
import { Settings, Users, BarChart3 } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const getItemClasses = (path: string) => {
    const baseClasses = "flex items-center gap-2 py-2 px-2 rounded cursor-pointer";
    if (pathname === path) {
      return `${baseClasses} text-white bg-white/10`;
    }
    return `${baseClasses} text-white/80 hover:bg-teal-600`;
  };

  return (
    <div className="h-screen w-64 bg-teal-700 p-4 flex flex-col">
      {/* Profile Section */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
          <img
            src="/api/placeholder/40/40"
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-white font-medium">Simon Powel</span>
      </div>

      {/* Summary Section */}
      <div className="mb-8">
  <div 
    onClick={() => handleNavigation('/dashboard')}
    className="flex items-center gap-2 text-white py-2 px-2 bg-white/10 rounded cursor-pointer"
  >
    <BarChart3 size={20} />
    <span>Summary</span>
  </div>
</div>


      {/* Menu Section */}
      <div className="mb-8">
        <div className="text-white/70 mb-4 text-sm">Menu</div>
        <div className="space-y-2">
          <div 
            onClick={() => handleNavigation('/challenz')}
            className={getItemClasses('/challenz')}
          >
            <BarChart3 size={20} />
            <span>Challenz</span>
          </div>
          <div 
            onClick={() => handleNavigation('/users')}
            className={getItemClasses('@/users')}
          >
            <Users size={20} />
            <span>Users</span>
          </div>
        </div>
      </div>

      {/* Other Section */}
      <div className="mt-auto">
        <div className="text-white/70 mb-4 text-sm">Other</div>
        <div 
          onClick={() => handleNavigation('/settings')}
          className={getItemClasses('/settings')}
        >
          <Settings size={20} />
          <span>Settings</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;