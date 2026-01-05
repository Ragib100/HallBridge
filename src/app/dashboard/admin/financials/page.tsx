"use client";

import { useState } from "react";
import Image from "next/image";

type TimeRange = "this-month" | "last-month" | "this-year" | "custom";
type TabType = "overview" | "collections" | "expenses" | "defaulters";

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: "income" | "expense";
  student?: string;
}

interface Defaulter {
  id: string;
  name: string;
  studentId: string;
  room: string;
  dueAmount: number;
  dueDate: string;
  monthsOverdue: number;
  avatar: string;
}

const transactions: Transaction[] = [
  { id: "1", date: "Jan 5, 2026", description: "Monthly Rent", category: "Rent", amount: 135000, type: "income" },
  { id: "2", date: "Jan 4, 2026", description: "Mess Bill Collection", category: "Meals", amount: 85000, type: "income" },
  { id: "3", date: "Jan 3, 2026", description: "Staff Salaries", category: "Salaries", amount: 60000, type: "expense" },
  { id: "4", date: "Jan 3, 2026", description: "Electricity Bill", category: "Utilities", amount: 25000, type: "expense" },
  { id: "5", date: "Jan 2, 2026", description: "Kitchen Supplies", category: "Supplies", amount: 15000, type: "expense" },
  { id: "6", date: "Jan 2, 2026", description: "Laundry Collection", category: "Laundry", amount: 12000, type: "income" },
  { id: "7", date: "Jan 1, 2026", description: "Maintenance Work", category: "Maintenance", amount: 8000, type: "expense" },
  { id: "8", date: "Dec 30, 2025", description: "Water Supply", category: "Utilities", amount: 5000, type: "expense" },
];

const defaulters: Defaulter[] = [
  { id: "1", name: "Rahim Ahmed", studentId: "202314008", room: "201", dueAmount: 4500, dueDate: "Dec 15, 2025", monthsOverdue: 1, avatar: "/logos/profile.png" },
  { id: "2", name: "Karim Khan", studentId: "202314012", room: "203", dueAmount: 9000, dueDate: "Nov 15, 2025", monthsOverdue: 2, avatar: "/logos/profile.png" },
  { id: "3", name: "Fahim Hasan", studentId: "202314045", room: "204", dueAmount: 3500, dueDate: "Dec 20, 2025", monthsOverdue: 1, avatar: "/logos/profile.png" },
  { id: "4", name: "Anik Roy", studentId: "202314067", room: "302", dueAmount: 13500, dueDate: "Oct 15, 2025", monthsOverdue: 3, avatar: "/logos/profile.png" },
  { id: "5", name: "Tanvir Islam", studentId: "202214023", room: "205", dueAmount: 6000, dueDate: "Dec 1, 2025", monthsOverdue: 1, avatar: "/logos/profile.png" },
];

const monthlyData = [
  { month: "Jul", revenue: 185000, expense: 145000 },
  { month: "Aug", revenue: 192000, expense: 148000 },
  { month: "Sep", revenue: 178000, expense: 155000 },
  { month: "Oct", revenue: 195000, expense: 142000 },
  { month: "Nov", revenue: 188000, expense: 158000 },
  { month: "Dec", revenue: 210000, expense: 165000 },
];

const categoryBreakdown = [
  { name: "Rent", amount: 135000, percentage: 58, color: "#2D6A4F" },
  { name: "Mess/Meals", amount: 85000, percentage: 37, color: "#40E0D0" },
  { name: "Laundry", amount: 12000, percentage: 5, color: "#E91E63" },
];

const expenseBreakdown = [
  { name: "Staff Salaries", amount: 60000, percentage: 45, color: "#FF6B6B" },
  { name: "Utilities", amount: 30000, percentage: 23, color: "#4ECDC4" },
  { name: "Kitchen Supplies", amount: 25000, percentage: 19, color: "#45B7D1" },
  { name: "Maintenance", amount: 18000, percentage: 13, color: "#96CEB4" },
];

