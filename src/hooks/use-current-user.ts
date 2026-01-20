"use client";

import { useEffect, useState } from "react";

export type CurrentUser = {
  id: string;
  fullName: string;
  email: string;
  userType: "student" | "staff" | "admin";
  createdAt?: string;
};

type UseCurrentUserState = {
  user: CurrentUser | null;
  loading: boolean;
  error: string | null;
};

export function useCurrentUser(): UseCurrentUserState {
  const [state, setState] = useState<UseCurrentUserState>({
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    async function loadCurrentUser() {
      try {
        const response = await fetch("/api/auth/me");
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          const message = data?.message || "Not authenticated";
          if (!isMounted) return;
          setState({ user: null, loading: false, error: message });
          return;
        }

        const data = await response.json();
        if (!isMounted) return;
        setState({ user: data?.user ?? null, loading: false, error: null });
      } catch (error) {
        if (!isMounted) return;
        setState({ user: null, loading: false, error: "Failed to load user" });
      }
    }

    loadCurrentUser();

    return () => {
      isMounted = false;
    };
  }, []);

  return state;
}
