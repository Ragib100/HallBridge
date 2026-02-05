'use client';

import { useState, useEffect } from 'react';
import { StaffRoleGuard } from '@/components/staff/role-guard';
import { Spinner } from '@/components/ui/spinner';
import { getBDDate } from '@/lib/dates';

interface GatePass {
  _id: string;
  passId: string;
  studentId: {
    _id: string;
    fullName: string;
    email: string;
    phone?: string;
    roomNumber?: string;
  };
  purpose: string;
  purposeDetails?: string;
  destination: string;
  outDate: string;
  outTime: string;
  returnDate: string;
  returnTime: string;
  status: 'pending' | 'approved' | 'rejected' | 'active' | 'completed' | 'late';
  contactNumber: string;
  emergencyContact: string;
  actualOutTime?: string;
  actualReturnTime?: string;
  createdAt: string;
}

interface EntryExitLog {
  id: string;
  logId: string;
  student: {
    fullName: string;
    roomNumber?: string;
  };
  type: 'entry' | 'exit';
  timestamp: string;
  gatePass?: {
    passId: string;
    purpose: string;
  };
  loggedBy: {
    fullName: string;
  };
  notes?: string;
  isLate: boolean;
}

interface LogStats {
  todayEntries: number;
  todayExits: number;
  lateReturns: number;
  currentlyOut: number;
}

