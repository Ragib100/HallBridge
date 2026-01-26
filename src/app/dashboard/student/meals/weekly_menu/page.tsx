"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { getIcon } from "@/components/common/icons"
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
        // console.log("Today's Date (UTC):", today);
        // console.log("Today's Day :", getDayFromDateBD(today));
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
                // console.log("Fetched weekly menu data:", data.weeklyMenu);
            }
            catch (error) {
                console.error("Error fetching weekly menu:", error);
                return;
            }
        };

        fetchWeeklyMenu();
    }, []);
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
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {meals.map((meal) => {
                            const isToday = meal.day === today
                            return (
                                <TableRow
                                    key={meal.day}
                                    className={`transition-colors ${isToday
                                            ? "bg-yellow-100 hover:bg-yellow-200 border-l-4 border-yellow-500"
                                            : "hover:bg-blue-100 bg-white"
                                        }`}
                                >
                                    <TableCell className={`font-bold text-base pl-4 ${isToday ? "text-yellow-700" : "text-blue-700"
                                        }`}>
                                        {meal.day} {isToday && <span className="text-xs ml-2">(Today)</span>}
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