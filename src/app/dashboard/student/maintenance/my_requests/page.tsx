'use client';

import { getIcon } from '@/components/common/icons';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

interface MaintenanceRequest {
    id: string;
    category: string;
    status: 'in-progress' | 'pending' | 'completed';
    issue: string;
    assignedTo?: string;
    eta?: string;
    submittedDate?: string;
    completedDate?: string;
}

export default function MyRequestsPage() {
    const [requests, setRequests] = useState<MaintenanceRequest[]>([
        {
            id: 'MT-2024-089',
            category: 'Electrical',
            status: 'in-progress',
            issue: 'Light fixture not working in Room 305',
            assignedTo: 'John (Electrician)',
            eta: 'Dec 24, 2025'
        },
        {
            id: 'MT-2024-091',
            category: 'Plumbing',
            status: 'in-progress',
            issue: 'Leaking tap in bathroom',
            assignedTo: 'Mike (Plumber)',
            eta: 'Dec 25, 2025'
        },
        {
            id: 'MT-2024-095',
            category: 'Internet/Wi-Fi',
            status: 'pending',
            issue: 'Weak Wi-Fi signal in room',
            submittedDate: 'Dec 24, 2025 at 10:30 AM'
        },
        {
            id: 'MT-2024-078',
            category: 'Furniture',
            status: 'completed',
            issue: 'Broken chair in study room',
            completedDate: 'Dec 20, 2025'
        }
    ]);

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

    const renderRequest = (request: MaintenanceRequest) => (
        <div key={request.id} className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm flex flex-col items-start mt-3">
            <div className="flex justify-between w-full">
                <div>
                    <div className="font-bold text-gray-900">Request #{request.id}</div>
                    <div className="text-sm text-gray-600">Category: {request.category}</div>
                </div>
                <span className={`${getStatusColorClass(request.status)} text-white px-3 py-1 rounded-xl text-sm font-medium whitespace-nowrap`}>
                    {getStatusConfig(request.status).label}
                </span>
            </div>
            <div className="text-sm text-gray-700 my-2">
                Issue: {request.issue}
            </div>
            <div className="text-sm text-gray-600">
                {request.status === 'in-progress' && `Assigned to: ${request.assignedTo} | ETA: ${request.eta}`}
                {request.status === 'pending' && `Submitted: ${request.submittedDate}`}
                {request.status === 'completed' && `Completed on: ${request.completedDate}`}
            </div>
            {request.status === 'completed' && (
                <Button className="w-full mt-3 bg-blue-500 hover:bg-blue-600 border border-blue-700 cursor-pointer">
                    {getIcon('star')} Rate Service
                </Button>
            )}
        </div>
    );
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