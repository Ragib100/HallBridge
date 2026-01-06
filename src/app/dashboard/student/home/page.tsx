'use client'

import { getIcon } from "@/components/common/icons";
import TomorrowMeals from "@/components/student/tomorrow_meals";
import Link from "next/link";
import { useState, useEffect } from "react";


export default function HomePage() {
	const [timeUntilMidnight, setTimeUntilMidnight] = useState({ hours: 0, minutes: 0, seconds: 0 });

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

	return (
		<div className="bg-[#f3f4f6] flex flex-col w-full min-h-screen px-4 md:px-8 py-4 overflow-x-hidden">
			<main className="w-full flex-1 overflow-x-hidden">
				<div className="flex w-full h-16 items-center px-4 font-bold text-lg">
					{getIcon('wave')} Welcome back
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

				<div className="flex flex-col md:flex-row m-2 md:m-5 px-2 md:px-4 py-4 md:py-8 rounded-lg justify-between gap-4">
					<div className="px-4 py-6 md:py-8 bg-white rounded-lg w-full md:w-[50%] shadow-lg">
						<div className="font-bold text-lg pb-4">
							{getIcon('pin')} Current Status
						</div>

						<div className="bg-green-200 w-fit rounded-2xl mt-2 px-2 py-1 text-green-800 font-medium">
							{getIcon('dotGreen')} Inside Hall
						</div>
					</div>

					<div className="px-4 py-6 md:py-8 bg-white rounded-lg w-full md:w-[50%] shadow-lg md:text-right">
						<div className="font-bold text-lg pb-4">
							{getIcon('bills')} Current Bill
						</div>

						<div className="flex flex-col gap-4">
							<div className="font-bold text-3xl">{getIcon('taka')} 410</div>
						
							<Link
								href="/dashboard/student/billing/current_dues"
								className="flex w-full h-10 rounded-lg border border-blue-700 text-blue-700 font-bold justify-center items-center hover:bg-blue-700 hover:text-white transition-colors cursor-pointer"
							>
								View Details
							</Link>
						</div>
					</div>
				</div>

				<div className="px-2 md:px-4">
					<TomorrowMeals />
				</div>
			</main>
		</div>
  	);
}