import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import MaintenanceRequest from "@/models/MaintenanceRequest";
import User from "@/models/User";

export async function POST(request: Request) {
    try {
        await connectDB();

        // Auth check
        const cookieStore = await cookies();
        const session = cookieStore.get("hb_session")?.value;
        if (!session) {
            return NextResponse.json(
                { message: "Not authenticated" },
                { status: 401 }
            );
        }

        const user = await User.findById(session);
        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        if (user.userType !== "student") {
            return NextResponse.json(
                { message: "Only students can submit maintenance requests" },
                { status: 403 }
            );
        }

        // Maintenance request ID should be passed as a query parameter
        const url = new URL(request.url);
        const requestId = url.searchParams.get("requestId");
        if (!requestId) {
            return NextResponse.json(
                { message: "Maintenance request ID is required" },
                { status: 400 }
            );
        }

        const { rating, feedback } = await request.json();
        console.log("Received rating:", rating, "and feedback:", feedback);

        if (typeof rating !== "number" || rating < 1 || rating > 5) {
            return NextResponse.json(
                { message: "Invalid rating value" },
                { status: 400 }
            );
        }

        const maintenanceRequest = await MaintenanceRequest.findOneAndUpdate(
            { _id: requestId, student: user._id },
            { rating, feedback, reviewed: true },
            { new: true }
        )

        if(!maintenanceRequest) {
            return NextResponse.json(
                { message: "Maintenance request not found or you do not have permission to review this request" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            { message: "Review submitted successfully" },
            { status: 200 }
        );
    }
    catch (error) {
        return NextResponse.json(
            { message: "An error occurred while submitting the maintenance request review" },
            { status: 500 }
        );
    }
}