"use client";

import { useState } from "react";
import Image from "next/image";

type TabType = "pending" | "active" | "staff" | "archived";

interface Student {
  id: string;
  name: string;
  email: string;
  studentId: string;
  department: string;
  pendingSince: string;
  avatar: string;
}

const pendingStudents: Student[] = [
  { id: "1", name: "David Johnson", email: "david@example.com", studentId: "202314008", department: "CSE", pendingSince: "Dec 10, 2025", avatar: "/logos/profile.png" },
  { id: "2", name: "David Johnson", email: "david@example.com", studentId: "202314008", department: "CSE", pendingSince: "Dec 10, 2025", avatar: "/logos/profile.png" },
  { id: "3", name: "David Johnson", email: "david@example.com", studentId: "202314008", department: "CSE", pendingSince: "Dec 10, 2025", avatar: "/logos/profile.png" },
];

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");

  const tabs = [
    { id: "pending" as TabType, label: "Pending Approvals" },
    { id: "active" as TabType, label: "Active Students" },
    { id: "staff" as TabType, label: "Staff Accounts" },
    { id: "archived" as TabType, label: "Archived" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <h1 className="text-2xl font-bold text-gray-800">User Management</h1>

      {/* Tabs and Actions */}
      <div className="flex items-center justify-between">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? "text-[#2D6A4F] border-b-2 border-[#2D6A4F]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
          >
            <option value="all">All Years</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
            <option value="2023">2023</option>
          </select>
          <button className="px-4 py-2 bg-[#2D6A4F] text-white rounded-lg text-sm font-medium hover:bg-[#245840] transition-colors">
            Add Staff
          </button>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search Pending Students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button className="p-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
          <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Name</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Email</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Student ID</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Department</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Pending Since</th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {pendingStudents.map((student) => (
              <tr key={student.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Image
                      src={student.avatar}
                      alt={student.name}
                      width={36}
                      height={36}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-gray-800">{student.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600">{student.email}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{student.studentId}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{student.department}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{student.pendingSince}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="px-4 py-1.5 bg-[#2D6A4F] text-white text-sm rounded-md hover:bg-[#245840] transition-colors">
                      Approve
                    </button>
                    <button className="px-4 py-1.5 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors">
                      Reject
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
