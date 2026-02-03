"use client"

import { useEffect, useState } from 'react'

interface MealRating {
    mealTime: string;
    icon: string;
    avgRating: number;
    totalReviews: number;
}

export default function VotingResultPage() {
    const [mealRatings, setMealRatings] = useState<MealRating[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchVotingResults = async () => {
            try {
                const response = await fetch('/api/staff/meals/voting-results')
                const data = await response.json()
                if (data.mealRatings) {
                    setMealRatings(data.mealRatings)
                }
            } catch (error) {
                console.error('Error fetching voting results:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchVotingResults()
    }, [])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-75">
                <div className="text-gray-500">Loading voting results...</div>
            </div>
        )
    }

    const totalReviews = mealRatings.reduce((sum, meal) => sum + meal.totalReviews, 0);

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg 
                        key={star} 
                        className={`w-5 h-5 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
                <span className="ml-2 text-sm font-medium text-gray-600">({rating.toFixed(1)})</span>
            </div>
        );
    };

    const getRatingColor = (rating: number) => {
        if (rating >= 4.5) return 'bg-green-500';
        if (rating >= 3.5) return 'bg-blue-500';
        if (rating >= 2.5) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <span className="text-2xl">📊</span>
                        <div>
                            <h2 className="text-lg font-bold text-gray-800">Meal Rating Results</h2>
                            <p className="text-sm text-gray-500">Student feedback on today&apos;s meals</p>
                        </div>
                    </div>
                    <span className="px-4 py-2 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                        {totalReviews} reviews this week
                    </span>
                </div>
            </div>

            {/* Rating Cards */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-base font-semibold text-gray-600 mb-6">Today&apos;s Meal Ratings</h3>
                
                {mealRatings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                        <span className="text-5xl mb-4">📊</span>
                        <p className="text-lg font-medium">No ratings yet</p>
                        <p className="text-sm">Ratings will appear here once students submit feedback</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {mealRatings.map((meal, index) => (
                            <div key={index} className="p-4 bg-gray-50 rounded-xl">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <span className="text-2xl">{meal.icon}</span>
                                        <span className="font-medium text-gray-800">{meal.mealTime}</span>
                                    </div>
                                    <span className="text-sm text-gray-500">{meal.totalReviews} Reviews</span>
                                </div>
                                
                                <div className="mb-3">
                                    {renderStars(meal.avgRating)}
                                </div>
                                
                                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-500 ${getRatingColor(meal.avgRating)}`}
                                        style={{ width: `${(meal.avgRating / 5) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">⭐</span>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Average Rating</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {mealRatings.length > 0 
                                    ? (mealRatings.reduce((sum, m) => sum + m.avgRating, 0) / mealRatings.length).toFixed(1)
                                    : '0.0'
                                }
                            </p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">📝</span>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Total Reviews</p>
                            <p className="text-2xl font-bold text-gray-800">{totalReviews}</p>
                        </div>
                    </div>
                </div>
                
                <div className="bg-white rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">🍽️</span>
                        </div>
                        <div>
                            <p className="text-gray-500 text-sm">Meals Rated</p>
                            <p className="text-2xl font-bold text-gray-800">{mealRatings.length}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
