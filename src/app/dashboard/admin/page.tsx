"use client";

import { useState } from "react";
import Link from "next/link";

// Stats data
const statsData = [
  { 
    title: "Total Students", 
    value: "450", 
    change: "+12 this month", 
    changeType: "positive",
    icon: "users",
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600"
  },
  { 
    title: "Occupied Rooms", 
    value: "112/120", 
    change: "93% occupancy", 
    changeType: "neutral",
    icon: "room",
    bgColor: "bg-green-100",
    iconColor: "text-green-600"
  },
  { 
    title: "Currently Outside", 
    value: "42", 
    change: "5 late returns", 
    changeType: "warning",
    icon: "location",
    bgColor: "bg-red-100",
    iconColor: "text-red-500"
  },
  { 
    title: "Pending Requests", 
    value: "18", 
    change: "Needs attention", 
    changeType: "warning",
    icon: "clock",
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-600"
  },
];

// Pending items
const pendingItems = [
  { type: "Gate Pass", count: 5, urgent: 2 },
  { type: "Room Allocation", count: 8, urgent: 0 },
  { type: "Maintenance", count: 3, urgent: 1 },
  { type: "New Registrations", count: 2, urgent: 2 },
];

// Recent activities
const recentActivities = [
  { action: "New student registered", name: "Rahim Ahmed", time: "5 min ago", type: "registration" },
  { action: "Gate pass approved", name: "Karim Khan", time: "15 min ago", type: "gatepass" },
  { action: "Maintenance completed", name: "Room 302", time: "1 hour ago", type: "maintenance" },
  { action: "Fee payment received", name: "Fahim Hasan", time: "2 hours ago", type: "payment" },
  { action: "Late entry recorded", name: "Anik Roy", time: "3 hours ago", type: "alert" },
];

// Alerts
const alerts = [
  { message: "Room 302 - AC not working", priority: "high", time: "10 min ago" },
  { message: "Water supply issue - 3rd Floor", priority: "high", time: "30 min ago" },
  { message: "Guest meal request pending", priority: "medium", time: "1 hour ago" },
  { message: "Monthly report due tomorrow", priority: "low", time: "2 hours ago" },
];

// Tomorrow's meal count
const mealStats = {
  breakfast: 385,
  lunch: 420,
  dinner: 410,
  guestMeals: 8,
};

function StatsIcon({ icon, className }: { icon: string; className?: string }) {
  switch (icon) {
    case "users":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    case "room":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      );
    case "location":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case "clock":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    default:
      return null;
  }
}

function getPriorityColor(priority: string) {
  switch (priority) {
    case "high": return "text-red-500 bg-red-50";
    case "medium": return "text-yellow-600 bg-yellow-50";
    case "low": return "text-blue-500 bg-blue-50";
    default: return "text-gray-500 bg-gray-50";
  }
}

function getActivityIcon(type: string) {
  switch (type) {
    case "registration":
      return <div className="w-2 h-2 rounded-full bg-green-500" />;
    case "gatepass":
      return <div className="w-2 h-2 rounded-full bg-blue-500" />;
    case "maintenance":
      return <div className="w-2 h-2 rounded-full bg-orange-500" />;
    case "payment":
      return <div className="w-2 h-2 rounded-full bg-emerald-500" />;
    case "alert":
      return <div className="w-2 h-2 rounded-full bg-red-500" />;
    default:
      return <div className="w-2 h-2 rounded-full bg-gray-500" />;
  }
}

