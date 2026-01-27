"use client";

import { useCallback, useEffect, useState } from "react";
import type { StaffRole } from "@/types";

export type CurrentUser = {
  id: string;
  fullName: string;
  email: string;
  userType: "student" | "staff" | "admin";
  staffRole?: StaffRole;
  phone?: string;
  isActive?: boolean;
  createdAt?: string;
};

type UseCurrentUserState = {
  user: CurrentUser | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
};

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

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { user, loading, error, refetch: fetchUser };
}
