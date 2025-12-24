'use client';

import { useState } from 'react';
import '../../staff/staff.css';

export default function StudentGatePassPage() {
  const [activeTab, setActiveTab] = useState('request');
  const [formData, setFormData] = useState({
    purpose: '',
    destination: '',
    outDate: '',
    outTime: '',
    returnDate: '',
    returnTime: '',
    contactNumber: '',
    emergencyContact: ''
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
          className={`tab ${activeTab === 'request' ? 'active' : ''}`}
          onClick={() => setActiveTab('request')}
        >
          Request Pass
        </div>
        <div 
          className={`tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          My Passes
        </div>
        <div 
          className={`tab ${activeTab === 'guidelines' ? 'active' : ''}`}
          onClick={() => setActiveTab('guidelines')}
        >
          Guidelines
        </div>
      </div>

      {activeTab === 'request' && (
        <div className="section">
          <div className="section-header">
            <span className="section-title">🚪 Request Gate Pass</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Purpose of Leave *</label>
              <select 
                name="purpose"
                value={formData.purpose}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
              >
                <option value="">Select Purpose</option>
                <option value="home">Going Home</option>
                <option value="medical">Medical Emergency</option>
                <option value="personal">Personal Work</option>
                <option value="family">Family Event</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Destination *</label>
              <input 
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                placeholder="Enter destination"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Out Date *</label>
                <input 
                  type="date"
                  name="outDate"
                  value={formData.outDate}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Out Time *</label>
                <input 
                  type="time"
                  name="outTime"
                  value={formData.outTime}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Return Date *</label>
                <input 
                  type="date"
                  name="returnDate"
                  value={formData.returnDate}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Return Time *</label>
                <input 
                  type="time"
                  name="returnTime"
                  value={formData.returnTime}
                  onChange={handleInputChange}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Contact Number *</label>
              <input 
                type="tel"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                placeholder="Your contact number"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Emergency Contact *</label>
              <input 
                type="tel"
                name="emergencyContact"
                value={formData.emergencyContact}
                onChange={handleInputChange}
                placeholder="Emergency contact number"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
              />
            </div>

            <button className="export-btn">📝 Submit Request</button>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="section">
          <div className="section-header">
            <span className="section-title">📋 My Gate Passes</span>
          </div>

          <div className="menu-day">
            <h3 className="menu-day-title">Pending Approval</h3>
            <div className="forecast-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>Pass #2024-456</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>Purpose: Going Home</div>
                </div>
                <span style={{ backgroundColor: '#ffa500', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '14px' }}>
                  Pending
                </span>
              </div>
              <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                Out: Dec 26, 2025 10:00 AM | Return: Dec 28, 2025 08:00 PM
              </div>
            </div>
          </div>

          <div className="menu-day">
            <h3 className="menu-day-title">Approved</h3>
            <div className="forecast-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>Pass #2024-432</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>Purpose: Family Event</div>
                </div>
                <span style={{ backgroundColor: '#4caf50', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '14px' }}>
                  Approved
                </span>
              </div>
              <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                Out: Dec 15, 2025 02:00 PM | Return: Dec 16, 2025 10:00 PM
              </div>
            </div>

            <div className="forecast-item" style={{ flexDirection: 'column', alignItems: 'flex-start', marginTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>Pass #2024-398</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>Purpose: Medical Emergency</div>
                </div>
                <span style={{ backgroundColor: '#4caf50', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '14px' }}>
                  Completed
                </span>
              </div>
              <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                Out: Dec 10, 2025 09:00 AM | Return: Dec 10, 2025 06:00 PM
              </div>
            </div>
          </div>

          <div className="menu-day">
            <h3 className="menu-day-title">Rejected</h3>
            <div className="forecast-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>Pass #2024-389</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>Purpose: Personal Work</div>
                </div>
                <span style={{ backgroundColor: '#e74c3c', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '14px' }}>
                  Rejected
                </span>
              </div>
              <div style={{ fontSize: '14px', color: '#e74c3c', marginTop: '8px' }}>
                Reason: Insufficient notice period
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'guidelines' && (
        <div className="section">
          <div className="section-header">
            <span className="section-title">📖 Gate Pass Guidelines</span>
          </div>

          <div className="voting-section">
            <h3 className="voting-subtitle">Important Rules</h3>
            
            <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
              <div style={{ marginBottom: '16px' }}>
                <strong>1. Request Timeline:</strong>
                <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
                  <li>Regular passes must be requested at least 24 hours in advance</li>
                  <li>Emergency passes can be requested with immediate effect</li>
                </ul>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <strong>2. Approval Process:</strong>
                <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
                  <li>All passes require approval from the warden</li>
                  <li>Approval typically takes 2-4 hours during working hours</li>
                  <li>Weekend requests may take longer</li>
                </ul>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <strong>3. Time Restrictions:</strong>
                <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
                  <li>Regular out time: 6:00 AM - 10:00 PM</li>
                  <li>Late returns require special permission</li>
                  <li>Overnight stays need parental consent</li>
                </ul>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <strong>4. Documentation Required:</strong>
                <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
                  <li>Valid contact number</li>
                  <li>Emergency contact details</li>
                  <li>Medical passes may require documentation</li>
                </ul>
              </div>

              <div style={{ marginBottom: '16px' }}>
                <strong>5. Violations:</strong>
                <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
                  <li>Late returns without notification may result in warnings</li>
                  <li>Repeated violations may affect future pass approvals</li>
                  <li>False information will lead to disciplinary action</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="info-section" style={{ marginTop: '20px' }}>
            <div className="info-item">
              <div className="info-label">Emergency Contact</div>
              <div className="info-value">Warden: +880-1234-567890</div>
            </div>
            <div className="info-item right">
              <div className="info-label">Office Hours</div>
              <div className="info-value">Mon-Sat: 9 AM - 6 PM</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}