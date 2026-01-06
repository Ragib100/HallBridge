import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { getIcon } from "@/components/common/icons"

const meals = [
    {
        day: "Saturday",
        breakfast: "luchi, dal",
        lunch: "rice, chicken curry, dal",
        dinner: "rice, vegetable curry, egg, dal",
    },
    {
        day: "Sunday",
        breakfast: "khichuri, egg",
        lunch: "rice, fish curry, dal",
        dinner: "polao, chicken roast",
    },
    {
        day: "Monday",
        breakfast: "paratha, vegetable curry",
        lunch: "rice, chicken curry, dal",
        dinner: "rice, fish vorta, egg, dal",
    },
    {
        day: "Tuesday",
        breakfast: "paratha, vegetable curry",
        lunch: "khichuri, beef curry",
        dinner: "rice, vegetable curry, egg, dal",
    },
    {
        day: "Wednesday",
        breakfast: "khichuri, egg",
        lunch: "rice, chicken curry, dal",
        dinner: "polao, egg curry",
    },
    {
        day: "Thursday",
        breakfast: "bread, omelette",
        lunch: "rice, fish curry, dal",
        dinner: "paratha, chicken curry",
    },
    {
        day: "Friday",
        breakfast: "khichuri, egg",
        lunch: "rice, beef curry, dal",
        dinner: "rice, vegetable curry, egg, dal",
    },
]

export default function GuestMeal() {
    const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })
    
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