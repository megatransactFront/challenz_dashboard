// Sidebar.tsx
"use client"

import React, { useState } from 'react';
import { Settings, BarChart3, } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { MenuItem as MenuItemType, MenuItemProps, ExpandedItems } from './types';

const MenuItem: React.FC<MenuItemProps> = ({ item, pathname, onNavigate, isExpanded, onToggleExpand }) => {
  const isActive = pathname.startsWith(item.path);
  const Icon = item.icon;

};

const menuItems: MenuItemType[] = [
  {
    title: 'Summary',
    icon: BarChart3,
    path: '/dashboard',
    subItems: [
      { title: 'Overview', path: '/dashboard' },
      { title: 'Revenues', path: '/dashboard/revenues' },
      { title: 'Engagement', path: '/dashboard/engagements' },
      { title: 'Content Performance', path: '/dashboard/reports' },
    ]
  },
  // ... rest of the menuItems
];

const otherMenuItems: MenuItemType[] = [
  {
    title: 'Settings',
    icon: Settings,
    path: '/settings',
    subItems: [
      { title: 'Profile', path: '/settings/profile' },
      { title: 'Notifications', path: '/settings/notifications' },
      { title: 'Security', path: '/settings/security' },
    ]
  }
];

const Sidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<ExpandedItems>(new Set());

  const handleNavigation = (path: string): void => {
    router.push(path);
  };

  const toggleExpand = (itemTitle: string): void => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemTitle)) {
        newSet.delete(itemTitle);
      } else {
        newSet.add(itemTitle);
      }
      return newSet;
    });
  };

  return (
    <div className="h-screen w-64 bg-teal-700 p-4 flex flex-col overflow-y-auto">
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

      {/* Menu Sections */}
      <div className="space-y-8 flex-1">
        <div className="space-y-2">
          {menuItems.map((item) => (
            <MenuItem
              key={item.path}
              item={item}
              pathname={pathname}
              onNavigate={handleNavigation}
              isExpanded={expandedItems.has(item.title)}
              onToggleExpand={toggleExpand}
            />
          ))}
        </div>

        {/* Other Section */}
        <div className="mt-auto">
          <div className="text-white/70 mb-4 text-sm">Other</div>
          {otherMenuItems.map((item) => (
            <MenuItem
              key={item.path}
              item={item}
              pathname={pathname}
              onNavigate={handleNavigation}
              isExpanded={expandedItems.has(item.title)}
              onToggleExpand={toggleExpand}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;