export default function SecurityPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'passes' | 'logs'>('passes');
  const [gatePasses, setGatePasses] = useState<GatePass[]>([]);
  const [logs, setLogs] = useState<EntryExitLog[]>([]);
  const [logStats, setLogStats] = useState<LogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGatePasses();
    fetchLogs();
  }, []);

  const fetchGatePasses = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/common/gate-pass');
      if (!response.ok) {
        throw new Error('Failed to fetch gate passes');
      }
      const data = await response.json();
      setGatePasses(data.passes || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load gate passes');
    } finally {
      setLoading(false);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await fetch('/api/staff/security/logs');
      if (response.ok) {
        const data = await response.json();
        setLogs(data.logs || []);
        setLogStats(data.stats || null);
      }
    } catch (err) {
      console.error('Failed to fetch logs:', err);
    }
  };

  const handleAction = async (passId: string, action: string) => {
    try {
      const response = await fetch('/api/common/gate-pass', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ passId, action }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data?.message || data?.error || 'Action failed');
        return;
      }

      // Log the entry/exit
      const pass = gatePasses.find(p => p._id === passId);
      if (pass && (action === 'verify_exit' || action === 'verify_return')) {
        await fetch('/api/staff/security/logs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            studentId: pass.studentId._id,
            type: action === 'verify_exit' ? 'exit' : 'entry',
            gatePassId: pass._id,
          }),
        });
        fetchLogs();
      }

      await fetchGatePasses();
    } catch (err) {
      console.error("Action error:", err);
      alert(err instanceof Error ? err.message : 'Action failed');
    }
  };

  const activePassesCount = logStats?.currentlyOut || gatePasses.filter(p => p.status === 'active').length;
  const approvedPassesCount = gatePasses.filter(p => p.status === 'approved').length;
  const lateReturnsCount = gatePasses.filter(p => p.status === 'late').length;
  const pendingCount = gatePasses.filter(p => p.status === 'pending').length;

  const getStatusBadge = (status: GatePass['status']) => {
    const variants: Record<string, { color: string; label: string }> = {
      pending: { color: 'bg-yellow-100 text-yellow-700', label: 'Pending' },
      approved: { color: 'bg-blue-100 text-blue-700', label: 'Approved' },
      active: { color: 'bg-green-100 text-green-700', label: 'Active (Out)' },
      completed: { color: 'bg-gray-100 text-gray-700', label: 'Completed' },
      late: { color: 'bg-red-100 text-red-700', label: 'Late Return' },
      rejected: { color: 'bg-red-100 text-red-700', label: 'Rejected' },
    };
    const variant = variants[status];
    return <span className={`px-3 py-1 rounded-full text-xs font-medium ${variant.color}`}>{variant.label}</span>;
  };

  const formatDateTime = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (date: string | Date) => {
    // Date parameter is already in DB (BD timezone), just format it
    return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Dhaka' });
  };

  const filteredPasses = gatePasses.filter(
    pass =>
      pass.studentId?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pass.passId.includes(searchQuery)
  );

  return (
    <StaffRoleGuard allowedRoles={['security_guard']}>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-gray-500 text-sm">Currently Out</p>
                <p className="text-2xl font-bold text-gray-800">{activePassesCount}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-gray-500 text-sm">Approved Passes</p>
                <p className="text-2xl font-bold text-gray-800">{approvedPassesCount}</p>
              </div>
            </div>
          </div>
          
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
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="flex-1">
                <p className="text-gray-500 text-sm">Late Returns</p>
                <p className="text-2xl font-bold text-gray-800">{lateReturnsCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs and Search */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex gap-1 border-b border-gray-200">
            <button
              onClick={() => setActiveTab('passes')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'passes'
                  ? 'text-[#2D6A4F] border-b-2 border-[#2D6A4F]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Gate Passes
            </button>
            <button
              onClick={() => setActiveTab('logs')}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === 'logs'
                  ? 'text-[#2D6A4F] border-b-2 border-[#2D6A4F]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Entry/Exit Logs
            </button>
          </div>
          
          <div className="relative max-w-sm">
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <Spinner className="w-6 h-6 text-[#2D6A4F]" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {!loading && !error && activeTab === 'passes' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {filteredPasses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <span className="text-5xl mb-4">🎫</span>
                <p className="text-lg font-medium">No gate passes found</p>
                <p className="text-sm">Gate passes will appear here when students request them</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Student</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Purpose</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Out Time</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Return Time</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredPasses.map((pass) => (
                      <tr key={pass._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{pass.studentId?.fullName || 'N/A'}</p>
                            <p className="text-sm text-gray-500">{pass.passId}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-gray-900 capitalize">{pass.purpose === 'other' && pass.purposeDetails ? pass.purposeDetails : pass.purpose}</p>
                            <p className="text-sm text-gray-500">{pass.destination}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-gray-900">{pass.outTime}</p>
                            {pass.actualOutTime && (
                              <p className="text-xs text-green-600">Actual: {formatTime(pass.actualOutTime)}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-gray-900">{pass.returnTime}</p>
                            <p className="text-sm text-gray-500">{formatDateTime(pass.returnDate)}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">{getStatusBadge(pass.status)}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {pass.status === 'pending' && (
                              <button
                                onClick={() => handleAction(pass._id, 'approve')}
                                className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                              >
                                Approve
                              </button>
                            )}
                            {pass.status === 'approved' && (
                              <button
                                onClick={() => handleAction(pass._id, 'verify_exit')}
                                className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                              >
                                Verify Exit
                              </button>
                            )}
                            {pass.status === 'active' && (
                              <button
                                onClick={() => handleAction(pass._id, 'verify_return')}
                                className="px-3 py-1.5 bg-[#2D6A4F] text-white rounded-lg text-sm font-medium hover:bg-[#245a42] transition-colors"
                              >
                                Verify Return
                              </button>
                            )}
                            {pass.status === 'late' && (
                              <button className="px-3 py-1.5 border border-red-300 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors cursor-pointer">
                                Contact
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {!loading && !error && activeTab === 'logs' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {logs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <span className="text-5xl mb-4">📋</span>
                <p className="text-lg font-medium">No logs yet</p>
                <p className="text-sm">Entry/Exit logs will appear here when students check in/out</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Time</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Student</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Gate Pass</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {logs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-gray-900">{new Date(log.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Dhaka' })}</p>
                          <p className="text-xs text-gray-500">{new Date(log.timestamp).toLocaleDateString('en-US', { timeZone: 'Asia/Dhaka' })}</p>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            log.type === 'entry' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-blue-100 text-blue-700'
                          }`}>
                            {log.type === 'entry' ? '↩️ Entry' : '↪️ Exit'}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">{log.student?.fullName || 'N/A'}</p>
                          {log.student?.roomNumber && (
                            <p className="text-sm text-gray-500">Room {log.student.roomNumber}</p>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {log.gatePass ? (
                            <div>
                              <p className="text-gray-900">{log.gatePass.passId}</p>
                              <p className="text-xs text-gray-500 capitalize">{log.gatePass.purpose}</p>
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          {log.isLate ? (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">
                              Late Return
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                              On Time
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </StaffRoleGuard>
  );
}
