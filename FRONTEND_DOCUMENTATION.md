# HallBridge Frontend Documentation

A comprehensive documentation of all frontend pages and components in the HallBridge hall/dormitory management system.

---

## Table of Contents

1. [Overview](#overview)
2. [User Roles](#user-roles)
3. [Public Pages](#public-pages)
4. [Authentication Pages](#authentication-pages)
5. [Admin Dashboard](#admin-dashboard)
6. [Staff Dashboard](#staff-dashboard)
7. [Student Dashboard](#student-dashboard)
8. [Reusable Components](#reusable-components)

---

## Overview

**HallBridge** is a Next.js-based hall/dormitory management system with role-based access control. The application uses the App Router architecture and features a modern UI with Tailwind CSS styling (primary color: `#2D6A4F`).

### Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **UI Components**: Custom shadcn/ui-style components
- **Authentication**: Session-based with cookies, Google OAuth support
- **State Management**: React hooks (`useState`, `useEffect`, custom hooks)

---

## User Roles

| Role | Sub-Roles | Description |
|------|-----------|-------------|
| **Admin** | - | Full system access, manages users, rooms, finances, and settings |
| **Staff** | `mess_manager`, `financial_staff`, `maintenance_staff`, `laundry_manager`, `security_guard` | Role-specific access to staff features |
| **Student** | - | Access to personal dashboard, meals, billing, maintenance, laundry, gate-pass |

---

## Public Pages

### Landing Page
| Property | Value |
|----------|-------|
| **Route** | `/` |
| **File** | `src/app/page.tsx` |
| **Access** | Public |
| **Purpose** | Marketing landing page with hero section and feature showcase |

**Key Features:**
- Hero section with HallBridge branding and tagline
- Login/Register call-to-action buttons
- Feature cards highlighting system capabilities (Mess, Maintenance, etc.)
- Responsive design with gradient backgrounds

---

## Authentication Pages

### Login
| Property | Value |
|----------|-------|
| **Route** | `/auth/login` |
| **File** | `src/app/auth/login/page.tsx` |
| **Access** | Public (unauthenticated users) |
| **Purpose** | User authentication with email/password and Google OAuth |

**Key Features:**
- Email and password input fields
- Google OAuth sign-in option
- "Remember me" checkbox
- Forgot password link
- Role-based redirect after login:
  - Admin → `/dashboard/admin`
  - Staff → `/dashboard/staff`
  - Student → `/dashboard/student`
- First-time login detection for password change requirement

---

### Register
| Property | Value |
|----------|-------|
| **Route** | `/auth/register` |
| **File** | `src/app/auth/register/page.tsx` |
| **Access** | Public |
| **Purpose** | Student hall seat request registration (pending admin approval) |

**Key Features:**
- Full name, student ID, email, phone inputs
- Department and year selection dropdowns
- Blood group and emergency contact fields
- Address input for communication
- Submits registration request for admin approval
- Success confirmation with pending status message

---

### Forgot Password
| Property | Value |
|----------|-------|
| **Route** | `/auth/forgot-password` |
| **File** | `src/app/auth/forgot-password/page.tsx` |
| **Access** | Public |
| **Purpose** | 3-step OTP-based password recovery |

**Key Features:**
- **Step 1**: Email input to receive OTP
- **Step 2**: 6-digit OTP verification with countdown timer (120 seconds)
- **Step 3**: New password creation with confirmation
- Real-time password strength indicator
- Password match validation

---

### Change Password
| Property | Value |
|----------|-------|
| **Route** | `/auth/change-password` |
| **File** | `src/app/auth/change-password/page.tsx` |
| **Access** | Authenticated (first-time login) |
| **Purpose** | Force password change from Student ID to custom password |

**Key Features:**
- Applies to students whose initial password is their Student ID
- Current password verification
- New password with strength requirements
- Password confirmation validation
- Redirects to dashboard after successful change

---

## Admin Dashboard

### Admin Layout
| Property | Value |
|----------|-------|
| **Route** | `/dashboard/admin/*` |
| **File** | `src/app/dashboard/admin/layout.tsx` |
| **Access** | Admin only |
| **Purpose** | Sidebar navigation layout for admin pages |

**Navigation Items:**
- Overview, User Management, Room Management, Maintenance, Financials, Settings, Profile

---

### Overview
| Property | Value |
|----------|-------|
| **Route** | `/dashboard/admin` |
| **File** | `src/app/dashboard/admin/page.tsx` |
| **Access** | Admin |
| **Purpose** | Admin dashboard home with system statistics and quick actions |

**Key Features:**
- Welcome banner with admin greeting
- Stats cards showing:
  - Total active students
  - Total staff members
  - Pending maintenance requests
  - Urgent issues count
- Quick action buttons for common tasks
- Recent activity feed

---

### User Management
| Property | Value |
|----------|-------|
| **Route** | `/dashboard/admin/users` |
| **File** | `src/app/dashboard/admin/users/page.tsx` |
| **Access** | Admin |
| **Purpose** | Manage students, pending registrations, and staff accounts |

**Key Features:**
- **Tabs**:
  - Active Students: View, search, and manage current students
  - Pending Registrations: Approve/reject new registrations with room allocation
  - Staff Accounts: Manage staff members and assign roles
- Room allocation during student approval
- Staff role assignment dropdown
- User status toggle (active/inactive)
- Delete user confirmation dialog

---

### Room Management
| Property | Value |
|----------|-------|
| **Route** | `/dashboard/admin/rooms` |
| **File** | `src/app/dashboard/admin/rooms/page.tsx` |
| **Access** | Admin |
| **Purpose** | Visual room and bed management across 8 floors |

**Key Features:**
- Grid and list view toggle
- Floor-by-floor navigation (8 floors)
- Room cards showing:
  - Room number
  - Bed occupancy status (4 beds per room)
  - Resident names
- Color-coded bed status (occupied/vacant)
- Room editing dialog for status updates

---

### Maintenance (Admin)
| Property | Value |
|----------|-------|
| **Route** | `/dashboard/admin/maintenance` |
| **File** | `src/app/dashboard/admin/maintenance/page.tsx` |
| **Access** | Admin |
| **Purpose** | View all maintenance requests with filtering |

**Key Features:**
- Request list with status badges
- Filter by category, status, priority
- View detailed request information
- Assign maintenance staff
- Update request status

---

### Financials
| Property | Value |
|----------|-------|
| **Route** | `/dashboard/admin/financials` |
| **File** | `src/app/dashboard/admin/financials/page.tsx` |
| **Access** | Admin |
| **Purpose** | Complete financial management and reporting |

**Key Features:**
- **Tabs**:
  - Revenue: Monthly revenue tracking with charts
  - Expenses: Expense overview by category
  - Defaulters: Students with overdue payments
  - Salary: Staff salary payment management
- CSV export functionality
- Date range filtering
- Payment confirmation dialogs

---

### Settings
| Property | Value |
|----------|-------|
| **Route** | `/dashboard/admin/settings` |
| **File** | `src/app/dashboard/admin/settings/page.tsx` |
| **Access** | Admin |
| **Purpose** | System configuration and preferences |

**Key Features:**
- **Tabs**:
  - General: Hall name, email, contact info
  - Pricing: Seat rent, meal prices, laundry charges
  - Operations: Meal ordering times, working hours
  - Notifications: Email/SMS notification preferences
- Save button per section
- Reset to defaults option

---

### Profile (Admin)
| Property | Value |
|----------|-------|
| **Route** | `/dashboard/admin/profile` |
| **File** | `src/app/dashboard/admin/profile/page.tsx` |
| **Access** | Admin |
| **Purpose** | Admin profile viewing and editing |

**Key Features:**
- Uses shared `ProfilePage` component
- Edit mode toggle
- Update name, phone number
- Display admin role and join date

---

## Staff Dashboard

### Staff Layout
| Property | Value |
|----------|-------|
| **Route** | `/dashboard/staff/*` |
| **File** | `src/app/dashboard/staff/layout.tsx` |
| **Access** | Staff only |
| **Purpose** | Sidebar navigation with role-based menu items |

**Dynamic Navigation:**
- Shows only menu items relevant to staff member's assigned role
- Uses `StaffRoleGuard` component for access control

---

### Home
| Property | Value |
|----------|-------|
| **Route** | `/dashboard/staff/home` |
| **File** | `src/app/dashboard/staff/home/page.tsx` |
| **Access** | All Staff |
| **Purpose** | Role-specific dashboard with relevant stats and quick actions |

**Key Features:**
- Personalized welcome message
- Role-specific stat cards:
  - Mess Manager: Meal counts, pending votes
  - Financial Staff: Today's collections, pending bills
  - Maintenance Staff: Open requests, urgent tasks
  - Laundry Manager: Pending pickups, in-progress items
  - Security Guard: Expected checkouts, active gate passes
- Quick action buttons based on role

---

### Mess Management (Mess Manager)

#### Mess Layout
| Property | Value |
|----------|-------|
| **Route** | `/dashboard/staff/mess/*` |
| **File** | `src/app/dashboard/staff/mess/layout.tsx` |
| **Access** | `mess_manager` |
| **Purpose** | Tab navigation for mess management features |

---

#### Meal Count
| Property | Value |
|----------|-------|
| **Route** | `/dashboard/staff/mess/meal_count` |
| **File** | `src/app/dashboard/staff/mess/meal_count/page.tsx` |
| **Access** | `mess_manager` |
| **Purpose** | View tomorrow's meal counts by type |

**Key Features:**
- Breakfast, lunch, dinner counts in stat cards
- Total meal count summary
- Date display for reference

---

#### Voting Results
| Property | Value |
|----------|-------|
| **Route** | `/dashboard/staff/mess/voting_result` |
| **File** | `src/app/dashboard/staff/mess/voting_result/page.tsx` |
| **Access** | `mess_manager` |
| **Purpose** | View student meal ratings and feedback |

**Key Features:**
- Average rating per meal type
- Recent feedback list with comments
- Rating distribution chart

---

#### Weekly Menu
| Property | Value |
|----------|-------|
| **Route** | `/dashboard/staff/mess/weekly_menu` |
| **File** | `src/app/dashboard/staff/mess/weekly_menu/page.tsx` |
| **Access** | `mess_manager` |
| **Purpose** | View and edit weekly meal menu |

**Key Features:**
- 7-day menu table (Saturday to Friday)
- Editable menu items for breakfast, lunch, dinner
- Save changes functionality
- Visual day-of-week indicators

---

### Maintenance (Maintenance Staff)
| Property | Value |
|----------|-------|
| **Route** | `/dashboard/staff/maintenance` |
| **File** | `src/app/dashboard/staff/maintenance/page.tsx` |
| **Access** | `maintenance_staff` |
| **Purpose** | View and update assigned maintenance tasks |

**Key Features:**
- Task list with priority indicators
- Status update buttons (pending → in-progress → completed)
- Filter by status
- Request details expansion
- Add completion notes

---

### Laundry Management
| Property | Value |
|----------|-------|
| **Route** | `/dashboard/staff/laundry` |
| **File** | `src/app/dashboard/staff/laundry/page.tsx` |
| **Access** | `laundry_manager` |
| **Purpose** | Manage laundry requests and track progress |

**Key Features:**
- Request table with student info
- Status progression:
  - Pending → Collected → Washing → Ready → Delivered
- Bulk status updates
- Search by student name/room
- Item count display

---

### Expense Management
| Property | Value |
|----------|-------|
| **Route** | `/dashboard/staff/expenses` |
| **File** | `src/app/dashboard/staff/expenses/page.tsx` |
| **Access** | `financial_staff` |
| **Purpose** | Log and track hall expenses |

**Key Features:**
- Add new expense form:
  - Category selection (food, utilities, maintenance, etc.)
  - Amount input
  - Description field
  - Date picker
- Expense list with filtering
- Monthly/daily totals
- Category-wise breakdown

---

### Security Management
| Property | Value |
|----------|-------|
| **Route** | `/dashboard/staff/security` |
| **File** | `src/app/dashboard/staff/security/page.tsx` |
| **Access** | `security_guard` |
| **Purpose** | Gate pass verification and entry/exit logging |

**Key Features:**
- Active gate passes list
- QR code/ID verification input
- Entry/exit time logging
- Student photo display
- Mark return confirmation
- Today's entry/exit log history

---

### Profile (Staff)
| Property | Value |
|----------|-------|
| **Route** | `/dashboard/staff/profile` |
| **File** | `src/app/dashboard/staff/profile/page.tsx` |
| **Access** | All Staff |
| **Purpose** | Staff profile viewing and editing |

**Key Features:**
- Uses shared `ProfilePage` component
- Display staff role badge
- Edit name and phone number

---

## Student Dashboard

### Student Layout
| Property | Value |
|----------|-------|
| **Route** | `/dashboard/student/*` |
| **File** | `src/app/dashboard/student/layout.tsx` |
| **Access** | Student only |
| **Purpose** | Sidebar navigation for student features |

**Navigation Items:**
- Home, Meals, Billing, Gate Pass, Laundry, Maintenance, Profile

---

### Home
| Property | Value |
|----------|-------|
| **Route** | `/dashboard/student/home` |
| **File** | `src/app/dashboard/student/home/page.tsx` |
| **Access** | Student |
| **Purpose** | Student dashboard overview |

**Key Features:**
- Welcome banner with student name
- Room information card (floor, room, bed)
- Tomorrow's meal selection widget (`TomorrowMeals` component)
- Current dues summary with pay button
- Quick action buttons:
  - Request Gate Pass
  - Submit Laundry
  - Report Issue
  - View Invoices

---

### Meals

#### Meals Layout
| Property | Value |
|----------|-------|
| **Route** | `/dashboard/student/meals/*` |
| **File** | `src/app/dashboard/student/meals/layout.tsx` |
| **Access** | Student |
| **Purpose** | Tab navigation for meal-related features |

**Tabs:**
- Meal Selection, Vote for Meals, Weekly Menu

---

#### Meal Selection
| Property | Value |
|----------|-------|
| **Route** | `/dashboard/student/meals/meal_selection` |
| **File** | `src/app/dashboard/student/meals/meal_selection/page.tsx` |
| **Access** | Student |
| **Purpose** | Select tomorrow's meals and register guest meals |

**Key Features:**
- Toggle switches for breakfast, lunch, dinner
- Meal deadlines display
- Guest meal registration form:
  - Guest name, ID, department, phone
  - Meal type selection
- Save changes button with loading state

---

#### Vote for Meals
| Property | Value |
|----------|-------|
| **Route** | `/dashboard/student/meals/vote_for_meals` |
| **File** | `src/app/dashboard/student/meals/vote_for_meals/page.tsx` |
| **Access** | Student |
| **Purpose** | Rate today's meals (1-5 stars) |

**Key Features:**
- Displays today's menu items per meal
- Star rating component (1-5)
- Optional comment textarea
- Submit button per meal type
- "Already submitted" state handling

---

#### Weekly Menu
| Property | Value |
|----------|-------|
| **Route** | `/dashboard/student/meals/weekly_menu` |
| **File** | `src/app/dashboard/student/meals/weekly_menu/page.tsx` |
| **Access** | Student |
| **Purpose** | View weekly meal schedule (read-only) |

**Key Features:**
- 7-day menu table
- Breakfast, lunch, dinner columns
- Current day highlighting
- Day-based row styling

---

### Billing

#### Billing Layout
| Property | Value |
|----------|-------|
| **Route** | `/dashboard/student/billing/*` |
| **File** | `src/app/dashboard/student/billing/layout.tsx` |
| **Access** | Student |
| **Purpose** | Tab navigation for billing features |

**Tabs:**
- Current Dues, Invoices

---

#### Current Dues
| Property | Value |
|----------|-------|
| **Route** | `/dashboard/student/billing/current_dues` |
| **File** | `src/app/dashboard/student/billing/current_dues/page.tsx` |
| **Access** | Student |
| **Purpose** | View current bill breakdown and make payment |

**Key Features:**
- Bill breakdown cards:
  - Seat Rent
  - Mess Bill (expandable meal breakdown)
  - Laundry Charges
  - Other Charges
- Overdue warning banner (if applicable)
- Total amount with due date
- Pay Now button (triggers `PayNow` component)
- Download invoice as PDF option

---

#### Invoices
| Property | Value |
|----------|-------|
| **Route** | `/dashboard/student/billing/invoices` |
| **File** | `src/app/dashboard/student/billing/invoices/page.tsx` |
| **Access** | Student |
| **Purpose** | View payment history and download invoices |

**Key Features:**
- Invoice list table:
  - Month, Amount, Status, Payment Method
- Download PDF button per invoice
- View details dialog (`StudentInvoice` component)
- Paid/Pending status badges

---

### Gate Pass
| Property | Value |
|----------|-------|
| **Route** | `/dashboard/student/gate-pass` |
| **File** | `src/app/dashboard/student/gate-pass/page.tsx` |
| **Access** | Student |
| **Purpose** | Request gate pass for leaving hall premises |

**Key Features:**
- Request form:
  - Purpose/reason input
  - Destination field
  - Departure date/time pickers
  - Expected return date/time pickers
  - Emergency contact number
- Pending requests list
- Request status tracking
- Cancel request option (if pending)

---

### Laundry
| Property | Value |
|----------|-------|
| **Route** | `/dashboard/student/laundry` |
| **File** | `src/app/dashboard/student/laundry/page.tsx` |
| **Access** | Student |
| **Purpose** | Submit laundry requests and track status |

**Key Features:**
- New request form:
  - Item type selection (shirts, pants, etc.)
  - Quantity per item type
  - Special instructions textarea
- Active requests tracking:
  - Status progression display
  - Estimated completion date
- Request history table

---

### Maintenance (Student)

#### Maintenance Layout
| Property | Value |
|----------|-------|
| **Route** | `/dashboard/student/maintenance/*` |
| **File** | `src/app/dashboard/student/maintenance/layout.tsx` |
| **Access** | Student |
| **Purpose** | Tab navigation for maintenance features |

**Tabs:**
- New Request, My Requests, FAQ

---

#### New Request
| Property | Value |
|----------|-------|
| **Route** | `/dashboard/student/maintenance/new_request` |
| **File** | `src/app/dashboard/student/maintenance/new_request/page.tsx` |
| **Access** | Student |
| **Purpose** | Submit new maintenance request |

**Key Features:**
- Category selection:
  - ⚡ Electrical
  - 🔧 Plumbing
  - 🪑 Furniture
  - ❄️ AC/Heating
  - 🚪 Doors & Windows
  - 🌐 Internet/Wi-Fi
  - 📋 Other
- Priority selection:
  - 🔴 Urgent (24 hours)
  - 🟠 High (2-3 days)
  - 🟡 Normal (1 week)
  - 🟢 Low (flexible)
- Location input
- Description textarea
- Optional contact number
- Success confirmation with redirect

---

#### My Requests
| Property | Value |
|----------|-------|
| **Route** | `/dashboard/student/maintenance/my_requests` |
| **File** | `src/app/dashboard/student/maintenance/my_requests/page.tsx` |
| **Access** | Student |
| **Purpose** | Track submitted maintenance requests |

**Key Features:**
- Grouped by status:
  - In Progress (with assigned technician info)
  - Pending (with submission date)
  - Completed (with completion date)
- Request cards showing:
  - Request ID
  - Category icon
  - Location
  - Description
  - Status badge
- Rate Service button for completed requests

---

#### FAQ
| Property | Value |
|----------|-------|
| **Route** | `/dashboard/student/maintenance/faq` |
| **File** | `src/app/dashboard/student/maintenance/faq/page.tsx` |
| **Access** | Student |
| **Purpose** | Frequently asked questions about maintenance |

**Key Features:**
- Common questions about:
  - Resolution time expectations
  - Request tracking
  - Emergency procedures
  - Time slot preferences
  - Service feedback
- Emergency contact number display
- 24/7 service availability notice

---

### Profile (Student)
| Property | Value |
|----------|-------|
| **Route** | `/dashboard/student/profile` |
| **File** | `src/app/dashboard/student/profile/page.tsx` |
| **Access** | Student |
| **Purpose** | View and edit student profile |

**Key Features:**
- Uses shared `ProfilePage` component
- Display student-specific fields:
  - Student ID
  - Department
  - Year/Batch
  - Room number
  - Blood group
  - Emergency contact
- Edit mode for name and phone

---

## Reusable Components

### Layout Components

#### Sidebar
| File | `src/components/layout/sidebar.tsx` |
|------|-------------------------------------|
| **Purpose** | Main navigation sidebar with logo, nav items, and logout button |
| **Props** | `navItems: NavItem[]`, `title?: string` |
| **Features** | Active route highlighting, responsive design, gradient background |

---

#### TopNavigation
| File | `src/components/common/top_navigation.tsx` |
|------|---------------------------------------------|
| **Purpose** | Horizontal tab navigation for sub-pages |
| **Props** | `navItems: { name: string, path: string }[]` |
| **Features** | Active tab styling, router navigation, pill-style buttons |

---

### Auth & Security Components

#### StaffRoleGuard
| File | `src/components/staff/role-guard.tsx` |
|------|---------------------------------------|
| **Purpose** | Protect staff pages based on assigned role |
| **Props** | `allowedRoles: StaffRole[]`, `children: ReactNode` |
| **Features** | Role validation, redirect to home if unauthorized, loading state |

---

### Profile Components

#### ProfilePage
| File | `src/components/common/profile_page.tsx` |
|------|------------------------------------------|
| **Purpose** | Shared profile viewing and editing component |
| **Props** | `initialData: ProfileData`, `onSave?: (data) => Promise<boolean>` |
| **Features** | Avatar display, role badge, edit mode toggle, field validation |
| **Roles Supported** | Admin, Staff, Student (with role-specific fields) |

---

### Student Components

#### TomorrowMeals
| File | `src/components/student/tomorrow_meals.tsx` |
|------|---------------------------------------------|
| **Purpose** | Tomorrow's meal selection widget with toggles |
| **Features** | Breakfast/lunch/dinner toggles, save functionality, loading states |
| **API** | `GET/PUT /api/student/meals/meal-selection/tomorrow-meal` |

---

#### GuestMeal
| File | `src/components/student/guest_meal.tsx` |
|------|----------------------------------------|
| **Purpose** | Guest meal registration form |
| **Features** | Guest info inputs, department selector, meal checkboxes |
| **API** | `PUT /api/student/meals/meal-selection/guest-meal` |

---

#### VoteForMeal
| File | `src/components/student/vote_for_meal.tsx` |
|------|-------------------------------------------|
| **Purpose** | Meal rating card with star rating |
| **Props** | `mealinfo: { mealTime, menuItems, isSubmitted }`, `onSubmit: Function` |
| **Features** | 1-5 star rating, optional comments, submit button |
| **API** | `POST /api/student/meals/vote-for-meals` |

---

#### PayNow
| File | `src/components/student/pay_now.tsx` |
|------|--------------------------------------|
| **Purpose** | Payment dialog with card/mobile banking options |
| **Props** | `amount: number`, `dueDate: string` |
| **Payment Methods** | Card (Visa, MasterCard, Amex), Mobile (bKash, Nagad, Rocket) |

---

#### StudentInvoice
| File | `src/components/student/invoice.tsx` |
|------|--------------------------------------|
| **Purpose** | Invoice detail dialog with bill breakdown |
| **Props** | `invoiceinfo: Invoice` |
| **Features** | Invoice ID, bill breakdown, payment method, total display |

---

### UI Components

| Component | File | Purpose |
|-----------|------|---------|
| Button | `src/components/ui/button.tsx` | Styled button with variants |
| Input | `src/components/ui/input.tsx` | Text input field |
| Textarea | `src/components/ui/textarea.tsx` | Multi-line text input |
| Select | `src/components/ui/select.tsx` | Dropdown select component |
| Dialog | `src/components/ui/dialog.tsx` | Modal dialog component |
| Table | `src/components/ui/table.tsx` | Data table component |
| Tabs | `src/components/ui/tabs.tsx` | Tab navigation component |
| Card | `src/components/ui/card.tsx` | Card container component |
| Badge | `src/components/ui/badge.tsx` | Status badge component |
| Spinner | `src/components/ui/spinner.tsx` | Loading spinner |
| Rating | `src/components/ui/rating.tsx` | Star rating component |
| Calendar | `src/components/ui/calendar.tsx` | Date picker calendar |
| Checkbox | `src/components/ui/checkbox.tsx` | Checkbox input |
| Label | `src/components/ui/label.tsx` | Form label component |

---

## API Endpoints Summary

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Student registration
- `POST /api/auth/forgot-password` - Password reset flow
- `POST /api/auth/change-password` - Force password change
- `GET /api/auth/me` - Get current user
- `PATCH /api/auth/me` - Update profile

### Admin
- `GET/POST/PATCH/DELETE /api/admin/users` - User management
- `GET/POST/PATCH /api/admin/rooms` - Room management
- `GET /api/admin/stats` - Dashboard statistics
- `GET/PATCH /api/admin/settings` - System settings

### Common
- `GET/POST /api/common/maintenance` - Maintenance requests
- `GET/POST /api/common/gate-pass` - Gate pass requests

### Student
- `GET/PUT /api/student/meals/meal-selection/tomorrow-meal` - Tomorrow's meal selection
- `PUT /api/student/meals/meal-selection/guest-meal` - Guest meal registration
- `POST /api/student/meals/vote-for-meals` - Meal rating
- `GET /api/student/billing/current-dues` - Current dues
- `GET /api/student/billing/invoices` - Invoice list

### Staff
- `GET /api/staff/mess/meal-count` - Tomorrow's meal counts
- `GET/PUT /api/staff/mess/weekly-menu` - Weekly menu management
- `GET /api/staff/mess/voting-result` - Meal ratings
- `GET/PATCH /api/staff/maintenance` - Maintenance tasks
- `GET/PATCH /api/staff/laundry` - Laundry requests
- `GET/POST /api/staff/expenses` - Expense management
- `GET/POST /api/staff/security/gate-pass` - Gate pass verification

---

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| Primary Color | `#2D6A4F` | Buttons, active states, accents |
| Primary Hover | `#245a42` | Button hover states |
| Success | `green-100/600/700` | Success messages, completed status |
| Warning | `yellow-100/600/700` | Pending status, warnings |
| Error | `red-100/600/700` | Error messages, urgent items |
| Info | `blue-100/600/700` | In-progress status, info badges |

---

*Documentation generated for HallBridge v1.0*
