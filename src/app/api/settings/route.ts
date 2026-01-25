import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import SystemSettings from "@/models/SystemSettings";

// GET: returns key/value map of all settings
export async function GET() {
  try {
    await connectDB();
    const docs = await SystemSettings.find().lean();
    const map = docs.reduce((acc: Record<string, any>, item) => {
      acc[item.key] = item.value;
      return acc;
    }, {} as Record<string, any>);
    return NextResponse.json(map);
  } catch (err) {
    console.error("GET /api/settings error", err);
    return NextResponse.json({ error: "Failed to load settings" }, { status: 500 });
  }
}

// PATCH: batch upsert settings [{key,value}]
export async function PATCH(req: NextRequest) {
  try {
    await connectDB();
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
