"use client";

import { useCallback, useEffect, useState } from "react";
import type { StaffRole } from "@/types";

type RoomAllocation = {
  roomId: string;
  roomNumber: string;
  floor: number;
  bedNumber?: number;
  hallId?: string;
  allocatedAt?: string;
};

type AcademicInfo = {
  department?: string;
  batch?: string;
  bloodGroup?: string;
  emergencyContact?: string;
};

export type CurrentUser = {
  id: string;
  fullName: string;
  email: string;
  userType: "student" | "staff" | "admin";
  picture?: string;

  studentId?: string;
  roomAllocation?: RoomAllocation;
  academicInfo?: AcademicInfo;

  staffRole?: StaffRole;

  phone?: string;
  isActive?: boolean;
  approvalStatus?: "pending" | "approved" | "rejected";
  mustChangePassword?: boolean;
  createdAt?: string;
};

type UseCurrentUserState = {
  user: CurrentUser | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

// Custom event name for user data updates
const USER_UPDATE_EVENT = "user-data-updated";

// Dispatch custom event to notify all hook instances
function notifyUserUpdate() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(USER_UPDATE_EVENT));
  }
}

export function useCurrentUser(): UseCurrentUserState {
  const [user, setUser] = useState<CurrentUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/auth/me");
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        const message = data?.message || "Not authenticated";
        setUser(null);
        setError(message);
        return;
      }

      const data = await response.json();
      setUser(data?.user ?? null);
      setError(null);
    } catch {
      setUser(null);
      setError("Failed to load user");
    } finally {
      setLoading(false);
    }
  }, []);

  const refetch = useCallback(async () => {
    await fetchUser();
    // Notify all other instances of this hook to refetch
    notifyUserUpdate();
  }, [fetchUser]);

  useEffect(() => {
    fetchUser();

    // Listen for user updates from other components
    const handleUserUpdate = () => {
      fetchUser();
    };

    window.addEventListener(USER_UPDATE_EVENT, handleUserUpdate);
    return () => {
      window.removeEventListener(USER_UPDATE_EVENT, handleUserUpdate);
    };
  }, [fetchUser]);

  return { user, loading, error, refetch };
}
