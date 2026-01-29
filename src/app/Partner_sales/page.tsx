'use client'

import { useEffect, useState, useCallback } from 'react'
import { Loader2 } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
} from "recharts"

interface SummaryEntry {
  merchant_id: string
  region: string
  total_list_price: number
  total_commission: number
  total_tax_collected: number
  total_net_before_commission: number
}

const COLORS = {
  "Discounted Price": "#82ca9d",
  "Transaction Fee": "#ffc658",
  "Net Cash": "#8884d8",
  "Challenz Profit": "#ff7f50",
  "Tax": "#a4de6c",
  "Partner Payable": "#d0ed57"
}

export default function PartnerSalesPage() {
  const [filteredSummary, setFilteredSummary] = useState<SummaryEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState('2025-06-22')
  const [selectedRegion, setSelectedRegion] = useState('US')

  const fetchPartnerSales = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `https://masswgndvgtpdabpknsx.supabase.co/functions/v1/calculate-daily-tax-commission?date=${selectedDate}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
          }
        }
      )

      const resultText = await res.text()
      let result
      try {
        result = JSON.parse(resultText)
      } catch {
        throw new Error(`Failed to parse JSON response: ${resultText}`)
      }

      if (!res.ok) throw new Error(result.error || 'Failed to fetch partner sales')

      const filtered = (result.date_summary || []).filter((entry: SummaryEntry) => entry.region === selectedRegion)
      setFilteredSummary(filtered)
    } catch (err) {
      console.error('Fetch error:', err)
      setError(err instanceof Error ? err.message : 'Unexpected error')
    } finally {
      setLoading(false)
    }
  }, [selectedDate, selectedRegion])

  useEffect(() => {
    fetchPartnerSales()
  }, [fetchPartnerSales])

  function getPieDataForMerchant(entry: SummaryEntry) {
    const listPrice = entry.total_list_price
    const uwaciNeeded = Math.ceil((0.3 * listPrice) * 2)
    const discountedPrice = listPrice - (uwaciNeeded / 2)
    const transactionFee = 0.03 * discountedPrice
    const netCash = discountedPrice - transactionFee
    const challenzProfit = 0.10 * listPrice
    const tax = 0.10 * discountedPrice
    const partnerPayable = listPrice - challenzProfit - tax

    return [
      { name: "Discounted Price", value: discountedPrice, color: COLORS["Discounted Price"] },
      { name: "Transaction Fee", value: transactionFee, color: COLORS["Transaction Fee"] },
      { name: "Net Cash", value: netCash, color: COLORS["Net Cash"] },
      { name: "Challenz Profit", value: challenzProfit, color: COLORS["Challenz Profit"] },
      { name: "Tax", value: tax, color: COLORS["Tax"] },
      { name: "Partner Payable", value: partnerPayable, color: COLORS["Partner Payable"] },
    ]
  }

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <label>
              Select Date:
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="ml-2 border rounded px-2 py-1"
              />
            </label>

            <label>
              Select Region:
              <select
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
                className="ml-2 border rounded px-2 py-1"
              >
                <option value="US">US</option>
                <option value="NZ">NZ</option>
                <option value="CA">CA</option>
                <option value="AU">AU</option>
              </select>
            </label>
          </div>

          <h2 className="text-xl font-semibold">Partner Sales Summary - {selectedRegion}</h2>

          {loading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-4">{error}</div>
          ) : filteredSummary.length === 0 ? (
            <div className="text-gray-500 text-center py-4">No summary data for selected date and region.</div>
          ) : (
            <div className="flex flex-wrap justify-center gap-8">
              {filteredSummary.map((entry) => {
                const pieData = getPieDataForMerchant(entry)
                return (
                  <div key={entry.merchant_id} className="flex flex-col items-center justify-center">
                    <PieChart width={600} height={500}>
                      <Pie
                        data={pieData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={120}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {pieData.map((slice, idx) => (
                          <Cell key={`cell-${idx}`} fill={slice.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                      <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                    </PieChart>
                    <p className="mt-2 text-sm text-gray-600">
                      Merchant ID: <span className="font-mono">{entry.merchant_id}</span>
                    </p>
                  </div>
                )
              })}
            </div>
          )}

          <h2 className="text-xl font-semibold mt-8">All Sales Entries</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Merchant ID</th>
                  <th className="text-left py-3 px-4 font-semibold">Sell Price ($)</th>
                  <th className="text-left py-3 px-4 font-semibold">Discounted Price ($)</th>
                  <th className="text-left py-3 px-4 font-semibold">Transaction Fee ($)</th>
                  <th className="text-left py-3 px-4 font-semibold">Net Cash ($)</th>
                  <th className="text-left py-3 px-4 font-semibold">Challenz Profit ($)</th>
                  <th className="text-left py-3 px-4 font-semibold">Tax ($)</th>
                  <th className="text-left py-3 px-4 font-semibold">Partner Payable ($)</th>
                </tr>
              </thead>
              <tbody>
                {filteredSummary.map((entry) => {
                  const listPrice = entry.total_list_price
                  const uwaciNeeded = Math.ceil((0.3 * listPrice) * 2)
                  const discountedPrice = listPrice - (uwaciNeeded / 2)
                  const transactionFee = 0.03 * discountedPrice
                  const netCash = discountedPrice - transactionFee
                  const challenzProfit = 0.10 * listPrice
                  const tax = 0.10 * discountedPrice
                  const partnerPayable = listPrice - challenzProfit - tax

                  return (
                    <tr key={entry.merchant_id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="py-3 px-4 font-mono">{entry.merchant_id}</td>
                      <td className="py-3 px-4">{listPrice.toFixed(2)}</td>
                      <td className="py-3 px-4">{discountedPrice.toFixed(2)}</td>
                      <td className="py-3 px-4">{transactionFee.toFixed(2)}</td>
                      <td className="py-3 px-4">{netCash.toFixed(2)}</td>
                      <td className="py-3 px-4">{challenzProfit.toFixed(2)}</td>
                      <td className="py-3 px-4">{tax.toFixed(2)}</td>
                      <td className="py-3 px-4">{partnerPayable.toFixed(2)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
