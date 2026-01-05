"use client";

import { useState } from "react";
import Image from "next/image";

type RoomStatus = "occupied" | "vacant" | "partial" | "maintenance";
type ViewMode = "grid" | "list";

interface RoomMember {
  name: string;
  studentId: string;
  avatar: string;
}

interface Room {
  number: string;
  floor: number;
  capacity: number;
  members: RoomMember[];
  status: RoomStatus;
  amenities: string[];
}

interface AllocationRequest {
  id: string;
  name: string;
  studentId: string;
  department: string;
  year: string;
  preferredRoom?: string;
  avatar: string;
  requestDate: string;
}

const rooms: Room[] = [
  { 
    number: "201", 
    floor: 2,
    capacity: 4, 
    members: [
      { name: "David Johnson", studentId: "202214001", avatar: "/logos/profile.png" },
      { name: "Michael Charter", studentId: "202214015", avatar: "/logos/profile.png" },
      { name: "Mark Wilson", studentId: "202314032", avatar: "/logos/profile.png" },
      { name: "Ethan Lowe", studentId: "202314089", avatar: "/logos/profile.png" }
    ], 
    status: "occupied",
    amenities: ["AC", "Attached Bath", "Balcony"]
  },
  { 
    number: "202", 
    floor: 2,
    capacity: 4, 
    members: [
      { name: "James Brown", studentId: "202414002", avatar: "/logos/profile.png" },
      { name: "Robert Smith", studentId: "202414056", avatar: "/logos/profile.png" },
      { name: "William Davis", studentId: "202414078", avatar: "/logos/profile.png" },
      { name: "Richard Miller", studentId: "202414091", avatar: "/logos/profile.png" }
    ], 
    status: "occupied",
    amenities: ["AC", "Attached Bath"]
  },
  { 
    number: "203", 
    floor: 2,
    capacity: 4, 
    members: [
      { name: "Thomas Anderson", studentId: "202314045", avatar: "/logos/profile.png" },
      { name: "Charles White", studentId: "202314067", avatar: "/logos/profile.png" },
      { name: "Daniel Harris", studentId: "202314082", avatar: "/logos/profile.png" },
      { name: "Matthew Clark", studentId: "202314098", avatar: "/logos/profile.png" }
    ], 
    status: "occupied",
    amenities: ["AC", "Attached Bath"]
  },
  { 
    number: "204", 
    floor: 2,
    capacity: 4, 
    members: [
      { name: "Andrew Martin", studentId: "202514001", avatar: "/logos/profile.png" },
      { name: "Joshua Garcia", studentId: "202514023", avatar: "/logos/profile.png" }
    ], 
    status: "partial",
    amenities: ["Fan", "Common Bath"]
  },
  { 
    number: "205", 
    floor: 2,
    capacity: 4, 
    members: [], 
    status: "vacant",
    amenities: ["Fan", "Common Bath"]
  },
  { 
    number: "206", 
    floor: 2,
    capacity: 4, 
    members: [], 
    status: "maintenance",
    amenities: ["AC", "Attached Bath", "Balcony"]
  },
  { 
    number: "301", 
    floor: 3,
    capacity: 4, 
    members: [
      { name: "Kevin Lee", studentId: "202214022", avatar: "/logos/profile.png" },
      { name: "Brian Walker", studentId: "202214034", avatar: "/logos/profile.png" },
      { name: "George Hall", studentId: "202214056", avatar: "/logos/profile.png" },
      { name: "Edward Allen", studentId: "202214078", avatar: "/logos/profile.png" }
    ], 
    status: "occupied",
    amenities: ["AC", "Attached Bath"]
  },
  { 
    number: "302", 
    floor: 3,
    capacity: 4, 
    members: [
      { name: "Ryan Young", studentId: "202314011", avatar: "/logos/profile.png" },
      { name: "Nicholas King", studentId: "202314029", avatar: "/logos/profile.png" },
      { name: "Tyler Wright", studentId: "202314047", avatar: "/logos/profile.png" }
    ], 
    status: "partial",
    amenities: ["AC", "Attached Bath"]
  },
];

