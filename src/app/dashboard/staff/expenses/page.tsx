'use client';

import '../staff.css';
import { StaffRoleGuard } from '@/components/staff/role-guard';

interface ExpenseItem {
  id: string;
  title: string;
  category: string;
  time: string;
  amount: number;
  icon: string;
}

const mockExpenses: ExpenseItem[] = [
  {
    id: '1',
    title: 'Chicken - 50kg',
    category: 'Market',
    time: 'Today 9:00 AM',
    amount: 1800,
    icon: '🍗'
  },
  {
    id: '2',
    title: 'Rice - 100kg',
    category: 'Market',
    time: 'Today 8:30 AM',
    amount: 1200,
    icon: '🍚'
  },
  {
    id: '3',
    title: 'Vegetables',
    category: 'Market',
    time: 'Today 8:00 AM',
    amount: 800,
    icon: '🥬'
  },
  {
    id: '4',
    title: 'Electricity Bill',
    category: 'Utilities',
    time: 'Yesterday',
    amount: 300,
    icon: '💡'
  }
];

export default function ExpensesPage() {
  const marketTotal = mockExpenses
    .filter(e => e.category === 'Market')
    .reduce((sum, e) => sum + e.amount, 0);
  
  const utilitiesTotal = mockExpenses
    .filter(e => e.category === 'Utilities')
    .reduce((sum, e) => sum + e.amount, 0);
  
  const totalExpenses = marketTotal + utilitiesTotal;

  return (
    <StaffRoleGuard allowedRoles={['financial_staff']}>
    <div className="staff-page">
      <div className="staff-content">
        <div className="tab-content">
          <div className="expense-summary">
            <div className="expense-summary-header">
              <span>📊</span>
              <span>Today&apos;s Summary</span>
            </div>

            <div className="expense-cards-grid">
              <div className="expense-card market">
                <div className="expense-amount">{marketTotal}</div>
                <div className="expense-label">
                  <span>🛒</span>
                  <span>Market</span>
                </div>
              </div>
              <div className="expense-card utilities">
                <div className="expense-amount">{utilitiesTotal}</div>
                <div className="expense-label">
                  <span>💡</span>
                  <span>Utilities</span>
                </div>
              </div>
              <div className="expense-card total">
                <div className="expense-amount">{totalExpenses}</div>
                <div className="expense-label">
                  <span>💰</span>
                  <span>Total</span>
                </div>
              </div>
            </div>
          </div>

          <div className="recent-expenses">
            <div className="recent-expenses-header">
              <span>🧾</span>
              <span>Recent Expenses</span>
            </div>

            {mockExpenses.map(expense => (
              <div key={expense.id} className="expense-item">
                <div className="expense-item-icon">{expense.icon}</div>
                <div className="expense-item-info">
                  <div className="expense-item-title">{expense.title}</div>
                  <div className="expense-item-meta">
                    {expense.category} • {expense.time}
                  </div>
                </div>
                <div className="expense-item-amount">{expense.amount} TK</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </StaffRoleGuard>
  );
}
