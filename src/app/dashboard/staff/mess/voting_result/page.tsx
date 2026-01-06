import '@/app/dashboard/staff/staff.css'

interface MealRating {
    mealTime: string;
    menuItems: string;
    icon: string;
    avgRating: number;
    totalReviews: number;
}

export default function VotingResultPage() {
    const mealRatings: MealRating[] = [
        {
            mealTime: 'Breakfast',
            menuItems: 'Paratha, Egg Curry, Tea/Coffee, Banana',
            icon: '🍳',
            avgRating: 4.5,
            totalReviews: 45,
        },
        {
            mealTime: 'Lunch',
            menuItems: 'Rice, Dal, Chicken Curry, Mixed Vegetable, Salad',
            icon: '🍛',
            avgRating: 4.2,
            totalReviews: 38,
        },
        {
            mealTime: 'Dinner',
            menuItems: 'Roti, Fish Curry, Aloo Bhaji, Dal, Sweet Dish',
            icon: '🍽️',
            avgRating: 3.8,
            totalReviews: 32,
        },
    ];

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
                    <div className="text-sm text-gray-600 ml-8 mb-2">{meal.menuItems}</div>
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