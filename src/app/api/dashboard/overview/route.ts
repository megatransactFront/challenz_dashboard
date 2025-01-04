// app/api/overview/route.ts
import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
 process.env.NEXT_PUBLIC_SUPABASE_URL!,
 process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export const runtime = 'edge'
export const dynamic = 'force-dynamic'

type Stat = {
 value: number
 label: string
 formatted?: string
}

type Stats = {
 totalRegistrations: Stat
 newUsers: Stat
 activeUsers: Stat 
 totalRevenue: Stat
}

type UserData = {
 month: string
 totalUsers: number
 newUsers: number
}

type DashboardResponse = {
 stats: Stats
 userData: UserData[]
}

function formatValue(value: number, label: string): string {
 try {
   if (typeof value !== 'number') {
     throw new Error('Invalid value type')
   }
   if (label === 'USD') {
     return `$${value.toLocaleString(undefined, {
       minimumFractionDigits: 2,
       maximumFractionDigits: 2
     })}`
   }
   return `${value.toLocaleString()}${label ? ` ${label}` : ''}`
 } catch {
   return '0'
 }
}

async function getRawStats() {
 // Get all users with created_at
 const { data: users, error } = await supabase
   .from('users')
   .select('created_at')
   .order('created_at', { ascending: false })

 if (error) throw error

 const totalCount = users.length

 // Calculate new users (last 3 days)
 const now = new Date()
 const threeDaysAgo = new Date(now.getTime() - (3 * 24 * 60 * 60 * 1000))
 
 const newUsersCount = users.filter(user => {
   const createdAt = new Date(user.created_at)
   return createdAt >= threeDaysAgo
 }).length

 // Get active users (4+ hours daily)
 const oneDayAgo = new Date(now.getTime() - (24 * 60 * 60 * 1000))
 const { data: activeUsers, error: activeError } = await supabase
   .from('users')
   .select('created_at')
   .gte('created_at', oneDayAgo.toISOString())

 if (activeError) throw activeError

 const activeUsersCount = activeUsers?.length || 0

 return {
   totalRegistrations: {
     value: totalCount,
     label: "Users"
   },
   newUsers: {
     value: newUsersCount,
     label: "Users"
   },
   activeUsers: {
     value: activeUsersCount,
     label: "Active"
   },
   totalRevenue: {
     value: totalCount,
     label: "USD" 
   }
 }
}

async function getUserData(): Promise<UserData[]> {
 // Get users with created_at for monthly data
 const { data: users, error } = await supabase
   .from('users')
   .select('created_at')
   .order('created_at', { ascending: true })

 if (error) throw error

 // Group users by month
 const monthlyData = users.reduce((acc, user) => {
   const date = new Date(user.created_at)
   const monthKey = date.toLocaleString('default', { month: 'short' })
   
   if (!acc[monthKey]) {
     acc[monthKey] = {
       totalUsers: 0,
       newUsers: 0
     }
   }
   
   acc[monthKey].totalUsers++
   
   // Count as new user if within last 3 days
   const now = new Date()
   if (date >= new Date(now.getTime() - (3 * 24 * 60 * 60 * 1000))) {
     acc[monthKey].newUsers++
   }
   
   return acc
 }, {} as Record<string, { totalUsers: number; newUsers: number }>)

 return Object.entries(monthlyData).map(([month, data]) => ({
   month,
   totalUsers: data.totalUsers,
   newUsers: data.newUsers
 }))
}

export async function GET(): Promise<NextResponse<DashboardResponse>> {
 try {
   const rawStats = await getRawStats()
   const statsData = Object.entries(rawStats).reduce((acc, [key, stat]) => ({
     ...acc,
     [key]: {
       ...stat,
       formatted: formatValue(stat.value, stat.label)
     }
   }), {} as Stats)

   const userData = await getUserData()

   return NextResponse.json({
     stats: statsData,
     userData
   })
 } catch (error) {
   console.error('Error:', error)
   return NextResponse.json({
     stats: {
       totalRegistrations: { value: 0, label: "Users", formatted: "0 Users" },
       newUsers: { value: 0, label: "Users", formatted: "0 Users" },
       activeUsers: { value: 0, label: "Active", formatted: "0 Active" },
       totalRevenue: { value: 0, label: "USD", formatted: "$0.00" }
     },
     userData: []
   })
 }
}