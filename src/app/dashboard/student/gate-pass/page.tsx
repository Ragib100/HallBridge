'use client';

import { useMemo, useState } from 'react';
import { Select, SelectTrigger, SelectValue , SelectContent, SelectGroup, SelectLabel, SelectItem} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { getIcon } from '@/components/common/icons';
import { getCurrentDateBD } from '@/lib/dates';

export default function StudentGatePassPage() {
	const [purpose, setPurpose] = useState<string>('');
	const [purposeDetails, setPurposeDetails] = useState<string>('');
	const [destination, setDestination] = useState<string>('');
	const [outDate, setOutDate] = useState<string>(getCurrentDateBD());
	const [outTime, setOutTime] = useState<string>(new Date(new Date().getTime() + 60 * 60 * 1000).toTimeString().substring(0,5));
	const [returnDate, setReturnDate] = useState<string>(new Date(new Date().getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
	const [returnTime, setReturnTime] = useState<string>('12:00');
	const [contactNumber, setContactNumber] = useState<string>('');
	const [emergencyContact, setEmergencyContact] = useState<string>('');
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);

	const addMinutes = (time: string, minutesToAdd: number) => {
		const [hours, minutes] = time.split(':').map(Number);
		const base = new Date();
		base.setHours(hours, minutes, 0, 0);
		base.setMinutes(base.getMinutes() + minutesToAdd);
		const hh = String(base.getHours()).padStart(2, '0');
		const mm = String(base.getMinutes()).padStart(2, '0');
		return `${hh}:${mm}`;
	};

	const today = useMemo(() => getCurrentDateBD(), []);
	const returnTimeMin = useMemo(
		() => (returnDate === outDate ? addMinutes(outTime, 1) : undefined),
		[returnDate, outDate, outTime]
	);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setError(null);
		setSuccess(null);

		if (!purpose || !destination || !outDate || !outTime || !returnDate || !returnTime || !contactNumber || !emergencyContact) {
			setError('Please fill in all required fields.');
			return;
		}

		if (purpose === 'other' && !purposeDetails.trim()) {
			setError('Please enter your purpose.');
			return;
		}

		if (outDate < today) {
			setError('Out date cannot be before today.');
			return;
		}

		if (returnDate < outDate) {
			setError('Return date cannot be before out date.');
			return;
		}

		if (returnDate === outDate && returnTime <= outTime) {
			setError('Return time must be after out time.');
			return;
		}

		setIsSubmitting(true);

		try {
			const response = await fetch('/api/gate-pass', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					purpose,
					purposeDetails,
					destination,
					outDate,
					outTime,
					returnDate,
					returnTime,
					contactNumber,
					emergencyContact,
				}),
			});

			const data = await response.json();
			if (!response.ok) {
				setError(data?.message || data?.error || 'Failed to submit gate pass.');
				return;
			}

			setSuccess('Gate pass submitted successfully.');
			setPurpose('');
			setPurposeDetails('');
			setDestination('');
			setOutDate(today);
			setOutTime(new Date(new Date().getTime() + 60 * 60 * 1000).toTimeString().substring(0,5));
			const nextDay = new Date();
			nextDay.setDate(nextDay.getDate() + 1);
			setReturnDate(nextDay.toISOString().split('T')[0]);
			setReturnTime('12:00');
			setContactNumber('');
			setEmergencyContact('');
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to submit gate pass.');
		} finally {
			setIsSubmitting(false);
		}
	}

	return (
		<div className="px-4 md:px-8 py-8 max-w-full overflow-x-hidden">
			
			<form
				onSubmit={handleSubmit}
				className="px-2 md:px-4 py-4"
			>
				{error && (
					<div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
						{error}
					</div>
				)}
				{success && (
					<div className="mb-4 rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
						{success}
					</div>
				)}

				<div className="pb-6">
					<label className="font-bold mb-2">Purpose of Leave *</label>
					<Select
						name="purpose"
						value={purpose}
						onValueChange={(value)=>{
							setPurpose(value);
							if (value !== 'other') {
								setPurposeDetails('');
							}
						}}
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

				{purpose === 'other' && (
					<div className="pb-6">
						<label className="font-bold">Your Purpose *</label>
						<Input
							type="text"
							name="purposeDetails"
							placeholder="Enter your purpose"
							value={purposeDetails}
							onChange={(e)=>{setPurposeDetails(e.target.value)}}
						/>
					</div>
				)}

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
							min={today}
							onChange={(e)=>{
								const newOutDate = e.target.value;
								setOutDate(newOutDate);
								if (returnDate < newOutDate) {
									setReturnDate(newOutDate);
								}
							}}
						/>
					</div>
					<div className="w-full">
						<label className="font-bold">Out Time *</label>
						<Input
							type="time"
							name="outTime"
							value={outTime}
							onChange={(e)=>{
								const newOutTime = e.target.value;
								setOutTime(newOutTime);
								if (returnDate === outDate && returnTime <= newOutTime) {
									setReturnTime(addMinutes(newOutTime, 1));
								}
							}}
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
							min={outDate}
							onChange={(e)=>{
								const newReturnDate = e.target.value;
								setReturnDate(newReturnDate);
								if (newReturnDate === outDate && returnTime <= outTime) {
									setReturnTime(addMinutes(outTime, 1));
								}
							}}
						/>
					</div>
					<div className="w-full">
						<label className="font-bold">Return Time *</label>
						<Input
							type="time"
							name="returnTime"
							value={returnTime}
							min={returnTimeMin}
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