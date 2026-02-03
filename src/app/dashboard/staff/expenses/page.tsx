'use client';

import { useState, useEffect, FormEvent } from 'react';
import { StaffRoleGuard } from '@/components/staff/role-guard';
import { Spinner } from '@/components/ui/spinner';
import { getBDDate } from '@/lib/dates';

type TimeRange = 'this-month' | 'last-month' | 'this-year' | 'all-time';

interface ExpenseItem {
  id: string;
  expenseId: string;
  category: string;
  amount: number;
  description: string;
  date: string;
  addedBy: { fullName: string };
  vendor?: string;
}

interface Totals {
  [category: string]: { total: number; count: number };
}

const CATEGORY_ICONS: Record<string, string> = {
  market: '🛒',
  utilities: '💡',
  maintenance: '🔧',
  salary: '💼',
  equipment: '🖥️',
  other: '📦',
};

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  market: { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-500' },
  utilities: { bg: 'bg-yellow-100', text: 'text-yellow-600', border: 'border-yellow-500' },
  maintenance: { bg: 'bg-orange-100', text: 'text-orange-600', border: 'border-orange-500' },
  salary: { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-500' },
  equipment: { bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-500' },
  other: { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-500' },
};

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [totals, setTotals] = useState<Totals>({});
  const [grandTotal, setGrandTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Filters
  const [timeRange, setTimeRange] = useState<TimeRange>('this-month');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  // Form state
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('market');
  const [amount, setAmount] = useState('');
  const [vendor, setVendor] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchExpenses = async () => {
    try {
      const response = await fetch(`/api/staff/expenses?range=${timeRange}`);
      const data = await response.json();
      
      if (response.ok) {
        setExpenses(data.expenses);
        setTotals(data.totals);
        setGrandTotal(data.grandTotal);
      } else {
        setError(data.message);
      }
    } catch {
      setError('Failed to fetch expenses');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [timeRange]);

  // Filter expenses based on search and category
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expense.expenseId.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (expense.vendor && expense.vendor.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || expense.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate filtered totals
  const filteredGrandTotal = filteredExpenses.reduce((sum, e) => sum + e.amount, 0);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    setSubmitting(true);
    try {
      const response = await fetch('/api/staff/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          description,
          category,
          amount: parseFloat(amount),
          vendor,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Reset form and refresh
        setDescription('');
        setAmount('');
        setVendor('');
        fetchExpenses();
      } else {
        setError(data.message);
      }
    } catch {
      setError('Failed to add expense');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    try {
      const response = await fetch(`/api/staff/expenses?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchExpenses();
      }
    } catch {
      setError('Failed to delete expense');
    }
  };

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

  if (loading) {
    return (
      <StaffRoleGuard allowedRoles={['financial_staff']}>
        <div className="flex items-center justify-center h-64">
          <Spinner className="w-6 h-6 text-[#2D6A4F]" />
        </div>
      </StaffRoleGuard>
    );
  }

  const marketTotal = totals.market?.total || 0;
  const utilitiesTotal = totals.utilities?.total || 0;

  const getTimeRangeLabel = () => {
    switch (timeRange) {
      case 'this-month': return 'This Month';
      case 'last-month': return 'Last Month';
      case 'this-year': return 'This Year';
      default: return 'All Time';
    }
  };

  return (
    <StaffRoleGuard allowedRoles={['financial_staff']}>
      <div className="space-y-6">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
            <button onClick={() => setError(null)} className="float-right">&times;</button>
          </div>
        )}

        {/* Header with Time Range */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl">💳</span>
                </div>
                Expense Management
              </h1>
              <p className="text-gray-500 text-sm mt-1 ml-13">Track and manage all hall expenses • {getTimeRangeLabel()}</p>
            </div>
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              {[
                { id: 'this-month' as TimeRange, label: 'This Month' },
                { id: 'last-month' as TimeRange, label: 'Last Month' },
                { id: 'this-year' as TimeRange, label: 'This Year' },
                { id: 'all-time' as TimeRange, label: 'All' },
              ].map((range) => (
                <button
                  key={range.id}
                  onClick={() => setTimeRange(range.id)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    timeRange === range.id ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Summary Cards - All 6 Categories + Total */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {Object.entries(CATEGORY_ICONS).map(([cat, icon]) => {
            const catTotal = totals[cat]?.total || 0;
            const catCount = totals[cat]?.count || 0;
            const colors = CATEGORY_COLORS[cat] || { bg: 'bg-gray-100', text: 'text-gray-600', border: 'border-gray-500' };
            return (
              <div 
                key={cat} 
                onClick={() => setSelectedCategory(selectedCategory === cat ? 'all' : cat)}
                className={`bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border-l-4 ${colors.border} ${
                  selectedCategory === cat ? 'ring-2 ring-offset-2 ring-' + colors.border.replace('border-', '') : ''
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${colors.bg} rounded-lg flex items-center justify-center`}>
                    <span className="text-xl">{icon}</span>
                  </div>
                  <div className="min-w-0">
                    <p className="text-gray-500 text-xs capitalize">{cat}</p>
                    <p className={`text-lg font-bold ${colors.text}`}>৳{catTotal.toLocaleString()}</p>
                    <p className="text-xs text-gray-400">{catCount} items</p>
                  </div>
                </div>
              </div>
            );
          })}
          {/* Total Card */}
          <div className="bg-linear-to-br from-[#2D6A4F] to-[#40916c] rounded-xl p-4 shadow-sm text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <span className="text-xl">💰</span>
              </div>
              <div className="min-w-0">
                <p className="text-white/70 text-xs">Total</p>
                <p className="text-lg font-bold">৳{grandTotal.toLocaleString()}</p>
                <p className="text-xs text-white/60">{expenses.length} expenses</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Expense Form */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Add Expense</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="e.g., Chicken - 50kg"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                >
                  <option value="market">Market</option>
                  <option value="utilities">Utilities</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="salary">Salary</option>
                  <option value="equipment">Equipment</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vendor (Optional)</label>
                <input
                  type="text"
                  value={vendor}
                  onChange={(e) => setVendor(e.target.value)}
                  placeholder="e.g., Local Market"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (৳)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  required
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                />
              </div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full px-4 py-2 bg-[#2D6A4F] text-white rounded-lg font-medium hover:bg-[#245a42] transition-colors disabled:opacity-50"
              >
                {submitting ? 'Adding...' : 'Add Expense'}
              </button>
            </form>
          </div>

          {/* Recent Expenses */}
          <div className="bg-white rounded-xl p-6 shadow-sm lg:col-span-2">
            <div className="flex flex-col gap-4 mb-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-800">Recent Expenses</h2>
                <span className="text-sm text-gray-500">{filteredExpenses.length} of {expenses.length} shown</span>
              </div>
              {/* Search Bar */}
              <div className="relative">
                <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search expenses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                />
                {searchQuery && (
                  <button 
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                )}
              </div>
              {selectedCategory !== 'all' && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Filtered by:</span>
                  <span className={`px-2 py-1 ${CATEGORY_COLORS[selectedCategory]?.bg || 'bg-gray-100'} ${CATEGORY_COLORS[selectedCategory]?.text || 'text-gray-600'} rounded-full text-xs font-medium flex items-center gap-1`}>
                    {CATEGORY_ICONS[selectedCategory]} {selectedCategory}
                    <button onClick={() => setSelectedCategory('all')} className="ml-1 hover:opacity-70">×</button>
                  </span>
                  <span className="text-sm text-gray-500">Total: ৳{filteredGrandTotal.toLocaleString()}</span>
                </div>
              )}
            </div>
            
            {filteredExpenses.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <span className="text-5xl mb-4">📋</span>
                <p className="text-lg font-medium">{searchQuery || selectedCategory !== 'all' ? 'No matching expenses' : 'No expenses recorded'}</p>
                <p className="text-sm">{searchQuery || selectedCategory !== 'all' ? 'Try adjusting your search or filter' : 'Add your first expense using the form'}</p>
                {(searchQuery || selectedCategory !== 'all') && (
                  <button 
                    onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
                    className="mt-3 px-4 py-2 text-sm text-[#2D6A4F] border border-[#2D6A4F] rounded-lg hover:bg-[#2D6A4F] hover:text-white transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-100 max-h-100 overflow-y-auto">
                {filteredExpenses.map(expense => (
                  <div key={expense.id} className="py-4 flex items-center justify-between hover:bg-gray-50 -mx-2 px-2 rounded-lg transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 ${CATEGORY_COLORS[expense.category]?.bg || 'bg-gray-100'} rounded-lg flex items-center justify-center text-xl`}>
                        {CATEGORY_ICONS[expense.category] || '📦'}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">{expense.description}</p>
                        <p className="text-xs text-gray-500">
                          {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)} 
                          {expense.vendor && ` • ${expense.vendor}`} 
                          {' • '}{formatDate(expense.date)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-red-600">-৳{expense.amount.toLocaleString()}</span>
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Summary Footer */}
        <div className="bg-white rounded-xl p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="text-gray-500 text-sm">Total Expenses</p>
              <p className="text-xl font-bold text-gray-800">৳{grandTotal.toLocaleString()}</p>
            </div>
            <div className="h-10 w-px bg-gray-200" />
            <div className="text-center">
              <p className="text-gray-500 text-sm">Transactions</p>
              <p className="text-xl font-bold text-gray-800">{expenses.length}</p>
            </div>
            <div className="h-10 w-px bg-gray-200" />
            <div className="text-center">
              <p className="text-gray-500 text-sm">Average</p>
              <p className="text-xl font-bold text-gray-800">৳{expenses.length > 0 ? Math.round(grandTotal / expenses.length).toLocaleString() : 0}</p>
            </div>
          </div>
          <button 
            onClick={() => {
              // Export expenses as CSV
              let csv = 'Expense Report\n';
              csv += `Period: ${getTimeRangeLabel()}\n\n`;
              csv += 'ID,Date,Description,Category,Vendor,Amount\n';
              filteredExpenses.forEach(e => {
                csv += `${e.expenseId},${formatDate(e.date)},"${e.description}",${e.category},"${e.vendor || '-'}",৳${e.amount}\n`;
              });
              csv += `\nTotal:,,,,,৳${filteredGrandTotal}\n`;
              
              const blob = new Blob([csv], { type: 'text/csv' });
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = `expenses-${getTimeRangeLabel().toLowerCase().replace(' ', '-')}.csv`;
              a.click();
            }}
            className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
        </div>
      </div>
    </StaffRoleGuard>
  );
}
