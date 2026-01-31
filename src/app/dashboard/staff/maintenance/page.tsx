'use client';

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

const priorityConfig: Record<string, { label: string; type: TagType; color: string }> = {
  'urgent': { label: 'Emergency', type: 'emergency', color: 'bg-red-100 text-red-700' },
  'high': { label: 'High', type: 'water', color: 'bg-orange-100 text-orange-700' },
  'normal': { label: 'Normal', type: 'general', color: 'bg-blue-100 text-blue-700' },
  'low': { label: 'Low', type: 'general', color: 'bg-gray-100 text-gray-700' },
};

const categoryColors: Record<string, string> = {
  'electrical': 'bg-yellow-100 text-yellow-700',
  'plumbing': 'bg-cyan-100 text-cyan-700',
  'furniture': 'bg-amber-100 text-amber-700',
  'ac-heating': 'bg-indigo-100 text-indigo-700',
  'doors-windows': 'bg-purple-100 text-purple-700',
  'internet': 'bg-green-100 text-green-700',
  'other': 'bg-gray-100 text-gray-700',
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
      const response = await fetch('/api/common/maintenance');
      const data = await response.json();
      
      if (response.ok) {
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
      const response = await fetch('/api/common/maintenance', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: taskId, status: newStatus }),
      });

      if (response.ok) {
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

  const getPriorityTag = (priority: string) => {
    return priorityConfig[priority] || { label: priority, type: 'general' as TagType, color: 'bg-gray-100 text-gray-700' };
  };

  const getCategoryTag = (category: string) => {
    const label = categoryLabels[category] || category;
    const color = categoryColors[category] || 'bg-gray-100 text-gray-700';
    const type: TagType = category === 'plumbing' ? 'water' : category === 'electrical' ? 'electrical' : 'general';
    return { label, type, color };
  };

  if (loading) {
    return (
      <StaffRoleGuard allowedRoles={['maintenance_staff']}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-gray-500">Loading maintenance requests...</div>
        </div>
      </StaffRoleGuard>
    );
  }

  return (
    <StaffRoleGuard allowedRoles={['maintenance_staff']}>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-gray-500 text-sm">Pending</p>
                <p className="text-2xl font-bold text-gray-800">{pendingCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-gray-500 text-sm">In Progress</p>
                <p className="text-2xl font-bold text-gray-800">{inProgressCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-gray-500 text-sm">Completed</p>
                <p className="text-2xl font-bold text-gray-800">{completedCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'pending'
                ? 'text-[#2D6A4F] border-b-2 border-[#2D6A4F]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setActiveTab('in-progress')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'in-progress'
                ? 'text-[#2D6A4F] border-b-2 border-[#2D6A4F]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            In Progress ({inProgressCount})
          </button>
          <button
            onClick={() => setActiveTab('completed')}
            className={`px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === 'completed'
                ? 'text-[#2D6A4F] border-b-2 border-[#2D6A4F]'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        {/* Task Cards */}
        <div className="bg-white rounded-xl shadow-sm">
          {filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-gray-500">
              <span className="text-5xl mb-4">📋</span>
              <p className="text-lg font-medium">No tasks in this category</p>
              <p className="text-sm">Tasks will appear here when available</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredTasks.map(task => (
                <div key={task.id} className="p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-gray-800">
                          {task.location} - {categoryLabels[task.category] || task.category}
                        </h3>
                        <span className="text-xs text-gray-400">#{task.requestId}</span>
                      </div>
                      
                      {/* Tags */}
                      <div className="flex gap-2 mb-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityTag(task.priority).color}`}>
                          {getPriorityTag(task.priority).label}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getCategoryTag(task.category).color}`}>
                          {getCategoryTag(task.category).label}
                        </span>
                      </div>
                      
                      {/* Description */}
                      <p className="text-sm text-gray-600 mb-3">{task.description}</p>
                      
                      {/* Meta */}
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Reported by: {task.reporter?.fullName || 'Unknown'}</span>
                        <span>•</span>
                        <span>{getTimeAgo(task.createdAt)}</span>
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex flex-col gap-2">
                      {activeTab === 'pending' && (
                        <button 
                          className="px-4 py-2 bg-[#2D6A4F] text-white rounded-lg text-sm font-medium hover:bg-[#245a42] transition-colors disabled:opacity-50"
                          disabled={updating === task.id}
                          onClick={() => handleStatusUpdate(task.id, 'in-progress')}
                        >
                          {updating === task.id ? 'Starting...' : 'Start Task'}
                        </button>
                      )}
                      {activeTab === 'in-progress' && (
                        <button 
                          className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
                          disabled={updating === task.id}
                          onClick={() => handleStatusUpdate(task.id, 'completed')}
                        >
                          {updating === task.id ? 'Completing...' : 'Mark Complete'}
                        </button>
                      )}
                      <ViewIssueDialog task={{
                        id: task.id,
                        title: task.description,
                        room: task.location,
                        reporter: task.reporter?.fullName || 'Unknown',
                        time: getTimeAgo(task.createdAt),
                        tags: [getPriorityTag(task.priority), getCategoryTag(task.category)],
                        status: task.status,
                      }}>
                        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                          View Details
                        </button>
                      </ViewIssueDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </StaffRoleGuard>
  );
}
