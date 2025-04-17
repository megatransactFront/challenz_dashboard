// types.ts
import { LucideIcon } from 'lucide-react';

export interface SubItem {
  title: string;
  path: string;
}

export interface MenuItem {
  title: string;
  prevIcon?: LucideIcon,
  icon: LucideIcon;
  path: string;
  subItems?: SubItem[];
}

export interface MenuItemProps {
  item: MenuItem;
  pathname: string;
  onNavigate: (path: string) => void;
}