# HallBridge - Digital Hall Management System

A streamlined web application that digitizes university residential hall operations with a "One-Tap" philosophy. The system eliminates paper-based processes while focusing on three pillars: **Flexible Dining** (zero food waste), **Student Safety** (simple movement tracking), and **Hassle-free Administration** (automation-first design).

## 🚀 Quick Start

```bash
# Install dependencies
pnpm install

# Run development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
hallbridge/
├── public/                  # Static assets
│   ├── icons/              # Icon files
│   └── images/             # Image files
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── api/            # API routes (backend)
│   │   │   ├── billing/
│   │   │   ├── gate-pass/
│   │   │   ├── laundry/
│   │   │   ├── maintenance/
│   │   │   └── meals/
│   │   ├── auth/           # Authentication pages
│   │   │   ├── login/
│   │   │   └── register/
│   │   └── dashboard/      # Dashboard pages
│   │       ├── staff/      # Staff dashboard
│   │       └── student/    # Student dashboard
│   ├── components/         # React components
│   │   ├── features/       # Feature-specific components
│   │   │   ├── auth/
│   │   │   ├── staff/
│   │   │   └── student/
│   │   ├── layout/         # Layout components
│   │   └── ui/             # Reusable UI components
│   ├── constants/          # Application constants
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   ├── styles/             # Global styles
│   └── types/              # TypeScript type definitions
├── .gitignore
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── README.md
└── tsconfig.json
```

## 🛠️ Tech Stack

- **Framework**: Next.js 16 (App Router + API Routes)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: MUI Material
- **Package Manager**: pnpm

## 🎯 Core Features

### For Students
- 🍽️ **Meal Toggle**: ON/OFF switch for next day's meals
- 🚪 **Gate Pass**: Digital movement tracking
- 💰 **Billing**: View and pay hostel dues
- 🔧 **Maintenance**: Submit repair requests
- 🧺 **Laundry**: Schedule pickups and track status

### For Staff
- 📊 **Meal Count**: Real-time count of meals for next day
- 📋 **Weekly Menu**: Manage dining menus
- 🗳️ **Voting Results**: View meal voting outcomes
- 🔧 **Maintenance**: Track and update repair requests
- 🧺 **Laundry**: Manage laundry workflow

### For Admin
- 👥 **Student Management**: Approve registrations
- 🏠 **Room Allocation**: Manage room assignments
- 📈 **Reports**: Financial and operational dashboards
- 🚨 **SOS Alerts**: Emergency notifications

## 👥 User Roles

1. **Hall Admin** - Provost/Office Head
2. **Operations Staff** - Mess Manager, Maintenance, Laundry
3. **Student** - End users

## 📝 Development Guidelines

### Component Organization
- Place feature-specific components in `src/components/features/`
- Place reusable UI components in `src/components/ui/`
- Place layout components in `src/components/layout/`

### API Routes
- All API routes are in `src/app/api/`
- Each module has its own folder with `route.ts`

### Styling
- Global styles in `src/styles/globals.css`
- Dashboard-specific styles in `src/styles/dashboard.css`
- Use Tailwind CSS utility classes

### Type Definitions
- All TypeScript types in `src/types/index.ts`
- Import types using `import type { TypeName } from '@/types'`

## 🔧 Environment Variables

Create a `.env.local` file in the root directory:

```env
# Database
DATABASE_URL=your_mongodb_connection_string

# Authentication
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=http://localhost:3000

# Optional: Payment Gateway
STRIPE_SECRET_KEY=your_stripe_secret_key
```

## 📄 License

This project is private and proprietary.

---

Built with ❤️ for university hall management
