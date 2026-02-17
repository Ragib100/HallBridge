'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentUser } from '@/hooks/use-current-user';
import type { StaffRole } from '@/types';
import { Spinner } from '@/components/ui/spinner';

function getDefaultPathForRole(staffRole?: StaffRole): string {
  switch (staffRole) {
    case 'mess_manager': return '/dashboard/staff/mess/meal_count';
    case 'financial_staff': return '/dashboard/staff/financials';
    case 'maintenance_staff': return '/dashboard/staff/maintenance';
    case 'laundry_manager': return '/dashboard/staff/laundry';
    case 'security_guard': return '/dashboard/staff/security';
    default: return '/dashboard/staff/maintenance';
  }
}

export default function StaffHomePage() {
  const { user, loading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user?.staffRole) {
      router.replace(getDefaultPathForRole(user.staffRole));
    }
  }, [user, loading, router]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center">
        <Spinner className="w-8 h-8 text-[#2D6A4F] mx-auto mb-4" />
        <p className="text-gray-500">Redirecting to your workspace...</p>
      </div>
    </div>
  );
}
