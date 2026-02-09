// src/app/dashboard/onboarding-summary/page.tsx
"use client";

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Loader2, TrendingUp, TrendingDown, ChevronDown } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { OnboardingSummaryData } from '@/app/types/onboarding-summary';
import { AreaChart, Area, ResponsiveContainer, Tooltip } from 'recharts';

export default function OnboardingSummaryPage() {
  const [data, setData] = useState<OnboardingSummaryData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter states
  const [selectedCountry, setSelectedCountry] = useState('All Countries');
  const [selectedCity, setSelectedCity] = useState('All Cities');
  const [selectedPeriod, setSelectedPeriod] = useState('Weekly');
  const [selectedDateRange, setSelectedDateRange] = useState('');

  // Dropdown states
  const [openCountryDropdown, setOpenCountryDropdown] = useState(false);
  const [openCityDropdown, setOpenCityDropdown] = useState(false);
  const [openDateRangeDropdown, setOpenDateRangeDropdown] = useState(false);

  // Refs for click outside detection
  const countryDropdownRef = useRef<HTMLDivElement>(null);
  const cityDropdownRef = useRef<HTMLDivElement>(null);
  const dateRangeDropdownRef = useRef<HTMLDivElement>(null);

  // Extract unique countries and cities from data
  const [countries, setCountries] = useState<string[]>(['All Countries']);
  const [cities, setCities] = useState<string[]>(['All Cities']);

  // Fetch data when page loads or period changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const periodParam =
          selectedPeriod === 'Weekly'
            ? 'weekly'
            : selectedPeriod === 'Fortnightly'
              ? 'fortnightly'
              : 'monthly';

        const response = await fetch(`/api/dashboard/onboarding-summary?period=${periodParam}`);

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const jsonData = await response.json();
        setData(jsonData);

        // Extract unique countries and cities
        const uniqueCountries = ['All Countries', ...Array.from(new Set(jsonData.tableData.map((row: any) => row.country))) as string[]];
        const uniqueCities = ['All Cities', ...Array.from(new Set(jsonData.tableData.map((row: any) => row.city).filter((city: string) => city !== '-'))) as string[]];

        setCountries(uniqueCountries);
        setCities(uniqueCities);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [selectedPeriod]);

  // Generate date ranges dynamically based on data and selected period
  const dateRanges = useMemo(() => {
    if (!data) return [];

    // Get all dates from data and sort them (newest first)
    const allDates = data.tableData
      .map(row => new Date(row.date))
      .sort((a, b) => b.getTime() - a.getTime());

    if (allDates.length === 0) return [];

    const ranges: string[] = [];
    const mostRecentDate = allDates[0];
    const oldestDate = allDates[allDates.length - 1];

    let currentEndDate = new Date(mostRecentDate);

    // Determine days per period
    const daysPerPeriod = selectedPeriod === 'Weekly' ? 7 : selectedPeriod === 'Fortnightly' ? 14 : 30;

    // Generate ranges going backwards from most recent date
    while (currentEndDate >= oldestDate) {
      const startDate = new Date(currentEndDate);
      startDate.setDate(startDate.getDate() - (daysPerPeriod - 1));

      // Format dates
      const formatDate = (date: Date) => {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
      };

      const rangeStr = `${formatDate(startDate)} - ${formatDate(currentEndDate)}`;
      ranges.push(rangeStr);

      // Move to next period
      currentEndDate = new Date(startDate);
      currentEndDate.setDate(currentEndDate.getDate() - 1);
    }

    return ranges;
  }, [data, selectedPeriod]);

  // Set initial date range when data loads or period changes
  useEffect(() => {
    if (dateRanges.length > 0) {
      setSelectedDateRange(dateRanges[0]);
    }
  }, [dateRanges]);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target as Node)) {
        setOpenCountryDropdown(false);
      }
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
        setOpenCityDropdown(false);
      }
      if (dateRangeDropdownRef.current && !dateRangeDropdownRef.current.contains(event.target as Node)) {
        setOpenDateRangeDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Parse date range and filter table data
  const parseDate = (dateStr: string) => {
    return new Date(dateStr);
  };

  const filteredTableData = data?.tableData.filter(row => {
    // Country and city filters
    const countryMatch = selectedCountry === 'All Countries' || row.country === selectedCountry;
    const cityMatch = selectedCity === 'All Cities' || row.city === selectedCity;

    // Date range filter
    if (!selectedDateRange) return countryMatch && cityMatch;

    const [startDateStr, endDateStr] = selectedDateRange.split(' - ');
    const startDate = parseDate(startDateStr);
    const endDate = parseDate(endDateStr);
    const rowDate = parseDate(row.date);

    const dateMatch = rowDate >= startDate && rowDate <= endDate;

    return countryMatch && cityMatch && dateMatch;
  }) || [];

  // Compute summary cards aligned with selected period and date range
  const computedCards = useMemo(() => {
    if (!data || !selectedDateRange) return data?.cards;

    const [startDateStr, endDateStr] = selectedDateRange.split(' - ');
    const startDate = parseDate(startDateStr);
    const endDate = parseDate(endDateStr);

    // Determine window size from selected period
    const daysPerPeriod =
      selectedPeriod === 'Weekly'
        ? 7
        : selectedPeriod === 'Fortnightly'
          ? 14
          : 30;

    const prevEnd = new Date(startDate);
    prevEnd.setDate(prevEnd.getDate() - 1);
    const prevStart = new Date(prevEnd);
    prevStart.setDate(prevStart.getDate() - (daysPerPeriod - 1));

    const baseRows = data.tableData.filter(row => {
      const countryMatch = selectedCountry === 'All Countries' || row.country === selectedCountry;
      const cityMatch = selectedCity === 'All Cities' || row.city === selectedCity;
      return countryMatch && cityMatch;
    });

    const inRange = (date: Date, rangeStart: Date, rangeEnd: Date) =>
      date >= rangeStart && date <= rangeEnd;

    const sumForRange = (
      key: 'newUsers' | 'newMerchants' | 'stage2LoopsClosed',
      rangeStart: Date,
      rangeEnd: Date,
    ) => {
      return baseRows.reduce((sum, row) => {
        const d = parseDate(row.date);
        if (!inRange(d, rangeStart, rangeEnd)) return sum;
        return sum + row[key];
      }, 0);
    };

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

    const aggregateChartData = (
      key: 'newUsers' | 'newMerchants' | 'stage2LoopsClosed',
      rangeStart: Date,
      rangeEnd: Date,
    ) => {
      const byDate = new Map<string, number>();

      baseRows.forEach(row => {
        const d = parseDate(row.date);
        if (!inRange(d, rangeStart, rangeEnd)) return;
        const existing = byDate.get(row.date) ?? 0;
        byDate.set(row.date, existing + row[key]);
      });

      return Array.from(byDate.entries())
        .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
        .map(([date, value]) => ({
          date,
          value,
        }));
    };

    const newUsersCurr = sumForRange('newUsers', startDate, endDate);
    const newUsersPrev = sumForRange('newUsers', prevStart, prevEnd);
    const merchantsCurr = sumForRange('newMerchants', startDate, endDate);
    const merchantsPrev = sumForRange('newMerchants', prevStart, prevEnd);
    const loopsCurr = sumForRange('stage2LoopsClosed', startDate, endDate);
    const loopsPrev = sumForRange('stage2LoopsClosed', prevStart, prevEnd);

    return {
      newUsers: {
        title: 'New Users',
        metric: buildMetric(newUsersCurr, newUsersPrev),
        chartData: aggregateChartData('newUsers', startDate, endDate),
      },
      newMerchants: {
        title: 'New Merchants',
        metric: buildMetric(merchantsCurr, merchantsPrev),
        chartData: aggregateChartData('newMerchants', startDate, endDate),
      },
      stage2LoopsClosed: {
        title: 'Stage 2 Loops Closed',
        metric: buildMetric(loopsCurr, loopsPrev),
        chartData: aggregateChartData('stage2LoopsClosed', startDate, endDate),
      },
    };
  }, [data, selectedCountry, selectedCity, selectedPeriod, selectedDateRange]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header with Filters */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Onboarding Summary</h1>

        <div className="flex gap-3">
          {/* Country Dropdown */}
          <div ref={countryDropdownRef} className="relative">
            <button
              onClick={() => {
                setOpenCountryDropdown(!openCountryDropdown);
                setOpenCityDropdown(false);
                setOpenDateRangeDropdown(false);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700 shadow-sm cursor-pointer"
            >
              {selectedCountry}
              <ChevronDown size={16} className={`transition-transform duration-200 ${openCountryDropdown ? 'rotate-180' : ''}`} />
            </button>

            {openCountryDropdown && (
              <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                {countries.map((country) => (
                  <button
                    key={country}
                    onClick={() => {
                      setSelectedCountry(country);
                      setOpenCountryDropdown(false);
                      if (country === 'All Countries') {
                        setSelectedCity('All Cities');
                      }
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100 transition-colors first:rounded-t-lg last:rounded-b-lg cursor-pointer ${selectedCountry === country ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                      }`}
                  >
                    {country}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* City Dropdown */}
          <div ref={cityDropdownRef} className="relative">
            <button
              onClick={() => {
                setOpenCityDropdown(!openCityDropdown);
                setOpenCountryDropdown(false);
                setOpenDateRangeDropdown(false);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700 shadow-sm cursor-pointer"
            >
              {selectedCity}
              <ChevronDown size={16} className={`transition-transform duration-200 ${openCityDropdown ? 'rotate-180' : ''}`} />
            </button>

            {openCityDropdown && (
              <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                {cities.map((city) => (
                  <button
                    key={city}
                    onClick={() => {
                      setSelectedCity(city);
                      setOpenCityDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100 transition-colors first:rounded-t-lg last:rounded-b-lg cursor-pointer ${selectedCity === city ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                      }`}
                  >
                    {city}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Period Toggle: Weekly, Fortnightly, Monthly */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setSelectedPeriod('Weekly')}
              className={`px-4 py-1 rounded text-sm font-medium transition-colors ${selectedPeriod === 'Weekly' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'
                }`}
            >
              Weekly
            </button>
            <button
              onClick={() => setSelectedPeriod('Fortnightly')}
              className={`px-4 py-1 rounded text-sm font-medium transition-colors ${selectedPeriod === 'Fortnightly' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'
                }`}
            >
              Fortnightly
            </button>
            <button
              onClick={() => setSelectedPeriod('Monthly')}
              className={`px-4 py-1 rounded text-sm font-medium transition-colors ${selectedPeriod === 'Monthly' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-200'
                }`}
            >
              Monthly
            </button>
          </div>

          {/* Date Range Dropdown */}
          <div ref={dateRangeDropdownRef} className="relative">
            <button
              onClick={() => {
                setOpenDateRangeDropdown(!openDateRangeDropdown);
                setOpenCountryDropdown(false);
                setOpenCityDropdown(false);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors text-sm font-medium text-gray-700 shadow-sm cursor-pointer"
            >
              {selectedDateRange || 'Select Date Range'}
              <ChevronDown size={16} className={`transition-transform duration-200 ${openDateRangeDropdown ? 'rotate-180' : ''}`} />
            </button>

            {openDateRangeDropdown && (
              <div className="absolute right-0 mt-1 w-64 bg-white border border-gray-300 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto">
                {dateRanges.length > 0 ? (
                  dateRanges.map((range, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedDateRange(range);
                        setOpenDateRangeDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100 transition-colors first:rounded-t-lg last:rounded-b-lg cursor-pointer ${selectedDateRange === range ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                        }`}
                    >
                      {range}
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-2.5 text-sm text-gray-500">No date ranges available</div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="w-full h-px bg-gray-300 shadow-md"></div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {(() => {
          const cards = computedCards || data.cards;
          return (
            <>
              {/* New Users Card */}
              <div className="bg-white p-6 rounded-lg shadow border">
                <h3 className="text-lg font-semibold text-black mb-3 pb-2 border-b border-gray-300">New Users</h3>
                <div className="flex items-baseline gap-2 mb-1">
                  <p className="text-3xl font-bold text-gray-900 ml-2">{cards.newUsers.metric.value.toLocaleString()}</p>
                  <div className={`flex items-center gap-1 text-sm ${cards.newUsers.metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {cards.newUsers.metric.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>
                      {cards.newUsers.metric.trend === 'up' ? '+' : ''}{cards.newUsers.metric.change}%<span className="text-gray-700"> vs prev.</span>
                    </span>
                  </div>
                </div>

                <ResponsiveContainer width="100%" height={60}>
                  <AreaChart data={cards.newUsers.chartData}>
                    <defs>
                      <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#93c5fd" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#93c5fd" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white px-3 py-2 border border-gray-300 rounded-lg shadow-lg">
                              <p className="text-xs text-gray-600">Date: <span className="text-xs font-semibold text-gray-800">{payload[0].payload.date} </span></p>
                              <p className="text-xs text-gray-600">Users: <span className="font-bold text-blue-600">{payload[0].value}</span></p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* New Merchants Card */}
              <div className="bg-white p-6 rounded-lg shadow border">
                <h3 className="text-lg font-semibold text-black mb-3 pb-2 border-b border-gray-300">New Merchants</h3>
                <div className="flex items-baseline gap-2 mb-1">
                  <p className="text-3xl font-bold text-gray-900 ml-2">{cards.newMerchants.metric.value.toLocaleString()}</p>
                  <div className={`flex items-center gap-1 text-sm ${cards.newMerchants.metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {cards.newMerchants.metric.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>
                      {cards.newMerchants.metric.trend === 'up' ? '+' : ''}{cards.newMerchants.metric.change}%<span className="text-gray-700"> vs prev.</span>
                    </span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={60}>
                  <AreaChart data={cards.newMerchants.chartData}>
                    <defs>
                      <linearGradient id="colorMerchants" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#fca5a5" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#fca5a5" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke="#ef4444" fillOpacity={1} fill="url(#colorMerchants)" />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white px-3 py-2 border border-gray-300 rounded-lg shadow-lg">
                              <p className="text-xs text-gray-600">Date: <span className="text-xs font-semibold text-gray-800">{payload[0].payload.date} </span></p>
                              <p className="text-xs text-gray-600">Merchants: <span className="font-bold text-red-600">{payload[0].value}</span></p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* Stage 2 Loops Closed Card */}
              <div className="bg-white p-6 rounded-lg shadow border">
                <h3 className="text-lg font-semibold text-black mb-3 pb-2 border-b border-gray-300">Stage 2 Loops Closed</h3>
                <div className="flex items-baseline gap-2 mb-1">
                  <p className="text-3xl font-bold text-gray-900 ml-2">{cards.stage2LoopsClosed.metric.value.toLocaleString()}</p>
                  <div className={`flex items-center gap-1 text-sm ${cards.stage2LoopsClosed.metric.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {cards.stage2LoopsClosed.metric.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>
                      {cards.stage2LoopsClosed.metric.trend === 'up' ? '+' : ''}{cards.stage2LoopsClosed.metric.change}%<span className="text-gray-700"> vs prev.</span>
                    </span>
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={60}>
                  <AreaChart data={cards.stage2LoopsClosed.chartData}>
                    <defs>
                      <linearGradient id="colorLoops" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#86efac" stopOpacity={0.8} />
                        <stop offset="95%" stopColor="#86efac" stopOpacity={0.1} />
                      </linearGradient>
                    </defs>
                    <Area type="monotone" dataKey="value" stroke="#22c55e" fillOpacity={1} fill="url(#colorLoops)" />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-white px-3 py-2 border border-gray-300 rounded-lg shadow-lg">
                              <p className="text-xs text-gray-600">Date: <span className="text-xs font-semibold text-gray-800">{payload[0].payload.date} </span></p>
                              <p className="text-xs text-gray-600">Loops: <span className="font-bold text-green-600">{payload[0].value}</span></p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </>
          );
        })()}
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-lg shadow-md border-2 border-gray-300 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b-2 border-gray-300">
            <tr>
              <th className="px-6 py-3 text-center text-sm font-semibold text-black tracking-wider">Date</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-black tracking-wider">Country</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-black tracking-wider">City</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-black tracking-wider">New Users</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-black tracking-wider">New Merchants</th>
              <th className="px-6 py-3 text-center text-sm font-semibold text-black tracking-wider">Stage 2 Loops Closed</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filteredTableData.length > 0 ? (
              filteredTableData.map((row, index) => (
                <tr
                  key={index}
                  className={`border-b border-gray-200 hover:bg-blue-50 transition-colors cursor-pointer ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{row.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-lg">{getFlagEmoji(row.countryCode)}</span>
                      <span>{row.country}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{row.city}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{row.newUsers}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{row.newMerchants}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">{row.stage2LoopsClosed}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-sm text-gray-500">
                  No data available for the selected filters
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Helper function to get flag emoji
function getFlagEmoji(countryCode: string): string {
  if (!countryCode || countryCode.length !== 2) return '';

  const codePoints = [...countryCode.toUpperCase()].map(
    char => 127397 + char.charCodeAt(0)
  );
  return String.fromCodePoint(...codePoints);
}