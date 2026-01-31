import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import connectDB from "@/lib/db";
import SystemSettings from "@/models/SystemSettings";
import User from "@/models/User";

// GET: returns key/value map of all settings (authenticated users only)
export async function GET() {
  try {
    await connectDB();

    // Auth check - any authenticated user can read settings
    const cookieStore = await cookies();
    const session = cookieStore.get("hb_session")?.value;
    if (!session) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const user = await User.findById(session);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const docs = await SystemSettings.find().lean();
    const map = docs.reduce((acc: Record<string, unknown>, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {} as Record<string, unknown>);
    return NextResponse.json(map);
  } catch (err) {
    console.error("GET /api/settings error", err);
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}

// PATCH: batch upsert settings [{key,value}] - Admin only
export async function PATCH(req: NextRequest) {
  try {
    await connectDB();

    // Auth check - Admin only
    const cookieStore = await cookies();
    const session = cookieStore.get("hb_session")?.value;
    if (!session) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const user = await User.findById(session);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    if (user.role !== "admin") {
      return NextResponse.json({ message: "Admin access required" }, { status: 403 });
    }

    const body = await req.json();
    if (!Array.isArray(body) || body.length === 0) {
      return NextResponse.json({ error: "Expected non-empty array" }, { status: 400 });
    }

    const ops = body.map((item) => {
      const { key, value } = item || {};
      if (!key || value === undefined) {
        throw new Error("Invalid item: missing key or value");
      }
      return {
        updateOne: {
          filter: { key },
          update: {
            $set: { value },
            $setOnInsert: { category: "operations" },
          },
          upsert: true,
        },
      };
    });

    await SystemSettings.bulkWrite(ops);
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/settings error", err);
    return NextResponse.json({ error: "Failed to save settings" }, { status: 500 });
  }
}
