'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function NewRequestPage() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const [formData, setFormData] = useState({
        category: '',
        priority: '',
        location: '',
        description: '',
        contactNumber: '',
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError(null);
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData({
            ...formData,
            [name]: value
        });
        setError(null);
    };

    const handleSubmit = async () => {
        // Validation
        if (!formData.category || !formData.priority || !formData.location || !formData.description) {
            setError('Please fill in all required fields');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch('/api/maintenance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message || 'Failed to submit request');
                return;
            }

            setSuccess(true);
            setTimeout(() => {
                router.push('/dashboard/student/maintenance/my_requests');
            }, 2000);
        } catch {
            setError('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (success) {
        return (
            <div className="space-y-6">
                <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">Request Submitted Successfully!</h3>
                    <p className="text-gray-500">Redirecting to your requests...</p>
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
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Submit Maintenance Request
                </h1>
                <p className="text-gray-500 mt-1">Report an issue in your room or common areas</p>
            </div>

            {/* Form */}
            <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Category *</label>
                            <Select
                                name="category"
                                value={formData.category}
                                onValueChange={(value) => handleSelectChange('category', value)}
                            >
                                <SelectTrigger className="h-11 focus:ring-2 focus:ring-[#2D6A4F]">
                                    <SelectValue placeholder="Select Category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="electrical">⚡ Electrical</SelectItem>
                                    <SelectItem value="plumbing">🔧 Plumbing</SelectItem>
                                    <SelectItem value="furniture">🪑 Furniture</SelectItem>
                                    <SelectItem value="ac-heating">❄️ AC/Heating</SelectItem>
                                    <SelectItem value="doors-windows">🚪 Doors & Windows</SelectItem>
                                    <SelectItem value="internet">🌐 Internet/Wi-Fi</SelectItem>
                                    <SelectItem value="other">📋 Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Priority *</label>
                            <Select
                                name="priority"
                                value={formData.priority}
                                onValueChange={(value) => handleSelectChange('priority', value)}
                            >
                                <SelectTrigger className="h-11 focus:ring-2 focus:ring-[#2D6A4F]">
                                    <SelectValue placeholder="Select Priority" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="urgent">🔴 Urgent (Within 24 hours)</SelectItem>
                                    <SelectItem value="high">🟠 High (Within 2-3 days)</SelectItem>
                                    <SelectItem value="normal">🟡 Normal (Within a week)</SelectItem>
                                    <SelectItem value="low">🟢 Low (Can wait)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Location *</label>
                        <Input
                            type="text"
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleInputChange}
                            placeholder="Room number or specific location"
                            className="h-11 focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F]"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Description *</label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Describe the issue in detail..."
                            className="min-h-30 focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F]"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-700">Contact Number (optional)</label>
                        <Input
                            type="tel"
                            id="contactNumber"
                            name="contactNumber"
                            value={formData.contactNumber}
                            onChange={handleInputChange}
                            placeholder="Your contact number"
                            className="h-11 focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F]"
                        />
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}

                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting}
                        className="w-full h-12 bg-[#2D6A4F] hover:bg-[#245a42] text-white font-medium cursor-pointer disabled:opacity-50"
                    >
                        {isSubmitting ? 'Submitting...' : (
                            <span className="flex items-center gap-2">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                                Submit Request
                            </span>
                        )}
                    </Button>
                </div>
            </div>
        </div>
    );
}