'use client';

import { useMemo, useState, useEffect } from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectLabel, SelectItem } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { getCurrentDateBD, getNextDateBD, getBDDate } from '@/lib/dates';

export default function StudentGatePassPage() {
	const [purpose, setPurpose] = useState<string>('');
	const [purposeDetails, setPurposeDetails] = useState<string>('');
	const [destination, setDestination] = useState<string>('');
	const [outDate, setOutDate] = useState<string>(getCurrentDateBD());
	const [outTime, setOutTime] = useState<string>(new Date(getBDDate().getTime() + 60 * 60 * 1000).toTimeString().substring(0, 5));
	const [returnDate, setReturnDate] = useState<string>(new Date(getBDDate().getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
	const [returnTime, setReturnTime] = useState<string>('12:00');
	const [contactNumber, setContactNumber] = useState<string>('');
	const [emergencyContact, setEmergencyContact] = useState<string>('');
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState<string | null>(null);
	const [disabled, setDisabled] = useState<boolean>(true);

	const addMinutes = (time: string, minutesToAdd: number) => {
		const [hours, minutes] = time.split(':').map(Number);
		const base = getBDDate();
		base.setHours(hours, minutes, 0, 0);
		base.setMinutes(base.getMinutes() + minutesToAdd);
		const hh = String(base.getHours()).padStart(2, '0');
		const mm = String(base.getMinutes()).padStart(2, '0');
		return `${hh}:${mm}`;
	};

	const today = useMemo(() => getCurrentDateBD(), []);
	const minReturnDate = useMemo(() => {
		const d = new Date(outDate);
		d.setDate(d.getDate() + 1);
		return d.toISOString().split('T')[0];
	}, [outDate]);

	useEffect(() => {
		const fetchActivePass = async () => {
			try {
				const [activeRes, pendingRes, approvedRes] = await Promise.all([
					fetch('/api/common/gate-pass?status=active'),
					fetch('/api/common/gate-pass?status=pending'),
					fetch('/api/common/gate-pass?status=approved')
				]);
				if(activeRes?.ok) {
					const data = await activeRes.json();
					if(data?.passes?.length == 0) {
						setDisabled(false);

						if(pendingRes?.ok || approvedRes?.ok) {
							const pendingData = await pendingRes.json();
							const approvedData = await approvedRes.json();
							if(pendingData?.passes?.length > 0) {
								setError('You have a pending gate pass request. Filling out a new request will overwrite the existing pending request.');
							}
							else if(approvedData?.passes?.length > 0) {
								setError('You have an approved gate pass request. Filling out a new request will overwrite the existing approved request.');
							}
						}
					}
					else {
						setError('You have an active gate pass. You cannot request a new one until you return and check in.');
					}
				}
				else {
					alert('Failed to check active gate pass. Please try again later.');
				}
			} catch (error) {
				console.error('Failed to check active gate pass:', error);
			}
		}
		fetchActivePass();
	}, []);

	useEffect(() => {
		// If current returnDate is less than minReturnDate, adjust it
		if (returnDate < minReturnDate) {
			setReturnDate(minReturnDate);
		}
	}, [outDate, minReturnDate]);

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

		setIsSubmitting(true);

		try {
			const response = await fetch('/api/common/gate-pass', {
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
			setOutTime(new Date(getBDDate().getTime() + 60 * 60 * 1000).toTimeString().substring(0, 5));
			const nextDay = getBDDate();
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
		<div className="space-y-6">
			{/* Header */}
			<div className="bg-white rounded-xl p-6 shadow-sm">
				<h1 className="text-xl font-bold text-gray-800 flex items-center gap-2">
					<svg className="w-6 h-6 text-[#2D6A4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
					</svg>
					Request Gate Pass
				</h1>
				<p className="text-gray-500 mt-1">Fill in the details to request a gate pass for leaving the hall</p>
			</div>

			{/* Form */}
			<div className="bg-white rounded-xl shadow-sm p-6">
				<form onSubmit={handleSubmit} className="space-y-6">
					{error && (
						<div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 flex items-center gap-2">
							<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							{error}
						</div>
					)}
					{success && (
						<div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 flex items-center gap-2">
							<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
							</svg>
							{success}
						</div>
					)}

					<div className="space-y-2">
						<label className="text-sm font-medium text-gray-700">Purpose of Leave *</label>
						<Select
							name="purpose"
							value={purpose}
							onValueChange={(value) => {
								setPurpose(value);
								if (value !== 'other') {
									setPurposeDetails('');
								}
							}}
						>
							<SelectTrigger className="h-11 focus:ring-2 focus:ring-[#2D6A4F]">
								<SelectValue placeholder="Select purpose" />
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
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700">Your Purpose *</label>
							<Input
								type="text"
								name="purposeDetails"
								placeholder="Enter your purpose"
								value={purposeDetails}
								onChange={(e) => { setPurposeDetails(e.target.value) }}
								className="h-11 focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F]"
							/>
						</div>
					)}

					<div className="space-y-2">
						<label className="text-sm font-medium text-gray-700">Destination *</label>
						<Input
							type="text"
							name="destination"
							placeholder="Enter destination"
							value={destination}
							onChange={(e) => { setDestination(e.target.value) }}
							className="h-11 focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F]"
						/>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700">Out Date *</label>
							<Input
								type="date"
								name="outDate"
								value={outDate}
								min={today}
								onChange={(e) => {
									const newOutDate = e.target.value;
									setOutDate(newOutDate);
									if (returnDate < newOutDate) {
										setReturnDate(newOutDate);
									}
								}}
								className="h-11 focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F]"
							/>
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700">Out Time *</label>
							<Input
								type="time"
								name="outTime"
								value={outTime}
								onChange={(e) => {
									const newOutTime = e.target.value;
									setOutTime(newOutTime);
									if (returnDate === outDate && returnTime <= newOutTime) {
										setReturnTime(addMinutes(newOutTime, 1));
									}
								}}
								className="h-11 focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F]"
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700">Return Date *</label>
							<Input
								type="date"
								name="returnDate"
								value={returnDate}
								min={minReturnDate}
								onChange={(e) => {
									const newReturnDate = e.target.value;
									setReturnDate(newReturnDate);
								}}
								className="h-11 focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F]"
							/>
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700">Return Time *</label>
							<Input
								type="time"
								name="returnTime"
								value={returnTime}
								min={returnTimeMin}
								onChange={(e) => { setReturnTime(e.target.value) }}
								className="h-11 focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F]"
							/>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700">Your Contact Number *</label>
							<Input
								type="tel"
								name="contactNumber"
								value={contactNumber}
								onChange={(e) => { setContactNumber(e.target.value) }}
								placeholder="Your contact number"
								className="h-11 focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F]"
							/>
						</div>
						<div className="space-y-2">
							<label className="text-sm font-medium text-gray-700">Emergency Contact *</label>
							<Input
								type="tel"
								name="emergencyContact"
								value={emergencyContact}
								onChange={(e) => { setEmergencyContact(e.target.value) }}
								placeholder="Emergency contact number"
								className="h-11 focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F]"
							/>
						</div>
					</div>

					<Button
						className="w-full h-12 bg-[#2D6A4F] hover:bg-[#245a42] text-white font-medium cursor-pointer"
						disabled={isSubmitting || disabled}
						type="submit"
					>
						{isSubmitting ? <Spinner /> : (
							<span className="flex items-center gap-2">
								<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
								</svg>
								Submit Request
							</span>
						)}
					</Button>
				</form>
			</div>
		</div>
	);
}