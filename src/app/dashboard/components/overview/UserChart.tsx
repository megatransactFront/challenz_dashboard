import React from 'react';
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

// Define the interface for the data structure
interface ChartData {
  month: string;
  totalUsers: number;
  newUsers: number;
}

// Define the props interface for the component
interface UserChartProps {
  data: ChartData[];
}

export const UserChart: React.FC<UserChartProps> = ({ data }) => (
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart data={data}>
      <defs>
        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#1f4d5b" stopOpacity={0.8}/>
          <stop offset="95%" stopColor="#1f4d5b" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Area 
        type="monotone" 
        dataKey="totalUsers" 
        stroke="#1f4d5b" 
        fillOpacity={1} 
        fill="url(#colorUv)" 
      />
      <Area 
        type="monotone" 
        dataKey="newUsers" 
        stroke="#ff4d4f" 
        fill="#ff4d4f" 
        fillOpacity={0.3} 
      />
    </AreaChart>
  </ResponsiveContainer>
);