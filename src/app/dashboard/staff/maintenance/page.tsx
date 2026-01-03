'use client';

import '../staff.css';
import { useState } from 'react';

interface MaintenanceTask {
  id: string;
  title: string;
  room: string;
  reporter: string;
  time: string;
  tags: { label: string; type: 'emergency' | 'water' | 'electrical' | 'general' }[];
  status: 'pending' | 'in-progress' | 'completed';
}

const mockTasks: MaintenanceTask[] = [
  {
    id: '1',
    title: 'Broken Tap',
    room: 'Room 519',
    reporter: 'Ragib Hossen Rifat',
    time: '2 hours ago',
    tags: [
      { label: 'Emergency', type: 'emergency' },
      { label: 'Water', type: 'water' }
    ],
    status: 'pending'
  },
  {
    id: '2',
    title: 'Light not working',
    room: 'Room 305',
    reporter: 'Karim Ali',
    time: '4 hours ago',
    tags: [
      { label: 'Electrical', type: 'electrical' }
    ],
    status: 'pending'
  },
  {
    id: '3',
    title: 'AC maintenance',
    room: 'Room 412',
    reporter: 'Ahmed Khan',
    time: '1 day ago',
    tags: [
      { label: 'General', type: 'general' }
    ],
    status: 'in-progress'
  },
  {
    id: '4',
    title: 'Window repair',
    room: 'Room 201',
    reporter: 'Sara Rahman',
    time: '3 days ago',
    tags: [
      { label: 'General', type: 'general' }
    ],
    status: 'completed'
  }
];

export default function MaintenancePage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'in-progress' | 'completed'>('pending');

  const filteredTasks = mockTasks.filter(task => task.status === activeTab);
  const pendingCount = mockTasks.filter(t => t.status === 'pending').length;
  const inProgressCount = mockTasks.filter(t => t.status === 'in-progress').length;
  const completedCount = mockTasks.filter(t => t.status === 'completed').length;

  return (
    <div className="staff-page">
      <div className="staff-header">
        <h1>Mess Management</h1>
      </div>

      <div className="staff-content">
        <div className="staff-tabs">
          <button
            className={`staff-tab ${activeTab === 'pending' ? 'active' : ''}`}
            onClick={() => setActiveTab('pending')}
          >
            Pending ({pendingCount})
          </button>
          <button
            className={`staff-tab ${activeTab === 'in-progress' ? 'active' : ''}`}
            onClick={() => setActiveTab('in-progress')}
          >
            In Progress ({inProgressCount})
          </button>
          <button
            className={`staff-tab ${activeTab === 'completed' ? 'active' : ''}`}
            onClick={() => setActiveTab('completed')}
          >
            Completed
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'pending' && (
            <div>
              <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1a1a2e', marginBottom: '16px' }}>
                Emergency Tasks ({pendingCount})
              </h3>
            </div>
          )}

          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">📋</div>
              <p className="empty-state-text">No tasks in this category</p>
            </div>
          ) : (
            filteredTasks.map(task => (
              <div key={task.id} className="task-card">
                <div className="task-header">
                  <div className="task-title">{task.room}-{task.title}</div>
                  <div className="task-meta">
                    Repoted by:{task.reporter} •{task.time}
                  </div>
                </div>

                <div className="task-tags">
                  {task.tags.map((tag, index) => (
                    <span key={index} className={`task-tag ${tag.type}`}>
                      {tag.label}
                    </span>
                  ))}
                </div>

                <div className="task-actions">
                  {activeTab === 'pending' && (
                    <>
                      <button className="task-btn primary">Start Task</button>
                      <button className="task-btn secondary">View Details</button>
                    </>
                  )}
                  {activeTab === 'in-progress' && (
                    <>
                      <button className="task-btn success">Mark Complete</button>
                      <button className="task-btn secondary">View Details</button>
                    </>
                  )}
                  {activeTab === 'completed' && (
                    <button className="task-btn secondary">View Details</button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
