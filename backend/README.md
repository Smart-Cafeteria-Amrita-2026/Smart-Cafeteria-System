# Smart Cafeteria System — Backend
> Demand Forecasting & Token-Based Queue Optimization System

## Overview
This is the core API for the L5 Smart Cafeteria platform. The system optimizes campus dining by integrating meal slot pre-booking, demand forecasting, and real-time digital token management to reduce food waste and queue congestion.


## Tech Stack
* **Runtime:** [Node.js](https://nodejs.org/)
* **Language:** [TypeScript](https://www.typescriptlang.org/)
* **Framework:** [Express.js](https://expressjs.com/)
* **Database & Auth:** [Supabase](https://supabase.com/) (PostgreSQL + Auth + JWT)
* **Package Manager:** [pnpm](https://pnpm.io/)

## Getting Started

### Prerequisites
- Node.js (v18+)
- pnpm (`npm install -g pnpm`)

### Installation
1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd backend
   ```
2. **Install dependencies:**
   ```bash
   pnpm install
   ```
3. **Create and setup .env:**
    ```bash
    touch .env
    ```
    Add the following environment variables:
    ```env
    # Server Configuration
    PORT=3001
    NODE_ENV=development

    # Supabase Configuration
    SUPABASE_URL=your_supabase_url
    SUPABASE_KEY_ANON=your_supabase_anon_key
    SUPABASE_SERVICE_ROLE=your_supabase_service_role_key

    # Stripe Configuration (Test Mode)
    STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
    STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
    STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
    ```

4. **Stripe Test Mode Setup:**
   See the [Stripe Setup Guide](#stripe-setup-guide) section below for detailed instructions.

5. **Run the server with hot-reloading:**
   ```bash
   pnpm dev
   ```

## Stripe Setup Guide

### Getting Started with Stripe Test Mode

1. **Create a Stripe Account:**
   - Go to [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)
   - Sign up for a free account

2. **Get Your API Keys:**
   - Navigate to [Developers > API Keys](https://dashboard.stripe.com/test/apikeys)
   - Make sure you're in **Test Mode** (toggle in the dashboard)
   - Copy your **Publishable key** (starts with `pk_test_`)
   - Copy your **Secret key** (starts with `sk_test_`)

3. **Set Up Webhook (for local development):**
   - Install Stripe CLI: 
     ```bash
     # macOS
     brew install stripe/stripe-cli/stripe
     
     # Windows (using Scoop)
     scoop install stripe
     ```
   - Login to Stripe CLI:
     ```bash
     stripe login
     ```
   - Forward webhooks to your local server:
     ```bash
     stripe listen --forward-to localhost:3001/api/payments/stripe/webhook
     ```
   - Copy the webhook signing secret (starts with `whsec_`) and add it to your `.env`

4. **Test Card Numbers:**
   | Card Number | Description |
   |-------------|-------------|
   | 4242 4242 4242 4242 | Successful payment |
   | 4000 0000 0000 9995 | Declined payment |
   | 4000 0025 0000 3155 | Requires 3D Secure |
   
   Use any future expiry date and any 3-digit CVC.

### Setting Up Webhooks for Production

1. Go to [Developers > Webhooks](https://dashboard.stripe.com/test/webhooks)
2. Click "Add endpoint"
3. Enter your production URL: `https://your-domain.com/api/payments/stripe/webhook`
4. Select events to listen to:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Copy the signing secret and add it to your production environment variables



## Repository Layout

```text
backend/
├── node_modules/             # Project dependencies
├── src/
│   ├── config/               # Service configurations
│   ├── controllers/          # Request handlers
│   ├── interfaces/           # Shared TypeScript Types & Interfaces
│   ├── middlewares/          # Custom middlewares
│   ├── routes/               # API Route definitions
│   ├── services/             # Business logic & Data operations
│   ├── utilities/            # Helper functions
│   ├── validations/          # Request/Schema validations
│   └── index.ts              # App entry point & Express setup
├── .env                      # Environment variables (Git ignored)
├── nodemon.json              # Nodemon configuration
├── package.json              # Project metadata & Scripts
├── pnpm-lock.yaml            # Locked dependency versions
├── README.md                 # Project documentation
└── tsconfig.json             # TypeScript compiler settings
```

## Scripts
- `pnpm dev`: Run in watch mode with nodemon and ts-node
- `pnpm build`: Compile TypeScript to JavaScript in `dist/`
- `pnpm start`: Run compiled server from `dist/index.js`


