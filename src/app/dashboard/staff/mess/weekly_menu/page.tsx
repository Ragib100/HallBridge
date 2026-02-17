"use client"

import { useState, useEffect } from "react"
import { useToast } from '@/components/ui/toast'
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
import { getBDDate } from "@/lib/dates"
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
    const { toast } = useToast()
    const today = getBDDate().toLocaleDateString('en-US', { weekday: 'long' })

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
                    toast.success('Saved', 'Menu saved to database successfully!')
                } else {
                    toast.error('Save Failed', 'Failed to save: ' + (data.message || 'Unknown error'))
                }
            } catch (error) {
                console.error('Error:', error)
                toast.warning('Network Error', 'Network error - changes may have saved. Refresh to check.')
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
            <div className="flex items-center justify-center h-64">
                <div className="text-center text-gray-500">Loading weekly menu...</div>
            </div>
        )
    }
    
    return (
        <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h1 className="text-2xl font-bold text-gray-800 mb-1">Weekly Meal Menu</h1>
                <p className="text-gray-500">Manage this week's meal schedule</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <Table className="min-w-full">
                    <TableHeader>
                        <TableRow className="bg-[#2D6A4F]">
                            <TableHead className="text-white font-semibold text-sm pl-4">Day</TableHead>
                            <TableHead className="text-white font-semibold text-sm">{getIcon("breakfast")} Breakfast</TableHead>
                            <TableHead className="text-white font-semibold text-sm">{getIcon("lunch")} Lunch</TableHead>
                            <TableHead className="text-white font-semibold text-sm">{getIcon("dinner")} Dinner</TableHead>
                            <TableHead className="text-white font-semibold text-sm text-center">Actions</TableHead>
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
                                            ? "bg-green-50 hover:bg-green-100 border-l-4 border-[#2D6A4F]" 
                                            : "hover:bg-gray-50 bg-white"
                                    }`}
                                >
                                    <TableCell className={`font-semibold text-sm pl-4 ${
                                        isToday ? "text-[#2D6A4F]" : "text-gray-700"
                                    }`}>
                                        {meal.day} {isToday && <span className="text-xs ml-2 text-[#40916C]">(Today)</span>}
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
                                                    className="bg-[#2D6A4F] hover:bg-[#1B4332] cursor-pointer"
                                                >
                                                    Save
                                                </Button>
                                                <Button
                                                    onClick={handleCancel}
                                                    size="sm"
                                                    variant="outline"
                                                    className="border-gray-300 text-gray-600 hover:bg-gray-100 cursor-pointer"
                                                >
                                                    Cancel
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button
                                                onClick={() => handleEdit(meal)}
                                                size="sm"
                                                disabled={isToday}
                                                className={`cursor-pointer ${
                                                    isToday 
                                                        ? "bg-gray-300 cursor-not-allowed text-gray-500" 
                                                        : "bg-[#2D6A4F] hover:bg-[#1B4332] text-white"
                                                }`}
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