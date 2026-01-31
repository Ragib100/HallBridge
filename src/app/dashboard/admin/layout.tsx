"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";
import { NotificationDropdown } from "@/components/common/notification_dropdown";
import { useState, useEffect } from "react";

const navItems = [
  { name: "Overview", path: "/dashboard/admin", icon: "grid" },
  { name: "User Management", path: "/dashboard/admin/users", icon: "users" },
  { name: "Maintenance", path: "/dashboard/admin/maintenance", icon: "maintenance" },
  { name: "Room Allocation", path: "/dashboard/admin/rooms", icon: "room" },
  { name: "Financials", path: "/dashboard/admin/financials", icon: "chart" },
  { name: "System Settings", path: "/dashboard/admin/settings", icon: "settings" },
];

function getPageTitle(pathname: string): { title: string; subtitle: string } {
  if (pathname === "/dashboard/admin") {
    return { title: "Dashboard", subtitle: "Welcome back, here's your overview" };
  } else if (pathname.includes("/users")) {
    return { title: "User Management", subtitle: "Manage students and staff accounts" };
  } else if (pathname.includes("/maintenance")) {
    return { title: "Maintenance", subtitle: "View and manage maintenance requests" };
  } else if (pathname.includes("/rooms")) {
    return { title: "Room Allocation", subtitle: "Manage room assignments and requests" };
  } else if (pathname.includes("/financials")) {
    return { title: "Financials", subtitle: "Track collections, expenses & reports" };
  } else if (pathname.includes("/settings")) {
    return { title: "System Settings", subtitle: "Configure system preferences" };
  } else if (pathname.includes("/profile")) {
    return { title: "Profile", subtitle: "Manage your account information" };
  }
  return { title: "Admin Panel", subtitle: "Hall management system" };
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
    case "grid":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      );
    case "users":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    case "room":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      );
    case "chart":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    case "settings":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    case "maintenance":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
        </svg>
      );
    default:
      return null;
  }
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const pageInfo = getPageTitle(pathname);
  const { user, loading } = useCurrentUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar when route changes (mobile)
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const displayName = loading ? "Loading..." : user?.fullName || "Unknown User";
  const displayRole = loading
    ? "Loading..."
    : user?.userType
      ? `${user.userType.charAt(0).toUpperCase()}${user.userType.slice(1)}`
      : "User";

  const isActive = (path: string) => {
    if (path === "/dashboard/admin") {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  const handleLogout = () => {
    router.push("/auth/login");
  };

  const handleProfile = () => {
    router.push("/dashboard/admin/profile");
  };

  return (
    <div className="flex min-h-screen bg-[#1a1d21]">
      {/* Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50
        w-64 bg-[#1a1d21] flex flex-col
        transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Close button */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
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
        <nav className="flex-1 px-2">
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
      <main className="flex-1 bg-[#f5f5f5] overflow-hidden">
        {/* Header */}
        <header className="bg-white px-4 md:px-8 py-4 flex items-center justify-between border-b border-gray-100">
          <div className="flex items-center gap-4">
            {/* Menu Toggle Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg"
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
            <div className="relative hidden md:block">
              <input
                type="text"
                placeholder="Search students, rooms, reports..."
                className="w-72 pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
              />
              <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
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
