import { NextResponse } from 'next/server';

export async function GET() {
  const userData = [
    { month: 'Jan', totalUsers: 8000, newUsers: 2000 },
    { month: 'Feb', totalUsers: 7000, newUsers: 1500 },
    { month: 'Mar', totalUsers: 6000, newUsers: 1200 },
    { month: 'Apr', totalUsers: 9000, newUsers: 2500 },
    { month: 'May', totalUsers: 7500, newUsers: 1800 },
    { month: 'Jun', totalUsers: 8500, newUsers: 2000 },
    { month: 'Jul', totalUsers: 7800, newUsers: 1600 },
    { month: 'Aug', totalUsers: 8200, newUsers: 1900 },
    { month: 'Sep', totalUsers: 9500, newUsers: 2800 },
    { month: 'Oct', totalUsers: 8800, newUsers: 2200 },
    { month: 'Nov', totalUsers: 9200, newUsers: 2400 },
    { month: 'Dec', totalUsers: 9800, newUsers: 2600 }
  ];

  return NextResponse.json(userData);
}