import TomorrowMeals from "@/components/student/tomorrow_meals";
import GuestMeal from "@/components/student/guest_meal";

export default function MealSelection() {
    return (
        <div className="space-y-6">
            <TomorrowMeals />
            <GuestMeal />
        </div>
    );
}