"use client";

import ProfilePage, { ProfileData } from "@/components/common/profile_page";

export default function StaffProfilePage() {
  // This would typically come from an API/authentication context
  const staffData: ProfileData = {
    name: "Abdul Karim",
    email: "abdul.karim@hallbridge.edu",
    phone: "+880 1555-123456",
    avatar: "/logos/profile.png",
    role: "staff",
    joinedDate: "March 2020",
    staffId: "STAFF-2020-042",
    staffRole: "Mess Manager",
  };

  const handleSave = (data: ProfileData) => {
    console.log("Profile updated:", data);
    // TODO: Implement API call to save profile
  };

  return <ProfilePage initialData={staffData} onSave={handleSave} />;
}
