import '@/app/dashboard/staff/staff.css'

interface MealCountPageProps {
    meatype: 'breakfast' | 'lunch' | 'dinner';
    count: number;
}

export default function MealCountPage() {

    const meals : MealCountPageProps[] = [
        { meatype: 'breakfast', count: 82 },
        { meatype: 'lunch', count: 85 },
        { meatype: 'dinner', count: 87 },
    ];

    return (
        <div className="tab-content">
            <div className="meal-count-header">
                <div className="meal-count-title">
                    <span>📋</span>
                    <span>Tomorrow meal count</span>
                </div>
                <div className="auto-update-badge">Auto update at 11 PM</div>
            </div>

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
                    <p>120 residents</p>
                </div>
                <div className="meal-info-item guest">
                    <h4>Guest Meals</h4>
                    <p>+3 requests</p>
                </div>
            </div>
        </div>
    );
}