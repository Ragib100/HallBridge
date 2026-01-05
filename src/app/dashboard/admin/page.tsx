"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

// New students joined this month
const newStudentsThisMonth = [
  { id: "1", name: "Rahim Ahmed", studentId: "202514001", department: "CSE", joinedDate: "Jan 2, 2026", avatar: "/logos/profile.png" },
  { id: "2", name: "Karim Khan", studentId: "202514002", department: "EEE", joinedDate: "Jan 3, 2026", avatar: "/logos/profile.png" },
  { id: "3", name: "Fahim Hasan", studentId: "202514003", department: "ME", joinedDate: "Jan 3, 2026", avatar: "/logos/profile.png" },
  { id: "4", name: "Anik Roy", studentId: "202514004", department: "CSE", joinedDate: "Jan 4, 2026", avatar: "/logos/profile.png" },
  { id: "5", name: "Tanvir Islam", studentId: "202514005", department: "CE", joinedDate: "Jan 4, 2026", avatar: "/logos/profile.png" },
  { id: "6", name: "Sakib Hassan", studentId: "202514006", department: "EEE", joinedDate: "Jan 5, 2026", avatar: "/logos/profile.png" },
  { id: "7", name: "Imran Ahmed", studentId: "202514007", department: "ME", joinedDate: "Jan 5, 2026", avatar: "/logos/profile.png" },
  { id: "8", name: "Rafiq Uddin", studentId: "202514008", department: "CSE", joinedDate: "Jan 5, 2026", avatar: "/logos/profile.png" },
  { id: "9", name: "Jamil Hossain", studentId: "202514009", department: "EEE", joinedDate: "Jan 5, 2026", avatar: "/logos/profile.png" },
  { id: "10", name: "Nasir Ahmed", studentId: "202514010", department: "CE", joinedDate: "Jan 5, 2026", avatar: "/logos/profile.png" },
  { id: "11", name: "Saiful Islam", studentId: "202514011", department: "ME", joinedDate: "Jan 5, 2026", avatar: "/logos/profile.png" },
  { id: "12", name: "Habib Rahman", studentId: "202514012", department: "CSE", joinedDate: "Jan 5, 2026", avatar: "/logos/profile.png" },
];

// Students currently outside
const studentsOutside = [
  { id: "1", name: "David Johnson", room: "201", leftAt: "Jan 4, 9:00 AM", expectedReturn: "Jan 5, 6:00 PM", status: "on-time", reason: "Home Visit" },
  { id: "2", name: "Michael Charter", room: "202", leftAt: "Jan 3, 2:00 PM", expectedReturn: "Jan 5, 10:00 AM", status: "late", reason: "Medical", avatar: "/logos/profile.png" },
  { id: "3", name: "Mark Wilson", room: "203", leftAt: "Jan 4, 8:00 AM", expectedReturn: "Jan 4, 8:00 PM", status: "late", reason: "Academic Trip", avatar: "/logos/profile.png" },
  { id: "4", name: "Ethan Lowe", room: "204", leftAt: "Jan 5, 7:00 AM", expectedReturn: "Jan 5, 9:00 PM", status: "on-time", reason: "Personal", avatar: "/logos/profile.png" },
  { id: "5", name: "James Brown", room: "205", leftAt: "Jan 2, 10:00 AM", expectedReturn: "Jan 4, 6:00 PM", status: "late", reason: "Family Event", avatar: "/logos/profile.png" },
  { id: "6", name: "Robert Smith", room: "206", leftAt: "Jan 3, 3:00 PM", expectedReturn: "Jan 4, 9:00 PM", status: "late", reason: "Home Visit", avatar: "/logos/profile.png" },
  { id: "7", name: "Alex Turner", room: "301", leftAt: "Jan 5, 8:00 AM", expectedReturn: "Jan 5, 8:00 PM", status: "on-time", reason: "Shopping", avatar: "/logos/profile.png" },
];

// Pending items that admin can handle
const pendingItems = [
  { type: "New Registrations", count: 4, urgent: 2, link: "/dashboard/admin/users" },
  { type: "Room Allocation", count: 8, urgent: 3, link: "/dashboard/admin/rooms" },
  { type: "Payment Approvals", count: 5, urgent: 0, link: "/dashboard/admin/financials" },
];

// Recent activities - admin relevant
const recentActivities = [
  { action: "New student registered", name: "Rahim Ahmed", time: "5 min ago", type: "registration" },
  { action: "Room allocated", name: "Room 302 → Karim Khan", time: "15 min ago", type: "room" },
  { action: "Staff account created", name: "Abdul Karim", time: "1 hour ago", type: "staff" },
  { action: "Fee payment received", name: "Fahim Hasan - ৳4,500", time: "2 hours ago", type: "payment" },
  { action: "Student archived", name: "Tanvir Islam (Graduated)", time: "3 hours ago", type: "archive" },
];

// Alerts - admin level only
const alerts = [
  { message: "4 new registration requests pending", priority: "high", time: "New", link: "/dashboard/admin/users" },
  { message: "Monthly report due tomorrow", priority: "medium", time: "1 day left", link: "/dashboard/admin/financials" },
  { message: "5 students have late returns", priority: "high", time: "Now", link: "#" },
  { message: "Staff salary pending for this month", priority: "medium", time: "Due in 5 days", link: "/dashboard/admin/financials" },
];

