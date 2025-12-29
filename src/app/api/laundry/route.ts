import { NextResponse } from "next/server";

// GET /api/laundry - Get laundry requests
export async function GET() {
  // TODO: Implement database query
  return NextResponse.json({
    message: "Laundry API endpoint",
    data: [],
  });
}

// POST /api/laundry - Create a new laundry request
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // TODO: Implement laundry request logic
    return NextResponse.json({
      message: "Laundry request created",
      data: body,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create laundry request" },
      { status: 500 }
    );
  }
}
