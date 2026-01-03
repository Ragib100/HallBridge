'use client';

import '@/styles/dashboard.css';
import { useState } from 'react';

export default function MessMealCount() {
  const [activeTab, setActiveTab] = useState('meal-count');

  return (
    <div className="staff-content">
      <div className="tabs">
        <div 
          className={`tab ${activeTab === 'meal-count' ? 'active' : ''}`}
          onClick={() => setActiveTab('meal-count')}
        >
          Meal Count
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
          Voting Results
        </div>
      </div>

      {activeTab === 'meal-count' && (
        <>
          <div className="section">
            <div className="section-header">
              <span className="section-title">📋 Tomorrow's Meal Count</span>
              <span className="auto-update">Auto-Updates at 11 PM</span>
            </div>

            <div className="meal-cards">
              <div className="meal-card blue">
                <div className="meal-number">82</div>
                <div className="meal-type">🔍 Breakfast</div>
              </div>
              <div className="meal-card yellow">
                <div className="meal-number">85</div>
                <div className="meal-type">📋 Lunch</div>
              </div>
              <div className="meal-card green">
                <div className="meal-number">87</div>
                <div className="meal-type">🍽️ Dinner</div>
              </div>
            </div>

            <div className="info-section">
              <div className="info-item">
                <div className="info-label">Total Students</div>
                <div className="info-value">120 residents</div>
              </div>
              <div className="info-item right">
                <div className="info-label">Guest Meals</div>
                <div className="info-value">+3 requests</div>
              </div>
            </div>

            <button className="export-btn">📊 Export as Excel</button>
          </div>

          <div className="section">
            <div className="section-title">📊 Next 7 Days Forecast</div>
            <div className="forecast-item">
              <span>Dec 24 (Today)</span>
              <div className="forecast-meals">
                <span className="forecast-meal">🔍 82</span>
                <span className="forecast-meal">📋 85</span>
                <span className="forecast-meal">🍽️ 87</span>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'weekly-menu' && (
        <div className="section">
          <div className="section-header">
            <span className="section-title">📋 This Week's Menu</span>
            <button className="edit-menu-btn">Edit Menu</button>
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
            <span className="section-title">📊 Meal Voting Results</span>
            <span className="votes-badge">78 votes this week</span>
          </div>

          <div className="voting-section">
            <h3 className="voting-subtitle">Top Requested Items</h3>
            
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

          <div className="feedback-section">
            <h3 className="voting-subtitle">Student Feedback</h3>

            <div className="feedback-item">
              <div className="feedback-header">
                <div className="feedback-info">
                  <div className="feedback-student">Ahmed Khan (Rm 201)</div>
                  <div className="feedback-text">"Monday's chicken curry was excellent!"</div>
                </div>
                <span className="feedback-liked">👍 Liked</span>
              </div>
            </div>

            <div className="feedback-item">
              <div className="feedback-header">
                <div className="feedback-info">
                  <div className="feedback-student">Sara Ali (Rm 105)</div>
                  <div className="feedback-text">"Fish needs more spices"</div>
                </div>
                <span className="feedback-disliked">👎 Disliked</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}