// =====================
// User Types
// =====================
export type UserRole = "student" | "staff" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  roomNumber?: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

// =====================
// Meal Types
// =====================
export type MealType = "breakfast" | "lunch" | "dinner";

export interface MealSelection {
  id: string;
  userId: string;
  date: string;
  breakfast: boolean;
  lunch: boolean;
  dinner: boolean;
}

export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  mealType: MealType;
  dayOfWeek: number; // 0-6 (Sunday-Saturday)
}

export interface WeeklyMenu {
  id: string;
  weekStartDate: string;
  items: MenuItem[];
  createdBy: string;
  createdAt: Date;
}

// =====================
// Gate Pass Types
// =====================
export type GatePassStatus = "pending" | "approved" | "rejected" | "completed";
export type GatePassPurpose = "home" | "medical" | "personal" | "family" | "academic" | "other";

export interface GatePass {
  id: string;
  userId: string;
  purpose: GatePassPurpose;
  destination: string;
  outDate: string;
  outTime: string;
  returnDate: string;
  returnTime: string;
  status: GatePassStatus;
  contactNumber: string;
  emergencyContact?: string;
  createdAt: Date;
  updatedAt: Date;
}

// =====================
// Maintenance Types
// =====================
export type MaintenanceCategory = 
  | "electrical"
  | "plumbing"
  | "furniture"
  | "ac-heating"
  | "doors-windows"
  | "internet"
  | "other";

export type MaintenancePriority = "low" | "medium" | "high" | "urgent";
export type MaintenanceStatus = "pending" | "in-progress" | "completed" | "cancelled";

export interface MaintenanceRequest {
  id: string;
  userId: string;
  category: MaintenanceCategory;
  priority: MaintenancePriority;
  location: string;
  description: string;
  status: MaintenanceStatus;
  images?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// =====================
// Laundry Types
// =====================
export type LaundryServiceType = "regular" | "express" | "dry-clean";
export type LaundryStatus = "scheduled" | "picked-up" | "washing" | "ready" | "delivered";

export interface LaundryRequest {
  id: string;
  userId: string;
  serviceType: LaundryServiceType;
  pickupDate: string;
  pickupTime: string;
  itemCount: number;
  specialInstructions?: string;
  status: LaundryStatus;
  totalCost?: number;
  createdAt: Date;
  updatedAt: Date;
}

// =====================
// Billing Types
// =====================
export interface BillItem {
  id: string;
  description: string;
  amount: number;
  date: string;
}

export interface Bill {
  id: string;
  userId: string;
  month: string;
  year: number;
  messCharges: number;
  hostelRent: number;
  laundryCharges: number;
  otherCharges: number;
  totalAmount: number;
  isPaid: boolean;
  paidAt?: Date;
  dueDate: string;
  items: BillItem[];
}

// =====================
// Navigation Types
// =====================
export interface NavItem {
  name: string;
  path: string;
  icon?: React.ReactNode;
  badge?: number;
  subtitle?: string;
  active?: boolean;
}
