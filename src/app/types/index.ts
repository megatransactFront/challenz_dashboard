// // app/types/index.ts
export * from './dashboard';
export * from './revenues';
export * from './engagement';

// types/index.ts
import { LucideIcon } from "lucide-react";

export interface SubMenuItem {
  title: string;
  path: string;
}

export interface MenuItem {
  title: string;
  icon: LucideIcon;
  path: string;
  subItems?: SubMenuItem[];
}

export interface MenuItemProps {
  item: MenuItem;
  pathname: string;
  onNavigate: (path: string) => void;
}