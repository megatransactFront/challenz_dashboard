'use client';
import { Card } from '@/components/ui/card';
import { BarChart3, Clock3, CheckCircle2, XCircle } from 'lucide-react';

const stats = [
  {
    label: 'Total Orders',
    value: '9999',
    color: 'text-purple-600',
    icon: BarChart3,
  },
  {
    label: 'Completed Orders',
    value: '+7999',
    color: 'text-green-600',
    icon: CheckCircle2,
  },
  {
    label: 'Pending Orders',
    value: '2999',
    color: 'text-yellow-600',
    icon: Clock3,
  },
  {
    label: 'Cancelled Orders',
    value: '-5999',
    color: 'text-red-600',
    icon: XCircle,
  },
];

export function OrderSummaryCards() {
  return (
    <div className="w-full px-8 py-10">
      <div className="max-w-[95%] mx-auto bg-[#f8fafc] p-8 rounded-xl border border-gray-300 shadow">
        <div className="flex justify-center mb-8">
          <span className="bg-white text-black px-6 py-2 rounded-full text-xl font-semibold border border-gray-400 shadow">
            Total Order Summary
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="p-8 flex flex-col items-center justify-center space-y-6 rounded-xl bg-white shadow-md 
                         hover:shadow-2xl hover:-translate-y-1 hover:bg-gray-50 transform transition-all duration-300 cursor-pointer"
            >
              <div className="text-center text-base font-medium text-gray-700 border border-gray-500 px-4 py-1 rounded-full">
                {stat.label}
              </div>
              <stat.icon className="w-10 h-10 text-black" />
              <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

