"use client"

import '@/app/dashboard/staff/staff.css'
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
                const response = await fetch('/api/meals/voting-results')
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
        return <div className="tab-content">Loading voting results...</div>
    }

    const totalReviews = mealRatings.reduce((sum, meal) => sum + meal.totalReviews, 0);

    const renderStars = (rating: number) => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} style={{ color: star <= rating ? '#fbbf24' : '#d1d5db', fontSize: '18px' }}>
                        ★
                    </span>
                ))}
                <span className="ml-2 text-sm text-gray-600">({rating.toFixed(1)})</span>
            </div>
        );
    };

    return (
        <div className="tab-content">
            <div className="voting-header">
                <div className="voting-title">
                    <span>📊</span>
                    <span>Meal Rating Results</span>
                </div>
                <div className="votes-badge">{totalReviews} reviews this week</div>
            </div>

            <h3 className="voting-subtitle">Today's Meal Ratings</h3>

            {mealRatings.map((meal, index) => (
                <div key={index} className="voting-item">
                    <div className="voting-item-row">
                        <span className="voting-item-name">
                            <span>{meal.icon}</span>
                            <span>{meal.mealTime}</span>
                        </span>
                        <span className="voting-count">{meal.totalReviews} Reviews</span>
                    </div>
                    <div className="ml-8 mb-2">
                        {renderStars(meal.avgRating)}
                    </div>
                    <div className="voting-bar-bg">
                        <div 
                            className={`voting-bar ${meal.avgRating >= 4.5 ? 'green' : meal.avgRating >= 3.5 ? 'blue' : 'yellow'}`}
                            style={{ width: `${(meal.avgRating / 5) * 100}%` }}
                        ></div>
                    </div>
                </div>
            ))}
        </div>
    );
}