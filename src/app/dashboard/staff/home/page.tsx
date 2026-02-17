'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCurrentUser } from '@/hooks/use-current-user';
import { STAFF_ROLE_LABELS, type StaffRole } from '@/types';
import { getBDDate } from '@/lib/dates';

function StatsIcon({ icon, className }: { icon: string; className?: string }) {
  switch (icon) {
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
    case "security":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      );
    case "expenses":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    case "alert":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      );
    case "users":
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    default:
      return null;
  }
}

// Role-specific configurations
const roleConfigs: Record<StaffRole, {
    greeting: string;
    statsCards: { title: string; valueKey: string; icon: string; iconBgColor: string; textColor: string; link?: string; linkText?: string }[];
    quickActions: { title: string; icon: string; link: string; badge?: string }[];
}> = {
    mess_manager: {
        greeting: "Mess Manager",
        statsCards: [
            { title: "Today's Breakfast", valueKey: "breakfast", icon: "meals", iconBgColor: "bg-blue-100", textColor: "text-blue-600", link: "/dashboard/staff/mess/meal_count", linkText: "View details →" },
            { title: "Today's Lunch", valueKey: "lunch", icon: "meals", iconBgColor: "bg-green-100", textColor: "text-green-600", link: "/dashboard/staff/mess/meal_count", linkText: "View details →" },
            { title: "Today's Dinner", valueKey: "dinner", icon: "meals", iconBgColor: "bg-purple-100", textColor: "text-purple-600", link: "/dashboard/staff/mess/meal_count", linkText: "View details →" },
            { title: "Guest Breakfast", valueKey: "guestBreakfast", icon: "users", iconBgColor: "bg-yellow-100", textColor: "text-yellow-600", link: "/dashboard/staff/mess", linkText: "Manage →" },
            { title: "Guest Lunch", valueKey: "guestLunch", icon: "users", iconBgColor: "bg-orange-100", textColor: "text-orange-600", link: "/dashboard/staff/mess", linkText: "Manage →" },
            { title: "Guest Dinner", valueKey: "guestDinner", icon: "users", iconBgColor: "bg-pink-100", textColor: "text-pink-600", link: "/dashboard/staff/mess", linkText: "Manage →" },
        ],
        quickActions: [
            { title: "Update Weekly Menu", icon: "📋", link: "/dashboard/staff/mess/weekly_menu" },
            { title: "View Meal Count", icon: "🍽️", link: "/dashboard/staff/mess/meal_count" },
            { title: "Voting Results", icon: "📊", link: "/dashboard/staff/mess/voting_result" },
        ],
    },
    financial_staff: {
        greeting: "Financial Staff",
        statsCards: [
            { title: "Today's Expenses", valueKey: "todayExpenses", icon: "expenses", iconBgColor: "bg-red-100", textColor: "text-red-600" },
            { title: "Pending Bills", valueKey: "pendingBills", icon: "alert", iconBgColor: "bg-yellow-100", textColor: "text-yellow-600" },
            { title: "Monthly Collection", valueKey: "monthlyCollection", icon: "expenses", iconBgColor: "bg-green-100", textColor: "text-green-600" },
            { title: "Total Students", valueKey: "totalStudents", icon: "users", iconBgColor: "bg-blue-100", textColor: "text-blue-600" },
        ],
        quickActions: [
            { title: "Log Expense", icon: "💰", link: "/dashboard/staff/expenses" },
            { title: "View Reports", icon: "📊", link: "/dashboard/staff/expenses" },
            { title: "Student Bills", icon: "📄", link: "/dashboard/staff/expenses" },
        ],
    },
    maintenance_staff: {
        greeting: "Maintenance Staff",
        statsCards: [
            { title: "Pending Tasks", valueKey: "pending", icon: "maintenance", iconBgColor: "bg-yellow-100", textColor: "text-yellow-600", link: "/dashboard/staff/maintenance", linkText: "Handle now →" },
            { title: "In Progress", valueKey: "inProgress", icon: "maintenance", iconBgColor: "bg-blue-100", textColor: "text-blue-600", link: "/dashboard/staff/maintenance", linkText: "View tasks →" },
            { title: "Completed", valueKey: "completed", icon: "maintenance", iconBgColor: "bg-green-100", textColor: "text-green-600", link: "/dashboard/staff/maintenance", linkText: "Review →" },
            { title: "Urgent", valueKey: "urgent", icon: "alert", iconBgColor: "bg-red-100", textColor: "text-red-600", link: "/dashboard/staff/maintenance", linkText: "Prioritize →" },
        ],
        quickActions: [
            { title: "Open Maintenance Queue", icon: "🛠️", link: "/dashboard/staff/maintenance" },
            { title: "Start Pending Tasks", icon: "▶️", link: "/dashboard/staff/maintenance" },
            { title: "Update Task Status", icon: "✅", link: "/dashboard/staff/maintenance" },
        ],
    },
    laundry_manager: {
        greeting: "Laundry Manager",
        statsCards: [
            { title: "Today's Pickups", valueKey: "todayPickups", icon: "laundry", iconBgColor: "bg-blue-100", textColor: "text-blue-600" },
            { title: "In Progress", valueKey: "inProgress", icon: "laundry", iconBgColor: "bg-yellow-100", textColor: "text-yellow-600" },
            { title: "Ready for Delivery", valueKey: "readyForDelivery", icon: "laundry", iconBgColor: "bg-green-100", textColor: "text-green-600" },
            { title: "Completed Today", valueKey: "completedToday", icon: "laundry", iconBgColor: "bg-purple-100", textColor: "text-purple-600" },
        ],
        quickActions: [
            { title: "Pickup Schedule", icon: "📅", link: "/dashboard/staff/laundry" },
            { title: "In Progress", icon: "🧺", link: "/dashboard/staff/laundry" },
            { title: "Ready for Delivery", icon: "👕", link: "/dashboard/staff/laundry" },
        ],
    },
    security_guard: {
        greeting: "Security Guard",
        statsCards: [
            { title: "Students Out", valueKey: "studentsOut", icon: "security", iconBgColor: "bg-green-100", textColor: "text-green-600", link: "/dashboard/staff/security", linkText: "View active →" },
            { title: "Approved Passes", valueKey: "approvedPasses", icon: "security", iconBgColor: "bg-blue-100", textColor: "text-blue-600" },
            { title: "Late Returns", valueKey: "lateReturns", icon: "alert", iconBgColor: "bg-red-100", textColor: "text-red-600", link: "/dashboard/staff/security", linkText: "View late →" },
            { title: "Today's Logs", valueKey: "todayLogs", icon: "users", iconBgColor: "bg-purple-100", textColor: "text-purple-600" },
        ],
        quickActions: [
            { title: "Active Passes", icon: "🎫", link: "/dashboard/staff/security" },
            { title: "Verify Pass", icon: "✅", link: "/dashboard/staff/security" },
            { title: "Entry/Exit Log", icon: "📋", link: "/dashboard/staff/security" },
        ],
    },
};

