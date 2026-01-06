import '@/app/dashboard/staff/staff.css'

export default function MealCountPage() {
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
                <div className="meal-card breakfast">
                    <div className="meal-card-number">82</div>
                    <div className="meal-card-label">
                        <span>🔍</span>
                        <span>Breakfast</span>
                    </div>
                </div>
                <div className="meal-card lunch">
                    <div className="meal-card-number">85</div>
                    <div className="meal-card-label">
                        <span>🍱</span>
                        <span>Lunch</span>
                    </div>
                </div>
                <div className="meal-card dinner">
                    <div className="meal-card-number">87</div>
                    <div className="meal-card-label">
                        <span>🍽️</span>
                        <span>Dinner</span>
                    </div>
                </div>
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