"use client"

import { useEffect, useState } from 'react'

interface MealCount {
    type: 'breakfast' | 'lunch' | 'dinner';
    count: number;
}

export default function MealCountPage() {
    const [meals, setMeals] = useState<MealCount[]>([])
    const [totalStudents, setTotalStudents] = useState(0)
    const [guestMeals, setGuestMeals] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchMealCounts = async () => {
            try {
                setLoading(true)
                setError(null)
                const response = await fetch('/api/common/meal-count')
                if (!response.ok) {
                    throw new Error('Failed to fetch meal counts')
                }
                const data = await response.json()

                const mealCounts = data?.mealCounts || {}
                setMeals([
                    { type: 'breakfast', count: mealCounts.breakfast ?? 0 },
                    { type: 'lunch', count: mealCounts.lunch ?? 0 },
                    { type: 'dinner', count: mealCounts.dinner ?? 0 },
                ])

                setTotalStudents(data?.totalStudents ?? 0)
                setGuestMeals(data?.guestMeals ?? 0)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load data')
                setMeals([
                    { type: 'breakfast', count: 0 },
                    { type: 'lunch', count: 0 },
                    { type: 'dinner', count: 0 },
                ])
            } finally {
                setLoading(false)
            }
        }

        fetchMealCounts()
    }, [])

    const getMealIcon = (type: string) => {
        switch (type) {
            case 'breakfast': return '🍳';
            case 'lunch': return '🍲';
            case 'dinner': return '🍛';
            default: return '🍽️';
        }
    }

    const getMealColors = (type: string) => {
        switch (type) {
            case 'breakfast': return { bg: 'bg-blue-50', iconBg: 'bg-blue-100', text: 'text-blue-600' };
            case 'lunch': return { bg: 'bg-yellow-50', iconBg: 'bg-yellow-100', text: 'text-yellow-600' };
            case 'dinner': return { bg: 'bg-green-50', iconBg: 'bg-green-100', text: 'text-green-600' };
            default: return { bg: 'bg-gray-50', iconBg: 'bg-gray-100', text: 'text-gray-600' };
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-75">
                <div className="text-gray-500">Loading meal counts...</div>
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">📋</span>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Tomorrow&apos;s Meal Count</h2>
                            <p className="text-sm text-gray-500">Students who opted in for meals</p>
                        </div>
                    </div>
                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                        Auto updates at 11 PM
                    </span>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Meal Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {meals.map((meal) => {
                    const colors = getMealColors(meal.type)
                    return (
                        <div key={meal.type} className={`${colors.bg} rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow`}>
                            <div className="text-center">
                                <div className={`w-16 h-16 ${colors.iconBg} rounded-full flex items-center justify-center mx-auto mb-4`}>
                                    <span className="text-3xl">{getMealIcon(meal.type)}</span>
                                </div>
                                <p className={`text-5xl font-bold ${colors.text} mb-2`}>{meal.count}</p>
                                <p className="text-gray-600 font-medium capitalize">{meal.type}</p>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Info Footer */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Total Students</p>
                            <p className="text-xl font-bold text-gray-800">{totalStudents} residents</p>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-4 p-4 bg-green-50 rounded-lg">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Guest Meals</p>
                            <p className="text-xl font-bold text-green-600">+{guestMeals} requests</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
