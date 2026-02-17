'use client';

import { useState, useEffect } from 'react';
import { StaffRoleGuard } from '@/components/staff/role-guard';
import { Spinner } from '@/components/ui/spinner';
import { getBDDate } from '@/lib/dates';

type TimeRange = 'this-month' | 'last-month' | 'this-year';
type TabType = 'overview' | 'defaulters' | 'transactions';

interface Transaction {
  id: string;
  transactionId: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
  student?: string;
  studentId?: string;
  room?: string;
  addedBy?: string;
}

interface Defaulter {
  id: string;
  name: string;
  studentId: string;
  room: string;
  dueAmount: number;
  dueDate: string;
  monthsOverdue: number;
}

interface RevenueType {
  type: string;
  name: string;
  total: number;
  count: number;
}

interface ExpenseCategory {
  category: string;
  name: string;
  total: number;
  count: number;
}

interface FinancialData {
  summary: {
    totalRevenue: number;
    totalExpenses: number;
    netIncome: number;
    pendingDues: number;
    collectionRate: number;
    totalStudents: number;
    paidStudents: number;
    defaulterCount: number;
    totalSalaryBudget: number;
    totalSalaryPaid: number;
    totalSalaryPending: number;
  };
  revenueByType: RevenueType[];
  expensesByCategory: ExpenseCategory[];
  defaulters: Defaulter[];
  transactions: Transaction[];
  incomeTransactions: Transaction[];
  expenseTransactions: Transaction[];
  period: {
    label: string;
    range: string;
  };
}

const REVENUE_ICONS: Record<string, string> = {
  hall_fee: '🏠',
  mess_fee: '🍽️',
  laundry_fee: '🧺',
  fine: '⚠️',
};

const EXPENSE_ICONS: Record<string, string> = {
  market: '🛒',
  utilities: '💡',
  maintenance: '🔧',
  salary: '💼',
  equipment: '🖥️',
  other: '📦',
};

