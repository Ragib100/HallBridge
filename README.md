<p align="center">
  <img src="public/logos/vector/default-monochrome-white2.svg" alt="HallBridge Logo" width="300" />
</p>

<h1 align="center">HallBridge</h1>

<p align="center">
  <strong>Digital Hall Management System</strong> — A streamlined web application for university residential hall operations
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-blue?logo=react" alt="React 19" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose-green?logo=mongodb" alt="MongoDB" />
  <img src="https://img.shields.io/badge/TypeScript-5-blue?logo=typescript" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwindcss" alt="Tailwind CSS" />
</p>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Seeding](#database-seeding)
- [User Roles & Permissions](#user-roles--permissions)
- [Dashboard Pages](#dashboard-pages)
- [API Routes](#api-routes)
- [Data Models](#data-models)
- [Email Service](#email-service)
- [Project Structure](#project-structure)
- [Scripts](#scripts)

---

## Overview

HallBridge is a comprehensive hall (hostel/dormitory) management system built for university residential halls. It digitizes and streamlines operations including student registration and approval, room allocation, meal management, gate pass processing, maintenance requests, laundry services, billing, expense tracking, and security monitoring.

The platform serves three user roles — **Students**, **Staff** (with specialized sub-roles), and **Admins** — each with tailored dashboards and capabilities.

---

## Features

### Student Features
- **Meal Management** — Select daily meals (breakfast, lunch, dinner), rate meals, view the weekly menu, and book guest meals
- **Billing & Invoices** — View monthly bills (seat rent, mess bill, laundry, other charges), download PDF invoices, and track payment status
- **Gate Pass** — Request gate passes with purpose, destination, and dates; track approval status
- **Maintenance Requests** — Submit maintenance requests by category (electrical, plumbing, furniture, AC/heating, doors/windows, internet), set priority levels, and provide ratings after completion
- **Laundry Service** — Submit laundry requests with item details, track status from pickup to delivery
- **Notifications** — Real-time notifications for meals, payments, gate passes, maintenance updates, and system notices
- **Profile Management** — View and update academic info, room allocation, and personal details
- **Vote for Meals** — Rate and comment on dining hall meals

### Staff Features (Role-Based Access)
| Staff Role | Dashboard Access |
|---|---|
| **Mess Manager** | Mess management, meal counts, voting results, weekly menu management |
| **Financial Staff** | Expense tracking and management |
| **Maintenance Staff** | Maintenance request handling and assignment |
| **Laundry Manager** | Laundry request processing and status updates |
| **Security Guard** | Gate pass verification, entry/exit logging, security dashboard |

### Admin Features
- **Overview Dashboard** — Stats on students, staff, maintenance requests, pending registrations
- **User Management** — Approve/reject student registrations, manage staff accounts, set approval status
- **Room Allocation** — Create rooms (floors 1–8, configurable capacity/beds), allocate students to beds, manage room status (vacant/occupied/partial/maintenance), view room amenities
- **Maintenance Oversight** — Monitor and manage all maintenance requests
- **Financial Management** — Track collections, expenses, and generate reports
- **System Settings** — Configure system-wide preferences (meal rates, laundry rates, operational settings)

### Authentication & Security
- Email/password authentication with bcrypt hashing
- Google OAuth and Microsoft OAuth integration
- Password reset via OTP (6-digit code with 10-minute TTL, brute-force protection)
- Role-based route protection and middleware
- Student approval workflow (pending → approved/rejected)
- Force password change on first login for staff accounts

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| **Next.js 16** | React framework with App Router |
| **React 19** | UI library |
| **TypeScript 5** | Type-safe development |
| **Tailwind CSS 4** | Utility-first styling |
| **Radix UI** | Accessible headless UI primitives (Dialog, Checkbox, Select, Tabs, Label) |
| **MUI (Material UI)** | Additional UI components |
| **Recharts** | Data visualization / charts |
| **Lucide React** | Icon library |
| **Boxicons** | Additional icon set |
| **date-fns** | Date utility library |
| **jsPDF + jspdf-autotable** | PDF invoice generation |
| **react-day-picker** | Date picker component |

### Backend
| Technology | Purpose |
|---|---|
| **Next.js API Routes** | RESTful API endpoints |
| **MongoDB + Mongoose 8** | Database and ODM |
| **bcrypt / bcryptjs** | Password hashing |
| **Supabase** | File storage (profile images) |
| **Nodemailer** | Email delivery (via separate email server) |
| **sanitize-html** | HTML sanitization for email content |
| **express-rate-limit** | Rate limiting on email server |

### DevOps & Tooling
| Technology | Purpose |
|---|---|
| **pnpm** | Package manager (workspace support) |
| **ESLint** | Code linting |
| **tsx** | TypeScript execution for seed scripts |
| **dotenv** | Environment variable management |
| **tw-animate-css** | Tailwind animation utilities |

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   Client (Browser)               │
│      Next.js App Router (React 19 + TypeScript)  │
│   ┌──────────┬──────────┬──────────────────────┐ │
│   │ Student  │  Staff   │  Admin Dashboard     │ │
│   │Dashboard │Dashboard │  (User Mgmt, Rooms,  │ │
│   │          │(Role-    │   Financials,         │ │
│   │          │ Based)   │   Settings)           │ │
│   └──────────┴──────────┴──────────────────────┘ │
└────────────────────┬────────────────────────────┘
                     │ HTTP / API Calls
┌────────────────────▼────────────────────────────┐
│             Next.js API Routes                   │
│  /api/auth  /api/admin  /api/student             │
│  /api/staff /api/common /api/job                 │
└──────┬─────────────┬────────────────────────────┘
       │             │
┌──────▼──────┐ ┌────▼─────┐  ┌──────────────────┐
│  MongoDB    │ │ Supabase │  │  Email Server    │
│ (Mongoose)  │ │ Storage  │  │  (Express +      │
│             │ │ (Images) │  │   Nodemailer)    │
└─────────────┘ └──────────┘  └──────────────────┘
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (`npm install -g pnpm`)
- MongoDB instance (local or Atlas)
- Supabase project (for image storage)
- SMTP credentials (for email service)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd HallBridge

# Install dependencies
pnpm install

# Set up environment variables (see section below)
cp .env.example .env.local

# Seed the database (optional)
pnpm seed

# Start the development server
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

### Running the Email Server

```bash
# In a separate terminal
cd email-server
node email_server.js
```

---

## Environment Variables

Create a `.env.local` file in the root directory:

```env
# MongoDB
MONGODB_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<database>

# Supabase (Image Storage)
NEXT_PUBLIC_SUPABASE_URL=https://<project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<anon-key>

# Email Server
EMAIL_API_URL=http://localhost:4000/send-email
EMAIL_API_SECRET=<shared-secret>

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Demo Video URL (optional, landing page)
NEXT_PUBLIC_DEMO_VIDEO_URL=<youtube-url>
```

For the email server, create `.env.email`:

```env
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=<email>
SMTP_PASS=<password>
EMAIL_API_SECRET=<shared-secret>
```

---

## Database Seeding

Seed scripts populate the database with sample data for development and testing:

```bash
# Seed everything
pnpm seed

# Seed individual collections
pnpm seed:users           # Students, staff, admin accounts
pnpm seed:rooms           # Room configuration (floors, beds, amenities)
pnpm seed:meals           # Meal selections
pnpm seed:weekly-menu     # Weekly meal menu
pnpm seed:vote-meals      # Meal voting data
pnpm seed:guest-meals     # Guest meal bookings
pnpm seed:maintenance     # Maintenance requests
pnpm seed:payments        # Payment records
pnpm seed:expenses        # Expense records
pnpm seed:laundry         # Laundry requests
pnpm seed:gate-pass       # Gate pass records
pnpm seed:entry-exit-logs # Entry/exit security logs
pnpm seed:settings        # System settings

# Clear all data
pnpm seed:clear

# Reset database (clear + reseed)
pnpm db:reset
```

---

## User Roles & Permissions

### Role Hierarchy

```
Admin
├── Full system access
├── User management (approve/reject students, manage staff)
├── Room allocation
├── Financial oversight
└── System settings

Staff (role-based access)
├── Mess Manager       → Meal management, menu, voting results
├── Financial Staff    → Expense tracking
├── Maintenance Staff  → Maintenance request processing
├── Laundry Manager    → Laundry service management
└── Security Guard     → Gate pass verification, entry/exit logging

Student
├── Meal selection & rating
├── Billing & invoice viewing
├── Gate pass requests
├── Maintenance requests
├── Laundry requests
└── Profile management
```

### Student Approval Workflow
1. Student registers with email, name, student ID, and academic info
2. Account is created with `approvalStatus: "pending"` and `isActive: false`
3. Admin reviews and approves/rejects the registration
4. On approval: a temporary password is generated, emailed to the student, and `mustChangePassword` is set
5. Student logs in and is forced to change password on first login

---

## Dashboard Pages

### Student Dashboard (`/dashboard/student/`)
| Page | Path | Description |
|---|---|---|
| Home | `/dashboard/student/home` | Overview with quick stats and actions |
| Meals | `/dashboard/student/meals` | Daily meal selection, tomorrow's meals, guest meals, meal voting, weekly menu view |
| Billing | `/dashboard/student/billing` | Monthly bills, payment status, PDF invoice download |
| Gate Pass | `/dashboard/student/gate-pass` | Request and track gate passes |
| Maintenance | `/dashboard/student/maintenance` | Submit requests, track status, rate completed work |
| Laundry | `/dashboard/student/laundry` | Submit laundry requests, track status |
| Profile | `/dashboard/student/profile` | Personal info, academic info, room allocation |

### Staff Dashboard (`/dashboard/staff/`)
| Page | Path | Accessible By |
|---|---|---|
| Dashboard | `/dashboard/staff/home` | All staff roles (except maintenance_staff) |
| Mess Management | `/dashboard/staff/mess` | Mess Manager |
| Maintenance | `/dashboard/staff/maintenance` | Maintenance Staff |
| Laundry | `/dashboard/staff/laundry` | Laundry Manager |
| Expenses | `/dashboard/staff/expenses` | Financial Staff |
| Security | `/dashboard/staff/security` | Security Guard |
| Profile | `/dashboard/staff/profile` | All staff roles |

### Admin Dashboard (`/dashboard/admin/`)
| Page | Path | Description |
|---|---|---|
| Overview | `/dashboard/admin` | Dashboard stats, recent students, maintenance summary |
| User Management | `/dashboard/admin/users` | Student approvals, staff management |
| Room Allocation | `/dashboard/admin/rooms` | Room creation, bed assignment, status management |
| Maintenance | `/dashboard/admin/maintenance` | All maintenance requests oversight |
| Financials | `/dashboard/admin/financials` | Revenue, expenses, financial reports |
| System Settings | `/dashboard/admin/settings` | Meal rates, operational parameters |
| Profile | `/dashboard/admin/profile` | Admin account info |

### Auth Pages
| Page | Path |
|---|---|
| Landing Page | `/` |
| Login | `/auth/login` |
| Register | `/auth/register` |
| Forgot Password | `/auth/forgot-password` |
| Change Password | `/auth/change-password` |

---

## API Routes

### Authentication (`/api/auth/`)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Student registration |
| POST | `/api/auth/login` | Email/password login |
| POST | `/api/auth/logout` | Session logout |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/change-password` | Change password |
| POST | `/api/auth/forgot-password` | Request password reset OTP |
| POST | `/api/auth/verify-otp` | Verify OTP code |
| POST | `/api/auth/reset-password` | Reset password with verified OTP |
| GET/POST | `/api/auth/google` | Google OAuth flow |
| GET/POST | `/api/auth/microsoft` | Microsoft OAuth flow |

### Admin (`/api/admin/`)
| Method | Endpoint | Description |
|---|---|---|
| GET/POST | `/api/admin/users` | List / create users |
| GET | `/api/admin/stats` | Dashboard statistics |
| GET/POST | `/api/admin/staff` | Manage staff accounts |
| GET/PUT | `/api/admin/settings` | System settings CRUD |
| GET/POST | `/api/admin/rooms` | List / manage rooms |
| POST | `/api/admin/rooms/create` | Create new room |
| GET | `/api/admin/rooms/available` | Get available rooms/beds |

### Student (`/api/student/`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/student/billing` | Get student billing/invoices |
| GET/POST | `/api/student/meals/meal-selection/tomorrow-meal` | Tomorrow's meal selection |
| GET/POST | `/api/student/meals/meal-selection/guest-meal` | Guest meal booking |
| GET/POST | `/api/student/meals/vote-for-meals` | Meal voting/rating |

### Staff (`/api/staff/`)
| Method | Endpoint | Description |
|---|---|---|
| GET/POST | `/api/staff/meals` | Meal management |
| GET | `/api/staff/meals/voting-results` | Meal voting results |
| GET/POST | `/api/staff/expenses` | Expense management |
| GET | `/api/staff/financials` | Financial data |
| GET | `/api/staff/security/logs` | Entry/exit logs |

### Common (`/api/common/`)
Shared endpoints accessible by multiple roles:
| Method | Endpoint | Description |
|---|---|---|
| GET/POST | `/api/common/gate-pass` | Gate pass CRUD |
| GET/POST | `/api/common/laundry` | Laundry request CRUD |
| GET/POST/PATCH | `/api/common/maintenance` | Maintenance request CRUD |
| POST | `/api/common/maintenance/rating` | Rate completed maintenance |
| GET | `/api/common/meal-count` | Daily meal count statistics |
| GET/PATCH/DELETE | `/api/common/notifications` | Notification management |
| GET/POST | `/api/common/weekly-menu` | Weekly menu CRUD |

### Jobs (`/api/job/`)
Automated/scheduled tasks:
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/job/late-fee` | Calculate and apply late fees |
| POST | `/api/job/student-billing` | Generate monthly student bills |

### Upload (`/api/upload-image/`)
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/upload-image/profile-image` | Upload profile image to Supabase |

---

## Data Models

### User
Core user model supporting students, staff, and admins with fields for authentication, room allocation, academic info, staff roles, and approval workflow.

### Room
Multi-bed room model (1–8 floors, configurable capacity) with bed-level occupancy tracking, status management (`vacant`/`occupied`/`partial`/`maintenance`), and amenities (`AC`, `Fan`, `Attached Bath`, `Common Bath`, `Balcony`, `WiFi`). Includes aggregate statistics via static methods.

### Meal
Daily meal selection per student (breakfast/lunch/dinner booleans) with per-meal ratings. Unique constraint on student + date.

### WeeklyMeal
Weekly menu configuration with breakfast/lunch/dinner descriptions per day of the week (Saturday–Friday).

### GuestMeal
Guest meal booking linked to a student, capturing guest details (name, department, phone) and meal selections.

### VoteMeal
Meal quality voting with rating (0–5) and optional comments.

### GatePass
Full gate pass lifecycle: request → approve/reject → check-out → check-in → complete. Tracks actual times, approver, and QR codes.

### MaintenanceRequest
Categorized maintenance requests with priority levels, status workflow, staff assignment, estimated completion, and post-completion rating/feedback.

### Laundry
Laundry request with itemized tracking (shirt, pant, bedsheet, towel, other), status progression (`pending` → `collected` → `washing` → `ready` → `delivered`), and cost tracking.

### Payment
Financial transactions covering hall fees, mess fees, laundry fees, and fines. Supports multiple payment methods, late fee calculation, discounts, and billing period tracking.

### Expense
Institutional expense tracking by category (market, utilities, maintenance, salary, equipment), with vendor info, receipts, and audit trail.

### Notification
In-app notification system with types (meal, payment, gatepass, maintenance, notice, system, laundry), priority levels, read tracking, and auto-expiry after 30 days via MongoDB TTL index.

### EntryExitLog
Security entry/exit log tied to students and gate passes, with late return flagging and guard attribution.

### SystemSettings
Key-value configuration store for system-wide settings, categorized for organized retrieval.

### PasswordResetToken
OTP-based password reset with 10-minute TTL, brute-force attempt tracking, and verification status.

---

## Email Service

HallBridge uses a separate Express.js email server for sending transactional emails:

- **Approval notifications** — Sent when admin approves a student, includes temporary password
- **Rejection notifications** — Sent when admin rejects a registration
- **Password reset OTPs** — 6-digit codes for forgot password flow
- **Welcome emails** — After successful registration

The email server runs independently with:
- Rate limiting (30 requests/minute)
- HTML sanitization via `sanitize-html`
- Shared secret authentication between Next.js app and email server
- SMTP transport via Nodemailer

---

## Project Structure

```
HallBridge/
├── email-server/              # Standalone Express email service
│   ├── email_server.js
│   └── package.json
├── public/
│   ├── images/                # Landing page images
│   └── logos/                 # Brand logos (SVG)
├── scripts/                   # Database seed scripts
│   ├── seed.ts               # Master seed runner
│   ├── clear.ts              # Database cleanup
│   └── seeds/                # Individual collection seeders
├── src/
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   ├── layout.tsx         # Root layout
│   │   ├── api/               # API route handlers
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── admin/         # Admin-only endpoints
│   │   │   ├── student/       # Student endpoints
│   │   │   ├── staff/         # Staff endpoints
│   │   │   ├── common/        # Shared endpoints
│   │   │   ├── job/           # Automated task endpoints
│   │   │   └── upload-image/  # File upload endpoints
│   │   ├── auth/              # Auth pages (login, register, etc.)
│   │   ├── dashboard/
│   │   │   ├── admin/         # Admin dashboard pages
│   │   │   ├── student/       # Student dashboard pages
│   │   │   └── staff/         # Staff dashboard pages
│   │   └── unauthorized/      # 403 page
│   ├── components/
│   │   ├── common/            # Shared components (icons, navigation, logo)
│   │   ├── features/          # Feature-specific components
│   │   ├── layout/            # Layout components (sidebar, logo)
│   │   ├── staff/             # Staff-specific components
│   │   ├── student/           # Student-specific components
│   │   └── ui/                # Base UI primitives (badge, dialog, etc.)
│   ├── constants/             # App constants (rates, routes, categories)
│   ├── hooks/                 # Custom React hooks
│   │   ├── use-current-user.ts
│   │   └── use-notifications.ts
│   ├── lib/                   # Utility libraries
│   │   ├── db.ts              # MongoDB connection (pooled)
│   │   ├── dates.ts           # Date utilities (Bangladesh timezone)
│   │   ├── email.ts           # Email sending functions
│   │   ├── generate-invoice-pdf.ts  # PDF invoice generation
│   │   ├── notifications.ts   # Notification creation helpers
│   │   ├── supabase.ts        # Supabase client
│   │   └── utils.ts           # General utilities
│   ├── models/                # Mongoose schemas & models
│   ├── styles/                # Global CSS
│   └── types/                 # TypeScript type definitions
├── package.json
├── next.config.ts
├── tsconfig.json
└── tailwind / postcss config
```

---

## Scripts

| Command | Description |
|---|---|
| `pnpm dev` | Start Next.js development server |
| `pnpm build` | Build for production |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |
| `pnpm seed` | Seed all database collections |
| `pnpm seed:clear` | Clear all seeded data |
| `pnpm db:reset` | Clear and re-seed the database |
| `pnpm email-server` | Start the email server with nodemon |

---

## Currency & Locale

HallBridge is configured for **Bangladesh** (BDT / Taka):
- Meal rates: Breakfast ৳50, Lunch ৳80, Dinner ৳70
- Laundry rates: Regular ৳2/kg, Express ৳3/kg, Dry Clean ৳5/item
- Date handling uses Bangladesh timezone (`getBDDate()`)
- Week starts on Saturday (Saturday–Friday schedule)

---

## License

This project is private and proprietary.
