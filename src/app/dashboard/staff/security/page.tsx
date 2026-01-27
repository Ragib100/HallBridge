'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { StaffRoleGuard } from '@/components/staff/role-guard';

interface GatePass {
  id: string;
  studentName: string;
  studentId: string;
  roomNumber: string;
  purpose: string;
  destination: string;
  outDate: string;
  outTime: string;
  returnDate: string;
  returnTime: string;
  status: 'pending' | 'approved' | 'active' | 'completed' | 'late';
  contactNumber: string;
  actualOutTime?: string;
  actualReturnTime?: string;
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

// Mock data for gate passes
const mockGatePasses: GatePass[] = [
  {
    id: '1',
    studentName: 'Rahim Ahmed',
    studentId: '202314008',
    roomNumber: '201',
    purpose: 'Home Visit',
    destination: 'Dhaka',
    outDate: '2026-01-27',
    outTime: '10:00',
    returnDate: '2026-01-29',
    returnTime: '18:00',
    status: 'active',
    contactNumber: '+880 1712-345678',
    actualOutTime: '10:15',
  },
  {
    id: '2',
    studentName: 'Karim Khan',
    studentId: '202314012',
    roomNumber: '203',
    purpose: 'Medical',
    destination: 'Hospital',
    outDate: '2026-01-27',
    outTime: '14:00',
    returnDate: '2026-01-27',
    returnTime: '17:00',
    status: 'approved',
    contactNumber: '+880 1812-456789',
  },
  {
    id: '3',
    studentName: 'Fahim Hasan',
    studentId: '202314045',
    roomNumber: '205',
    purpose: 'Personal',
    destination: 'Market',
    outDate: '2026-01-26',
    outTime: '16:00',
    returnDate: '2026-01-26',
    returnTime: '20:00',
    status: 'late',
    contactNumber: '+880 1612-567890',
    actualOutTime: '16:30',
  },
];

// Mock entry/exit logs
const mockEntryLogs: EntryLog[] = [
  { id: '1', studentName: 'Rahim Ahmed', studentId: '202314008', roomNumber: '201', type: 'exit', time: '10:15 AM' },
  { id: '2', studentName: 'Anik Roy', studentId: '202314067', roomNumber: '207', type: 'entry', time: '09:45 AM' },
  { id: '3', studentName: 'David Johnson', studentId: '202214001', roomNumber: '201', type: 'exit', time: '09:30 AM' },
  { id: '4', studentName: 'Michael Charter', studentId: '202214015', roomNumber: '201', type: 'entry', time: '09:00 AM' },
];

export default function SecurityPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'passes' | 'logs'>('passes');
  const [gatePasses, setGatePasses] = useState<GatePass[]>(mockGatePasses);
  const [entryLogs] = useState<EntryLog[]>(mockEntryLogs);

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
    };
    const variant = variants[status];
    return <span className={`px-2 py-1 rounded text-xs font-medium ${variant.color}`}>{variant.label}</span>;
  };

  const handleVerifyExit = (passId: string) => {
    setGatePasses(prev =>
      prev.map(p =>
        p.id === passId
          ? { ...p, status: 'active' as const, actualOutTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) }
          : p
      )
    );
  };

  const handleVerifyReturn = (passId: string) => {
    const pass = gatePasses.find(p => p.id === passId);
    if (!pass) return;

    const now = new Date();
    const expectedReturn = new Date(`${pass.returnDate}T${pass.returnTime}`);
    const isLate = now > expectedReturn;

    setGatePasses(prev =>
      prev.map(p =>
        p.id === passId
          ? {
              ...p,
              status: isLate ? 'late' as const : 'completed' as const,
              actualReturnTime: now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
            }
          : p
      )
    );
  };

  const filteredPasses = gatePasses.filter(
    pass =>
      pass.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pass.studentId.includes(searchQuery) ||
      pass.roomNumber.includes(searchQuery)
  );

  return (
    <StaffRoleGuard allowedRoles={['security_guard']}>
    <div className="space-y-6">
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
                    <tr key={pass.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-gray-900">{pass.studentName}</p>
                          <p className="text-sm text-gray-500">{pass.studentId}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-gray-100 rounded text-sm">{pass.roomNumber}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-gray-900">{pass.purpose}</p>
                          <p className="text-sm text-gray-500">{pass.destination}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-gray-900">{pass.outTime}</p>
                          {pass.actualOutTime && (
                            <p className="text-xs text-green-600">Actual: {pass.actualOutTime}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="text-gray-900">{pass.returnTime}</p>
                          <p className="text-sm text-gray-500">{pass.returnDate}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(pass.status)}</td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {pass.status === 'approved' && (
                            <Button
                              size="sm"
                              onClick={() => handleVerifyExit(pass.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              Verify Exit
                            </Button>
                          )}
                          {pass.status === 'active' && (
                            <Button
                              size="sm"
                              onClick={() => handleVerifyReturn(pass.id)}
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
    </div>
    </StaffRoleGuard>
  );
}
