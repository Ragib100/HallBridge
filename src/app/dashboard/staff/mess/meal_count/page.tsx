"use client"

import { useEffect, useState } from 'react'
import '@/app/dashboard/staff/staff.css'

interface MealCountPageProps {
    meatype: 'breakfast' | 'lunch' | 'dinner';
    count: number;
}

export default function MealCountPage() {
    const [meals, setMeals] = useState<MealCountPageProps[]>([])
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
                    { meatype: 'breakfast', count: mealCounts.breakfast ?? 0 },
                    { meatype: 'lunch', count: mealCounts.lunch ?? 0 },
                    { meatype: 'dinner', count: mealCounts.dinner ?? 0 },
                ])

                setTotalStudents(data?.totalStudents ?? 0)
                setGuestMeals(data?.guestMeals ?? 0)
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to load data')
                setMeals([
                    { meatype: 'breakfast', count: 0 },
                    { meatype: 'lunch', count: 0 },
                    { meatype: 'dinner', count: 0 },
                ])
            } finally {
                setLoading(false)
            }
        }

        fetchMealCounts()
    }, [])

    return (
        <div className="tab-content">
            <div className="meal-count-header">
                <div className="meal-count-title">
                    <span>📋</span>
                    <span>Tomorrow meal count</span>
                </div>
                <div className="auto-update-badge">
                    {loading ? 'Loading...' : 'Auto update at 11 PM'}
                </div>
            </div>

            {error && (
                <div className="text-sm text-red-600 mb-3">{error}</div>
            )}

            <div className="meal-cards-grid">
                {meals.map((meal, index) => (
                    <div key={index} className={`meal-card ${meal.meatype}`}>
                        <div className="meal-card-number">{meal.count}</div>
                        <div className="meal-card-label">
                            <span>{meal.meatype.charAt(0).toUpperCase() + meal.meatype.slice(1)}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="meal-info-footer">
                <div className="meal-info-item">
                    <h4>Total Students</h4>
                    <p>{loading ? 'Loading...' : `${totalStudents} residents`}</p>
                </div>
                <div className="meal-info-item guest">
                    <h4>Guest Meals</h4>
                    <p>{loading ? 'Loading...' : `+${guestMeals} requests`}</p>
                </div>
            </div>
        </div>
    );
}