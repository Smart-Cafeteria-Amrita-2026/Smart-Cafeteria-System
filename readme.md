<div align="center">

# 🍽️ L5 — Smart Cafeteria Demand Forecasting & Token-Based Queue Optimization System

**An intelligent campus dining management platform that integrates meal slot pre-booking, demand forecasting, digital token queues, and real-time occupancy monitoring.**

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=next.js&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-635BFF?style=for-the-badge&logo=stripe&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

</div>

---

## 📖 Overview

The **L5 — Smart Cafeteria Demand Forecasting and Token-Based Queue Optimization System** is an intelligent management platform designed for campus dining. Moving beyond basic food ordering interfaces, the system integrates a **meal slot pre-booking mechanism** that manages crowd levels and reduces long wait times for students. By utilizing **advanced forecasting** that considers variables such as historical demand, academic schedules, and even weather patterns, the platform assists kitchen staff in accurate food preparation to significantly minimize waste.

The system features a **digital token-based queue** to ensure serving fairness and **real-time occupancy dashboards** for live monitoring of cafeteria congestion. Core to its design are ethical and sustainability principles, focusing on transparent resource allocation and the reduction of unnecessary food discard. Ultimately, this project seeks to balance resource utilization with an enhanced student experience, fostering a more equitable and environmentally responsible cafeteria environment.

---

## 🏗️ System Architecture

<div align="center">

![System Architecture](design/architecture_sc.png)

</div>

---

## 👥 Stakeholders

| Stakeholder | Description |
|---|---|
| **Users** (Students & Teaching Faculty/Professors) | The main users who register using college details, book meal slots, receive digital tokens, and provide feedback on food quality. |
| **Cooking / Canteen Staff** | Operational users responsible for managing ingredient inventory, and recording leftover food to measure waste. |
| **Admin** | System controllers who manage user roles, configure menu items and slot capacities, and handle failed payment transactions. |

---

## ✨ Key Features

### For Students & Faculty

| Feature | Description |
|---|---|
| **Authentication & OTP Verification** | Secure registration/login with email OTP verification and cookie-based JWT session management |
| **Meal Slot Browsing & Recommendations** | Browse available slots by date and meal type with AI-powered slot recommendations based on group size |
| **Menu Exploration** | Search, filter by category (breakfast/lunch/dinner/snacks/beverages), and vegetarian toggle |
| **Individual & Group Bookings** | Book meals for yourself or a group of up to 6 members with dine-in or take-away options |
| **Shopping Cart** | Full cart management with add/remove/increment/decrement and group item tracking |
| **Multiple Payment Methods** | Pay via personal wallet, Stripe, or shared group bill splitting |
| **Personal Wallet** | Top-up wallet via Stripe Embedded Checkout; view balance and transaction history |
| **Digital Token & Live Queue** | Receive a digital token after booking and track your queue position in real-time via SSE |
| **Booking Management** | View, update, or cancel active bookings with full history |
| **Transaction History** | Complete history of payments, wallet recharges, and contributions |
| **Profile Management** | Update name, mobile number, and department details |

### For Canteen Staff

| Feature | Description |
|---|---|
| **Staff Dashboard** | Central hub for managing slots, counters, tokens, and operations |
| **Slot & Counter Management** | Create meal slots, activate batches of tokens, and manage service counters (open/close/reopen) |
| **Token Queue Operations** | Call next token, mark tokens as served, and handle counter reassignment on closure |
| **No-Show Processing** | Detect and process no-shows for a slot; reallocate unused food to walk-in inventory |
| **Walk-In Meal Assignment** | Assign surplus meals to walk-in users with cash or e-booking payment |
| **Leftover Food Management** | Detect leftover food from completed slots and transfer to future slots to reduce waste |
| **Demand Forecasting** | Generate demand predictions considering date, expected crowd, and weather conditions |
| **Inventory Management** | Full ingredient CRUD with stock alerts, restocking, consumption tracking, and adjustment operations |
| **Reporting** | No-show frequency reports, unused slot capacity reports, and food waste / unused meals reports |

### For Admins

