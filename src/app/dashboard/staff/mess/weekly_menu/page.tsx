"use client"

import { useState, useEffect } from "react"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { getIcon } from "@/components/common/icons"

interface Meal {
    _id?: string
    day: string
    breakfast: string
    lunch: string
    dinner: string
}

const dayOrder = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]

export default function GuestMeal() {
    const [meals, setMeals] = useState<Meal[]>([])
    const [loading, setLoading] = useState(true)
    const [editingDay, setEditingDay] = useState<string | null>(null)
    const [editedMeal, setEditedMeal] = useState<Meal | null>(null)
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })

    // Fetch meals from database on page load
    useEffect(() => {
        const fetchMeals = async () => {
            try {
                const response = await fetch('/api/common/weekly-menu')
                const data = await response.json()
                if (data.weeklyMenu) {
                    const sortedMeals = data.weeklyMenu.sort((a: Meal, b: Meal) => 
                        dayOrder.indexOf(a.day) - dayOrder.indexOf(b.day)
                    )
                    setMeals(sortedMeals)
                }
            } catch (error) {
                console.error('Error fetching meals:', error)
            } finally {
                setLoading(false)
            }
        }
        fetchMeals()
    }, [])

    const handleEdit = (meal: Meal) => {
        setEditingDay(meal.day)
        setEditedMeal({ ...meal })
    }

    const handleSave = async () => {
        if (editedMeal) {
            try {
                const response = await fetch('/api/common/weekly-menu', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        day: editedMeal.day,
                        breakfast: editedMeal.breakfast,
                        lunch: editedMeal.lunch,
                        dinner: editedMeal.dinner,
                    }),
                })

                const data = await response.json()
                
                if (response.ok) {
                    setMeals(meals.map(meal => 
                        meal.day === editedMeal.day ? editedMeal : meal
                    ))
                    setEditingDay(null)
                    setEditedMeal(null)
                    alert('Saved to database!')
                } else {
                    alert('Failed to save: ' + (data.message || 'Unknown error'))
                }
            } catch (error) {
                console.error('Error:', error)
                alert('Network error - but changes may have saved. Refresh the page to check.')
            }
        }
    }

    const handleCancel = () => {
        setEditingDay(null)
        setEditedMeal(null)
    }

    const handleInputChange = (field: keyof Meal, value: string) => {
        if (editedMeal) {
            setEditedMeal({ ...editedMeal, [field]: value })
        }
    }

    if (loading) {
        return (
            <div className="container mx-auto py-8 px-2 md:px-4 max-w-full">
                <div className="text-center text-gray-600">Loading weekly menu from database...</div>
            </div>
        )
    }
    
    return (
        <div className="container mx-auto py-8 px-2 md:px-4 max-w-full overflow-x-hidden">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Weekly Meal Menu</h1>
                <p className="text-gray-600">Check out this week's meal schedule</p>
            </div>

            <div className="rounded-lg border border-gray-200 shadow-lg bg-white overflow-x-auto">
                <Table className="min-w-full">
                    <TableHeader>
                        <TableRow className="bg-blue-600 hover:bg-blue-800">
                            <TableHead className="text-white font-bold text-base pl-4">Day</TableHead>
                            <TableHead className="text-white font-bold text-base">{getIcon("breakfast")} Breakfast</TableHead>
                            <TableHead className="text-white font-bold text-base">{getIcon("lunch")} Lunch</TableHead>
                            <TableHead className="text-white font-bold text-base">{getIcon("dinner")} Dinner</TableHead>
                            <TableHead className="text-white font-bold text-base text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {meals.map((meal) => {
                            const isToday = meal.day === today
                            const isEditing = editingDay === meal.day
                            const currentMeal = isEditing ? editedMeal! : meal
                            
                            return (
                                <TableRow
                                    key={meal.day}
                                    className={`transition-colors ${
                                        isToday 
                                            ? "bg-yellow-100 hover:bg-yellow-200 border-l-4 border-yellow-500" 
                                            : "hover:bg-blue-100 bg-white"
                                    }`}
                                >
                                    <TableCell className={`font-bold text-base pl-4 ${
                                        isToday ? "text-yellow-700" : "text-blue-700"
                                    }`}>
                                        {meal.day} {isToday && <span className="text-xs ml-2">(Today)</span>}
                                    </TableCell>
                                    <TableCell className="text-gray-700">
                                        {isEditing ? (
                                            <Input
                                                value={currentMeal.breakfast}
                                                onChange={(e) => handleInputChange("breakfast", e.target.value)}
                                                className="min-w-50"
                                            />
                                        ) : (
                                            <div className="py-1">{meal.breakfast}</div>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-gray-700">
                                        {isEditing ? (
                                            <Input
                                                value={currentMeal.lunch}
                                                onChange={(e) => handleInputChange("lunch", e.target.value)}
                                                className="min-w-50"
                                            />
                                        ) : (
                                            <div className="py-1">{meal.lunch}</div>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-gray-700">
                                        {isEditing ? (
                                            <Input
                                                value={currentMeal.dinner}
                                                onChange={(e) => handleInputChange("dinner", e.target.value)}
                                                className="min-w-50"
                                            />
                                        ) : (
                                            <div className="py-1">{meal.dinner}</div>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-center">
                                        {isEditing ? (
                                            <div className="flex gap-2 justify-center">
                                                <Button
                                                    onClick={handleSave}
                                                    size="sm"
                                                    className="bg-green-600 hover:bg-green-700 cursor-pointer"
                                                >
                                                    Save
                                                </Button>
                                                <Button
                                                    onClick={handleCancel}
                                                    size="sm"
                                                    variant="outline"
                                                    className="bg-red-600 hover:bg-red-700 text-white hover:text-white cursor-pointer"
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button
                                                onClick={() => handleEdit(meal)}
                                                size="sm"
                                                disabled={isToday}
                                                className={`${
                                                    isToday 
                                                        ? "bg-gray-300 cursor-not-allowed" 
                                                        : "bg-blue-600 hover:bg-blue-700"
                                                }`+' cursor-pointer'}
                                            >
                                                {isToday ? "Can't Edit Today" : "Edit"}
                                            </Button>
                                        )}
                                    </TableCell>
                                </TableRow>
                            )
                        })}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}