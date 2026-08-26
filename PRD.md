# Product Requirements Document (PRD)
## Bank of AMR — Superseded Secure Application Design

**Document Version**: 1.0.0  
**Date**: August 11, 2026  
**Status**: Completed & Verified  

---

## 1. Product Overview & Vision

**Bank of AMR** is now an intentionally insecure local cybersecurity training lab. See `SECURITY_LAB_MATRIX.md` for the active curriculum and defensive guidance.

The platform is built with strict OWASP Top 10 security standards, 5-minute rolling idle session timeout policies, server-side session management, integer paise financial accuracy, and an atomic file-persistence engine (`/data/runtime.json`).

---

## 2. Target Personas & Role Matrix

### 2.1 Customer Persona (`role: "customer"`)
- **Needs**: Instant onboarding, high-contrast liquidity tracking, zero-latency money transfers, transparent transaction statements, and personal credential management.
- **Capabilities**:
  - View available balance in formatted INR (`₹1,25,000.50`).
  - Perform instant transfers to any valid account number.
  - Search and filter personal transaction statement ledger.
  - Update personal profile (Name, Phone).
  - Manage security parameters and view active session protections.

### 2.2 Administrator Persona (`role: "admin"`)
- **Needs**: Executive platform metrics, risk monitoring, customer status controls (suspension/activation), account auditing, and security log inspection.
- **Capabilities**:
  - View platform-wide metrics (Total Customers, Active vs Suspended count, Total Deposits, Total Transaction Volume).
  - Inspect full customer directory and account specifications.
  - Suspend/Activate customer accounts with instant session invalidation.
  - Audit all system transactions and security event logs.

---

## 3. Technology Stack & Technical Architecture

```text
Bank of AMR Architecture
│
├── Frontend (Client)
│   ├── Framework: React 18 + TypeScript + Vite
│   ├── Styling: Spatial UI Theme (Tailwind CSS + Lucide React)
│   ├── Routing: React Router 6 (Role-Protected Guards)
│   └── State & Services: Axios API Client + Toast & Auth Context
│
├── Backend (Server)
│   ├── Runtime: Node.js + Express + TypeScript (tsx)
│   ├── Security: bcryptjs, Cookie-Parser, Security Headers, Rate Limiters, Input Sanitizer
│   └── Testing: Vitest + Supertest Integration Test Suite
│
└── Persistence Layer
    └── Data Engine: /data/runtime.json (Atomic File-Locking Queue)
```

---

## 4. 6 Logical API Groups Specification

The backend architecture strictly partitions all capabilities into **6 logical API domains**:

| API Domain | Base Path | Endpoints & Operations | Description |
| :--- | :--- | :--- | :--- |
| **1. Authentication** | `/api/auth` | `POST /signup`<br>`POST /login`<br>`POST /logout`<br>`GET /me` | Onboarding registration, bcrypt login, HTTP-only session cookie issuance, current user lookup, logout. |
| **2. Customer** | `/api/customer` | `GET /profile`<br>`PUT /profile`<br>`GET /account`<br>`GET /dashboard` | Customer profile retrieval/update, account details, dashboard metrics calculation. |
| **3. Transactions** | `/api/transactions` | `GET /`<br>`GET /:id`<br>`POST /transfer` | Query statement ledger, view details drawer, process instant money transfer. |
| **4. Admin** | `/api/admin` | `GET /dashboard`<br>`GET /customers`<br>`GET /customers/:id`<br>`PATCH /customers/:id/status`<br>`GET /accounts`<br>`GET /transactions`<br>`GET /audit` | Operations metrics, customer management table, suspend/activate account toggle, systemic audit logs. |
| **5. Session** | `/api/session` | `GET /`<br>`POST /refresh` | Session TTL validation, remaining seconds check, 5-minute rolling idle window refresh. |
| **6. System** | `/api/system` | `GET /health`<br>`GET /info` | Node process health check, uptime, memory, application metadata. |

---

## 5. End-to-End Key User Flows