| Feature | Description |
|---|---|
| **All Staff Capabilities** | Full access to every staff feature |
| **Payment Window Extension** | Extend payment deadlines for specific bookings (5–60 minutes) |
| **Auto-Cancellation Trigger** | Process expired payment windows to cancel bookings and release capacity |
| **System-Wide Reports** | Comprehensive report generation across all slots and date ranges |

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|---|---|
| **Next.js 16** | React framework with App Router for server/client rendering |
| **React 19** | UI library |
| **TypeScript** | Type-safe development |
| **TailwindCSS 4** | Utility-first CSS framework |
| **Zustand** | Client-side state management with localStorage persistence |
| **TanStack React Query** | Server-state management and caching |
| **React Hook Form + Zod** | Form handling with schema-based validation |
| **Stripe.js & React Stripe** | Embedded checkout and payment processing |
| **Axios + axios-retry** | HTTP client with automatic retry |
| **GSAP** | Animations |
| **Lucide React & React Icons** | Icon libraries |
| **Sonner & React Hot Toast** | Notification toasts |

### Backend

| Technology | Purpose |
|---|---|
| **Express 5** | HTTP server framework |
| **TypeScript** | Type-safe development |
| **Supabase** | Authentication (JWT) + PostgreSQL database |
| **Stripe** | Payment Intents & Checkout Sessions |
| **Zod** | Request validation schemas |
| **Cookie-Parser** | HTTP-only cookie-based auth tokens |
| **CORS** | Cross-origin resource sharing |
| **SSE (Server-Sent Events)** | Real-time queue position streaming |

### DevOps & Tooling

| Technology | Purpose |
|---|---|
| **pnpm Workspaces** | Monorepo package management |
| **Biome** | Linting and formatting (replaces ESLint + Prettier) |
| **Husky** | Git hooks |
| **lint-staged** | Pre-commit linting on staged files |
| **Nodemon + tsx** | Hot-reload development server |
| **Rimraf** | Clean builds |

---

## 📁 Project Structure

```
Smart-Cafeteria-System/
├── biome.json                    # Shared Biome linter/formatter config
├── package.json                  # Root workspace config
├── pnpm-workspace.yaml           # pnpm monorepo workspace definition
├── readme.md
│
├── backend/                      # Express API Server
│   ├── src/
│   │   ├── index.ts              # App entry point & route registration
│   │   ├── config/
│   │   │   └── supabase.ts       # Supabase client instances (auth, service, public)
│   │   ├── controllers/          # Request handlers
│   │   │   ├── authController.ts
│   │   │   ├── bookingController.ts
│   │   │   ├── mealSlotController.ts
│   │   │   ├── otpController.ts
│   │   │   ├── paymentController.ts
│   │   │   ├── queueSSE.controller.ts
│   │   │   └── tokenController.ts
│   │   ├── services/             # Business logic layer
│   │   │   ├── authService.ts
│   │   │   ├── bookingService.ts
│   │   │   ├── mealSlotService.ts
│   │   │   ├── otpService.ts
│   │   │   ├── paymentService.ts
│   │   │   └── tokenService.ts
│   │   ├── routes/               # Express route definitions
│   │   ├── interfaces/           # TypeScript type definitions
│   │   ├── middlewares/          # Auth middleware (JWT verification & refresh)
│   │   ├── validations/          # Zod validation schemas
│   │   ├── utils/                # Utility functions
│   │   └── types/                # Express type augmentations
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                     # Next.js Web Application
│   ├── src/
│   │   ├── app/                  # Next.js App Router pages
│   │   │   ├── (auth)/           # Auth pages (login, register, OTP, password reset)
│   │   │   ├── slots/            # Meal slot browsing
│   │   │   ├── menu/             # Menu exploration
│   │   │   ├── cart/             # Shopping cart
│   │   │   ├── checkout/         # Checkout flow
│   │   │   ├── bookings/         # Booking creation
│   │   │   ├── my-bookings/      # User's booking history
│   │   │   ├── payment/          # Payment processing
│   │   │   ├── wallet/           # Wallet top-up
│   │   │   ├── transaction-history/
│   │   │   ├── profile/          # User profile
│   │   │   └── staff/            # Staff dashboard, forecast, inventory, slots
│   │   ├── components/           # Reusable UI components
│   │   │   ├── StaffDashboard/   # Staff operations panel
│   │   │   ├── ForecastPanel/    # Demand forecasting UI
│   │   │   ├── TokenQueue/       # Queue visualization
│   │   │   ├── CreateSlotModal/  # Slot creation modal
│   │   │   ├── wallet/           # Wallet components
│   │   │   ├── payment/          # Payment components
│   │   │   ├── cart/             # Cart components
│   │   │   ├── landing/          # Landing page sections
│   │   │   └── ui/               # Shared base UI components
│   │   ├── services/             # API client services
│   │   ├── stores/               # Zustand state stores
│   │   ├── hooks/                # Custom React hooks
│   │   ├── types/                # TypeScript type definitions
│   │   ├── validations/          # Client-side Zod schemas
│   │   └── utils/                # Utility functions
│   ├── package.json
│   └── tsconfig.json
│
├── design/                       # Architecture diagrams
│   └── architecture_sc.png
│
└── smart-cafeteria-management/   # Postman API Collections
    └── PAYMENT_ROUTES/
        ├── Bill_Settlement_Routes.postman_collection.json
        ├── Stripe_Payment_Routes.postman_collection.json
        ├── Personal_Wallet_Routes.postman_collection.json
        ├── Wallet_Contribution_Routes.postman_collection.json
        ├── NoShow_WalkIn_Routes.postman_collection.json
        ├── Leftover_AutoCancellation_Routes.postman_collection.json
        └── Reports_Routes.postman_collection.json
```

