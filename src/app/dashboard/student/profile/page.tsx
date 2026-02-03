"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfilePage, { ProfileData } from "@/components/common/profile_page";
import { Spinner } from "@/components/ui/spinner";
import { useCurrentUser } from "@/hooks/use-current-user";

export default function StudentProfilePage() {
  const router = useRouter();
  const { user, loading, error, refetch } = useCurrentUser();

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

  const studentData: ProfileData = {
    name: user.fullName,
    email: user.email,
    phone: user.phone || "",
    picture: user.picture || "",
    role: user.userType,
    joinedDate,
    studentId: user.studentId,
    roomNumber: user.roomAllocation?.roomNumber,
    department: user.academicInfo?.department,
    batch: user.academicInfo?.batch,
    bloodGroup: user.academicInfo?.bloodGroup,
    emergencyContact: user.academicInfo?.emergencyContact,
  };

  const handleSave = async (data: ProfileData): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: data.name,
          phone: data.phone,
          picture: data.picture,
          academicInfo: {
            department: data.department,
            batch: data.batch,
            bloodGroup: data.bloodGroup,
            emergencyContact: data.emergencyContact,
          },
        }),
      });

      if (response.ok) {
        await refetch();
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  return <ProfilePage initialData={studentData} onSave={handleSave} />;
}