export default function FinancialsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('this-month');
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<FinancialData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sendingReminder, setSendingReminder] = useState<string | null>(null);

  const fetchFinancialData = async (range: TimeRange) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/staff/financials?range=${range}`);
      if (!response.ok) throw new Error('Failed to fetch data');
      const result = await response.json();
      setData(result);
      setError(null);
    } catch {
      setError('Failed to load financial data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData(timeRange);
  }, [timeRange]);

  const handleSendReminder = async (studentId: string) => {
    setSendingReminder(studentId);
    try {
      const response = await fetch('/api/staff/financials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentIds: [studentId] }),
      });
      const result = await response.json();
      if (response.ok) {
        alert(result.message || 'Reminder sent successfully');
      } else {
        alert(result.message || 'Failed to send reminder');
      }
    } catch {
      alert('Failed to send reminder');
    } finally {
      setSendingReminder(null);
    }
  };

  const handleSendAllReminders = async () => {
    if (!data?.defaulters.length) return;
    if (!confirm(`Send payment reminders to all ${data.defaulters.length} defaulters?`)) return;

    setSendingReminder('all');
    try {
      const response = await fetch('/api/staff/financials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentIds: data.defaulters.map(d => d.id) }),
      });
      const result = await response.json();
      if (response.ok) {
        alert(result.message || 'Reminders sent successfully');
      } else {
        alert(result.message || 'Failed to send reminders');
      }
    } catch {
      alert('Failed to send reminders');
    } finally {
      setSendingReminder(null);
    }
  };

  const formatCurrency = (amount: number) => `৳${amount.toLocaleString()}`;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = getBDDate();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === today.toDateString()) {
      return `Today ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', timeZone: 'Asia/Dhaka' })}`;
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case 'this-month': return 'This Month';
      case 'last-month': return 'Last Month';
      case 'this-year': return 'This Year';
    }
  };

  if (loading) {
    return (
      <StaffRoleGuard allowedRoles={['financial_staff']}>
        <div className="flex items-center justify-center h-64">
          <Spinner className="w-6 h-6 text-[#2D6A4F]" />
        </div>
      </StaffRoleGuard>
    );
  }

  if (error || !data) {
    return (
      <StaffRoleGuard allowedRoles={['financial_staff']}>
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <span className="text-5xl mb-4">📊</span>
          <p className="text-lg font-medium">{error || 'No data available'}</p>
          <button
            onClick={() => fetchFinancialData(timeRange)}
            className="mt-4 px-4 py-2 bg-[#2D6A4F] text-white rounded-lg hover:bg-[#245a42]"
          >
            Retry
          </button>
        </div>
      </StaffRoleGuard>
    );
  }

  const { summary } = data;

  return (
    <StaffRoleGuard allowedRoles={['financial_staff']}>
      <div className="space-y-6">
        {/* Time Range Selector */}
        <div className="flex items-center gap-2 bg-white rounded-xl p-2 shadow-sm w-fit">
          {[
            { id: 'this-month' as TimeRange, label: 'This Month' },
            { id: 'last-month' as TimeRange, label: 'Last Month' },
            { id: 'this-year' as TimeRange, label: 'This Year' },
          ].map((range) => (
            <button
              key={range.id}
              onClick={() => setTimeRange(range.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeRange === range.id
                  ? 'bg-[#2D6A4F] text-white'
                  : 'text-gray-500 hover:bg-gray-100'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-green-500 min-w-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-xl">💰</div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Revenue</p>
                <p className="text-base xl:text-lg font-bold text-green-600 break-all leading-tight">{formatCurrency(summary.totalRevenue)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-red-500 min-w-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-xl">💸</div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Expenses</p>
                <p className="text-base xl:text-lg font-bold text-red-600 break-all leading-tight">{formatCurrency(summary.totalExpenses)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-blue-500 min-w-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl">📊</div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Net Income</p>
                <p className={`text-base xl:text-lg font-bold break-all leading-tight ${summary.netIncome >= 0 ? 'text-blue-600' : 'text-red-600'}`}>
                  {formatCurrency(summary.netIncome)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-yellow-500 min-w-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-xl">⏳</div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500">Pending Dues</p>
                <p className="text-base xl:text-lg font-bold text-yellow-600 break-all leading-tight">{formatCurrency(summary.pendingDues)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-purple-500">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-xl">📈</div>
              <div>
                <p className="text-xs text-gray-500">Collection Rate</p>
                <p className="text-lg font-bold text-purple-600">{summary.collectionRate}%</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-orange-500">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-xl">🚨</div>
              <div>
                <p className="text-xs text-gray-500">Defaulters</p>
                <p className="text-lg font-bold text-orange-600">{summary.defaulterCount}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-gray-200">
          {[
            { id: 'overview' as TabType, label: 'Overview' },
            { id: 'defaulters' as TabType, label: `Defaulters (${data.defaulters.length})` },
            { id: 'transactions' as TabType, label: 'Transactions' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-[#2D6A4F] border-b-2 border-[#2D6A4F]'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Breakdown */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Revenue Breakdown</h3>
              {data.revenueByType.length === 0 ? (
                <p className="text-gray-500 text-sm py-8 text-center">No revenue data for this period</p>
              ) : (
                <div className="space-y-3">
                  {data.revenueByType.map((item) => {
                    const percentage = summary.totalRevenue > 0 ? (item.total / summary.totalRevenue) * 100 : 0;
                    return (
                      <div key={item.type} className="flex items-center gap-3">
                        <span className="text-xl w-8">{REVENUE_ICONS[item.type] || '💰'}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700">{item.name}</span>
                            <span className="text-gray-500">{formatCurrency(item.total)} ({item.count})</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Expense Breakdown */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Expense Breakdown</h3>
              {data.expensesByCategory.length === 0 ? (
                <p className="text-gray-500 text-sm py-8 text-center">No expense data for this period</p>
              ) : (
                <div className="space-y-3">
                  {data.expensesByCategory.map((item) => {
                    const percentage = summary.totalExpenses > 0 ? (item.total / summary.totalExpenses) * 100 : 0;
                    return (
                      <div key={item.category} className="flex items-center gap-3">
                        <span className="text-xl w-8">{EXPENSE_ICONS[item.category] || '📦'}</span>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="font-medium text-gray-700">{item.name}</span>
                            <span className="text-gray-500">{formatCurrency(item.total)} ({item.count})</span>
                          </div>
                          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-red-400 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Student Stats */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Payment Status</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <p className="text-3xl font-bold text-green-600">{summary.paidStudents}</p>
                  <p className="text-sm text-gray-600">Paid Students</p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg text-center">
                  <p className="text-3xl font-bold text-red-600">{summary.defaulterCount}</p>
                  <p className="text-sm text-gray-600">Defaulters</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <p className="text-3xl font-bold text-blue-600">{summary.totalStudents}</p>
                  <p className="text-sm text-gray-600">Total Students</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg text-center">
                  <p className="text-3xl font-bold text-purple-600">{summary.collectionRate}%</p>
                  <p className="text-sm text-gray-600">Collection Rate</p>
                </div>
              </div>
            </div>

            {/* Salary Overview */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Salary Overview</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-gray-800">{formatCurrency(summary.totalSalaryBudget)}</p>
                  <p className="text-xs text-gray-500">Total Budget</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-green-600">{formatCurrency(summary.totalSalaryPaid)}</p>
                  <p className="text-xs text-gray-500">Paid</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-yellow-600">{formatCurrency(summary.totalSalaryPending)}</p>
                  <p className="text-xs text-gray-500">Pending</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Defaulters Tab */}
        {activeTab === 'defaulters' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Payment Defaulters</h3>
                <p className="text-sm text-gray-500">Students with pending payments</p>
              </div>
              {data.defaulters.length > 0 && (
                <button
                  onClick={handleSendAllReminders}
                  disabled={sendingReminder === 'all'}
                  className="px-4 py-2 bg-[#2D6A4F] text-white rounded-lg text-sm font-medium hover:bg-[#245a42] disabled:opacity-50"
                >
                  {sendingReminder === 'all' ? 'Sending...' : `Send All Reminders (${data.defaulters.length})`}
                </button>
              )}
            </div>

            {data.defaulters.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <span className="text-5xl mb-4">🎉</span>
                <p className="text-lg font-medium">No defaulters!</p>
                <p className="text-sm">All students are up to date with payments</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Student</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Room</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Due Amount</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Due Since</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Overdue</th>
                      <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.defaulters.map((defaulter) => (
                      <tr key={defaulter.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-medium text-gray-900">{defaulter.name}</p>
                            <p className="text-sm text-gray-500">{defaulter.studentId}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{defaulter.room}</td>
                        <td className="px-6 py-4">
                          <span className="font-semibold text-red-600">{formatCurrency(defaulter.dueAmount)}</span>
                        </td>
                        <td className="px-6 py-4 text-gray-700">{defaulter.dueDate}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            defaulter.monthsOverdue >= 3
                              ? 'bg-red-100 text-red-700'
                              : defaulter.monthsOverdue >= 2
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-yellow-100 text-yellow-700'
                          }`}>
                            {defaulter.monthsOverdue} month{defaulter.monthsOverdue > 1 ? 's' : ''}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleSendReminder(defaulter.id)}
                            disabled={sendingReminder === defaulter.id}
                            className="px-3 py-1.5 bg-[#2D6A4F] text-white rounded-lg text-xs font-medium hover:bg-[#245a42] disabled:opacity-50"
                          >
                            {sendingReminder === defaulter.id ? 'Sending...' : 'Send Reminder'}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Transactions Tab */}
        {activeTab === 'transactions' && (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-800">Recent Transactions</h3>
              <p className="text-sm text-gray-500">{getTimeRangeLabel()} &bull; {data.transactions.length} transactions</p>
            </div>

            {data.transactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-500">
                <span className="text-5xl mb-4">📋</span>
                <p className="text-lg font-medium">No transactions</p>
                <p className="text-sm">No transactions recorded for this period</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
                {data.transactions.map((txn) => (
                  <div key={txn.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-xl ${
                        txn.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                      }`}>
                        {txn.type === 'income'
                          ? (REVENUE_ICONS[txn.category] || '💰')
                          : (EXPENSE_ICONS[txn.category] || '📦')}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{txn.description}</p>
                        <p className="text-xs text-gray-500">
                          {txn.transactionId} &bull; {formatDate(txn.date)}
                          {txn.student && ` • ${txn.student}`}
                          {txn.addedBy && ` • by ${txn.addedBy}`}
                        </p>
                      </div>
                    </div>
                    <span className={`font-semibold ${txn.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                      {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Quick Summary Footer */}
        <div className="bg-white rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-gray-500 text-xs">Period</p>
              <p className="text-sm font-bold text-gray-800">{data.period.label}</p>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div className="text-center">
              <p className="text-gray-500 text-xs">Net Income</p>
              <p className={`text-sm font-bold ${summary.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(summary.netIncome)}
              </p>
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div className="text-center">
              <p className="text-gray-500 text-xs">Paid / Total</p>
              <p className="text-sm font-bold text-gray-800">{summary.paidStudents} / {summary.totalStudents}</p>
            </div>
          </div>
        </div>
      </div>
    </StaffRoleGuard>
  );
}
