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
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <svg className="w-6 h-6 text-[#2D6A4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Weekly Meal Menu
                </h1>
                <p className="text-gray-500 mt-1">Check out this week&apos;s meal schedule</p>
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
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