---

## 🔗 API Endpoints

### Authentication (`/api/auth`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/register` | No | Register a new user |
| `POST` | `/signIn` | No | Sign in (sets HTTP-only cookies) |
| `POST` | `/signOut` | Yes | Sign out and clear session |
| `POST` | `/forgot-password` | No | Send password reset email |
| `POST` | `/reset-password` | No | Reset password with token |
| `GET` | `/profile` | Yes | Get authenticated user profile |
| `PUT` | `/profile` | Yes | Update user profile |
| `GET` | `/user/:userId` | Yes | Get user details by ID |

### OTP Verification (`/api/otp`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/generate` | No | Generate OTP for email |
| `POST` | `/verify` | No | Verify OTP code |
| `POST` | `/resend` | No | Resend OTP |

### Bookings (`/api/bookings`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/slots` | No | Get available meal slots |
| `GET` | `/slots/recommendations` | No | AI slot recommendations |
| `GET` | `/slots/:slotId/menu` | No | Get menu for a slot |
| `GET` | `/slots/:slotId` | No | Get slot details |
| `GET` | `/demand-analysis` | No | Demand analysis by date |
| `POST` | `/menu/search` | No | Search menu items |
| `GET` | `/users/search` | Yes | Search users for group booking |
| `GET` | `/my-bookings` | Yes | User's bookings |
| `GET` | `/payments` | Yes | Booking payment history |
| `POST` | `/` | Yes | Create a new booking |
| `GET` | `/:bookingId` | Yes | Get booking details |
| `PUT` | `/:bookingId` | Yes | Update booking |
| `DELETE` | `/:bookingId` | Yes | Cancel booking |

### Tokens & Queue (`/api/tokens`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/generate` | Yes | Generate a digital token |
| `GET` | `/my-tokens` | Yes | Get user's tokens |
| `GET` | `/:tokenId` | Yes | Get token details |
| `GET` | `/booking/:bookingReference` | Yes | Get token by booking ref |
| `POST` | `/:tokenId/activate` | Yes | Activate token |
| `GET` | `/queue/status` | No | Overall queue status |
| `GET` | `/queue/live` | No | **SSE** — Real-time queue updates |
| `GET` | `/counters` | No | All service counters |
| `POST` | `/meal-slot/:slotId/activate` | Staff | Batch-activate tokens |
| `POST` | `/counters/:counterId/call-next` | Staff | Call next token |
| `POST` | `/:tokenId/mark-served` | Staff | Mark as served |
| `POST` | `/counters/:counterId/close` | Staff | Close counter |
| `POST` | `/counters/:counterId/reopen` | Staff | Reopen counter |

