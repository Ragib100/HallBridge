'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getIcon } from '@/components/common/icons';

interface CardInfo {
    title: string;
    value: number;
    icon: string;
    backgroundColor: string;
}

export default function StaffHomePage() {

    const [cards, setCards] = useState<CardInfo[]>([
        { title: 'Total Students', value: 120, icon: getIcon("student"), backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
        { title: 'Total Rooms', value: 50, icon: getIcon("room"), backgroundColor: 'linear-gradient(135deg, #2ecc71 0%, #16a085 100%)' },
        { title: 'Students Inside', value: 97, icon: getIcon("pin"), backgroundColor: 'linear-gradient(135deg, #9b51e0 0%, #3436d6 100%)' }
    ]);

    const quickAccessCards = [
        {
            title: 'Mess Management',
            description: 'Manage meals, menus & expenses',
            icon: '🍽️',
            gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            link: '/dashboard/staff/mess'
        },
        {
            title: 'Maintenance',
            description: 'Handle repair requests',
            icon: '🔧',
            gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            link: '/dashboard/staff/maintenance'
        },
        {
            title: 'Laundry Service',
            description: 'Track laundry status',
            icon: '👕',
            gradient: 'linear-gradient(135deg, #1e88e5 0%, #0078d4 100%)',
            link: '/dashboard/staff/laundry'
        },
        {
            title: 'Expenses',
            description: 'Log daily expenses',
            icon: '💰',
            gradient: 'linear-gradient(135deg, #2ecc71 0%, #16a085 100%)',
            link: '/dashboard/staff/expenses'
        }
    ];

    return (
        <div className="w-full min-h-screen p-4 md:p-6 lg:p-8 bg-gray-50">
            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                    Welcome, Operations Staff 👋
                </h1>
                <p className="text-gray-600">
                    {new Date().toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    })}
                </p>
            </div>

            {/* Quick Access Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
                {quickAccessCards.map((card, index) => (
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

            <Card className="shadow-lg border border-gray-200 mb-8">
                <CardHeader className="border-b border-gray-200 bg-linear-to-r from-indigo-50 to-purple-50">
                    <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        🏛️ Hall Overview
                    </h2>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="justify-around flex">
                        {cards.map((card, index) => (
                            <div key={index} className="w-[30%] text-center p-6 rounded-xl border border-blue-200" style={{ background: card.backgroundColor }}>
                                <div className="text-4xl mb-3">{card.icon}</div>
                                <p className="text-3xl font-bold text-white mb-1">{card.value}</p>
                                <p className="text-sm text-white font-medium">{card.title}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
