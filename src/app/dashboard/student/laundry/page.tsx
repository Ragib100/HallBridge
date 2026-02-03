'use client';

import { useState, useEffect, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

interface LaundryItem {
  type: string;
  quantity: number;
  notes?: string;
}

interface LaundryRequest {
  id: string;
  requestId: string;
  items: LaundryItem[];
  totalItems: number;
  status: string;
  expectedDelivery: string;
  actualDelivery?: string;
  createdAt: string;
  staffNotes?: string;
}

const ITEM_TYPES = [
  { value: 'shirt', label: 'Shirt', icon: '👕' },
  { value: 'pant', label: 'Pant', icon: '👖' },
  { value: 'bedsheet', label: 'Bedsheet', icon: '🛏️' },
  { value: 'towel', label: 'Towel', icon: '🧴' },
  { value: 'other', label: 'Other', icon: '👔' },
];

const STATUS_STYLES: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'Pending Pickup' },
  collected: { bg: 'bg-blue-100', text: 'text-blue-700', label: 'Collected' },
  washing: { bg: 'bg-purple-100', text: 'text-purple-700', label: 'Washing' },
  ready: { bg: 'bg-green-100', text: 'text-green-700', label: 'Ready for Delivery' },
  delivered: { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Delivered' },
};

export default function StudentLaundryPage() {
  const [requests, setRequests] = useState<LaundryRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [items, setItems] = useState<LaundryItem[]>([{ type: 'shirt', quantity: 1 }]);
  const [studentNotes, setStudentNotes] = useState('');

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/common/laundry?studentOnly=true');
      const data = await response.json();
      
      if (response.ok) {
        setRequests(data.requests);
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

  const addItem = () => {
    setItems([...items, { type: 'shirt', quantity: 1 }]);
  };

  const removeItem = (index: number) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const updateItem = (index: number, field: keyof LaundryItem, value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/common/laundry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items,
          studentNotes,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowForm(false);
        setItems([{ type: 'shirt', quantity: 1 }]);
        setStudentNotes('');
        fetchRequests();
      } else {
        setError(data.message);
      }
    } catch {
      setError('Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const activeRequests = requests.filter(r => r.status !== 'delivered');
  const pastRequests = requests.filter(r => r.status === 'delivered');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spinner className="w-6 h-6 text-[#2D6A4F]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <span className="text-2xl">🧺</span>
            Laundry Service
          </h1>
          <p className="text-gray-500 mt-1">Submit laundry requests and track their status</p>
        </div>
        <Button
          onClick={() => setShowForm(!showForm)}
          className="bg-[#2D6A4F] hover:bg-[#245a42] text-white"
        >
          {showForm ? 'Cancel' : '+ New Request'}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
          <button onClick={() => setError(null)} className="float-right">&times;</button>
        </div>
      )}

      {/* New Request Form */}
      {showForm && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">New Laundry Request</h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Items</label>
                <button
                  type="button"
                  onClick={addItem}
                  className="text-sm text-[#2D6A4F] hover:underline"
                >
                  + Add Item
                </button>
              </div>
              
              {items.map((item, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <span className="text-xl">
                    {ITEM_TYPES.find(t => t.value === item.type)?.icon || '👔'}
                  </span>
                  <select
                    value={item.type}
                    onChange={(e) => updateItem(index, 'type', e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                  >
                    {ITEM_TYPES.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                    min="1"
                    max="50"
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6A4F]"
                  />
                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Special Instructions (Optional)</label>
              <textarea
                value={studentNotes}
                onChange={(e) => setStudentNotes(e.target.value)}
                placeholder="Any special care instructions..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2D6A4F] min-h-20"
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <span className="text-gray-700">Total Items:</span>
              <span className="text-xl font-bold text-[#2D6A4F]">
                {items.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#2D6A4F] hover:bg-[#245a42] text-white font-medium"
              disabled={submitting}
            >
              {submitting ? <Spinner /> : 'Submit Request'}
            </Button>
          </form>
        </div>
      )}

      {/* Active Requests */}
      {activeRequests.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Active Requests</h2>
          <div className="space-y-4">
            {activeRequests.map(request => {
              const statusStyle = STATUS_STYLES[request.status] || STATUS_STYLES.pending;
              return (
                <div key={request.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-800">{request.requestId}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                      {statusStyle.label}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {request.items.map((item, idx) => (
                      <span key={idx} className="bg-gray-100 px-2 py-1 rounded text-sm text-gray-600">
                        {ITEM_TYPES.find(t => t.value === item.type)?.icon} {item.quantity}x {item.type}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Submitted: {formatDate(request.createdAt)}</span>
                    <span>Expected: {formatDate(request.expectedDelivery)}</span>
                  </div>
                  
                  {request.staffNotes && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-sm text-blue-700">
                      <strong>Staff Note:</strong> {request.staffNotes}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Past Requests */}
      {pastRequests.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Past Requests</h2>
          <div className="divide-y divide-gray-100">
            {pastRequests.slice(0, 10).map(request => (
              <div key={request.id} className="py-3 flex items-center justify-between">
                <div>
                  <span className="font-medium text-gray-800">{request.requestId}</span>
                  <span className="text-gray-500 text-sm ml-2">
                    {request.totalItems} items
                  </span>
                </div>
                <span className="text-gray-500 text-sm">
                  Delivered: {formatDate(request.actualDelivery || request.createdAt)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {requests.length === 0 && !showForm && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <span className="text-5xl mb-4 block">🧺</span>
          <p className="text-lg font-medium text-gray-800 mb-2">No laundry requests yet</p>
          <p className="text-gray-500 mb-4">Submit your first laundry request to get started</p>
          <Button
            onClick={() => setShowForm(true)}
            className="bg-[#2D6A4F] hover:bg-[#245a42] text-white"
          >
            Create Request
          </Button>
        </div>
      )}
    </div>
  );
}
