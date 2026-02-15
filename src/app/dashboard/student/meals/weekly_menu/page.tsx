"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useState, useEffect } from "react";
import { getCurrentDateBD, getDayFromDateBD } from "@/lib/dates";
import { CalendarWeek } from "@boxicons/react"

interface WeeklyMenu {
    day: string;
    breakfast: string;
    lunch: string;
    dinner: string;
}

export default function WeeklyMenu() {

    const getToday = () => {
        const today = getCurrentDateBD();
        return getDayFromDateBD(today);
    }

    const today = getToday();

    const [meals, setMeals] = useState<WeeklyMenu[]>([]);

    useEffect(() => {
        const fetchWeeklyMenu = async () => {
            const url = `/api/common/weekly-menu`;

            try {
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Error fetching weekly menu:", errorData?.message || "Unknown error");
                    return;
                }

                const data = await response.json();
                setMeals(data.weeklyMenu);
            }
            catch (error) {
                console.error("Error fetching weekly menu:", error);
                return;
            }
        };

        fetchWeeklyMenu();
    }, []);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
                <h1 className="text-lg sm:text-xl font-bold text-gray-800 flex items-center gap-2">
                    <CalendarWeek />
                    Weekly Meal Menu
                </h1>
                <p className="text-sm sm:text-base text-gray-500 mt-1">Check out this week&apos;s meal schedule</p>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden space-y-3">
                {meals.map((meal) => {
                    const isToday = meal.day === today
                    return (
                        <div
                            key={meal.day}
                            className={`bg-white rounded-xl shadow-sm overflow-hidden ${
                                isToday ? "border-2 border-[#2D6A4F]" : "border border-gray-200"
                            }`}
                        >
                            <div className={`p-4 ${isToday ? "bg-[#2D6A4F]" : "bg-gray-50"}`}>
                                <h2 className={`font-bold text-lg ${isToday ? "text-white" : "text-gray-800"}`}>
                                    {meal.day}
                                    {isToday && <span className="text-xs ml-2 bg-white text-[#2D6A4F] px-2 py-0.5 rounded-full">Today</span>}
                                </h2>
                            </div>
                            <div className="p-4 space-y-3">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-lg">🍳</span>
                                        <span className="font-semibold text-gray-700">Breakfast</span>
                                    </div>
                                    <p className="text-gray-600 pl-7">{meal.breakfast}</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-lg">🍛</span>
                                        <span className="font-semibold text-gray-700">Lunch</span>
                                    </div>
                                    <p className="text-gray-600 pl-7">{meal.lunch}</p>
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-lg">🍽️</span>
                                        <span className="font-semibold text-gray-700">Dinner</span>
                                    </div>
                                    <p className="text-gray-600 pl-7">{meal.dinner}</p>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
                <Table className="min-w-full">
                    <TableHeader>
                        <TableRow className="bg-[#2D6A4F] hover:bg-[#245a42]">
                            <TableHead className="text-white font-bold text-base pl-4">Day</TableHead>
                            <TableHead className="text-white font-bold text-base">🍳 Breakfast</TableHead>
                            <TableHead className="text-white font-bold text-base">🍛 Lunch</TableHead>
                            <TableHead className="text-white font-bold text-base">🍽️ Dinner</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {meals.map((meal) => {
                            const isToday = meal.day === today
                            return (
                                <TableRow
                                    key={meal.day}
                                    className={`transition-colors ${isToday
                                            ? "bg-[#2D6A4F]/10 hover:bg-[#2D6A4F]/15 border-l-4 border-[#2D6A4F]"
                                            : "hover:bg-gray-50 bg-white"
                                        }`}
                                >
                                    <TableCell className={`font-bold text-base pl-4 ${isToday ? "text-[#2D6A4F]" : "text-gray-800"
                                        }`}>
                                        {meal.day} {isToday && <span className="text-xs ml-2 bg-[#2D6A4F] text-white px-2 py-0.5 rounded-full">(Today)</span>}
                                    </TableCell>
                                    <TableCell className="text-gray-700">
                                        <div className="py-1">{meal.breakfast}</div>
                                    </TableCell>
                                    <TableCell className="text-gray-700">
                                        <div className="py-1">{meal.lunch}</div>
                                    </TableCell>
                                    <TableCell className="text-gray-700">
                                        <div className="py-1">{meal.dinner}</div>
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