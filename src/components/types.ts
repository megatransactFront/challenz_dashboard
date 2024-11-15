// types.ts
import { LucideIcon } from 'lucide-react';

// Define the structure for sub-items in the menu
export interface SubItem {
  title: string;
  path: string;
}

// Define the structure for menu items
export interface MenuItem {
  title: string;
  icon: LucideIcon;
  path: string;
  subItems?: SubItem[];
}

// Props for the MenuItem component
export interface MenuItemProps {
  item: MenuItem;
  pathname: string;
  onNavigate: (path: string) => void;
  isExpanded: boolean;
  onToggleExpand: (title: string) => void;
}



// Types for the expanded items state
export type ExpandedItems = Set<string>;

// Menu configuration types
export interface MenuConfig {
  menuItems: MenuItem[];
  otherMenuItems: MenuItem[];
}