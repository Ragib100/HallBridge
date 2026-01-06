'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem, SelectLabel } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { getIcon } from '@/components/common/icons';

interface LaundryFormData {
	pickupDate: string;
	pickupTime: string;
	serviceType: string;
	itemCount: string;
	specialInstructions: string;
}

interface CardInfo {
	title: string;
	price: string;
	backgroundColor: string;
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

	const cards: CardInfo[] = [
		{ title: 'Regular Wash (2-3 days)', price: '30/kg', backgroundColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
		{ title: 'Express Wash (24 hours)', price: '50/kg', backgroundColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
		{ title: 'Dry Clean (3-4 days)', price: '80/piece', backgroundColor: 'linear-gradient(135deg, #1e88e5 0%, #0078d4 100%)' },
		{ title: 'Iron Only', price: '5/piece', backgroundColor: 'linear-gradient(135deg, #2ecc71 0%, #16a085 100%)' }
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
		<Card className="mx-2 md:mx-4 my-6 w-full max-w-full h-full p-4 md:p-6 gap-4 overflow-x-hidden">
			<CardHeader className="mb-4">
				<label className="font-bold text-xl md:text-2xl">{getIcon('laundry')} Schedule Laundry Pickup</label>
			</CardHeader>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full gap-4 md:gap-6">
				{cards.map((card) => (
					<div 
						className="flex flex-col w-full py-8 px-4 items-center justify-center rounded-xl text-center text-white shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 cursor-pointer border border-white/20" 
						style={{ backgroundImage: card.backgroundColor }} 
						key={card.title}
					>
						<p className="text-base md:text-lg font-bold px-2 mb-2 drop-shadow-md">{card.title}</p>
						<p className="text-2xl md:text-3xl font-extrabold drop-shadow-md">{getIcon('taka')} {card.price}</p>
					</div>
				))}
			</div>

			<CardContent>
				<form
					onSubmit={(e) => { e.preventDefault(); handle_submit(); }}
					className="flex flex-col gap-4 px-2 md:px-4 py-6"
				>
					<div className="flex flex-col md:flex-row gap-4 w-full pb-6">
						<div className="w-full">
							<label className="font-bold">Pickup Date *</label>
							<Input
								type="date"
								name="pickupDate"
								value={formData.pickupDate}
								onChange={handleInputChange}
								className="p-2 border rounded-lg"
							/>
						</div>
						<div className="w-full">
							<label className="font-bold">Pickup Time *</label>
							<Input
								type="time"
								name="pickupTime"
								value={formData.pickupTime}
								onChange={handleInputChange}
								className="p-2 border rounded-lg"
							/>
						</div>
					</div>

					<div className="pb-6">
						<label className="font-bold">Service Type *</label>
						<Select
							value={formData.serviceType}
							onValueChange={(value) => setFormData({ ...formData, serviceType: value })}
						>
							<SelectTrigger className="w-full">
								<SelectValue placeholder="Select Service Type" />
							</SelectTrigger>

							<SelectContent>
								<SelectGroup>
									<SelectLabel className="text-lg">Service Types</SelectLabel>
									<SelectItem value="regular">Regular Wash (2-3 days)</SelectItem>
									<SelectItem value="express">Express Wash (24 hours)</SelectItem>
									<SelectItem value="dry-clean">Dry Clean (3-4 days)</SelectItem>
									<SelectItem value="iron-only">Iron Only</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</div>

					<div className="pb-6">
						<label className="font-bold">Estimated Item Count or Weight</label>
						<Input
							type="text"
							name="itemCount"
							value={formData.itemCount}
							onChange={handleInputChange}
							placeholder="e.g., 10 items or 5 kg"
						/>
					</div>

					<div className="pb-6">
						<label className="font-bold">Special Instructions (optional)</label>
						<Textarea
							name="specialInstructions"
							value={formData.specialInstructions}
							onChange={handleInputChange}
							placeholder="Any special care instructions..."
							className="py-8"
						/>
					</div>

					<Button
						className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold mt-2 py-6 cursor-pointer"
						onClick={() => { setSubmitting(true) }}
						disabled={submitting}
					>
						{submitting ? <Spinner /> : "📝 Schedule Pickup"}
					</Button>

				</form>
			</CardContent>
		</Card>
	);
}