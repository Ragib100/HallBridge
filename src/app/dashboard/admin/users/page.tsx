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
  year: string;
  room: string;
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
  role: string;
  phone: string;
  status: "active" | "inactive";
  avatar: string;
  joinedDate: string;
}

const pendingStudents: Student[] = [
  { id: "1", name: "Rahim Ahmed", email: "rahim@example.com", studentId: "202314008", department: "CSE", year: "3rd", room: "-", status: "pending", pendingSince: "Jan 2, 2026", avatar: "/logos/profile.png" },
  { id: "2", name: "Karim Khan", email: "karim@example.com", studentId: "202314012", department: "EEE", year: "2nd", room: "-", status: "pending", pendingSince: "Jan 3, 2026", avatar: "/logos/profile.png" },
  { id: "3", name: "Fahim Hasan", email: "fahim@example.com", studentId: "202314045", department: "ME", year: "4th", room: "-", status: "pending", pendingSince: "Jan 4, 2026", avatar: "/logos/profile.png" },
  { id: "4", name: "Anik Roy", email: "anik@example.com", studentId: "202314067", department: "CSE", year: "1st", room: "-", status: "pending", pendingSince: "Jan 5, 2026", avatar: "/logos/profile.png" },
];

const activeStudents: Student[] = [
  { id: "1", name: "David Johnson", email: "david@example.com", studentId: "202214001", department: "CSE", year: "4th", room: "201", status: "active", joinedDate: "Aug 15, 2022", avatar: "/logos/profile.png" },
  { id: "2", name: "Michael Charter", email: "michael@example.com", studentId: "202214015", department: "EEE", year: "4th", room: "201", status: "active", joinedDate: "Aug 20, 2022", avatar: "/logos/profile.png" },
  { id: "3", name: "Mark Wilson", email: "mark@example.com", studentId: "202314032", department: "ME", year: "3rd", room: "203", status: "active", joinedDate: "Sep 1, 2023", avatar: "/logos/profile.png" },
  { id: "4", name: "Ethan Lowe", email: "ethan@example.com", studentId: "202314089", department: "CE", year: "3rd", room: "204", status: "active", joinedDate: "Sep 5, 2023", avatar: "/logos/profile.png" },
  { id: "5", name: "James Brown", email: "james@example.com", studentId: "202414002", department: "CSE", year: "2nd", room: "205", status: "active", joinedDate: "Aug 10, 2024", avatar: "/logos/profile.png" },
  { id: "6", name: "Robert Smith", email: "robert@example.com", studentId: "202414056", department: "EEE", year: "2nd", room: "206", status: "active", joinedDate: "Aug 12, 2024", avatar: "/logos/profile.png" },
];

const staffMembers: Staff[] = [
  { id: "1", name: "Abdul Karim", email: "karim@hallbridge.com", role: "Mess Manager", phone: "+880 1712-345678", status: "active", joinedDate: "Jan 1, 2020", avatar: "/logos/profile.png" },
  { id: "2", name: "Rafiq Ahmed", email: "rafiq@hallbridge.com", role: "Security Guard", phone: "+880 1812-456789", status: "active", joinedDate: "Mar 15, 2021", avatar: "/logos/profile.png" },
  { id: "3", name: "Shahid Hossain", email: "shahid@hallbridge.com", role: "Maintenance Staff", phone: "+880 1612-567890", status: "active", joinedDate: "Jun 20, 2022", avatar: "/logos/profile.png" },
  { id: "4", name: "Jamal Uddin", email: "jamal@hallbridge.com", role: "Laundry Manager", phone: "+880 1912-678901", status: "inactive", joinedDate: "Feb 10, 2023", avatar: "/logos/profile.png" },
];

const archivedStudents: Student[] = [
  { id: "1", name: "Tanvir Islam", email: "tanvir@example.com", studentId: "201914023", department: "CSE", year: "Graduated", room: "-", status: "archived", archivedDate: "Jun 15, 2024", avatar: "/logos/profile.png" },
  { id: "2", name: "Sakib Hassan", email: "sakib@example.com", studentId: "201914056", department: "EEE", year: "Graduated", room: "-", status: "archived", archivedDate: "Jun 15, 2024", avatar: "/logos/profile.png" },
  { id: "3", name: "Imran Khan", email: "imran@example.com", studentId: "202014012", department: "ME", year: "Left", room: "-", status: "archived", archivedDate: "Dec 20, 2024", avatar: "/logos/profile.png" },
];

