'use client';

import { useState } from 'react';
import '@/styles/dashboard.css';

export default function StudentBillingPage() {
  const [activeTab, setActiveTab] = useState('current-dues');

  return (
    <div className="staff-content">
      <div className="tabs">
        <div 
          className={`tab ${activeTab === 'current-dues' ? 'active' : ''}`}
          onClick={() => setActiveTab('current-dues')}
        >
          Current Dues
        </div>
        <div 
          className={`tab ${activeTab === 'payment-history' ? 'active' : ''}`}
          onClick={() => setActiveTab('payment-history')}
        >
          Payment History
        </div>
        <div 
          className={`tab ${activeTab === 'invoices' ? 'active' : ''}`}
          onClick={() => setActiveTab('invoices')}
        >
          Invoices
        </div>
      </div>

      {activeTab === 'current-dues' && (
        <div className="section">
          <div className="section-header">
            <span className="section-title">💰 Current Dues Overview</span>
            <span className="auto-update">Due Date: Dec 31, 2025</span>
          </div>

          <div className="meal-cards">
            <div className="meal-card blue">
              <div className="meal-type">Total Due</div>
              <div className="meal-number">$450</div>
            </div>
            <div className="meal-card yellow">
              <div className="meal-type">Mess Charges</div>
              <div className="meal-number">$280</div>
            </div>
            <div className="meal-card green">
              <div className="meal-type">Hostel Rent</div>
              <div className="meal-number">$150</div>
            </div>
            <div className="meal-card" style={{ background: '#e74c3c' }}>
              <div className="meal-type">Other Fees</div>
              <div className="meal-number">$20</div>
            </div>
          </div>

          <div className="section" style={{ marginTop: '20px' }}>
            <h3 className="voting-subtitle">Payment Breakdown</h3>
            
            <div className="forecast-item">
              <span>Mess Charges (Dec 2025)</span>
              <span className="forecast-meal" style={{ fontSize: '16px' }}>$280</span>
            </div>
            <div className="forecast-item">
              <span>Hostel Rent (Dec 2025)</span>
              <span className="forecast-meal" style={{ fontSize: '16px' }}>$150</span>
            </div>
            <div className="forecast-item">
              <span>Laundry Service</span>
              <span className="forecast-meal" style={{ fontSize: '16px' }}>$15</span>
            </div>
            <div className="forecast-item">
              <span>Guest Meal Charges</span>
              <span className="forecast-meal" style={{ fontSize: '16px' }}>$5</span>
            </div>
          </div>

          <button className="export-btn">💳 Pay Now</button>
          <button className="export-btn" style={{ marginTop: '10px', backgroundColor: '#6c757d' }}>📄 Download Invoice</button>
        </div>
      )}

      {activeTab === 'payment-history' && (
        <div className="section">
          <div className="section-header">
            <span className="section-title">📊 Payment History</span>
            <button className="export-btn">📊 Export as PDF</button>
          </div>

          <div className="menu-day">
            <h3 className="menu-day-title">November 2025</h3>
            <div className="forecast-item">
              <div>
                <div style={{ fontWeight: 'bold' }}>Payment #1234</div>
                <div style={{ fontSize: '14px', color: '#666' }}>Paid on Nov 28, 2025</div>
              </div>
              <div>
                <div style={{ color: '#4caf50', fontWeight: 'bold' }}>$420 ✓</div>
                <div style={{ fontSize: '14px', color: '#666' }}>Card ending 4532</div>
              </div>
            </div>
          </div>

          <div className="menu-day">
            <h3 className="menu-day-title">October 2025</h3>
            <div className="forecast-item">
              <div>
                <div style={{ fontWeight: 'bold' }}>Payment #1189</div>
                <div style={{ fontSize: '14px', color: '#666' }}>Paid on Oct 30, 2025</div>
              </div>
              <div>
                <div style={{ color: '#4caf50', fontWeight: 'bold' }}>$420 ✓</div>
                <div style={{ fontSize: '14px', color: '#666' }}>Bank Transfer</div>
              </div>
            </div>
          </div>

          <div className="menu-day">
            <h3 className="menu-day-title">September 2025</h3>
            <div className="forecast-item">
              <div>
                <div style={{ fontWeight: 'bold' }}>Payment #1076</div>
                <div style={{ fontSize: '14px', color: '#666' }}>Paid on Sep 25, 2025</div>
              </div>
              <div>
                <div style={{ color: '#4caf50', fontWeight: 'bold' }}>$410 ✓</div>
                <div style={{ fontSize: '14px', color: '#666' }}>Card ending 4532</div>
              </div>
            </div>
          </div>

          <div className="info-section" style={{ marginTop: '20px' }}>
            <div className="info-item">
              <div className="info-label">Total Paid (This Year)</div>
              <div className="info-value">$4,890</div>
            </div>
            <div className="info-item right">
              <div className="info-label">Average Monthly</div>
              <div className="info-value">$420</div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'invoices' && (
        <div className="section">
          <div className="section-header">
            <span className="section-title">📄 Invoices</span>
          </div>

          <div className="voting-section">
            {['December 2025', 'November 2025', 'October 2025', 'September 2025', 'August 2025'].map((month, idx) => (
              <div key={month} className="voting-item">
                <div className="voting-item-header">
                  <span className="voting-item-name">📄 {month}</span>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button className="export-btn" style={{ padding: '8px 16px' }}>
                      👁️ View
                    </button>
                    <button className="export-btn" style={{ padding: '8px 16px', backgroundColor: '#6c757d' }}>
                      ⬇️ Download
                    </button>
                  </div>
                </div>
                <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                  Amount: ${idx === 0 ? '450 (Pending)' : '420 (Paid)'}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}