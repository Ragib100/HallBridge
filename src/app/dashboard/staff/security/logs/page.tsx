'use client';

import { useState, useEffect } from 'react';
import { StaffRoleGuard } from '@/components/staff/role-guard';
import { Spinner } from '@/components/ui/spinner';

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
    destination?: string;
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

type FilterType = 'all' | 'entry' | 'exit';

export default function EntryExitLogsPage() {
  const [logs, setLogs] = useState<EntryExitLog[]>([]);
  const [stats, setStats] = useState<LogStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDate, setFilterDate] = useState('');

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filterDate) params.append('date', filterDate);
      if (filterType !== 'all') params.append('type', filterType);

      const response = await fetch(`/api/staff/security/logs?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch logs');
      const data = await response.json();
      setLogs(data.logs || []);
      setStats(data.stats || null);
      setError(null);
    } catch {
      setError('Failed to load entry/exit logs');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [filterType, filterDate]);

  const filteredLogs = logs.filter((log) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      log.student?.fullName?.toLowerCase().includes(q) ||
      log.logId?.toLowerCase().includes(q) ||
      log.gatePass?.passId?.toLowerCase().includes(q) ||
      log.student?.roomNumber?.toLowerCase().includes(q)
    );
  });

  const formatTime = (date: string) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Dhaka',
    });
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      timeZone: 'Asia/Dhaka',
    });
  };

  return (
    <StaffRoleGuard allowedRoles={['security_guard']}>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Today Entries</p>
                <p className="text-2xl font-bold text-gray-800">{stats?.todayEntries ?? 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Today Exits</p>
                <p className="text-2xl font-bold text-gray-800">{stats?.todayExits ?? 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Late Returns</p>
                <p className="text-2xl font-bold text-gray-800">{stats?.lateReturns ?? 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="text-gray-500 text-sm">Currently Out</p>
                <p className="text-2xl font-bold text-gray-800">{stats?.currentlyOut ?? 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
          <div className="flex gap-2 bg-white rounded-xl p-2 shadow-sm">
            {[
              { id: 'all' as FilterType, label: 'All' },
              { id: 'entry' as FilterType, label: '↩️ Entries' },
              { id: 'exit' as FilterType, label: '↪️ Exits' },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setFilterType(filter.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filterType === filter.id
                    ? 'bg-[#2D6A4F] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="relative flex-1 max-w-sm">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search by name, room, or pass ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] bg-white shadow-sm"
            />
          </div>

          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] bg-white shadow-sm"
          />

          {(filterDate || searchQuery) && (
            <button
              onClick={() => { setFilterDate(''); setSearchQuery(''); }}
              className="px-3 py-2 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg bg-white shadow-sm"
            >
              Clear
            </button>
          )}
        </div>

        {/* Loading / Error */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <Spinner className="w-6 h-6 text-[#2D6A4F]" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
            <button onClick={fetchLogs} className="ml-4 underline">Retry</button>
          </div>
        )}

        {/* Logs Table */}
        {!loading && !error && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            {filteredLogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <span className="text-5xl mb-4">📋</span>
                <p className="text-lg font-medium">No logs found</p>
                <p className="text-sm">
                  {searchQuery || filterDate
                    ? 'Try adjusting your filters'
                    : 'Entry/exit logs will appear here when students check in/out'}
                </p>
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
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Logged By</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="text-gray-900 font-medium">{formatTime(log.timestamp)}</p>
                          <p className="text-xs text-gray-500">{formatDate(log.timestamp)}</p>
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
                          <p className="text-sm text-gray-700">{log.loggedBy?.fullName || '-'}</p>
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

            {filteredLogs.length > 0 && (
              <div className="px-6 py-3 border-t border-gray-100 text-sm text-gray-500 bg-gray-50">
                Showing {filteredLogs.length} log{filteredLogs.length !== 1 ? 's' : ''}
                {searchQuery && ` matching "${searchQuery}"`}
              </div>
            )}
          </div>
        )}
      </div>
    </StaffRoleGuard>
  );
}
