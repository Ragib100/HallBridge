'use client';

import { useState } from 'react';
import '../../staff/staff.css';

export default function StudentMaintenancePage() {
  const [activeTab, setActiveTab] = useState('request');
  const [formData, setFormData] = useState({
    category: '',
    priority: '',
    location: '',
    description: '',
    contactNumber: '',
    preferredTime: ''
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
          New Request
        </div>
        <div 
          className={`tab ${activeTab === 'my-requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('my-requests')}
        >
          My Requests
        </div>
        <div 
          className={`tab ${activeTab === 'faq' ? 'active' : ''}`}
          onClick={() => setActiveTab('faq')}
        >
          FAQ
        </div>
      </div>

      {activeTab === 'request' && (
        <div className="section">
          <div className="section-header">
            <span className="section-title">🔧 Submit Maintenance Request</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Category *</label>
              <select 
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
              >
                <option value="">Select Category</option>
                <option value="electrical">Electrical</option>
                <option value="plumbing">Plumbing</option>
                <option value="furniture">Furniture</option>
                <option value="ac-heating">AC/Heating</option>
                <option value="doors-windows">Doors & Windows</option>
                <option value="internet">Internet/Wi-Fi</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Priority *</label>
              <select 
                name="priority"
                value={formData.priority}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
              >
                <option value="">Select Priority</option>
                <option value="urgent">Urgent (Within 24 hours)</option>
                <option value="high">High (Within 2-3 days)</option>
                <option value="normal">Normal (Within a week)</option>
                <option value="low">Low (Can wait)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Location *</label>
              <input 
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="Room number or specific location"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Description *</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the issue in detail..."
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', minHeight: '100px' }}
              />
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
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>Preferred Time</label>
              <input 
                type="text"
                name="preferredTime"
                value={formData.preferredTime}
                onChange={handleInputChange}
                placeholder="e.g., Morning (9 AM - 12 PM)"
                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }}
              />
            </div>

            <button className="export-btn">📝 Submit Request</button>
          </div>
        </div>
      )}

      {activeTab === 'my-requests' && (
        <div className="section">
          <div className="section-header">
            <span className="section-title">📋 My Maintenance Requests</span>
          </div>

          <div className="menu-day">
            <h3 className="menu-day-title">In Progress</h3>
            <div className="forecast-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>Request #MT-2024-089</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>Category: Electrical</div>
                </div>
                <span style={{ backgroundColor: '#007aff', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '14px' }}>
                  In Progress
                </span>
              </div>
              <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                Issue: Light fixture not working in Room 305
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>
                Assigned to: John (Electrician) | ETA: Dec 24, 2025
              </div>
            </div>

            <div className="forecast-item" style={{ flexDirection: 'column', alignItems: 'flex-start', marginTop: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>Request #MT-2024-091</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>Category: Plumbing</div>
                </div>
                <span style={{ backgroundColor: '#007aff', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '14px' }}>
                  In Progress
                </span>
              </div>
              <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                Issue: Leaking tap in bathroom
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>
                Assigned to: Mike (Plumber) | ETA: Dec 25, 2025
              </div>
            </div>
          </div>

          <div className="menu-day">
            <h3 className="menu-day-title">Pending Assignment</h3>
            <div className="forecast-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>Request #MT-2024-095</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>Category: Internet/Wi-Fi</div>
                </div>
                <span style={{ backgroundColor: '#ffa500', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '14px' }}>
                  Pending
                </span>
              </div>
              <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                Issue: Weak Wi-Fi signal in room
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>
                Submitted: Dec 24, 2025 at 10:30 AM
              </div>
            </div>
          </div>

          <div className="menu-day">
            <h3 className="menu-day-title">Completed</h3>
            <div className="forecast-item" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <div>
                  <div style={{ fontWeight: 'bold' }}>Request #MT-2024-078</div>
                  <div style={{ fontSize: '14px', color: '#666' }}>Category: Furniture</div>
                </div>
                <span style={{ backgroundColor: '#4caf50', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '14px' }}>
                  Completed
                </span>
              </div>
              <div style={{ fontSize: '14px', color: '#666', marginTop: '8px' }}>
                Issue: Broken chair in study room
              </div>
              <div style={{ fontSize: '14px', color: '#666' }}>
                Completed on: Dec 20, 2025
              </div>
              <button className="export-btn" style={{ marginTop: '8px', padding: '6px 12px', fontSize: '14px' }}>
                ⭐ Rate Service
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'faq' && (
        <div className="section">
          <div className="section-header">
            <span className="section-title">❓ Frequently Asked Questions</span>
          </div>

          <div className="voting-section">
            <div style={{ marginBottom: '24px' }}>
              <h3 className="voting-subtitle">Q: How long does it take to resolve a maintenance request?</h3>
              <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#666', marginTop: '8px' }}>
                A: Resolution time depends on the priority and complexity:
                <ul style={{ marginLeft: '20px', marginTop: '8px' }}>
                  <li>Urgent issues: Within 24 hours</li>
                  <li>High priority: 2-3 days</li>
                  <li>Normal priority: Within a week</li>
                  <li>Low priority: Based on staff availability</li>
                </ul>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 className="voting-subtitle">Q: Can I track the status of my request?</h3>
              <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#666', marginTop: '8px' }}>
                A: Yes! You can track all your requests in the "My Requests" tab. You'll receive notifications when your request is assigned to a technician and when work is completed.
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 className="voting-subtitle">Q: What should I do in case of an emergency?</h3>
              <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#666', marginTop: '8px' }}>
                A: For emergencies (electrical hazards, major leaks, etc.), contact the maintenance office directly at +880-1234-567890. Also submit a request marked as "Urgent" for documentation.
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 className="voting-subtitle">Q: Can I request specific maintenance time slots?</h3>
              <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#666', marginTop: '8px' }}>
                A: Yes, you can mention your preferred time in the request form. While we'll try to accommodate your preference, urgent issues may need immediate attention.
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <h3 className="voting-subtitle">Q: What if I'm not satisfied with the service?</h3>
              <div style={{ fontSize: '14px', lineHeight: '1.6', color: '#666', marginTop: '8px' }}>
                A: After completion, you can rate the service and provide feedback. If the issue persists, you can submit a follow-up request referencing the original ticket number.
              </div>
            </div>
          </div>

          <div className="info-section" style={{ marginTop: '20px' }}>
            <div className="info-item">
              <div className="info-label">Emergency Contact</div>
              <div className="info-value">+880-1234-567890</div>
            </div>
            <div className="info-item right">
              <div className="info-label">Office Hours</div>
              <div className="info-value">24/7 Emergency Service</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}