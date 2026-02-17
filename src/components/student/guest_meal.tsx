"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useCurrentUser } from "@/hooks/use-current-user";
import { useToast } from "@/components/ui/toast";

interface GuestMealFormData {
	name: string;
	id: string;
	department: string;
	phone: string;
	breakfast: boolean;
	lunch: boolean;
	dinner: boolean;
}

export default function GuestMeal() {
	const [formData, setFormData] = useState<GuestMealFormData>({
		name: "",
		id: "",
		department: "",
		phone: "",
		breakfast: false,
		lunch: false,
		dinner: false,
	});

	const { user } = useCurrentUser();
	const { toast } = useToast();
	const [is_submitting, setIsSubmitting] = useState<boolean>(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		if(!user) {
			console.error("No user logged in.");
			setIsSubmitting(false);
			return;
		}
		
		try {
			
			const url = `/api/student/meals/meal-selection/guest-meal`;
			const response = await fetch(url,{
				method: "PUT",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(formData)
			})

			if (!response.ok) {
				const errorData = await response.json();
				console.error("Submission error:", errorData?.message || "Unknown error");
				return;
			}

			const data = await response.json();
			toast.success('Guest Meal Registered', 'Guest meal registered successfully!');

		} catch (error) {
			console.error("Submission error:", error);
		} finally {
			setFormData({
				name: "",
				id: "",
				department: "",
				phone: "",
				breakfast: false,
				lunch: false,
				dinner: false,
			});
			setIsSubmitting(false);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleCheckboxChange = (meal: "breakfast" | "lunch" | "dinner") => {
		setFormData((prev) => ({ ...prev, [meal]: !prev[meal] }));
	};

	return (
		<div className="bg-white rounded-xl shadow-sm p-6 mt-6">
			<div className="flex items-center gap-2 mb-6">
				<svg className="w-5 h-5 text-[#2D6A4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
					<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
				</svg>
				<h2 className="text-lg font-bold text-gray-800">Guest Meal Registration</h2>
			</div>
			
			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="space-y-2">
					<label className="text-sm font-medium text-gray-700">Guest Name *</label>
					<Input
						id="name"
						name="name"
						type="text"
						placeholder="Enter guest's name"
						value={formData.name}
						onChange={handleInputChange}
						required
						className="h-11 focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F]"
					/>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="space-y-2">
						<label className="text-sm font-medium text-gray-700">Guest ID *</label>
						<Input
							id="id"
							name="id"
							type="text"
							placeholder="Enter guest's ID"
							value={formData.id}
							onChange={handleInputChange}
							required
							className="h-11 focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F]"
						/>
					</div>

					<div className="space-y-2">
						<label className="text-sm font-medium text-gray-700">Phone Number *</label>
						<Input
							id="phone"
							name="phone"
							type="tel"
							placeholder="Enter guest's phone number"
							value={formData.phone}
							onChange={handleInputChange}
							required
							className="h-11 focus:ring-2 focus:ring-[#2D6A4F] focus:border-[#2D6A4F]"
						/>
					</div>
				</div>

				<div className="space-y-2">
					<label className="text-sm font-medium text-gray-700">Department *</label>
					<Select
						value={formData.department}
						onValueChange={(value) =>
							setFormData((prev) => ({ ...prev, department: value }))
						}
					>
						<SelectTrigger className="h-11 focus:ring-2 focus:ring-[#2D6A4F]">
							<SelectValue placeholder="Select guest's department" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="cse">Computer Science & Engineering</SelectItem>
							<SelectItem value="eece">Electrical, Electronic & Communication Engineering</SelectItem>
							<SelectItem value="me">Mechanical Engineering</SelectItem>
							<SelectItem value="ce">Civil Engineering</SelectItem>
							<SelectItem value="archi">Architecture</SelectItem>
							<SelectItem value="ewce">Environmental, Water Resources & Coastal Engineering</SelectItem>
							<SelectItem value="pme">Petroleum & Mining Engineering</SelectItem>
							<SelectItem value="ae">Aeronautical Engineering</SelectItem>
							<SelectItem value="name">Naval Architecture & Marine Engineering</SelectItem>
							<SelectItem value="ipe">Industrial & Production Engineering</SelectItem>
							<SelectItem value="nse">Nuclear Science & Engineering</SelectItem>
							<SelectItem value="bme">Biomedical Engineering</SelectItem>
							<SelectItem value="urp">Urban & Regional Planning</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-3">
					<label className="text-sm font-medium text-gray-700">Select Meals</label>
					<div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
						<label 
							htmlFor="breakfast"
							className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
								formData.breakfast 
									? 'border-[#2D6A4F] bg-[#2D6A4F]/5' 
									: 'border-gray-200 hover:border-gray-300'
							}`}
						>
							<input
								id="breakfast"
								type="checkbox"
								checked={formData.breakfast}
								onChange={() => handleCheckboxChange("breakfast")}
								className="sr-only"
							/>
							<span className="text-xl">🍳</span>
							<span className="font-medium text-gray-700">Breakfast</span>
						</label>

						<label 
							htmlFor="lunch"
							className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
								formData.lunch 
									? 'border-[#2D6A4F] bg-[#2D6A4F]/5' 
									: 'border-gray-200 hover:border-gray-300'
							}`}
						>
							<input
								id="lunch"
								type="checkbox"
								checked={formData.lunch}
								onChange={() => handleCheckboxChange("lunch")}
								className="sr-only"
							/>
							<span className="text-xl">🍛</span>
							<span className="font-medium text-gray-700">Lunch</span>
						</label>

						<label 
							htmlFor="dinner"
							className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
								formData.dinner 
									? 'border-[#2D6A4F] bg-[#2D6A4F]/5' 
									: 'border-gray-200 hover:border-gray-300'
							}`}
						>
							<input
								id="dinner"
								type="checkbox"
								checked={formData.dinner}
								onChange={() => handleCheckboxChange("dinner")}
								className="sr-only"
							/>
							<span className="text-xl">🍽️</span>
							<span className="font-medium text-gray-700">Dinner</span>
						</label>
					</div>
				</div>

				<Button 
					type="submit" 
					className="w-full h-11 bg-[#2D6A4F] hover:bg-[#245a42] text-white font-medium cursor-pointer" 
					disabled={is_submitting}
				>
					{is_submitting ? (
						<>
							<Spinner className="mr-2" />
							Submitting...
						</>
					) : (
						<span className="flex items-center gap-2">
							<svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
							</svg>
							Register Guest Meal
						</span>
					)}
				</Button>
			</form>
		</div>
	);
}