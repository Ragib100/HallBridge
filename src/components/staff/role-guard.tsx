'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useCurrentUser } from '@/hooks/use-current-user';
import type { StaffRole } from '@/types';

interface StaffRoleGuardProps {
  allowedRoles: StaffRole[];
  children: React.ReactNode;
}

/**
 * Component to protect staff pages based on their assigned role.
 * Redirects to staff home if the user doesn't have the required role.
 */
export function StaffRoleGuard({ allowedRoles, children }: StaffRoleGuardProps) {
  const { user, loading } = useCurrentUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;

    // If not staff, redirect to login
    if (!user || user.userType !== 'staff') {
      router.replace('/auth/login');
      return;
    }

    // If staff but no role assigned, show warning and stay on home
    if (!user.staffRole) {
      if (pathname !== '/dashboard/staff/home' && pathname !== '/dashboard/staff') {
        router.replace('/dashboard/staff/home');
      }
      return;
    }

    // If staff role doesn't match allowed roles, redirect to home
    if (!allowedRoles.includes(user.staffRole)) {
      router.replace('/dashboard/staff/home');
    }
  }, [user, loading, router, allowedRoles, pathname]);

  // Show loading while checking
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  // If not authenticated or not staff
  if (!user || user.userType !== 'staff') {
    return null;
  }

  // If role doesn't match
  if (user.staffRole && !allowedRoles.includes(user.staffRole)) {
    return null;
  }

  return <>{children}</>;
}

/**
 * Role label mapping for display
 */
export const ROLE_PAGES: Record<StaffRole, string> = {
  mess_manager: '/dashboard/staff/mess',
  financial_staff: '/dashboard/staff/expenses',
  maintenance_staff: '/dashboard/staff/maintenance',
  laundry_manager: '/dashboard/staff/laundry',
  security_guard: '/dashboard/staff/security',
};
