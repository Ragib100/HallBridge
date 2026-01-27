'use client';

import '@/app/dashboard/staff/staff.css'
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
import { getIcon } from '@/components/common/icons';

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
            <div className="p-4 md:p-7 max-w-full overflow-x-hidden">
                <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
                    <div className="text-4xl mb-3">✅</div>
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Request Submitted Successfully!</h3>
                    <p className="text-green-600">Redirecting to your requests...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-7 max-w-full overflow-x-hidden">
            <div className="mb-7">
                <span className="font-semibold text-lg">{getIcon('repair')} Submit Maintenance Request</span>
            </div>

            <div className="flex flex-col gap-4">

                <div className="flex flex-col md:flex-row gap-4">
                    <div className="space-y-2 w-full">
                        <p>Category *</p>
                        <Select
                            name="category"
                            value={formData.category}
                            onValueChange={(value) => handleSelectChange('category', value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="electrical">Electrical</SelectItem>
                                <SelectItem value="plumbing">Plumbing</SelectItem>
                                <SelectItem value="furniture">Furniture</SelectItem>
                                <SelectItem value="ac-heating">AC/Heating</SelectItem>
                                <SelectItem value="doors-windows">Doors & Windows</SelectItem>
                                <SelectItem value="internet">Internet/Wi-Fi</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2 w-full">
                        <p>Priority *</p>
                        <Select
                            name="priority"
                            value={formData.priority}
                            onValueChange={(value) => handleSelectChange('priority', value)}
                        >
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select Priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="urgent">Urgent (Within 24 hours)</SelectItem>
                                <SelectItem value="high">High (Within 2-3 days)</SelectItem>
                                <SelectItem value="normal">Normal (Within a week)</SelectItem>
                                <SelectItem value="low">Low (Can wait)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>


                <div className="space-y-2">
                    <p>Location *</p>
                    <Input
                        type="text"
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleInputChange}
                        placeholder="Room number or specific location"
                    />
                </div>

                <div className="space-y-2">
                    <p>Description *</p>
                    <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Describe the issue in detail..."
                        className="min-h-25"
                    />
                </div>

                <div className="space-y-2">
                    <p>Contact Number</p>
                    <Input
                        type="tel"
                        id="contactNumber"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        placeholder="Your contact number"
                    />
                </div>

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 border border-blue-700 cursor-pointer text-white disabled:opacity-50"
                >
                    {isSubmitting ? 'Submitting...' : `${getIcon('submit')} Submit Request`}
                </Button>
            </div>
        </div>
    );
}