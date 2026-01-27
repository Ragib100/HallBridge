'use client';

import '../staff.css';
import { useState } from 'react';
import { StaffRoleGuard } from '@/components/staff/role-guard';

interface LaundryItem {
  id: string;
  studentName: string;
  room: string;
  laundryId: string;
  itemCount: number;
  time: string;
  status: 'ready' | 'in-washing' | 'completed';
}

const mockLaundryItems: LaundryItem[] = [
  {
    id: '1',
    studentName: 'Ragib Ahmed',
    room: 'Room 519',
    laundryId: '#L2345',
    itemCount: 5,
    time: 'Ready since 2 hours ago',
    status: 'ready'
  },
  {
    id: '2',
    studentName: 'Karim Ali',
    room: 'Room 305',
    laundryId: '#L2346',
    itemCount: 4,
    time: 'Started 1 hour ago',
    status: 'in-washing'
  },
  {
    id: '3',
    studentName: 'Ahmed Khan',
    room: 'Room 412',
    laundryId: '#L2344',
    itemCount: 6,
    time: 'Completed yesterday',
    status: 'completed'
  },
  {
    id: '4',
    studentName: 'Sara Rahman',
    room: 'Room 201',
    laundryId: '#L2343',
    itemCount: 3,
    time: 'Completed 2 days ago',
    status: 'completed'
  }
];

export default function LaundryPage() {
  const [activeTab, setActiveTab] = useState<'ready' | 'in-washing' | 'completed'>('ready');

  const filteredItems = mockLaundryItems.filter(item => item.status === activeTab);
  const readyCount = mockLaundryItems.filter(i => i.status === 'ready').length;
  const inWashingCount = mockLaundryItems.filter(i => i.status === 'in-washing').length;

  return (
    <StaffRoleGuard allowedRoles={['laundry_manager']}>
    <div className="staff-page">
      <div className="staff-content">
        <div className="staff-tabs">
          <button
            className={`staff-tab ${activeTab === 'ready' ? 'active' : ''}`}
            onClick={() => setActiveTab('ready')}
          >
            Ready ({readyCount})
          </button>
          <button
            className={`staff-tab ${activeTab === 'in-washing' ? 'active' : ''}`}
            onClick={() => setActiveTab('in-washing')}
          >
            In Washing ({inWashingCount})
          </button>
          <button
            className={`staff-tab ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed
          </button>
        </div>

        <div className="tab-content">
          {filteredItems.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">🧺</div>
              <p className="empty-state-text">No items in this category</p>
            </div>
          ) : (
            filteredItems.map(item => (
              <div key={item.id} className="laundry-card">
                <div className="laundry-status">
                  {item.status === 'ready' && (
                    <>
                      <span>✅</span>
                      <span>Ready for Pickup</span>
                    </>
                  )}
                  {item.status === 'in-washing' && (
                    <>
                      <span>🔄</span>
                      <span>In Washing</span>
                    </>
                  )}
                  {item.status === 'completed' && (
                    <>
                      <span>✓</span>
                      <span>Collected</span>
                    </>
                  )}
                </div>

                <div className="laundry-info">
                  <div className="laundry-name">
                    {item.studentName} - {item.room}
                  </div>
                  <div className="laundry-details">
                    ID: {item.laundryId} • {item.itemCount} items • {item.time}
                  </div>
                </div>

                {item.status === 'in-washing' && (
                  <div className="laundry-progress">
                    <div className="laundry-progress-bar blue" style={{ width: '60%' }}></div>
                  </div>
                )}

                <div className="task-actions">
                  {item.status === 'ready' && (
                    <button className="task-btn primary">Mark Collected</button>
                  )}
                  {item.status === 'in-washing' && (
                    <button className="task-btn success">Mark Ready</button>
                  )}
                  {item.status === 'completed' && (
                    <button className="task-btn secondary">View Details</button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
    </StaffRoleGuard>
  );
}
