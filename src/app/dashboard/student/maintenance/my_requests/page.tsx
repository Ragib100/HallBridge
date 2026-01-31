'use client';

import { Button } from '@/components/ui/button';
import { useState, useEffect } from 'react';

interface MaintenanceRequest {
    id: string;
    requestId: string;
    category: string;
    status: 'in-progress' | 'pending' | 'completed';
    location: string;
    description: string;
    assignedTo?: { fullName: string };
    estimatedCompletion?: string;
    createdAt: string;
    completedAt?: string;
}

const categoryLabels: Record<string, string> = {
    'electrical': 'Electrical',
    'plumbing': 'Plumbing',
    'furniture': 'Furniture',
    'ac-heating': 'AC/Heating',
    'doors-windows': 'Doors & Windows',
    'internet': 'Internet/Wi-Fi',
    'other': 'Other',
};

const categoryIcons: Record<string, string> = {
    'electrical': '⚡',
    'plumbing': '🔧',
    'furniture': '🪑',
    'ac-heating': '❄️',
    'doors-windows': '🚪',
    'internet': '🌐',
    'other': '📋',
};

export default function MyRequestsPage() {
    const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await fetch('/api/common/maintenance?studentOnly=true');
            const data = await response.json();
            
            if (response.ok) {
                setRequests(data.requests || []);
            } else {
                setError(data.message || 'Failed to fetch requests');
            }
        } catch {
            setError('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    const getStatusConfig = (status: string) => {
        switch (status) {
            case 'in-progress':
                return { label: 'In Progress', bgColor: 'bg-blue-100', textColor: 'text-blue-700' };
            case 'pending':
                return { label: 'Pending', bgColor: 'bg-yellow-100', textColor: 'text-yellow-700' };
            case 'completed':
                return { label: 'Completed', bgColor: 'bg-green-100', textColor: 'text-green-700' };
            default:
                return { label: status, bgColor: 'bg-gray-100', textColor: 'text-gray-700' };
        }
    };

    const groupedRequests = {
        'in-progress': requests.filter(r => r.status === 'in-progress'),
        'pending': requests.filter(r => r.status === 'pending'),
        'completed': requests.filter(r => r.status === 'completed')
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        });
    };

    const renderRequest = (request: MaintenanceRequest) => {
        const statusConfig = getStatusConfig(request.status);
        return (
            <div key={request.id} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                            {categoryIcons[request.category] || '📋'}
                        </div>
                        <div>
                            <div className="font-bold text-gray-800">#{request.requestId}</div>
                            <div className="text-sm text-gray-500">{categoryLabels[request.category] || request.category}</div>
                        </div>
                    </div>
                    <span className={`${statusConfig.bgColor} ${statusConfig.textColor} px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap`}>
                        {statusConfig.label}
                    </span>
                </div>
                
                <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {request.location}
                    </div>
                    <p className="text-sm text-gray-700 line-clamp-2">{request.description}</p>
                </div>

                <div className="pt-3 border-t border-gray-100 text-xs text-gray-500">
                    {request.status === 'in-progress' && request.assignedTo && (
                        <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Assigned to: {request.assignedTo.fullName}
                            {request.estimatedCompletion && ` • ETA: ${formatDate(request.estimatedCompletion)}`}
                        </span>
                    )}
                    {request.status === 'pending' && (
                        <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Submitted: {formatDate(request.createdAt)}
                        </span>
                    )}
                    {request.status === 'completed' && request.completedAt && (
                        <span className="flex items-center gap-1">
                            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                            Completed on: {formatDate(request.completedAt)}
                        </span>
                    )}
                </div>
                
                {request.status === 'completed' && (
                    <Button className="w-full mt-4 bg-[#2D6A4F] hover:bg-[#245a42] text-white cursor-pointer h-10">
                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        Rate Service
                    </Button>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <div className="animate-pulse space-y-4">
                        <div className="h-6 bg-gray-200 rounded w-48"></div>
                        <div className="h-32 bg-gray-100 rounded-xl"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {error}
                </div>
            </div>
        );
    }

    if (requests.length === 0) {
        return (
            <div className="space-y-6">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                    <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <svg className="w-6 h-6 text-[#2D6A4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                        My Maintenance Requests
                    </h1>
                </div>
                <div className="bg-white rounded-xl shadow-sm p-12 text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No Maintenance Requests</h3>
                    <p className="text-gray-500">Submit a new request when you have an issue</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
                <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                    <svg className="w-6 h-6 text-[#2D6A4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    My Maintenance Requests
                </h1>
                <p className="text-gray-500 mt-1">{requests.length} total request{requests.length !== 1 ? 's' : ''}</p>
            </div>

            {/* In Progress */}
            {groupedRequests['in-progress'].length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold text-blue-600 mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        In Progress ({groupedRequests['in-progress'].length})
                    </h3>
                    <div className="grid gap-4">
                        {groupedRequests['in-progress'].map(renderRequest)}
                    </div>
                </div>
            )}

            {/* Pending */}
            {groupedRequests['pending'].length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold text-yellow-600 mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-yellow-500 rounded-full"></span>
                        Pending Assignment ({groupedRequests['pending'].length})
                    </h3>
                    <div className="grid gap-4">
                        {groupedRequests['pending'].map(renderRequest)}
                    </div>
                </div>
            )}

            {/* Completed */}
            {groupedRequests['completed'].length > 0 && (
                <div>
                    <h3 className="text-sm font-semibold text-green-600 mb-3 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Completed ({groupedRequests['completed'].length})
                    </h3>
                    <div className="grid gap-4">
                        {groupedRequests['completed'].map(renderRequest)}
                    </div>
                </div>
            )}
        </div>
    );
}