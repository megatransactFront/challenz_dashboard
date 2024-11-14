"use client"

import React from 'react';
import { Settings, Users, BarChart3, Award, Activity } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";

const menuItems = [
  {
    title: 'Summary',
    icon: BarChart3,
    path: '/dashboard',
    section: 'main'
  },
  {
    title: 'Challenz',
    icon: Award,
    path: '/challenz',
    section: 'menu',
    subItems: [
      { title: 'Overview', path: '/challenz' },
      { title: 'Challenges', path: '/challenz/challenges' },
      { title: 'Profile Details', path: '/challenz/profile' },
      { title: 'Badges', path: '/challenz/badges' },
      { title: 'KPIs', path: '/challenz/kpis' },
      { title: 'User Engagement', path: '/challenz/engagement' },
    ]
  },
  {
    title: 'Users',
    icon: Users,
    path: '/users',
    section: 'menu'
  },
  {
    title: 'Settings',
    icon: Settings,
    path: '/settings',
    section: 'other'
  }
];

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [expandedItem, setExpandedItem] = React.useState<string | null>(null);

  // Check if current path is part of a menu item's subItems
  const isActive = (path: string) => {
    if (pathname === path) return true;
    const menuItem = menuItems.find(item => item.subItems?.some(sub => sub.path === pathname));
    return menuItem?.path === path;
  };

  const isSubItemActive = (path: string) => pathname === path;

  const MenuItem = ({ item }) => {
    const Icon = item.icon;
    const isItemActive = isActive(item.path);
    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedItem === item.path;

    return (
      <div>
        <div 
          onClick={() => {
            if (hasSubItems) {
              setExpandedItem(isExpanded ? null : item.path);
            } else {
              router.push(item.path);
            }
          }}
          className={cn(
            "flex items-center gap-2 py-2 px-2 rounded cursor-pointer transition-colors",
            isItemActive ? "text-white bg-white/10" : "text-white/80 hover:bg-teal-600",
            hasSubItems && "justify-between"
          )}
        >
          <div className="flex items-center gap-2">
            <Icon size={20} />
            <span>{item.title}</span>
          </div>
          {hasSubItems && (
            <Activity 
              size={16} 
              className={cn(
                "transition-transform",
                isExpanded ? "rotate-180" : ""
              )} 
            />
          )}
        </div>

        {/* SubItems */}
        {hasSubItems && isExpanded && (
          <div className="ml-6 mt-1 space-y-1">
            {item.subItems.map((subItem) => (
              <div
                key={subItem.path}
                onClick={() => router.push(subItem.path)}
                className={cn(
                  "py-1 px-2 rounded cursor-pointer text-sm transition-colors",
                  isSubItemActive(subItem.path) 
                    ? "text-white bg-white/10" 
                    : "text-white/70 hover:text-white hover:bg-teal-600"
                )}
              >
                {subItem.title}
              </div>
            ))}
          </div>
        )}
      </div>
    );
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

      {/* Main Section */}
      <div className="mb-8">
        {menuItems
          .filter(item => item.section === 'main')
          .map(item => (
            <MenuItem key={item.path} item={item} />
          ))}
      </div>

      {/* Menu Section */}
      <div className="mb-8">
        <div className="text-white/70 mb-4 text-sm">Menu</div>
        <div className="space-y-2">
          {menuItems
            .filter(item => item.section === 'menu')
            .map(item => (
              <MenuItem key={item.path} item={item} />
            ))}
        </div>
      </div>

      {/* Other Section */}
      <div className="mt-auto">
        <div className="text-white/70 mb-4 text-sm">Other</div>
        {menuItems
          .filter(item => item.section === 'other')
          .map(item => (
            <MenuItem key={item.path} item={item} />
          ))}
      </div>
    </div>
  );
};

export default Sidebar;