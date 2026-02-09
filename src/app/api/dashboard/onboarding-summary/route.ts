import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import type { DailyAgg, LocationGroup, OnboardingSummaryData } from '@/app/types/onboarding-summary';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// Format 'YYYY-MM-DD' into for example: 'Apr 22, 2024'
function formatDateLabel(date: Date): string {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

// Format 'YYYY-MM-DD' into for example: 'Apr 22'
function formatChartLabel(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export async function GET(request: Request) {
  try {
    // Determine window size based on selected period
    const { searchParams } = new URL(request.url);
    const period = (searchParams.get('period') || 'weekly').toLowerCase();

    let windowDays = 7; // default weekly
    if (period === 'fortnightly') {
      windowDays = 14;
    } else if (period === 'monthly') {
      windowDays = 30;
    }

    const lookbackDays = windowDays * 2;
    const today = new Date();
    const start = new Date();
    start.setDate(today.getDate() - (lookbackDays - 1));
    const startIso = start.toISOString();

    // 1) Fetch raw data from Supabase

    const [
      { data: userRows, error: usersError },
      { data: merchantRows, error: merchantsError },
      { data: loopEvents, error: loopEventsError },
      { data: countryMappings, error: countryMappingError },
    ] = await Promise.all([
      // New users
      supabase
        .from('users')
        .select('created_at, country, location, role')
        .gte('created_at', startIso),

      // New merchants
      supabase
        .from('merchants')
        .select('created_at')
        .gte('created_at', startIso),

      // Stage 2 loops closed
      supabase
        .from('loop_stage_events')
        .select('created_at, stage, event_type')
        .eq('stage', 2)
        .eq('event_type', 'loop_completed')
        .gte('created_at', startIso),

      // Country code mapping
      supabase
        .from('country_continent_mapping')
        .select('country_name, country_code'),
    ]);

    if (usersError) throw usersError;
    if (merchantsError) throw merchantsError;
    if (loopEventsError) throw loopEventsError;
    if (countryMappingError) throw countryMappingError;

    // Build map of country_name -> country_code
    const countryCodeMap = new Map<string, string>();
    countryMappings?.forEach((row: any) => {
      if (row.country_name && row.country_code) {
        countryCodeMap.set(row.country_name.toLowerCase(), row.country_code);
      }
    });

    // 2) Aggregate counts per day (global, for cards)

    const dailyMap = new Map<string, DailyAgg>();

    const addDaily = (
      createdAt: string | null | undefined,
      field: keyof DailyAgg
    ) => {
      if (!createdAt) return;
      const d = new Date(createdAt);
      if (Number.isNaN(d.getTime())) return;

      const key = d.toISOString().slice(0, 10); // YYYY-MM-DD

      let row = dailyMap.get(key);
      if (!row) {
        row = {
          date: key,
          newUsers: 0,
          newMerchants: 0,
          stage2LoopsClosed: 0,
        };
        dailyMap.set(key, row);
      }

      // @ts-expect-error index by field
      row[field] = (row[field] || 0) + 1;
    };

    userRows?.forEach((u: any) => {
      if (u.role === 'business') {
        addDaily(u.created_at, 'newMerchants');
      } else {
        addDaily(u.created_at, 'newUsers');
      }
    });

    merchantRows?.forEach((m: any) => addDaily(m.created_at, 'newMerchants'));
    loopEvents?.forEach((e: any) => addDaily(e.created_at, 'stage2LoopsClosed'));

    const daily = Array.from(dailyMap.values()).sort((a, b) =>
      a.date.localeCompare(b.date)
    );

    // If no data at all, just return an empty structure
    if (daily.length === 0) {
      const empty: OnboardingSummaryData = {
        cards: {
          newUsers: {
            title: 'New Users',
            metric: { value: 0, change: 0, trend: 'up' },
            chartData: [],
          },
          newMerchants: {
            title: 'New Merchants',
            metric: { value: 0, change: 0, trend: 'up' },
            chartData: [],
          },
          stage2LoopsClosed: {
            title: 'Stage 2 Loops Closed',
            metric: { value: 0, change: 0, trend: 'up' },
            chartData: [],
          },
        },
        tableData: [],
      };
      return NextResponse.json(empty);
    }

    // 3) Build metrics: current window vs previous window

    const dates = daily.map((d) => d.date);
    const currentWindowDates = dates.slice(-windowDays);
    const previousWindowDates = dates.slice(-windowDays * 2, -windowDays);

    const sumFor = (days: string[], pick: (d: DailyAgg) => number) =>
      daily
        .filter((d) => days.includes(d.date))
        .reduce((sum, d) => sum + pick(d), 0);

    const buildMetric = (current: number, previous: number) => {
      if (previous <= 0) {
        return {
          value: current,
          change: current > 0 ? 100 : 0,
          trend: current > 0 ? ('up' as const) : ('down' as const),
        };
      }

      const pct = ((current - previous) / previous) * 100;

      return {
        value: current,
        change: Number(pct.toFixed(1)),
        trend: current >= previous ? ('up' as const) : ('down' as const),
      };
    };

    const newUsersCurr = sumFor(currentWindowDates, (d) => d.newUsers);
    const newUsersPrev = sumFor(previousWindowDates, (d) => d.newUsers);
    const newMerchCurr = sumFor(currentWindowDates, (d) => d.newMerchants);
    const newMerchPrev = sumFor(previousWindowDates, (d) => d.newMerchants);
    const loopsCurr = sumFor(currentWindowDates, (d) => d.stage2LoopsClosed);
    const loopsPrev = sumFor(previousWindowDates, (d) => d.stage2LoopsClosed);

    // 4) Build chart data: current window

    const chartDays = daily.slice(-windowDays);

    // Map for quick lookup of daily aggregates by date
    const dailyByDate = new Map<string, DailyAgg>(
      daily.map((d) => [d.date, d])
    );

    // 5) Build location-level table data from users (date + country + city)
    const locationMap = new Map<string, LocationGroup>();
    const merchantsByDate = new Map<string, number>();

    merchantRows?.forEach((m: any) => {
      if (!m.created_at) return;
      const d = new Date(m.created_at);
      if (Number.isNaN(d.getTime())) return;
      const dateKey = d.toISOString().slice(0, 10);
      merchantsByDate.set(dateKey, (merchantsByDate.get(dateKey) ?? 0) + 1);
    });

    userRows?.forEach((u: any) => {
      if (!u.created_at) return;
      const d = new Date(u.created_at);
      if (Number.isNaN(d.getTime())) return;
      const dateKey = d.toISOString().slice(0, 10);

      const rawCountry: string = u.country || 'Unknown';
      const city: string = u.location || '-';

      const code =
        countryCodeMap.get(rawCountry.toLowerCase()) ?? 'UN';

      const groupKey = `${dateKey}|${rawCountry}|${city}|${code}`;

      let group = locationMap.get(groupKey);
      if (!group) {
        group = {
          date: dateKey,
          country: rawCountry,
          countryCode: code,
          city,
          newUsers: 0,
          newMerchants: 0,
        };
        locationMap.set(groupKey, group);
      }

      if (u.role === 'business') {
        group.newMerchants += 1;
      } else {
        group.newUsers += 1;
      }
    });

    const locationGroups = Array.from(locationMap.values());

    // Build table rows from location groups (if any)
    const tableRows: {
      date: string;
      country: string;
      countryCode: string;
      city: string;
      newUsers: number;
      newMerchants: number;
      stage2LoopsClosed: number;
    }[] = [];

    if (locationGroups.length > 0) {
      // First, per-city/country rows where we have users and merchants
      locationGroups.forEach((g) => {
        const dayAgg = dailyByDate.get(g.date);
        const asDate = new Date(g.date);
        const merchantsFromTable = merchantsByDate.get(g.date) ?? 0;

        // case for merchants that are not associated with a location in merchant table
        const isUnknownGroup = g.country === 'Unknown' && g.city === '-';
        const newMerchants = g.newMerchants + (isUnknownGroup ? merchantsFromTable : 0);

        tableRows.push({
          date: formatDateLabel(asDate),
          country: g.country,
          countryCode: g.countryCode,
          city: g.city,
          newUsers: g.newUsers,
          newMerchants,
          stage2LoopsClosed: dayAgg?.stage2LoopsClosed ?? 0,
        });
      });

      // Then, add fallback "Unknown" rows:
      // - Dates with merchants/loops but no users (merchants table only)
      // - Dates with merchants table but no (Unknown, -) group (merchants have no location)
      const hasUnknownGroupForDate = new Set(
        locationGroups
          .filter((g) => g.country === 'Unknown' && g.city === '-')
          .map((g) => g.date)
      );
      const datesWithLocation = new Set(locationGroups.map((g) => g.date));

      daily.forEach((d) => {
        const merchantsFromTable = merchantsByDate.get(d.date) ?? 0;
        const needsUnknownRow =
          !datesWithLocation.has(d.date) || // no users at all
          (merchantsFromTable > 0 && !hasUnknownGroupForDate.has(d.date)); // merchants but no Unknown group

        if (needsUnknownRow) {
          const asDate = new Date(d.date);
          const dayAgg = dailyByDate.get(d.date);
          tableRows.push({
            date: formatDateLabel(asDate),
            country: 'Unknown',
            countryCode: 'UN',
            city: '-',
            newUsers: datesWithLocation.has(d.date) ? 0 : d.newUsers,
            newMerchants: merchantsFromTable,
            stage2LoopsClosed: dayAgg?.stage2LoopsClosed ?? 0,
          });
        }
      });

      // Sort: newest dates first, then country, then city
      tableRows.sort((a, b) => {
        const dateCmp = new Date(b.date).getTime() - new Date(a.date).getTime();
        if (dateCmp !== 0) return dateCmp;
        const countryCmp = a.country.localeCompare(b.country);
        if (countryCmp !== 0) return countryCmp;
        return a.city.localeCompare(b.city);
      });
    } else {
      // No location info at all, fall back to "Unknown" rows per day
      daily
        .slice()
        .reverse()
        .forEach((d) => {
          const asDate = new Date(d.date);
          tableRows.push({
            date: formatDateLabel(asDate),
            country: 'Unknown',
            countryCode: 'UN',
            city: '-',
            newUsers: d.newUsers,
            newMerchants: d.newMerchants,
            stage2LoopsClosed: d.stage2LoopsClosed,
          });
        });
    }

    const tableData = tableRows;

    const data: OnboardingSummaryData = {
      cards: {
        newUsers: {
          title: 'New Users',
          metric: buildMetric(newUsersCurr, newUsersPrev),
          chartData: chartDays.map((d) => ({
            date: formatChartLabel(d.date),
            value: d.newUsers,
          })),
        },
        newMerchants: {
          title: 'New Merchants',
          metric: buildMetric(newMerchCurr, newMerchPrev),
          chartData: chartDays.map((d) => ({
            date: formatChartLabel(d.date),
            value: d.newMerchants,
          })),
        },
        stage2LoopsClosed: {
          title: 'Stage 2 Loops Closed',
          metric: buildMetric(loopsCurr, loopsPrev),
          chartData: chartDays.map((d) => ({
            date: formatChartLabel(d.date),
            value: d.stage2LoopsClosed,
          })),
        },
      },
      tableData,
    };

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in onboarding-summary API:', error);
    return NextResponse.json(
      { error: 'Failed to load onboarding summary' },
      { status: 500 }
    );
  }
}