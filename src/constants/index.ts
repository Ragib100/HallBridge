// Application Constants

export const APP_NAME = "HallBridge";
export const APP_DESCRIPTION = "Digital Hall Management System";

// Meal cutoff time (11 PM)
export const MEAL_CUTOFF_HOUR = 23;
export const MEAL_CUTOFF_MINUTE = 0;

// Meal rates (in Taka)
export const MEAL_RATES = {
  breakfast: 50,
  lunch: 80,
  dinner: 70,
  daily: 200,
} as const;

// Laundry rates (in Taka)
export const LAUNDRY_RATES = {
  regular: 2, // per kg
  express: 3, // per kg
  dryClean: 5, // per item
} as const;

// Gate pass purposes
export const GATE_PASS_PURPOSES = [
  { value: "home", label: "Going Home" },
  { value: "medical", label: "Medical Emergency" },
  { value: "personal", label: "Personal Work" },
  { value: "family", label: "Family Event" },
  { value: "academic", label: "Academic" },
  { value: "other", label: "Other" },
] as const;

// Maintenance categories
export const MAINTENANCE_CATEGORIES = [
  { value: "electrical", label: "Electrical" },
  { value: "plumbing", label: "Plumbing" },
  { value: "furniture", label: "Furniture" },
  { value: "ac-heating", label: "AC/Heating" },
  { value: "doors-windows", label: "Doors & Windows" },
  { value: "internet", label: "Internet/Wi-Fi" },
  { value: "other", label: "Other" },
] as const;

// Priority levels
export const PRIORITY_LEVELS = [
  { value: "low", label: "Low", color: "green" },
  { value: "medium", label: "Medium", color: "yellow" },
  { value: "high", label: "High", color: "orange" },
  { value: "urgent", label: "Urgent", color: "red" },
] as const;

// Status colors
export const STATUS_COLORS = {
  pending: "yellow",
  approved: "green",
  rejected: "red",
  completed: "blue",
  "in-progress": "orange",
  cancelled: "gray",
} as const;

// Routes
export const ROUTES = {
  home: "/",
  login: "/auth/login",
  register: "/auth/register",
  student: {
    dashboard: "/dashboard/student",
    meals: "/dashboard/student/meals",
    billing: "/dashboard/student/billing",
    gatePass: "/dashboard/student/gate-pass",
    maintenance: "/dashboard/student/maintenance",
    laundry: "/dashboard/student/laundry",
  },
  staff: {
    dashboard: "/dashboard/staff",
    mess: "/dashboard/staff/mess",
    maintenance: "/dashboard/staff/maintenance",
    laundry: "/dashboard/staff/laundry",
    expenses: "/dashboard/staff/expenses",
  },
  admin: {
    dashboard: "/dashboard/admin",
    students: "/dashboard/admin/students",
    staff: "/dashboard/admin/staff",
    reports: "/dashboard/admin/reports",
    settings: "/dashboard/admin/settings",
  },
} as const;
