'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem, SelectLabel } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

interface LaundryFormData {
	pickupDate: string;
	pickupTime: string;
	serviceType: string;
	itemCount: string;
	specialInstructions: string;
}

interface ServiceInfo {
	title: string;
	price: string;
	duration: string;
	icon: string;
}

export default function StudentLaundryPage() {
	const [submitting, setSubmitting] = useState<boolean>(false);

	const [formData, setFormData] = useState<LaundryFormData>({
		pickupDate: '',
		pickupTime: "10:00:00",
		serviceType: '',
		itemCount: '',
		specialInstructions: ''
	});

	const services: ServiceInfo[] = [
		{ title: 'Regular Wash', price: '৳30/kg', duration: '2-3 days', icon: '🧺' },
		{ title: 'Express Wash', price: '৳50/kg', duration: '24 hours', icon: '⚡' },
		{ title: 'Dry Clean', price: '৳80/piece', duration: '3-4 days', icon: '👔' },
		{ title: 'Iron Only', price: '৳5/piece', duration: 'Same day', icon: '🔥' }
	];

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value
		});
	};

	const handle_submit = async () => {
		setSubmitting(true);

		setTimeout(() => {
			alert('Laundry pickup scheduled successfully!');
			setSubmitting(false);
		}, 2000);
	}

	return (
		<div className="space-y-6">
			{/* Header */}
			<div className="bg-white rounded-xl p-6 shadow-sm">
				<h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
					<svg className="w-6 h-6 text-[#2D6A4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
					</svg>
					Schedule Laundry Pickup
				</h1>
				<p className="text-gray-500 mt-1">Choose a service and schedule your laundry pickup</p>
			</div>

			{/* Service Cards */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				{services.map((service) => (
					<div 
						className="bg-white rounded-xl p-5 shadow-sm border-2 border-gray-100 hover:border-[#2D6A4F] transition-colors cursor-pointer group" 
						key={service.title}
					>
						<div className="text-3xl mb-3">{service.icon}</div>
						<p className="font-bold text-gray-800 mb-1">{service.title}</p>
						<p className="text-2xl font-bold text-[#2D6A4F] mb-2">{service.price}</p>
						<p className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full inline-block">
							{service.duration}
						</p>
					</div>
				))}
			</div>

			{/* Booking Form */}
			<div className="bg-white rounded-xl shadow-sm p-6">
				<h2 className="text-lg font-bold text-gray-800 mb-6">Booking Details</h2>
				
				<form
					onSubmit={(e) => { e.preventDefault(); handle_submit(); }}
					className="space-y-6"
				>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700">Pickup Date *</label>
							<Input
								type="date"
								name="pickupDate"
								value={formData.pickupDate}
								onChange={handleInputChange}
								className="h-11 focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F]"
							/>
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700">Pickup Time *</label>
							<Input
								type="time"
								name="pickupTime"
								value={formData.pickupTime}
								onChange={handleInputChange}
								className="h-11 focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F]"
							/>
						</div>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium text-gray-700">Service Type *</label>
						<Select
							value={formData.serviceType}
							onValueChange={(value) => setFormData({ ...formData, serviceType: value })}
						>
							<SelectTrigger className="h-11 focus:ring-2 focus:ring-[#2D6A4F]">
								<SelectValue placeholder="Select Service Type" />
							</SelectTrigger>

							<SelectContent>
								<SelectGroup>
									<SelectLabel>Service Types</SelectLabel>
									<SelectItem value="regular">Regular Wash (2-3 days)</SelectItem>
									<SelectItem value="express">Express Wash (24 hours)</SelectItem>
									<SelectItem value="dry-clean">Dry Clean (3-4 days)</SelectItem>
									<SelectItem value="iron-only">Iron Only (Same day)</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium text-gray-700">Estimated Item Count or Weight</label>
						<Input
							type="text"
							name="itemCount"
							value={formData.itemCount}
							onChange={handleInputChange}
							placeholder="e.g., 10 items or 5 kg"
							className="h-11 focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F]"
						/>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium text-gray-700">Special Instructions (optional)</label>
						<Textarea
							name="specialInstructions"
							value={formData.specialInstructions}
							onChange={handleInputChange}
							placeholder="Any special care instructions..."
							className="min-h-[100px] focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F]"
						/>
					</div>

					<Button
						type="submit"
						className="w-full h-12 bg-[#2D6A4F] hover:bg-[#245a42] text-white font-medium cursor-pointer"
						disabled={submitting}
					>
						{submitting ? <Spinner /> : (
							<span className="flex items-center gap-2">
								<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
								</svg>
								Schedule Pickup
							</span>
						)}
					</Button>
				</form>
			</div>
		</div>
	);
}