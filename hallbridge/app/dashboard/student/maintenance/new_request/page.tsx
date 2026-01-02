'use client';

import '@/app/dashboard/staff/staff.css'
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

export default function NewRequestPage() {

    const [formData, setFormData] = useState({
        category: '',
        priority: '',
        location: '',
        description: '',
        contactNumber: '',
        preferredTime: ''
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };

    return (
        <div className="p-7">
            <div className="mb-7">
                <span className="font-semibold text-lg">🔧 Submit Maintenance Request</span>
            </div>

            <div className="flex flex-col gap-4">

                <div className="flex gap-4">
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
                    <p>Contact Number *</p>
                    <Input
                        type="tel"
                        id="contactNumber"
                        name="contactNumber"
                        value={formData.contactNumber}
                        onChange={handleInputChange}
                        placeholder="Your contact number"
                    />
                </div>

                <Button
                    className="mt-4 bg-blue-600 hover:bg-blue-700 border border-blue-700 cursor-pointer text-white"
                >📝 Submit Request</Button>
            </div>
        </div>
    );
}