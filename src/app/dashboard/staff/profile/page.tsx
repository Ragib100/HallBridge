"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfilePage, { ProfileData } from "@/components/common/profile_page";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function StaffProfilePage() {
  const router = useRouter();
  const { user, loading, error } = useCurrentUser();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner className="w-6 h-6 text-[#2D6A4F]" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <p className="text-sm text-red-600 text-center">Unable to load profile.</p>
    );
  }

  const joinedDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      })
    : "Not Set";

  const staffData: ProfileData = {
    name: user.fullName,
    email: user.email,
    phone: "",
    avatar: "/logos/profile.png",
    role: user.userType,
    joinedDate,
    staffRole: "Staff",
  };

  const handleSave = (data: ProfileData) => {
    console.log("Profile updated:", data);
    // TODO: Implement API call to save profile
  };

  return <ProfilePage initialData={staffData} onSave={handleSave} />;
}
