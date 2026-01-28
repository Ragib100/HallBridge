'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getIcon } from '@/components/common/icons';
import { useCurrentUser } from '@/hooks/use-current-user';
import { STAFF_ROLE_LABELS, type StaffRole } from '@/types';

interface CardInfo {
    title: string;
    value: number;
    icon: string;
    backgroundColor: string;
}

// Role-specific dashboard configurations
const roleConfigs: Record<StaffRole, {
    greeting: string;
    quickAccessCards: { title: string; description: string; icon: string; gradient: string; link: string }[];
    statsCards: CardInfo[];
}> = {
    mess_manager: {
        greeting: "Mess Manager",
        quickAccessCards: [
            { title: 'Weekly Menu', description: 'Update this week\'s menu', icon: '📋', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', link: '/dashboard/staff/mess' },
            { title: 'Meal Count', description: 'Today\'s meal statistics', icon: '🍽️', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', link: '/dashboard/staff/mess' },
            { title: 'Guest Meals', description: 'Pending guest meal requests', icon: '👥', gradient: 'linear-gradient(135deg, #1e88e5 0%, #0078d4 100%)', link: '/dashboard/staff/mess' },
            { title: 'Vote Results', description: 'View meal voting results', icon: '📊', gradient: 'linear-gradient(135deg, #2ecc71 0%, #16a085 100%)', link: '/dashboard/staff/mess' },
        ],
        statsCards: [
            { title: 'Today\'s Breakfast', value: 85, icon: '🍳', backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
            { title: 'Today\'s Lunch', value: 102, icon: '🍲', backgroundColor: 'linear-gradient(135deg, #2ecc71 0%, #16a085 100%)' },
            { title: 'Today\'s Dinner', value: 95, icon: '🍛', backgroundColor: 'linear-gradient(135deg, #9b51e0 0%, #3436d6 100%)' },
        ],
    },
    financial_staff: {
        greeting: "Financial Staff",
        quickAccessCards: [
            { title: 'Daily Expenses', description: 'Log today\'s expenses', icon: '💰', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', link: '/dashboard/staff/expenses' },
            { title: 'Meal Pricing', description: 'Update daily meal costs', icon: '🧾', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', link: '/dashboard/staff/expenses' },
            { title: 'Student Bills', description: 'Pending student bills', icon: '📄', gradient: 'linear-gradient(135deg, #1e88e5 0%, #0078d4 100%)', link: '/dashboard/staff/expenses' },
            { title: 'Reports', description: 'Financial reports', icon: '📊', gradient: 'linear-gradient(135deg, #2ecc71 0%, #16a085 100%)', link: '/dashboard/staff/expenses' },
        ],
        statsCards: [
            { title: 'Today\'s Expenses', value: 15200, icon: '💸', backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
            { title: 'Pending Bills', value: 23, icon: '📋', backgroundColor: 'linear-gradient(135deg, #2ecc71 0%, #16a085 100%)' },
            { title: 'Monthly Revenue', value: 245000, icon: '💵', backgroundColor: 'linear-gradient(135deg, #9b51e0 0%, #3436d6 100%)' },
        ],
    },
    maintenance_staff: {
        greeting: "Maintenance Staff",
        quickAccessCards: [
            { title: 'Open Requests', description: 'View pending requests', icon: '🔧', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', link: '/dashboard/staff/maintenance' },
            { title: 'In Progress', description: 'Ongoing repairs', icon: '⚙️', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', link: '/dashboard/staff/maintenance' },
            { title: 'Completed Today', description: 'Today\'s completed tasks', icon: '✅', gradient: 'linear-gradient(135deg, #1e88e5 0%, #0078d4 100%)', link: '/dashboard/staff/maintenance' },
            { title: 'Urgent', description: 'Priority requests', icon: '🚨', gradient: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', link: '/dashboard/staff/maintenance' },
        ],
        statsCards: [
            { title: 'Pending Requests', value: 12, icon: '📝', backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
            { title: 'In Progress', value: 5, icon: '🔨', backgroundColor: 'linear-gradient(135deg, #2ecc71 0%, #16a085 100%)' },
            { title: 'Completed Today', value: 8, icon: '✔️', backgroundColor: 'linear-gradient(135deg, #9b51e0 0%, #3436d6 100%)' },
        ],
    },
    laundry_manager: {
        greeting: "Laundry Manager",
        quickAccessCards: [
            { title: 'Pickup Schedule', description: 'Today\'s pickups', icon: '📅', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', link: '/dashboard/staff/laundry' },
            { title: 'In Progress', description: 'Items being washed', icon: '🧺', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', link: '/dashboard/staff/laundry' },
            { title: 'Ready for Delivery', description: 'Items to deliver', icon: '👕', gradient: 'linear-gradient(135deg, #1e88e5 0%, #0078d4 100%)', link: '/dashboard/staff/laundry' },
            { title: 'Delivery Schedule', description: 'Upcoming deliveries', icon: '🚚', gradient: 'linear-gradient(135deg, #2ecc71 0%, #16a085 100%)', link: '/dashboard/staff/laundry' },
        ],
        statsCards: [
            { title: 'Today\'s Pickups', value: 15, icon: '📦', backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
            { title: 'In Progress', value: 28, icon: '🔄', backgroundColor: 'linear-gradient(135deg, #2ecc71 0%, #16a085 100%)' },
            { title: 'Ready for Delivery', value: 12, icon: '✅', backgroundColor: 'linear-gradient(135deg, #9b51e0 0%, #3436d6 100%)' },
        ],
    },
    security_guard: {
        greeting: "Security Guard",
        quickAccessCards: [
            { title: 'Active Passes', description: 'Currently active gate passes', icon: '🎫', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', link: '/dashboard/staff/security' },
            { title: 'Verify Pass', description: 'Scan or verify passes', icon: '✅', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', link: '/dashboard/staff/security' },
            { title: 'Entry/Exit Log', description: 'Today\'s movement log', icon: '📋', gradient: 'linear-gradient(135deg, #1e88e5 0%, #0078d4 100%)', link: '/dashboard/staff/security' },
            { title: 'Late Returns', description: 'Overdue students', icon: '⚠️', gradient: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)', link: '/dashboard/staff/security' },
        ],
        statsCards: [
            { title: 'Students Out', value: 23, icon: '🚶', backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
            { title: 'Today\'s Entries', value: 45, icon: '↓', backgroundColor: 'linear-gradient(135deg, #2ecc71 0%, #16a085 100%)' },
            { title: 'Late Returns', value: 2, icon: '⏰', backgroundColor: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)' },
        ],
    },
};

// Default config for unknown roles
const defaultConfig = {
    greeting: "Operations Staff",
    quickAccessCards: [
        { title: 'Mess Management', description: 'Manage meals, menus & expenses', icon: '🍽️', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', link: '/dashboard/staff/mess' },
        { title: 'Maintenance', description: 'Handle repair requests', icon: '🔧', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', link: '/dashboard/staff/maintenance' },
        { title: 'Laundry Service', description: 'Track laundry status', icon: '👕', gradient: 'linear-gradient(135deg, #1e88e5 0%, #0078d4 100%)', link: '/dashboard/staff/laundry' },
        { title: 'Expenses', description: 'Log daily expenses', icon: '💰', gradient: 'linear-gradient(135deg, #2ecc71 0%, #16a085 100%)', link: '/dashboard/staff/expenses' },
    ],
    statsCards: [
        { title: 'Total Students', value: 120, icon: getIcon("student"), backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        { title: 'Total Rooms', value: 50, icon: getIcon("room"), backgroundColor: 'linear-gradient(135deg, #2ecc71 0%, #16a085 100%)' },
        { title: 'Students Inside', value: 97, icon: getIcon("pin"), backgroundColor: 'linear-gradient(135deg, #9b51e0 0%, #3436d6 100%)' },
    ],
};

export default function StaffHomePage() {
    const { user, loading } = useCurrentUser();
    const router = useRouter();
    const [messMealStats, setMessMealStats] = useState<CardInfo[]>(roleConfigs.mess_manager.statsCards)
    const [securityStats, setSecurityStats] = useState<CardInfo[]>(roleConfigs.security_guard.statsCards)

    // Redirect maintenance_staff to maintenance page (they don't have dashboard)
    useEffect(() => {
        if (!loading && user?.staffRole === 'maintenance_staff') {
            router.replace('/dashboard/staff/maintenance');
        }
    }, [user?.staffRole, loading, router]);
    
    // Get role-specific config
    const baseConfig = user?.staffRole ? roleConfigs[user.staffRole] : defaultConfig;
    let config = baseConfig;
    if (user?.staffRole === 'mess_manager') {
        config = { ...baseConfig, statsCards: messMealStats };
    } else if (user?.staffRole === 'security_guard') {
        config = { ...baseConfig, statsCards: securityStats };
    }
    const displayName = user?.fullName || "Staff";
    const roleLabel = user?.staffRole ? STAFF_ROLE_LABELS[user.staffRole] : "Staff";

    useEffect(() => {
        if (user?.staffRole === 'mess_manager') {
            fetchTodayMealCounts();
        } else if (user?.staffRole === 'security_guard') {
            fetchSecurityStats();
        }
    }, [user?.staffRole])

    const fetchTodayMealCounts = async () => {
        try {
            const response = await fetch('/api/common/meal-count?day=today')
            if (!response.ok) {
                throw new Error('Failed to fetch meal counts')
            }
            const data = await response.json()
            const mealCounts = data?.mealCounts || {}

            setMessMealStats([
                { title: "Today's Breakfast", value: mealCounts.breakfast ?? 0, icon: '🍳', backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
                { title: "Today's Lunch", value: mealCounts.lunch ?? 0, icon: '🍲', backgroundColor: 'linear-gradient(135deg, #2ecc71 0%, #16a085 100%)' },
                { title: "Today's Dinner", value: mealCounts.dinner ?? 0, icon: '🍛', backgroundColor: 'linear-gradient(135deg, #9b51e0 0%, #3436d6 100%)' },
            ])
        } catch (error) {
            setMessMealStats([
                { title: "Today's Breakfast", value: 0, icon: '🍳', backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
                { title: "Today's Lunch", value: 0, icon: '🍲', backgroundColor: 'linear-gradient(135deg, #2ecc71 0%, #16a085 100%)' },
                { title: "Today's Dinner", value: 0, icon: '🍛', backgroundColor: 'linear-gradient(135deg, #9b51e0 0%, #3436d6 100%)' },
            ])
        }
    }

    const fetchSecurityStats = async () => {
        try {
            const response = await fetch('/api/gate-pass')
            if (!response.ok) {
                throw new Error('Failed to fetch gate pass stats')
            }
            const data = await response.json()
            const passes = data?.passes || []

            const activeCount = passes.filter((p: any) => p.status === 'active').length
            const entriesCount = passes.filter((p: any) => {
                const today = new Date().toISOString().split('T')[0]
                return p.actualOutTime && p.actualOutTime.startsWith(today)
            }).length
            const lateCount = passes.filter((p: any) => p.status === 'late').length

            setSecurityStats([
                { title: 'Students Out', value: activeCount, icon: '🚶', backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
                { title: "Today's Entries", value: entriesCount, icon: '↓', backgroundColor: 'linear-gradient(135deg, #2ecc71 0%, #16a085 100%)' },
                { title: 'Late Returns', value: lateCount, icon: '⏰', backgroundColor: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)' },
            ])
        } catch (error) {
            setSecurityStats([
                { title: 'Students Out', value: 0, icon: '🚶', backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
                { title: "Today's Entries", value: 0, icon: '↓', backgroundColor: 'linear-gradient(135deg, #2ecc71 0%, #16a085 100%)' },
                { title: 'Late Returns', value: 0, icon: '⏰', backgroundColor: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)' },
            ])
        }
    }

    if (loading) {
        return (
            <div className="w-full min-h-screen p-4 md:p-6 lg:p-8 bg-gray-50 flex items-center justify-center">
                <div className="text-gray-500">Loading...</div>
            </div>
        );
    }

    return (
        <div className="w-full min-h-screen p-4 md:p-6 lg:p-8 bg-gray-50">
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                    Welcome, {displayName} 👋
                </h1>
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-[#2D6A4F] text-white rounded-full text-sm font-medium">
                        {roleLabel}
                    </span>
                    <p className="text-gray-600">
                        {new Date().toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </p>
                </div>
            </div>

            {/* Quick Access Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                {config.quickAccessCards.map((card, index) => (
                    <Card
                        key={index}
                        className="overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer"
                        style={{ backgroundImage: card.gradient }}
                        onClick={() => window.location.href = card.link}
                    >
                        <CardContent className="p-6 text-white">
                            <div className="flex items-start justify-between mb-4">
                                <div className="text-5xl">{card.icon}</div>
                                <div className="bg-white/20 rounded-full p-2">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold mb-2 drop-shadow-md">
                                {card.title}
                            </h3>
                            <p className="text-sm opacity-90 drop-shadow-md">{card.description}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Stats Overview */}
            <Card className="shadow-lg border border-gray-200 mb-8">
                <CardHeader className="border-b border-gray-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        📊 Today's Overview
                    </h2>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {config.statsCards.map((card, index) => (
                            <div key={index} className="text-center p-6 rounded-xl border border-blue-200" style={{ background: card.backgroundColor }}>
                                <div className="text-4xl mb-3">{card.icon}</div>
                                <p className="text-3xl font-bold text-white mb-1">
                                    {typeof card.value === 'number' && card.value > 1000 
                                        ? `৳${card.value.toLocaleString()}` 
                                        : card.value}
                                </p>
                                <p className="text-sm text-white font-medium">{card.title}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

        </div>
    );
}