export default function FinancialsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("this-month");
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);

  // Calculate totals
  const totalRevenue = 232000;
  const totalExpenses = 133000;
  const netIncome = totalRevenue - totalExpenses;
  const pendingDues = defaulters.reduce((sum, d) => sum + d.dueAmount, 0);
  const collectionRate = 94; // percentage

  const tabs = [
    { id: "overview" as TabType, label: "Overview" },
    { id: "collections" as TabType, label: "Collections" },
    { id: "expenses" as TabType, label: "Expenses" },
    { id: "defaulters" as TabType, label: "Defaulters" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Financial Management</h1>
          <p className="text-gray-500 text-sm">Track revenue, expenses, and pending dues</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export Report
          </button>
          <button 
            onClick={() => setShowAddExpenseModal(true)}
            className="px-4 py-2 bg-[#2D6A4F] text-white rounded-lg text-sm font-medium hover:bg-[#245840] transition-colors flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Add Expense
          </button>
        </div>
      </div>

      {/* Time Range & Tabs */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "bg-[#2D6A4F] text-white"
                  : "bg-white text-gray-600 hover:bg-gray-50"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-white rounded-lg p-1 border border-gray-200">
          {[
            { id: "this-month" as TimeRange, label: "This Month" },
            { id: "last-month" as TimeRange, label: "Last Month" },
            { id: "this-year" as TimeRange, label: "This Year" },
          ].map((range) => (
            <button
              key={range.id}
              onClick={() => setTimeRange(range.id)}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                timeRange === range.id ? "bg-gray-100 text-gray-800" : "text-gray-500"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-gradient-to-br from-[#2D6A4F] to-[#1e4a37] rounded-xl p-5 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 text-sm">Total Revenue</span>
                <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <p className="text-2xl font-bold">৳{totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-white/60 mt-1">+12% from last month</p>
            </div>
            <div className="bg-gradient-to-br from-[#E91E63] to-[#C2185B] rounded-xl p-5 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 text-sm">Total Expenses</span>
                <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
              </div>
              <p className="text-2xl font-bold">৳{totalExpenses.toLocaleString()}</p>
              <p className="text-xs text-white/60 mt-1">+5% from last month</p>
            </div>
            <div className="bg-gradient-to-br from-[#40E0D0] to-[#00BCD4] rounded-xl p-5 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 text-sm">Net Income</span>
                <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <p className="text-2xl font-bold">৳{netIncome.toLocaleString()}</p>
              <p className="text-xs text-white/60 mt-1">Healthy balance</p>
            </div>
            <div className="bg-gradient-to-br from-[#FF6B6B] to-[#ee5a5a] rounded-xl p-5 text-white">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 text-sm">Pending Dues</span>
                <svg className="w-5 h-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-2xl font-bold">৳{pendingDues.toLocaleString()}</p>
              <p className="text-xs text-white/60 mt-1">{defaulters.length} students</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-500 text-sm">Collection Rate</span>
                <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-2xl font-bold text-gray-800">{collectionRate}%</p>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: `${collectionRate}%` }} />
              </div>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue vs Expenses Chart */}
            <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-6">Revenue vs Expenses Trend</h2>
              <div className="h-56 flex items-end justify-between gap-4 px-4">
                {monthlyData.map((data, index) => (
                  <div key={index} className="flex-1 flex flex-col items-center gap-2">
                    <div className="flex gap-1 items-end h-44 w-full justify-center">
                      <div
                        className="w-5 bg-[#2D6A4F] rounded-t transition-all hover:bg-[#245840]"
                        style={{ height: `${(data.revenue / 220000) * 100}%` }}
                        title={`Revenue: ৳${data.revenue.toLocaleString()}`}
                      />
                      <div
                        className="w-5 bg-[#E91E63] rounded-t transition-all hover:bg-[#C2185B]"
                        style={{ height: `${(data.expense / 220000) * 100}%` }}
                        title={`Expense: ৳${data.expense.toLocaleString()}`}
                      />
                    </div>
                    <span className="text-sm text-gray-500">{data.month}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-8 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#2D6A4F] rounded" />
                  <span className="text-sm text-gray-600">Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-[#E91E63] rounded" />
                  <span className="text-sm text-gray-600">Expenses</span>
                </div>
              </div>
            </div>

            {/* Revenue Breakdown */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Revenue Sources</h2>
              <div className="space-y-4">
                {categoryBreakdown.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-700">{item.name}</span>
                      <span className="text-sm font-medium text-gray-800">৳{item.amount.toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5">
                      <div
                        className="h-2.5 rounded-full transition-all"
                        style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                      />
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{item.percentage}% of total</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Transactions */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">Recent Transactions</h2>
                <button 
                  onClick={() => setActiveTab("collections")}
                  className="text-sm text-[#2D6A4F] font-medium hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {transactions.slice(0, 5).map((tx) => (
                  <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        tx.type === "income" ? "bg-green-100" : "bg-red-100"
                      }`}>
                        <svg className={`w-5 h-5 ${tx.type === "income" ? "text-green-600" : "text-red-600"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          {tx.type === "income" ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                          )}
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{tx.description}</p>
                        <p className="text-xs text-gray-500">{tx.date} • {tx.category}</p>
                      </div>
                    </div>
                    <span className={`font-bold ${tx.type === "income" ? "text-green-600" : "text-red-600"}`}>
                      {tx.type === "income" ? "+" : "-"}৳{tx.amount.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Defaulters */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">Top Defaulters</h2>
                <button 
                  onClick={() => setActiveTab("defaulters")}
                  className="text-sm text-[#2D6A4F] font-medium hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {defaulters.slice(0, 4).map((defaulter) => (
                  <div key={defaulter.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Image
                        src={defaulter.avatar}
                        alt={defaulter.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{defaulter.name}</p>
                        <p className="text-xs text-gray-500">Room {defaulter.room} • {defaulter.monthsOverdue} month(s) overdue</p>
                      </div>
                    </div>
                    <span className="font-bold text-red-600">৳{defaulter.dueAmount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {/* Collections Tab */}
      {activeTab === "collections" && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-bold text-gray-800">Income Transactions</h2>
            <div className="flex items-center gap-2">
              <select className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white">
                <option>All Categories</option>
                <option>Rent</option>
                <option>Meals</option>
                <option>Laundry</option>
              </select>
            </div>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Date</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Description</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Category</th>
                <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.filter(t => t.type === "income").map((tx) => (
                <tr key={tx.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-600">{tx.date}</td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-800">{tx.description}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">
                      {tx.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-bold text-green-600">+৳{tx.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Expenses Tab */}
      {activeTab === "expenses" && (
        <div className="space-y-6">
          {/* Expense Breakdown */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Expense Breakdown</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {expenseBreakdown.map((item, index) => (
                <div key={index} className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                  <p className="text-xl font-bold text-gray-800">৳{item.amount.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">{item.percentage}% of total</p>
                </div>
              ))}
            </div>
          </div>

          {/* Expense Transactions */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-800">Expense Transactions</h2>
              <button 
                onClick={() => setShowAddExpenseModal(true)}
                className="px-3 py-1.5 bg-[#2D6A4F] text-white rounded-lg text-sm font-medium hover:bg-[#245840]"
              >
                + Add Expense
              </button>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Date</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Description</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Category</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.filter(t => t.type === "expense").map((tx) => (
                  <tr key={tx.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-600">{tx.date}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">{tx.description}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs font-medium">
                        {tx.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-red-600">-৳{tx.amount.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Defaulters Tab */}
      {activeTab === "defaulters" && (
        <div className="space-y-6">
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <p className="text-gray-500 text-sm mb-1">Total Defaulters</p>
              <p className="text-3xl font-bold text-gray-800">{defaulters.length}</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <p className="text-gray-500 text-sm mb-1">Total Pending Amount</p>
              <p className="text-3xl font-bold text-red-600">৳{pendingDues.toLocaleString()}</p>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm">
              <p className="text-gray-500 text-sm mb-1">Average Overdue Period</p>
              <p className="text-3xl font-bold text-orange-600">1.6 months</p>
            </div>
          </div>

          {/* Defaulters List */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-bold text-gray-800">Defaulter List</h2>
              <button className="px-3 py-1.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50">
                Send Reminders
              </button>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Student</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Student ID</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Room</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Due Since</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Overdue</th>
                  <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">Amount</th>
                  <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {defaulters.map((defaulter) => (
                  <tr key={defaulter.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={defaulter.avatar}
                          alt={defaulter.name}
                          width={36}
                          height={36}
                          className="w-9 h-9 rounded-full"
                        />
                        <span className="text-sm font-medium text-gray-800">{defaulter.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">{defaulter.studentId}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{defaulter.room}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{defaulter.dueDate}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        defaulter.monthsOverdue >= 3 ? "bg-red-100 text-red-700" :
                        defaulter.monthsOverdue >= 2 ? "bg-orange-100 text-orange-700" :
                        "bg-yellow-100 text-yellow-700"
                      }`}>
                        {defaulter.monthsOverdue} month(s)
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-red-600">৳{defaulter.dueAmount.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <button className="text-[#2D6A4F] hover:underline text-sm font-medium">
                        Send Reminder
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Add New Expense</h2>
              <button 
                onClick={() => setShowAddExpenseModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  placeholder="Enter expense description"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none bg-white">
                  <option value="">Select category</option>
                  <option value="salaries">Staff Salaries</option>
                  <option value="utilities">Utilities</option>
                  <option value="supplies">Kitchen Supplies</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (৳)</label>
                <input
                  type="number"
                  placeholder="Enter amount"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-[#2D6A4F] text-white rounded-lg font-medium hover:bg-[#245840] transition-colors"
                >
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
