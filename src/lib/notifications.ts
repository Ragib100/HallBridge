import Notification, { NotificationType, NotificationPriority } from "@/models/Notification";
import User from "@/models/User";
import { Types } from "mongoose";

interface CreateNotificationParams {
  userId: Types.ObjectId | string;
  type: NotificationType;
  title: string;
  message: string;
  priority?: NotificationPriority;
  relatedEntity?: {
    type: "maintenance" | "gatepass" | "payment" | "meal" | "laundry";
    id: Types.ObjectId | string;
  };
}

interface BulkNotificationParams {
  userIds: (Types.ObjectId | string)[];
  type: NotificationType;
  title: string;
  message: string;
  priority?: NotificationPriority;
}

interface NotifyByRoleParams {
  roles: string[];
  type: NotificationType;
  title: string;
  message: string;
  priority?: NotificationPriority;
}

/**
 * Create a notification for a single user
 */
export async function createNotification(params: CreateNotificationParams) {
  const { userId, type, title, message, priority = "normal", relatedEntity } = params;

  const notification = await Notification.create({
    userId: new Types.ObjectId(userId.toString()),
    type,
    title,
    message,
    priority,
    relatedEntity: relatedEntity
      ? {
          type: relatedEntity.type,
          id: new Types.ObjectId(relatedEntity.id.toString()),
        }
      : undefined,
  });

  return notification;
}

/**
 * Create notifications for multiple users
 */
export async function createBulkNotifications(params: BulkNotificationParams) {
  const { userIds, type, title, message, priority = "normal" } = params;

  const notifications = userIds.map((userId) => ({
    userId: new Types.ObjectId(userId.toString()),
    type,
    title,
    message,
    priority,
    isRead: false,
  }));

  const result = await Notification.insertMany(notifications);
  return result;
}

/**
 * Create notifications for all users with specific roles
 */
export async function notifyByRole(params: NotifyByRoleParams) {
  const { roles, type, title, message, priority = "normal" } = params;

  // Find all users with the specified roles
  const users = await User.find({ 
    role: { $in: roles },
    status: "active"
  }).select("_id");

  if (users.length === 0) return [];

  const notifications = users.map((user) => ({
    userId: user._id,
    type,
    title,
    message,
    priority,
    isRead: false,
  }));

  const result = await Notification.insertMany(notifications);
  return result;
}

/**
 * Mark a notification as read
 */
export async function markAsRead(notificationId: string, userId: string) {
  const notification = await Notification.findOneAndUpdate(
    { 
      _id: new Types.ObjectId(notificationId), 
      userId: new Types.ObjectId(userId) 
    },
    { 
      isRead: true, 
      readAt: new Date() 
    },
    { new: true }
  );

  return notification;
}

/**
 * Mark all notifications as read for a user
 */
export async function markAllAsRead(userId: string) {
  const result = await Notification.updateMany(
    { 
      userId: new Types.ObjectId(userId), 
      isRead: false 
    },
    { 
      isRead: true, 
      readAt: new Date() 
    }
  );

  return result;
}

/**
 * Get unread notification count for a user
 */
export async function getUnreadCount(userId: string) {
  const count = await Notification.countDocuments({
    userId: new Types.ObjectId(userId),
    isRead: false,
  });

  return count;
}

/**
 * Get notifications for a user with pagination
 */
export async function getNotifications(userId: string, options?: {
  limit?: number;
  skip?: number;
  unreadOnly?: boolean;
}) {
  const { limit = 20, skip = 0, unreadOnly = false } = options || {};

  const query: Record<string, unknown> = { 
    userId: new Types.ObjectId(userId) 
  };
  
  if (unreadOnly) {
    query.isRead = false;
  }

  const notifications = await Notification.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Notification.countDocuments(query);
  const unreadCount = await getUnreadCount(userId);

  return {
    notifications,
    total,
    unreadCount,
  };
}

/**
 * Delete old read notifications (cleanup utility)
 */
export async function deleteOldNotifications(daysOld: number = 30) {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const result = await Notification.deleteMany({
    isRead: true,
    createdAt: { $lt: cutoffDate },
  });

  return result;
}

// ============================================
// NOTIFICATION TRIGGER HELPERS
// ============================================

/**
 * Notify when a maintenance request is created
 */