export default function AdminOverviewPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("today");

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 ${stat.bgColor} rounded-xl flex items-center justify-center`}>
                <StatsIcon icon={stat.icon} className={`w-6 h-6 ${stat.iconColor}`} />
              </div>
              <div className="flex-1">
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <p className={`text-xs ${
                  stat.changeType === "positive" ? "text-green-500" : 
                  stat.changeType === "warning" ? "text-orange-500" : "text-gray-500"
                }`}>
                  {stat.change}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Pending Actions</h2>
            <span className="text-xs text-gray-500">Requires attention</span>
          </div>
          <div className="space-y-3">
            {pendingItems.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-700">{item.type}</span>
                  {item.urgent > 0 && (
                    <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
                      {item.urgent} urgent
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-800">{item.count}</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>
          <Link href="/dashboard/admin/users" className="block mt-4 text-center text-sm text-[#2D6A4F] font-medium hover:underline">
            View All Pending
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Recent Activity</h2>
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="text-xs border border-gray-200 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#2D6A4F]"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
          <div className="space-y-3">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="mt-1.5">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">{activity.action}</p>
                  <p className="text-xs text-gray-500 font-medium">{activity.name}</p>
                </div>
                <span className="text-xs text-gray-400 whitespace-nowrap">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts & Notifications */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Alerts</h2>
            <span className="w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
              {alerts.filter(a => a.priority === "high").length}
            </span>
          </div>
          <div className="space-y-3">
            {alerts.map((alert, index) => (
              <div key={index} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50">
                <div className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(alert.priority)}`}>
                  {alert.priority}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{alert.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tomorrow's Meal Count */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Tomorrow&apos;s Meals</h2>
            <span className="text-xs text-gray-500">Auto-updated at 11 PM</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-amber-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-amber-700">{mealStats.breakfast}</p>
              <p className="text-xs text-amber-600">Breakfast</p>
            </div>
            <div className="bg-orange-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-orange-700">{mealStats.lunch}</p>
              <p className="text-xs text-orange-600">Lunch</p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-indigo-700">{mealStats.dinner}</p>
              <p className="text-xs text-indigo-600">Dinner</p>
            </div>
          </div>
          <div className="mt-4 p-3 bg-green-50 rounded-lg flex items-center justify-between">
            <span className="text-sm text-green-700">Guest Meals Requested</span>
            <span className="font-bold text-green-800">+{mealStats.guestMeals}</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/dashboard/admin/users" className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-xl hover:bg-[#2D6A4F] hover:text-white hover:border-[#2D6A4F] transition-all group">
              <svg className="w-6 h-6 text-[#2D6A4F] group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-medium text-center">Approve Students</span>
            </Link>
            <Link href="/dashboard/admin/rooms" className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-xl hover:bg-[#2D6A4F] hover:text-white hover:border-[#2D6A4F] transition-all group">
              <svg className="w-6 h-6 text-[#2D6A4F] group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <span className="text-sm font-medium text-center">Allocate Rooms</span>
            </Link>
            <Link href="/dashboard/admin/financials" className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-xl hover:bg-[#2D6A4F] hover:text-white hover:border-[#2D6A4F] transition-all group">
              <svg className="w-6 h-6 text-[#2D6A4F] group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span className="text-sm font-medium text-center">View Reports</span>
            </Link>
            <Link href="/dashboard/admin/settings" className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-xl hover:bg-[#2D6A4F] hover:text-white hover:border-[#2D6A4F] transition-all group">
              <svg className="w-6 h-6 text-[#2D6A4F] group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              <span className="text-sm font-medium text-center">Settings</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-gray-800">Monthly Financial Overview</h2>
          <Link href="/dashboard/admin/financials" className="text-sm text-[#2D6A4F] font-medium hover:underline">
            View Details →
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-[#2D6A4F] rounded-xl p-4 text-white">
            <p className="text-2xl font-bold">৳1,85,200</p>
            <p className="text-sm opacity-80">Total Collection</p>
          </div>
          <div className="bg-[#E91E63] rounded-xl p-4 text-white">
            <p className="text-2xl font-bold">৳1,24,500</p>
            <p className="text-sm opacity-80">Total Expenses</p>
          </div>
          <div className="bg-[#40E0D0] rounded-xl p-4 text-white">
            <p className="text-2xl font-bold">৳60,700</p>
            <p className="text-sm opacity-80">Net Balance</p>
          </div>
          <div className="bg-[#FF6B6B] rounded-xl p-4 text-white">
            <p className="text-2xl font-bold">৳45,000</p>
            <p className="text-sm opacity-80">Pending Dues</p>
          </div>
        </div>

        {/* Simple Bar Chart */}
        <div className="h-48 flex items-end justify-between gap-2 px-2 border-b border-gray-100 pb-2">
          {[
            { month: "Jul", revenue: 75, expense: 60 },
            { month: "Aug", revenue: 82, expense: 70 },
            { month: "Sep", revenue: 90, expense: 65 },
            { month: "Oct", revenue: 78, expense: 72 },
            { month: "Nov", revenue: 85, expense: 68 },
            { month: "Dec", revenue: 95, expense: 75 },
          ].map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-1">
              <div className="flex gap-1 items-end h-36 w-full justify-center">
                <div
                  className="w-3 bg-[#2D6A4F] rounded-t transition-all"
                  style={{ height: `${data.revenue}%` }}
                  title={`Revenue: ${data.revenue}%`}
                />
                <div
                  className="w-3 bg-[#E91E63] rounded-t transition-all"
                  style={{ height: `${data.expense}%` }}
                  title={`Expense: ${data.expense}%`}
                />
              </div>
              <span className="text-xs text-gray-500">{data.month}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-center gap-6 mt-4">
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
    </div>
  );
}
