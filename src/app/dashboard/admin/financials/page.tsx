"use client";

import { useState } from "react";
import Image from "next/image";

type TimeRange = "this-month" | "last-month" | "custom";

interface Defaulter {
  id: string;
  name: string;
  dueDate: string;
  amount: number;
  avatar: string;
}

interface FinancialActivity {
  date: string;
  description: string;
  amount: number;
}

const defaulters: Defaulter[] = [
  { id: "1", name: "David Johnson", dueDate: "Due Nov 15, 2025", amount: 1200, avatar: "/logos/profile.png" },
  { id: "2", name: "David Johnson", dueDate: "Due Nov 15, 2025", amount: 1200, avatar: "/logos/profile.png" },
  { id: "3", name: "David Johnson", dueDate: "Due Nov 15, 2025", amount: 1200, avatar: "/logos/profile.png" },
  { id: "4", name: "David Johnson", dueDate: "Due Nov 15, 2025", amount: 1200, avatar: "/logos/profile.png" },
  { id: "5", name: "David Johnson", dueDate: "Due Nov 15, 2025", amount: 1200, avatar: "/logos/profile.png" },
];

const recentActivity: FinancialActivity[] = [
  { date: "Nov 29, 2025", description: "Electricity Bill", amount: 8000 },
  { date: "Nov 25, 2025", description: "Mark Wilson(Rent)", amount: 1000 },
  { date: "Nov 29, 2025", description: "Electricity Bill", amount: 8000 },
  { date: "Nov 29, 2025", description: "Electricity Bill", amount: 8000 },
  { date: "Nov 23, 2025", description: "Ethan Lowe(Meal)", amount: 8000 },
];

const categoryBreakdown = [
  { name: "Meals", percentage: 47.3, color: "#E91E63" },
  { name: "Rents", percentage: 30.3, color: "#40E0D0" },
  { name: "Laundry", percentage: 4.4, color: "#9C27B0" },
  { name: "Repairs", percentage: 12.6, color: "#FF69B4" },
  { name: "Maintenance", percentage: 5.4, color: "#00BCD4" },
];

const topExpenses = [
  { name: "Staff Salaries", amount: 60000 },
  { name: "Maintenance", amount: 35000 },
  { name: "Utilities", amount: 20000 },
];

export default function FinancialsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("this-month");

  return (
    <div className="space-y-6">
      {/* Time Range & Export */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 bg-white rounded-lg p-1">
          <button
            onClick={() => setTimeRange("this-month")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              timeRange === "this-month" ? "bg-gray-100 text-gray-800" : "text-gray-500"
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setTimeRange("last-month")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              timeRange === "last-month" ? "bg-gray-100 text-gray-800" : "text-gray-500"
            }`}
          >
            Last Month
          </button>
          <button
            onClick={() => setTimeRange("custom")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
              timeRange === "custom" ? "bg-gray-100 text-gray-800" : "text-gray-500"
            }`}
          >
            Custom Range
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-red-400 text-red-500 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors">
            Export PDF
          </button>
          <button className="px-4 py-2 border border-green-400 text-green-600 rounded-lg text-sm font-medium hover:bg-green-50 transition-colors">
            Export Excel
          </button>
          <button className="px-4 py-2 border border-blue-400 text-blue-500 rounded-lg text-sm font-medium hover:bg-blue-50 transition-colors">
            Export CSV
          </button>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue vs Expenses Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-6">Revenue vs Expenses</h2>
          
          {/* Chart */}
          <div className="h-48 flex items-end justify-between gap-8 px-8">
            {["Week 1", "Week 2", "Week 3", "Week 4"].map((week, index) => (
              <div key={week} className="flex-1 flex flex-col items-center gap-2">
                <div className="flex gap-2 items-end h-40 w-full justify-center">
                  <div
                    className="w-8 bg-[#40E0D0] rounded-t"
                    style={{ height: `${[70, 85, 60, 90][index]}%` }}
                  />
                  <div
                    className="w-8 bg-[#E91E63] rounded-t"
                    style={{ height: `${[50, 65, 75, 55][index]}%` }}
                  />
                </div>
                <span className="text-sm text-gray-500">{week}</span>
              </div>
            ))}
          </div>

          {/* Legend */}
          <div className="flex justify-center gap-8 mt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#40E0D0] rounded" />
              <span className="text-sm text-gray-500">Revenue</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-[#E91E63] rounded" />
              <span className="text-sm text-gray-500">Expenses</span>
            </div>
          </div>
        </div>

        {/* Defaulter List */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Defaulter List</h2>
          <div className="space-y-4">
            {defaulters.map((defaulter) => (
              <div key={defaulter.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Image
                    src={defaulter.avatar}
                    alt={defaulter.name}
                    width={36}
                    height={36}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{defaulter.name}</p>
                    <p className="text-xs text-gray-400">{defaulter.dueDate}</p>
                  </div>
                </div>
                <span className="text-red-500 font-bold">৳{defaulter.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[#2D6A4F] rounded-xl p-4 text-white">
          <p className="text-2xl font-bold">৳185,200</p>
          <p className="text-sm opacity-80">Total Revenue</p>
        </div>
        <div className="bg-[#E91E63] rounded-xl p-4 text-white">
          <p className="text-2xl font-bold">৳174,200</p>
          <p className="text-sm opacity-80">Total Expenses</p>
        </div>
        <div className="bg-[#40E0D0] rounded-xl p-4 text-white">
          <p className="text-2xl font-bold">৳10,700</p>
          <p className="text-sm opacity-80">Net Income</p>
        </div>
        <div className="bg-[#FFB347] rounded-xl p-4 text-white">
          <p className="text-2xl font-bold">৳370</p>
          <p className="text-sm opacity-80">Cost Per Student</p>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Category Breakdown</h2>
          <div className="flex items-center gap-6">
            {/* Donut Chart Placeholder */}
            <div className="relative w-32 h-32">
              <svg viewBox="0 0 36 36" className="w-full h-full">
                <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#E91E63" strokeWidth="3" strokeDasharray="47.3 52.7" strokeDashoffset="25" />
                <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#40E0D0" strokeWidth="3" strokeDasharray="30.3 69.7" strokeDashoffset="-22.3" />
                <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#9C27B0" strokeWidth="3" strokeDasharray="4.4 95.6" strokeDashoffset="-52.6" />
                <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#FF69B4" strokeWidth="3" strokeDasharray="12.6 87.4" strokeDashoffset="-57" />
                <circle cx="18" cy="18" r="15.9" fill="transparent" stroke="#00BCD4" strokeWidth="3" strokeDasharray="5.4 94.6" strokeDashoffset="-69.6" />
              </svg>
            </div>
            {/* Legend */}
            <div className="space-y-2">
              {categoryBreakdown.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-600">{item.name}</span>
                  <span className="text-sm text-gray-400">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Expenses */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Top Expenses</h2>
          <div className="space-y-4">
            {topExpenses.map((expense, index) => (
              <div key={expense.name}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm text-gray-700">{expense.name}</span>
                  <span className="text-sm font-medium text-gray-800">৳{expense.amount.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#40E0D0] h-2 rounded-full"
                    style={{ width: `${(expense.amount / 60000) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Financial Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Financial Activity</h2>
          <div className="space-y-3">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{activity.date}</span>
                <span className="text-gray-700">{activity.description}</span>
                <span className="font-medium text-gray-800">৳{activity.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
