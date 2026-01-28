'use client'

import { getIcon } from "@/components/common/icons";
import TomorrowMeals from "@/components/student/tomorrow_meals";
import Link from "next/link";
import { useState, useEffect } from "react";

interface UserInfo {
	fullName: string;
	roomAllocation?: {
		floor: number;
		roomNumber: string;
		bedNumber: number;
		hallId?: string;
	};
}

export default function HomePage() {
	const [timeUntilMidnight, setTimeUntilMidnight] = useState({ hours: 0, minutes: 0, seconds: 0 });
	const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const calculateTimeUntilMidnight = () => {
			const now = new Date();
			const midnight = new Date();
			midnight.setHours(24, 0, 0, 0);
			
			const diff = midnight.getTime() - now.getTime();
			
			const hours = Math.floor(diff / (1000 * 60 * 60));
			const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
			const seconds = Math.floor((diff % (1000 * 60)) / 1000);
			
			setTimeUntilMidnight({ hours, minutes, seconds });
		};

		calculateTimeUntilMidnight();
		const interval = setInterval(calculateTimeUntilMidnight, 1000);

		return () => clearInterval(interval);
	}, []);

	// Fetch user info including room allocation
	useEffect(() => {
		const fetchUserInfo = async () => {
			try {
				const res = await fetch("/api/auth/me");
				const data = await res.json();
				if (res.ok && data.user) {
					setUserInfo({
						fullName: data.user.fullName,
						roomAllocation: data.user.roomAllocation,
					});
				}
			} catch (error) {
				console.error("Failed to fetch user info:", error);
			} finally {
				setLoading(false);
			}
		};
		fetchUserInfo();
	}, []);

	return (
		<div className="bg-[#f3f4f6] flex flex-col w-full min-h-screen px-4 md:px-8 py-4 overflow-x-hidden">
			<main className="w-full flex-1 overflow-x-hidden">
				<div className="flex w-full h-16 items-center px-4 font-bold text-lg">
					{getIcon('wave')} Welcome back{userInfo?.fullName ? `, ${userInfo.fullName.split(' ')[0]}` : ''}
				</div>

				<div className="px-4 md:px-6 py-4 mx-2 md:mx-8 my-4 bg-indigo-600 rounded-lg shadow-lg">
					<div className="flex flex-col md:flex-row items-center justify-between text-white gap-4">
						<div className="flex items-center gap-2">
							<span className="text-2xl">{getIcon('time')}</span>
							<span className="font-semibold text-base md:text-lg">Time Until Midnight</span>
						</div>
						<div className="flex gap-2 md:gap-3 items-center">
							<div className="flex flex-col items-center bg-white/20 rounded-lg px-3 md:px-4 py-2 min-w-15 md:min-w-17">
								<span className="text-2xl md:text-3xl font-bold">{String(timeUntilMidnight.hours).padStart(2, '0')}</span>
								<span className="text-xs font-medium opacity-90">Hours</span>
							</div>
							<span className="text-xl md:text-2xl font-bold">:</span>
							<div className="flex flex-col items-center bg-white/20 rounded-lg px-3 md:px-4 py-2 min-w-15 md:min-w-17">
								<span className="text-2xl md:text-3xl font-bold">{String(timeUntilMidnight.minutes).padStart(2, '0')}</span>
								<span className="text-xs font-medium opacity-90">Minutes</span>
							</div>
							<span className="text-xl md:text-2xl font-bold">:</span>
							<div className="flex flex-col items-center bg-white/20 rounded-lg px-3 md:px-4 py-2 min-w-15 md:min-w-17">
								<span className="text-2xl md:text-3xl font-bold">{String(timeUntilMidnight.seconds).padStart(2, '0')}</span>
								<span className="text-xs font-medium opacity-90">Seconds</span>
							</div>
						</div>
					</div>
				</div>

				{/* Room Info & Status Row */}
				<div className="flex flex-col md:flex-row m-2 md:m-5 px-2 md:px-4 py-4 md:py-8 rounded-lg justify-between gap-4">
					{/* Room Allocation Card */}
					<div className="px-4 py-6 md:py-8 bg-white rounded-lg w-full md:w-[50%] shadow-lg">
						<div className="font-bold text-lg pb-4 flex items-center gap-2">
							<svg className="w-5 h-5 text-[#2D6A4F]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
							</svg>
							My Room
						</div>

						{loading ? (
							<div className="animate-pulse">
								<div className="h-8 bg-gray-200 rounded w-24 mb-2"></div>
								<div className="h-4 bg-gray-200 rounded w-32"></div>
							</div>
						) : userInfo?.roomAllocation ? (
							<div className="space-y-3">
								<div className="flex items-center gap-4">
									<div className="bg-[#2D6A4F] text-white px-4 py-3 rounded-lg">
										<div className="text-xs opacity-80">Room</div>
										<div className="text-2xl font-bold">{userInfo.roomAllocation.roomNumber}</div>
									</div>
									<div className="bg-gray-100 px-4 py-3 rounded-lg">
										<div className="text-xs text-gray-500">Floor</div>
										<div className="text-2xl font-bold text-gray-800">{userInfo.roomAllocation.floor}</div>
									</div>
									<div className="bg-gray-100 px-4 py-3 rounded-lg">
										<div className="text-xs text-gray-500">Bed</div>
										<div className="text-2xl font-bold text-gray-800">{userInfo.roomAllocation.bedNumber}</div>
									</div>
								</div>
								{userInfo.roomAllocation.hallId && (
									<div className="text-sm text-gray-600">
										Hall ID: <span className="font-medium text-[#2D6A4F]">{userInfo.roomAllocation.hallId}</span>
									</div>
								)}
							</div>
						) : (
							<div className="text-gray-500 text-sm">
								No room allocated yet. Please contact administration.
							</div>
						)}
					</div>

					{/* Current Status Card */}
					<div className="px-4 py-6 md:py-8 bg-white rounded-lg w-full md:w-[50%] shadow-lg">
						<div className="font-bold text-lg pb-4">
							{getIcon('pin')} Current Status
						</div>

						<div className="bg-green-200 w-fit rounded-2xl mt-2 px-3 py-1.5 text-green-800 font-medium flex items-center gap-2">
							{getIcon('dotGreen')} Inside Hall
						</div>
					</div>
				</div>

				{/* Bill Card */}
				<div className="mx-2 md:mx-5 px-2 md:px-4">
					<div className="px-4 py-6 md:py-8 bg-white rounded-lg w-full shadow-lg">
						<div className="font-bold text-lg pb-4">
							{getIcon('bills')} Current Bill
						</div>

						<div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
							<div className="font-bold text-3xl">{getIcon('taka')} 410</div>
						
							<Link
								href="/dashboard/student/billing/current_dues"
								className="flex w-full md:w-auto px-6 h-10 rounded-lg border border-blue-700 text-blue-700 font-bold justify-center items-center hover:bg-blue-700 hover:text-white transition-colors cursor-pointer"
							>
								View Details
							</Link>
						</div>
					</div>
				</div>

				<div className="px-2 md:px-4 mt-4">
					<TomorrowMeals />
				</div>
			</main>
		</div>
  	);
}