export async function notifyMaintenanceCreated(
  requestId: string,
  studentName: string,
  roomNumber: string,
  issueType: string
) {
  return notifyByRole({
    roles: ["maintenance_staff", "admin"],
    type: "maintenance",
    title: "New Maintenance Request",
    message: `${studentName} (Room ${roomNumber}) reported a ${issueType} issue.`,
    priority: "normal",
  });
}

/**
 * Notify student when maintenance status is updated
 */
export async function notifyMaintenanceUpdated(
  userId: string,
  requestId: string,
  status: string,
  issueType: string
) {
  const statusMessages: Record<string, string> = {
    in_progress: `Your ${issueType} maintenance request is now being worked on.`,
    completed: `Your ${issueType} maintenance request has been completed.`,
    rejected: `Your ${issueType} maintenance request was rejected. Please contact admin for details.`,
  };

  return createNotification({
    userId,
    type: "maintenance",
    title: `Maintenance ${status.replace("_", " ").toUpperCase()}`,
    message: statusMessages[status] || `Your maintenance request status changed to ${status}.`,
    priority: status === "completed" ? "normal" : "high",
    relatedEntity: {
      type: "maintenance",
      id: requestId,
    },
  });
}

/**
 * Notify when gate pass is approved/rejected
 */
export async function notifyGatePassUpdated(
  userId: string,
  gatePassId: string,
  status: "approved" | "rejected",
  reason?: string
) {
  return createNotification({
    userId,
    type: "gatepass",
    title: `Gate Pass ${status.charAt(0).toUpperCase() + status.slice(1)}`,
    message: status === "approved"
      ? "Your gate pass has been approved. You may proceed."
      : `Your gate pass was rejected.${reason ? ` Reason: ${reason}` : ""}`,
    priority: "high",
    relatedEntity: {
      type: "gatepass",
      id: gatePassId,
    },
  });
}

/**
 * Notify when payment is made
 */
export async function notifyPaymentReceived(
  userId: string,
  paymentId: string,
  amount: number,
  paymentType: string
) {
  return createNotification({
    userId,
    type: "payment",
    title: "Payment Confirmed",
    message: `Your payment of ৳${amount.toLocaleString()} for ${paymentType.replace("_", " ")} has been received.`,
    priority: "normal",
    relatedEntity: {
      type: "payment",
      id: paymentId,
    },
  });
}

/**
 * Notify about payment due
 */
export async function notifyPaymentDue(
  userId: string,
  amount: number,
  dueDate: string
) {
  return createNotification({
    userId,
    type: "payment",
    title: "Payment Reminder",
    message: `You have a pending payment of ৳${amount.toLocaleString()} due on ${dueDate}. Please pay to avoid late fees.`,
    priority: "high",
  });
}

/**
 * Notify about laundry status
 */
export async function notifyLaundryReady(
  userId: string,
  laundryId: string,
  itemCount: number
) {
  return createNotification({
    userId,
    type: "laundry",
    title: "Laundry Ready for Pickup",
    message: `Your laundry (${itemCount} items) is ready for pickup.`,
    priority: "normal",
    relatedEntity: {
      type: "laundry",
      id: laundryId,
    },
  });
}

/**
 * Notify about account approval
 */
export async function notifyAccountApproved(
  userId: string,
  roomNumber?: string
) {
  return createNotification({
    userId,
    type: "system",
    title: "Account Approved! 🎉",
    message: roomNumber
      ? `Your account has been approved. You've been assigned to Room ${roomNumber}.`
      : "Your account has been approved. Welcome to HallBridge!",
    priority: "high",
  });
}

/**
 * Notify about account rejection
 */
export async function notifyAccountRejected(
  userId: string,
  reason?: string
) {
  return createNotification({
    userId,
    type: "system",
    title: "Account Not Approved",
    message: reason || "Your account registration was not approved. Please contact the administration.",
    priority: "high",
  });
}

/**
 * Broadcast system notice to all active users
 */
export async function broadcastNotice(
  title: string,
  message: string,
  priority: NotificationPriority = "normal"
) {
  const users = await User.find({ status: "active" }).select("_id");
  
  if (users.length === 0) return [];

  const notifications = users.map((user) => ({
    userId: user._id,
    type: "notice" as NotificationType,
    title,
    message,
    priority,
    isRead: false,
  }));

  return Notification.insertMany(notifications);
}
