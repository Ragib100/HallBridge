'use client';

import { useState } from 'react';
import '@/styles/dashboard.css';

export default function StudentLaundryPage() {
  const [activeTab, setActiveTab] = useState('schedule');
  const [formData, setFormData] = useState({
    pickupDate: '',
    pickupTime: '',
    serviceType: '',
    itemCount: '',
    specialInstructions: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="staff-content">
      <div className="tabs">
        <div 
          className={`tab ${activeTab === 'schedule' ? 'active' : ''}`}
          onClick={() => setActiveTab('schedule')}
        >
          Schedule Pickup
        </div>
        <div 
          className={`tab ${activeTab === 'tracking' ? 'active' : ''}`}
          onClick={() => setActiveTab('tracking')}
        >
          Track Laundry
        </div>
        <div 
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          History & Billing
        </div>
      </div>

      {activeTab === 'schedule' && (
        <div className="section">
          <div className="section-header">
            <span className="section-title">🧺 Schedule Laundry Pickup</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="meal-cards" style={{ marginBottom: '16px' }}>
              <div className="meal-card blue">
                <div className="meal-type">Regular Wash</div>
                <div className="meal-number">$2/kg</div>
              </div>
              <div className="meal-card yellow">
                <div className="meal-type">Express Wash</div>
                <div className="meal-number">$3/kg</div>
              </div>
              <div className="meal-card green">
                <div className="meal-type">Dry Clean</div>
                <div className="meal-number">$5/item</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Pickup Date *</label>
                <input 
                  type="date"
                  name="pickupDate"
                  value={formData.pickupDate}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Pickup Time *</label>
                <select 
                  name="pickupTime"
                  value={formData.pickupTime}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                >
                  <option value="">Select Time</option>
                  <option value="morning">Morning (9 AM - 12 PM)</option>
                  <option value="afternoon">Afternoon (2 PM - 5 PM)</option>
                  <option value="evening">Evening (6 PM - 8 PM)</option>
                </select>
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Service Type *</label>
              <select 
                name="serviceType"
                value={formData.serviceType}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
              >
                <option value="">Select Service</option>
                <option value="regular">Regular Wash (2-3 days)</option>
                <option value="express">Express Wash (24 hours)</option>
                <option value="dry-clean">Dry Clean (3-4 days)</option>
                <option value="iron-only">Iron Only</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Estimated Item Count/Weight</label>
              <input 
                type="text"
                name="itemCount"
                value={formData.itemCount}
                onChange={handleInputChange}
                placeholder="e.g., 10 items or 5 kg"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Special Instructions</label>
              <textarea 
                name="specialInstructions"
                value={formData.specialInstructions}
                onChange={handleInputChange}
                placeholder="Any special care instructions..."
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '80px' }}
              />
            </div>

            <button className="export-btn">📝 Schedule Pickup</button>
          </div>

          <div className="section" style={{ marginTop: '20px' }}>
            <div className="section-title">📋 Available Pickup Slots This Week</div>
            <div className="forecast-item">
              <span>Tomorrow (Dec 25)</span>
              <div className="forecast-meals">
                <span className="forecast-meal" style={{ backgroundColor: '#4caf50' }}>Morning ✓</span>
                <span className="forecast-meal" style={{ backgroundColor: '#4caf50' }}>Afternoon ✓</span>
                <span className="forecast-meal" style={{ backgroundColor: '#ccc' }}>Evening ✗</span>
              </div>
            </div>
            <div className="forecast-item">
              <span>Dec 26</span>
              <div className="forecast-meals">
                <span className="forecast-meal" style={{ backgroundColor: '#4caf50' }}>Morning ✓</span>
                <span className="forecast-meal" style={{ backgroundColor: '#4caf50' }}>Afternoon ✓</span>
                <span className="forecast-meal" style={{ backgroundColor: '#4caf50' }}>Evening ✓</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'tracking' && (
        <div className="section">
          <div className="section-header">
            <span className="section-title">📦 Track Your Laundry</span>
          </div>

          <div className="menu-day">
            <h3 className="menu-day-title">In Progress</h3>
            <div className="forecast-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>Order #LN-2024-234</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>Service: Regular Wash</div>
                </div>
                <span style={{ backgroundColor: '#007aff', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '14px' }}>
                  Washing
                </span>
              </div>
              <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                Picked up: Dec 23, 2025 | Expected delivery: Dec 25, 2025
              </div>
              <div style={{ width: '100%', marginTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                  <span>Progress</span>
                  <span>60%</span>
                </div>
                <div className="voting-bar-container">
                  <div className="voting-bar" style={{ width: '60%', backgroundColor: '#007aff' }}></div>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                Status: Currently in washing process
              </div>
            </div>

            <div className="forecast-item" style={{ flexDirection: 'column', alignItems: 'flex-start', marginTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>Order #LN-2024-241</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>Service: Express Wash</div>
                </div>
                <span style={{ backgroundColor: '#ffa500', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '14px' }}>
                  Drying
                </span>
              </div>
              <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                Picked up: Dec 24, 2025 | Expected delivery: Dec 25, 2025
              </div>
              <div style={{ width: '100%', marginTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                  <span>Progress</span>
                  <span>80%</span>
                </div>
                <div className="voting-bar-container">
                  <div className="voting-bar" style={{ width: '80%', backgroundColor: '#ffa500' }}></div>
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '8px' }}>
                Status: Drying and ironing in progress
              </div>
            </div>
          </div>

          <div className="menu-day">
            <h3 className="menu-day-title">Ready for Delivery</h3>
            <div className="forecast-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>Order #LN-2024-228</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>Service: Regular Wash</div>
                </div>
                <span style={{ backgroundColor: '#4caf50', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '14px' }}>
                  Ready
                </span>
              </div>
              <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                Items: 8 pieces | Weight: 4.5 kg | Amount: $9
              </div>
              <button className="export-btn" style={{ marginTop: '12px', padding: '8px 16px' }}>
                📍 Track Delivery
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="section">
          <div className="section-header">
            <span className="section-title">📊 Laundry History & Billing</span>
            <button className="export-btn">📊 Export Statement</button>
          </div>

          <div className="meal-cards" style={{ marginBottom: '20px' }}>
            <div className="meal-card blue">
              <div className="meal-type">This Month</div>
              <div className="meal-number">$45</div>
              <div style={{ fontSize: '14px', marginTop: '8px' }}>6 orders</div>
            </div>
            <div className="meal-card yellow">
              <div className="meal-type">Last Month</div>
              <div className="meal-number">$38</div>
              <div style={{ fontSize: '14px', marginTop: '8px' }}>5 orders</div>
            </div>
            <div className="meal-card green">
              <div className="meal-type">Total (2025)</div>
              <div className="meal-number">$425</div>
              <div style={{ fontSize: '14px', marginTop: '8px' }}>58 orders</div>
            </div>
          </div>

          <div className="menu-day">
            <h3 className="menu-day-title">Recent Orders</h3>
            
            <div className="forecast-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>Order #LN-2024-228</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>Regular Wash | Dec 20, 2025</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', color: '#4caf50' }}>$9.00</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Paid</div>
                </div>
              </div>
              <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                Items: 8 pieces | Weight: 4.5 kg
              </div>
            </div>

            <div className="forecast-item" style={{ flexDirection: 'column', alignItems: 'flex-start', marginTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>Order #LN-2024-219</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>Express Wash | Dec 18, 2025</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', color: '#4caf50' }}>$15.00</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Paid</div>
                </div>
              </div>
              <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                Items: 12 pieces | Weight: 5 kg
              </div>
            </div>

            <div className="forecast-item" style={{ flexDirection: 'column', alignItems: 'flex-start', marginTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>Order #LN-2024-205</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>Dry Clean | Dec 15, 2025</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold', color: '#4caf50' }}>$25.00</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>Paid</div>
                </div>
              </div>
              <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                Items: 5 pieces (Formal wear)
              </div>
            </div>
          </div>

          <div className="section" style={{ marginTop: '20px' }}>
            <h3 className="voting-subtitle">Billing Summary</h3>
            <div className="forecast-item">
              <span>Regular Wash Services</span>
              <span style={{ fontWeight: 'bold' }}>$320</span>
            </div>
            <div className="forecast-item">
              <span>Express Wash Services</span>
              <span style={{ fontWeight: 'bold' }}>$80</span>
            </div>
            <div className="forecast-item">
              <span>Dry Clean Services</span>
              <span style={{ fontWeight: 'bold' }}>$25</span>
            </div>
            <div className="forecast-item" style={{ borderTop: '2px solid #ddd', paddingTop: '12px', marginTop: '12px' }}>
              <span style={{ fontWeight: 'bold' }}>Total (2025)</span>
              <span style={{ fontWeight: 'bold', fontSize: '18px', color: '#007aff' }}>$425</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}