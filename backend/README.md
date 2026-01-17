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
4. **Run the server with hot-reloading:**
   ```bash
   pnpm dev
   ```



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


