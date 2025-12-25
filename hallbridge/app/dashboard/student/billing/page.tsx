import Link from "next/dist/client/link";
import { getIcon } from "@/components/common/icons";

export default function HomePage() {
	return (
		<div className="flex-l flex-col">
			<header className="flex w-auto h-16 items-center px-4 font-bold text-lg shadow-[0_1px_2px_rgba(0,0,0,0.5)]">My Bill</header>
			<main className="bg-[#f3f4f6] w-full h-full">
				<div className="bg-white mx-8 my-4 p-8 shadow-[0px_1px_2px_0_rgba(0,0,0,0.3)] rounded-2xl">
					<div className="font-bold text-xl">
						{getIcon('calendar')} December 2025
					</div>
					<div className="flex flex-col items-center">
						<div className="font-bold text-2xl">
							{getIcon('taka')} 410.00
						</div>
						<div className="flex bg-red-200 text-red-600 w-40 h-8 items-center justify-center rounded-2xl">
							Status: {getIcon('dotRed')} Unpaid
						</div>
						<div className="flex font-extralight w-40 h-8 items-center justify-center">
							Due: Dec 31, 2025
						</div>
					</div>
				</div>

				<div className="mx-8 my-4 text-2xl"> {getIcon('file')} Breakdown </div>

				<div className="mx-8 px-4">
					<div className="flex flex-row items-center justify-between py-3 px-4 my-4 bg-white rounded-lg shadow-[0px_1px_2px_0_rgba(0,0,0,0.1)] ">
						<div className="text-xl"> {getIcon('home')} Room Rent </div>
						<div className="font-bold"> {getIcon('taka')} 200.00 </div>
					</div>

					<div className="flex flex-row items-center justify-between py-3 px-4 my-4 bg-white rounded-lg shadow-[0px_1px_2px_0_rgba(0,0,0,0.1)] ">
						<div className="text-xl"> {getIcon('meals')} Meals </div>
						<div className="font-bold"> {getIcon('taka')} 150.00 </div>
					</div>

					<div className="flex flex-row items-center justify-between py-3 px-4 my-4 bg-white rounded-lg shadow-[0px_1px_2px_0_rgba(0,0,0,0.1)] ">
						<div className="text-xl"> {getIcon('laundry')} Laundry </div>
						<div className="font-bold"> {getIcon('taka')} 60.00 </div>
					</div>

					<Link href="" className="flex bg-blue-500 text-white w-full h-10 items-center justify-center rounded-lg hover:bg-blue-600 mt-8">
						Pay Now {getIcon('taka')} 410.00
					</Link>
				</div>

			</main>
		</div>
	);
}