const allocationRequests: AllocationRequest[] = [
  { id: "1", name: "Rahim Ahmed", studentId: "202514045", department: "CSE", year: "1st", preferredRoom: "204", requestDate: "Jan 3, 2026", avatar: "/logos/profile.png" },
  { id: "2", name: "Karim Khan", studentId: "202514056", department: "EEE", year: "1st", requestDate: "Jan 4, 2026", avatar: "/logos/profile.png" },
  { id: "3", name: "Fahim Hasan", studentId: "202514067", department: "ME", year: "1st", preferredRoom: "205", requestDate: "Jan 4, 2026", avatar: "/logos/profile.png" },
  { id: "4", name: "Anik Roy", studentId: "202514078", department: "CE", year: "1st", requestDate: "Jan 5, 2026", avatar: "/logos/profile.png" },
];

function getStatusColor(status: RoomStatus) {
  switch (status) {
    case "occupied":
      return "bg-[#2D6A4F] text-white";
    case "vacant":
      return "bg-green-100 text-green-700 border border-green-200";
    case "partial":
      return "bg-yellow-100 text-yellow-700 border border-yellow-200";
    case "maintenance":
      return "bg-red-100 text-red-700 border border-red-200";
    default:
      return "bg-gray-200 text-gray-600";
  }
}

function getStatusLabel(status: RoomStatus) {
  switch (status) {
    case "occupied":
      return "Full";
    case "vacant":
      return "Vacant";
    case "partial":
      return "Available";
    case "maintenance":
      return "Maintenance";
    default:
      return "";
  }
}

function getHeaderColor(status: RoomStatus) {
  switch (status) {
    case "occupied":
      return "bg-[#2D6A4F]";
    case "vacant":
      return "bg-green-500";
    case "partial":
      return "bg-[#40E0D0]";
    case "maintenance":
      return "bg-red-400";
    default:
      return "bg-gray-400";
  }
}

