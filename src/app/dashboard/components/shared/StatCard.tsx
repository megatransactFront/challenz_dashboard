// components/shared/StatCard.tsx
import { LucideIcon } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string;
  icon: LucideIcon;
  change: string;
  trend: 'up' | 'down' | 'neutral';
}

export function StatCard(props: StatCardProps) {
  const { title, value, icon: Icon, change, trend } = props;  // Destructure in the function body
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <Icon className="h-4 w-4 text-teal-600" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-sm ${
          trend === 'up' ? 'text-green-600' : 
          trend === 'down' ? 'text-red-600' : 
          'text-gray-600'
        }`}>
          {change}
        </p>
      </CardContent>
    </Card>
  );
}