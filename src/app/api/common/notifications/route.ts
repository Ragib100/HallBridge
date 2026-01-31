import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Notification from "@/models/Notification";
import { markAsRead, markAllAsRead, getNotifications } from "@/lib/notifications";

// GET - Fetch notifications for the authenticated user
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    // Auth check
    const cookieStore = await cookies();
    const session = cookieStore.get("hb_session")?.value;
    if (!session) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const user = await User.findById(session);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = parseInt(searchParams.get("skip") || "0");
    const unreadOnly = searchParams.get("unreadOnly") === "true";

    const result = await getNotifications(user._id.toString(), {
      limit,
      skip,
      unreadOnly,
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching notifications:", error);
    return NextResponse.json(
      { message: "Failed to fetch notifications" },
      { status: 500 }
    );
  }
}

// PATCH - Mark notification(s) as read
export async function PATCH(request: NextRequest) {
  try {
    await dbConnect();

    // Auth check
    const cookieStore = await cookies();
    const session = cookieStore.get("hb_session")?.value;
    if (!session) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const user = await User.findById(session);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const { notificationId, markAll } = body;

    if (markAll) {
      // Mark all notifications as read
      const result = await markAllAsRead(user._id.toString());
      return NextResponse.json({ 
        message: "All notifications marked as read",
        modifiedCount: result.modifiedCount,
      });
    }

    if (!notificationId) {
      return NextResponse.json(
        { message: "Notification ID required" },
        { status: 400 }
      );
    }

    // Mark single notification as read
    const notification = await markAsRead(notificationId, user._id.toString());
    
    if (!notification) {
      return NextResponse.json(
        { message: "Notification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ 
      message: "Notification marked as read",
      notification,
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return NextResponse.json(
      { message: "Failed to update notification" },
      { status: 500 }
    );
  }
}

// DELETE - Delete a notification
export async function DELETE(request: NextRequest) {
  try {
    await dbConnect();

    // Auth check
    const cookieStore = await cookies();
    const session = cookieStore.get("hb_session")?.value;
    if (!session) {
      return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
    }

    const user = await User.findById(session);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const searchParams = request.nextUrl.searchParams;
    const notificationId = searchParams.get("id");

    if (!notificationId) {
      return NextResponse.json(
        { message: "Notification ID required" },
        { status: 400 }
      );
    }

    // Delete notification (only if it belongs to the user)
    const result = await Notification.deleteOne({
      _id: notificationId,
      userId: user._id,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { message: "Notification not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Notification deleted" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return NextResponse.json(
      { message: "Failed to delete notification" },
      { status: 500 }
    );
  }
}
