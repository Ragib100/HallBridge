"use client";

import { useState } from "react";
import Image from "next/image";

export type UserRole = "admin" | "student" | "staff";

export interface ProfileData {
  // Common fields
  name: string;
  email: string;
  phone: string;
  avatar: string;
  role: UserRole;
  joinedDate: string;

  // Student specific
  studentId?: string;
  department?: string;
  batch?: string;
  year?: string;
  roomNumber?: string;
  bloodGroup?: string;
  emergencyContact?: string;
  address?: string;

  // Staff specific
  staffId?: string;
  staffRole?: string;

  // Admin specific
  adminRole?: string;
}

interface ProfilePageProps {
  initialData: ProfileData;
  onSave?: (data: ProfileData) => Promise<boolean>;
}

export default function ProfilePage({ initialData, onSave }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>(initialData);

  const displayValue = (value?: string, fallback = "Not Set") =>
    value && value.trim().length > 0 ? value : fallback;

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
    setSaveError(null);
  };

  const handleSave = async () => {
    if (!onSave) {
      setIsEditing(false);
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const success = await onSave(profileData);
      if (success) {
        setIsEditing(false);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError("Failed to update profile. Please try again.");
      }
    } catch {
      setSaveError("An error occurred. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setProfileData(initialData);
    setSaveError(null);
  };

  const getRoleLabel = () => {
    switch (profileData.role) {
      case "admin":
        return displayValue(profileData.adminRole, "Administrator");
      case "staff":
        return displayValue(profileData.staffRole, "Staff");
      case "student":
        if (profileData.department && profileData.year) {
          return `${profileData.department} - ${profileData.year}`;
        }
        return "Student";
      default:
        return "";
    }
  };

  const getRoleBadgeColor = () => {
    switch (profileData.role) {
      case "admin":
        return "bg-purple-100 text-purple-700";
      case "staff":
        return "bg-blue-100 text-blue-700";
      case "student":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Header Card */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="relative">
            <Image
              src={profileData.avatar}
              alt={profileData.name}
              width={96}
              height={96}
              className="w-24 h-24 rounded-full object-cover border-4 border-[#2D6A4F]/20"
            />
            {isEditing && (
              <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#2D6A4F] text-white rounded-full flex items-center justify-center hover:bg-[#245840] transition-colors">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            )}
          </div>
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-2xl font-bold text-gray-800">{displayValue(profileData.name, "Unknown User")}</h2>
            <p className="text-gray-500">{displayValue(profileData.email)}</p>
            <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleBadgeColor()}`}>
                {profileData.role.charAt(0).toUpperCase() + profileData.role.slice(1)}
              </span>
              <span className="text-sm text-gray-500">{getRoleLabel()}</span>
            </div>
          </div>
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="px-4 py-2 bg-[#2D6A4F] text-white rounded-lg hover:bg-[#245840] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-[#2D6A4F] text-white rounded-lg hover:bg-[#245840] transition-colors font-medium flex items-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
                Edit Profile
              </button>
            )}
          </div>
        </div>

        {/* Success/Error Messages */}
        {saveSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
            Profile updated successfully!
          </div>
        )}
        {saveError && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {saveError}
          </div>
        )}
      </div>

      {/* Profile Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Personal Information */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Personal Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none"
                />
              ) : (
                <p className="p-3 bg-gray-50 rounded-lg text-gray-800">
                  {displayValue(profileData.name, "Unknown")}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
                {isEditing && (
                  <span className="text-xs text-gray-500 ml-2">(cannot be changed)</span>
                )}
              </label>
              <p className="p-3 bg-gray-50 rounded-lg text-gray-800">
                {displayValue(profileData.email)}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none"
                />
              ) : (
                <p className="p-3 bg-gray-50 rounded-lg text-gray-800">{displayValue(profileData.phone)}</p>
              )}
            </div>

            {profileData.address && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none resize-none"
                  />
                ) : (
                    <p className="p-3 bg-gray-50 rounded-lg text-gray-800">{displayValue(profileData.address)}</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Role-Specific Information */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-bold text-gray-800 mb-6">
            {profileData.role === "student" ? "Academic Information" : 
             profileData.role === "staff" ? "Employment Details" : "Account Details"}
          </h3>
          <div className="space-y-4">
            {/* Student Fields */}
            {profileData.role === "student" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Student ID</label>
                    <p className="p-3 bg-gray-50 rounded-lg text-gray-800 font-mono">{displayValue(profileData.studentId)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Room Number</label>
                    <p className="p-3 bg-gray-50 rounded-lg text-gray-800">{profileData.roomNumber || "Not Assigned"}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <p className="p-3 bg-gray-50 rounded-lg text-gray-800">{displayValue(profileData.department)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
                    <p className="p-3 bg-gray-50 rounded-lg text-gray-800">{displayValue(profileData.year)}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Batch</label>
                    <p className="p-3 bg-gray-50 rounded-lg text-gray-800">{displayValue(profileData.batch)}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Blood Group</label>
                    {isEditing ? (
                      <select
                        name="bloodGroup"
                        value={profileData.bloodGroup}
                        onChange={handleInputChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none bg-white"
                      >
                        <option value="">Select</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                      </select>
                    ) : (
                      <p className="p-3 bg-gray-50 rounded-lg text-gray-800">{profileData.bloodGroup || "Not Set"}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Emergency Contact</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      name="emergencyContact"
                      value={profileData.emergencyContact}
                      onChange={handleInputChange}
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none"
                    />
                  ) : (
                    <p className="p-3 bg-gray-50 rounded-lg text-gray-800">{profileData.emergencyContact || "Not Set"}</p>
                  )}
                </div>
              </>
            )}

            {/* Staff Fields */}
            {profileData.role === "staff" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Staff ID</label>
                  <p className="p-3 bg-gray-50 rounded-lg text-gray-800 font-mono">{displayValue(profileData.staffId)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role/Position</label>
                  <p className="p-3 bg-gray-50 rounded-lg text-gray-800">{displayValue(profileData.staffRole)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Joined Date</label>
                  <p className="p-3 bg-gray-50 rounded-lg text-gray-800">{displayValue(profileData.joinedDate)}</p>
                </div>
              </>
            )}

            {/* Admin Fields */}
            {profileData.role === "admin" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Admin Role</label>
                  <p className="p-3 bg-gray-50 rounded-lg text-gray-800">{displayValue(profileData.adminRole, "Administrator")}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Joined Date</label>
                  <p className="p-3 bg-gray-50 rounded-lg text-gray-800">{displayValue(profileData.joinedDate)}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Security</h3>
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div>
            <p className="font-medium text-gray-800">Password</p>
            <p className="text-sm text-gray-500">Last changed 30 days ago</p>
          </div>
          <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium">
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
}
