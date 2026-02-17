"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MaintenanceRequest {
  id: string;
  requestId: string;
  student: { fullName: string; email: string };
  category: string;
  priority: string;
  location: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "cancelled";
  assignedTo?: { fullName: string; email: string };
  createdAt: string;
  completedAt?: string;
  reviewed: boolean;
  rating?: number;
  feedback?: string;
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

const priorityLabels: Record<string, { label: string; color: string }> = {
  urgent: { label: "Urgent", color: "bg-red-100 text-red-700" },
  high: { label: "High", color: "bg-orange-100 text-orange-700" },
  normal: { label: "Normal", color: "bg-blue-100 text-blue-700" },
  low: { label: "Low", color: "bg-gray-100 text-gray-700" },
};

const statusConfig: Record<string, { label: string; color: string }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700" },
  "in-progress": { label: "In Progress", color: "bg-blue-100 text-blue-700" },
  completed: { label: "Completed", color: "bg-green-100 text-green-700" },
  cancelled: { label: "Cancelled", color: "bg-gray-100 text-gray-700" },
};

export default function AdminMaintenancePage() {
  const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"all" | "pending" | "in-progress" | "completed">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRequest, setSelectedRequest] = useState<MaintenanceRequest | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/common/maintenance");
      const data = await response.json();

      if (response.ok) {
        setRequests(data.requests || []);
      }
    } catch (error) {
      console.error("Failed to fetch requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    total: requests.length,
    pending: requests.filter((r) => r.status === "pending").length,
    inProgress: requests.filter((r) => r.status === "in-progress").length,
    completed: requests.filter((r) => r.status === "completed").length,
    urgent: requests.filter((r) => r.priority === "urgent" && r.status !== "completed").length,
  };

  const filteredRequests = requests
    .filter((r) => activeTab === "all" || r.status === activeTab)
    .filter(
      (r) =>
        r.requestId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-100">
        <div className="text-gray-500">Loading maintenance requests...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Maintenance Complaints</h1>
          <p className="text-gray-500 text-sm mt-1">
            View and manage all student maintenance requests
          </p>
        </div>
        <Link
          href="/dashboard/admin"
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-200 rounded-lg hover:bg-gray-50"
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
          <p className="text-gray-500 text-sm">Total Requests</p>
          <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-yellow-100">
          <p className="text-yellow-600 text-sm">Pending</p>
          <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100">
          <p className="text-blue-600 text-sm whitespace-nowrap">In Progress</p>
          <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
          <p className="text-green-600 text-sm">Completed</p>
          <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border border-red-100">
          <p className="text-red-600 text-sm">Urgent</p>
          <p className="text-2xl font-bold text-red-600">{stats.urgent}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          {/* Tabs */}
          <div className="flex gap-2">
            {(["all", "pending", "in-progress", "completed"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  activeTab === tab
                    ? "bg-[#2D6A4F] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab === "all" ? "All" : tab === "in-progress" ? "In Progress" : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search requests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredRequests.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-gray-600">No maintenance requests found</p>
            {activeTab !== "all" && (
              <p className="text-sm text-gray-500 mt-1">
                Try selecting a different status filter
              </p>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    Request ID
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    Student
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    Category
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    Location
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    Priority
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    Status
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    Submitted
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    Assigned To
                  </th>
                  <th className="text-left py-3 px-4 text-sm font-semibold text-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <span className="font-medium text-gray-800">{request.requestId}</span>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {request.student.fullName}
                        </p>
                        <p className="text-xs text-gray-500">{request.student.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600">
                        {categoryLabels[request.category] || request.category}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600">{request.location}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          priorityLabels[request.priority]?.color || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {priorityLabels[request.priority]?.label || request.priority}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                          statusConfig[request.status]?.color || "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {statusConfig[request.status]?.label || request.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-500">{formatDate(request.createdAt)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-sm text-gray-600">
                        {request.assignedTo?.fullName || "-"}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="px-3 py-1.5 rounded-md border border-[#2D6A4F]
                                  text-[#2D6A4F] text-sm font-medium
                                  hover:bg-[#2D6A4F] hover:text-white
                                  transition-colors duration-200"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Request Details Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={(open) => !open && setSelectedRequest(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Maintenance Request Details
              {/* <span className="text-sm font-normal text-gray-500">#{selectedRequest?.requestId}</span> */}
            </DialogTitle>
            <DialogDescription>
              View complete details and student feedback
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-6 mt-4">
              {/* Basic Info */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Student</label>
                  <p className="text-sm font-medium text-gray-800 mt-1">{selectedRequest.student.fullName}</p>
                  <p className="text-xs text-gray-500">{selectedRequest.student.email}</p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Category</label>
                  <p className="text-sm text-gray-800 mt-1">
                    {categoryLabels[selectedRequest.category] || selectedRequest.category}
                  </p>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Location</label>
                  <p className="text-sm text-gray-800 mt-1">{selectedRequest.location}</p>
                </div>
                <div className="grid grid-cols-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Priority</label>
                    <span
                    className={`inline-block w-fit px-2 py-1 rounded-full text-xs font-medium mt-1 ${
                      priorityLabels[selectedRequest.priority]?.color || "bg-gray-100 text-gray-700"
                    }`}
                    >
                    {priorityLabels[selectedRequest.priority]?.label || selectedRequest.priority}
                    </span>
                </div>
                <div className="grid grid-cols-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase">Status</label>
                  <span
                    className={`inline-block w-fit px-2 py-1 rounded-full text-xs font-medium mt-1 whitespace-nowrap ${
                      statusConfig[selectedRequest.status]?.color || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {statusConfig[selectedRequest.status]?.label || selectedRequest.status}
                  </span>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Assigned To</label>
                  <p className="text-sm text-gray-800 mt-1">
                    {selectedRequest.assignedTo?.fullName || "Not assigned"}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase">Description</label>
                <p className="text-sm text-gray-700 mt-2 bg-gray-50 rounded-lg">
                  {selectedRequest.description}
                </p>
              </div>

              {/* Timestamps */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase">Submitted</label>
                  <p className="text-sm text-gray-700 mt-1">{formatDate(selectedRequest.createdAt)}</p>
                </div>
                {selectedRequest.completedAt && (
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase">Completed</label>
                    <p className="text-sm text-gray-700 mt-1">{formatDate(selectedRequest.completedAt)}</p>
                  </div>
                )}
              </div>

              {/* Student Feedback Section - Only for completed requests */}
              {selectedRequest.status === "completed" && (
                <div className="pt-4 border-t border-gray-200">
                  <label className="text-xs font-semibold text-gray-500 uppercase block mb-3">
                    Student Feedback
                  </label>
                  {selectedRequest.reviewed ? (
                    <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-sm font-medium text-gray-700">Rating:</span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`w-6 h-6 ${
                                selectedRequest.rating && star <= selectedRequest.rating
                                  ? "text-yellow-400 fill-current"
                                  : "text-gray-300"
                              }`}
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                          <span className="ml-2 text-base font-bold text-gray-800">
                            {selectedRequest.rating}/5
                          </span>
                        </div>
                      </div>
                      {selectedRequest.feedback && (
                        <div className="mt-3">
                          <span className="text-sm font-medium text-gray-700 block mb-1">Comments:</span>
                          <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-200">
                            {selectedRequest.feedback}
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                      <p className="text-sm text-yellow-700 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Awaiting student feedback
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