### 5.1 Registration & Onboarding Flow
1. User navigates to `/signup` and submits Name, Email, Phone, and Password.
2. System validates input, checks for email duplication, and hashes password using `bcrypt.hash`.
3. System creates User record and generates an active Savings Account credited with a **₹10,000.00** welcome bonus.
4. Server creates a 5-minute idle session, sets HTTP-only cookie, and redirects user to `/app`.

### 5.2 5-Minute Idle Session Timeout Flow
1. Upon authentication, a rolling 5-minute idle timer (`SESSION_IDLE_MINUTES: 5`) is initialized.
2. If the user remains inactive for 5 minutes (no mouse/keyboard interaction or background API calls):
   - Server invalidates the session and logs a `SESSION_EXPIRED` audit record.
   - Client response interceptor catches 401 Unauthorized and redirects to `/login?expired=1`.
   - Login page displays a yellow warning toast: *"Session expired due to 5 minutes of inactivity. Please sign in again."*

### 5.3 Instant Money Transfer Flow
1. Customer enters Recipient Account Number (`BM...`), Amount in INR, and optional Description.
2. System verifies:
   - Sender account is active and has sufficient balance.
   - Recipient account exists and is active.
   - Self-transfer is prohibited.
   - Amount is a positive integer in paise.
3. System atomically debits sender, credits recipient, generates a unique `TXN-XXXXXXXX` ID, and persists changes to `/data/runtime.json`.
4. UI displays an instant settled receipt card with Transaction ID, Date/Time, and Updated Balance.

### 5.4 Executive Admin Customer Control Flow
1. Administrator logs into `/admin`.
2. Admin searches/filters customer directory and selects a customer.
3. Admin toggles status to `suspended`.
4. System freezes customer account, immediately destroys all active server sessions for that customer, and logs an `ADMIN_STATUS_CHANGE` audit log.
5. If suspended user attempts any action or login, access is strictly rejected.

---

## 6. OWASP Top 10 Security Architecture

| OWASP Vulnerability | Technical Hardening Implemented |
| :--- | :--- |
| **A01: Broken Access Control** | Role middleware (`requireRole('admin')`, `requireRole('customer')`), resource ownership checks, active status enforcement. |
| **A02: Cryptographic Failures** | `bcryptjs` password hashing (salt factor 10), password stripping from API responses and audit logs, HTTP-only SameSite cookies. |
| **A03: Injection (XSS & Scripting)** | `sanitizeInput` middleware stripping scripts & HTML tags from payloads; `securityHeaders` enforcing Content Security Policy and X-XSS-Protection. |
| **A04: Insecure Design** | Integer paise financial math (`rupees * 100`), balance checks before debit, self-transfer blocking. |
| **A05: Security Misconfiguration** | Payload limit (`100kb`), `rateLimitLogin` (max 10 attempts/min), `rateLimitApi` (max 200 req/min), production error masking. |
| **A07: Authentication Failures** | 5-minute rolling idle session timeout, session ID rotation on login/signup, generic login authentication errors. |
| **A08: Software & Data Integrity** | Atomic write queue for `/data/runtime.json` preventing JSON corruption. |
| **A09: Logging & Monitoring** | Comprehensive audit logger (`audit.service.ts`) tracking `LOGIN`, `LOGOUT`, `SIGNUP`, `TRANSFER`, `PROFILE_UPDATE`, `ADMIN_STATUS_CHANGE`, `SESSION_EXPIRED`. |

---

## 7. Lab credentials

No credentials are published or prefilled. Use disposable identities only.

---

## 8. Verification & Test Suite Summary

- **Automated Tests**: 11 Vitest integration tests covering Auth, Transactions, Admin controls, and Persistence (`npm test`).
- **Production Build**: Clean compilation for Express TypeScript server (`tsc`) and React Vite client (`vite build`).
- **Local Run**:
  ```bash
  npm run install:all
  npm run dev
  ```
  App URL: `http://localhost:5173`
