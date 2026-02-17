"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type RoomStatus = "occupied" | "vacant" | "partial" | "maintenance";
type ViewMode = "grid" | "list";

interface RoomMember {
  id: string;
  fullName: string;
  studentId: string;
}

interface Bed {
  bedNumber: number;
  isOccupied: boolean;
  student: RoomMember | null;
}

interface Room {
  id: string;
  floor: number;
  roomNumber: string;
  displayNumber: string;
  capacity: number;
  beds: Bed[];
  status: RoomStatus;
  amenities: string[];
  hallId?: string;
  availableBeds: number;
  occupiedBeds: number;
}

interface RoomStats {
  totalRooms: number;
  occupied: number;
  partial: number;
  vacant: number;
  maintenance: number;
  totalBeds: number;
  occupiedBeds: number;
}

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
  const [rooms, setRooms] = useState<Room[]>([]);
  const [stats, setStats] = useState<RoomStats>({
    totalRooms: 0,
    occupied: 0,
    partial: 0,
    vacant: 0,
    maintenance: 0,
    totalBeds: 0,
    occupiedBeds: 0,
  });
  const [loading, setLoading] = useState(true);
  const [selectedFloor, setSelectedFloor] = useState("1"); // Default to floor 1
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showRoomDetails, setShowRoomDetails] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showAllRooms, setShowAllRooms] = useState(false); // For "View All" toggle
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [createRoomData, setCreateRoomData] = useState({
    floor: "1",
    roomNumber: "",
    capacity: "4",
    amenities: [] as string[],
  });
  const [bulkMode, setBulkMode] = useState(false);
  const [bulkRoomRange, setBulkRoomRange] = useState({
    startRoom: "",
    endRoom: "",
  });

  // Fetch rooms from database
  useEffect(() => {
    fetchRooms();
  }, [selectedFloor, selectedStatus, showAllRooms]);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (!showAllRooms && selectedFloor !== "all") params.append("floor", selectedFloor);
      if (selectedStatus !== "all") params.append("status", selectedStatus);
      if (searchQuery) params.append("search", searchQuery);

      const res = await fetch(`/api/admin/rooms?${params.toString()}`);
      const data = await res.json();
      
      if (res.ok) {
        setRooms(data.rooms || []);
        setStats(data.stats || {
          totalRooms: 0,
          occupied: 0,
          partial: 0,
          vacant: 0,
          maintenance: 0,
          totalBeds: 0,
          occupiedBeds: 0,
        });
      }
    } catch (error) {
      console.error("Failed to fetch rooms:", error);
    } finally {
      setLoading(false);
    }
  };

  // Filter rooms by search query (client-side for room number and student name)
  const filteredRooms = rooms.filter(room => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const matchesRoom = room.roomNumber.includes(query) || room.displayNumber.toLowerCase().includes(query);
    const matchesMember = room.beds.some(bed => 
      bed.student?.fullName.toLowerCase().includes(query) ||
      bed.student?.studentId.toLowerCase().includes(query)
    );
    return matchesRoom || matchesMember;
  });

  const handleViewRoom = (room: Room) => {
    setSelectedRoom(room);
    setShowRoomDetails(true);
  };

  const handleUpdateRoomStatus = async (roomId: string, status: RoomStatus) => {
    const targetRoom = rooms.find((room) => room.id === roomId) || selectedRoom;
    const hasAllocatedStudents = Boolean(targetRoom && targetRoom.occupiedBeds > 0);

    if (status === "maintenance" && hasAllocatedStudents) {
      alert("Cannot set room to maintenance while students are allocated. Remove allocated students first.");
      return;
    }

    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/rooms", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, action: "updateStatus", status }),
      });

      if (res.ok) {
        fetchRooms();
        setShowRoomDetails(false);
      } else {
        const data = await res.json();
        alert(data.message || "Failed to update room status");
      }
    } catch (error) {
      console.error("Failed to update room status:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleRemoveStudent = async (roomId: string, bedNumber: number) => {
    if (!confirm("Are you sure you want to remove this student from the room?")) return;
    
    setActionLoading(true);
    try {
      const res = await fetch("/api/admin/rooms", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ roomId, action: "removeStudent", bedNumber }),
      });

      if (res.ok) {
        fetchRooms();
        // Update selected room if still viewing
        if (selectedRoom && selectedRoom.id === roomId) {
          const updatedRoom = rooms.find(r => r.id === roomId);
          if (updatedRoom) {
            setSelectedRoom({
              ...updatedRoom,
              beds: updatedRoom.beds.map(b => 
                b.bedNumber === bedNumber ? { ...b, isOccupied: false, student: null } : b
              ),
            });
          }
        }
      }
    } catch (error) {
      console.error("Failed to remove student:", error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateRoom = async () => {
    if (bulkMode) {
      if (!bulkRoomRange.startRoom || !bulkRoomRange.endRoom) {
        alert("Please enter both start and end room numbers");
        return;
      }

      const start = parseInt(bulkRoomRange.startRoom);
      const end = parseInt(bulkRoomRange.endRoom);

      if (isNaN(start) || isNaN(end) || start > end) {
        alert("Invalid room range");
        return;
      }

      if (end - start > 50) {
        alert("Cannot create more than 50 rooms at once");
        return;
      }

      setActionLoading(true);
      let successCount = 0;
      let failCount = 0;

      for (let roomNum = start; roomNum <= end; roomNum++) {
        try {
          const res = await fetch("/api/admin/rooms/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...createRoomData,
              roomNumber: roomNum.toString().padStart(2, "0"),
            }),
          });

          if (res.ok) {
            successCount++;
          } else {
            failCount++;
          }
        } catch (error) {
          failCount++;
        }
      }

      alert(`Created ${successCount} rooms successfully${failCount > 0 ? `, ${failCount} failed` : ""}`);
      setShowCreateRoom(false);
      setCreateRoomData({
        floor: "1",
        roomNumber: "",
        capacity: "4",
        amenities: [],
      });
      setBulkMode(false);
      setBulkRoomRange({ startRoom: "", endRoom: "" });
      fetchRooms();
      setActionLoading(false);
    } else {
      if (!createRoomData.roomNumber) {
        alert("Please enter a room number");
        return;
      }

      setActionLoading(true);
      try {
        const res = await fetch("/api/admin/rooms/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(createRoomData),
        });

        const data = await res.json();

        if (res.ok) {
          alert(data.message || "Room created successfully!");
          setShowCreateRoom(false);
          setCreateRoomData({
            floor: "1",
            roomNumber: "",
            capacity: "4",
            amenities: [],
          });
          fetchRooms();
        } else {
          alert(data.message || "Failed to create room");
        }
      } catch (error) {
        console.error("Failed to create room:", error);
        alert("Failed to create room. Please try again.");
      } finally {
        setActionLoading(false);
      }
    }
  };

  const handleToggleAmenity = (amenity: string) => {
    setCreateRoomData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter(a => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  // Get members from beds for display
  const getRoomMembers = (room: Room) => {
    return room.beds
      .filter(bed => bed.isOccupied && bed.student)
      .map(bed => ({
        name: bed.student!.fullName,
        studentId: bed.student!.studentId,
        avatar: "/logos/profile.png",
      }));
  };

  return (
    <div className="flex gap-6 h-full">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-gray-800">{stats.totalRooms}</p>
            <p className="text-sm text-gray-500">Total Rooms</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center">
            <p className="text-2xl font-bold text-blue-600">{stats.totalBeds}</p>
            <p className="text-sm text-gray-500">Total Beds</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center border-l-4 border-[#2D6A4F]">
            <p className="text-2xl font-bold text-[#2D6A4F]">{stats.occupiedBeds}</p>
            <p className="text-sm text-gray-500">Occupied Beds</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center border-l-4 border-green-500">
            <p className="text-2xl font-bold text-green-500">{stats.totalBeds - stats.occupiedBeds}</p>
            <p className="text-sm text-gray-500">Available Beds</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center border-l-4 border-[#40E0D0]">
            <p className="text-2xl font-bold text-[#40E0D0]">{stats.partial}</p>
            <p className="text-sm text-gray-500">Partial Rooms</p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm text-center border-l-4 border-red-400">
            <p className="text-2xl font-bold text-red-400">{stats.maintenance}</p>
            <p className="text-sm text-gray-500">Maintenance</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <select
                value={selectedFloor}
                onChange={(e) => {
                  setSelectedFloor(e.target.value);
                  setShowAllRooms(false);
                }}
                disabled={showAllRooms}
                className={`px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] ${showAllRooms ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {[1, 2, 3, 4, 5, 6, 7, 8].map(floor => (
                  <option key={floor} value={floor}>{floor}{floor === 1 ? 'st' : floor === 2 ? 'nd' : floor === 3 ? 'rd' : 'th'} Floor</option>
                ))}
              </select>
              <button
                onClick={() => setShowAllRooms(!showAllRooms)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  showAllRooms
                    ? "bg-[#2D6A4F] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {showAllRooms ? "Showing All Floors" : "View All Floors"}
              </button>
            </div>
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
            <button
              onClick={() => setShowCreateRoom(true)}
              className="px-4 py-2 bg-[#2D6A4F] text-white rounded-lg text-sm font-medium hover:bg-[#245a42] transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Room
            </button>
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

        {/* Loading State */}
        {loading && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#2D6A4F] mx-auto mb-4"></div>
            <p className="text-gray-500">Loading rooms...</p>
          </div>
        )}

        {/* Floor Header when viewing single floor */}
        {!loading && !showAllRooms && filteredRooms.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm p-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-800">
                Floor {selectedFloor} — {filteredRooms.length} Rooms
              </h2>
              <p className="text-sm text-gray-500">
                {filteredRooms.filter(r => r.status === "vacant").length} vacant • 
                {filteredRooms.filter(r => r.status === "partial").length} partially filled • 
                {filteredRooms.filter(r => r.status === "occupied").length} occupied
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedFloor(String(Math.max(1, parseInt(selectedFloor) - 1)))}
                disabled={selectedFloor === "1"}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <span className="text-sm text-gray-600 px-2">Floor {selectedFloor} of 8</span>
              <button
                onClick={() => setSelectedFloor(String(Math.min(8, parseInt(selectedFloor) + 1)))}
                disabled={selectedFloor === "8"}
                className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredRooms.length === 0 && (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="text-gray-500 mb-2">No rooms found</p>
            <p className="text-sm text-gray-400 mb-4">Click the "Add Room" button above to create new rooms</p>
            <button
              onClick={() => setShowCreateRoom(true)}
              className="inline-flex items-center gap-2 px-6 py-2 bg-[#2D6A4F] text-white rounded-lg font-medium hover:bg-[#245a42] transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Your First Room
            </button>
          </div>
        )}

        {/* Room Grid View */}
        {!loading && viewMode === "grid" && filteredRooms.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredRooms.map((room) => {
              const members = getRoomMembers(room);
              return (
                <div 
                  key={room.id} 
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleViewRoom(room)}
                >
                  {/* Room Header */}
                  <div className={`${getHeaderColor(room.status)} px-4 py-3 flex items-center justify-between`}>
                    <span className="text-white font-bold text-lg">Room {room.roomNumber}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      room.status === "occupied" ? "bg-white/20 text-white" : "bg-white text-gray-700"
                    }`}>
                      {room.occupiedBeds}/{room.capacity}
                    </span>
                  </div>
                  
                  {/* Room Content */}
                  <div className="p-4">
                    <div className="text-xs text-gray-500 mb-2">Floor {room.floor}</div>
                    
                    {room.status === "vacant" ? (
                      <div className="flex flex-col items-center justify-center h-20 text-gray-400">
                        <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="text-sm">Available for allocation</span>
                      </div>
                    ) : room.status === "maintenance" ? (
                      <div className="flex flex-col items-center justify-center h-20 text-red-400">
                        <svg className="w-8 h-8 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span className="text-sm">Under maintenance</span>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {members.slice(0, 3).map((member, index) => (
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
                        {members.length > 3 && (
                          <span className="text-xs text-gray-400">+{members.length - 3} more</span>
                        )}
                        {room.status === "partial" && (
                          <div className="text-sm text-[#40E0D0] font-medium mt-2">
                            {room.availableBeds} bed(s) available
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
              );
            })}
          </div>
        )}

        {/* Room List View */}
        {!loading && viewMode === "list" && filteredRooms.length > 0 && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Room</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Floor</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Occupancy</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Residents</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredRooms.map((room) => {
                  const members = getRoomMembers(room);
                  return (
                    <tr key={room.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <span className="font-medium text-gray-800">Room {room.roomNumber}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">Floor {room.floor}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${getHeaderColor(room.status)}`}
                              style={{ width: `${(room.occupiedBeds / room.capacity) * 100}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-600">{room.occupiedBeds}/{room.capacity}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex -space-x-2">
                          {members.slice(0, 3).map((member, index) => (
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
                          {members.length > 3 && (
                            <span className="w-7 h-7 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs text-gray-600">
                              +{members.length - 3}
                            </span>
                          )}
                          {members.length === 0 && (
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
                        <button 
                          onClick={() => handleViewRoom(room)}
                          className="text-[#2D6A4F] hover:underline text-sm font-medium"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Sidebar - Legend & Quick Stats */}
      <div className="w-72 space-y-4 hidden lg:block">
        {/* Occupancy Overview */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="text-sm font-medium text-gray-700 mb-4">Occupancy Overview</h3>
          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Total Occupancy</span>
                <span className="font-medium">{stats.totalBeds > 0 ? Math.round((stats.occupiedBeds / stats.totalBeds) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-[#2D6A4F] h-2 rounded-full transition-all"
                  style={{ width: `${stats.totalBeds > 0 ? (stats.occupiedBeds / stats.totalBeds) * 100 : 0}%` }}
                />
              </div>
            </div>
            <div className="pt-2 border-t border-gray-100">
              <p className="text-sm text-gray-500">
                <span className="font-bold text-gray-800">{stats.occupiedBeds}</span> of <span className="font-bold text-gray-800">{stats.totalBeds}</span> beds occupied
              </p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Room Status Legend</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-[#2D6A4F]" />
              <span className="text-sm text-gray-600">Fully Occupied ({stats.occupied})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-[#40E0D0]" />
              <span className="text-sm text-gray-600">Partially Filled ({stats.partial})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-green-500" />
              <span className="text-sm text-gray-600">Vacant ({stats.vacant})</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded bg-red-400" />
              <span className="text-sm text-gray-600">Under Maintenance ({stats.maintenance})</span>
            </div>
          </div>
        </div>

        {/* Hall Info */}
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Hall Information</h3>
          <div className="space-y-2 text-sm text-gray-600">
            <p>Total Floors: <span className="font-medium text-gray-800">8</span></p>
            <p>Rooms per Floor: <span className="font-medium text-gray-800">20</span></p>
            <p>Beds per Room: <span className="font-medium text-gray-800">4</span></p>
            <p>Total Capacity: <span className="font-medium text-gray-800">640 beds</span></p>
          </div>
        </div>
      </div>

      {/* Room Details Modal */}
      {showRoomDetails && selectedRoom && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-800">Room {selectedRoom.roomNumber}</h2>
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
                <p className="text-lg font-bold text-gray-800">{selectedRoom.occupiedBeds} / {selectedRoom.capacity}</p>
              </div>
            </div>

            {selectedRoom.amenities.length > 0 && (
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
            )}

            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-3">Beds & Residents</h3>
              <div className="grid grid-cols-2 gap-3">
                {selectedRoom.beds.map((bed) => (
                  <div 
                    key={bed.bedNumber} 
                    className={`p-4 rounded-lg border-2 ${
                      bed.isOccupied 
                        ? "border-[#2D6A4F] bg-green-50" 
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-800">Bed {bed.bedNumber}</span>
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        bed.isOccupied ? "bg-[#2D6A4F] text-white" : "bg-gray-200 text-gray-600"
                      }`}>
                        {bed.isOccupied ? "Occupied" : "Vacant"}
                      </span>
                    </div>
                    {bed.student ? (
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Image
                            src="/logos/profile.png"
                            alt={bed.student.fullName}
                            width={32}
                            height={32}
                            className="w-8 h-8 rounded-full"
                          />
                          <div>
                            <p className="text-sm font-medium text-gray-800">{bed.student.fullName}</p>
                            <p className="text-xs text-gray-500">{bed.student.studentId}</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => handleRemoveStudent(selectedRoom.id, bed.bedNumber)}
                          disabled={actionLoading}
                          className="text-red-500 hover:text-red-700 text-xs disabled:opacity-50"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-400">Available for allocation</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowRoomDetails(false)}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
              {selectedRoom.status === "maintenance" ? (
                <button 
                  onClick={() => handleUpdateRoomStatus(selectedRoom.id, "vacant")}
                  disabled={actionLoading}
                  className="flex-1 px-4 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {actionLoading ? "Updating..." : "Mark as Available"}
                </button>
              ) : (
                <button 
                  onClick={() => handleUpdateRoomStatus(selectedRoom.id, "maintenance")}
                  disabled={actionLoading || selectedRoom.occupiedBeds > 0}
                  className="flex-1 px-4 py-3 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title={selectedRoom.occupiedBeds > 0 ? "Remove allocated students before setting maintenance" : ""}
                >
                  {actionLoading ? "Updating..." : "Set to Maintenance"}
                </button>
              )}
            </div>
            {selectedRoom.status !== "maintenance" && selectedRoom.occupiedBeds > 0 && (
              <p className="mt-3 text-xs text-red-600">
                This room has allocated students. Remove all students before setting it to maintenance.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Create Room Dialog */}
      {showCreateRoom && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-800">Create New Room</h2>
                <button
                  onClick={() => setShowCreateRoom(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Mode Toggle */}
              <div className="flex items-center justify-center gap-2 bg-gray-100 rounded-lg p-1">
                <button
                  type="button"
                  onClick={() => setBulkMode(false)}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    !bulkMode ? "bg-white text-gray-800 shadow-sm" : "text-gray-600"
                  }`}
                >
                  Single Room
                </button>
                <button
                  type="button"
                  onClick={() => setBulkMode(true)}
                  className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    bulkMode ? "bg-white text-gray-800 shadow-sm" : "text-gray-600"
                  }`}
                >
                  Bulk Create
                </button>
              </div>

              {/* Floor Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Floor Number *
                </label>
                <select
                  value={createRoomData.floor}
                  onChange={(e) => setCreateRoomData({...createRoomData, floor: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map(floor => (
                    <option key={floor} value={floor}>Floor {floor}</option>
                  ))}
                </select>
              </div>

              {/* Room Number or Range */}
              {bulkMode ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Number Range *
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      value={bulkRoomRange.startRoom}
                      onChange={(e) => setBulkRoomRange({...bulkRoomRange, startRoom: e.target.value})}
                      placeholder="Start (e.g., 1)"
                      min="1"
                      max="99"
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                    />
                    <span className="text-gray-500">to</span>
                    <input
                      type="number"
                      value={bulkRoomRange.endRoom}
                      onChange={(e) => setBulkRoomRange({...bulkRoomRange, endRoom: e.target.value})}
                      placeholder="End (e.g., 20)"
                      min="1"
                      max="99"
                      className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                    />
                  </div>
                  {bulkRoomRange.startRoom && bulkRoomRange.endRoom && (
                    <p className="text-xs text-gray-500 mt-1">
                      Will create {Math.max(0, parseInt(bulkRoomRange.endRoom) - parseInt(bulkRoomRange.startRoom) + 1)} rooms
                    </p>
                  )}
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Room Number *
                  </label>
                  <input
                    type="text"
                    value={createRoomData.roomNumber}
                    onChange={(e) => setCreateRoomData({...createRoomData, roomNumber: e.target.value})}
                    placeholder="e.g., 01, 02, 103"
                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Display will be: {createRoomData.floor}{createRoomData.roomNumber.padStart(2, "0") || "XX"}
                  </p>
                </div>
              )}

              {/* Capacity */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Bed Capacity *
                </label>
                <select
                  value={createRoomData.capacity}
                  onChange={(e) => setCreateRoomData({...createRoomData, capacity: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                >
                  {[1, 2, 3, 4, 5, 6].map(cap => (
                    <option key={cap} value={cap}>{cap} Bed{cap > 1 ? 's' : ''}</option>
                  ))}
                </select>
              </div>

              {/* Amenities */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Amenities (Optional)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {["AC", "Fan", "Attached Bath", "Common Bath", "Balcony", "WiFi"].map(amenity => (
                    <button
                      key={amenity}
                      type="button"
                      onClick={() => handleToggleAmenity(amenity)}
                      className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                        createRoomData.amenities.includes(amenity)
                          ? "border-[#2D6A4F] bg-[#2D6A4F] text-white"
                          : "border-gray-200 text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      {amenity}
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-2">Summary</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  {bulkMode ? (
                    <>
                      <p>• Mode: Bulk Creation</p>
                      <p>• Floor: {createRoomData.floor}</p>
                      <p>• Rooms: {bulkRoomRange.startRoom && bulkRoomRange.endRoom 
                        ? `${createRoomData.floor}${bulkRoomRange.startRoom.padStart(2, "0")} to ${createRoomData.floor}${bulkRoomRange.endRoom.padStart(2, "0")}`
                        : "Not specified"}</p>
                      <p>• Count: {bulkRoomRange.startRoom && bulkRoomRange.endRoom 
                        ? Math.max(0, parseInt(bulkRoomRange.endRoom) - parseInt(bulkRoomRange.startRoom) + 1)
                        : 0} rooms</p>
                      <p>• Each room: {createRoomData.capacity} bed{createRoomData.capacity !== "1" ? 's' : ''}</p>
                      <p>• Amenities: {createRoomData.amenities.length > 0 ? createRoomData.amenities.join(", ") : "None"}</p>
                    </>
                  ) : (
                    <>
                      <p>• Floor: {createRoomData.floor}</p>
                      <p>• Room: {createRoomData.floor}{createRoomData.roomNumber.padStart(2, "0") || "XX"}</p>
                      <p>• Capacity: {createRoomData.capacity} bed{createRoomData.capacity !== "1" ? 's' : ''}</p>
                      <p>• Amenities: {createRoomData.amenities.length > 0 ? createRoomData.amenities.join(", ") : "None"}</p>
                    </>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={() => {
                  setShowCreateRoom(false);
                  setBulkMode(false);
                  setBulkRoomRange({ startRoom: "", endRoom: "" });
                }}
                className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRoom}
                disabled={actionLoading || (bulkMode ? (!bulkRoomRange.startRoom || !bulkRoomRange.endRoom) : !createRoomData.roomNumber)}
                className="flex-1 px-4 py-3 bg-[#2D6A4F] text-white rounded-lg font-medium hover:bg-[#245a42] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? "Creating..." : bulkMode ? "Create Rooms" : "Create Room"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
