// src/app/dashboard/loop-health/page.tsx
"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Loader2, TrendingUp, TrendingDown, ChevronDown } from 'lucide-react';
import { MdOutlineOutlinedFlag } from 'react-icons/md';
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { LoopHealthData } from '@/app/types/loop-health';
import { ResponsiveContainer, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Line, Pie, Cell, PieChart, ComposedChart, BarChart } from 'recharts';

export default function LoopHealthPage() {
  const [data, setData] = useState<LoopHealthData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedRegion, setSelectedRegion] = useState('Global');
  const [selectedPeriod, setSelectedPeriod] = useState('Last 7 days');
  const [openRegionDropdown, setOpenRegionDropdown] = useState(false);
  const [openPeriodDropdown, setOpenPeriodDropdown] = useState(false);
  const regionDropdownRef = useRef<HTMLDivElement>(null);
  const periodDropdownRef = useRef<HTMLDivElement>(null);

  const regions = ['Global', 'Country', 'City'];
  const periods = ['Last 7 days', 'Last 14 days', 'Last 30 days'];

  const expiryBreakdown = [
    { label: 'Completed Before Expiry', value: 56, color: '#93c5fd' },
    { label: 'Expired Unused', value: 31, color: '#ef7917' },
    { label: 'Other 1', value: 5, color: '#fbbb01' },
    { label: 'Other 2', value: 4, color: '#1e40af' },
    { label: 'Other 3', value: 4, color: '#d1d5db' }
  ];

  // Fetch data when page loads
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('/api/dashboard/loop-health');

        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }

        const jsonData = await response.json();
        setData(jsonData);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle click outside to close dropdowns
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (regionDropdownRef.current && !regionDropdownRef.current.contains(event.target as Node)) {
        setOpenRegionDropdown(false);
      }
      if (periodDropdownRef.current && !periodDropdownRef.current.contains(event.target as Node)) {
        setOpenPeriodDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Show loading spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
      </div>
    );
  }

  // Show error message
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  // No data
  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Loop Health Dashboard</h1>
          <p className="text-gray-500 text-sm">Monitor loop completion and health metrics</p>
        </div>

        <div className="flex gap-3">
          {/* Region Dropdown */}
          <div ref={regionDropdownRef} className="relative">
            <button
              onClick={() => {
                setOpenRegionDropdown(!openRegionDropdown);
                setOpenPeriodDropdown(false);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 shadow-sm cursor-pointer"
            >
              {selectedRegion}
              <ChevronDown size={16} className={`transition-transform duration-200 ${openRegionDropdown ? 'rotate-180' : ''}`} />
            </button>

            {openRegionDropdown && (
              <div className="absolute right-0 mt-1 w-40 bg-white border border-gray-300 rounded-lg shadow-xl z-50">
                {regions.map((region) => (
                  <button
                    key={region}
                    onClick={() => {
                      setSelectedRegion(region);
                      setOpenRegionDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100 transition-colors first:rounded-t-lg last:rounded-b-lg cursor-pointer ${selectedRegion === region ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                      }`}
                  >
                    {region}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Period Dropdown */}
          <div ref={periodDropdownRef} className="relative">
            <button
              onClick={() => {
                setOpenPeriodDropdown(!openPeriodDropdown);
                setOpenRegionDropdown(false);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium text-gray-700 shadow-sm cursor-pointer"
            >
              {selectedPeriod}
              <ChevronDown size={16} className={`transition-transform duration-200 ${openPeriodDropdown ? 'rotate-180' : ''}`} />
            </button>

            {openPeriodDropdown && (
              <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-300 rounded-lg shadow-xl z-50">
                {periods.map((period) => (
                  <button
                    key={period}
                    onClick={() => {
                      setSelectedPeriod(period);
                      setOpenPeriodDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-100 transition-colors first:rounded-t-lg last:rounded-b-lg cursor-pointer ${selectedPeriod === period ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'
                      }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* First Row Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Completion Rate Card */}
        <div className="relative overflow-hidden rounded-xl p-6 shadow-lg bg-gradient-to-r from-[#1f3b1b] to-[#519946]">
          <div className="relative z-10 flex flex-col items-center justify-center text-white">
            <h3 className="text-md font-medium mb-2">Completion Rate</h3>

            <div className="flex items-center gap-2">
              <p className="text-3xl font-medium">{data.metrics.completionRate.value}%</p>
              <TrendingUp className="mt-3 w-5 h-5 text-green-300" />
            </div>

            <div className="mt-4 relative flex ml-12 gap-1 text-sm">
              <TrendingUp className="w-4 h-4 text-green-300" />
              <span className="opacity-90">{data.metrics.completionRate.change}</span>
            </div>
          </div>

          {/* Bottom separator line */}
          <div className="absolute bottom-0 left-0 right-0 h-5 bg-[#3a7231]"></div>

          {/* Shine effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        </div>

        {/* Active Loops Card */}
        <div className="relative overflow-hidden rounded-xl p-6 shadow-lg bg-gradient-to-r from-[#1c2c65] to-[#3550bb]">
          <div className="relative z-10 flex flex-col items-center justify-center text-white">
            <h3 className="text-md font-medium mb-2">Active Loops</h3>

            <div className="relative inline-block">
              <p className="text-3xl font-medium">{data.metrics.activeLoops.value.toLocaleString()}</p>

              <div className="absolute top-0 left-full ml-2 mt-3 flex flex-row items-start gap-1 whitespace-nowrap">
                <TrendingUp className="w-5 h-5 text-green-300" />
                <span className="text-xs mt-0.5">{data.metrics.activeLoops.change}</span>
              </div>
            </div>
          </div>

          {/* Bottom separator line */}
          <div className="absolute bottom-0 left-0 right-0 h-5 bg-[#293e91]"></div>

          {/* Shine effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        </div>

        {/* Expired Loops Card */}
        <div className="relative overflow-hidden rounded-xl p-6 shadow-lg bg-gradient-to-r from-[#8a450e] to-[#ef7917]">
          <div className="relative z-10 flex flex-col items-center justify-center text-white">
            <h3 className="text-md font-medium mb-2">Expired Loops</h3>

            <div className="relative inline-block">
              <p className="text-3xl font-medium">{data.metrics.expiredLoops.value.toLocaleString()}%</p>

              <div className="absolute top-0 left-full ml-2 mt-3 flex flex-row items-start gap-1 whitespace-nowrap">
                <TrendingDown className="w-5 h-5 text-[#fcbb00]" />
                <span className="text-sm">{data.metrics.expiredLoops.change}</span>
              </div>
            </div>
          </div>

          {/* Bottom separator line */}
          <div className="absolute bottom-0 left-0 right-0 h-5 bg-[#a05112]"></div>

          {/* Shine effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        </div>

        {/* Net UWC Card */}
        <div className="relative overflow-hidden rounded-xl p-6 shadow-lg bg-gradient-to-r from-[#872321] to-[#cf3734]">
          <div className="relative z-10 flex flex-col items-center justify-center text-white">
            <h3 className="text-md font-medium mb-2">Next UWC / Loop</h3>

            <div className="relative inline-block">
              <p className="text-3xl font-medium">{data.metrics.netUWCPerLoop.value} UWC</p>
            </div>
          </div>

          {/* SAFE/RISK Indicator */}
          <div className="absolute bottom-5 left-0 right-0 z-10 flex justify-center">
            <div className="px-4 py-1 bg-[#9c2726] text-white text-xs font-medium uppercase tracking-wide">
              {data.metrics.netUWCPerLoop.status}
            </div>
          </div>

          {/* Bottom separator line */}
          <div className="absolute bottom-0 left-0 right-0 h-5 bg-[#9a2925]"></div>

          {/* Shine effect overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
        </div>
      </div>

      {/* Second Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Loop State Funnel Chart */}
        <div className="lg:col-span-6 bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 pb-1 border-b border-gray-200">Loop State Funnel</h3>

          <div className="space-y-2">
            {data.loopFunnelData.map((stage, index) => {
              // Calculate width as percentage based on count
              const maxCount = data.loopFunnelData[0].count;
              let widthPercent = (stage.count / maxCount) * 130; // Allow some overflow for visual effect
              let widthEndPercent = '15%' // default end cap width

              // Increase width for visuality (change later based on real data)
              if (index == 2) {
                widthEndPercent = '20%';
              } else if (index == 3) {
                widthEndPercent = '27%';
              } else if (index == 4) {
                widthPercent *= 3.2;
                widthEndPercent = '28%';
              }

              // Determine colors
              const getColors = (status?: string) => {
                if (status === 'expired') return { main: '#ef7917', end: '#f49f5c' };
                if (status === 'completed') return { main: '#354fbd', end: '#7184d1' };
                return { main: '#293e91', end: '#6978b3' };
              };
              const colors = getColors(stage.status);

              return (
                <div key={index} className="relative flex justify-center">
                  <div
                    className={`relative overflow-hidden text-white flex items-center justify-center 
                    py-3 transition-all duration-300 hover:brightness-110 cursor-pointer`}
                    style={{
                      width: `${widthPercent}%`,
                      borderTopRightRadius: '6px',
                      borderBottomRightRadius: '6px',
                      background: colors.main,
                      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 5% 100%)'
                    }}
                  >
                    {/* Light end cap */}
                    <div
                      className="absolute top-0 right-0 bottom-0"
                      style={{
                        width: `${widthEndPercent}`,
                        background: colors.end,
                        borderTopRightRadius: '6px',
                        borderBottomRightRadius: '6px'
                      }}
                    />
                    <span className="mr-6 text-sm font-medium z-10">{stage.name}</span>
                    <span className={`absolute text-xs font-medium z-10 ${(index === 0 || index === 1) ? 'right-4' : 'right-3'}`}>{stage.count.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Time to Completion Chart */}
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 pb-1 border-b border-gray-200">Time to Completion</h3>

          {/* Summary Stats */}
          <div className="mb-4 space-y-2 text-sm">
            <p>Avg: <span className="font-bold">{data.timeCompletionData.timeSummary.average}</span> days</p>
            <div className="border-b border-gray-100"></div>
            <p>Median: <span className="font-bold">{data.timeCompletionData.timeSummary.median}</span> days</p>
            <div className="border-b border-gray-100"></div>
            <p>90th Percentile: <span className="font-bold">{data.timeCompletionData.timeSummary.percentile90}</span> days</p>
            <div className="border-b border-gray-100"></div>
          </div>

          { }

          {/* Bar Chart */}
          <ResponsiveContainer width="100%" height={150}>
            <ComposedChart data={data.timeCompletionData.timeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} width={23} />
              <Tooltip />

              <Bar
                dataKey="value"
                radius={[4, 4, 0, 0]}
                tooltipType="none"
              >
                {(() => {
                  const barColors = [
                    '#a3a9c1',
                    '#e5e8f7',
                    '#b8c4f4',
                    '#b2beff',
                    '#96acff',
                    '#5f81f5',
                    '#e5e8f7'
                  ];
                  return data.timeCompletionData.timeData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={barColors[index % barColors.length]}
                    />
                  ));
                })()}
              </Bar>

              <Line
                type="monotone"
                dataKey="value"
                stroke="#2563eb"
                strokeWidth={2}
                dot={{ fill: '#2563eb', r: 4 }}
                activeDot={{ r: 5 }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Expiry Breakdown Donut Chart */}
        <div className="lg:col-span-3 bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 pb-1 border-b border-gray-200">Expiry Breakdown</h3>

          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={150}>
              <PieChart>
                <Pie
                  data={expiryBreakdown}
                  cx="50%"
                  cy="50%"
                  innerRadius={20}
                  outerRadius={72}
                  dataKey="value"
                  startAngle={90}
                  endAngle={-270}
                >
                  {expiryBreakdown.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-2 border border-gray-300 rounded shadow-lg text-xs">
                          <p className="text-gray-800 font-semibold">{data.label}: {data.value}%</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend labels */}
          <div className="mt-4 space-y-2 text-xs">
            {expiryBreakdown.map(({ label, value, color }) => (
              <div
                key={label}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-sm"
                    style={{ backgroundColor: color }}
                  />
                  <span className="text-gray-600">{label}</span>
                </div>

                <span className="font-semibold text-gray-800">
                  {value}%
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Third Row Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* UWC Flow Chart */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
          <h3 className="text-lg font-semibold mb-4 text-gray-800 pb-1 border-b border-gray-200">UWC Flow</h3>

          <div className="space-y-2">
            {data.uwcFlowFunnelData.map((stage, index) => {
              // Calculate width as percentage based on count
              const maxCount = data.uwcFlowFunnelData[0].count;
              let widthPercent = (stage.count / maxCount) * 130; // Allow some overflow for visual effect
              const widthEndPercent = '15%' // default end cap width

              // Increase width for visuality (change later based on real data)
              if (index == 3) {
                widthPercent = (data.uwcFlowFunnelData[2].count / maxCount) * 110;
              }

              // Determine colors and gradients
              const getColors = (name?: string) => {
                if (name === 'UWC Spent') return { main: '#293e91', end: '#6878b3' };
                if (name === 'UWC Burned') return { main: '#ef7917', end: '#f49f5c' };
                if (name === 'Net UWC per Loop') return { main: '#cf3732', end: '#e8e8e8' };
                return { main: '#293e91', end: '#6978b3' };
              };
              const colors = getColors(stage.name);

              // Gradient background
              const getBackgroundStyle = () => {
                if (index === 1) {
                  return `linear-gradient(to right, #293e91 60%, #ef7917 100%)`;
                } else if (index === 2) {
                  return `linear-gradient(to right, #8a450e 5%, #ef7917 100%)`;
                }
                return colors.main;
              };

              return (
                <div key={index} className="relative flex justify-center w-full">
                  <div
                    className={`relative overflow-visible text-white flex items-center justify-between 
                    pl-8 py-3 transition-all duration-300 hover:brightness-110 cursor-pointer`}
                    style={{
                      width: `${widthPercent}%`,
                      borderTopRightRadius: '6px',
                      borderBottomRightRadius: '6px',
                      background: getBackgroundStyle(),
                      clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 5% 100%)'
                    }}
                  >
                    {/* Light end cap */}
                    {index !== 3 && (
                      <div
                        className="absolute top-0 right-0 bottom-0"
                        style={{
                          width: `${widthEndPercent}`,
                          background: colors.end,
                          borderTopRightRadius: '6px',
                          borderBottomRightRadius: '6px'
                        }}
                      />
                    )}
                    <span className="mr-6 text-sm font-medium z-10">
                      {index === 3 ? (
                        <span className="flex gap-4 items-center">
                          <span>{stage.name}</span>
                          <span>{stage.count} UWC</span>
                        </span>
                      ) : (
                        stage.name
                      )}
                    </span>
                    {index !== 3 && (
                      <span className={`absolute text-xs font-medium z-10 text-gray-800 ${(index === 0 || index === 1) ? 'right-4' : 'right-2'}`}>{stage.count.toLocaleString()}</span>
                    )}
                  </div>

                  {/* Gray Section For Net UWC */}
                  {index === 3 && (
                    <div
                      className="absolute top-0 bottom-0 flex items-center bg-gray-200"
                      style={{
                        left: `${widthPercent + 6}%`,
                        right: '0',
                        borderTopRightRadius: '6px',
                        borderBottomRightRadius: '6px'
                      }}
                    >
                      <div className="flex items-center ml-2 gap-2 text-gray-800 text-xs font-medium">
                        <div className="flex items-center gap-1 bg-gray-300 rounded">
                          <span>Minted:</span>
                          <span className="font-semibold">{stage.netMinted?.toLocaleString()}</span>
                        </div>

                        <div className="flex items-center gap-1 bg-gray-300 rounded">
                          <span>Burned:</span>
                          <span className="font-semibold">{stage.netBurned?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Loop Categories & Merchant Alerts */}
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200 flex flex-col">
          {/* Loop Categories Chart */}
          <div className="flex-1 border-b border-gray-200">
            <h3 className="text-base font-semibold mb-2 text-gray-800 pb-2 border-b border-gray-200">Loop Categories</h3>

            <ResponsiveContainer width="100%" height={120}>
              <BarChart data={data.categories} margin={{ top: 5, right: 5, bottom: 5, left: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fontWeight: 500 }} />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]} maxBarSize={30}>
                  {data.categories.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Merchant Risk Alerts Table */}
          <div className="flex-1 pt-2">
            <div className="bg-[#1f5c71] text-white px-3 py-1.5 rounded-t-lg font-semibold text-xs">
              Merchant Risk Alerts
            </div>

            <div className="overflow-x-auto border border-teal-700 border-t-0 rounded-b-lg">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="px-2 py-1 text-center text-xs font-semibold text-gray-800">Merchant</th>
                    <th className="px-2 py-1 text-center text-xs font-semibold text-gray-800">Category</th>
                    <th className="px-2 py-1 text-center text-xs font-semibold text-gray-800">Completion Rate</th>
                    <th className="px-2 py-1 text-center text-xs font-semibold text-gray-800">Discount(%)</th>
                    <th className="px-2 py-1 text-center text-xs font-semibold text-gray-800">Flag</th>
                  </tr>
                </thead>
                <tbody>
                  {data.merchantAlerts.map((alert, index) => (
                    <tr key={index} className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer">
                      <td className="px-2 py-1 text-xs text-gray-800 text-center">{alert.merchantId}</td>
                      <td className="px-2 py-1 text-xs text-gray-800 text-center">{alert.category}</td>
                      <td className="px-2 py-1 text-xs text-gray-800 text-center">{alert.completionRate}%</td>
                      <td className="px-2 py-1 text-xs text-gray-800 text-center">${alert.discount.toLocaleString()}</td>
                      <td className="px-2 py-1 text-center">
                        <div className="flex justify-center">
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center"
                            style={{
                              backgroundColor:
                                alert.flag === 'high'
                                  ? '#ef4444'
                                  : alert.flag === 'medium'
                                    ? '#f97316'
                                    : '#22c55e'
                            }}
                          >
                            <MdOutlineOutlinedFlag className="text-white" size={14} />
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

    </div >
  );
}