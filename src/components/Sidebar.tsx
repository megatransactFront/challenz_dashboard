"use client";

import React from "react";

import { BarChart3, Layout, Users, Settings, ChevronRight, Building2, ShoppingCart, BadgeDollarSign, Box, ClipboardList } from "lucide-react";

import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { MenuItem as MenuItemType } from "./types";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/contexts/AppContext";

interface MenuItemProps {
  item: MenuItemType;
  pathname: string;
  onNavigate: (path: string) => void;
}

const MenuItem: React.FC<MenuItemProps> = ({ item, pathname, onNavigate }) => {
  const isActive = pathname === item.path || pathname.startsWith(`${item.path}/`);
  const Icon = item.icon;
  let PrevIcon;
  if (item?.prevIcon) {
    PrevIcon = item.prevIcon
  }
  return (
    <div className="space-y-2 px-6">
      <div
        onClick={() => onNavigate(item.path)}
        className={cn(
          "flex items-center py-3 px-6 rounded-lg cursor-pointer transition-all duration-200",
          isActive
            ? "bg-secondary text-white"
            : "hover:bg-[#1a4d5f] text-white/90"
        )}
      >
        <div className="flex items-center gap-4">
          {PrevIcon && <PrevIcon size={22} className={cn("text-white w-6 h-6 bold mr-2", isActive ? "opacity-100" : "opacity-75")} />}
          <Icon size={22} className={cn("text-white", isActive ? "opacity-100" : "opacity-75")} />
          <span className="text-[15px] font-medium tracking-wide">{item.title}</span>
        </div>
      </div>

      {item.subItems && isActive && (
        <div className="ml-10 space-y-1">
          {item.subItems.map((subItem) => {
            const subItemActive = pathname === subItem.path;
            return (
              <div
                key={subItem.path}
                onClick={() => onNavigate(subItem.path)}
                className={cn(
                  "flex items-center py-2 px-4 rounded-lg cursor-pointer transition-all duration-200",
                  "text-[15px] tracking-wide",
                  subItemActive ? "bg-secondary text-white" : "text-white/80 hover:bg-[#1a4d5f]"
                )}
              >
                {subItem.title}
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
    title: "Summary",
    icon: BarChart3,
    path: "/dashboard",
    subItems: [
      {
        title: "Dashboard",
        path: "/dashboard",
      },
      {
        title: "Coins",
        path: "/dashboard/coins",
      },
      {
        title: "Loop Health",
        path: "/dashboard/loop-health",
      },
    ],
  },
];
const mainMenuItems: MenuItemType[] = [
  {
    title: "Challenz",
    prevIcon: ChevronRight,
    icon: Layout,
    path: "/challenz",
  },
  {
    title: "Users",
    prevIcon: ChevronRight,
    icon: Users,
    path: "/users",
  },
  {
    title: "Report",
    prevIcon: ChevronRight,
    icon: BarChart3,
    path: "/report",
  },
  {
    title: "Business",
    prevIcon: ChevronRight,
    icon: Building2,
    path: "/business-users",
  },
  {
    title: "PC",
    prevIcon: ChevronRight,
    icon: Building2,
    path: "/Parental-Control",
  },
  {
    title: "Partner Sales",
    prevIcon: ChevronRight,
    icon: Building2,
    path: "/Partner_sales",
  },
  {
    title: "Orders",
    prevIcon: ChevronRight,
    icon: ShoppingCart,
    path: "/orders",
  },
  {
    title: "Subscriptions",
    prevIcon: ChevronRight,
    icon: BadgeDollarSign,
    path: "/subscriptions",
  },
  {
    title: "Products",
    prevIcon: ChevronRight,
    icon: Box,
    path: "/products",
  },
  {
    title: "Flash Sales",
    prevIcon: ChevronRight,
    icon: Box,
    path: "/sales",

  },
  {
    title: "Services",
    prevIcon: ChevronRight,
    icon: ClipboardList,
    path: "/services_ID",
  },
];

const otherMenuItems: MenuItemType[] = [
  {
    title: "Settings",
    icon: Settings,
    path: "/other/settings",
  },
];

const Sidebar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { isSidebarOpen, closeSidebar } = useAppContext()
  const handleNavigation = (path: string): void => {
    router.push(path);
    closeSidebar();
  };
  return (
    <>
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-40 w-72 bg-primary shadow-xl  sm:overflow-auto",
        "transform transition-transform duration-300 ease-in-out lg:translate-x-0",
        "lg:relative lg:shadow-none",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col py-6">
          {/* Profile Section */}
          <div className="flex items-center gap-4 px-6 mb-8">
            <div className="w-10 h-10 rounded-full bg-white/10 overflow-hidden">
              <Image
                src="https://xsgames.co/randomusers/avatar.php?g=male"
                alt="Profile"
                width={40}
                height={40}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-white text-lg font-medium">Simon Powel</span>
          </div>

          {/* Menu Sections */}
          <div className="flex-1 space-y-10">
            {/* Summary Section */}
            <div>
              {menuItems.map((item) => (
                <MenuItem
                  key={item.path}
                  item={item}
                  pathname={pathname}
                  onNavigate={handleNavigation}
                />
              ))}
            </div>

            {/* Menu Section */}
            <div>
              <div className="px-6 mb-3 text-[15px] font-medium text-white/50 uppercase tracking-wider">
                Menu
              </div>
              {mainMenuItems.map((item) => (
                <MenuItem
                  key={item.path}
                  item={item}
                  pathname={pathname}
                  onNavigate={handleNavigation}
                />
              ))}
            </div>

            {/* Other Section */}
            <div>
              <div className="px-6 mb-3 text-[15px] font-medium text-white/50 uppercase tracking-wider">
                Other
              </div>
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
      </aside>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
          onClick={closeSidebar}
        />
      )}
    </>
  );
};

export default Sidebar;
