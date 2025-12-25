import { getIcon } from "@/components/common/icons";
import TomorrowMeals from "@/components/student/tomorrow_meals";
import Link from "next/link";


export default function HomePage() {
	return (
		<div className="flex-l flex-col w-400 h-screen">
			<header className="flex w-auto h-16 items-center px-4 font-bold text-lg shadow-[0_1px_2px_rgba(0,0,0,0.5)]">Dashboard</header>
			<main className="bg-[#f3f4f6] w-full h-full">
				<div className="flex w-full h-16 items-center px-4 font-bold text-lg">
					{getIcon('wave')} Welcome back
				</div>

				<div className="flex bg-white m-5 flex-col px-4 py-8 rounded-lg shadow-md justify-between">
					<div className="font-bold text-lg">
						{getIcon('pin')} Current Status
					</div>

					<div className="flex bg-green-200 w-30 items-center rounded-2xl mt-2 px-2 py-1 text-green-800 font-medium">
						{getIcon('dotGreen')}Inside Hall
					</div>
				</div>

				<TomorrowMeals />

				<div className="flex bg-white m-5 flex-col px-4 py-8 rounded-lg shadow-md justify-between">
					<div className="font-bold text-lg">
						{getIcon('bills')} Current Bill
					</div>

					<div className="flex flex-row ml-10 justify-between">
						<div className="flex font-bold text-3xl justify-center">{getIcon('taka')} 410</div>
					
						<Link
							href="/dashboard/student/billing"
							className="flex w-100 h-10 rounded-lg border border-blue-700 text-blue-700 font-bold justify-center items-center hover:bg-blue-700 hover:text-white transition-colors cursor-pointer"
						>
							View Details
						</Link>
					</div>
				</div>
			</main>
		</div>
  	);
}