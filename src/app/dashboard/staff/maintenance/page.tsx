'use client';

import '../staff.css';
import { useState, useEffect } from 'react';
import { ViewIssueDialog } from '@/components/staff/view_issue';
import { StaffRoleGuard } from '@/components/staff/role-guard';

interface MaintenanceTask {
  id: string;
  requestId: string;
  title: string;
  location: string;
  description: string;
  category: string;
  priority: string;
  reporter: { fullName: string; email: string };
  contactNumber?: string;
  createdAt: string;
  status: 'pending' | 'in-progress' | 'completed';
  assignedTo?: { fullName: string };
  estimatedCompletion?: string;
  completedAt?: string;
}

const categoryLabels: Record<string, string> = {
  'electrical': 'Electrical',
  'plumbing': 'Plumbing',
  'furniture': 'Furniture',
  'ac-heating': 'AC/Heating',
  'doors-windows': 'Doors & Windows',
  'internet': 'Internet/Wi-Fi',
  'other': 'Other',
};

type TagType = 'emergency' | 'water' | 'electrical' | 'general';

const priorityConfig: Record<string, { label: string; type: TagType }> = {
  'urgent': { label: 'Emergency', type: 'emergency' },
  'high': { label: 'High', type: 'water' },
  'normal': { label: 'Normal', type: 'general' },
  'low': { label: 'Low', type: 'general' },
};

export default function MaintenancePage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'in-progress' | 'completed'>('pending');
  const [tasks, setTasks] = useState<MaintenanceTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch('/api/maintenance');
      const data = await response.json();
      
      if (response.ok) {
        // Transform API response to match component interface
        const transformedTasks = (data.requests || []).map((r: {
          id: string;
          requestId: string;
          location: string;
          description: string;
          category: string;
          priority: string;
          student: { fullName: string; email: string };
          contactNumber?: string;
          createdAt: string;
          status: 'pending' | 'in-progress' | 'completed';
          assignedTo?: { fullName: string };
          estimatedCompletion?: string;
          completedAt?: string;
        }) => ({
          id: r.id,
          requestId: r.requestId,
          title: r.description.substring(0, 50) + (r.description.length > 50 ? '...' : ''),
          location: r.location,
          description: r.description,
          category: r.category,
          priority: r.priority,
          reporter: r.student,
          contactNumber: r.contactNumber,
          createdAt: r.createdAt,
          status: r.status,
          assignedTo: r.assignedTo,
          estimatedCompletion: r.estimatedCompletion,
          completedAt: r.completedAt,
        }));
        setTasks(transformedTasks);
      }
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (taskId: string, newStatus: 'in-progress' | 'completed') => {
    setUpdating(taskId);
    try {
      const response = await fetch('/api/maintenance', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, status: newStatus }),
      });

      if (response.ok) {
        // Update local state
        setTasks(prev => prev.map(task => 
          task.id === taskId 
            ? { ...task, status: newStatus, completedAt: newStatus === 'completed' ? new Date().toISOString() : task.completedAt }
            : task
        ));
      }
    } catch (error) {
      console.error('Failed to update task:', error);
    } finally {
      setUpdating(null);
    }
  };

  const filteredTasks = tasks.filter(task => task.status === activeTab);
  const pendingCount = tasks.filter(t => t.status === 'pending').length;
  const inProgressCount = tasks.filter(t => t.status === 'in-progress').length;
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  const getPriorityTag = (priority: string): { label: string; type: TagType } => {
    const config = priorityConfig[priority] || { label: priority, type: 'general' as TagType };
    return { label: config.label, type: config.type };
  };

  const getCategoryTag = (category: string): { label: string; type: TagType } => {
    const label = categoryLabels[category] || category;
    const type: TagType = category === 'plumbing' ? 'water' : category === 'electrical' ? 'electrical' : 'general';
    return { label, type };
  };

  if (loading) {
    return (
      <StaffRoleGuard allowedRoles={['maintenance_staff']}>
        <div className="staff-page">
          <div className="staff-content" style={{ textAlign: 'center', padding: '40px' }}>
            Loading maintenance requests...
          </div>
        </div>
      </StaffRoleGuard>
    );
  }

  return (
    <StaffRoleGuard allowedRoles={['maintenance_staff']}>
      <div className="staff-page">
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
              Completed ({completedCount})
            </button>
          </div>

          <div className="tab-content">
            {activeTab === 'pending' && pendingCount > 0 && (
              <div>
                <h3 style={{ fontSize: '16px', fontWeight: 600, color: '#1a1a2e', marginBottom: '16px' }}>
                  Pending Tasks ({pendingCount})
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
                    <div className="task-title">{task.location} - {categoryLabels[task.category] || task.category}</div>
                    <div className="task-meta">
                      Reported by: {task.reporter?.fullName || 'Unknown'} • {getTimeAgo(task.createdAt)}
                    </div>
                    <div className="task-meta" style={{ marginTop: '4px' }}>
                      Request ID: {task.requestId}
                    </div>
                  </div>

                  <div className="task-tags">
                    <span className={`task-tag ${getPriorityTag(task.priority).type}`}>
                      {getPriorityTag(task.priority).label}
                    </span>
                    <span className={`task-tag ${getCategoryTag(task.category).type}`}>
                      {getCategoryTag(task.category).label}
                    </span>
                  </div>

                  <div style={{ fontSize: '14px', color: '#666', margin: '8px 0' }}>
                    {task.description}
                  </div>

                  <div className="task-actions">
                    {activeTab === 'pending' && (
                      <>
                        <button 
                          className="task-btn primary"
                          disabled={updating === task.id}
                          onClick={() => handleStatusUpdate(task.id, 'in-progress')}
                        >
                          {updating === task.id ? 'Starting...' : 'Start Task'}
                        </button>
                        <ViewIssueDialog task={{
                          id: task.id,
                          title: task.description,
                          room: task.location,
                          reporter: task.reporter?.fullName || 'Unknown',
                          time: getTimeAgo(task.createdAt),
                          tags: [getPriorityTag(task.priority), getCategoryTag(task.category)],
                          status: task.status,
                        }}>
                          <button className="task-btn secondary">View Details</button>
                        </ViewIssueDialog>
                      </>
                    )}
                    {activeTab === 'in-progress' && (
                      <>
                        <button 
                          className="task-btn success"
                          disabled={updating === task.id}
                          onClick={() => handleStatusUpdate(task.id, 'completed')}
                        >
                          {updating === task.id ? 'Completing...' : 'Mark Complete'}
                        </button>
                        <ViewIssueDialog task={{
                          id: task.id,
                          title: task.description,
                          room: task.location,
                          reporter: task.reporter?.fullName || 'Unknown',
                          time: getTimeAgo(task.createdAt),
                          tags: [getPriorityTag(task.priority), getCategoryTag(task.category)],
                          status: task.status,
                        }}>
                          <button className="task-btn secondary">View Details</button>
                        </ViewIssueDialog>
                      </>
                    )}
                    {activeTab === 'completed' && (
                      <ViewIssueDialog task={{
                        id: task.id,
                        title: task.description,
                        room: task.location,
                        reporter: task.reporter?.fullName || 'Unknown',
                        time: getTimeAgo(task.createdAt),
                        tags: [getPriorityTag(task.priority), getCategoryTag(task.category)],
                        status: task.status,
                      }}>
                        <button className="task-btn secondary">View Details</button>
                      </ViewIssueDialog>
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
