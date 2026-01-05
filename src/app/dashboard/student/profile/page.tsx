"use client";

import ProfilePage, { ProfileData } from "@/components/common/profile_page";

export default function StudentProfilePage() {
  // This would typically come from an API/authentication context
  const studentData: ProfileData = {
    name: "Rahul Khan",
    email: "rahul.khan@university.edu",
    phone: "+880 1234-567890",
    avatar: "/logos/profile.png",
    role: "student",
    joinedDate: "January 2022",
    studentId: "STU-2022-0145",
    department: "Computer Science & Engineering",
    batch: "2022",
    year: "3rd Year",
    roomNumber: "B-301",
    bloodGroup: "B+",
    emergencyContact: "+880 1987-654321",
    address: "123 Main Street, Dhaka, Bangladesh"
  };

  const handleSave = (data: ProfileData) => {
    console.log("Profile updated:", data);
    // TODO: Implement API call to save profile
  };

  return <ProfilePage initialData={studentData} onSave={handleSave} />;
}
