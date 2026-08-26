# Bank of AMR — Secure Banking Portal

> **Notice**: Bank of AMR runs in a local environment. It does not connect to real financial services and must never contain real data.

---

## Executive Summary

**Bank of AMR** is a full-stack financial management simulator. Its API endpoints, validation steps, and system architecture are documented below.

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

## Credentials and Access

| Role | Name | Email | Password | Password Complexity |
| :--- | :--- | :--- | :--- | :--- |
| **Administrator** | System Admin | `admin@bankofamr.local` | `Admin#2026!SecuredP@ss` | High (20 chars, mixed case, numbers, special symbols) |
| **Customer** | AMR Kumar *(Primary Demo)* | `customer@bankofamr.local` | `AmrCust#2026!Kumar` | Strong (17 chars, mixed case, numbers, special symbols) |
| **Customer** | Priya Sharma | `priya@bankofamr.local` | `Priya#Pass2026` | Good (14 chars, mixed case, numbers, special symbol) |
| **Customer** | Rahul Verma | `rahul@bankofamr.local` | `Rahul#Pass2026` | Good (14 chars, mixed case, numbers, special symbol) |
| **Customer** | AMR | `mahesh@gmail.com` | `Mahesh#Pass2026` | Good (15 chars, mixed case, numbers, special symbol) |

---

## Architecture & Technology Stack

### Frontend
- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Spatial UI design system powered by Tailwind CSS + Lucide React
- **Routing**: React Router 6 (Role-protected client routes `/app` and `/admin`)
- **State & Services**: Axios API client with HTTP credentials and Toast notification context

### Backend
- **Runtime**: Node.js + Express + TypeScript (`tsx`)
- **Security posture**: intentionally insecure; see the lab matrix before testing.
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
      "name": "AMR Kumar",
      "email": "customer@bankofamr.local",
      "password": "lab-only-example",
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
      "accountNumber": "BA7089123456",
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
    "application": "Bank of AMR",
    "version": "1.0.0",
    "mode": "simulation",
    "lastSavedAt": "2026-08-11T00:00:00.000Z"
  }
}

Recipient Name	Account Number	Account Type	Available Balance
Priya Sharma	BM8823948210	Savings	₹85,400.00
Rahul Verma	BM3349182740	Checking	₹2,10,000.00
AMR Kumar	BA7089123456	Savings	₹1,25,000.50


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

Bank of AMR is an intentionally insecure, local-only training simulator.