export default function StaffHomePage() {
    const { user, loading } = useCurrentUser();
    const [stats, setStats] = useState<Record<string, number>>({});
    const [statsLoading, setStatsLoading] = useState(true);

    // Fetch role-specific stats
    useEffect(() => {
        const fetchStats = async () => {
            if (!user?.staffRole) return;
            
            try {
                setStatsLoading(true);
                
                if (user.staffRole === 'mess_manager') {
                    const response = await fetch('/api/common/meal-count?day=today');
                    if (response.ok) {
                        const data = await response.json();
                        const guestMealData = data?.guestMeals || {};
                        setStats({
                            breakfast: data?.mealCounts?.breakfast ?? 0,
                            lunch: data?.mealCounts?.lunch ?? 0,
                            dinner: data?.mealCounts?.dinner ?? 0,
                            guestBreakfast: guestMealData.guestBreakfast ?? 0,
                            guestLunch: guestMealData.guestLunch ?? 0,
                            guestDinner: guestMealData.guestDinner ?? 0,
                        });
                    }
                } else if (user.staffRole === 'security_guard') {
                    const response = await fetch('/api/common/gate-pass');
                    if (response.ok) {
                        const data = await response.json();
                        const passes = data?.passes || [];
                        setStats({
                            studentsOut: passes.filter((p: { status: string }) => p.status === 'active').length,
                            approvedPasses: passes.filter((p: { status: string }) => p.status === 'approved').length,
                            lateReturns: passes.filter((p: { status: string }) => p.status === 'late').length,
                            todayLogs: passes.length,
                        });
                    }
                } else if (user.staffRole === 'financial_staff') {
                    setStats({
                        todayExpenses: 0,
                        pendingBills: 0,
                        monthlyCollection: 0,
                        totalStudents: 0,
                    });
                } else if (user.staffRole === 'maintenance_staff') {
                    const response = await fetch('/api/common/maintenance');
                    if (response.ok) {
                        const data = await response.json();
                        const requests = data?.requests || [];
                        setStats({
                            pending: requests.filter((r: { status: string }) => r.status === 'pending').length,
                            inProgress: requests.filter((r: { status: string }) => r.status === 'in-progress').length,
                            completed: requests.filter((r: { status: string }) => r.status === 'completed').length,
                            urgent: requests.filter((r: { priority: string; status: string }) => r.priority === 'urgent' && r.status !== 'completed').length,
                        });
                    }
                } else if (user.staffRole === 'laundry_manager') {
                    setStats({
                        todayPickups: 0,
                        inProgress: 0,
                        readyForDelivery: 0,
                        completedToday: 0,
                    });
                }
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setStatsLoading(false);
            }
        };

        if (!loading && user?.staffRole) {
            fetchStats();
        }
    }, [user?.staffRole, loading]);

    const config = user?.staffRole ? roleConfigs[user.staffRole] : null;
    const displayName = user?.fullName || "Staff";
    const roleLabel = user?.staffRole ? STAFF_ROLE_LABELS[user.staffRole] : "Staff";

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-100">
                <div className="text-gray-500">Loading dashboard...</div>
            </div>
        );
    }

    if (!config) {
        return (
            <div className="flex items-center justify-center min-h-100">
                <div className="text-gray-500">No dashboard configuration found for your role.</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Welcome Banner */}
            <div className="bg-linear-to-r from-[#2D6A4F] to-[#40916C] rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold mb-1">
                            Welcome back, {displayName.split(' ')[0]}! 👋
                        </h1>
                        <p className="text-white/80">
                            Here&apos;s your dashboard overview for today
                        </p>
                    </div>
                    <div className="hidden md:block text-right">
                        <p className="text-sm text-white/80">Role</p>
                        <p className="font-semibold">{roleLabel}</p>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            {config.statsCards.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {config.statsCards.map((card, index) => (
                        <div key={index} className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-4">
                                <div className={`w-12 h-12 ${card.iconBgColor} rounded-xl flex items-center justify-center`}>
                                    <StatsIcon icon={card.icon} className={`w-6 h-6 ${card.textColor}`} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-gray-500 text-sm">{card.title}</p>
                                    <p className="text-2xl font-bold text-gray-800">
                                        {statsLoading ? '...' : (stats[card.valueKey] ?? 0)}
                                    </p>
                                    {card.link && card.linkText && (
                                        <Link href={card.link} className={`text-xs ${card.textColor} hover:underline`}>
                                            {card.linkText}
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Quick Actions */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        {config.quickActions.map((action, index) => (
                            <Link
                                key={index}
                                href={action.link}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{action.icon}</span>
                                    <span className="text-sm font-medium text-gray-700">{action.title}</span>
                                    {action.badge && (
                                        <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs rounded-full">
                                            {action.badge}
                                        </span>
                                    )}
                                </div>
                                <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Today's Overview */}
                <div className="bg-white rounded-xl p-6 shadow-sm lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-bold text-gray-800">Today&apos;s Overview</h2>
                        <span className="text-sm text-gray-500">
                            {getBDDate().toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                            })}
                        </span>
                    </div>
                    
                    <div className={`grid gap-4 ${config.statsCards.length > 4 ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-4'}`}>
                        {config.statsCards.map((card, index) => (
                            <div key={index} className={`p-4 ${card.iconBgColor.replace('-100', '-50')} rounded-lg text-center`}>
                                <p className="text-2xl font-bold text-gray-800">
                                    {statsLoading ? '...' : (stats[card.valueKey] ?? 0)}
                                </p>
                                <p className="text-sm text-gray-600">{card.title}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tips */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Tips & Reminders</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                        <span className="text-blue-500">💡</span>
                        <p className="text-sm text-gray-700">Check your pending tasks regularly for smooth operations.</p>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                        <span className="text-green-500">✓</span>
                        <p className="text-sm text-gray-700">Update statuses promptly to keep everyone informed.</p>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                        <span className="text-yellow-500">⚠️</span>
                        <p className="text-sm text-gray-700">Prioritize urgent items to maintain service quality.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
