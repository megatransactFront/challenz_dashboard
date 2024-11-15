import React from 'react';
import { DollarSign, TrendingUp, CreditCard, ArrowUpRight } from 'lucide-react';
import { StatCard } from '../shared/StatCard';

export const RevenueStats: React.FC = () => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <StatCard 
      title="Total Revenue" 
      value="$321,231.89" 
      icon={DollarSign} 
    />
    <StatCard 
      title="Monthly Growth" 
      value="+12.5%" 
      icon={TrendingUp} 
    />
    <StatCard 
      title="Transactions" 
      value="1,205" 
      icon={CreditCard} 
    />
    <StatCard 
      title="Avg. Transaction" 
      value="$242.89" 
      icon={ArrowUpRight} 
    />
  </div>
);