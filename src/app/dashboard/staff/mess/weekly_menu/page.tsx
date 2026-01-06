import '@/app/dashboard/staff/staff.css'

export default function WeeklyMenuPage() {
    return (
        <div className="tab-content">
            <div className="menu-header">
                <div className="menu-title">
                    <span>📋</span>
                    <span>This Week&apos;s Menu</span>
                </div>
                <button className="edit-menu-btn">Edit Menu</button>
            </div>

            <div className="menu-day">
                <h3 className="menu-day-title">Monday,Dec 23</h3>
                <div className="menu-meal">
                    <div className="menu-meal-header">🔍 BREAKFAST</div>
                    <div className="menu-meal-items">Paratha, Egg, Tea</div>
                </div>
                <div className="menu-meal">
                    <div className="menu-meal-header">🍱 LUNCH</div>
                    <div className="menu-meal-items">Rice, Chicken Curry, Dal, Salad</div>
                </div>
                <div className="menu-meal">
                    <div className="menu-meal-header">🍲 DINNER</div>
                    <div className="menu-meal-items">Rice, Fish, Mixed Veg, Dal</div>
                </div>
            </div>

            <div className="menu-day">
                <h3 className="menu-day-title">Tuesday,Dec 24</h3>
                <div className="menu-meal">
                    <div className="menu-meal-header">🔍 BREAKFAST</div>
                    <div className="menu-meal-items">Bread, Butter, Jam, Milk</div>
                </div>
                <div className="menu-meal">
                    <div className="menu-meal-header">🍱 LUNCH</div>
                    <div className="menu-meal-items">Rice, Beef, Potato, Salad</div>
                </div>
                <div className="menu-meal">
                    <div className="menu-meal-header">🍲 DINNER</div>
                    <div className="menu-meal-items">Khichuri, Chicken, Salad</div>
                </div>
            </div>

            <div className="menu-day">
                <h3 className="menu-day-title">Wednesday, Dec 25</h3>
                <div className="menu-meal">
                    <div className="menu-meal-header">🔍 BREAKFAST</div>
                    <div className="menu-meal-items">Rice, Dal, Egg</div>
                </div>
                <div className="menu-meal">
                    <div className="menu-meal-header">🍱 LUNCH</div>
                    <div className="menu-meal-items">Biriyani, Chicken, Salad, Raita</div>
                </div>
                <div className="menu-meal">
                    <div className="menu-meal-header">🍲 DINNER</div>
                    <div className="menu-meal-items">Rice, Fish Curry, Vegetables</div>
                </div>
            </div>
        </div>
    );
}