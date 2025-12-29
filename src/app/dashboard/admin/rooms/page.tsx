"use client";

import { useState } from "react";
import Image from "next/image";

type RoomStatus = "occupied" | "vacant" | "partial";

interface RoomMember {
  name: string;
}

interface Room {
  number: string;
  capacity: number;
  members: RoomMember[];
  status: RoomStatus;
}

interface RoommateRequest {
  id: string;
  name: string;
  studentId: string;
  avatar: string;
}

const rooms: Room[] = [
  { number: "201", capacity: 4, members: [{ name: "David Johnson" }, { name: "Michael Charter" }, { name: "Mark Wilson" }, { name: "Ethan Lowe" }], status: "occupied" },
  { number: "202", capacity: 4, members: [{ name: "David Johnson" }, { name: "Michael Charter" }, { name: "Mark Wilson" }, { name: "Ethan Lowe" }], status: "occupied" },
  { number: "203", capacity: 4, members: [{ name: "David Johnson" }, { name: "Michael Charter" }, { name: "Mark Wilson" }, { name: "Ethan Lowe" }], status: "occupied" },
  { number: "204", capacity: 4, members: [{ name: "David Johnson" }, { name: "Michael Charter" }], status: "partial" },
  { number: "205", capacity: 4, members: [], status: "vacant" },
  { number: "206", capacity: 4, members: [{ name: "David Johnson" }, { name: "Michael Charter" }, { name: "Mark Wilson" }, { name: "Ethan Lowe" }], status: "occupied" },
];

const roommateRequests: RoommateRequest[] = [
  { id: "1", name: "Ethan Lowe", studentId: "202314008", avatar: "/logos/profile.png" },
  { id: "2", name: "Ethan Lowe", studentId: "202314008", avatar: "/logos/profile.png" },
  { id: "3", name: "Ethan Lowe", studentId: "202314008", avatar: "/logos/profile.png" },
  { id: "4", name: "Ethan Lowe", studentId: "202314008", avatar: "/logos/profile.png" },
  { id: "5", name: "Ethan Lowe", studentId: "202314008", avatar: "/logos/profile.png" },
];

function getStatusColor(status: RoomStatus) {
  switch (status) {
    case "occupied":
      return "bg-[#2D6A4F] text-white";
    case "vacant":
      return "bg-gray-200 text-gray-600";
    case "partial":
      return "bg-yellow-100 text-yellow-700 border border-yellow-300";
    default:
      return "bg-gray-200 text-gray-600";
  }
}

function getStatusLabel(status: RoomStatus, capacity: number, memberCount: number) {
  switch (status) {
    case "occupied":
      return "Occupied";
    case "vacant":
      return `Vacant(${capacity})`;
    case "partial":
      return "Partially Occupied";
    default:
      return "";
  }
}

function getHeaderColor(status: RoomStatus) {
  switch (status) {
    case "occupied":
      return "bg-[#2D6A4F]";
    case "vacant":
      return "bg-gray-400";
    case "partial":
      return "bg-[#40E0D0]";
    default:
      return "bg-gray-400";
  }
}

export default function RoomAllocationPage() {
  const [selectedHall, setSelectedHall] = useState("maple");
  const [selectedFloor, setSelectedFloor] = useState("2nd");
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="flex gap-6 h-full">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        {/* Filters */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <select
              value={selectedHall}
              onChange={(e) => setSelectedHall(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
            >
              <option value="maple">Maple Hall</option>
              <option value="oak">Oak Hall</option>
              <option value="pine">Pine Hall</option>
            </select>
            <select
              value={selectedFloor}
              onChange={(e) => setSelectedFloor(e.target.value)}
              className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
            >
              <option value="1st">1st Floor</option>
              <option value="2nd">2nd Floor</option>
              <option value="3rd">3rd Floor</option>
              <option value="4th">4th Floor</option>
            </select>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search room, student..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-64 pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button className="px-4 py-2 bg-[#2D6A4F] text-white rounded-lg text-sm font-medium hover:bg-[#245840] transition-colors">
              Hall Settings
            </button>
          </div>
        </div>

        {/* Room Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <div key={room.number} className="bg-white rounded-xl shadow-sm overflow-hidden">
              {/* Room Header */}
              <div className={`${getHeaderColor(room.status)} px-4 py-2`}>
                <span className="text-white font-bold text-lg">{room.number}</span>
              </div>
              
              {/* Room Content */}
              <div className="p-4">
                {room.status === "vacant" ? (
                  <div className="flex items-center justify-center h-32 text-gray-400">
                    <span>Vacant({room.capacity})</span>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {room.members.map((member, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-blue-400 rounded-full" />
                        <span className="text-sm text-gray-700">{member.name}</span>
                      </div>
                    ))}
                    {room.status === "partial" && (
                      <div className="text-sm text-gray-400 mt-2">
                        Vacant({room.capacity - room.members.length})
                      </div>
                    )}
                  </div>
                )}
                
                {/* Status Badge */}
                <div className="mt-4">
                  <span className={`inline-block px-3 py-1 rounded-md text-xs font-medium ${getStatusColor(room.status)}`}>
                    {getStatusLabel(room.status, room.capacity, room.members.length)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Roommate Requests Sidebar */}
      <div className="w-72 bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Roommate Requests</h2>
        <div className="space-y-4">
          {roommateRequests.map((request) => (
            <div key={request.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Image
                  src={request.avatar}
                  alt={request.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-gray-800">{request.name}</p>
                  <p className="text-xs text-gray-500">{request.studentId}</p>
                </div>
              </div>
              <button className="px-3 py-1 bg-[#2D6A4F] text-white text-xs rounded-md hover:bg-[#245840] transition-colors">
                Allocate
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
