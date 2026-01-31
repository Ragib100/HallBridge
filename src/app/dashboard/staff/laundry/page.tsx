'use client';

import { useState, useEffect } from 'react';
import { StaffRoleGuard } from '@/components/staff/role-guard';
import { Spinner } from '@/components/ui/spinner';

interface LaundryItem {
  type: string;
  quantity: number;
}

interface LaundryRequest {
  id: string;
  requestId: string;
  student: {
    fullName: string;
    roomNumber?: string;
  };
  items: LaundryItem[];
  totalItems: number;
  status: string;
  expectedDelivery: string;
  pickupDate?: string;
  actualDelivery?: string;
  studentNotes?: string;
  staffNotes?: string;
  createdAt: string;
}

interface Stats {
  pending: number;
  collected: number;
  washing: number;
  ready: number;
  todayDelivered: number;
}

const STATUS_OPTIONS = [
  { value: 'pending', label: 'Pending', icon: '⏳' },
  { value: 'collected', label: 'Collected', icon: '📦' },
  { value: 'washing', label: 'Washing', icon: '🧼' },
  { value: 'ready', label: 'Ready', icon: '✅' },
  { value: 'delivered', label: 'Delivered', icon: '🏠' },
];

const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700' },
  collected: { bg: 'bg-blue-100', text: 'text-blue-700' },
  washing: { bg: 'bg-purple-100', text: 'text-purple-700' },
  ready: { bg: 'bg-green-100', text: 'text-green-700' },
  delivered: { bg: 'bg-gray-100', text: 'text-gray-700' },
};

const ITEM_ICONS: Record<string, string> = {
  shirt: '👕',
  pant: '👖',
  bedsheet: '🛏️',
  towel: '🧴',
  other: '👔',
};

export default function LaundryPage() {
  const [requests, setRequests] = useState<LaundryRequest[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>('pending');

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/common/laundry');
      const data = await response.json();
      
      if (response.ok) {
        setRequests(data.requests);
        setStats(data.stats);
      } else {
        setError(data.message);
      }
    } catch {
      setError('Failed to fetch laundry requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setUpdating(id);
    try {
      const response = await fetch('/api/common/laundry', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (response.ok) {
        fetchRequests();
      } else {
        const data = await response.json();
        setError(data.message);
      }
    } catch {
      setError('Failed to update status');
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const getNextStatus = (currentStatus: string): string | null => {
    const order = ['pending', 'collected', 'washing', 'ready', 'delivered'];
    const currentIndex = order.indexOf(currentStatus);
    if (currentIndex < order.length - 1) {
      return order[currentIndex + 1];
    }
    return null;
  };

  const filteredRequests = requests.filter(r => 
    activeTab === 'all' ? true : r.status === activeTab
  );

  if (loading) {
    return (
      <StaffRoleGuard allowedRoles={['laundry_manager']}>
        <div className="flex items-center justify-center h-64">
          <Spinner className="w-6 h-6 text-[#2D6A4F]" />
        </div>
      </StaffRoleGuard>
    );
  }

  return (
    <StaffRoleGuard allowedRoles={['laundry_manager']}>
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
            <button onClick={() => setError(null)} className="float-right">&times;</button>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-xl">⏳</div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats?.pending || 0}</p>
                <p className="text-xs text-gray-500">Pending</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl">📦</div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats?.collected || 0}</p>
                <p className="text-xs text-gray-500">Collected</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-xl">🧼</div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats?.washing || 0}</p>
                <p className="text-xs text-gray-500">Washing</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-xl">✅</div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats?.ready || 0}</p>
                <p className="text-xs text-gray-500">Ready</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">🏠</div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats?.todayDelivered || 0}</p>
                <p className="text-xs text-gray-500">Today Delivered</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl p-2 shadow-sm">
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'all'
                  ? 'bg-[#2D6A4F] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              All ({requests.length})
            </button>
            {STATUS_OPTIONS.map(opt => {
              const count = requests.filter(r => r.status === opt.value).length;
              return (
                <button
                  key={opt.value}
                  onClick={() => setActiveTab(opt.value)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === opt.value
                      ? 'bg-[#2D6A4F] text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {opt.icon} {opt.label} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* Requests List */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Laundry Requests</h2>
          
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <span className="text-5xl mb-4 block">🧺</span>
              <p className="text-lg font-medium">No requests in this category</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRequests.map(request => {
                const statusColor = STATUS_COLORS[request.status] || STATUS_COLORS.pending;
                const nextStatus = getNextStatus(request.status);
                
                return (
                  <div key={request.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-gray-800">{request.requestId}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor.bg} ${statusColor.text}`}>
                            {STATUS_OPTIONS.find(o => o.value === request.status)?.label}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          {request.student.fullName}
                          {request.student.roomNumber && ` • Room ${request.student.roomNumber}`}
                        </p>
                      </div>
                      
                      {nextStatus && (
                        <button
                          onClick={() => handleStatusUpdate(request.id, nextStatus)}
                          disabled={updating === request.id}
                          className="px-4 py-2 bg-[#2D6A4F] text-white rounded-lg text-sm font-medium hover:bg-[#245a42] disabled:opacity-50"
                        >
                          {updating === request.id ? (
                            <Spinner className="w-4 h-4" />
                          ) : (
                            `Mark as ${STATUS_OPTIONS.find(o => o.value === nextStatus)?.label}`
                          )}
                        </button>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      {request.items.map((item, idx) => (
                        <span key={idx} className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-600">
                          {ITEM_ICONS[item.type] || '👔'} {item.quantity}x {item.type}
                        </span>
                      ))}
                      <span className="bg-[#E8F5E9] text-[#2D6A4F] px-2 py-1 rounded text-sm font-medium">
                        Total: {request.totalItems} items
                      </span>
                    </div>
                    
                    <div className="text-xs text-gray-500 flex flex-wrap gap-4">
                      <span>Submitted: {formatDate(request.createdAt)}</span>
                      <span>Expected: {formatDate(request.expectedDelivery)}</span>
                      {request.pickupDate && <span>Collected: {formatDate(request.pickupDate)}</span>}
                    </div>
                    
                    {request.studentNotes && (
                      <div className="mt-2 p-2 bg-yellow-50 rounded text-sm text-yellow-700">
                        <strong>Student Note:</strong> {request.studentNotes}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </StaffRoleGuard>
  );
}
