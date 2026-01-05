"use client";

import ProfilePage, { ProfileData } from "@/components/common/profile_page";

export default function AdminProfilePage() {
  // This would typically come from an API/authentication context
  const adminData: ProfileData = {
    name: "Saif Ahmed",
    email: "saif.ahmed@hallbridge.edu",
    phone: "+880 1777-888999",
    avatar: "/logos/profile.png",
    role: "admin",
    joinedDate: "January 2019",
    adminRole: "Super Administrator",
  };

  const handleSave = (data: ProfileData) => {
    console.log("Profile updated:", data);
    // TODO: Implement API call to save profile
  };

  return <ProfilePage initialData={adminData} onSave={handleSave} />;
}
