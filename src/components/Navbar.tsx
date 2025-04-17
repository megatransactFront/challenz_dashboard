"use client";

import React from "react";
import { Search, Bell, Settings, Menu } from "lucide-react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useMobile from "@/hooks/useMobile";
import { Button } from "./ui/button";
import { useAppContext } from "@/contexts/AppContext";

interface Breadcrumb {
  title: string;
  subtitle: string;
}

interface NavbarProps {
  breadcrumb?: Breadcrumb;
  notifications?: NotificationItem[];
}

interface NotificationItem {
  id: number;
  message: string;
  time: string;
  description?: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  breadcrumb = { title: "Master Dashboard", subtitle: "Administrator" },
  notifications = [],
}) => {
  const isMobile = useMobile()
  const { openSidebar } = useAppContext()
  return (
    <nav className="border-b border-gray-200 px-8 py-4 bg-white">
      <div className="flex items-center justify-between">
        {/* Breadcrumb Section */}
        <BreadcrumbSection breadcrumb={breadcrumb} />
        {isMobile && (
          <div className="lg:hidden">
            <Button
              className="p-2 rounded-lg bg-primary hover:bg-primary transition-colors"
              onClick={openSidebar}
            >
              <Menu className="h-6 w-6 text-white" />
            </Button>
          </div>
        )}
        {/* Actions Section */}
        <div className="flex w-full justify-end items-center gap-6">

          <div className="flex gap-4">
            {isMobile ? <Search size={20} /> : <SearchInput />}
            <NotificationsDropdown notifications={notifications} />
            <SettingsDropdown />
          </div>
        </div>
      </div>

    </nav>
  );
};

const BreadcrumbSection: React.FC<{ breadcrumb: Breadcrumb }> = ({ breadcrumb }) => {
  const isMobile = useMobile()
  if (!isMobile) return (
    (
      <div className="flex w-full items-center gap-2">
        <h1 className="text-xl font-semibold">{breadcrumb.title}</h1>
        <span className="font-semibold mx-1">/</span>
        <span className="text-secondary font-medium text-xl">{breadcrumb.subtitle}</span>
      </div>
    )
  )
  return null;
};

const SearchInput: React.FC = () => (
  <div className="relative">
    <input
      type="text"
      placeholder="Search Overview"
      className="rounded-lg border border-gray-200 py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-secondary"
    />
    <Search
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
      size={18}
    />
  </div>
);

const NotificationsDropdown: React.FC<{ notifications: NotificationItem[] }> = ({
  notifications,
}) => (
  <DropdownMenu>
    <DropdownMenuTrigger className="relative focus:outline-none">
      <Bell className="text-gray-600 hover:text-gray-800" size={20} />
      {notifications.length > 0 && (
        <div className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-red-500" />
      )}
    </DropdownMenuTrigger>
    <DropdownMenuContent className="w-80" align="end">
      <DropdownMenuLabel>Notifications</DropdownMenuLabel>
      <DropdownMenuSeparator />
      <div className="max-h-[450px] overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map((notification) => (
            <DropdownMenuItem
              key={notification.id}
              className="flex flex-col items-start gap-1 p-4"
            >
              <div className="flex w-full items-center justify-between">
                <span className="font-medium">{notification.message}</span>
                <span className="text-xs text-gray-400">{notification.time}</span>
              </div>
              {notification.description && (
                <p className="text-sm text-gray-500">{notification.description}</p>
              )}
            </DropdownMenuItem>
          ))
        ) : (
          <p className="p-4 text-sm text-gray-500">No new notifications</p>
        )}
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
);

const SettingsDropdown: React.FC = () => {
  const router = useRouter();

  const handleSignOut = () => {
    // Remove the admin authentication cookie
    Cookies.remove('isAdmin');
    // Redirect to login page
    router.push('/login');
  };

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
        <DropdownMenuItem
          className="text-red-500 hover:text-red-600"
          onClick={handleSignOut}
        >
          Sign Out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};