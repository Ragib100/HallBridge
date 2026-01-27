"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

interface Stats {
  students: {
    total: number;
    newThisMonth: number;
    pendingRegistrations: number;
  };
  staff: {
    total: number;
    byRole: Record<string, number>;
  };
  maintenance: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    urgent: number;
  };
}

interface RecentStudent {
  id: string;
  fullName: string;
  email: string;
  joinedDate: string;
}

interface RecentMaintenance {
  id: string;
  requestId: string;
  student: { fullName: string };
  category: string;
  priority: string;
  status: string;
  createdAt: string;
}

function StatsIcon({ icon, className }: { icon: string; className?: string }) {
  switch (icon) {
    case "users":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    case "staff":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    case "maintenance":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case "alert":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    default:
      return null;
  }
}

const categoryLabels: Record<string, string> = {
  electrical: "Electrical",
  plumbing: "Plumbing",
  furniture: "Furniture",
  "ac-heating": "AC/Heating",
  "doors-windows": "Doors & Windows",
  internet: "Internet/Wi-Fi",
  other: "Other",
};

const priorityColors: Record<string, string> = {
  urgent: "bg-red-100 text-red-700",
  high: "bg-orange-100 text-orange-700",
  normal: "bg-blue-100 text-blue-700",
  low: "bg-gray-100 text-gray-700",
};

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-700",
  "in-progress": "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
};

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentStudents, setRecentStudents] = useState<RecentStudent[]>([]);
  const [recentMaintenance, setRecentMaintenance] = useState<RecentMaintenance[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewStudentsModal, setShowNewStudentsModal] = useState(false);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await fetch("/api/admin/stats");
      const data = await response.json();

      if (response.ok) {
        setStats(data.stats);
        setRecentStudents(data.recentStudents || []);
        setRecentMaintenance(data.recentMaintenance || []);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading dashboard...</div>
      </div>
    );
  }

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
              <p className="text-2xl font-bold text-gray-800">{stats?.students.total || 0}</p>
              {(stats?.students.newThisMonth || 0) > 0 && (
                <button
                  onClick={() => setShowNewStudentsModal(true)}
                  className="text-xs text-green-500 hover:text-green-700 hover:underline cursor-pointer"
                >
                  +{stats?.students.newThisMonth} this month →
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Total Staff Card */}
        <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <StatsIcon icon="staff" className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <p className="text-gray-500 text-sm">Total Staff</p>
              <p className="text-2xl font-bold text-gray-800">{stats?.staff.total || 0}</p>
              <Link href="/dashboard/admin/users" className="text-xs text-purple-500 hover:underline">
                Manage staff →
              </Link>
            </div>
          </div>
        </div>

        {/* Pending Maintenance Card */}
        <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
              <StatsIcon icon="maintenance" className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="flex-1">
              <p className="text-gray-500 text-sm">Pending Complaints</p>
              <p className="text-2xl font-bold text-gray-800">{stats?.maintenance.pending || 0}</p>
              <Link href="/dashboard/admin/maintenance" className="text-xs text-yellow-600 hover:underline">
                View all →
              </Link>
            </div>
          </div>
        </div>

        {/* Urgent Issues Card */}
        <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
              <StatsIcon icon="alert" className="w-6 h-6 text-red-600" />
            </div>
            <div className="flex-1">
              <p className="text-gray-500 text-sm">Urgent Issues</p>
              <p className="text-2xl font-bold text-gray-800">{stats?.maintenance.urgent || 0}</p>
              {(stats?.maintenance.urgent || 0) > 0 && (
                <p className="text-xs text-red-500">Needs immediate attention</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <Link
              href="/dashboard/admin/users"
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Pending Registrations</span>
                {(stats?.students.pendingRegistrations || 0) > 0 && (
                  <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
                    {stats?.students.pendingRegistrations} new
                  </span>
                )}
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/dashboard/admin/maintenance"
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">Maintenance Complaints</span>
                {(stats?.maintenance.pending || 0) > 0 && (
                  <span className="px-2 py-0.5 bg-yellow-100 text-yellow-600 text-xs rounded-full">
                    {stats?.maintenance.pending} pending
                  </span>
                )}
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/dashboard/admin/users"
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm font-medium text-gray-700">Manage Users</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
            <Link
              href="/dashboard/admin/settings"
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="text-sm font-medium text-gray-700">Settings</span>
              <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Recent Maintenance Complaints */}
        <div className="bg-white rounded-xl p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Recent Maintenance Complaints</h2>
            <Link href="/dashboard/admin/maintenance" className="text-sm text-[#2D6A4F] hover:underline">
              View all
            </Link>
          </div>
          {recentMaintenance.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No maintenance complaints yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentMaintenance.map((request) => (
                <div key={request.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-800">{request.requestId}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${priorityColors[request.priority] || "bg-gray-100 text-gray-700"}`}>
                        {request.priority}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusColors[request.status] || "bg-gray-100 text-gray-700"}`}>
                        {request.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">
                      {categoryLabels[request.category] || request.category} - by {request.student?.fullName || "Unknown"}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">{getTimeAgo(request.createdAt)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Maintenance Stats */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Maintenance Overview</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg text-center">
            <p className="text-2xl font-bold text-gray-800">{stats?.maintenance.total || 0}</p>
            <p className="text-sm text-gray-500">Total Requests</p>
          </div>
          <div className="p-4 bg-yellow-50 rounded-lg text-center">
            <p className="text-2xl font-bold text-yellow-600">{stats?.maintenance.pending || 0}</p>
            <p className="text-sm text-yellow-600">Pending</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-lg text-center">
            <p className="text-2xl font-bold text-blue-600">{stats?.maintenance.inProgress || 0}</p>
            <p className="text-sm text-blue-600">In Progress</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-600">{stats?.maintenance.completed || 0}</p>
            <p className="text-sm text-green-600">Completed</p>
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
                <p className="text-sm text-gray-500">{recentStudents.length} new students</p>
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
            {recentStudents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <p>No new students this month</p>
              </div>
            ) : (
              <div className="overflow-y-auto max-h-[60vh]">
                <table className="w-full">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Student</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Email</th>
                      <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {recentStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <Image
                              src="/logos/profile.png"
                              alt={student.fullName}
                              width={32}
                              height={32}
                              className="w-8 h-8 rounded-full object-cover"
                            />
                            <span className="text-sm font-medium text-gray-800">{student.fullName}</span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{student.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-500">{formatDate(student.joinedDate)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
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
    </div>
  );
}