// Tomorrow's meal count (read-only for admin)
const mealStats = {
  breakfast: 385,
  lunch: 420,
  dinner: 410,
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
    case "room":
      return <div className="w-2 h-2 rounded-full bg-blue-500" />;
    case "staff":
      return <div className="w-2 h-2 rounded-full bg-purple-500" />;
    case "payment":
      return <div className="w-2 h-2 rounded-full bg-emerald-500" />;
    case "archive":
      return <div className="w-2 h-2 rounded-full bg-gray-500" />;
    default:
      return <div className="w-2 h-2 rounded-full bg-gray-500" />;
  }
}

export default function AdminOverviewPage() {
  const [selectedPeriod, setSelectedPeriod] = useState("today");
  const [showNewStudentsModal, setShowNewStudentsModal] = useState(false);
  const [showOutsideStudentsModal, setShowOutsideStudentsModal] = useState(false);
  
  const lateReturnCount = studentsOutside.filter(s => s.status === "late").length;
  const outsideCount = studentsOutside.length;

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Students Card */}
        <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <StatsIcon icon="users" className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-gray-500 text-sm">Total Students</p>
              <p className="text-2xl font-bold text-gray-800">450</p>
              <button 
                onClick={() => setShowNewStudentsModal(true)}
                className="text-xs text-green-500 hover:text-green-700 hover:underline cursor-pointer"
              >
                +12 this month →
              </button>
            </div>
          </div>
        </div>

        {/* Occupied Rooms Card */}
        <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <StatsIcon icon="room" className="w-6 h-6 text-green-600" />
            </div>
            <div className="flex-1">
              <p className="text-gray-500 text-sm">Occupied Rooms</p>
              <p className="text-2xl font-bold text-gray-800">112/120</p>
              <p className="text-xs text-gray-500">93% occupancy</p>
            </div>
          </div>
        </div>

        {/* Currently Outside Card */}
        <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <StatsIcon icon="location" className="w-6 h-6 text-red-500" />
            </div>
            <div className="flex-1">
              <p className="text-gray-500 text-sm">Currently Outside</p>
              <p className="text-2xl font-bold text-gray-800">{outsideCount}</p>
              <button 
                onClick={() => setShowOutsideStudentsModal(true)}
                className="text-xs text-orange-500 hover:text-orange-700 hover:underline cursor-pointer"
              >
                {lateReturnCount} late returns →
              </button>
            </div>
          </div>
        </div>

        {/* Pending Requests Card */}
        <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <StatsIcon icon="clock" className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="text-gray-500 text-sm">Pending Requests</p>
              <p className="text-2xl font-bold text-gray-800">17</p>
              <p className="text-xs text-orange-500">Needs attention</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pending Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Pending Actions</h2>
            <span className="text-xs text-gray-500">Admin tasks</span>
          </div>
          <div className="space-y-3">
            {pendingItems.map((item, index) => (
              <Link 
                key={index} 
                href={item.link}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
              >
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
              </Link>
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
              <Link 
                key={index} 
                href={alert.link}
                className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className={`px-2 py-0.5 rounded text-xs font-medium ${getPriorityColor(alert.priority)}`}>
                  {alert.priority}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-700">{alert.message}</p>
                  <p className="text-xs text-gray-400 mt-1">{alert.time}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tomorrow's Meal Count - Read Only for Admin */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Tomorrow&apos;s Meals</h2>
            <span className="text-xs text-gray-500">Managed by Mess Staff</span>
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
          <p className="text-xs text-gray-400 text-center mt-4">Auto-updated at 11 PM</p>
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

      {/* New Students This Month Modal */}
      {showNewStudentsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">New Students This Month</h2>
                <p className="text-sm text-gray-500">January 2026 - {newStudentsThisMonth.length} new students</p>
              </div>
              <button 
                onClick={() => setShowNewStudentsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto max-h-[60vh]">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Student</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">ID</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Department</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Joined</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {newStudentsThisMonth.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <Image
                            src={student.avatar}
                            alt={student.name}
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <span className="text-sm font-medium text-gray-800">{student.name}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600 font-mono">{student.studentId}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                          {student.department}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{student.joinedDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowNewStudentsModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Students Outside Modal */}
      {showOutsideStudentsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-3xl shadow-xl max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Students Currently Outside</h2>
                <p className="text-sm text-gray-500">{outsideCount} outside, <span className="text-red-500 font-medium">{lateReturnCount} late returns</span></p>
              </div>
              <button 
                onClick={() => setShowOutsideStudentsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="overflow-y-auto max-h-[60vh]">
              <table className="w-full">
                <thead className="bg-gray-50 sticky top-0">
                  <tr>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Student</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Room</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Left At</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Expected Return</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Reason</th>
                    <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {studentsOutside.map((student) => (
                    <tr key={student.id} className={`hover:bg-gray-50 ${student.status === "late" ? "bg-red-50" : ""}`}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-800">{student.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{student.room}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{student.leftAt}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{student.expectedReturn}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{student.reason}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          student.status === "late" 
                            ? "bg-red-100 text-red-700" 
                            : "bg-green-100 text-green-700"
                        }`}>
                          {student.status === "late" ? "Late Return" : "On Time"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowOutsideStudentsModal(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
