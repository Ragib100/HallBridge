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
		{ title: 'Regular Wash (2-3 days)', price: '30/kg', backgroundColor: '#364ff5' },
		{ title: 'Express Wash (24 hours)', price: '50/kg', backgroundColor: '#f5bc36' },
		{ title: 'Dry Clean (3-4 days)', price: '80/piece', backgroundColor: '#2ef71b' },
		{ title: 'Iron Only', price: '5/piece', backgroundColor: '#07f0b2' }
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
		<Card className="mx-4 my-6 w-full h-full p-6 gap-4">
			<CardHeader className="mb-4">
				<label className="font-bold text-2xl">{getIcon('laundry')} Schedule Laundry Pickup</label>
			</CardHeader>

			<div className="flex w-full h-auto gap-4">
				{cards.map((card) => (
					<div className="flex flex-col w-full py-4 border items-center justify-center rounded-2xl" style={{ backgroundColor: card.backgroundColor }} key={card.title}>
						<p className="text-2xl">{card.title}</p>
						<p>{getIcon('taka')} {card.price}</p>
					</div>
				))}
			</div>

			<CardContent>
				<form
					onSubmit={(e) => { e.preventDefault(); handle_submit(); }}
					className="flex flex-col gap-4 px-4 py-6"
				>
					<div className="flex gap-4 w-full pb-6">
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