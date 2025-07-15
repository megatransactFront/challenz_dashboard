'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { BarChart3, CheckCircle2, XCircle, AlarmClock } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export const SubscriptionSummaryCards = () => {
  const [summary, setSummary] = useState<{
    total: number;
    active: number;
    cancelled: number;
    past_due: number;
  }>({
    total: 0,
    active: 0,
    cancelled: 0,
    past_due: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      const { data: allSubs, error } = await supabase
        .from('subscriptions')
        .select('*');

      if (error) {
        console.error('Failed to fetch subscriptions', error);
        setLoading(false);
        return;
      }

      setSummary({
        total: allSubs.length,
        active: allSubs.filter((s) => s.status === 'ACTIVE').length,
        cancelled: allSubs.filter((s) => s.status === 'CANCELED').length,
        past_due: allSubs.filter((s) => s.status === 'PAST_DUE').length,
      });

      setLoading(false);
    };

    fetchSummary();
  }, []);

  const stats = [
    {
      label: 'Total Subscriptions',
      value: summary.total,
      icon: BarChart3,
      color: 'text-purple-600',
    },
    {
      label: 'Active Subscriptions',
      value: summary.active,
      icon: CheckCircle2,
      color: 'text-green-600',
    },
    {
      label: 'Past Due Subscriptions',
      value: summary.past_due,
      icon: AlarmClock,
      color: 'text-yellow-600',
    },
    {
      label: 'Cancelled Subscriptions',
      value: summary.cancelled,
      icon: XCircle,
      color: 'text-red-600',
    },
  ];

  return (
    <div className="w-full px-8 py-10">
      <div className="max-w-[95%] mx-auto bg-[#f8fafc] p-8 rounded-xl border border-gray-300 shadow">
        <div className="flex justify-center mb-8">
          <span className="bg-white text-black px-6 py-2 rounded-full text-xl font-semibold border border-gray-400 shadow">
            Subscription Summary
          </span>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 text-lg">Loading...</div>
        ) : (
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
        )}
      </div>
    </div>
  );
};
