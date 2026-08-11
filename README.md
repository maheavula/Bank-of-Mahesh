# Bank of Mahesh — Secure Banking Application Simulator

> **Notice**: Bank of Mahesh is a self-contained banking application simulator built for demonstration, architectural, and security evaluation purposes. It does **not** connect to real financial institutions, payment gateways, card networks, or live UPI/NEFT services. All balances and transactions are purely simulated within `runtime.json`.

---

## Executive Summary

**Bank of Mahesh** is a full-stack futuristic fintech banking simulator featuring a Spatial UI visual aesthetic, server-side HTTP-only session management, role-based authorization, atomic JSON file persistence, integer paise monetary calculations, and exactly 6 logical backend API domains.

---

## 6 Logical API Groups

The backend strictly exposes six logical API groups:

| Group | Path Prefix | Responsibilities | Key Operations |
| :--- | :--- | :--- | :--- |
| **API 1 — Authentication** | `/api/auth` | User registration, login, session termination, current user profile | `POST /signup`, `POST /login`, `POST /logout`, `GET /me` |
| **API 2 — Customer** | `/api/customer` | Customer self-profile management, account details, dashboard calculation | `GET /profile`, `PUT /profile`, `GET /account`, `GET /dashboard` |
| **API 3 — Transactions** | `/api/transactions` | Simulated transfer processing, ledger queries, transaction receipts | `GET /`, `GET /:id`, `POST /transfer` |
| **API 4 — Admin** | `/api/admin` | Systemic metrics, customer directory, account freeze/suspension controls, audit logs | `GET /dashboard`, `GET /customers`, `PATCH /customers/:id/status`, `GET /audit` |
| **API 5 — Session** | `/api/session` | Server-side session validation, remaining TTL inspection, session refresh | `GET /`, `POST /refresh` |
| **API 6 — System** | `/api/system` | Process health check, uptime, memory, simulator metadata | `GET /health`, `GET /info` |

---

## Pre-Configured Demo Credentials

On first launch, if `/data/runtime.json` does not exist or is empty, the system automatically initializes with pre-configured seed data:

### 1. System Administrator
- **Email**: `admin@bankofmahesh.local`
- **Password**: `Admin@12345`
- **Role**: `admin`
- **Access**: Full access to `/admin` operations console, customer suspension, systemic metrics.

### 2. Demo Customer
- **Email**: `customer@bankofmahesh.local`
- **Password**: `Customer@12345`
- **Role**: `customer`
- **Access**: Customer portal `/app`, starting balance ₹1,25,000.50 (`BM7089123456`).

*Tip: The login UI features one-click demo credential autofill buttons.*

---

## Architecture & Technology Stack

### Frontend
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Spatial UI design system powered by Tailwind CSS + Lucide React
- **Routing**: React Router 6 (Role-protected client routes `/app` and `/admin`)
- **State & Services**: Axios API client with HTTP credentials and Toast notification context

### Backend
- **Runtime**: Node.js + Express + TypeScript (`tsx`)
- **Security**: `bcryptjs` password hashing, server-side session store, HTTP-only cookies, SameSite cookies
- **Testing**: Vitest + Supertest integration tests
- **Persistence**: Atomic file replacement engine writing to `/data/runtime.json`

---

## Financial Accuracy & Money Handling

Floating-point arithmetic is strictly prohibited for monetary calculations. All amounts are stored and calculated internally as **integer paise** (1 INR = 100 Paise):

$$\text{Balance in Paise} = \text{Rupees} \times 100$$

Example:
- `₹1,25,000.50` $\rightarrow$ `12500050` paise.
- Conversions to formatted Indian Rupee strings (`₹1,25,000.50`) occur strictly at the UI presentation layer using `Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' })`.

---

## Data Model (`data/runtime.json`)

```json
{
  "users": [
    {
      "id": "USR-10002",
      "name": "Mahesh Kumar",
      "email": "customer@bankofmahesh.local",
      "passwordHash": "$2a$10$...",
      "role": "customer",
      "status": "active",
      "phone": "+91 9812345678",
      "createdAt": "2026-08-11T00:00:00.000Z",
      "updatedAt": "2026-08-11T00:00:00.000Z"
    }
  ],
  "accounts": [
    {
      "id": "ACC-10001",
      "userId": "USR-10002",
      "accountNumber": "BM7089123456",
      "accountType": "Savings",
      "currency": "INR",
      "balance": 12500050,
      "status": "active",
      "createdAt": "2026-08-11T00:00:00.000Z"
    }
  ],
  "transactions": [],
  "sessions": [],
  "auditLogs": [],
  "metadata": {
    "application": "Bank of Mahesh",
    "version": "1.0.0",
    "mode": "simulation",
    "lastSavedAt": "2026-08-11T00:00:00.000Z"
  }
}

Recipient Name	Account Number	Account Type	Available Balance
Priya Sharma	BM8823948210	Savings	₹85,400.00
Rahul Verma	BM3349182740	Checking	₹2,10,000.00
Mahesh Kumar	BM7089123456	Savings	₹1,25,000.50


```

---

## Quick Start & Installation

### Prerequisites
- Node.js (v18 or higher)
- npm (v9 or higher)

### 1. Install Dependencies
Run from the root directory to install root, client, and server dependencies:
```bash
npm run install:all
```

### 2. Start Development Server
Launches both Express backend (`localhost:5000`) and Vite React frontend (`localhost:5173`) concurrently:
```bash
npm run dev
```

Open your browser to: **`http://localhost:5173`**

### 3. Run Automated API Tests
Executes Vitest integration tests for Auth, Transactions, Admin controls, and Persistence safety:
```bash
npm test
```

### 4. Build Production Bundle
```bash
npm run build
```

---

## License & Disclaimer

Bank of Mahesh is an open demonstration simulator created for educational, portfolio, and security testing purposes.
