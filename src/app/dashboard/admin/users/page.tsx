"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { STAFF_ROLE_LABELS, type StaffRole } from "@/types";

type TabType = "pending" | "active" | "staff";

interface Student {
  id: string;
  name: string;
  email: string;
  status: string;
  avatar: string;
  pendingSince?: string;
  joinedDate?: string;
  archivedDate?: string;
}

interface Staff {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  phone: string;
  status: "active" | "inactive";
  avatar: string;
  joinedDate: string;
}

interface StaffFormData {
  fullName: string;
  email: string;
  password: string;
  staffRole: StaffRole | "";
  phone: string;
}

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState<TabType>("active");
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showStudentDetailsModal, setShowStudentDetailsModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  
  // Data from database
  const [activeStudents, setActiveStudents] = useState<Student[]>([]);
  const [pendingStudents, setPendingStudents] = useState<Student[]>([]);
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [staffFormData, setStaffFormData] = useState<StaffFormData>({
    fullName: "",
    email: "",
    password: "",
    staffRole: "",
    phone: "",
  });

  // Fetch data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Fetch active students
      const activeRes = await fetch("/api/admin/users?type=student&status=active");
      const activeData = await activeRes.json();
      if (activeRes.ok) {
        setActiveStudents((activeData.users || []).map((u: { id: string; fullName: string; email: string; createdAt: string }) => ({
          id: u.id,
          name: u.fullName,
          email: u.email,
          status: "active",
          avatar: "/logos/profile.png",
          joinedDate: new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        })));
      }

      // Fetch pending students
      const pendingRes = await fetch("/api/admin/users?type=student&status=pending");
      const pendingData = await pendingRes.json();
      if (pendingRes.ok) {
        setPendingStudents((pendingData.users || []).map((u: { id: string; fullName: string; email: string; createdAt: string }) => ({
          id: u.id,
          name: u.fullName,
          email: u.email,
          status: "pending",
          avatar: "/logos/profile.png",
          pendingSince: new Date(u.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        })));
      }

      // Fetch staff
      const staffRes = await fetch("/api/admin/staff");
      const staffData = await staffRes.json();
      if (staffRes.ok) {
        setStaffList((staffData.staff || []).map((s: { id: string; fullName: string; email: string; staffRole: StaffRole; phone: string; isActive: boolean; createdAt: string }) => ({
          id: s.id,
          name: s.fullName,
          email: s.email,
          role: s.staffRole,
          phone: s.phone || "",
          status: s.isActive ? "active" : "inactive",
          avatar: "/logos/profile.png",
          joinedDate: new Date(s.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        })));
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: "active" as TabType, label: "Active Students", count: activeStudents.length },
    { id: "pending" as TabType, label: "Pending Registrations", count: pendingStudents.length },
    { id: "staff" as TabType, label: "Staff Accounts", count: staffList.length },
  ];

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setShowStudentDetailsModal(true);
  };

  const handleStaffInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setStaffFormData({
      ...staffFormData,
      [e.target.name]: e.target.value,
    });
    setFormError(null);
  };

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    
    if (!staffFormData.fullName || !staffFormData.email || !staffFormData.password || !staffFormData.staffRole) {
      setFormError("Please fill in all required fields");
      return;
    }

    if (staffFormData.password.length < 8) {
      setFormError("Password must be at least 8 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/staff", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(staffFormData),
      });

      const data = await response.json();

      if (!response.ok) {
        setFormError(data.message || "Failed to add staff member");
        return;
      }

      // Add to local list
      const newStaff: Staff = {
        id: data.staff.id,
        name: data.staff.fullName,
        email: data.staff.email,
        role: data.staff.staffRole,
        phone: data.staff.phone || "",
        status: "active",
        joinedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        avatar: "/logos/profile.png",
      };
      setStaffList([newStaff, ...staffList]);
      
      // Reset form and close modal
      setStaffFormData({ fullName: "", email: "", password: "", staffRole: "", phone: "" });
      setShowAddStaffModal(false);
    } catch (error) {
      setFormError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStaffStatus = async (staffId: string, currentStatus: "active" | "inactive") => {
    try {
      const response = await fetch("/api/admin/staff", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: staffId, isActive: currentStatus === "inactive" }),
      });

      if (response.ok) {
        setStaffList(prev =>
          prev.map(s =>
            s.id === staffId
              ? { ...s, status: currentStatus === "active" ? "inactive" : "active" }
              : s
          )
        );
      }
    } catch (error) {
      console.error("Failed to update staff status:", error);
    }
  };

  const handleDeleteStaff = async (staffId: string) => {
    if (!confirm("Are you sure you want to delete this staff member?")) return;

    try {
      const response = await fetch(`/api/admin/staff?id=${staffId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setStaffList(prev => prev.filter(s => s.id !== staffId));
      }
    } catch (error) {
      console.error("Failed to delete staff:", error);
    }
  };

  const handleApproveStudent = async (studentId: string) => {
    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: studentId, isActive: true }),
      });

      if (response.ok) {
        const student = pendingStudents.find(s => s.id === studentId);
        if (student) {
          setPendingStudents(prev => prev.filter(s => s.id !== studentId));
          setActiveStudents(prev => [...prev, { ...student, status: "active", joinedDate: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) }]);
        }
      }
    } catch (error) {
      console.error("Failed to approve student:", error);
    }
  };

  const handleRejectStudent = async (studentId: string) => {
    if (!confirm("Are you sure you want to reject this student registration?")) return;

    try {
      const response = await fetch(`/api/admin/users?id=${studentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPendingStudents(prev => prev.filter(s => s.id !== studentId));
      }
    } catch (error) {
      console.error("Failed to reject student:", error);
    }
  };

  const handleDeactivateStudent = async (studentId: string) => {
    if (!confirm("Are you sure you want to deactivate this student?")) return;

    try {
      const response = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: studentId, isActive: false }),
      });

      if (response.ok) {
        setActiveStudents(prev => prev.filter(s => s.id !== studentId));
      }
    } catch (error) {
      console.error("Failed to deactivate student:", error);
    }
  };

  const filteredActiveStudents = activeStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const filteredPendingStudents = pendingStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const filteredStaff = staffList.filter(staff => 
    staff.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    staff.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    STAFF_ROLE_LABELS[staff.role]?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">{activeStudents.length} Active</span>
          <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full">{pendingStudents.length} Pending</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-gray-200">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-sm font-medium transition-colors flex items-center gap-2 ${
                activeTab === tab.id
                  ? "text-[#2D6A4F] border-b-2 border-[#2D6A4F]"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {tab.label}
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id ? "bg-[#2D6A4F] text-white" : "bg-gray-100 text-gray-600"
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
        {activeTab === "staff" && (
          <button 
            onClick={() => setShowAddStaffModal(true)}
            className="px-4 py-2 bg-[#2D6A4F] text-white rounded-lg text-sm font-medium hover:bg-[#245840] transition-colors"
          >
            + Add Staff
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder={`Search ${activeTab === "staff" ? "staff" : "students"}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
          />
          <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2D6A4F] mx-auto mb-4"></div>
          <p className="text-gray-500">Loading users...</p>
        </div>
      )}

      {/* Pending Approvals Tab */}
      {!loading && activeTab === "pending" && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Student</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Applied On</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPendingStudents.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                    No pending approvals found
                  </td>
                </tr>
              ) : (
                filteredPendingStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={student.avatar}
                          alt={student.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-800">{student.name}</p>
                          <p className="text-xs text-gray-500">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{student.pendingSince}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleViewStudent(student)}
                          className="px-3 py-1.5 border border-gray-200 text-gray-600 text-sm rounded-md hover:bg-gray-50 transition-colors"
                        >
                          View
                        </button>
                        <button 
                          onClick={() => handleApproveStudent(student.id)}
                          className="px-3 py-1.5 bg-[#2D6A4F] text-white text-sm rounded-md hover:bg-[#245840] transition-colors"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleRejectStudent(student.id)}
                          className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Active Students Tab */}
      {!loading && activeTab === "active" && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Student</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Joined</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredActiveStudents.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                    No students found matching your criteria
                  </td>
                </tr>
              ) : (
                filteredActiveStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src={student.avatar}
                          alt={student.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-800">{student.name}</p>
                          <p className="text-xs text-gray-500">{student.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">{student.joinedDate}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleViewStudent(student)}
                          className="p-2 text-gray-500 hover:text-[#2D6A4F] hover:bg-gray-100 rounded-lg transition-colors"
                          title="View Details"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                        <button 
                          onClick={() => handleDeactivateStudent(student.id)}
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Deactivate"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          
          {/* Pagination */}
          <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
            <p className="text-sm text-gray-500">Showing {filteredActiveStudents.length} of {activeStudents.length} students</p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-50" disabled>
                Previous
              </button>
              <button className="px-3 py-1.5 bg-[#2D6A4F] text-white rounded-md text-sm">1</button>
              <button className="px-3 py-1.5 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50">2</button>
              <button className="px-3 py-1.5 border border-gray-200 rounded-md text-sm text-gray-600 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Staff Tab */}
      {!loading && activeTab === "staff" && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Staff Member</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Role</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Phone</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Joined</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredStaff.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                    No staff members found matching your search
                  </td>
                </tr>
              ) : (
              filteredStaff.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={staff.avatar}
                        alt={staff.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-800">{staff.name}</p>
                        <p className="text-xs text-gray-500">{staff.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-medium">
                      {STAFF_ROLE_LABELS[staff.role]}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{staff.phone}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleStaffStatus(staff.id, staff.status)}
                      className={`px-2 py-1 rounded text-xs font-medium cursor-pointer transition-colors ${
                        staff.status === "active" 
                          ? "bg-green-50 text-green-700 hover:bg-green-100" 
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                    >
                      {staff.status === "active" ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{staff.joinedDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDeleteStaff(staff.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Staff Modal */}
      {showAddStaffModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Add New Staff</h2>
              <button 
                onClick={() => {
                  setShowAddStaffModal(false);
                  setFormError(null);
                  setStaffFormData({ fullName: "", email: "", password: "", staffRole: "", phone: "" });
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {formError}
              </div>
            )}
            
            <form onSubmit={handleAddStaff} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  value={staffFormData.fullName}
                  onChange={handleStaffInputChange}
                  placeholder="Enter full name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={staffFormData.email}
                  onChange={handleStaffInputChange}
                  placeholder="Enter email address"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
                <input
                  type="password"
                  name="password"
                  value={staffFormData.password}
                  onChange={handleStaffInputChange}
                  placeholder="Enter password (min 8 characters)"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none"
                  required
                  minLength={8}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={staffFormData.phone}
                  onChange={handleStaffInputChange}
                  placeholder="Enter phone number"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role *</label>
                <select 
                  name="staffRole"
                  value={staffFormData.staffRole}
                  onChange={handleStaffInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none bg-white"
                  required
                >
                  <option value="">Select role</option>
                  <option value="mess_manager">Mess Manager</option>
                  <option value="security_guard">Security Guard</option>
                  <option value="maintenance_staff">Maintenance Staff</option>
                  <option value="laundry_manager">Laundry Manager</option>
                  <option value="financial_staff">Financial Staff</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddStaffModal(false);
                    setFormError(null);
                    setStaffFormData({ fullName: "", email: "", password: "", staffRole: "", phone: "" });
                  }}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-4 py-3 bg-[#2D6A4F] text-white rounded-lg font-medium hover:bg-[#245840] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Adding..." : "Add Staff"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Details Modal */}
      {showStudentDetailsModal && selectedStudent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Student Details</h2>
              <button 
                onClick={() => setShowStudentDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex items-center gap-4 mb-6">
              <Image
                src={selectedStudent.avatar}
                alt={selectedStudent.name}
                width={80}
                height={80}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div>
                <h3 className="text-lg font-bold text-gray-800">{selectedStudent.name}</h3>
                <p className="text-gray-500">{selectedStudent.email}</p>
                <span className={`inline-block mt-1 px-2 py-0.5 rounded text-xs font-medium ${
                  selectedStudent.status === "active" ? "bg-green-100 text-green-700" :
                  selectedStudent.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                  "bg-gray-100 text-gray-600"
                }`}>
                  {selectedStudent.status.charAt(0).toUpperCase() + selectedStudent.status.slice(1)}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Email</p>
                <p className="font-medium text-gray-800">{selectedStudent.email}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Status</p>
                <p className="font-medium text-gray-800 capitalize">{selectedStudent.status}</p>
              </div>
              {selectedStudent.joinedDate && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Joined Date</p>
                  <p className="font-medium text-gray-800">{selectedStudent.joinedDate}</p>
                </div>
              )}
              {selectedStudent.pendingSince && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Applied On</p>
                  <p className="font-medium text-gray-800">{selectedStudent.pendingSince}</p>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowStudentDetailsModal(false)}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              {selectedStudent.status === "pending" && (
                <>
                  <button className="flex-1 px-4 py-3 bg-[#2D6A4F] text-white rounded-lg font-medium hover:bg-[#245840] transition-colors">
                    Approve
                  </button>
                  <button className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors">
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
