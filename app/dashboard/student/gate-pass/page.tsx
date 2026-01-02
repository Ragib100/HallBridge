'use client';

import { useState } from 'react';
import { Select, SelectTrigger, SelectValue , SelectContent, SelectGroup, SelectLabel, SelectItem} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { Label } from '@/components/ui/label';
import { getIcon } from '@/components/common/icons';

export default function StudentGatePassPage() {
	const [purpose, setPurpose] = useState<string>('');
	const [destination, setDestination] = useState<string>('');
	const [outDate, setOutDate] = useState<string>('');
	const [outTime, setOutTime] = useState<string>('12:00:00');
	const [returnDate, setReturnDate] = useState<string>('');
	const [returnTime, setReturnTime] = useState<string>('12:00:00');
	const [contactNumber, setContactNumber] = useState<string>('');
	const [emergencyContact, setEmergencyContact] = useState<string>('');
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);
		console.log(purpose, destination, outDate, outTime, returnDate, returnTime, contactNumber, emergencyContact);
		await new Promise((resolve) => setTimeout(resolve, 2000));
		setIsSubmitting(false);
	}

	return (
		<div className="px-4 md:px-8 py-8 max-w-full overflow-x-hidden">
			
			<Label className="text-lg py-4">{getIcon('gatepass')} Gate Pass</Label>

			<form
				onSubmit={handleSubmit}
				className="px-2 md:px-4 py-4"
			>
				<div className="pb-6">
					<label className="font-bold mb-2">Purpose of Leave *</label>
					<Select
						name="purpose"
						value={purpose}
						onValueChange={(value)=>{setPurpose(value)}}
					>
						<SelectTrigger className="w-full cursor-pointer">
							<SelectValue placeholder="Select purpose"/>
						</SelectTrigger>

						<SelectContent>
							<SelectGroup>
								<SelectLabel>Purpose</SelectLabel>
								<SelectItem value="home">Going Home</SelectItem>
								<SelectItem value="medical">Medical Emergency</SelectItem>
								<SelectItem value="personal">Personal Work</SelectItem>
								<SelectItem value="family">Family Event</SelectItem>
								<SelectItem value="other">Other</SelectItem>
								</SelectGroup>
						</SelectContent>
					</Select>
				</div>

				<div className="pb-6">
					<label className="font-bold">Destination *</label>
					<Input
						type="text"
						name="destination"
						placeholder="Enter destination"
						value={destination}
						onChange={(e)=>{setDestination(e.target.value)}}
					/>
				</div>

				<div className="flex flex-col md:flex-row gap-4 pb-6">
					<div className="w-full">
						<label className="font-bold">Out Date *</label>
						<Input
							type="date"
							name="outDate"
							value={outDate}
							onChange={(e)=>{setOutDate(e.target.value)}}
						/>
					</div>
					<div className="w-full">
						<label className="font-bold">Out Time *</label>
						<Input
							type="time"
							name="outTime"
							value={outTime}
							onChange={(e)=>{setOutTime(e.target.value)}}
						/>
					</div>
				</div>

				<div className="flex flex-col md:flex-row gap-4 pb-6">
					<div className="w-full">
						<label className="font-bold">Return Date *</label>
						<Input
							type="date"
							name="returnDate"
							value={returnDate}
							onChange={(e)=>{setReturnDate(e.target.value)}}
						/>
					</div>
					<div className="w-full">
						<label className="font-bold">Return Time *</label>
						<Input
							type="time"
							name="returnTime"
							value={returnTime}
							onChange={(e)=>{setReturnTime(e.target.value)}}
						/>
					</div>
				</div>

				<div className="pb-6">
					<label className="font-bold">Contact Number *</label>
					<Input
						type="tel"
						name="contactNumber"
						value={contactNumber}
						onChange={(e)=>{setContactNumber(e.target.value)}}
						placeholder="Your contact number"
					/>
				</div>

				<div className="pb-6">
					<label className="font-bold">Emergency Contact *</label>
					<Input
						type="tel"
						name="emergencyContact"
						value={emergencyContact}
						onChange={(e)=>{setEmergencyContact(e.target.value)}}
						placeholder="Emergency contact number"
					/>
				</div>

				<Button className="w-full border border-blue-700 bg-blue-500 hover:bg-blue-600 cursor-pointer mt-4" disabled={isSubmitting} type="submit">
					{isSubmitting ? <Spinner /> : `${getIcon('submit')} Submit Request`}
				</Button>
			</form>
		</div>
	);
}