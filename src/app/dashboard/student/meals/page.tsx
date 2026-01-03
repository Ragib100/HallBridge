'use client';

import { useState } from 'react';
import '@/styles/dashboard.css';

export default function StudentMealsPage() {
  const [activeTab, setActiveTab] = useState('meal-selection');
  const [selectedMeals, setSelectedMeals] = useState({
    breakfast: true,
    lunch: true,
    dinner: true
  });
  const [votes, setVotes] = useState<{[key: string]: boolean}>({});

  const handleMealToggle = (meal: 'breakfast' | 'lunch' | 'dinner') => {
    setSelectedMeals(prev => ({
      ...prev,
      [meal]: !prev[meal]
    }));
  };

  const handleVote = (itemName: string) => {
    setVotes(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  return (
    <div className="staff-content">
      <div className="tabs">
        <div 
          className={`tab ${activeTab === 'meal-selection' ? 'active' : ''}`}
          onClick={() => setActiveTab('meal-selection')}
        >
          Meal Selection
        </div>
        <div 
          className={`tab ${activeTab === 'weekly-menu' ? 'active' : ''}`}
          onClick={() => setActiveTab('weekly-menu')}
        >
          Weekly Menu
        </div>
        <div 
          className={`tab ${activeTab === 'voting' ? 'active' : ''}`}
          onClick={() => setActiveTab('voting')}
        >
          Vote for Meals
        </div>
      </div>

      {activeTab === 'meal-selection' && (
        <div className="section">
          <div className="section-header">
            <span className="section-title">🍽️ Tomorrow's Meal Selection</span>
            <span className="auto-update">Deadline: 11 PM Today</span>
          </div>

          <div className="meal-selection-cards">
            <div 
              className={`meal-card ${selectedMeals.breakfast ? 'blue' : 'gray'}`}
              style={{ cursor: 'pointer' }}
              onClick={() => handleMealToggle('breakfast')}
            >
              <div className="meal-type">🔍 Breakfast</div>
              <div className="meal-status">{selectedMeals.breakfast ? '✓ Selected' : 'Not Selected'}</div>
            </div>
            <div 
              className={`meal-card ${selectedMeals.lunch ? 'yellow' : 'gray'}`}
              style={{ cursor: 'pointer' }}
              onClick={() => handleMealToggle('lunch')}
            >
              <div className="meal-type">📋 Lunch</div>
              <div className="meal-status">{selectedMeals.lunch ? '✓ Selected' : 'Not Selected'}</div>
            </div>
            <div 
              className={`meal-card ${selectedMeals.dinner ? 'green' : 'gray'}`}
              style={{ cursor: 'pointer' }}
              onClick={() => handleMealToggle('dinner')}
            >
              <div className="meal-type">🍽️ Dinner</div>
              <div className="meal-status">{selectedMeals.dinner ? '✓ Selected' : 'Not Selected'}</div>
            </div>
          </div>

          <div className="info-section">
            <div className="info-item">
              <div className="info-label">Tomorrow's Menu</div>
              <div className="info-value">Rice, Chicken Curry, Dal</div>
            </div>
            <div className="info-item right">
              <div className="info-label">Guest Meal Request</div>
              <button className="export-btn" style={{ marginTop: '8px' }}>Request Guest Meal</button>
            </div>
          </div>

          <button className="export-btn">💾 Save Selection</button>

          <div className="section" style={{ marginTop: '20px' }}>
            <div className="section-title">📊 Your Meal History (This Week)</div>
            <div className="forecast-item">
              <span>Dec 24 (Today)</span>
              <div className="forecast-meals">
                <span className="forecast-meal">🔍 ✓</span>
                <span className="forecast-meal">📋 ✓</span>
                <span className="forecast-meal">🍽️ ✓</span>
              </div>
            </div>
            <div className="forecast-item">
              <span>Dec 23</span>
              <div className="forecast-meals">
                <span className="forecast-meal">🔍 ✓</span>
                <span className="forecast-meal">📋 ✗</span>
                <span className="forecast-meal">🍽️ ✓</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'weekly-menu' && (
        <div className="section">
          <div className="section-header">
            <span className="section-title">📋 This Week's Menu</span>
          </div>

          <div className="menu-day">
            <h3 className="menu-day-title">Monday, Dec 23</h3>
            <div className="menu-grid">
              <div className="meal-column">
                <div className="meal-header">🔍 BREAKFAST</div>
                <div className="meal-items">Paratha, Egg, Tea</div>
              </div>
              <div className="meal-column">
                <div className="meal-header">📋 LUNCH</div>
                <div className="meal-items">Rice, Chicken Curry, Dal, Salad</div>
              </div>
              <div className="meal-column">
                <div className="meal-header">🍽️ DINNER</div>
                <div className="meal-items">Rice, Fish, Mixed Veg, Dal</div>
              </div>
            </div>
          </div>

          <div className="menu-day">
            <h3 className="menu-day-title">Tuesday, Dec 24</h3>
            <div className="menu-grid">
              <div className="meal-column">
                <div className="meal-header">🔍 BREAKFAST</div>
                <div className="meal-items">Bread, Butter, Jam, Milk</div>
              </div>
              <div className="meal-column">
                <div className="meal-header">📋 LUNCH</div>
                <div className="meal-items">Rice, Beef, Potato, Salad</div>
              </div>
              <div className="meal-column">
                <div className="meal-header">🍽️ DINNER</div>
                <div className="meal-items">Khichuri, Chicken, Salad</div>
              </div>
            </div>
          </div>

          <div className="menu-day">
            <h3 className="menu-day-title">Wednesday, Dec 25</h3>
            <div className="menu-grid">
              <div className="meal-column">
                <div className="meal-header">🔍 BREAKFAST</div>
                <div className="meal-items">Rice, Dal, Egg</div>
              </div>
              <div className="meal-column">
                <div className="meal-header">📋 LUNCH</div>
                <div className="meal-items">Biriyani, Chicken, Salad, Raita</div>
              </div>
              <div className="meal-column">
                <div className="meal-header">🍽️ DINNER</div>
                <div className="meal-items">Rice, Fish Curry, Vegetables</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'voting' && (
        <div className="section">
          <div className="section-header">
            <span className="section-title">🗳️ Vote for Your Favorite Meals</span>
            <span className="votes-badge">Your votes help plan next week's menu</span>
          </div>

          <div className="voting-section">
            <h3 className="voting-subtitle">Main Dishes</h3>
            
            {['Fried Chicken', 'Beef Curry', 'Fish Fry', 'Pasta', 'Pizza', 'Biriyani'].map(item => (
              <div key={item} className="voting-item">
                <div className="voting-item-header">
                  <span className="voting-item-name">🍗 {item}</span>
                  <button 
                    className="export-btn" 
                    style={{ 
                      padding: '8px 16px',
                      backgroundColor: votes[item] ? '#4caf50' : '#007aff'
                    }}
                    onClick={() => handleVote(item)}
                  >
                    {votes[item] ? '✓ Voted' : 'Vote'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="voting-section" style={{ marginTop: '20px' }}>
            <h3 className="voting-subtitle">Current Popular Items</h3>
            
            <div className="voting-item">
              <div className="voting-item-header">
                <span className="voting-item-name">🍗 Fried Chicken</span>
                <span className="voting-count">45 votes</span>
              </div>
              <div className="voting-bar-container">
                <div className="voting-bar" style={{ width: '100%', backgroundColor: '#4caf50' }}></div>
              </div>
            </div>

            <div className="voting-item">
              <div className="voting-item-header">
                <span className="voting-item-name">🍝 Pasta</span>
                <span className="voting-count">32 votes</span>
              </div>
              <div className="voting-bar-container">
                <div className="voting-bar" style={{ width: '71%', backgroundColor: '#007aff' }}></div>
              </div>
            </div>

            <div className="voting-item">
              <div className="voting-item-header">
                <span className="voting-item-name">🍕 Pizza</span>
                <span className="voting-count">28 votes</span>
              </div>
              <div className="voting-bar-container">
                <div className="voting-bar" style={{ width: '62%', backgroundColor: '#ffa500' }}></div>
              </div>
            </div>
          </div>

          <div className="feedback-section" style={{ marginTop: '20px' }}>
            <h3 className="voting-subtitle">Leave Your Feedback</h3>
            <textarea 
              placeholder="Share your thoughts about the meals..."
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                minHeight: '100px',
                marginBottom: '12px'
              }}
            />
            <button className="export-btn">Submit Feedback</button>
          </div>
        </div>
      )}
    </div>
  );
}