export default function UserManagementPage() {
  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("all");
  const [selectedDepartment, setSelectedDepartment] = useState("all");
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [showStudentDetailsModal, setShowStudentDetailsModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const tabs = [
    { id: "pending" as TabType, label: "Pending Approvals", count: pendingStudents.length },
    { id: "active" as TabType, label: "Active Students", count: activeStudents.length },
    { id: "staff" as TabType, label: "Staff Accounts", count: staffMembers.length },
    { id: "archived" as TabType, label: "Archived", count: archivedStudents.length },
  ];

  const handleViewStudent = (student: Student) => {
    setSelectedStudent(student);
    setShowStudentDetailsModal(true);
  };

  const filteredActiveStudents = activeStudents.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         student.studentId.includes(searchQuery) ||
                         student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesYear = selectedYear === "all" || student.year === selectedYear;
    const matchesDept = selectedDepartment === "all" || student.department === selectedDepartment;
    return matchesSearch && matchesYear && matchesDept;
  });

  const filteredPendingStudents = pendingStudents.filter(student => 
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.studentId.includes(searchQuery)
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
        {(activeTab === "active" || activeTab === "pending") && (
          <>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] bg-white"
            >
              <option value="all">All Years</option>
              <option value="1st">1st Year</option>
              <option value="2nd">2nd Year</option>
              <option value="3rd">3rd Year</option>
              <option value="4th">4th Year</option>
            </select>
            <select
              value={selectedDepartment}
              onChange={(e) => setSelectedDepartment(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] bg-white"
            >
              <option value="all">All Departments</option>
              <option value="CSE">CSE</option>
              <option value="EEE">EEE</option>
              <option value="ME">ME</option>
              <option value="CE">CE</option>
            </select>
          </>
        )}
      </div>

      {/* Pending Approvals Tab */}
      {activeTab === "pending" && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Student</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Student ID</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Department</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Year</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Applied On</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPendingStudents.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
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
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">{student.studentId}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                        {student.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.year}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{student.pendingSince}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleViewStudent(student)}
                          className="px-3 py-1.5 border border-gray-200 text-gray-600 text-sm rounded-md hover:bg-gray-50 transition-colors"
                        >
                          View
                        </button>
                        <button className="px-3 py-1.5 bg-[#2D6A4F] text-white text-sm rounded-md hover:bg-[#245840] transition-colors">
                          Approve
                        </button>
                        <button className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition-colors">
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
      {activeTab === "active" && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Student</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Student ID</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Department</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Year</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Room</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Joined</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredActiveStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
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
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">{student.studentId}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">
                        {student.department}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{student.year}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs font-medium">
                        Room {student.room}
                      </span>
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
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button 
                          className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Archive"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
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
      {activeTab === "staff" && (
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
              {staffMembers.map((staff) => (
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
                      {staff.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{staff.phone}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      staff.status === "active" 
                        ? "bg-green-50 text-green-700" 
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {staff.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{staff.joinedDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                      </button>
                      <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Archived Tab */}
      {activeTab === "archived" && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Student</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Student ID</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Department</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Archived On</th>
                <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {archivedStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={student.avatar}
                        alt={student.name}
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover grayscale"
                      />
                      <div>
                        <p className="text-sm font-medium text-gray-600">{student.name}</p>
                        <p className="text-xs text-gray-400">{student.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 font-mono">{student.studentId}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                      {student.department}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs font-medium">
                      {student.year}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">{student.archivedDate}</td>
                  <td className="px-6 py-4">
                    <button className="px-3 py-1.5 border border-gray-200 text-gray-600 text-sm rounded-md hover:bg-gray-50 transition-colors">
                      Restore
                    </button>
                  </td>
                </tr>
              ))}
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
                onClick={() => setShowAddStaffModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input
                  type="tel"
                  placeholder="Enter phone number"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none bg-white">
                  <option value="">Select role</option>
                  <option value="mess">Mess Manager</option>
                  <option value="security">Security Guard</option>
                  <option value="maintenance">Maintenance Staff</option>
                  <option value="laundry">Laundry Manager</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddStaffModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-[#2D6A4F] text-white rounded-lg font-medium hover:bg-[#245840] transition-colors"
                >
                  Add Staff
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
                <p className="text-xs text-gray-500">Student ID</p>
                <p className="font-medium text-gray-800">{selectedStudent.studentId}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Department</p>
                <p className="font-medium text-gray-800">{selectedStudent.department}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Year</p>
                <p className="font-medium text-gray-800">{selectedStudent.year}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Room</p>
                <p className="font-medium text-gray-800">{selectedStudent.room || "Not Assigned"}</p>
              </div>
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
