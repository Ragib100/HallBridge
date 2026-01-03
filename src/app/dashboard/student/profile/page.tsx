'use client'

import { getIcon } from "@/components/common/icons";
import { useState } from "react";

export default function ProfilePage() {
	const [isEditing, setIsEditing] = useState(false);
	const [profileData, setProfileData] = useState({
		name: "John Doe",
		studentId: "STU-2023-001",
		email: "john.doe@university.edu",
		phone: "+880 1234-567890",
		roomNumber: "B-301",
		department: "Computer Science & Engineering",
		batch: "2023",
		bloodGroup: "B+",
		emergencyContact: "+880 1987-654321",
		address: "123 Main Street, Dhaka, Bangladesh"
	});

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		setProfileData({
			...profileData,
			[e.target.name]: e.target.value
		});
	};

	const handleSave = () => {
		// TODO: Implement save functionality
		setIsEditing(false);
		console.log("Profile updated:", profileData);
	};

	return (
		<div className="bg-[#f3f4f6] flex flex-col w-full min-h-screen px-4 md:px-8 py-4 overflow-x-hidden">
			<header className="flex w-full h-16 items-center px-4 font-bold text-lg">
				{getIcon('profile')} My Profile
			</header>

			<main className="w-full flex-1 overflow-x-hidden">
				<div className="max-w-4xl mx-auto">
					{/* Profile Header Card */}
					<div className="bg-white rounded-lg shadow-lg p-6 mb-6">
						<div className="flex flex-col md:flex-row items-center gap-6">
							<div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
								{profileData.name.split(' ').map(n => n[0]).join('')}
							</div>
							<div className="flex-1 text-center md:text-left">
								<h2 className="text-2xl font-bold text-gray-800">{profileData.name}</h2>
								<p className="text-gray-600">{profileData.studentId}</p>
								<p className="text-gray-500 text-sm">{profileData.department}</p>
							</div>
							<button
								onClick={() => setIsEditing(!isEditing)}
								className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
							>
								{isEditing ? 'Cancel' : 'Edit Profile'}
							</button>
						</div>
					</div>

					{/* Profile Details */}
					<div className="bg-white rounded-lg shadow-lg p-6">
						<h3 className="text-xl font-bold mb-6 text-gray-800">Personal Information</h3>
						
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							{/* Email */}
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Email Address
								</label>
								{isEditing ? (
									<input
										type="email"
										name="email"
										value={profileData.email}
										onChange={handleInputChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
								) : (
									<p className="px-4 py-2 bg-gray-50 rounded-lg">{profileData.email}</p>
								)}
							</div>

							{/* Phone */}
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Phone Number
								</label>
								{isEditing ? (
									<input
										type="tel"
										name="phone"
										value={profileData.phone}
										onChange={handleInputChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
								) : (
									<p className="px-4 py-2 bg-gray-50 rounded-lg">{profileData.phone}</p>
								)}
							</div>

							{/* Room Number */}
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Room Number
								</label>
								{isEditing ? (
									<input
										type="text"
										name="roomNumber"
										value={profileData.roomNumber}
										onChange={handleInputChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
								) : (
									<p className="px-4 py-2 bg-gray-50 rounded-lg">{profileData.roomNumber}</p>
								)}
							</div>

							{/* Batch */}
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Batch
								</label>
								{isEditing ? (
									<input
										type="text"
										name="batch"
										value={profileData.batch}
										onChange={handleInputChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
								) : (
									<p className="px-4 py-2 bg-gray-50 rounded-lg">{profileData.batch}</p>
								)}
							</div>

							{/* Blood Group */}
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Blood Group
								</label>
								{isEditing ? (
									<input
										type="text"
										name="bloodGroup"
										value={profileData.bloodGroup}
										onChange={handleInputChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
								) : (
									<p className="px-4 py-2 bg-gray-50 rounded-lg">{profileData.bloodGroup}</p>
								)}
							</div>

							{/* Emergency Contact */}
							<div>
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Emergency Contact
								</label>
								{isEditing ? (
									<input
										type="tel"
										name="emergencyContact"
										value={profileData.emergencyContact}
										onChange={handleInputChange}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
								) : (
									<p className="px-4 py-2 bg-gray-50 rounded-lg">{profileData.emergencyContact}</p>
								)}
							</div>

							{/* Address */}
							<div className="md:col-span-2">
								<label className="block text-sm font-semibold text-gray-700 mb-2">
									Permanent Address
								</label>
								{isEditing ? (
									<textarea
										name="address"
										value={profileData.address}
										onChange={handleInputChange}
										rows={3}
										className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
									/>
								) : (
									<p className="px-4 py-2 bg-gray-50 rounded-lg">{profileData.address}</p>
								)}
							</div>
						</div>

						{isEditing && (
							<div className="mt-6 flex justify-end gap-4">
								<button
									onClick={() => setIsEditing(false)}
									className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
								>
									Cancel
								</button>
								<button
									onClick={handleSave}
									className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
								>
									Save Changes
								</button>
							</div>
						)}
					</div>
				</div>
			</main>
		</div>
	);
}
