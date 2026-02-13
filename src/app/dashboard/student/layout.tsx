"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/use-current-user";
import { NotificationDropdown } from "@/components/common/notification_dropdown";
import { useState, useEffect } from "react";
import { getBDDate } from "@/lib/dates";

const navItems = [
  { name: "Home", path: "/dashboard/student/home", icon: "home" },
  { name: "Meals", path: "/dashboard/student/meals", icon: "meals" },
  { name: "Billing", path: "/dashboard/student/billing", icon: "billing" },
  { name: "Gate Pass", path: "/dashboard/student/gate-pass", icon: "gatepass" },
  { name: "Maintenance", path: "/dashboard/student/maintenance", icon: "maintenance" },
  { name: "Laundry", path: "/dashboard/student/laundry", icon: "laundry" },
];

function getPageTitle(pathname: string): { title: string; subtitle: string } {
  if (pathname.includes("/home")) {
    return { title: "Dashboard", subtitle: "Welcome back, here's your overview" };
  } else if (pathname.includes("/meals")) {
    return { title: "Meals", subtitle: "Manage your meal preferences" };
  } else if (pathname.includes("/billing")) {
    return { title: "Billing", subtitle: "View your dues and invoices" };
  } else if (pathname.includes("/gate-pass")) {
    return { title: "Gate Pass", subtitle: "Request and track gate passes" };
  } else if (pathname.includes("/maintenance")) {
    return { title: "Maintenance", subtitle: "Submit and track maintenance requests" };
  } else if (pathname.includes("/laundry")) {
    return { title: "Laundry", subtitle: "Manage your laundry schedule" };
  } else if (pathname.includes("/profile")) {
    return { title: "Profile", subtitle: "Manage your account information" };
  }
  return { title: "Student Portal", subtitle: "Hall management system" };
}

function formatDate(): string {
  const options: Intl.DateTimeFormatOptions = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  return getBDDate().toLocaleDateString('en-US', options);
}

function NavIcon({ icon, className }: { icon: string; className?: string }) {
  switch (icon) {
    case "home":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      );
    case "meals":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    case "billing":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    case "gatepass":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
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
    default:
      return null;
  }
}

export default function StudentLayout({ children }: { children: React.ReactNode }) {
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
    if (path === "/dashboard/student/home") {
      return pathname === path;
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
    router.push("/dashboard/student/profile");
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
                  href={item.path === "/dashboard/student/meals" ? "/dashboard/student/meals/meal_selection" : 
                        item.path === "/dashboard/student/billing" ? "/dashboard/student/billing/current_dues" :
                        item.path === "/dashboard/student/maintenance" ? "/dashboard/student/maintenance/new_request" :
                        item.path}
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
      <main  className="flex-1 bg-[#f5f5f5] min-h-screen xl:overflow-hidden flex flex-col lg:ml-64" style={{ overscrollBehavior: 'none' }}>
        {/* Header */}
        <header className="bg-white px-4 md:px-8 py-4 flex items-center justify-between border-b border-gray-100" style={{ touchAction: 'pan-x pan-y pinch-zoom' }}>
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
                src={user?.picture || "/default_profile.svg"}
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
        <div className="flex-1 overflow-y-auto overflow-x-hidden xl:overscroll-none">
          <div className="p-4 md:p-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}