### Payments (`/api/payments`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/window/:bookingId` | Yes | Payment window status |
| `POST` | `/window/:bookingId/extend` | Admin | Extend payment window |
| `POST` | `/wallet/contribute` | Yes | Contribute to group booking wallet |
| `GET` | `/wallet/:bookingId/contributions` | Yes | View contributions |
| `POST` | `/settle/:bookingId` | Yes | Settle bill from wallet |
| `POST` | `/stripe/create-intent` | Yes | Create Stripe Payment Intent |
| `POST` | `/stripe/confirm` | Yes | Confirm Stripe payment |
| `POST` | `/stripe/webhook` | No | Stripe webhook handler |
| `POST` | `/personal-wallet/create-session` | Yes | Create wallet top-up session |
| `GET` | `/personal-wallet/balance` | Yes | Get wallet balance |
| `GET` | `/personal-wallet/session-status/:sessionId` | Yes | Check session status |
| `POST` | `/personal-wallet/confirm-recharge` | Yes | Confirm wallet recharge |
| `GET` | `/personal-wallet/transactions` | Yes | Wallet transaction history |
| `POST` | `/no-show/process/:slotId` | Staff | Process no-shows |
| `GET` | `/walk-in/available` | No | Available walk-in meals |
| `POST` | `/walk-in/assign` | Staff | Assign walk-in meals |
| `GET` | `/leftover/:slotId` | Staff | Detect leftover food |
| `POST` | `/leftover/transfer` | Staff | Transfer leftover food |
| `GET` | `/reports/no-show` | Staff | No-show report |
| `GET` | `/reports/unused-slots` | Staff | Unused slots report |
| `GET` | `/reports/unused-meals` | Staff | Food waste report |
| `POST` | `/process-expired` | Admin | Auto-cancel expired bookings |

### Meal Slots (`/api/meal-slots`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/` | Yes | Create a new meal slot |
| `POST` | `/menu-mapping` | Yes | Map menu items to a slot |
| `GET` | `/menu-items` | No | Get all menu items |

---

## ⚙️ Getting Started

### Prerequisites

- **Node.js** >= 18
- **pnpm** >= 10
- **Supabase** project (with PostgreSQL database configured)
- **Stripe** account (for payment processing)

### 1. Clone the Repository

```bash
git clone https://github.com/<your-username>/Smart-Cafeteria-System.git
cd Smart-Cafeteria-System
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Setup

#### Backend (`backend/.env`)

```env
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Supabase
SUPABASE_URL=your_supabase_project_url
SUPABASE_KEY_ANON=your_supabase_anon_key
SUPABASE_SERVICE_ROLE=your_supabase_service_role_key

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

#### Frontend (`frontend/.env`)

```env
NEXT_PUBLIC_BACKEND_URL=http://localhost:3001
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

### 4. Run Development Servers

```bash
# Start the backend (from root)
cd backend
pnpm dev

# Start the frontend (from root, in a new terminal)
cd frontend
pnpm dev
```

The frontend will be available at `http://localhost:3000` and the backend API at `http://localhost:3001`.

---

## 📜 Available Scripts

### Root (Monorepo)

| Script | Description |
|---|---|
| `pnpm build` | Build both frontend and backend |
| `pnpm lint` | Lint both frontend and backend |
| `pnpm pre-commit` | Run pre-commit hooks for both packages |

### Backend

| Script | Description |
|---|---|
| `pnpm dev` | Start development server with hot-reload |
| `pnpm build` | Compile TypeScript to `dist/` |
| `pnpm start` | Run compiled production server |
| `pnpm lint` | Run Biome linter |
| `pnpm check` | Run Biome linter + formatter check |
| `pnpm fix` | Auto-fix linting and formatting |
| `pnpm type-check` | TypeScript type checking |

### Frontend

| Script | Description |
|---|---|
| `pnpm dev` | Start Next.js dev server (Turbopack) |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run Biome linter |
| `pnpm check` | Run Biome linter + formatter check |
| `pnpm fix` | Auto-fix linting and formatting |
| `pnpm type-check` | TypeScript type checking |

---

## 🔑 Design Principles

- **Ethical Resource Allocation** — Transparent booking and queue mechanisms to ensure fair access
- **Sustainability** — Leftover food tracking & cross-slot transfer to minimize food waste
- **Real-Time Transparency** — SSE-powered live queue updates and occupancy dashboards
- **Security** — HTTP-only cookie-based JWT auth, Zod schema validation, Supabase RLS
- **Type Safety** — End-to-end TypeScript with shared validation schemas (Zod) across frontend and backend
- **Uniform Responses** — Standard `ServiceResponse<T>` wrapper pattern (`{ success, data, error, statusCode }`)
- **Modular Architecture** — Clean separation: Controllers → Services → Database with dedicated validation layer

---

## 🧪 API Testing

Postman collections for all payment-related routes are available in the `smart-cafeteria-management/PAYMENT_ROUTES/` directory:

- **Bill Settlement Routes**
- **Stripe Payment Routes**
- **Personal Wallet Routes**
- **Wallet Contribution Routes**
- **No-Show & Walk-In Routes**
- **Leftover & Auto-Cancellation Routes**
- **Reports Routes**

Import these into Postman for quick API testing.

---

## 📄 License

This project is licensed under the **ISC License**.
