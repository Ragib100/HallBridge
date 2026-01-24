"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useCurrentUser } from "@/hooks/use-current-user";

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
			
			const url = `/api/student/meals/meal-selection/guest-meal?studentId=${user.id}`;
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
			console.log("Guest meal submitted successfully:", data);

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
		<div className="w-full mx-auto p-6">
			<h2 className="text-2xl font-bold mb-6">Guest Meal Registration</h2>
			<form onSubmit={handleSubmit} className="space-y-6">
				<div className="space-y-2">
					<Label htmlFor="name">Name</Label>
					<Input
						id="name"
						name="name"
						type="text"
						placeholder="Enter guest's name"
						value={formData.name}
						onChange={handleInputChange}
						required
					/>
				</div>

				<div className="flex w-full justify-between">
					<div className="flex flex-col w-full space-y-6">
						<div className="w-[49%] space-y-2">
							<Label htmlFor="id">ID</Label>
							<Input
								id="id"
								name="id"
								type="text"
								placeholder="Enter guest's ID"
								value={formData.id}
								onChange={handleInputChange}
								required
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="department">Department</Label>
							<Select
								value={formData.department}
								onValueChange={(value) =>
									setFormData((prev) => ({ ...prev, department: value }))
								}
							>
								<SelectTrigger>
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
					</div>

					<div className="flex flex-col w-full space-y-6">
						<div className="w-[49%] space-y-2">
							<Label htmlFor="phone">Phone Number</Label>
							<Input
								id="phone"
								name="phone"
								type="tel"
								placeholder="Enter guest's phone number"
								value={formData.phone}
								onChange={handleInputChange}
								required
							/>
						</div>

						<div className="space-y-3">
							<Label>Select Meals</Label>
							<div className="space-y-3">
								<div className="flex items-center space-x-2">
									<Input
										id="breakfast"
										type="checkbox"
										checked={formData.breakfast}
										onChange={() => handleCheckboxChange("breakfast")}
										className="w-4 h-4 cursor-pointer"
									/>
									<label htmlFor="breakfast" className="cursor-pointer">Breakfast</label>
								</div>

								<div className="flex items-center space-x-2">
									<Input
										id="lunch"
										type="checkbox"
										checked={formData.lunch}
										onChange={() => handleCheckboxChange("lunch")}
										className="w-4 h-4 cursor-pointer"
									/>
									<label htmlFor="lunch" className="cursor-pointer">Lunch</label>
								</div>

								<div className="flex items-center space-x-2">
									<Input
										id="dinner"
										type="checkbox"
										checked={formData.dinner}
										onChange={() => handleCheckboxChange("dinner")}
										className="w-4 h-4 cursor-pointer"
									/>
									<label htmlFor="dinner" className="cursor-pointer">Dinner</label>
								</div>
							</div>
						</div>
					</div>
				</div>

				<Button type="submit" className="w-full cursor-pointer border border-blue-800 bg-blue-500 hover:bg-blue-600" disabled={is_submitting}>
					{is_submitting ? (
						<>
							<Spinner className="mr-2" />
							Submitting...
						</>
					) : (
						"Submit"
					)}
				</Button>
			</form>
		</div>
	);
}