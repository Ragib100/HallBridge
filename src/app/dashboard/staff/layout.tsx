"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useCurrentUser } from "@/hooks/use-current-user";
import type { StaffRole } from "@/types";
import { STAFF_ROLE_LABELS } from "@/types";
import { NotificationDropdown } from "@/components/common/notification_dropdown";

// Define which nav items each staff role can access
type NavItem = {
  name: string;
  path: string;
  icon: string;
  roles: StaffRole[]; // Which staff roles can see this item
};

const allNavItems: NavItem[] = [
  { 
    name: "Dashboard", 
    path: "/dashboard/staff/home", 
    icon: "dashboard",
    roles: ["mess_manager", "financial_staff", "laundry_manager", "security_guard"]
  },
  { 
    name: "Mess Management", 
    path: "/dashboard/staff/mess", 
    icon: "meals",
    roles: ["mess_manager"]
  },
  { 
    name: "Maintenance", 
    path: "/dashboard/staff/maintenance", 
    icon: "maintenance",
    roles: ["maintenance_staff"]
  },
  { 
    name: "Laundry", 
    path: "/dashboard/staff/laundry", 
    icon: "laundry",
    roles: ["laundry_manager"]
  },
  { 
    name: "Expenses", 
    path: "/dashboard/staff/expenses", 
    icon: "expenses",
    roles: ["financial_staff"]
  },
  { 
    name: "Security", 
    path: "/dashboard/staff/security", 
    icon: "security",
    roles: ["security_guard"]
  },
];

// Get navigation items for a specific staff role
function getNavItemsForRole(staffRole?: StaffRole): NavItem[] {
  if (!staffRole) {
    // If no role, show only dashboard (fallback)
    return allNavItems.filter(item => item.path === "/dashboard/staff/home");
  }
  return allNavItems.filter(item => item.roles.includes(staffRole));
}

// Get default path for a specific staff role
function getDefaultPathForRole(staffRole?: StaffRole): string {
  if (staffRole === "maintenance_staff") {
    return "/dashboard/staff/maintenance";
  }
  return "/dashboard/staff/home";
}

function getPageTitle(pathname: string): { title: string; subtitle: string } {
  if (pathname === "/dashboard/staff/home" || pathname === "/dashboard/staff") {
    return { title: "Dashboard", subtitle: "Welcome back, here's your overview" };
  } else if (pathname.includes("/mess")) {
    return { title: "Mess Management", subtitle: "Manage meals and menu" };
  } else if (pathname.includes("/maintenance")) {
    return { title: "Maintenance", subtitle: "Handle maintenance requests" };
  } else if (pathname.includes("/laundry")) {
    return { title: "Laundry", subtitle: "Manage laundry services" };
  } else if (pathname.includes("/expenses")) {
    return { title: "Expenses", subtitle: "Track and manage expenses" };
  } else if (pathname.includes("/security")) {
    return { title: "Security", subtitle: "Gate pass verification and access control" };
  } else if (pathname.includes("/profile")) {
    return { title: "Profile", subtitle: "Manage your account information" };
  }
  return { title: "Staff Portal", subtitle: "Hall management system" };
}

function formatDate(): string {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return new Date().toLocaleDateString('en-US', options);
}

function NavIcon({ icon, className }: { icon: string; className?: string }) {
  switch (icon) {
    case "dashboard":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      );
    case "meals":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    case "maintenance":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case "laundry":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      );
    case "expenses":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    case "security":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const pageInfo = getPageTitle(pathname);
  const { user, loading } = useCurrentUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  // Get navigation items based on staff role
  const navItems = getNavItemsForRole(user?.staffRole);

  const displayName = loading ? "Loading..." : user?.fullName || "Unknown User";
  const displayRole = loading
    ? "Loading..."
    : user?.staffRole
      ? STAFF_ROLE_LABELS[user.staffRole]
      : user?.userType
        ? `${user.userType.charAt(0).toUpperCase()}${user.userType.slice(1)}`
        : "Staff";

  const isActive = (path: string) => {
    if (path === "/dashboard/staff/home") {
      return pathname === path || pathname === "/dashboard/staff";
    }
    return pathname.startsWith(path);
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      router.push("/auth/login");
    }
  };

  const handleProfile = () => {
    router.push("/dashboard/staff/profile");
  };

  return (
    <div className="flex min-h-screen bg-[#1a1d21]">
      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50
        w-64 bg-[#1a1d21] flex flex-col h-screen overflow-y-auto
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Close button - only on mobile */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white lg:hidden"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Logo */}
        <div className="p-4">
          <Image
            src="/logos/vector/default-monochrome-white2.svg"
            alt="HallBridge"
            width={140}
            height={32}
            className="h-8 w-auto"
          />
        </div>

        {/* Menu Label */}
        <div className="px-4 py-2">
          <span className="text-gray-500 text-xs uppercase tracking-wider">Menu</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 overflow-y-auto">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? "bg-[#2D6A4F] text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <NavIcon icon={item.icon} className="w-5 h-5" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Bottom Section */}
        <div className="p-4">
          {/* App Info */}
          <div className="text-center text-gray-500 text-xs">
            <p>HallBridge v1.0</p>
            <p className="mt-1">© 2026 All rights reserved</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-[#f5f5f5] overflow-hidden lg:ml-64">
        {/* Header */}
        <header className="bg-white px-4 md:px-8 py-4 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-4">
            {/* Menu Toggle Button - only on mobile */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg lg:hidden"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-gray-800">{pageInfo.title}</h1>
              <p className="text-gray-500 text-xs md:text-sm hidden sm:block">{formatDate()}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
            <NotificationDropdown />
            {/* Profile */}
            <button
              onClick={handleProfile}
              className="flex items-center gap-2 hover:bg-gray-100 rounded-lg p-1.5 transition-colors"
            >
              <Image
                src="/logos/profile.png"
                alt="Profile"
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="hidden md:block text-sm font-medium text-gray-700">{displayName}</span>
            </button>
            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 md:p-8 overflow-auto h-[calc(100vh-80px)]">
          {children}
        </div>
      </main>
    </div>
  );
}