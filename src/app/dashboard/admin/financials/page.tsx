"use client";

import React, { useState, useEffect, FormEvent } from "react";
import Image from "next/image";
import { Spinner } from "@/components/ui/spinner";
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { set } from "mongoose";

type TimeRange = "this-month" | "last-month" | "this-year";
type TabType = "overview" | "collections" | "expenses" | "salaries" | "defaulters";

interface Transaction {
  id: string;
  transactionId: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: "income" | "expense";
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

interface StaffSalary {
  id: string;
  name: string;
  role: string;
  salary: number;
  status: "paid" | "pending";
  paidDate?: string | null;
}

interface CategoryBreakdown {
  category: string;
  name: string;
  total: number;
  count: number;
}

interface RevenueType {
  type: string;
  name: string;
  total: number;
  count: number;
}

interface MonthlyData {
  month: string;
  monthYear: string;
  revenue: number;
  expenses: number;
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
  expensesByCategory: CategoryBreakdown[];
  defaulters: Defaulter[];
  staffSalaries: StaffSalary[];
  monthlyStats: MonthlyData[];
  transactions: Transaction[];
  incomeTransactions: Transaction[];
  expenseTransactions: Transaction[];
  period: {
    label: string;
    range: string;
  };
}

const CATEGORY_COLORS: Record<string, string> = {
  market: "#3B82F6",
  utilities: "#F59E0B",
  maintenance: "#F97316",
  salary: "#8B5CF6",
  equipment: "#6366F1",
  other: "#6B7280",
  hall_fee: "#2D6A4F",
  mess_fee: "#40E0D0",
  laundry_fee: "#E91E63",
  fine: "#EF4444",
};

const CATEGORY_ICONS: Record<string, string> = {
  market: "🛒",
  utilities: "💡",
  maintenance: "🔧",
  salary: "💼",
  equipment: "🖥️",
  other: "📦",
  hall_fee: "🏠",
  mess_fee: "🍽️",
  laundry_fee: "🧺",
  fine: "⚠️",
};

export default function FinancialsPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("this-month");
  const [activeTab, setActiveTab] = useState<TabType>("overview");
  const [showAddExpenseModal, setShowAddExpenseModal] = useState(false);
  const [showPaySalaryModal, setShowPaySalaryModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<StaffSalary | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [data, setData] = useState<FinancialData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Expense form state
  const [expenseDescription, setExpenseDescription] = useState("");
  const [expenseCategory, setExpenseCategory] = useState("market");
  const [expenseAmount, setExpenseAmount] = useState("");
  const [expenseVendor, setExpenseVendor] = useState("");
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchFinancialData = async (range: TimeRange) => {
    setLoading(true);
    try {
      const response = await fetch(`/api/staff/financials?range=${range}`);
      if (!response.ok) throw new Error("Failed to fetch data");
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      console.error("Failed to fetch financial data:", err);
      setError("Failed to load financial data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinancialData(timeRange);
  }, [timeRange]);

  const handleAddExpense = async (e: FormEvent) => {
    e.preventDefault();
    if (!expenseDescription || !expenseAmount) return;

    setSubmitting(true);
    try {
      const response = await fetch("/api/staff/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: expenseDescription,
          category: expenseCategory,
          amount: parseFloat(expenseAmount),
          vendor: expenseVendor || undefined,
          date: expenseDate,
        }),
      });

      if (response.ok) {
        setShowAddExpenseModal(false);
        setExpenseDescription("");
        setExpenseCategory("market");
        setExpenseAmount("");
        setExpenseVendor("");
        setExpenseDate(new Date().toISOString().split('T')[0]);
        fetchFinancialData(timeRange);
      } else {
        const err = await response.json();
        alert(err.message || "Failed to add expense");
      }
    } catch {
      alert("Failed to add expense");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePaySalary = async () => {
    if (!selectedStaff) return;
    
    setSubmitting(true);
    try {
      const response = await fetch("/api/staff/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: `Salary Payment - ${selectedStaff.name} (${selectedStaff.role})`,
          category: "salary",
          amount: selectedStaff.salary,
        }),
      });

