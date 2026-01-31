'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StaffRoleGuard } from '@/components/staff/role-guard';

interface GatePass {
  _id: string;
  passId: string;
  studentId: {
    _id: string;
    fullName: string;
    email: string;
    phone?: string;
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

interface EntryLog {
  id: string;
  studentName: string;
  studentId: string;
  roomNumber: string;
  type: 'entry' | 'exit';
  time: string;
  gatePassId?: string;
}

export default function SecurityPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'passes' | 'logs'>('passes');
  const [gatePasses, setGatePasses] = useState<GatePass[]>([]);
  const [entryLogs] = useState<EntryLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchGatePasses();
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

      await fetchGatePasses();
    } catch (err) {
      console.error("Action error:", err);
      alert(err instanceof Error ? err.message : 'Action failed');
    }
  };

  const activePassesCount = gatePasses.filter(p => p.status === 'active').length;
  const approvedPassesCount = gatePasses.filter(p => p.status === 'approved').length;
  const lateReturnsCount = gatePasses.filter(p => p.status === 'late').length;

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
    return <span className={`px-2 py-1 rounded text-xs font-medium ${variant.color}`}>{variant.label}</span>;
  };

  const formatDateTime = (date: string | Date) => {
    return new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (date: string | Date) => {
    return new Date(date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const filteredPasses = gatePasses.filter(
    pass =>
      pass.studentId?.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pass.passId.includes(searchQuery)
  );

  return (
    <StaffRoleGuard allowedRoles={['security_guard']}>
    <div className="space-y-6">
      {loading && (
        <div className="text-center py-8">
          <div className="text-gray-600">Loading gate passes...</div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm">Currently Out</p>
                <p className="text-3xl font-bold">{activePassesCount}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm">Approved Passes</p>
                <p className="text-3xl font-bold">{approvedPassesCount}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-red-500 to-red-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-red-100 text-sm">Late Returns</p>
                <p className="text-3xl font-bold">{lateReturnsCount}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm">Today's Logs</p>
                <p className="text-3xl font-bold">{entryLogs.length}</p>
              </div>
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('passes')}
          className={`pb-3 px-1 text-sm font-medium transition-colors ${
            activeTab === 'passes'
              ? 'text-[#2D6A4F] border-b-2 border-[#2D6A4F]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Gate Passes
        </button>
        <button
          onClick={() => setActiveTab('logs')}
          className={`pb-3 px-1 text-sm font-medium transition-colors ${
            activeTab === 'logs'
              ? 'text-[#2D6A4F] border-b-2 border-[#2D6A4F]'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Entry/Exit Logs
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Input
          type="text"
          placeholder="Search by name, ID, or room..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
        <svg
          className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>

      {/* Gate Passes Tab */}
      {activeTab === 'passes' && (
        <Card>
          <CardHeader className="border-b">
            <h3 className="text-lg font-semibold">Active Gate Passes</h3>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Student</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Room</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Purpose</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Out Time</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Return Time</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {filteredPasses.map((pass) => (
                    <tr key={pass._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{pass.studentId?.fullName || 'N/A'}</p>
                          <p className="text-sm text-gray-500">{pass.passId}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-100 rounded text-sm">{pass.studentId?.phone || 'N/A'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-gray-900">{pass.purpose === 'other' && pass.purposeDetails ? pass.purposeDetails : pass.purpose}</p>
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
                            <Button
                              size="sm"
                              onClick={() => handleAction(pass._id, 'approve')}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Approve
                            </Button>
                          )}
                          {pass.status === 'approved' && (
                            <Button
                              size="sm"
                              onClick={() => handleAction(pass._id, 'verify_exit')}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Verify Exit
                            </Button>
                          )}
                          {pass.status === 'active' && (
                            <Button
                              size="sm"
                              onClick={() => handleAction(pass._id, 'verify_return')}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              Verify Return
                            </Button>
                          )}
                          {pass.status === 'late' && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              Contact
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Entry/Exit Logs Tab */}
      {activeTab === 'logs' && (
        <Card>
          <CardHeader className="border-b">
            <h3 className="text-lg font-semibold">Today's Entry/Exit Log</h3>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Student</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Room</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Type</th>
                    <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {entryLogs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{log.studentName}</p>
                          <p className="text-sm text-gray-500">{log.studentId}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-100 rounded text-sm">{log.roomNumber}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            log.type === 'entry'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-orange-100 text-orange-700'
                          }`}
                        >
                          {log.type === 'entry' ? '↓ Entry' : '↑ Exit'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-600">{log.time}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
      </>
      )}
    </div>
    </StaffRoleGuard>
  );
}
