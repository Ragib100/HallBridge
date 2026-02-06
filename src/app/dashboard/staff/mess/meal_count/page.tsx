"use client"

import { useEffect, useState } from 'react'

interface MealCount {
    type: 'breakfast' | 'lunch' | 'dinner';
    count: number;
}

interface DayMealData {
    meals: MealCount[];
    guestMeals: MealCount[];
}

export default function MealCountPage() {
    const [todayData, setTodayData] = useState<DayMealData>({ meals: [], guestMeals: [] })
    const [tomorrowData, setTomorrowData] = useState<DayMealData>({ meals: [], guestMeals: [] })
    const [totalStudents, setTotalStudents] = useState(0)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchMealCounts = async () => {
            try {
                setLoading(true)
                setError(null)
                
                const [todayResponse, tomorrowResponse] = await Promise.all([
                    fetch('/api/common/meal-count?day=today'),
                    fetch('/api/common/meal-count?day=tomorrow')
                ])

                if (!todayResponse.ok || !tomorrowResponse.ok) {
                    throw new Error('Failed to fetch meal counts')
                }

                const todayDataRes = await todayResponse.json()
                const tomorrowDataRes = await tomorrowResponse.json()

                const todayMealCounts = todayDataRes?.mealCounts || {}
                setTodayData({
                    meals: [
                        { type: 'breakfast', count: todayMealCounts.breakfast ?? 0 },
                        { type: 'lunch', count: todayMealCounts.lunch ?? 0 },
                        { type: 'dinner', count: todayMealCounts.dinner ?? 0 },
                    ],
                    guestMeals: [
                        { type: 'breakfast', count: todayDataRes?.guestMeals?.guestBreakfast ?? 0 },
                        { type: 'lunch', count: todayDataRes?.guestMeals?.guestLunch ?? 0 },
                        { type: 'dinner', count: todayDataRes?.guestMeals?.guestDinner ?? 0 },
                    ]
                })

                const tomorrowMealCounts = tomorrowDataRes?.mealCounts || {}
                setTomorrowData({
                    meals: [
                        { type: 'breakfast', count: tomorrowMealCounts.breakfast ?? 0 },
                        { type: 'lunch', count: tomorrowMealCounts.lunch ?? 0 },
                        { type: 'dinner', count: tomorrowMealCounts.dinner ?? 0 },
                    ],
                    guestMeals: [
                        { type: 'breakfast', count: tomorrowDataRes?.guestMeals?.guestBreakfast ?? 0 },
                        { type: 'lunch', count: tomorrowDataRes?.guestMeals?.guestLunch ?? 0 },
                        { type: 'dinner', count: tomorrowDataRes?.guestMeals?.guestDinner ?? 0 },
                    ]
                })

                setTotalStudents(todayDataRes?.totalStudents ?? 0)
            } catch (err) {
                alert("Failed to load meal counts. Please try again later.");
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
                <div className="flex items-center gap-3">
                    <span className="text-2xl">📋</span>
                    <div>
                        <h2 className="text-lg font-bold text-gray-800">Meal Count Overview</h2>
                        <p className="text-sm text-gray-500">Students who opted in for meals</p>
                    </div>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            )}

            {/* Today's Meals */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <span>📅</span> Today&apos;s Meals
                    </h3>
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                        Current
                    </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {todayData.meals.map((meal) => {
                        const colors = getMealColors(meal.type)
                        return (
                            <div key={meal.type} className={`${colors.bg} rounded-xl p-6 shadow-sm`}>
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
                <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        <p className="font-semibold text-gray-700">Guest Meals Today</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {todayData.guestMeals.map((meal) => {
                            const colors = getMealColors(meal.type)
                            return (
                                <div key={`guest-${meal.type}`} className="bg-green-50 rounded-lg p-3 text-center border border-green-100">
                                    <p className="text-xs text-gray-500 capitalize mb-1">{meal.type}</p>
                                    <p className="text-2xl font-bold text-green-600">+{meal.count}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Tomorrow's Meals */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <span>🌅</span> Tomorrow&apos;s Meals
                    </h3>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                        Auto updates at 11 PM
                    </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {tomorrowData.meals.map((meal) => {
                        const colors = getMealColors(meal.type)
                        return (
                            <div key={meal.type} className={`${colors.bg} rounded-xl p-6 shadow-sm`}>
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
                <div className="mt-4 space-y-3">
                    <div className="flex items-center gap-2 mb-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        <p className="font-semibold text-gray-700">Guest Meals Tomorrow</p>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {tomorrowData.guestMeals.map((meal) => {
                            const colors = getMealColors(meal.type)
                            return (
                                <div key={`guest-${meal.type}`} className="bg-green-50 rounded-lg p-3 text-center border border-green-100">
                                    <p className="text-xs text-gray-500 capitalize mb-1">{meal.type}</p>
                                    <p className="text-2xl font-bold text-green-600">+{meal.count}</p>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div>
    )
}
