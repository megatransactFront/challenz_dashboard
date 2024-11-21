// components/ui/navbar.tsx
"use client"

import React from 'react';
import { Search, Bell, Settings } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  breadcrumb?: {
    title: string;
    subtitle: string;
  };
}

export function Navbar({ 
  breadcrumb = { 
    title: "Master Dashboard", 
    subtitle: "Administrator" 
  } 
}: NavbarProps) {
  return (
    <nav className="flex items-center justify-between border-b border-gray-200 px-8 py-4 bg-white">
      {/* Left side - Breadcrumb */}
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold">{breadcrumb.title}</h1>
        <span className="text-gray-400">/</span>
        <span className="text-gray-500">{breadcrumb.subtitle}</span>
      </div>
      
      {/* Right side - Search & Icons */}
      <div className="flex items-center gap-6">
        {/* Search */}
        <div className="relative">
          <input 
            type="text" 
            placeholder="Search Overview" 
            className="rounded-lg border border-gray-200 py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search 
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" 
            size={18} 
          />
        </div>
        
        {/* Notifications */}
        <NotificationsDropdown />
        
        {/* Settings */}
        <SettingsDropdown />
      </div>
    </nav>
  );
}

// Separate components for dropdowns
function NotificationsDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="relative focus:outline-none">
        <Bell className="text-gray-600 hover:text-gray-800" size={20} />
        <div className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <DropdownMenuLabel>Notifications</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="max-h-[450px] overflow-y-auto">
          {[1, 2, 3].map((_, i) => (
            <DropdownMenuItem key={i} className="flex flex-col items-start gap-1 p-4">
              <div className="flex w-full items-center justify-between">
                <span className="font-medium">New Update Available</span>
                <span className="text-xs text-gray-400">2h ago</span>
              </div>
              <p className="text-sm text-gray-500">
                A new software update is available for download.
              </p>
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function SettingsDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none">
        <Settings className="text-gray-600 hover:text-gray-800" size={20} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Profile Settings</DropdownMenuItem>
        <DropdownMenuItem>Preferences</DropdownMenuItem>
        <DropdownMenuItem>Help & Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="text-red-500 hover:text-red-600">
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}