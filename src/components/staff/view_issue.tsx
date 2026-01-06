'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogTrigger,
} from '@/components/ui/dialog';

interface MaintenanceTask {
    id: string;
    title: string;
    room: string;
    reporter: string;
    time: string;
    tags: { label: string; type: 'emergency' | 'water' | 'electrical' | 'general' }[];
    status: 'pending' | 'in-progress' | 'completed';
}

interface ViewIssueDialogProps {
    task: MaintenanceTask;
    children: React.ReactNode;
}

export function ViewIssueDialog({ task, children }: ViewIssueDialogProps) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-125">
                <DialogHeader>
                    <DialogTitle className="text-xl font-semibold">Maintenance Issue Details</DialogTitle>
                    <DialogDescription>
                        Detailed information about the reported issue
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Issue</h4>
                        <p className="text-base font-semibold">{task.title}</p>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Room</h4>
                        <p className="text-base">{task.room}</p>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Reported By</h4>
                        <p className="text-base">{task.reporter}</p>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Reported</h4>
                        <p className="text-base">{task.time}</p>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-1">Status</h4>
                        <div className="flex items-center">
                            <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${task.status === 'pending'
                                        ? 'bg-yellow-100 text-yellow-800'
                                        : task.status === 'in-progress'
                                            ? 'bg-blue-100 text-blue-800'
                                            : 'bg-green-100 text-green-800'
                                    }`}
                            >
                                {task.status === 'pending' ? 'Pending' : task.status === 'in-progress' ? 'In Progress' : 'Completed'}
                            </span>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-medium text-gray-500 mb-2">Categories</h4>
                        <div className="flex flex-wrap gap-2">
                            {task.tags.map((tag, index) => (
                                <span
                                    key={index}
                                    className={`inline-flex items-center px-3 py-1 rounded-md text-sm font-medium ${tag.type === 'emergency'
                                            ? 'bg-red-100 text-red-700'
                                            : tag.type === 'water'
                                                ? 'bg-blue-100 text-blue-700'
                                                : tag.type === 'electrical'
                                                    ? 'bg-yellow-100 text-yellow-700'
                                                    : 'bg-gray-100 text-gray-700'
                                        }`}
                                >
                                    {tag.label}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
