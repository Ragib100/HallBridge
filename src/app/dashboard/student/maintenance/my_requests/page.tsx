'use client';

import { getIcon } from '@/components/common/icons';
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

export default function MyRequestsPage() {
    const [requests, setRequests] = useState<MaintenanceRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const response = await fetch('/api/maintenance?studentOnly=true');
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
                return { label: 'In Progress', color: '#007aff' };
            case 'pending':
                return { label: 'Pending', color: '#ffa500' };
            case 'completed':
                return { label: 'Completed', color: '#4caf50' };
            default:
                return { label: status, color: '#666' };
        }
    };

    const groupedRequests = {
        'in-progress': requests.filter(r => r.status === 'in-progress'),
        'pending': requests.filter(r => r.status === 'pending'),
        'completed': requests.filter(r => r.status === 'completed')
    };

    const getStatusColorClass = (status: string) => {
        switch (status) {
            case 'in-progress':
                return 'bg-blue-500';
            case 'pending':
                return 'bg-orange-500';
            case 'completed':
                return 'bg-green-500';
            default:
                return 'bg-gray-500';
        }
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

    const renderRequest = (request: MaintenanceRequest) => (
        <div key={request.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm flex flex-col items-start mt-3">
            <div className="flex justify-between w-full">
                <div>
                    <div className="font-bold text-gray-900">Request #{request.requestId}</div>
                    <div className="text-sm text-gray-600">Category: {categoryLabels[request.category] || request.category}</div>
                </div>
                <span className={`${getStatusColorClass(request.status)} text-white px-3 py-1 rounded-xl text-sm font-medium whitespace-nowrap`}>
                    {getStatusConfig(request.status).label}
                </span>
            </div>
            <div className="text-sm text-gray-700 my-2">
                <strong>Location:</strong> {request.location}
            </div>
            <div className="text-sm text-gray-700 mb-2">
                <strong>Issue:</strong> {request.description}
            </div>
            <div className="text-sm text-gray-600">
                {request.status === 'in-progress' && request.assignedTo && (
                    <>Assigned to: {request.assignedTo.fullName} {request.estimatedCompletion && `| ETA: ${formatDate(request.estimatedCompletion)}`}</>
                )}
                {request.status === 'pending' && `Submitted: ${formatDate(request.createdAt)}`}
                {request.status === 'completed' && request.completedAt && `Completed on: ${formatDate(request.completedAt)}`}
            </div>
            {request.status === 'completed' && (
                <Button className="w-full mt-3 bg-blue-500 hover:bg-blue-600 border border-blue-700 cursor-pointer">
                    {getIcon('star')} Rate Service
                </Button>
            )}
        </div>
    );

    if (loading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen flex items-center justify-center">
                <div className="text-gray-500">Loading your requests...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
                    {error}
                </div>
            </div>
        );
    }

    if (requests.length === 0) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="mb-6">
                    <span className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        {getIcon('file')} My Maintenance Requests
                    </span>
                </div>
                <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
                    <div className="text-4xl mb-3">📋</div>
                    <p className="text-gray-600">No maintenance requests yet</p>
                    <p className="text-sm text-gray-500 mt-1">Submit a new request when you have an issue</p>
                </div>
            </div>
        );
    }
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <div className="mb-6">
                <span className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                    {getIcon('file')} My Maintenance Requests
                </span>
            </div>

            {groupedRequests['in-progress'].length > 0 && (
                <div className="mb-8">
                    <h3 className="text-base font-semibold text-blue-600 mb-3">In Progress</h3>
                    {groupedRequests['in-progress'].map(renderRequest)}
                </div>
            )}

            {groupedRequests['pending'].length > 0 && (
                <div className="mb-8">
                    <h3 className="text-base font-semibold text-orange-600 mb-3">Pending Assignment</h3>
                    {groupedRequests['pending'].map(renderRequest)}
                </div>
            )}

            {groupedRequests['completed'].length > 0 && (
                <div className="mb-8">
                    <h3 className="text-base font-semibold text-green-600 mb-3">Completed</h3>
                    {groupedRequests['completed'].map(renderRequest)}
                </div>
            )}
        </div>
    );
}