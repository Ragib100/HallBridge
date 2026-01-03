'use client';

import './staff.css';
import { useState } from 'react';

export default function StaffDashboard() {
  const [activeTab, setActiveTab] = useState('meal-count');

  return (
    <div className="staff-page">
      <div className="staff-header">
        <h1>Mess Management</h1>
      </div>

      <div className="staff-content">
        <div className="staff-tabs">
          <button
            className={`staff-tab ${activeTab === 'meal-count' ? 'active' : ''}`}
            onClick={() => setActiveTab('meal-count')}
          >
            Meal count
          </button>
          <button
            className={`staff-tab ${activeTab === 'weekly-menu' ? 'active' : ''}`}
            onClick={() => setActiveTab('weekly-menu')}
          >
            Weekly Menu
          </button>
          <button
            className={`staff-tab ${activeTab === 'voting' ? 'active' : ''}`}
            onClick={() => setActiveTab('voting')}
          >
            Voting Results
          </button>
        </div>

        {activeTab === 'meal-count' && (
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
        )}

        {activeTab === 'weekly-menu' && (
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
        )}

        {activeTab === 'voting' && (
          <div className="tab-content">
            <div className="voting-header">
              <div className="voting-title">
                <span>📊</span>
                <span>Meal Voting Results</span>
              </div>
              <div className="votes-badge">78 votes this week</div>
            </div>

            <h3 className="voting-subtitle">Top Requested Items</h3>

            <div className="voting-item">
              <div className="voting-item-row">
                <span className="voting-item-name">
                  <span>🍗</span>
                  <span>Chicken</span>
                </span>
                <span className="voting-count">45 Votes</span>
              </div>
              <div className="voting-bar-bg">
                <div className="voting-bar green" style={{ width: '100%' }}></div>
              </div>
            </div>

            <div className="voting-item">
              <div className="voting-item-row">
                <span className="voting-item-name">
                  <span>🥚</span>
                  <span>Egg with Potato fry</span>
                </span>
                <span className="voting-count">32 Votes</span>
              </div>
              <div className="voting-bar-bg">
                <div className="voting-bar blue" style={{ width: '71%' }}></div>
              </div>
            </div>

            <div className="voting-item">
              <div className="voting-item-row">
                <span className="voting-item-name">
                  <span>🫓</span>
                  <span>Paratha With Halua</span>
                </span>
                <span className="voting-count">28 Votes</span>
              </div>
              <div className="voting-bar-bg">
                <div className="voting-bar yellow" style={{ width: '62%' }}></div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}