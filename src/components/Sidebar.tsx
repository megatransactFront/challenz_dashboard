"use client";

import React from "react";
import { Settings, Users, BarChart3, Layout } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { MenuItem as MenuItemType, MenuItemProps } from "./types";

const MenuItem: React.FC<MenuItemProps> = ({ item, pathname, onNavigate }) => {
  const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
  const Icon = item.icon;

  return (
    <div className="space-y-1">
      <div
        onClick={() => onNavigate(item.path)}
        className={`flex items-center py-2 px-2 rounded cursor-pointer transition-colors duration-200 ${
          isActive ? "text-white bg-white/10" : "text-white/80 hover:bg-[#E45664]"
        }`}
      >
        <div className="flex items-center gap-2">
          <Icon size={20} />
          <span>{item.title}</span>
        </div>
      </div>

      {item.subItems && (
        <div className="ml-6 space-y-1">
          {item.subItems.map((subItem) => {
            const subItemActive = pathname === subItem.path;
            return (
              <div
                key={subItem.path}
                onClick={() => onNavigate(subItem.path)}
                className={`flex items-center py-1 px-2 rounded cursor-pointer transition-colors duration-200 ${
                  subItemActive ? "text-white bg-white/10" : "text-white/70 hover:bg-[#E45664]"
                }`}
              >
                <span className="text-sm">{subItem.title}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const menuItems: MenuItemType[] = [
  {
    title: "Overview",
    icon: BarChart3,
    path: "/dashboard",
    subItems: [
      { title: "Revenues", path: "/dashboard/revenues" },
      { title: "Engagement", path: "/dashboard/engagements" },
      { title: "Content Performance", path: "/dashboard/reports" },
    ],
  },
  {
    title: "Challenz",
    icon: Layout,
    path: "/challenz",
    subItems: [
      { title: "Active", path: "/challenz/active" },
      { title: "Completed", path: "/challenz/completed" },
      { title: "Statistics", path: "/challenz/statistics" },
    ],
  },
  {
    title: "Users",
    icon: Users,
    path: "/users",
    subItems: [
      { title: "All Users", path: "/users" },
      { title: "New Users", path: "/users/new" },
      { title: "User Groups", path: "/users/groups" },
    ],
  },
];

const otherMenuItems: MenuItemType[] = [
  {
    title: "Settings",
    icon: Settings,
    path: "/settings",
    subItems: [
      { title: "Profile", path: "/settings/profile" },
      { title: "Notifications", path: "/settings/notifications" },
      { title: "Security", path: "/settings/security" },
    ],
  },
];

const Sidebar: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (path: string): void => {
    router.push(path);
  };

  return (
    <div className="h-screen w-64 p-4 flex flex-col overflow-y-auto" style={{ backgroundColor: "#1F5C71" }}>
      {/* Profile Section */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden">
          <img
            src="https://xsgames.co/randomusers/avatar.php?g=male"
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
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
