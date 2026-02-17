'use client';

import { StaffRoleGuard } from "@/components/staff/role-guard";

export default function MealsLayout( { children } : { children: React.ReactNode } ) {
    return(
        <StaffRoleGuard allowedRoles={['mess_manager']}>
            {children}
        </StaffRoleGuard>
    );
}