      if (response.ok) {
        setShowPaySalaryModal(false);
        setSelectedStaff(null);
        fetchFinancialData(timeRange);
      } else {
        const err = await response.json();
        alert(err.message || "Failed to record salary payment");
      }
    } catch {
      alert("Failed to record salary payment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleExportReport = () => {
    // Generate CSV report
    if (!data) return;
    
    let csv = "HallBridge Financial Report\n";
    csv += `Period: ${data.period?.label || 'Current'}\n\n`;
    
    csv += "SUMMARY\n";
    csv += `Total Revenue,৳${data.summary.totalRevenue}\n`;
    csv += `Total Expenses,৳${data.summary.totalExpenses}\n`;
    csv += `Net Income,৳${data.summary.netIncome}\n`;
    csv += `Pending Dues,৳${data.summary.pendingDues}\n`;
    csv += `Collection Rate,${data.summary.collectionRate}%\n\n`;
    
    csv += "INCOME TRANSACTIONS\n";
    csv += "Date,Transaction ID,Description,Category,Amount\n";
    data.incomeTransactions?.forEach(tx => {
      csv += `${formatDate(tx.date)},${tx.transactionId},"${tx.description}",${tx.category},৳${tx.amount}\n`;
    });
    
    csv += "\nEXPENSE TRANSACTIONS\n";
    csv += "Date,Transaction ID,Description,Category,Amount\n";
    data.expenseTransactions?.forEach(tx => {
      csv += `${formatDate(tx.date)},${tx.transactionId},"${tx.description}",${tx.category},৳${tx.amount}\n`;
    });
    
    csv += "\nDEFAULTERS\n";
    csv += "Student,Student ID,Room,Due Amount,Months Overdue\n";
    data.defaulters?.forEach(d => {
      csv += `"${d.name}",${d.studentId},${d.room},৳${d.dueAmount},${d.monthsOverdue}\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-report-${data.period?.label?.replace(/\s/g, '-') || 'report'}.csv`;
    a.click();
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', { 
      month: 'short', day: 'numeric', year: 'numeric' 
    });
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 100000) {
      return `৳${(amount / 100000).toFixed(1)}L`;
    } else if (amount >= 1000) {
      return `৳${(amount / 1000).toFixed(1)}K`;
    }
    return `৳${amount.toLocaleString()}`;
  };

  // Filter transactions
  const filteredIncomeTransactions = data?.incomeTransactions?.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tx.transactionId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || tx.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }) || [];

  const filteredExpenseTransactions = data?.expenseTransactions?.filter(tx => {
    const matchesSearch = tx.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tx.transactionId.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === "all" || tx.category === categoryFilter;
    return matchesSearch && matchesCategory;
  }) || [];

  const filteredDefaulters = data?.defaulters?.filter(d => {
    return d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           d.studentId.toLowerCase().includes(searchQuery.toLowerCase()) ||
           d.room.toLowerCase().includes(searchQuery.toLowerCase());
  }) || [];

  const tabs = [
    { id: "overview" as TabType, label: "Overview", icon: "📊" },
    { id: "collections" as TabType, label: "Collections", icon: "💵" },
    { id: "expenses" as TabType, label: "Expenses", icon: "💳" },
    { id: "salaries" as TabType, label: "Staff Salaries", icon: "👥" },
    { id: "defaulters" as TabType, label: "Defaulters", icon: "⚠️" },
  ];

  if (loading && !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner className="w-8 h-8 text-[#2D6A4F]" />
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="bg-white rounded-xl p-8 shadow-sm text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-red-600 font-medium mb-2">Failed to Load Financial Data</p>
        <p className="text-gray-500 text-sm mb-4">There was an error loading the financial information. Please try again.</p>
        <button 
          onClick={() => fetchFinancialData(timeRange)}
          className="px-6 py-2 bg-[#2D6A4F] text-white rounded-lg hover:bg-[#245840] transition-colors cursor-pointer"
        >
          Try Again
        </button>
      </div>
    );
  }

  const summary = data?.summary || {
    totalRevenue: 0,
    totalExpenses: 0,
    netIncome: 0,
    pendingDues: 0,
    collectionRate: 0,
    totalStudents: 0,
    paidStudents: 0,
    defaulterCount: 0,
    totalSalaryBudget: 0,
    totalSalaryPaid: 0,
    totalSalaryPending: 0,
  };

  const maxChartValue = Math.max(
    ...(data?.monthlyStats?.map(m => Math.max(m.revenue, m.expenses)) || [1]),
    1
  );

  // Calculate expense total for pie chart
  const expenseTotal = data?.expensesByCategory?.reduce((sum, e) => sum + e.total, 0) || 0;

  // Dummy data for chart when no real data is available
  const dummyMonthlyStats = [
    { month: 'Jan', monthYear: 'Jan 2026', revenue: 45000, expenses: 38000 },
    { month: 'Feb', monthYear: 'Feb 2026', revenue: 42000, expenses: 52000 },
    { month: 'Mar', monthYear: 'Mar 2026', revenue: 48000, expenses: 39000 },
    { month: 'Apr', monthYear: 'Apr 2026', revenue: 55000, expenses: 64000 },
    { month: 'May', monthYear: 'May 2026', revenue: 61000, expenses: 47000 },
    { month: 'Jun', monthYear: 'Jun 2026', revenue: 58000, expenses: 60000 },
  ];

  const chartData = (data?.monthlyStats && data.monthlyStats.length > 0) 
    ? data.monthlyStats 
    : dummyMonthlyStats;

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="bg-white rounded-xl p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <div className="w-10 h-10 bg-[#2D6A4F]/10 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-[#2D6A4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              Financial Management
            </h1>
            <p className="text-gray-500 text-sm mt-1 ml-13">
              {data?.period?.label || "Track revenue, expenses, and pending dues"} • Last updated just now
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button 
              onClick={handleExportReport}
              className="px-4 py-2.5 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Export CSV
            </button>
            <button 
              onClick={() => setShowAddExpenseModal(true)}
              className="px-4 py-2.5 bg-[#2D6A4F] text-white rounded-lg text-sm font-medium hover:bg-[#245840] transition-colors flex items-center gap-2 shadow-sm cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Add Expense
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-green-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-xl">💰</div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Revenue</p>
              <p className="text-lg font-bold text-gray-800">{formatCurrency(summary.totalRevenue)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-red-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center text-xl">💸</div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Expenses</p>
              <p className="text-lg font-bold text-gray-800">{formatCurrency(summary.totalExpenses)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-blue-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl">📈</div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Net Income</p>
              <p className={`text-lg font-bold ${summary.netIncome >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(summary.netIncome)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-orange-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center text-xl">⏳</div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Pending</p>
              <p className="text-lg font-bold text-orange-600">{formatCurrency(summary.pendingDues)}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-purple-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-xl">👥</div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Paid</p>
              <p className="text-lg font-bold text-gray-800">{summary.paidStudents}/{summary.totalStudents}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 shadow-sm border-l-4 border-teal-500">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center text-xl">✅</div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide">Collection</p>
              <p className="text-lg font-bold text-teal-600">{summary.collectionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Time Range & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-xl p-4 shadow-sm">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSearchQuery(""); setCategoryFilter("all"); }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-[#2D6A4F] text-white shadow-md"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
              {tab.id === "defaulters" && summary.defaulterCount > 0 && (
                <span className="bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
                  {summary.defaulterCount}
                </span>
              )}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
          {[
            { id: "this-month" as TimeRange, label: "This Month" },
            { id: "last-month" as TimeRange, label: "Last Month" },
            { id: "this-year" as TimeRange, label: "This Year" },
          ].map((range) => (
            <button
              key={range.id}
              onClick={() => setTimeRange(range.id)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer ${
                timeRange === range.id ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-4">
          <Spinner className="w-6 h-6 text-[#2D6A4F]" />
        </div>
      )}

      {/* Overview Tab */}
      {activeTab === "overview" && (
        <>
          {/* Main Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue vs Expenses Chart */}
            <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold text-gray-800">Revenue vs Expenses Trend</h2>
                <div className="flex items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#2D6A4F] rounded" />
                    <span className="text-gray-600">Revenue</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-[#E91E63] rounded" />
                    <span className="text-gray-600">Expenses</span>
                  </div>
                </div>
              </div>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2D6A4F" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#2D6A4F" stopOpacity={0.05} />
                    </linearGradient>
                    <linearGradient id="expenseGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#E91E63" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#E91E63" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    axisLine={{ stroke: '#E5E7EB' }}
                    tickLine={false}
                  />
                  <YAxis 
                    tick={{ fill: '#6B7280', fontSize: 12 }}
                    axisLine={{ stroke: '#E5E7EB' }}
                    tickLine={false}
                    tickFormatter={(value) => `৳${(value / 1000).toFixed(0)}k`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1F2937',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '12px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    labelStyle={{ color: '#F9FAFB', fontWeight: 'bold', marginBottom: '4px' }}
                    itemStyle={{ color: '#F9FAFB', fontSize: '13px' }}
                    formatter={(value: number | undefined) => [`৳${(value ?? 0).toLocaleString()}`, '']}
                    cursor={{ stroke: '#9CA3AF', strokeWidth: 1, strokeDasharray: '5 5' }}
                  />
                  <Legend 
                    wrapperStyle={{ paddingTop: '20px' }}
                    iconType="circle"
                  />
                  <Line 
                    type="monotone"
                    dataKey="revenue" 
                    stroke="#772ff5" 
                    strokeWidth={3}
                    dot={{ fill: '#772ff5', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, stroke: '#fff', strokeWidth: 2 }}
                    name="Revenue"
                    fill="url(#revenueGradient)"
                  />
                  <Line 
                    type="monotone"
                    dataKey="expenses" 
                    stroke="#2fb536" 
                    strokeWidth={3}
                    dot={{ fill: '#2fb536', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 7, stroke: '#fff', strokeWidth: 2 }}
                    name="Expenses"
                    fill="url(#expenseGradient)"
                  />
                </LineChart>
              </ResponsiveContainer>
              {!data?.monthlyStats || data.monthlyStats.length === 0 ? (
                <p className="text-center text-sm text-gray-400 mt-2">Showing sample data</p>
              ) : null}
            </div>

            {/* Expense Breakdown Pie Chart */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Expense Distribution</h2>
              {data?.expensesByCategory && data.expensesByCategory.length > 0 ? (
                <>
                  {/* Visual Pie Chart Representation */}
                  <ResponsiveContainer width="100%" height={240}>
                    <PieChart>
                      <Pie
                        data={data.expensesByCategory.map(item => ({
                          name: item.name,
                          value: item.total,
                          category: item.category
                        }))}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={85}
                        paddingAngle={3}
                        dataKey="value"
                        label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
                        labelLine={{ stroke: '#9CA3AF', strokeWidth: 1 }}
                      >
                        {data.expensesByCategory.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={CATEGORY_COLORS[entry.category] || '#6B7280'}
                            stroke="#fff"
                            strokeWidth={2}
                          />
                        ))}
                      </Pie>
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: '#1F2937',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '12px',
                          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}
                        labelStyle={{ color: '#F9FAFB', fontWeight: 'bold', marginBottom: '4px' }}
                        itemStyle={{ color: '#F9FAFB' }}
                        formatter={(value: number | undefined) => `৳${(value ?? 0).toLocaleString()}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  {/* Legend */}
                  <div className="space-y-2 mt-4">
                    {data.expensesByCategory.map((item, index) => {
                      const percentage = expenseTotal > 0 ? Math.round((item.total / expenseTotal) * 100) : 0;
                      return (
                        <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 transition-colors">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-3 h-3 rounded-full" 
                              style={{ backgroundColor: CATEGORY_COLORS[item.category] || '#6B7280' }} 
                            />
                            <span className="text-sm text-gray-600 flex items-center gap-1">
                              {CATEGORY_ICONS[item.category] || '📦'} {item.name}
                            </span>
                          </div>
                          <div className="text-right">
                            <span className="text-sm font-medium text-gray-800">৳{item.total.toLocaleString()}</span>
                            <span className="text-xs text-gray-400 ml-2">({percentage}%)</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-gray-400">
                  <span className="text-4xl mb-2">📊</span>
                  <p>No expenses recorded</p>
                </div>
              )}
            </div>
          </div>

          {/* Revenue Sources & Quick Actions Row */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Revenue Sources */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-lg font-bold text-gray-800 mb-4">Revenue Sources</h2>
              {data?.revenueByType && data.revenueByType.length > 0 ? (
                <div className="space-y-4">
                  {data.revenueByType.map((item, index) => {
                    const percentage = summary.totalRevenue > 0 
                      ? Math.round((item.total / summary.totalRevenue) * 100) 
                      : 0;
                    return (
                      <div key={index} className="group">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-gray-700 flex items-center gap-2">
                            <span>{CATEGORY_ICONS[item.type] || '💵'}</span>
                            {item.name}
                          </span>
                          <span className="text-sm font-bold text-gray-800">৳{item.total.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                          <div
                            className="h-3 rounded-full transition-all duration-500 group-hover:opacity-80"
                            style={{ 
                              width: `${percentage}%`, 
                              backgroundColor: CATEGORY_COLORS[item.type] || '#6B7280' 
                            }}
                          />
                        </div>
                        <p className="text-xs text-gray-400 mt-1">{percentage}% of total • {item.count} payments</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-gray-400">
                  <span className="text-4xl mb-2">💵</span>
                  <p>No revenue recorded</p>
                </div>
              )}
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">Recent Activity</h2>
                <button 
                  onClick={() => setActiveTab("collections")}
                  className="text-sm text-[#2D6A4F] font-medium hover:underline flex items-center gap-1 cursor-pointer"
                >
                  View All
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              {data?.transactions && data.transactions.length > 0 ? (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {data.transactions.slice(0, 6).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          tx.type === "income" ? "bg-green-100" : "bg-red-100"
                        }`}>
                          {tx.type === "income" ? (
                            <svg className="w-5 h-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                            </svg>
                          ) : (
                            <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                            </svg>
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 truncate">{tx.description}</p>
                          <p className="text-xs text-gray-500">{formatDate(tx.date)}</p>
                        </div>
                      </div>
                      <span className={`font-bold text-sm whitespace-nowrap ${tx.type === "income" ? "text-green-600" : "text-red-600"}`}>
                        {tx.type === "income" ? "+" : "-"}৳{tx.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="h-48 flex flex-col items-center justify-center text-gray-400">
                  <span className="text-4xl mb-2">📋</span>
                  <p>No transactions recorded</p>
                </div>
              )}
            </div>

            {/* Top Defaulters / Quick Actions */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">
                  {summary.defaulterCount > 0 ? 'Top Defaulters' : 'Quick Actions'}
                </h2>
                {summary.defaulterCount > 0 && (
                  <button 
                    onClick={() => setActiveTab("defaulters")}
                    className="text-sm text-[#2D6A4F] font-medium hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    View All ({summary.defaulterCount})
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                )}
              </div>
              {data?.defaulters && data.defaulters.length > 0 ? (
                <div className="space-y-3">
                  {data.defaulters.slice(0, 4).map((defaulter) => (
                    <div key={defaulter.id} className="flex items-center justify-between p-3 bg-red-50 rounded-lg border border-red-100">
                      <div className="flex items-center gap-3">
                        <Image
                          src="/logos/profile.png"
                          alt={defaulter.name}
                          width={40}
                          height={40}
                          className="w-10 h-10 rounded-full border-2 border-red-200"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-800">{defaulter.name}</p>
                          <p className="text-xs text-gray-500">Room {defaulter.room} • {defaulter.monthsOverdue}mo overdue</p>
                        </div>
                      </div>
                      <span className="font-bold text-red-600">৳{defaulter.dueAmount.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  <button 
                    onClick={() => setShowAddExpenseModal(true)}
                    className="w-full p-4 bg-blue-50 rounded-lg text-left hover:bg-blue-100 transition-colors flex items-center gap-3 cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">💳</div>
                    <div>
                      <p className="font-medium text-gray-800">Add Expense</p>
                      <p className="text-xs text-gray-500">Record a new expense</p>
                    </div>
                  </button>
                  <button 
                    onClick={() => setActiveTab("salaries")}
                    className="w-full p-4 bg-purple-50 rounded-lg text-left hover:bg-purple-100 transition-colors flex items-center gap-3 cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">💼</div>
                    <div>
                      <p className="font-medium text-gray-800">Pay Salaries</p>
                      <p className="text-xs text-gray-500">{summary.totalSalaryPending > 0 ? `৳${summary.totalSalaryPending.toLocaleString()} pending` : 'All paid'}</p>
                    </div>
                  </button>
                  <button 
                    onClick={handleExportReport}
                    className="w-full p-4 bg-green-50 rounded-lg text-left hover:bg-green-100 transition-colors flex items-center gap-3 cursor-pointer"
                  >
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">📊</div>
                    <div>
                      <p className="font-medium text-gray-800">Export Report</p>
                      <p className="text-xs text-gray-500">Download financial report</p>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* Collections Tab */}
      {activeTab === "collections" && (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h2 className="font-bold text-gray-800 text-lg">Income Transactions</h2>
                <p className="text-sm text-gray-500">
                  {filteredIncomeTransactions.length} transactions • Total: ৳{summary.totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] w-64"
                  />
                </div>
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                >
                  <option value="all">All Categories</option>
                  <option value="hall_fee">Hall Fee</option>
                  <option value="mess_fee">Mess Fee</option>
                  <option value="laundry_fee">Laundry Fee</option>
                  <option value="fine">Fine</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          </div>
          {filteredIncomeTransactions.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Transaction ID</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredIncomeTransactions.map((tx) => (
                    <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm text-gray-600">{formatDate(tx.date)}</td>
                      <td className="px-6 py-4 text-sm font-mono text-gray-500">{tx.transactionId}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-800">{tx.description}</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium">
                          {CATEGORY_ICONS[tx.category] || '💵'} {tx.category?.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right font-bold text-green-600">+৳{tx.amount.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-16">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p className="text-lg font-medium">No income transactions found</p>
              <p className="text-sm">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </div>
      )}

      {/* Expenses Tab */}
      {activeTab === "expenses" && (
        <div className="space-y-6">
          {/* Expense Category Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {['market', 'utilities', 'maintenance', 'salary', 'equipment', 'other'].map((cat) => {
              const catData = data?.expensesByCategory?.find(e => e.category === cat);
              const total = catData?.total || 0;
              const count = catData?.count || 0;
              return (
                <div 
                  key={cat} 
                  className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all cursor-pointer border-2 border-transparent hover:border-gray-200"
                  onClick={() => setCategoryFilter(cat === categoryFilter ? 'all' : cat)}
                >
                  <div className="text-2xl mb-2">{CATEGORY_ICONS[cat]}</div>
                  <p className="text-xl font-bold text-gray-800">৳{total.toLocaleString()}</p>
                  <p className="text-sm text-gray-500 capitalize">{cat}</p>
                  <p className="text-xs text-gray-400">{count} items</p>
                </div>
              );
            })}
          </div>

          {/* Expense Transactions Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="font-bold text-gray-800 text-lg">Expense Transactions</h2>
                  <p className="text-sm text-gray-500">
                    {filteredExpenseTransactions.length} transactions • Total: ৳{summary.totalExpenses.toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search expenses..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] w-64"
                    />
                  </div>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                  >
                    <option value="all">All Categories</option>
                    <option value="market">Market</option>
                    <option value="utilities">Utilities</option>
                    <option value="maintenance">Maintenance</option>
                    <option value="salary">Salary</option>
                    <option value="equipment">Equipment</option>
                    <option value="other">Other</option>
                  </select>
                  <button 
                    onClick={() => setShowAddExpenseModal(true)}
                    className="px-4 py-2 bg-[#2D6A4F] text-white rounded-lg text-sm font-medium hover:bg-[#245840] flex items-center gap-2 cursor-pointer"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add
                  </button>
                </div>
              </div>
            </div>
            {filteredExpenseTransactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Added By</th>
                      <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredExpenseTransactions.map((tx) => (
                      <tr key={tx.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 text-sm text-gray-600">{formatDate(tx.date)}</td>
                        <td className="px-6 py-4 text-sm font-mono text-gray-500">{tx.transactionId}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-800">{tx.description}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-700 rounded-full text-xs font-medium">
                            {CATEGORY_ICONS[tx.category] || '📦'} {tx.category}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{tx.addedBy || '-'}</td>
                        <td className="px-6 py-4 text-right font-bold text-red-600">-৳{tx.amount.toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-16">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-lg font-medium">No expenses found</p>
                <p className="text-sm mb-4">Try adjusting your search or filter criteria</p>
                <button 
                  onClick={() => setShowAddExpenseModal(true)}
                  className="px-4 py-2 bg-[#2D6A4F] text-white rounded-lg text-sm font-medium hover:bg-[#245840] cursor-pointer"
                >
                  Add First Expense
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Staff Salaries Tab */}
      {activeTab === "salaries" && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-purple-500">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center text-2xl">👥</div>
                <div>
                  <p className="text-gray-500 text-sm">Total Staff</p>
                  <p className="text-3xl font-bold text-gray-800">{data?.staffSalaries?.length || 0}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-blue-500">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-2xl">💰</div>
                <div>
                  <p className="text-gray-500 text-sm">Monthly Budget</p>
                  <p className="text-3xl font-bold text-gray-800">৳{summary.totalSalaryBudget.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-green-500">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl">✅</div>
                <div>
                  <p className="text-gray-500 text-sm">Paid This Period</p>
                  <p className="text-3xl font-bold text-green-600">৳{summary.totalSalaryPaid.toLocaleString()}</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-5 shadow-sm border-l-4 border-orange-500">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center text-2xl">⏳</div>
                <div>
                  <p className="text-gray-500 text-sm">Pending</p>
                  <p className="text-3xl font-bold text-orange-600">৳{summary.totalSalaryPending.toLocaleString()}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Staff Salary List */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-gray-800 text-lg">Staff Salary Status</h2>
                <p className="text-sm text-gray-500">{data?.period?.label}</p>
              </div>
              <button 
                onClick={() => setShowAddExpenseModal(true)}
                className="px-4 py-2 bg-[#2D6A4F] text-white rounded-lg text-sm font-medium hover:bg-[#245840] flex items-center gap-2 cursor-pointer"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Record Payment
              </button>
            </div>
            {data?.staffSalaries && data.staffSalaries.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Staff Member</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                      <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Salary</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Paid Date</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {data.staffSalaries.map((staff) => (
                      <tr key={staff.id} className={`hover:bg-gray-50 transition-colors ${staff.status === "pending" ? "bg-yellow-50" : ""}`}>
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Image
                              src="/logos/profile.png"
                              alt={staff.name}
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-full"
                            />
                            <span className="text-sm font-medium text-gray-800">{staff.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-medium">
                            {staff.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-gray-800">৳{staff.salary.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            staff.status === "paid" 
                              ? "bg-green-100 text-green-700" 
                              : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {staff.status === "paid" ? "✓ Paid" : "⏳ Pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {staff.paidDate || "-"}
                        </td>
                        <td className="px-6 py-4">
                          {staff.status === "pending" && (
                            <button
                              onClick={() => { setSelectedStaff(staff); setShowPaySalaryModal(true); }}
                              className="px-3 py-1.5 bg-[#2D6A4F] text-white text-xs font-medium rounded-lg hover:bg-[#245840] transition-colors cursor-pointer"
                            >
                              Pay Now
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-16">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <p className="text-lg font-medium">No staff members found</p>
                <p className="text-sm">Staff salaries will appear here once staff are registered</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Defaulters Tab */}
      {activeTab === "defaulters" && (
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-linear-to-br from-red-500 to-red-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Total Defaulters</p>
                  <p className="text-4xl font-bold mt-1">{summary.defaulterCount}</p>
                </div>
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-linear-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Total Pending Amount</p>
                  <p className="text-4xl font-bold mt-1">৳{summary.pendingDues.toLocaleString()}</p>
                </div>
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="bg-linear-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm">Average Due Amount</p>
                  <p className="text-4xl font-bold mt-1">
                    ৳{summary.defaulterCount > 0 
                      ? Math.round(summary.pendingDues / summary.defaulterCount).toLocaleString() 
                      : 0}
                  </p>
                </div>
                <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Defaulters List */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="font-bold text-gray-800 text-lg">Defaulter List</h2>
                  <p className="text-sm text-gray-500">Students with pending payments</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search students..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] w-64"
                    />
                  </div>
                  <button className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 flex items-center gap-2 cursor-pointer">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Send Reminders
                  </button>
                </div>
              </div>
            </div>
            {filteredDefaulters.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Student ID</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Room</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Due Since</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Overdue</th>
                      <th className="text-right px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredDefaulters.map((defaulter) => (
                      <tr key={defaulter.id} className="hover:bg-red-50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <Image
                              src="/logos/profile.png"
                              alt={defaulter.name}
                              width={40}
                              height={40}
                              className="w-10 h-10 rounded-full border-2 border-red-200"
                            />
                            <span className="text-sm font-medium text-gray-800">{defaulter.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 font-mono">{defaulter.studentId}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{defaulter.room}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{defaulter.dueDate}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                            defaulter.monthsOverdue >= 3 ? "bg-red-100 text-red-700" :
                            defaulter.monthsOverdue >= 2 ? "bg-orange-100 text-orange-700" :
                            "bg-yellow-100 text-yellow-700"
                          }`}>
                            {defaulter.monthsOverdue} month(s)
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-red-600">৳{defaulter.dueAmount.toLocaleString()}</td>
                        <td className="px-6 py-4">
                          <button className="px-3 py-1.5 bg-[#2D6A4F] text-white text-xs font-medium rounded-lg hover:bg-[#245840] transition-colors flex items-center gap-1 cursor-pointer">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            Remind
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center text-gray-500 py-16">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-xl font-medium text-gray-700">No Defaulters! 🎉</p>
                <p className="text-sm text-gray-500 mt-1">All students have paid for the current period.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Expense Modal */}
      {showAddExpenseModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Add New Expense</h2>
                    <p className="text-sm text-gray-500">Record a new expense transaction</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowAddExpenseModal(false)}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <form onSubmit={handleAddExpense} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <input
                  type="text"
                  value={expenseDescription}
                  onChange={(e) => setExpenseDescription(e.target.value)}
                  placeholder="e.g., Monthly electricity bill"
                  required
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                  <select 
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none bg-white transition-all"
                  >
                    <option value="market">🛒 Market/Supplies</option>
                    <option value="utilities">💡 Utilities</option>
                    <option value="maintenance">🔧 Maintenance</option>
                    <option value="salary">💼 Staff Salaries</option>
                    <option value="equipment">🖥️ Equipment</option>
                    <option value="other">📦 Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                  <input
                    type="date"
                    value={expenseDate}
                    onChange={(e) => setExpenseDate(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (৳) *</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">৳</span>
                  <input
                    type="number"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    placeholder="0.00"
                    required
                    min="1"
                    className="w-full p-3 pl-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vendor (Optional)</label>
                <input
                  type="text"
                  value={expenseVendor}
                  onChange={(e) => setExpenseVendor(e.target.value)}
                  placeholder="e.g., Power Development Board"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#2D6A4F] focus:border-transparent outline-none transition-all"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddExpenseModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 px-4 py-3 bg-[#2D6A4F] text-white rounded-lg font-medium hover:bg-[#245840] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitting && <Spinner className="w-4 h-4" />}
                  Add Expense
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Pay Salary Modal */}
      {showPaySalaryModal && selectedStaff && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Confirm Salary Payment</h2>
                    <p className="text-sm text-gray-500">Record salary payment for staff</p>
                  </div>
                </div>
                <button 
                  onClick={() => { setShowPaySalaryModal(false); setSelectedStaff(null); }}
                  className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-6">
                <Image
                  src="/logos/profile.png"
                  alt={selectedStaff.name}
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full"
                />
                <div>
                  <p className="text-lg font-bold text-gray-800">{selectedStaff.name}</p>
                  <p className="text-sm text-gray-500">{selectedStaff.role}</p>
                </div>
              </div>
              <div className="p-4 bg-purple-50 rounded-xl mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Salary Amount</span>
                  <span className="text-2xl font-bold text-purple-700">৳{selectedStaff.salary.toLocaleString()}</span>
                </div>
              </div>
              <p className="text-sm text-gray-500 mb-6">
                This will record an expense for the salary payment and mark this staff member as paid for the current period.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => { setShowPaySalaryModal(false); setSelectedStaff(null); }}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePaySalary}
                  disabled={submitting}
                  className="flex-1 px-4 py-3 bg-[#2D6A4F] text-white rounded-lg font-medium hover:bg-[#245840] transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitting && <Spinner className="w-4 h-4" />}
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