export default function RoomAllocationPage() {
  const [selectedFloor, setSelectedFloor] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showRoomDetails, setShowRoomDetails] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showAllocateModal, setShowAllocateModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<AllocationRequest | null>(null);

  // Filter rooms
  const filteredRooms = rooms.filter(room => {
    const matchesFloor = selectedFloor === "all" || room.floor === parseInt(selectedFloor);
    const matchesStatus = selectedStatus === "all" || room.status === selectedStatus;
    const matchesSearch = room.number.includes(searchQuery) || 
                         room.members.some(m => m.name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFloor && matchesStatus && matchesSearch;
  });

  // Stats
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(r => r.status === "occupied").length;
  const partialRooms = rooms.filter(r => r.status === "partial").length;
  const vacantRooms = rooms.filter(r => r.status === "vacant").length;
  const maintenanceRooms = rooms.filter(r => r.status === "maintenance").length;

  const handleViewRoom = (room: Room) => {
    setSelectedRoom(room);
    setShowRoomDetails(true);
  };

  const handleAllocate = (request: AllocationRequest) => {
    setSelectedRequest(request);
    setShowAllocateModal(true);
  };

  const availableRoomsForAllocation = rooms.filter(r => r.status === "vacant" || r.status === "partial");

  return (
    <div className="flex gap-6 h-full">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-gray-800">{totalRooms}</p>
            <p className="text-sm text-gray-500">Total Rooms</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center border-l-4 border-[#2D6A4F]">
            <p className="text-2xl font-bold text-[#2D6A4F]">{occupiedRooms}</p>
            <p className="text-sm text-gray-500">Fully Occupied</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center border-l-4 border-[#40E0D0]">
            <p className="text-2xl font-bold text-[#40E0D0]">{partialRooms}</p>
            <p className="text-sm text-gray-500">Partially Filled</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center border-l-4 border-green-500">
            <p className="text-2xl font-bold text-green-500">{vacantRooms}</p>
            <p className="text-sm text-gray-500">Vacant</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center border-l-4 border-red-400">
            <p className="text-2xl font-bold text-red-400">{maintenanceRooms}</p>
            <p className="text-sm text-gray-500">Under Maintenance</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <select
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
            >
              <option value="all">All Floors</option>
              <option value="1">1st Floor</option>
              <option value="2">2nd Floor</option>
              <option value="3">3rd Floor</option>
              <option value="4">4th Floor</option>
            </select>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
            >
              <option value="all">All Status</option>
              <option value="occupied">Occupied</option>
              <option value="partial">Partially Filled</option>
              <option value="vacant">Vacant</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search room or student..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <div className="flex bg-white border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-2 ${viewMode === "grid" ? "bg-[#2D6A4F] text-white" : "text-gray-500 hover:bg-gray-50"}`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 ${viewMode === "list" ? "bg-[#2D6A4F] text-white" : "text-gray-500 hover:bg-gray-50"}`}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Room Grid View */}
        {viewMode === "grid" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRooms.map((room) => (
              <div 
                key={room.number} 
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleViewRoom(room)}
              >
                {/* Room Header */}
                <div className={`${getHeaderColor(room.status)} px-4 py-3 flex items-center justify-between`}>
                  <span className="text-white font-bold text-lg">Room {room.number}</span>
                  <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                    room.status === "occupied" ? "bg-white/20 text-white" : "bg-white text-gray-700"
                  }`}>
                    {room.members.length}/{room.capacity}
                  </span>
                </div>
                
                {/* Room Content */}
                <div className="p-4">
                  {room.status === "vacant" ? (
                    <div className="flex flex-col items-center justify-center h-24 text-gray-400">
                      <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span>Available for allocation</span>
                    </div>
                  ) : room.status === "maintenance" ? (
                    <div className="flex flex-col items-center justify-center h-24 text-red-400">
                      <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <span>Under maintenance</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {room.members.slice(0, 3).map((member, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Image
                            src={member.avatar}
                            alt={member.name}
                            width={24}
                            height={24}
                            className="w-6 h-6 rounded-full"
                          />
                          <span className="text-sm text-gray-700 truncate">{member.name}</span>
                        </div>
                      ))}
                      {room.members.length > 3 && (
                        <span className="text-xs text-gray-400">+{room.members.length - 3} more</span>
                      )}
                      {room.status === "partial" && (
                        <div className="text-sm text-[#40E0D0] font-medium mt-2">
                          {room.capacity - room.members.length} bed(s) available
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Status Badge & Amenities */}
                  <div className="mt-4 flex items-center justify-between">
                    <span className={`inline-block px-3 py-1 rounded-md text-xs font-medium ${getStatusColor(room.status)}`}>
                      {getStatusLabel(room.status)}
                    </span>
                    <div className="flex gap-1">
                      {room.amenities.includes("AC") && (
                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded">AC</span>
                      )}
                      {room.amenities.includes("Attached Bath") && (
                        <span className="text-xs bg-purple-50 text-purple-600 px-2 py-0.5 rounded">Bath</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Room List View */}
        {viewMode === "list" && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Room</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Floor</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Occupancy</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Residents</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Amenities</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRooms.map((room) => (
                  <tr key={room.number} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-800">Room {room.number}</span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{room.floor}nd Floor</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getHeaderColor(room.status)}`}
                            style={{ width: `${(room.members.length / room.capacity) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{room.members.length}/{room.capacity}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex -space-x-2">
                        {room.members.slice(0, 3).map((member, index) => (
                          <Image
                            key={index}
                            src={member.avatar}
                            alt={member.name}
                            width={28}
                            height={28}
                            className="w-7 h-7 rounded-full border-2 border-white"
                            title={member.name}
                          />
                        ))}
                        {room.members.length > 3 && (
                          <span className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                            +{room.members.length - 3}
                          </span>
                        )}
                        {room.members.length === 0 && (
                          <span className="text-sm text-gray-400">No residents</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(room.status)}`}>
                        {getStatusLabel(room.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-1">
                        {room.amenities.map((amenity, index) => (
                          <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            {amenity}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => handleViewRoom(room)}
                        className="text-[#2D6A4F] hover:underline text-sm font-medium"
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

      {/* Allocation Requests Sidebar */}
      <div className="w-80 space-y-4">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Allocation Requests</h2>
            <span className="px-2 py-0.5 bg-orange-100 text-orange-600 rounded-full text-xs font-medium">
              {allocationRequests.length} pending
            </span>
          </div>
          <div className="space-y-4">
            {allocationRequests.map((request) => (
              <div key={request.id} className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Image
                    src={request.avatar}
                    alt={request.name}
                    width={40}
                    height={40}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800 truncate">{request.name}</p>
                    <p className="text-xs text-gray-500">{request.studentId}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span>{request.department} • {request.year}</span>
                  <span>{request.requestDate}</span>
                </div>
                {request.preferredRoom && (
                  <p className="text-xs text-[#2D6A4F] mb-2">Preferred: Room {request.preferredRoom}</p>
                )}
                <button 
                  onClick={() => handleAllocate(request)}
                  className="w-full px-3 py-2 bg-[#2D6A4F] text-white text-sm rounded-lg hover:bg-[#245840] transition-colors"
                >
                  Allocate Room
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Room Status Legend</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-[#2D6A4F]" />
              <span className="text-sm text-gray-600">Fully Occupied</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-[#40E0D0]" />
              <span className="text-sm text-gray-600">Partially Filled</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500" />
              <span className="text-sm text-gray-600">Vacant</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-400" />
              <span className="text-sm text-gray-600">Under Maintenance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Room Details Modal */}
      {showRoomDetails && selectedRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Room {selectedRoom.number}</h2>
                <p className="text-gray-500">Floor {selectedRoom.floor} • Capacity: {selectedRoom.capacity}</p>
              </div>
              <button 
                onClick={() => setShowRoomDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Status</p>
                <span className={`px-3 py-1 rounded text-sm font-medium ${getStatusColor(selectedRoom.status)}`}>
                  {getStatusLabel(selectedRoom.status)}
                </span>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Occupancy</p>
                <p className="text-lg font-bold text-gray-800">{selectedRoom.members.length} / {selectedRoom.capacity}</p>
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-3">Amenities</h3>
              <div className="flex flex-wrap gap-2">
                {selectedRoom.amenities.map((amenity, index) => (
                  <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                    {amenity}
                  </span>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-3">Current Residents</h3>
              {selectedRoom.members.length === 0 ? (
                <p className="text-gray-500 text-sm">No residents currently assigned</p>
              ) : (
                <div className="space-y-3">
                  {selectedRoom.members.map((member, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Image
                          src={member.avatar}
                          alt={member.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <p className="font-medium text-gray-800">{member.name}</p>
                          <p className="text-sm text-gray-500">{member.studentId}</p>
                        </div>
                      </div>
                      <button className="text-red-500 hover:text-red-700 text-sm">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRoomDetails(false)}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              {(selectedRoom.status === "vacant" || selectedRoom.status === "partial") && (
                <button className="flex-1 px-4 py-3 bg-[#2D6A4F] text-white rounded-lg font-medium hover:bg-[#245840] transition-colors">
                  Add Resident
                </button>
              )}
              {selectedRoom.status === "maintenance" && (
                <button className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                  Mark as Available
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Allocate Room Modal */}
      {showAllocateModal && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-800">Allocate Room</h2>
              <button 
                onClick={() => setShowAllocateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex items-center gap-3 mb-6 p-3 bg-gray-50 rounded-lg">
              <Image
                src={selectedRequest.avatar}
                alt={selectedRequest.name}
                width={48}
                height={48}
                className="w-12 h-12 rounded-full"
              />
              <div>
                <p className="font-medium text-gray-800">{selectedRequest.name}</p>
                <p className="text-sm text-gray-500">{selectedRequest.studentId} • {selectedRequest.department}</p>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Room</label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none bg-white">
                <option value="">Choose a room...</option>
                {availableRoomsForAllocation.map((room) => (
                  <option key={room.number} value={room.number}>
                    Room {room.number} - {room.capacity - room.members.length} bed(s) available
                  </option>
                ))}
              </select>
              {selectedRequest.preferredRoom && (
                <p className="text-sm text-[#2D6A4F] mt-2">
                  Student preferred: Room {selectedRequest.preferredRoom}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAllocateModal(false)}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-3 bg-[#2D6A4F] text-white rounded-lg font-medium hover:bg-[#245840] transition-colors">
                Confirm Allocation
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
